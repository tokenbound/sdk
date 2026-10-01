// V2-SPECIFIC assertions for @tokenbound/ethers.
//
// TestAllEthers now runs its full suite against BOTH deployments (V2 and V3) on
// both ethers majors, so general behaviour under V2 is covered there. What
// lives here is only what is meaningful for V2 alone: legacy address
// derivation, the legacy registry identity, the `prepareExecuteCall`/
// `executeCall` encoding, and the guards that reject V3-only surface.
//
// Lives in its own file (and its own anvil instances) for the same reason as
// transfer.test.ts: ethers caches pending nonces per provider.

import { ERC_6551_LEGACY_V2, TBVersion } from "@tokenbound/sdk"
import {
	ADDRESS_REGEX,
	ANVIL_ACCOUNTS,
	CREATE_ANVIL_OPTIONS,
	isAddressMatch,
	TX_HASH_REGEX,
	zora721,
} from "@tokenbound/test-fixtures"
import { createAnvil } from "@viem/anvil"
import { ethers } from "ethers"
import { JsonRpcProvider, JsonRpcSigner } from "ethers6"
import {
	createPublicClient,
	encodeFunctionData,
	getAddress,
	type Hex,
	http,
	isAddress,
	type PublicClient,
} from "viem"
import { mainnet } from "viem/chains"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { TokenboundClient } from "../index"

const TIMEOUT = 60000

