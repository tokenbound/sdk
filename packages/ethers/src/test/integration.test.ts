// Anvil-backed integration tests for @tokenbound/ethers.
//
// ethers v5 and ethers v6 are exercised INDEPENDENTLY against a fresh anvil
// fork each, so a behavioral difference in one major version cannot be masked
// by the other.

import { createAnvil } from "@viem/anvil"
import { ethers } from "ethers"
import { JsonRpcProvider, Wallet } from "ethers6"
import {
	createPublicClient,
	encodeFunctionData,
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

// Zora "Webb's First Deep Field" — an open, free public mint on mainnet, so the
// anvil account can mint itself the NFT that controls the tokenbound account.
const TOKEN_CONTRACT = "0x28ee638f2fcb66b4106acab7efd225aeb2bd7e8d" as const
const ZORA_721_ABI = parseAbi([
	"function purchase(uint256 quantity) external payable returns (uint256)",
	"function totalSupply() external view returns (uint256)",
	"function ownerOf(uint256 tokenId) external view returns (address)",
])

// Set in beforeAll once the anvil account has minted.
let TOKEN_ID = "1"

const FORK_URL =
	process.env.VITE_ANVIL_MAINNET_FORK_ENDPOINT ??
	"https://ethereum-rpc.publicnode.com"

/** Each ethers major version gets its own anvil so nonces never collide. */
const PORT_FOR_VERSION = { 5: 8545, 6: 8546 } as const

const rpcUrlFor = (version: 5 | 6) =>
	`http://127.0.0.1:${PORT_FOR_VERSION[version]}`

/** Builds a signer for the requested ethers major version and anvil account. */
function makeSignerForAccount(version: 5 | 6, accountIndex: 0 | 1) {
	const rpcUrl = rpcUrlFor(version)
	const { privateKey } = ANVIL_ACCOUNTS[accountIndex]
	if (version === 5) {
		const provider = new ethers.providers.JsonRpcProvider(rpcUrl)
		return new ethers.Wallet(privateKey, provider)
	}
	const provider = new JsonRpcProvider(rpcUrl)
	return new Wallet(privateKey, provider)
}

/** Builds a signer on anvil account #0 for the requested ethers version. */
function makeSigner(version: 5 | 6) {
	return makeSignerForAccount(version, 0)
}

describe.each([{ version: 5 as const }, { version: 6 as const }])(
	"ethers v$version",
	({ version }) => {
		const anvil = createAnvil({
			forkUrl: FORK_URL,
			port: PORT_FOR_VERSION[version],
		})
		let tokenboundClient: TokenboundClient
		let publicClient: PublicClient
		// One signer per version: separate ethers signers on the same account
		// track nonces independently and collide.
		let signer: ReturnType<typeof makeSigner>

		beforeAll(async () => {
			await anvil.start()

			publicClient = createPublicClient({
				chain: mainnet,
				transport: http(rpcUrlFor(version)),
			}) as PublicClient

			// Mint a Zora 721 into the anvil account so it owns the NFT that
			// controls the tokenbound account under test.
			signer = makeSigner(version)
			const mintTx = await signer.sendTransaction({
				to: TOKEN_CONTRACT,
				value: 0n,
				data: encodeFunctionData({
					abi: ZORA_721_ABI,
					functionName: "purchase",
					args: [1n],
				}),
			})
			await mintTx.wait()

			// Read the minted tokenId out of the Transfer log rather than guessing
			// from totalSupply, which is not the minted id on this contract.
			const mintReceipt = await publicClient.waitForTransactionReceipt({
				hash: mintTx.hash as `0x${string}`,
			})
			const transferLog = mintReceipt.logs.find(
				(log) =>
					log.address.toLowerCase() === TOKEN_CONTRACT.toLowerCase() &&
					log.topics[0] ===
						"0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef" &&
					log.topics.length === 4,
			)
			if (!transferLog?.topics[3]) {
				throw new Error("Could not determine minted tokenId from mint receipt")
			}
			TOKEN_ID = BigInt(transferLog.topics[3]).toString()
			const owner = await publicClient.readContract({
				address: TOKEN_CONTRACT,
				abi: ZORA_721_ABI,
				functionName: "ownerOf",
				args: [BigInt(TOKEN_ID)],
			})
			if (owner.toLowerCase() !== ANVIL_ACCOUNTS[0].address.toLowerCase()) {
				throw new Error(`Minted token ${TOKEN_ID} is owned by ${owner}`)
			}

			tokenboundClient = new TokenboundClient({
				signer,
				chain: mainnet,
				publicClient,
			})
		}, TIMEOUT)

		afterAll(async () => {
			await anvil.stop()
		})

		it("detects the correct ethers version", () => {
			expect(tokenboundClient.getEthersVersion()).toBe(version)
		})

		it("derives a tokenbound account address", () => {
			const account = tokenboundClient.getAccount({
				tokenContract: TOKEN_CONTRACT,
				tokenId: TOKEN_ID,
			})
			expect(isAddress(account)).toBe(true)
			expect(account).toMatch(ADDRESS_REGEX)
		})

		it("derives the same address across both ethers versions", () => {
			// Derivation is deterministic and client-independent, so v5 and v6
			// must agree with each other.
			const account = tokenboundClient.getAccount({
				tokenContract: TOKEN_CONTRACT,
				tokenId: TOKEN_ID,
			})
			// Derivation is pure, so a read-only client on the other ethers major
			// version must produce the same address.
			const other = new TokenboundClient({
				signer: makeSigner(version === 5 ? 6 : 5),
				chain: mainnet,
				publicClient,
			}).getAccount({ tokenContract: TOKEN_CONTRACT, tokenId: TOKEN_ID })
			expect(account).toBe(other)
		})

		it("honours a custom salt", () => {
			const base = tokenboundClient.getAccount({
				tokenContract: TOKEN_CONTRACT,
				tokenId: TOKEN_ID,
			})
			const salted = tokenboundClient.getAccount({
				tokenContract: TOKEN_CONTRACT,
				tokenId: TOKEN_ID,
				salt: 6551,
			})
			expect(salted).not.toBe(base)
		})

		it("prepares a create-account transaction", async () => {
			const prepared = await tokenboundClient.prepareCreateAccount({
				tokenContract: TOKEN_CONTRACT,
				tokenId: TOKEN_ID,
			})
			expect(prepared.data).toMatch(/^0x/)
			expect(prepared.to).toMatch(ADDRESS_REGEX)
		})

		it(
			"creates a tokenbound account on-chain",
			async () => {
				const { account, txHash } = await tokenboundClient.createAccount({
					tokenContract: TOKEN_CONTRACT,
					tokenId: TOKEN_ID,
				})

				expect(account).toMatch(ADDRESS_REGEX)
				expect(txHash).toMatch(TX_HASH_REGEX)

				const receipt = await publicClient.waitForTransactionReceipt({
					hash: txHash,
				})
				expect(receipt.status).toBe("success")
			},
			TIMEOUT,
		)

		it(
			"reports the account as deployed after creation",
			async () => {
				const account = tokenboundClient.getAccount({
					tokenContract: TOKEN_CONTRACT,
					tokenId: TOKEN_ID,
				})
				const isDeployed = await tokenboundClient.checkAccountDeployment({
					accountAddress: account,
				})
				expect(isDeployed).toBe(true)
			},
			TIMEOUT,
		)

		it(
			"deconstructs the deployed account bytecode",
			async () => {
				const account = tokenboundClient.getAccount({
					tokenContract: TOKEN_CONTRACT,
					tokenId: TOKEN_ID,
				})
				const bytecode = await tokenboundClient.deconstructBytecode({
					accountAddress: account,
				})
				expect(bytecode).not.toBeNull()
				expect(bytecode?.chainId).toBe(mainnet.id)
				expect(bytecode?.tokenId).toBe(TOKEN_ID)
			},
			TIMEOUT,
		)

		it(
			"returns the owning NFT for a deployed account",
			async () => {
				const account = tokenboundClient.getAccount({
					tokenContract: TOKEN_CONTRACT,
					tokenId: TOKEN_ID,
				})
				const nft = await tokenboundClient.getNFT({ accountAddress: account })
				expect(nft.tokenId).toBe(TOKEN_ID)
				expect(nft.chainId).toBe(mainnet.id)
			},
			TIMEOUT,
		)

		it(
			"prepares an execution against the account",
			async () => {
				const account = tokenboundClient.getAccount({
					tokenContract: TOKEN_CONTRACT,
					tokenId: TOKEN_ID,
				})
				const prepared = await tokenboundClient.prepareExecution({
					account,
					to: ANVIL_ACCOUNTS[1].address,
					value: 0n,
					data: "0x",
				})
				expect(prepared.to).toBe(account)
				expect(prepared.data).toMatch(/^0x/)
			},
			TIMEOUT,
		)

		it(
			"signs a message",
			async () => {
				const signature = await tokenboundClient.signMessage({
					message: "Sign me",
				})
				expect(signature).toMatch(/^0x[a-fA-F0-9]+$/)
			},
			TIMEOUT,
		)

		it("rejects out-of-range ERC-20 decimals", async () => {
			const account = tokenboundClient.getAccount({
				tokenContract: TOKEN_CONTRACT,
				tokenId: TOKEN_ID,
			})
			await expect(
				tokenboundClient.transferERC20({
					account,
					recipientAddress: ANVIL_ACCOUNTS[1].address,
					amount: 1,
					erc20tokenAddress: TOKEN_CONTRACT,
					erc20tokenDecimals: 19,
				}),
			).rejects.toThrow(/Decimal value out of range/)
		})

		it("rejects ERC721 transfers with an amount other than 1", async () => {
			const account = tokenboundClient.getAccount({
				tokenContract: TOKEN_CONTRACT,
				tokenId: TOKEN_ID,
			})
			await expect(
				tokenboundClient.transferNFT({
					account,
					tokenType: "ERC721",
					tokenContract: TOKEN_CONTRACT,
					tokenId: TOKEN_ID,
					recipientAddress: ANVIL_ACCOUNTS[1].address,
					amount: 2,
				}),
			).rejects.toThrow(/ERC721 transfers can only transfer one token/)
		})
	},
)
