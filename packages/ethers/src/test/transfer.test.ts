// ETH transfer through a tokenbound account, ethers v5 and v6.
//
// Lives in its own file (and therefore its own anvil instances) because the
// flow mints, deploys and spends in sequence: sharing an account's nonce
// stream with another suite makes ethers v6's per-provider nonce cache stale.

import { createAnvil } from "@viem/anvil"
import { ethers } from "ethers"
import { JsonRpcProvider, Wallet } from "ethers6"
import {
	createPublicClient,
	createTestClient,
	encodeFunctionData,
	getAddress,
	http,
	type PublicClient,
	parseAbi,
} from "viem"
import { mainnet } from "viem/chains"
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest"

import { TokenboundClient } from "../index"
import { ANVIL_ACCOUNTS, TX_HASH_REGEX } from "./constants"

const TIMEOUT = 60000

const TOKEN_CONTRACT = "0x28ee638f2fcb66b4106acab7efd225aeb2bd7e8d" as const
const ZORA_721_ABI = parseAbi([
	"function purchase(uint256 quantity) external payable returns (uint256)",
])

const FORK_URL =
	process.env.VITE_ANVIL_MAINNET_FORK_ENDPOINT ??
	"https://ethereum-rpc.publicnode.com"

describe.each([{ version: 5 as const }, { version: 6 as const }])(
	"ethers v$version — ETH transfer",
	({ version }) => {
		// Randomized so a lingering anvil from a previous run can't be reused —
		// connecting to a stale instance yields already-spent nonces.
		const port =
			8600 + Math.floor(Math.random() * 300) + (version === 5 ? 0 : 300)
		const rpcUrl = `http://127.0.0.1:${port}`
		const anvil = createAnvil({ forkUrl: FORK_URL, port })

		let publicClient: PublicClient
		let testClient: ReturnType<typeof createTestClient>

		beforeAll(async () => {
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
		}, TIMEOUT)

		afterAll(async () => {
			await anvil.stop()
		})

		it(
			"transfers ETH out of a tokenbound account",
			async () => {
				const { privateKey } = ANVIL_ACCOUNTS[version === 5 ? 0 : 1]
				const signer =
					version === 5
						? new ethers.Wallet(
								privateKey,
								new ethers.providers.JsonRpcProvider(rpcUrl),
							)
						: new Wallet(privateKey, new JsonRpcProvider(rpcUrl))

				const client = new TokenboundClient({
					signer,
					chain: mainnet,
					publicClient,
				})

				// Mint the NFT that will control the account.
				const mint = await signer.sendTransaction({
					to: TOKEN_CONTRACT,
					value: 0n,
					data: encodeFunctionData({
						abi: ZORA_721_ABI,
						functionName: "purchase",
						args: [1n],
					}),
				})
				const mintReceipt = await publicClient.waitForTransactionReceipt({
					hash: mint.hash as `0x${string}`,
				})
				const transferLog = mintReceipt.logs.find(
					(log) =>
						log.address.toLowerCase() === TOKEN_CONTRACT.toLowerCase() &&
						log.topics.length === 4,
				)
				if (!transferLog?.topics[3]) {
					throw new Error("Could not determine minted tokenId")
				}
				const tokenId = BigInt(transferLog.topics[3]).toString()

				const account = client.getAccount({
					tokenContract: TOKEN_CONTRACT,
					tokenId,
				})

				await mint.wait()

				const { txHash: createHash } = await client.createAccount({
					tokenContract: TOKEN_CONTRACT,
					tokenId,
				})
				await publicClient.waitForTransactionReceipt({ hash: createHash })

				// Wait until the signer's provider sees the same nonce as the chain;
				// ethers v6 caches the pending count and can otherwise reuse it.
				const signerAddress = getAddress(await signer.getAddress())
				await vi.waitFor(async () => {
					const onChain = await publicClient.getTransactionCount({
						address: signerAddress,
					})
					const provider = signer.provider
					if (!provider) throw new Error("signer has no provider")
					const fromEthers = await provider.getTransactionCount(
						signerAddress,
						"pending",
					)
					expect(fromEthers).toBe(onChain)
				})

				// Fund via anvil rather than a second ethers transaction.
				await testClient.setBalance({ address: account, value: 10n ** 18n })

				// A fresh address nothing else touches, so the credit is unambiguous.
				const recipient = getAddress(
					"0x000000000000000000000000000000000000d00d",
				)
				const recipientBefore = await publicClient.getBalance({
					address: recipient,
				})
				const accountBefore = await publicClient.getBalance({
					address: account,
				})

				const txHash = await client.transferETH({
					account,
					recipientAddress: recipient,
					amount: 0.1,
				})
				expect(txHash).toMatch(TX_HASH_REGEX)

				const receipt = await publicClient.waitForTransactionReceipt({
					hash: txHash,
				})
				expect(receipt.status).toBe("success")

				const recipientAfter = await publicClient.getBalance({
					address: recipient,
				})
				const accountAfter = await publicClient.getBalance({ address: account })

				// The TBA pays no gas (the signer does), so both sides move by
				// exactly the transferred amount.
				expect(recipientAfter - recipientBefore).toBe(10n ** 17n)
				expect(accountBefore - accountAfter).toBe(10n ** 17n)
			},
			TIMEOUT,
		)
	},
)
