// Tokenbound SDK behaviour via a viem walletClient + publicClient.
//
// packages/ethers/src/test/TestAllEthers.test.ts mirrors this file: the same
// describe blocks and the same `it` names, run against ethers v5 and v6. Keep
// the two in step — if you add a case here, add its counterpart there.

import {
	ADDRESS_REGEX,
	ANVIL_ACCOUNTS,
	ANVIL_CONFIG,
	ANVIL_RPC_URL,
	CREATE_ANVIL_OPTIONS,
	isAddressMatch,
	TEST_CONFIG,
	testLog,
	WETH_CONTRACT_ADDRESS,
	weth,
	zora721,
	zora1155,
} from "@tokenbound/test-fixtures"
import { createAnvil } from "@viem/anvil"
import {
	createTestClient,
	createWalletClient,
	decodeEventLog,
	encodeAbiParameters,
	encodeFunctionData,
	erc20Abi,
	formatEther,
	getAddress,
	getContract,
	http,
	isAddress,
	isHex,
	type PublicClient,
	parseAbiParameters,
	parseUnits,
	type SignableMessage,
	type WalletClient,
} from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { mainnet, zora } from "viem/chains"
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest"
import { type CreateAccountParams, TokenboundClient } from "../"
import { ERC_6551_DEFAULT, ERC_6551_LEGACY_V2 } from "../protocol/constants"
import { type Call3, type TBImplementationVersion, TBVersion } from "../types"
import { resolvePossibleENS } from "../utils"
import {
	ethToWei,
	getPublicClient,
	getWETHBalance,
	getZora721Balance,
	// debugTransaction,
	getZora1155Balance,
} from "./utils"

const TIMEOUT = 60000 // default 10000
const ANVIL_USER_0 = getAddress(ANVIL_ACCOUNTS[0].address)
const ANVIL_USER_1 = getAddress(ANVIL_ACCOUNTS[1].address)

const walletClient = createWalletClient({
	transport: http(ANVIL_RPC_URL),
	chain: ANVIL_CONFIG.ACTIVE_CHAIN,
	account: privateKeyToAccount(ANVIL_ACCOUNTS[0].privateKey),
})

// Anvil cheatcode client, used to normalize forked mainnet state
const testClient = createTestClient({
	transport: http(ANVIL_RPC_URL),
	chain: ANVIL_CONFIG.ACTIVE_CHAIN,
	mode: "anvil",
})

type TestConfig = {
	testName: string
	walletClient: WalletClient
	version?: TBImplementationVersion
}

const ENABLED_TESTS: Array<TestConfig> = [
	{
		testName: "viem v2",
		walletClient,
		version: TBVersion.V2,
	},
	{
		testName: "viem v3",
		walletClient,
	},
]

