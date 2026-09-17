// Tokenbound behaviour via an ethers v5 / v6 Signer.
//
// Mirrors packages/sdk/src/test/TestAllViem.test.ts: the same describe blocks
// and the same `it` names, so both ecosystems are asserted to behave
// identically. Like that suite, this one is parameterized over BOTH the
// ERC-6551 deployment (V2 legacy / V3 default) and — uniquely to ethers — the
// ethers major version, so all four combinations run the same cases.
//
// Cases that exist only for ethers (version detection, ArrayLike message
// normalization) live in TestEthersVersions; V2-specific derivation and
// encoding assertions live in TestAllEthersV2. Keep the suites in step — a case
// added there needs its twin here.
//
// Runs its own anvil per variant: ethers caches pending nonces per provider, so
// sharing a fork between variants makes those views stale.

import {
	ERC_6551_DEFAULT,
	ERC_6551_LEGACY_V2,
	type TBImplementationVersion,
	TBVersion,
} from "@tokenbound/sdk"
import {
	ADDRESS_REGEX,
	ANVIL_ACCOUNTS,
	CREATE_ANVIL_OPTIONS,
	ECDSA_SIGNATURE_REGEX,
	ENS_NAME,
	isAddressMatch,
	RECIPIENT_ADDRESS,
	TX_HASH_REGEX,
	testLog,
	WETH_CONTRACT_ADDRESS,
	weth,
	zora721,
	zora1155,
} from "@tokenbound/test-fixtures"
import { createAnvil } from "@viem/anvil"
import { ethers } from "ethers"
import { JsonRpcProvider, Wallet } from "ethers6"
import {
	type Address,
	createPublicClient,
	createTestClient,
	encodeAbiParameters,
	encodeFunctionData,
	getAddress,
	type Hex,
	http,
	type PublicClient,
	parseAbiParameters,
	parseUnits,
} from "viem"
import { mainnet } from "viem/chains"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { TokenboundClient } from "../index"

const TIMEOUT = 90000

// Imported, not copied: these are the very same values the viem suite uses.
const WETH = WETH_CONTRACT_ADDRESS

type EthersTestConfig = {
	/** ethers major version under test. */
	version: 5 | 6
	/** ERC-6551 deployment under test; undefined means the V3 default. */
	tbVersion?: TBImplementationVersion
	/** Name rendered by describe.each, matching the viem suite's style. */
	testName: string
}

const ENABLED_TESTS: Array<EthersTestConfig> = [
	{ testName: "ethers@5 v2", version: 5, tbVersion: TBVersion.V2 },
	{ testName: "ethers@5 v3", version: 5 },
	{ testName: "ethers@6 v2", version: 6, tbVersion: TBVersion.V2 },
	{ testName: "ethers@6 v3", version: 6 },
]