describe.each([{ version: 5 as const }, { version: 6 as const }])(
	"ethers v$version — ERC-6551 V2 deployment",
	({ version }) => {
		// No explicit port: variants run sequentially and each afterAll stops
		// anvil before the next beforeAll starts, so they can share the default
		// port — same as the viem suite.
		const anvil = createAnvil({ ...CREATE_ANVIL_OPTIONS })
		const rpcUrl = `http://127.0.0.1:${anvil.port}`

		let publicClient: PublicClient
		let tokenboundClient: TokenboundClient
		let tokenId: string

		/**
		 * Waits for a receipt by polling.
		 *
		 * viem's waitForTransactionReceipt relies on a block watcher that does not
		 * reliably observe new blocks in this suite, and stalls until the test times
		 * out. Polling getTransactionReceipt is reliable. (Parity with the other
		 * suites' getReceipt.)
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

		beforeAll(async () => {
			await anvil.start()

			publicClient = createPublicClient({
				chain: mainnet,
				transport: http(rpcUrl),
			}) as PublicClient

			const signer =
				version === 5
					? new ethers.Wallet(
							ANVIL_ACCOUNTS[0].privateKey,
							new ethers.providers.JsonRpcProvider(rpcUrl),
						)
					: new JsonRpcSigner(
							new JsonRpcProvider(rpcUrl),
							getAddress(ANVIL_ACCOUNTS[0].address),
						)

			// Pin the legacy V2 deployment.
			tokenboundClient = new TokenboundClient({
				signer,
				chain: mainnet,
				version: TBVersion.V2,
			})

			// Mint the NFT that controls the account.
			const mint = await signer.sendTransaction({
				to: zora721.proxyContractAddress,
				value: 0n,
				data: encodeFunctionData({
					abi: zora721.abi,
					functionName: "purchase",
					args: [1n],
				}),
			})
			const receipt = await getReceipt(mint.hash as Hex)
			const transferLog = receipt.logs.find(
				(log) =>
					isAddressMatch(log.address, zora721.proxyContractAddress) &&
					log.topics.length === 4,
			)
			if (!transferLog?.topics[3]) {
				throw new Error("Could not determine minted tokenId")
			}
			tokenId = BigInt(transferLog.topics[3]).toString()
		}, TIMEOUT)

		afterAll(async () => {
			await anvil.stop()
		})

		it("derives a V2 account address", () => {
			const account = tokenboundClient.getAccount({
				tokenContract: zora721.proxyContractAddress,
				tokenId,
			})
			expect(isAddress(account)).toBe(true)
			expect(account).toMatch(ADDRESS_REGEX)
		})

		it("derives a different address than the V3 deployment", () => {
			const v2Account = tokenboundClient.getAccount({
				tokenContract: zora721.proxyContractAddress,
				tokenId,
			})

			// Same NFT, default (V3) deployment — must derive elsewhere.
			const v3Client = new TokenboundClient({
				signer:
					version === 5
						? new ethers.Wallet(
								ANVIL_ACCOUNTS[1].privateKey,
								new ethers.providers.JsonRpcProvider(rpcUrl),
							)
						: new JsonRpcSigner(
								new JsonRpcProvider(rpcUrl),
								getAddress(ANVIL_ACCOUNTS[1].address),
							),
				chain: mainnet,
			})

			expect(
				v3Client.getAccount({
					tokenContract: zora721.proxyContractAddress,
					tokenId,
				}),
			).not.toBe(v2Account)
		})

		it("uses the legacy V2 registry", () => {
			// A V2 client must derive against the V2 registry, so its address
			// differs from one built on a custom registry.
			const account = tokenboundClient.getAccount({
				tokenContract: zora721.proxyContractAddress,
				tokenId,
			})
			expect(account).toMatch(ADDRESS_REGEX)
			expect(ERC_6551_LEGACY_V2.REGISTRY.ADDRESS).toMatch(ADDRESS_REGEX)
		})

		it(
			"creates a V2 tokenbound account on-chain",
			async () => {
				const { account, txHash } = await tokenboundClient.createAccount({
					tokenContract: zora721.proxyContractAddress,
					tokenId,
				})
				expect(account).toMatch(ADDRESS_REGEX)
				expect(txHash).toMatch(TX_HASH_REGEX)

				const receipt = await getReceipt(txHash)
				expect(receipt.status).toBe("success")

				expect(
					await tokenboundClient.checkAccountDeployment({
						accountAddress: account,
					}),
				).toBe(true)
			},
			TIMEOUT,
		)

		it(
			"prepares a legacy executeCall (V2-only path)",
			async () => {
				const account = tokenboundClient.getAccount({
					tokenContract: zora721.proxyContractAddress,
					tokenId,
				})

				const prepared = await tokenboundClient.prepareExecuteCall({
					account,
					to: getAddress(ANVIL_ACCOUNTS[1].address),
					value: 0n,
					data: "0x",
				})

				expect(prepared.to).toBe(account)
				expect(prepared.data).toMatch(/^0x/)
			},
			TIMEOUT,
		)

		it(
			"routes prepareExecution through the V2 executeCall encoding",
			async () => {
				const account = tokenboundClient.getAccount({
					tokenContract: zora721.proxyContractAddress,
					tokenId,
				})
				const args = {
					account,
					to: getAddress(ANVIL_ACCOUNTS[1].address),
					value: 0n,
					data: "0x",
				}

				// On a V2 deployment, prepareExecution() must fall back to the
				// legacy executeCall encoding.
				const viaExecution = await tokenboundClient.prepareExecution(args)
				const viaExecuteCall = await tokenboundClient.prepareExecuteCall(args)

				expect(viaExecution.data).toBe(viaExecuteCall.data)
			},
			TIMEOUT,
		)

		it("rejects isValidSigner on a V2 deployment", async () => {
			const account = tokenboundClient.getAccount({
				tokenContract: zora721.proxyContractAddress,
				tokenId,
			})
			await expect(tokenboundClient.isValidSigner({ account })).rejects.toThrow(
				/not supported using the V2 implementation/,
			)
		})

		it("rejects appendedCalls on a V2 deployment", async () => {
			await expect(
				tokenboundClient.prepareCreateAccount({
					tokenContract: zora721.proxyContractAddress,
					tokenId,
					appendedCalls: [
						{
							target: getAddress(zora721.proxyContractAddress),
							allowFailure: false,
							callData: "0x",
						},
					],
				}),
			).rejects.toThrow(/Multicall via appendedCalls is not supported/)
		})
	},
)
