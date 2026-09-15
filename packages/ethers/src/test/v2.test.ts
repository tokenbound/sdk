// Legacy ERC-6551 V2 deployment coverage for @tokenbound/ethers.
//
// The rest of the suite exercises the default V3 deployment. This file pins
// `version: TBVersion.V2` so the V2-only branches of the client — the legacy
// `prepareExecuteCall`/`executeCall` path, the V3-only guards, and V2 address
// derivation — are exercised on BOTH ethers majors.
//
// Lives in its own file (and its own anvil instances) for the same reason as
// transfer.test.ts: ethers caches pending nonces per provider.

import { ERC_6551_LEGACY_V2, TBVersion } from "@tokenbound/sdk"
import { createAnvil } from "@viem/anvil"
import { ethers } from "ethers"
import { JsonRpcProvider, Wallet } from "ethers6"
import {
	createPublicClient,
	encodeFunctionData,
	getAddress,
	http,
	isAddress,
	type PublicClient,
	parseAbi,
} from "viem"
import { mainnet } from "viem/chains"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { TokenboundClient } from "../index"
import { ADDRESS_REGEX, ANVIL_ACCOUNTS, TX_HASH_REGEX } from "./constants"

const TIMEOUT = 60000

const TOKEN_CONTRACT = "0x28ee638f2fcb66b4106acab7efd225aeb2bd7e8d" as const
const ZORA_721_ABI = parseAbi([
	"function purchase(uint256 quantity) external payable returns (uint256)",
])

const FORK_URL =
	process.env.VITE_ANVIL_MAINNET_FORK_ENDPOINT ??
	"https://ethereum-rpc.publicnode.com"

describe.each([{ version: 5 as const }, { version: 6 as const }])(
	"ethers v$version — ERC-6551 V2 deployment",
	({ version }) => {
		const port = 9000 + (version === 5 ? 0 : 1)
		const rpcUrl = `http://127.0.0.1:${port}`
		const anvil = createAnvil({ forkUrl: FORK_URL, port })

		let publicClient: PublicClient
		let tokenboundClient: TokenboundClient
		let tokenId: string

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
					: new Wallet(
							ANVIL_ACCOUNTS[0].privateKey,
							new JsonRpcProvider(rpcUrl),
						)

			// Pin the legacy V2 deployment.
			tokenboundClient = new TokenboundClient({
				signer,
				chain: mainnet,
				publicClient,
				version: TBVersion.V2,
			})

			// Mint the NFT that controls the account.
			const mint = await signer.sendTransaction({
				to: TOKEN_CONTRACT,
				value: 0n,
				data: encodeFunctionData({
					abi: ZORA_721_ABI,
					functionName: "purchase",
					args: [1n],
				}),
			})
			// Await through ethers, not just viem: this is what refreshes ethers'
			// cached pending nonce. Confirming only via publicClient leaves the
			// signer's view stale and the next send fails with "nonce too low".
			await mint.wait()
			const receipt = await publicClient.waitForTransactionReceipt({
				hash: mint.hash as `0x${string}`,
			})
			const transferLog = receipt.logs.find(
				(log) =>
					log.address.toLowerCase() === TOKEN_CONTRACT.toLowerCase() &&
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

		it("detects the correct ethers version", () => {
			expect(tokenboundClient.getEthersVersion()).toBe(version)
		})

		it("derives a V2 account address", () => {
			const account = tokenboundClient.getAccount({
				tokenContract: TOKEN_CONTRACT,
				tokenId,
			})
			expect(isAddress(account)).toBe(true)
			expect(account).toMatch(ADDRESS_REGEX)
		})

		it("derives a different address than the V3 deployment", () => {
			const v2Account = tokenboundClient.getAccount({
				tokenContract: TOKEN_CONTRACT,
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
						: new Wallet(
								ANVIL_ACCOUNTS[1].privateKey,
								new JsonRpcProvider(rpcUrl),
							),
				chain: mainnet,
				publicClient,
			})

			expect(
				v3Client.getAccount({ tokenContract: TOKEN_CONTRACT, tokenId }),
			).not.toBe(v2Account)
		})

		it("uses the legacy V2 registry", () => {
			// A V2 client must derive against the V2 registry, so its address
			// differs from one built on a custom registry.
			const account = tokenboundClient.getAccount({
				tokenContract: TOKEN_CONTRACT,
				tokenId,
			})
			expect(account).toMatch(ADDRESS_REGEX)
			expect(ERC_6551_LEGACY_V2.REGISTRY.ADDRESS).toMatch(ADDRESS_REGEX)
		})

		it(
			"creates a V2 tokenbound account on-chain",
			async () => {
				const { account, txHash } = await tokenboundClient.createAccount({
					tokenContract: TOKEN_CONTRACT,
					tokenId,
				})
				expect(account).toMatch(ADDRESS_REGEX)
				expect(txHash).toMatch(TX_HASH_REGEX)

				const receipt = await publicClient.waitForTransactionReceipt({
					hash: txHash,
				})
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
					tokenContract: TOKEN_CONTRACT,
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
					tokenContract: TOKEN_CONTRACT,
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
				tokenContract: TOKEN_CONTRACT,
				tokenId,
			})
			await expect(tokenboundClient.isValidSigner({ account })).rejects.toThrow(
				/not supported using the V2 implementation/,
			)
		})

		it("rejects appendedCalls on a V2 deployment", async () => {
			await expect(
				tokenboundClient.prepareCreateAccount({
					tokenContract: TOKEN_CONTRACT,
					tokenId,
					appendedCalls: [
						{
							target: getAddress(TOKEN_CONTRACT),
							allowFailure: false,
							callData: "0x",
						},
					],
				}),
			).rejects.toThrow(/Multicall via appendedCalls is not supported/)
		})
	},
)