describe.each(ENABLED_TESTS)(
	"$testName",
	({ testName, version, tbVersion }) => {
		const isV2 = tbVersion === TBVersion.V2
		const isV3 = !isV2
		// Mirrors the viem suite: V3-only cases are skipped on the V2 variants
		// rather than omitted, so the skip is visible in the report.
		const v3OnlyIt = isV3 ? it : it.skip

		const ERC6551_DEPLOYMENT = isV2 ? ERC_6551_LEGACY_V2 : ERC_6551_DEFAULT

		// V3 is the client's default deployment, so it takes no overrides. V2 has
		// to be pinned explicitly to the legacy implementation and registry.
		const DEPLOYMENT_OVERRIDES = isV3
			? {}
			: {
					implementationAddress: ERC6551_DEPLOYMENT.IMPLEMENTATION.ADDRESS,
					registryAddress: ERC6551_DEPLOYMENT.REGISTRY.ADDRESS,
				}
		// No explicit port: variants run sequentially (fileParallelism: false,
		// sequence.concurrent: false) and each afterAll stops anvil before the
		// next beforeAll starts, so they can share the default port — same as
		// the viem suite.
		const anvil = createAnvil({ ...CREATE_ANVIL_OPTIONS })
		const rpcUrl = `http://127.0.0.1:${anvil.port}`

		let publicClient: PublicClient
		let testClient: ReturnType<typeof createTestClient>
		const CUSTOM_SALT = 6551
		let signer: ReturnType<typeof makeSigner>
		let tokenboundClient: TokenboundClient
		let NFT_IN_EOA: { tokenContract: Address; tokenId: string }
		let NFT_FOR_MULTICALL_CREATE: { tokenContract: Address; tokenId: string }
		let TOKENID_IN_EOA: string
		let TOKENID_FOR_MULTICALL_CREATE: string
		let TOKENID1_IN_TBA: string
		let TOKENID2_IN_TBA: string
		let ZORA721_TBA_ADDRESS: Address

		function makeSigner() {
			if (version === 5) {
				return new ethers.Wallet(
					ANVIL_ACCOUNTS[0].privateKey,
					new ethers.providers.JsonRpcProvider(rpcUrl),
				)
			}
			return new Wallet(
				ANVIL_ACCOUNTS[0].privateKey,
				new JsonRpcProvider(rpcUrl),
			)
		}

		/**
		 * ethers caches the pending nonce per provider. Writes issued through the
		 * SDK return a bare hash, so ethers never sees them land; poll until its
		 * view matches the chain before the next send.
		 */
		async function nextNonce() {
			return await publicClient.getTransactionCount({
				address: getAddress(ANVIL_ACCOUNTS[0].address),
			})
		}

		/**
		 * Writes issued through the SDK return a bare hash, so ethers never sees
		 * them confirm and its cached pending nonce goes stale. Wait until the
		 * signer's own provider agrees with the chain before the next send.
		 */
		async function syncNonce() {
			const address = getAddress(ANVIL_ACCOUNTS[0].address)
			const provider = signer.provider
			if (!provider) return
			for (let i = 0; i < 100; i++) {
				const onChain = await publicClient.getTransactionCount({ address })
				const fromEthers = await provider.getTransactionCount(
					address,
					"pending",
				)
				if (Number(fromEthers) === Number(onChain)) return
				await new Promise((r) => setTimeout(r, 100))
			}
		}

		/**
		 * Waits for a receipt by hash. The SDK's writes return a bare hash, so this
		 * is how the suite observes them landing. (viem parity: getReceipt)
		 */
		async function getReceipt(hash: Hex, timeoutMs = 30000) {
			const deadline = Date.now() + timeoutMs
			while (Date.now() < deadline) {
				try {
					return await publicClient.getTransactionReceipt({ hash })
				} catch {
					await new Promise((r) => setTimeout(r, 200))
				}
			}
			throw new Error(`Transaction ${hash} was not mined within ${timeoutMs}ms`)
		}

		/** Mints 4 Zora 721s into the Anvil EOA and records their token IDs. */
		async function ensureMintedNFTs() {
			if (TOKENID_IN_EOA) return

			// One purchase of 4 to the EOA, ids split by role. A second purchase
			// from the same address trips the drop's per-address mint limit.
			const mint = await signer.sendTransaction({
				to: zora721.proxyContractAddress,
				value: zora721.mintPrice * BigInt(zora721.quantity),
				data: encodeFunctionData({
					abi: zora721.abi,
					functionName: "purchase",
					args: [BigInt(zora721.quantity)],
				}),
			})
			await mint.wait()
			const receipt = await getReceipt(mint.hash as Hex)

			// Read token IDs off the mint receipt. The mint is a single transaction,
			// so every Transfer log is here and this stays deterministic regardless
			// of how the node batches event notifications.
			const mintedIds = receipt.logs
				.filter(
					(l) =>
						isAddressMatch(l.address, zora721.proxyContractAddress) &&
						l.topics.length === 4 &&
						!!l.topics[3],
				)
				.map((l) => BigInt(l.topics[3] as Hex).toString())

			if (mintedIds.length < zora721.quantity) {
				throw new Error(
					`Expected ${zora721.quantity} minted token IDs, saw ${mintedIds.length}`,
				)
			}

			TOKENID_IN_EOA = mintedIds[0]
			TOKENID1_IN_TBA = mintedIds[1]
			TOKENID2_IN_TBA = mintedIds[2]
			TOKENID_FOR_MULTICALL_CREATE = mintedIds[3]

			NFT_IN_EOA = {
				tokenContract: zora721.proxyContractAddress,
				tokenId: TOKENID_IN_EOA,
			}
			NFT_FOR_MULTICALL_CREATE = {
				tokenContract: zora721.proxyContractAddress,
				tokenId: TOKENID_FOR_MULTICALL_CREATE,
			}
		}

		/** Ensures the TBA for NFT_IN_EOA exists on-chain. */
		async function ensureTBA() {
			await ensureMintedNFTs()
			if (ZORA721_TBA_ADDRESS) return

			const { account, txHash } =
				await tokenboundClient.createAccount(NFT_IN_EOA)
			await getReceipt(txHash)
			ZORA721_TBA_ADDRESS = account
			// Keep ethers' cached pending nonce in step: the SDK returns a bare
			// hash, so ethers never observes that confirmation.
			await syncNonce()
		}

		/** Moves one minted 721 from the EOA into the TBA. Idempotent per token. */
		async function transferNFTToTBA(tokenId: string) {
			const owner = await publicClient.readContract({
				address: zora721.proxyContractAddress,
				abi: zora721.abi,
				functionName: "ownerOf",
				args: [BigInt(tokenId)],
			})
			if (isAddressMatch(owner, ZORA721_TBA_ADDRESS)) return

			const tx = await signer.sendTransaction({
				to: zora721.proxyContractAddress,
				value: 0n,
				data: encodeFunctionData({
					abi: zora721.abi,
					functionName: "safeTransferFrom",
					args: [
						getAddress(ANVIL_ACCOUNTS[0].address),
						ZORA721_TBA_ADDRESS,
						BigInt(tokenId),
					],
				}),
				nonce: await nextNonce(),
			})
			await tx.wait()
			await getReceipt(tx.hash as Hex)
			return tx.hash as Hex
		}

		/** Ensures the TBA holds the two 721s that transfer tests operate on. */
		async function ensureNFTsInTBA() {
			await ensureTBA()
			await transferNFTToTBA(TOKENID1_IN_TBA)
			await transferNFTToTBA(TOKENID2_IN_TBA)
		}

		/** Ensures the TBA holds Zora 1155s for the 1155 transfer tests. */
		async function ensure1155sInTBA(
			quantity: number | bigint = zora1155.quantity,
		) {
			await ensureETHInTBA(2)
			const held = await publicClient.readContract({
				address: zora1155.proxyContractAddress,
				abi: zora1155.abi,
				functionName: "balanceOf",
				args: [ZORA721_TBA_ADDRESS, zora1155.tokenId],
			})
			if (held >= BigInt(quantity)) return

			const need = BigInt(quantity) - held
			const data = encodeFunctionData({
				abi: zora1155.abi,
				functionName: "mint",
				args: [
					zora1155.fixedPriceSalesStrategy,
					zora1155.tokenId,
					need,
					encodeAbiParameters(parseAbiParameters("address"), [
						ZORA721_TBA_ADDRESS,
					]),
				],
			})

			const execution = {
				account: ZORA721_TBA_ADDRESS,
				to: zora1155.proxyContractAddress,
				value: zora1155.mintFee * need,
				data,
			}

			const hash = isV3
				? await tokenboundClient.execute(execution)
				: await tokenboundClient.executeCall(execution)
			await getReceipt(hash)
			await syncNonce()
		}

		/**
		 * The custom-salt TBA address is deterministic, so tests that only need the
		 * address can compute it instead of depending on the create test having run.
		 */
		function customSaltTBAAddress(): Address {
			return tokenboundClient.getAccount({
				...NFT_IN_EOA,
				salt: CUSTOM_SALT,
			})
		}

		/** Ensures the TBA holds at least `amount` ETH to spend. */
		async function ensureETHInTBA(amount = 1) {
			await ensureTBA()
			const wei = parseUnits(`${amount}`, 18)
			const balance = await publicClient.getBalance({
				address: ZORA721_TBA_ADDRESS,
			})
			if (balance >= wei) return
			// Anvil-funded rather than a transfer: costs no nonce on the signer.
			await testClient.setBalance({
				address: ZORA721_TBA_ADDRESS,
				value: wei,
			})
		}

		// Spin up a fresh anvil instance each time we run the test suite against a
		// different configuration.
		beforeAll(async () => {
			try {
				await anvil.start()

				publicClient = createPublicClient({
					chain: mainnet,
					transport: http(rpcUrl),
				}) as PublicClient
				testClient = createTestClient({
					chain: mainnet,
					mode: "anvil",
					transport: http(rpcUrl),
				})

				// The fork inherits mainnet state for Anvil's well-known default
				// accounts, including an EIP-7702 delegation on ANVIL_ACCOUNTS[1].
				// That makes it look like a contract, so safeTransferFrom calls a
				// receiver hook it doesn't implement. Clear it so the ZORA721_TBA_ADDRESS behaves
				// as a plain EOA.
				await testClient.setCode({
					address: getAddress(ANVIL_ACCOUNTS[1].address),
					bytecode: "0x",
				})

				signer = makeSigner()
				tokenboundClient = new TokenboundClient({
					signer,
					chain: mainnet,
					...DEPLOYMENT_OVERRIDES,
				})

				testLog(`START → \x1b[94m ${testName} \x1b[0m`)
			} catch (err) {
				// Rethrow: a failed setup (anvil not starting, fork RPC unreachable)
				// must fail the suite here, not surface as confusing failures in
				// every downstream test.
				console.error("Error during setup:", err)
				throw err
			}
		}, TIMEOUT)

		afterAll(async () => {
			await anvil.stop()
			testLog(`END → \x1b[94m ${testName} \x1b[0m`)
		})

		describe("client", () => {
			it("can get the SDK version", () => {
				// ethers counterpart: the client reports the ethers major detected.
				expect(tokenboundClient.getEthersVersion()).toBe(version)
			})
		})

		describe("accounts", () => {
			it(
				"can mint 2 Zora 721 NFTs into Anvil wallet #0",
				async () => {
					await ensureMintedNFTs()
					const zoraBalanceInAnvilWallet = await publicClient.readContract({
						address: zora721.proxyContractAddress,
						abi: zora721.abi,
						functionName: "balanceOf",
						args: [getAddress(ANVIL_ACCOUNTS[0].address)],
					})

					expect(NFT_IN_EOA.tokenId).toBe(TOKENID_IN_EOA)
					expect(NFT_FOR_MULTICALL_CREATE.tokenId).toBe(
						TOKENID_FOR_MULTICALL_CREATE,
					)
					expect(zoraBalanceInAnvilWallet).toBe(BigInt(zora721.quantity))
					expect(
						new Set([
							TOKENID_IN_EOA,
							TOKENID1_IN_TBA,
							TOKENID2_IN_TBA,
							TOKENID_FOR_MULTICALL_CREATE,
						]).size,
					).toBe(4)
				},
				TIMEOUT,
			)

			it("can prepareCreateAccount", async () => {
				await ensureMintedNFTs()
				const prepared = await tokenboundClient.prepareCreateAccount({
					tokenContract: zora721.proxyContractAddress,
					tokenId: TOKENID_IN_EOA,
				})
				expect(prepared.to).toMatch(ADDRESS_REGEX)
				expect(prepared.data).toMatch(/^0x/)
			})

			it("can createAccount", async () => {
				await ensureTBA()
				expect(ZORA721_TBA_ADDRESS).toMatch(ADDRESS_REGEX)
				expect(
					await tokenboundClient.checkAccountDeployment({
						accountAddress: ZORA721_TBA_ADDRESS,
					}),
				).toBe(true)
			})

			it("can createAccount with a custom salt", async () => {
				await ensureTBA()
				const salted = tokenboundClient.getAccount({
					tokenContract: zora721.proxyContractAddress,
					tokenId: TOKENID_IN_EOA,
					salt: 6551,
				})
				expect(salted).toMatch(ADDRESS_REGEX)
				expect(salted).not.toBe(ZORA721_TBA_ADDRESS)
			})

			v3OnlyIt(
				"can createAccount and append multicall transaction(s) that use the deployed TBA",
				async () => {
					await ensureMintedNFTs()
					const multicallTBAAddress = tokenboundClient.getAccount(
						NFT_FOR_MULTICALL_CREATE,
					)

					// A simple ERC-20 balanceOf, executed by the newly-created TBA.
					const preparedBalanceOfByTBA =
						await tokenboundClient.prepareExecution({
							account: multicallTBAAddress,
							to: WETH,
							value: 0n,
							data: encodeFunctionData({
								abi: weth.abi,
								functionName: "balanceOf",
								args: [multicallTBAAddress],
							}),
						})

					const { account: created, txHash } =
						await tokenboundClient.createAccount({
							tokenContract: zora721.proxyContractAddress,
							tokenId: TOKENID_FOR_MULTICALL_CREATE,
							appendedCalls: [
								{
									target: multicallTBAAddress,
									allowFailure: false,
									callData: preparedBalanceOfByTBA.data,
								},
							],
						})

					const receipt = await publicClient.waitForTransactionReceipt({
						hash: txHash,
					})
					await syncNonce()

					expect(created).toMatch(ADDRESS_REGEX)
					expect(receipt.status).toBe("success")
				},
				TIMEOUT,
			)

			it("can createAccount with a custom chainId", async () => {
				await ensureMintedNFTs()
				const HARDHAT_CHAIN_ID = 31337
				const other = tokenboundClient.getAccount({
					tokenContract: zora721.proxyContractAddress,
					tokenId: TOKENID_IN_EOA,
					chainId: HARDHAT_CHAIN_ID,
				})
				expect(other).toMatch(ADDRESS_REGEX)
				expect(other).not.toBe(ZORA721_TBA_ADDRESS)
			})
		})

		describe("account reads", () => {
			it("can checkAccountDeployment for the created account", async () => {
				await ensureTBA()
				expect(
					await tokenboundClient.checkAccountDeployment({
						accountAddress: ZORA721_TBA_ADDRESS,
					}),
				).toBe(true)
			})

			it("can checkProtocolDeployment on the forked chain", async () => {
				const status = await tokenboundClient.checkProtocolDeployment()

				testLog(`protocolDeployment ${testName}`, status)

				// The fork is mainnet, where both the V2 and V3 deployments exist.
				expect(status.isFullyDeployed).toEqual(true)
				expect(status.registry).toEqual(true)
				expect(status.implementation).toEqual(true)

				// The addresses reported must be the ones this variant is pinned to.
				expect(status.registryAddress).toEqual(
					ERC6551_DEPLOYMENT.REGISTRY.ADDRESS,
				)
				// V3 resolves to the account proxy, not the upgradeable
				// implementation behind it; V2 has no proxy and uses its
				// implementation directly.
				expect(status.implementationAddress).toEqual(
					isV3
						? ERC6551_DEPLOYMENT.ACCOUNT_PROXY?.ADDRESS
						: ERC6551_DEPLOYMENT.IMPLEMENTATION.ADDRESS,
				)
			})

			it("can getNFT for the created account", async () => {
				await ensureTBA()
				const nft = await tokenboundClient.getNFT({
					accountAddress: ZORA721_TBA_ADDRESS,
				})
				expect(nft.tokenContract).toBe(zora721.proxyContractAddress)
				expect(nft.tokenId).toBe(TOKENID_IN_EOA)
				expect(nft.chainId).toBe(mainnet.id)
			})

			it("can deconstructBytecode for the created account", async () => {
				await ensureTBA()
				const bytecode = await tokenboundClient.deconstructBytecode({
					accountAddress: ZORA721_TBA_ADDRESS,
				})
				expect(bytecode).not.toBeNull()
				expect(bytecode?.chainId).toBe(mainnet.id)
				expect(bytecode?.tokenId).toBe(TOKENID_IN_EOA)
			})

			it("can getAccount", async () => {
				await ensureTBA()
				expect(
					tokenboundClient.getAccount({
						tokenContract: zora721.proxyContractAddress,
						tokenId: TOKENID_IN_EOA,
					}),
				).toBe(ZORA721_TBA_ADDRESS)
			})

			it("can getAccount with a custom salt", async () => {
				await ensureMintedNFTs()
				const salted = tokenboundClient.getAccount({
					...NFT_IN_EOA,
					salt: CUSTOM_SALT,
				})
				expect(salted).toMatch(ADDRESS_REGEX)
				expect(salted).toEqual(customSaltTBAAddress())
				expect(salted).not.toBe(ZORA721_TBA_ADDRESS)
			})
		})

		describe("funding", () => {
			it(
				"can transfer one of the minted NFTs to the TBA",
				async () => {
					await ensureTBA()
					await transferNFTToTBA(TOKENID1_IN_TBA)
					const owner = await publicClient.readContract({
						address: zora721.proxyContractAddress,
						abi: zora721.abi,
						functionName: "ownerOf",
						args: [BigInt(TOKENID1_IN_TBA)],
					})
					expect(getAddress(owner)).toBe(getAddress(ZORA721_TBA_ADDRESS))
				},
				TIMEOUT,
			)

			it(
				"can transfer another minted NFT to the TBA",
				async () => {
					await ensureTBA()
					await transferNFTToTBA(TOKENID2_IN_TBA)
					const owner = await publicClient.readContract({
						address: zora721.proxyContractAddress,
						abi: zora721.abi,
						functionName: "ownerOf",
						args: [BigInt(TOKENID2_IN_TBA)],
					})
					expect(getAddress(owner)).toBe(getAddress(ZORA721_TBA_ADDRESS))
				},
				TIMEOUT,
			)

			it(
				"can transfer ETH to the TBA",
				async () => {
					await ensureTBA()
					const before = await publicClient.getBalance({
						address: ZORA721_TBA_ADDRESS,
					})
					const tx = await signer.sendTransaction({
						to: ZORA721_TBA_ADDRESS,
						value: parseUnits("0.5", 18),
						nonce: await nextNonce(),
					})
					await tx.wait()
					await publicClient.waitForTransactionReceipt({ hash: tx.hash as Hex })
					const after = await publicClient.getBalance({
						address: ZORA721_TBA_ADDRESS,
					})
					expect(after - before).toBe(parseUnits("0.5", 18))
				},
				TIMEOUT,
			)
		})

		describe("execution", () => {
			it(isV2 ? "can prepareExecuteCall" : "can prepareExecution", async () => {
				const execution = {
					account: ZORA721_TBA_ADDRESS,
					to: RECIPIENT_ADDRESS,
					value: 0n,
					data: "0x" as Hex,
				}
				const prepared = isV3
					? await tokenboundClient.prepareExecution(execution)
					: await tokenboundClient.prepareExecuteCall(execution)
				expect(prepared.to).toBe(ZORA721_TBA_ADDRESS)
				expect(prepared.data).toMatch(/^0x/)
			})

			it(
				isV2 ? "can executeCall with the TBA" : "can execute with the TBA",
				async () => {
					await ensureETHInTBA()
					const execution = {
						account: ZORA721_TBA_ADDRESS,
						to: RECIPIENT_ADDRESS,
						value: 0n,
						data: "0x" as Hex,
					}
					const hash = isV3
						? await tokenboundClient.execute(execution)
						: await tokenboundClient.executeCall(execution)
					expect(hash).toMatch(TX_HASH_REGEX)
					const receipt = await publicClient.waitForTransactionReceipt({ hash })
					expect(receipt.status).toBe("success")
					await syncNonce()
				},
				TIMEOUT,
			)
		})

		describe("transfers", () => {
			it(
				"can transferETH with the TBA",
				async () => {
					await ensureETHInTBA()
					const before = await publicClient.getBalance({
						address: RECIPIENT_ADDRESS,
					})
					const hash = await tokenboundClient.transferETH({
						account: ZORA721_TBA_ADDRESS,
						recipientAddress: RECIPIENT_ADDRESS,
						amount: 0.1,
					})
					await publicClient.waitForTransactionReceipt({ hash })
					await syncNonce()
					const after = await publicClient.getBalance({
						address: RECIPIENT_ADDRESS,
					})
					expect(after - before).toBe(parseUnits("0.1", 18))
				},
				TIMEOUT,
			)

			it(
				"can transferETH to an ENS with the TBA",
				async () => {
					await ensureETHInTBA()
					const resolved = getAddress(
						(await signer.provider?.resolveName(ENS_NAME)) as string,
					)
					const before = await publicClient.getBalance({ address: resolved })
					const hash = await tokenboundClient.transferETH({
						account: ZORA721_TBA_ADDRESS,
						recipientAddress: ENS_NAME,
						amount: 0.05,
					})
					await publicClient.waitForTransactionReceipt({ hash })
					await syncNonce()
					const after = await publicClient.getBalance({ address: resolved })
					expect(after - before).toBe(parseUnits("0.05", 18))
				},
				TIMEOUT,
			)

			it("will not allow transferNFT 721 with an amount other than 1", async () => {
				await expect(
					tokenboundClient.transferNFT({
						account: ZORA721_TBA_ADDRESS,
						tokenType: "ERC721",
						tokenContract: zora721.proxyContractAddress,
						tokenId: TOKENID_IN_EOA,
						recipientAddress: getAddress(ANVIL_ACCOUNTS[1].address),
						amount: 2,
					}),
				).rejects.toThrow(/ERC721 transfers can only transfer one token/)
			})

			it(
				"can transferNFT a 721 with the TBA",
				async () => {
					await ensureNFTsInTBA()
					await ensureETHInTBA()
					const recipient = getAddress(ANVIL_ACCOUNTS[1].address)
					const before = await publicClient.readContract({
						address: zora721.proxyContractAddress,
						abi: zora721.abi,
						functionName: "balanceOf",
						args: [recipient],
					})

					const hash = await tokenboundClient.transferNFT({
						account: ZORA721_TBA_ADDRESS,
						tokenType: "ERC721",
						tokenContract: zora721.proxyContractAddress,
						tokenId: TOKENID1_IN_TBA,
						recipientAddress: recipient,
					})
					expect(hash).toMatch(TX_HASH_REGEX)
					const receipt = await publicClient.waitForTransactionReceipt({ hash })
					expect(receipt.status).toBe("success")
					await syncNonce()

					const after = await publicClient.readContract({
						address: zora721.proxyContractAddress,
						abi: zora721.abi,
						functionName: "balanceOf",
						args: [recipient],
					})
					expect(after - before).toBe(1n)
				},
				TIMEOUT,
			)

			it(
				"can transferNFT to an ENS with the TBA",
				async () => {
					await ensureETHInTBA()
					// Pick a token the TBA still owns: an earlier test may have moved
					// TOKENID1_IN_TBA out.
					let sendableId: string | undefined
					for (const candidate of [TOKENID2_IN_TBA, TOKENID1_IN_TBA]) {
						const owner = await publicClient.readContract({
							address: zora721.proxyContractAddress,
							abi: zora721.abi,
							functionName: "ownerOf",
							args: [BigInt(candidate)],
						})
						if (isAddressMatch(owner, ZORA721_TBA_ADDRESS)) {
							sendableId = candidate
							break
						}
					}
					if (!sendableId) {
						await transferNFTToTBA(TOKENID2_IN_TBA)
						sendableId = TOKENID2_IN_TBA
					}

					const resolved = getAddress(
						(await signer.provider?.resolveName(ENS_NAME)) as string,
					)
					const before = await publicClient.readContract({
						address: zora721.proxyContractAddress,
						abi: zora721.abi,
						functionName: "balanceOf",
						args: [resolved],
					})

					const hash = await tokenboundClient.transferNFT({
						account: ZORA721_TBA_ADDRESS,
						tokenType: "ERC721",
						tokenContract: zora721.proxyContractAddress,
						tokenId: sendableId,
						recipientAddress: ENS_NAME,
					})
					await publicClient.waitForTransactionReceipt({ hash })
					await syncNonce()

					const after = await publicClient.readContract({
						address: zora721.proxyContractAddress,
						abi: zora721.abi,
						functionName: "balanceOf",
						args: [resolved],
					})
					expect(after - before).toBe(1n)
				},
				TIMEOUT,
			)
		})

		describe("minting", () => {
			it(
				"can mint 4 Zora 721 NFTs with the TBA",
				async () => {
					await ensureETHInTBA()
					const before = await publicClient.readContract({
						address: zora721.proxyContractAddress,
						abi: zora721.abi,
						functionName: "balanceOf",
						args: [ZORA721_TBA_ADDRESS],
					})

					const hash = await tokenboundClient.execute({
						account: ZORA721_TBA_ADDRESS,
						to: zora721.proxyContractAddress,
						value: 0n,
						data: encodeFunctionData({
							abi: zora721.abi,
							functionName: "purchase",
							args: [BigInt(zora721.quantity)],
						}),
					})
					await publicClient.waitForTransactionReceipt({ hash })
					await syncNonce()

					const after = await publicClient.readContract({
						address: zora721.proxyContractAddress,
						abi: zora721.abi,
						functionName: "balanceOf",
						args: [ZORA721_TBA_ADDRESS],
					})
					expect(after - before).toBe(BigInt(zora721.quantity))
				},
				TIMEOUT,
			)

			it(
				"can mint an 1155 with the TBA",
				async () => {
					await ensureETHInTBA(2)
					const quantity = 3n
					const hash = await tokenboundClient.execute({
						account: ZORA721_TBA_ADDRESS,
						to: zora1155.proxyContractAddress,
						value: zora1155.mintFee * quantity,
						data: encodeFunctionData({
							abi: zora1155.abi,
							functionName: "mint",
							args: [
								zora1155.fixedPriceSalesStrategy,
								zora1155.tokenId,
								quantity,
								encodeAbiParameters(parseAbiParameters("address"), [
									ZORA721_TBA_ADDRESS,
								]),
							],
						}),
					})
					await publicClient.waitForTransactionReceipt({ hash })
					await syncNonce()

					const balance = await publicClient.readContract({
						address: zora1155.proxyContractAddress,
						abi: zora1155.abi,
						functionName: "balanceOf",
						args: [ZORA721_TBA_ADDRESS, zora1155.tokenId],
					})
					expect(balance).toBeGreaterThanOrEqual(quantity)
				},
				TIMEOUT,
			)

			it(
				"can transferNFT an 1155 with the TBA",
				async () => {
					const amount = 2
					await ensure1155sInTBA(amount)

					const recipient = getAddress(ANVIL_ACCOUNTS[1].address)
					const before = await publicClient.readContract({
						address: zora1155.proxyContractAddress,
						abi: zora1155.abi,
						functionName: "balanceOf",
						args: [recipient, zora1155.tokenId],
					})

					const hash = await tokenboundClient.transferNFT({
						account: ZORA721_TBA_ADDRESS,
						tokenType: "ERC1155",
						tokenContract: zora1155.proxyContractAddress,
						tokenId: zora1155.tokenId.toString(),
						recipientAddress: recipient,
						amount,
					})
					await publicClient.waitForTransactionReceipt({ hash })
					await syncNonce()

					const after = await publicClient.readContract({
						address: zora1155.proxyContractAddress,
						abi: zora1155.abi,
						functionName: "balanceOf",
						args: [recipient, zora1155.tokenId],
					})
					expect(after - before).toBe(BigInt(amount))
				},
				TIMEOUT,
			)
		})

		describe("signing", () => {
			v3OnlyIt(
				"can verify if a wallet isValidSigner for an owned NFT",
				async () => {
					await ensureTBA()
					expect(
						await tokenboundClient.isValidSigner({
							account: ZORA721_TBA_ADDRESS,
						}),
					).toBe(true)
				},
			)

			it("can sign a message", async () => {
				const signature = await tokenboundClient.signMessage({
					message: "Sign me",
				})
				expect(signature).toMatch(ECDSA_SIGNATURE_REGEX)
			})

			it("can sign a hexified message", async () => {
				const signature = await tokenboundClient.signMessage({
					message: "0x68656c6c6f20776f726c64",
				})
				expect(signature).toMatch(ECDSA_SIGNATURE_REGEX)
			})

			it("can sign a Uint8Array message as raw", async () => {
				const signature = await tokenboundClient.signMessage({
					message: new Uint8Array([72, 101, 108, 108, 111]),
				})
				expect(signature).toMatch(ECDSA_SIGNATURE_REGEX)
			})

			it(
				"can transferERC20 with the TBA",
				async () => {
					await ensureETHInTBA(2)
					const depositHash = await tokenboundClient.execute({
						account: ZORA721_TBA_ADDRESS,
						to: WETH,
						value: parseUnits("0.2", 18),
						data: encodeFunctionData({
							abi: weth.abi,
							functionName: "deposit",
						}),
					})
					await publicClient.waitForTransactionReceipt({ hash: depositHash })
					await syncNonce()

					const recipient = getAddress(ANVIL_ACCOUNTS[1].address)
					const before = await publicClient.readContract({
						address: WETH,
						abi: weth.abi,
						functionName: "balanceOf",
						args: [recipient],
					})

					const hash = await tokenboundClient.transferERC20({
						account: ZORA721_TBA_ADDRESS,
						recipientAddress: recipient,
						amount: 0.1,
						erc20tokenAddress: WETH,
						erc20tokenDecimals: 18,
					})
					await publicClient.waitForTransactionReceipt({ hash })
					await syncNonce()

					const after = await publicClient.readContract({
						address: WETH,
						abi: weth.abi,
						functionName: "balanceOf",
						args: [recipient],
					})
					expect(after - before).toBe(parseUnits("0.1", 18))
				},
				TIMEOUT,
			)
		})

		describe("ethers-specific", () => {
			it("detects the correct ethers version", () => {
				expect(tokenboundClient.getEthersVersion()).toBe(version)
			})

			it("rejects out-of-range ERC-20 decimals", async () => {
				await expect(
					tokenboundClient.transferERC20({
						account: ZORA721_TBA_ADDRESS,
						recipientAddress: RECIPIENT_ADDRESS,
						amount: 1,
						erc20tokenAddress: WETH,
						erc20tokenDecimals: 19,
					}),
				).rejects.toThrow(/Decimal value out of range/)
			})
		})
	},
)