describe.each(ENABLED_TESTS)(
	"$testName",
	({ testName, walletClient, version }) => {
		const isV2 = version === TBVersion.V2
		const isV3 = isV2 === false
		const v3OnlyIt = isV3 ? it : it.skip
		// Set up Anvil instance + clients
		const anvil = createAnvil({ ...CREATE_ANVIL_OPTIONS })
		const CUSTOM_SALT = 6551
		let tokenboundClient: TokenboundClient
		let publicClient: PublicClient
		let NFT_IN_EOA: CreateAccountParams
		let NFT_FOR_MULTICALL_CREATE: CreateAccountParams
		let TOKENID_IN_EOA: string
		let TOKENID_FOR_MULTICALL_CREATE: string
		let TOKENID1_IN_TBA: string
		let TOKENID2_IN_TBA: string
		let ZORA721_TBA_ADDRESS: `0x${string}`

		const ERC6551_DEPLOYMENT = isV2 ? ERC_6551_LEGACY_V2 : ERC_6551_DEFAULT

		// V3 is the client's default deployment, so it takes no overrides. V2 has
		// to be pinned explicitly to the legacy implementation and registry.
		const DEPLOYMENT_OVERRIDES = isV3
			? {}
			: {
					implementationAddress: ERC6551_DEPLOYMENT.IMPLEMENTATION.ADDRESS,
					registryAddress: ERC6551_DEPLOYMENT.REGISTRY.ADDRESS,
				}

		// Spin up a fresh anvil instance each time we run the test suite against a different configuration
		beforeAll(async () => {
			try {
				publicClient = getPublicClient({ chain: ANVIL_CONFIG.ACTIVE_CHAIN })

				// Pass in the Anvil test walletClient + publicClient
				tokenboundClient = new TokenboundClient({
					chain: ANVIL_CONFIG.ACTIVE_CHAIN,
					walletClient,
					publicClient,
					...DEPLOYMENT_OVERRIDES,
				})

				await anvil.start()

				// The fork inherits mainnet state for Anvil's well-known default accounts,
				// including an EIP-7702 delegation on ANVIL_USER_1. That makes it look like a
				// contract, so safeTransferFrom calls a receiver hook it doesn't implement.
				// Clear it so the account behaves as a plain EOA.
				await testClient.setCode({ address: ANVIL_USER_1, bytecode: "0x" })

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

		// ---------------------------------------------------------------------
		// Setup helpers.
		//
		// Each group of tests below declares the chain state it needs via its own
		// beforeAll. These helpers are idempotent, so running the whole file in
		// sequence does the work once, while running a single group (e.g.
		// `pnpm test -t "transfers"`) still gets a correctly prepared TBA.
		// ---------------------------------------------------------------------

		/**
		 * Waits for a transaction receipt by polling.
		 *
		 * viem's waitForTransactionReceipt relies on a block watcher that does not
		 * reliably observe new blocks in this suite, and a bare getTransactionReceipt
		 * races the block being mined. Polling is reliable for both.
		 */
		async function getReceipt(hash: `0x${string}`, timeoutMs = 30000) {
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

			const mintTxHash = await walletClient.sendTransaction({
				chain: ANVIL_CONFIG.ACTIVE_CHAIN,
				account: ANVIL_USER_0,
				to: zora721.proxyContractAddress,
				value: zora721.mintPrice * BigInt(zora721.quantity),
				data: encodeFunctionData({
					abi: zora721.abi,
					functionName: "purchase",
					args: [BigInt(zora721.quantity)],
				}),
			})

			const receipt = await getReceipt(mintTxHash)

			// Read token IDs off the mint receipt. The mint is a single transaction,
			// so every Transfer log is here and this stays deterministic regardless
			// of how the node batches event notifications.
			const mintedIds = receipt.logs
				.filter((log) =>
					isAddressMatch(log.address, zora721.proxyContractAddress),
				)
				.map((log) => {
					try {
						return decodeEventLog({
							abi: zora721.abi,
							data: log.data,
							topics: log.topics,
						})
					} catch {
						return undefined
					}
				})
				.filter(
					(event): event is NonNullable<typeof event> =>
						event?.eventName === "Transfer" &&
						isAddressMatch((event.args as any)?.to, ANVIL_USER_0),
				)
				.map((event) => ((event.args as any).tokenId as bigint).toString())

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

		/** Deploys the primary TBA (backed by the NFT held in the EOA). */
		async function ensureTBA() {
			await ensureMintedNFTs()
			if (ZORA721_TBA_ADDRESS) return

			const { account, txHash } =
				await tokenboundClient.createAccount(NFT_IN_EOA)
			await getReceipt(txHash)
			ZORA721_TBA_ADDRESS = account
		}

		/** Moves one minted 721 from the EOA into the TBA. */
		async function transferNFTToTBA(tokenId: string) {
			const hash = await walletClient.sendTransaction({
				chain: ANVIL_CONFIG.ACTIVE_CHAIN,
				// biome-ignore lint/style/noNonNullAssertion: configured at module scope
				account: walletClient.account!.address,
				to: zora721.proxyContractAddress,
				value: 0n,
				data: encodeFunctionData({
					abi: zora721.abi,
					functionName: "safeTransferFrom",
					args: [ANVIL_USER_0, ZORA721_TBA_ADDRESS, BigInt(tokenId)],
				}),
			})
			await getReceipt(hash)
			return hash
		}

		/** Ensures the TBA holds the two 721s that transfer tests operate on. */
		async function ensureNFTsInTBA() {
			await ensureTBA()
			const balance = await getZora721Balance({
				publicClient,
				walletAddress: ZORA721_TBA_ADDRESS,
			})
			if (balance >= 2n) return

			await transferNFTToTBA(TOKENID1_IN_TBA)
			await transferNFTToTBA(TOKENID2_IN_TBA)
		}

		/**
		 * The custom-salt TBA address is deterministic, so tests that only need the
		 * address can compute it instead of depending on the create test having run.
		 */
		function customSaltTBAAddress(): `0x${string}` {
			return tokenboundClient.getAccount({
				...NFT_IN_EOA,
				salt: CUSTOM_SALT,
			})
		}

		/** Ensures the TBA holds Zora 1155s for the 1155 transfer tests. */
		async function ensure1155sInTBA() {
			await ensureETHInTBA()
			const balance = await getZora1155Balance({
				publicClient,
				walletAddress: ZORA721_TBA_ADDRESS,
			})
			if (balance >= zora1155.quantity) return

			const data = encodeFunctionData({
				abi: zora1155.abi,
				functionName: "mint",
				args: [
					zora1155.fixedPriceSalesStrategy,
					zora1155.tokenId,
					zora1155.quantity,
					encodeAbiParameters(parseAbiParameters("address"), [
						ZORA721_TBA_ADDRESS,
					]),
				],
			})

			const execution = {
				account: ZORA721_TBA_ADDRESS,
				to: zora1155.proxyContractAddress,
				value: zora1155.mintFee * zora1155.quantity,
				data,
			}

			const hash = isV3
				? await tokenboundClient.execute(execution)
				: await tokenboundClient.executeCall(execution)
			await getReceipt(hash)
		}

		/** Ensures the TBA holds at least `amount` ETH to spend. */
		async function ensureETHInTBA(amount = 1) {
			await ensureTBA()
			const wei = parseUnits(`${amount}`, 18)
			const balance = await publicClient.getBalance({
				address: ZORA721_TBA_ADDRESS,
			})
			if (balance >= wei) return

			const hash = await walletClient.sendTransaction({
				chain: ANVIL_CONFIG.ACTIVE_CHAIN,
				// biome-ignore lint/style/noNonNullAssertion: configured at module scope
				account: walletClient.account!.address,
				to: ZORA721_TBA_ADDRESS,
				value: wei - balance,
			})
			await getReceipt(hash)
		}

		describe("client", () => {
			it("can get the SDK version", () => {
				const sdkVersion: string = tokenboundClient.getSDKVersion()
				testLog(`SDK Version → \x1b[94m ${sdkVersion} \x1b[0m`)
				// testLog('SDK Version:', sdkVersion)
				expect(sdkVersion).toBeDefined()
			})

			// To test the SDK methods, we need to mint some NFTs into the Anvil wallet
			// so that we can transfer them to the TBA and test the TBA methods.
		})

		describe("accounts", () => {
			it(
				"can mint 2 Zora 721 NFTs into Anvil wallet #0",
				async () => {
					await ensureMintedNFTs()
					const zoraBalanceInAnvilWallet = await getZora721Balance({
						publicClient,
						walletAddress: ANVIL_USER_0,
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

			it(
				"can prepareCreateAccount",
				async () => {
					await ensureMintedNFTs()
					const preparedAccount = await tokenboundClient.prepareCreateAccount({
						tokenContract: zora721.proxyContractAddress,
						tokenId: "1",
					})

					if (!preparedAccount.to) return

					expect(isAddress(preparedAccount.to)).toEqual(true)
					expect(typeof preparedAccount.value).toEqual("bigint")
					expect(isHex(preparedAccount.data)).toEqual(true)
				},
				TIMEOUT,
			)

			// We create the account using an NFT in the EOA wallet so we can test the EOA methods and use the TBA address for tests
			it(
				"can createAccount",
				async () => {
					await ensureMintedNFTs()
					const { account, txHash } =
						await tokenboundClient.createAccount(NFT_IN_EOA)
					testLog("CREATED ACCT", account)

					const createdAccountTxReceipt =
						await publicClient.waitForTransactionReceipt({
							hash: txHash,
						})

					ZORA721_TBA_ADDRESS = account
					await vi.waitFor(() => {
						expect(account).toMatch(ADDRESS_REGEX)
						expect(createdAccountTxReceipt.status).toBe("success")
					})
				},
				TIMEOUT,
			)

			it(
				"can createAccount with a custom salt",
				async () => {
					await ensureMintedNFTs()
					const { account, txHash } = await tokenboundClient.createAccount({
						...NFT_IN_EOA,
						salt: CUSTOM_SALT,
					})
					testLog("CREATED ACCT WITH CUSTOM SALT", account)

					const createdAccountTxReceipt =
						await publicClient.waitForTransactionReceipt({
							hash: txHash,
						})

					await vi.waitFor(() => {
						expect(account).toMatch(ADDRESS_REGEX)
						expect(createdAccountTxReceipt.status).toBe("success")
					})
				},
				TIMEOUT,
			)

			it(
				"can createAccount with a custom chainId",
				async () => {
					await ensureMintedNFTs()
					const HARDHAT_CHAIN_ID = 31337

					const { account, txHash } = await tokenboundClient.createAccount({
						...NFT_IN_EOA,
						chainId: HARDHAT_CHAIN_ID,
					})
					testLog("CREATED ACCT WITH CUSTOM CHAIN ID", account)

					const createdAccountTxReceipt =
						await publicClient.waitForTransactionReceipt({
							hash: txHash,
						})

					const bytecode = await tokenboundClient.deconstructBytecode({
						accountAddress: account,
					})

					if (!bytecode) return

					const { chainId } = bytecode

					testLog("CHAINID OF CREATED ACCT", chainId)

					expect(isAddress(account)).toEqual(true)
					expect(createdAccountTxReceipt.status).toBe("success")
					expect(chainId).toBe(HARDHAT_CHAIN_ID)
				},
				TIMEOUT,
			)

			v3OnlyIt(
				"can createAccount and append multicall transaction(s) that use the deployed TBA",
				async () => {
					await ensureMintedNFTs()
					const multicallTBAAddress = tokenboundClient.getAccount(
						NFT_FOR_MULTICALL_CREATE,
					)

					// Perform a simple ERC20 balanceOf call to test the appended multicall transaction
					const encodedBalanceOfFunctionData = encodeFunctionData({
						abi: erc20Abi,
						functionName: "balanceOf",
						args: [multicallTBAAddress],
					})

					const preparedBalanceOfByTBA =
						await tokenboundClient.prepareExecution({
							account: multicallTBAAddress,
							to: WETH_CONTRACT_ADDRESS,
							value: 0n,
							data: encodedBalanceOfFunctionData,
						})

					const appendedCall: Call3 = {
						target: multicallTBAAddress, // Execute with TBA
						allowFailure: false,
						callData: preparedBalanceOfByTBA.data,
					}

					const { account, txHash } = await tokenboundClient.createAccount({
						...NFT_FOR_MULTICALL_CREATE,
						appendedCalls: [appendedCall],
					})
					testLog("CREATED ACCT WITH MULTICALL", account)

					const createdAccountTxReceipt =
						await publicClient.waitForTransactionReceipt({
							hash: txHash,
						})

					await vi.waitFor(() => {
						expect(account).toMatch(ADDRESS_REGEX)
						expect(createdAccountTxReceipt.status).toBe("success")
					})
				},
				TIMEOUT,
			)
		})

		describe("account reads", () => {
			it("can checkAccountDeployment for the created account", async () => {
				await ensureTBA()
				const isAccountDeployed = await tokenboundClient.checkAccountDeployment(
					{
						accountAddress: ZORA721_TBA_ADDRESS,
					},
				)

				testLog(`isAccountDeployed ${testName}`, isAccountDeployed)

				expect(isAccountDeployed).toEqual(true)
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

				if (!nft) throw new Error("Bytecode is undefined")

				const { chainId, tokenContract, tokenId } = nft

				expect(chainId).toEqual(ANVIL_CONFIG.ACTIVE_CHAIN.id)
				expect(tokenContract).toEqual(NFT_IN_EOA.tokenContract)
				expect(tokenId).toEqual(NFT_IN_EOA.tokenId)
			})

			it("can deconstructBytecode for the created account", async () => {
				await ensureTBA()
				const bytecode = await tokenboundClient.deconstructBytecode({
					accountAddress: ZORA721_TBA_ADDRESS,
				})

				if (!bytecode) throw new Error("Bytecode is undefined")

				const {
					chainId,
					implementationAddress,
					tokenContract,
					tokenId,
					salt,
					erc1167Header,
					erc1167Footer,
				} = bytecode

				expect(chainId).toEqual(ANVIL_CONFIG.ACTIVE_CHAIN.id)
				expect(erc1167Header).toEqual(TEST_CONFIG.ERC1167_HEADER)
				// expect(implementationAddress).toEqual(ERC6551_DEPLOYMENT.IMPLEMENTATION.ADDRESS)

				if (isV2) {
					expect(implementationAddress).toEqual(
						ERC6551_DEPLOYMENT.IMPLEMENTATION.ADDRESS,
					)
				}
				if (isV3) {
					expect(implementationAddress).toEqual(
						ERC6551_DEPLOYMENT.ACCOUNT_PROXY?.ADDRESS,
					)
				}

				expect(erc1167Footer).toEqual(TEST_CONFIG.ERC1167_FOOTER)
				expect(tokenContract).toEqual(NFT_IN_EOA.tokenContract)
				expect(tokenId).toEqual(NFT_IN_EOA.tokenId)
				expect(salt).toEqual(0)
			})

			it("can getAccount", async () => {
				await ensureTBA()
				const getAccount = tokenboundClient.getAccount(NFT_IN_EOA)
				await vi.waitFor(() => {
					expect(getAccount).toMatch(ADDRESS_REGEX)
					expect(getAccount).toEqual(ZORA721_TBA_ADDRESS)
				})
			})

			it("can getAccount with a custom salt", async () => {
				await ensureTBA()
				const getAccount = tokenboundClient.getAccount({
					...NFT_IN_EOA,
					salt: CUSTOM_SALT,
				})
				await vi.waitFor(() => {
					expect(getAccount).toMatch(ADDRESS_REGEX)
					expect(getAccount).toEqual(customSaltTBAAddress())
				})
			})

			// We transfer an NFT to the TBA so that we can test the TBA methods.
		})

		describe("funding", () => {
			it(
				"can transfer one of the minted NFTs to the TBA",
				async () => {
					await ensureTBA()
					testLog(
						"SAFE_TRANSFER",
						ZORA721_TBA_ADDRESS,
						"tokenId",
						TOKENID1_IN_TBA,
					)

					const transferCallData = encodeFunctionData({
						abi: zora721.abi,
						functionName: "safeTransferFrom",
						args: [
							ANVIL_USER_0, // from
							ZORA721_TBA_ADDRESS, // to
							BigInt(TOKENID1_IN_TBA), // tokenId
						],
					})

					const preparedNFTTransfer = {
						to: zora721.proxyContractAddress,
						value: 0n,
						data: transferCallData,
					}

					if (!walletClient.account?.address) {
						throw new Error("walletClient.account.address is undefined")
					}

					const transferHash = await walletClient.sendTransaction({
						chain: ANVIL_CONFIG.ACTIVE_CHAIN,
						account: walletClient.account.address,
						...preparedNFTTransfer,
					})

					const transactionReceipt =
						await publicClient.waitForTransactionReceipt({
							hash: transferHash,
						})

					const tbaNFTBalance = await getZora721Balance({
						publicClient,
						walletAddress: ZORA721_TBA_ADDRESS,
					})
					testLog("# of NFTs in TBA: ", tbaNFTBalance.toString())

					await vi.waitFor(() => {
						expect(transferHash).toMatch(ADDRESS_REGEX)
						expect(transactionReceipt.status).toBe("success")
						expect(tbaNFTBalance).toBe(1n)
					})
				},
				TIMEOUT,
			)

			it(
				"can transfer another minted NFT to the TBA",
				async () => {
					await ensureTBA()
					const transferCallData = encodeFunctionData({
						abi: zora721.abi,
						functionName: "safeTransferFrom",
						args: [
							ANVIL_USER_0, // from
							ZORA721_TBA_ADDRESS, // to
							BigInt(TOKENID2_IN_TBA), // tokenId
						],
					})

					const preparedNFTTransfer = {
						to: zora721.proxyContractAddress,
						value: 0n,
						data: transferCallData,
					}

					if (!walletClient.account?.address) {
						throw new Error("walletClient.account.address is undefined")
					}

					const transferHash = await walletClient.sendTransaction({
						chain: ANVIL_CONFIG.ACTIVE_CHAIN,
						account: walletClient.account.address,
						...preparedNFTTransfer,
					})

					const transactionReceipt =
						await publicClient.waitForTransactionReceipt({
							hash: transferHash,
						})

					const tbaNFTBalance = await getZora721Balance({
						publicClient,
						walletAddress: ZORA721_TBA_ADDRESS,
					})
					testLog("# of NFTs in TBA: ", tbaNFTBalance.toString())

					await vi.waitFor(() => {
						expect(transferHash).toMatch(ADDRESS_REGEX)
						expect(transactionReceipt.status).toBe("success")
						expect(tbaNFTBalance).toBe(2n)
					})
				},
				TIMEOUT,
			)

			// To perform transactions using the SDK, we need to transfer some ETH into the TBA.
			it(
				"can transfer ETH to the TBA",
				async () => {
					await ensureTBA()
					const ethAmount = 1
					const ethAmountWei = parseUnits(`${ethAmount}`, 18)

					const preparedETHTransfer = {
						to: ZORA721_TBA_ADDRESS,
						value: ethAmountWei,
						// data is optional if nil
					}

					if (!walletClient.account?.address) {
						throw new Error("walletClient.account.address is undefined")
					}

					const transferHash = await walletClient.sendTransaction({
						chain: ANVIL_CONFIG.ACTIVE_CHAIN,
						account: walletClient.account.address,
						...preparedETHTransfer,
					})

					const balanceAfter = await publicClient.getBalance({
						address: ZORA721_TBA_ADDRESS,
					})

					await vi.waitFor(() => {
						expect(transferHash).toMatch(ADDRESS_REGEX)
						expect(balanceAfter).toBe(ethAmountWei)
					})
				},
				TIMEOUT,
			)
		})

		describe("execution", () => {
			it(isV2 ? "can prepareExecuteCall" : "can prepareExecution", async () => {
				await ensureETHInTBA()
				const execution = {
					account: ZORA721_TBA_ADDRESS,
					to: TEST_CONFIG.RECIPIENT_ADDRESS,
					value: 0n,
					data: "",
				}

				const preparedCall = isV3
					? await tokenboundClient.prepareExecution(execution)
					: await tokenboundClient.prepareExecuteCall(execution)

				expect(isAddress(preparedCall.to)).toEqual(true)
				expect(typeof preparedCall.value).toEqual("bigint")
				expect(isHex(preparedCall.data)).toEqual(true)
			})

			// Execute a basic call with no value with the TBA to see if it works.
			it(
				isV2 ? "can executeCall with the TBA" : "can execute with the TBA",
				async () => {
					await ensureETHInTBA()
					const execution = {
						account: ZORA721_TBA_ADDRESS,
						to: zora721.proxyContractAddress,
						value: 0n,
						data: "",
					}

					const executedCallTxHash = isV3
						? await tokenboundClient.execute(execution)
						: await tokenboundClient.executeCall(execution)

					const transactionReceipt = await getReceipt(executedCallTxHash)

					await vi.waitFor(() => {
						expect(executedCallTxHash).toMatch(ADDRESS_REGEX)
						expect(transactionReceipt.status).toBe("success")
					})
				},
				TIMEOUT,
			)

			it(
				"can fall back to executeCall from execute for V2",
				async () => {
					await ensureETHInTBA()
					const execution = {
						account: ZORA721_TBA_ADDRESS,
						to: zora721.proxyContractAddress,
						value: 0n,
						data: "",
					}

					const executedCallTxHash = await tokenboundClient.execute(execution)

					const transactionReceipt = await getReceipt(executedCallTxHash)

					await vi.waitFor(() => {
						expect(executedCallTxHash).toMatch(ADDRESS_REGEX)
						expect(transactionReceipt.status).toBe("success")
					})
				},
				TIMEOUT,
			)

			// Other methods in the SDK implement executeCall, like transferETH, transferNFT, etc.
			// so they provide further assurance that executeCall is working as expected:
		})

		describe("transfers", () => {
			it("can transferETH with the TBA", async () => {
				await ensureETHInTBA()
				// Assert the delta rather than absolute balances, so this test does not
				// depend on how much ETH earlier tests happened to spend.
				const TRANSFER_AMOUNT = parseUnits("0.25", 18)

				const balanceBefore = await publicClient.getBalance({
					address: ZORA721_TBA_ADDRESS,
				})
				const ethTransferHash = await tokenboundClient.transferETH({
					account: ZORA721_TBA_ADDRESS,
					amount: 0.25,
					recipientAddress: ANVIL_USER_1,
				})

				const transactionReceipt = await getReceipt(ethTransferHash)

				const balanceAfter = await publicClient.getBalance({
					address: ZORA721_TBA_ADDRESS,
				})

				testLog(
					"BEFORE: ",
					formatEther(balanceBefore),
					"AFTER: ",
					formatEther(balanceAfter),
				)

				await vi.waitFor(() => {
					expect(ethTransferHash).toMatch(ADDRESS_REGEX)
					expect(transactionReceipt.status).toBe("success")
					expect(balanceBefore - balanceAfter).toBe(TRANSFER_AMOUNT)
				})
			})

			it("can transferETH to an ENS with the TBA", async () => {
				await ensureETHInTBA()
				// Assert the delta rather than absolute balances, so this test does not
				// depend on how much ETH earlier tests happened to spend.
				const TRANSFER_AMOUNT = parseUnits("0.25", 18)

				const balanceBefore = await publicClient.getBalance({
					address: ZORA721_TBA_ADDRESS,
				})
				const ethTransferHash = await tokenboundClient.transferETH({
					account: ZORA721_TBA_ADDRESS,
					amount: 0.25,
					recipientAddress: "jeebay.eth",
				})
				const balanceAfter = await publicClient.getBalance({
					address: ZORA721_TBA_ADDRESS,
				})

				testLog(
					"BEFORE: ",
					formatEther(balanceBefore),
					"AFTER: ",
					formatEther(balanceAfter),
				)

				await vi.waitFor(() => {
					expect(ethTransferHash).toMatch(ADDRESS_REGEX)
					expect(balanceBefore - balanceAfter).toBe(TRANSFER_AMOUNT)
				})
			})

			it("will not allow transferNFT 721 with an amount other than 1", async () => {
				vi.spyOn(console, "error")

				await expect(() =>
					tokenboundClient.transferNFT({
						account: ZORA721_TBA_ADDRESS,
						tokenType: "ERC721",
						tokenContract: zora721.proxyContractAddress,
						tokenId: TOKENID1_IN_TBA,
						recipientAddress: ANVIL_USER_1,
						amount: 2,
					}),
				).rejects.toThrowError()
			})

			it("can transferNFT a 721 with the TBA", async () => {
				await ensureNFTsInTBA()
				await ensureETHInTBA()
				const transferNFTHash = await tokenboundClient.transferNFT({
					account: ZORA721_TBA_ADDRESS,
					tokenType: "ERC721",
					tokenContract: zora721.proxyContractAddress,
					tokenId: TOKENID1_IN_TBA,
					recipientAddress: ANVIL_USER_1,
				})

				const anvilAccount1NFTBalance = await getZora721Balance({
					publicClient,
					walletAddress: ANVIL_USER_1,
				})

				await vi.waitFor(() => {
					expect(transferNFTHash).toMatch(ADDRESS_REGEX)
					expect(anvilAccount1NFTBalance).toBe(1n)
				})
			})

			it("can transferNFT to an ENS with the TBA", async () => {
				await ensureNFTsInTBA()
				await ensureETHInTBA()
				const transferNFTHash = await tokenboundClient.transferNFT({
					account: ZORA721_TBA_ADDRESS,
					tokenType: "ERC721",
					tokenContract: zora721.proxyContractAddress,
					tokenId: TOKENID2_IN_TBA,
					recipientAddress: "jeebay.eth",
				})

				const addr = await resolvePossibleENS(publicClient, "jeebay.eth")

				const anvilAccount1NFTBalance = await getZora721Balance({
					publicClient,
					walletAddress: addr,
				})

				await vi.waitFor(() => {
					expect(transferNFTHash).toMatch(ADDRESS_REGEX)
					expect(anvilAccount1NFTBalance).toBe(1n)
				})
			})
		})

		describe("minting", () => {
			it("can mint 4 Zora 721 NFTs with the TBA", async () => {
				await ensureETHInTBA()
				const encodedMintFunctionData = encodeFunctionData({
					abi: zora721.abi,
					functionName: "purchase",
					args: [BigInt(zora721.quantity)],
				})

				const execution = {
					account: ZORA721_TBA_ADDRESS,
					to: zora721.proxyContractAddress,
					value: zora721.mintPrice * BigInt(zora721.quantity),
					data: encodedMintFunctionData,
				}

				const mintToTBATxHash = isV3
					? await tokenboundClient.execute(execution)
					: await tokenboundClient.executeCall(execution)

				const zoraBalanceInTBA = await getZora721Balance({
					publicClient,
					walletAddress: ZORA721_TBA_ADDRESS,
				})

				testLog("721s MINTED TO TBA: ", zoraBalanceInTBA.toString())

				await vi.waitFor(() => {
					expect(mintToTBATxHash).toMatch(ADDRESS_REGEX)
					expect(NFT_IN_EOA.tokenId).toBe(TOKENID_IN_EOA)
					expect(zoraBalanceInTBA).toBe(4n)
				})
			})

			it("can mint an 1155 with the TBA", async () => {
				await ensureETHInTBA()
				const mintingAccount: `0x${string}` = ZORA721_TBA_ADDRESS

				const minterArguments: `0x${string}` = encodeAbiParameters(
					parseAbiParameters("address"),
					[mintingAccount],
				)

				const data = encodeFunctionData({
					abi: zora1155.abi,
					functionName: "mint",
					args: [
						zora1155.fixedPriceSalesStrategy, // IMinter1155
						zora1155.tokenId, // uint256
						zora1155.quantity, // uint256
						minterArguments, // bytes
					],
				})

				const execution = {
					account: mintingAccount,
					to: zora1155.proxyContractAddress,
					value: zora1155.mintFee * zora1155.quantity,
					data,
				}

				const mint1155TxHash = isV3
					? await tokenboundClient.execute(execution)
					: await tokenboundClient.executeCall(execution)

				const zora1155BalanceInTBA = await getZora1155Balance({
					publicClient,
					walletAddress: mintingAccount,
				})

				testLog("1155 Balance", zora1155BalanceInTBA)

				await vi.waitFor(() => {
					expect(mint1155TxHash).toMatch(ADDRESS_REGEX)
					expect(zora1155BalanceInTBA).toBe(5n)
				})
			})

			it("can transferNFT an 1155 with the TBA", async () => {
				await ensure1155sInTBA()
				const transferAmount = 2

				const transferNFTHash = await tokenboundClient.transferNFT({
					account: ZORA721_TBA_ADDRESS,
					tokenType: "ERC1155",
					tokenContract: zora1155.proxyContractAddress,
					tokenId: zora1155.tokenId.toString(),
					recipientAddress: ANVIL_USER_1,
					amount: transferAmount,
				})

				const anvilAccount1_1155Balance = await getZora1155Balance({
					publicClient,
					walletAddress: ANVIL_USER_1,
				})

				testLog("1155 Balance", anvilAccount1_1155Balance)

				await vi.waitFor(() => {
					expect(transferNFTHash).toMatch(ADDRESS_REGEX)
					expect(anvilAccount1_1155Balance).toBe(BigInt(transferAmount))
				})
			})
		})

		describe("signing", () => {
			v3OnlyIt(
				"can verify if a wallet isValidSigner for an owned NFT",
				async () => {
					await ensureTBA()
					testLog("ZORA721_TBA_ADDRESS in isValidSigner", ZORA721_TBA_ADDRESS)
					const isValidSigner = await tokenboundClient.isValidSigner({
						account: ZORA721_TBA_ADDRESS,
					})

					testLog("isValidSigner?", isValidSigner)

					await vi.waitFor(() => {
						expect(isValidSigner).toBe(true)
					})
				},
			)

			it("can sign a message", async () => {
				await ensureTBA()
				const signedMessageHash = await tokenboundClient.signMessage({
					message: "Sign me",
				})

				testLog("SIGNED MESSAGE: ", signedMessageHash)

				await vi.waitFor(() => {
					expect(signedMessageHash).toMatch(ADDRESS_REGEX)
				})
			})

			// Test signing a hex message.
			it("can sign a hexified message", async () => {
				await ensureTBA()
				const hexSignedMessageHash = await tokenboundClient.signMessage({
					message: { raw: "0x68656c6c6f20776f726c64" },
				})

				testLog("HEX SIGNED MESSAGE: ", hexSignedMessageHash)

				await vi.waitFor(() => {
					expect(hexSignedMessageHash).toMatch(ADDRESS_REGEX)
				})
			})

			// Test signing a Uint8Array message as raw.
			it("can sign a Uint8Array message as raw", async () => {
				await ensureTBA()
				const uint8ArrayMessage: Uint8Array = new Uint8Array([
					72, 101, 108, 108, 111,
				]) // "Hello" in ASCII

				const rawUint8Hash = await tokenboundClient.signMessage({
					message: { raw: uint8ArrayMessage },
				})

				await vi.waitFor(() => {
					expect(rawUint8Hash).toMatch(ADDRESS_REGEX)
				})
			})

			// Test signing an ArrayLike message.
			it("throws when viem incorrectly receives an ArrayLike message for signing", async () => {
				await ensureTBA()
				vi.spyOn(console, "error")
				const arrayMessage: ArrayLike<number> = [72, 101, 108, 108, 111] // "Hello" in ASCII

				await expect(() =>
					tokenboundClient.signMessage({
						// Intentionally invalid: viem rejects ArrayLike at runtime.
						message: arrayMessage as unknown as SignableMessage,
					}),
				).rejects.toThrowError()
			})

			// Test signing a bare Uint8Array message.
			it("throws when viem incorrectly receives an Uint8Array message for signing", async () => {
				await ensureTBA()
				const uint8ArrayMessage: Uint8Array = new Uint8Array([
					72, 101, 108, 108, 111,
				]) // "Hello" in ASCII

				await expect(() =>
					tokenboundClient.signMessage({
						// Intentionally invalid: a bare Uint8Array must be { raw }.
						message: uint8ArrayMessage as unknown as SignableMessage,
					}),
				).rejects.toThrowError()
			})

			it(
				"can transferERC20 with the TBA",
				async () => {
					await ensureTBA()
					const depositEthValue = 0.2
					const depositWeiValue = ethToWei(depositEthValue)
					const transferEthValue = 0.1
					const transferWeiValue = ethToWei(transferEthValue)
					const tbaWETHInitial = await getWETHBalance({
						publicClient,
						walletAddress: ZORA721_TBA_ADDRESS,
					})

					// Prepare encoded WETH transfer to TBA
					const wethTransferCallData = encodeFunctionData({
						abi: weth.abi,
						functionName: "transfer",
						args: [ZORA721_TBA_ADDRESS, depositWeiValue],
					})

					if (!walletClient.account?.address) {
						throw new Error("walletClient.account is undefined")
					}

					const wethContract = getContract({
						address: WETH_CONTRACT_ADDRESS,
						abi: weth.abi,
						client: {
							wallet: walletClient,
						},
					})

					// Convert ETH to WETH in ANVIL_USER_0 wallet
					const wethDepositHash = await wethContract.write.deposit({
						account: ANVIL_USER_0,
						chain: ANVIL_CONFIG.ACTIVE_CHAIN,
						value: depositWeiValue,
					})

					// Transfer WETH from ANVIL_USER_0 to TBA
					const wethTransferHash = await walletClient.sendTransaction({
						account: walletClient.account,
						chain: ANVIL_CONFIG.ACTIVE_CHAIN,
						to: WETH_CONTRACT_ADDRESS,
						value: 0n,
						data: wethTransferCallData,
					})

					const tbaWETHReceived = await getWETHBalance({
						publicClient,
						walletAddress: ZORA721_TBA_ADDRESS,
					})

					// Transfer WETH from TBA to ANVIL_USER_1
					const transferredERC20Hash = await tokenboundClient.transferERC20({
						account: ZORA721_TBA_ADDRESS,
						amount: transferEthValue,
						recipientAddress: ANVIL_USER_1,
						erc20tokenAddress: WETH_CONTRACT_ADDRESS,
						erc20tokenDecimals: 18,
					})

					// Transfer WETH from TBA to jeebay.eth
					const ensTransferredERC20Hash = await tokenboundClient.transferERC20({
						account: ZORA721_TBA_ADDRESS,
						amount: transferEthValue,
						recipientAddress: "jeebay.eth",
						erc20tokenAddress: WETH_CONTRACT_ADDRESS,
						erc20tokenDecimals: 18,
					})

					const tbaWETHFinal = await getWETHBalance({
						publicClient,
						walletAddress: ZORA721_TBA_ADDRESS,
					})

					const anvilUser1WETHBalance = await getWETHBalance({
						publicClient,
						walletAddress: ANVIL_USER_1,
					})

					const ensWETHBalance = await getWETHBalance({
						publicClient,
						walletAddress: "jeebay.eth",
					})

					testLog(
						"TBA WETH INITIAL: ",
						formatEther(tbaWETHInitial),
						"TBA RECEIVED: ",
						formatEther(tbaWETHReceived),
						"AFTER: ",
						formatEther(tbaWETHFinal),
						"ANVIL USER 1 BALANCE: ",
						formatEther(anvilUser1WETHBalance),
						"ENS BALANCE: ",
						formatEther(ensWETHBalance),
					)

					await vi.waitFor(() => {
						expect(wethDepositHash).toMatch(ADDRESS_REGEX)
						expect(wethTransferHash).toMatch(ADDRESS_REGEX)
						expect(transferredERC20Hash).toMatch(ADDRESS_REGEX)
						expect(ensTransferredERC20Hash).toMatch(ADDRESS_REGEX)
						expect(tbaWETHReceived).toBe(depositWeiValue)
						expect(anvilUser1WETHBalance).toBe(transferWeiValue)
						expect(ensWETHBalance).toBe(transferWeiValue)
					})
				},
				TIMEOUT,
			)
		})
	},
)

describe("Custom client configurations", () => {
	it("can use a custom publicClient RPC URL", async () => {
		const customPublicClientRPCUrl = "https://cloudflare-eth.com"
		const tokenboundClient = new TokenboundClient({
			chain: mainnet,
			walletClient,
			publicClientRPCUrl: customPublicClientRPCUrl,
		})

		await vi.waitFor(() => {
			expect(tokenboundClient.publicClient?.transport?.url).toBe(
				customPublicClientRPCUrl,
			)
		})
	})
	it("can use a custom chain as parameter", async () => {
		const ZORA_CHAIN_ID = 7777777

		const tokenboundClient = new TokenboundClient({
			walletClient,
			chain: zora,
		})

		await vi.waitFor(() => {
			expect(tokenboundClient.publicClient?.chain?.id).toBe(ZORA_CHAIN_ID)
		})
	})
})
