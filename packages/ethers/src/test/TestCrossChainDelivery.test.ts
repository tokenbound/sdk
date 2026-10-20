// Cross-chain execution through @tokenbound/ethers, sent on one fork and
// delivered on another.
//
// TestCrossChain.test.ts proves the ethers client quotes and encodes the origin
// transaction exactly as the viem core does. This suite sends it: an ethers v5
// or v6 signer calls `execute` on a mainnet fork, and the packet LayerZero
// would carry is delivered on a Base fork, where the call must actually run.
//
// The relay between the forks is simulated, as in the viem suite's
// crossChainDelivery.test.ts, which spells out what passing does and does not
// prove. In short: everything on-chain on both sides is real; LayerZero's
// off-chain verifiers (DVNs) and executor are not.

import { ERC_6551_DEFAULT } from "@tokenbound/sdk"
import {
	ANVIL_ACCOUNTS,
	createBaseForkInstance,
	createForkInstance,
	deliverPacket,
	findSentPacket,
	isAddressMatch,
	pollForReceipt,
	RECIPIENT_ADDRESS,
	zora721,
} from "@tokenbound/test-fixtures"
import { ethers } from "ethers"
import { JsonRpcProvider, JsonRpcSigner } from "ethers6"
import {
	type Address,
	createPublicClient,
	createTestClient,
	createWalletClient,
	decodeAbiParameters,
	decodeFunctionData,
	encodeFunctionData,
	getAddress,
	type Hex,
	http,
	type PublicClient,
	parseEther,
	type TestClient,
} from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { base, type Chain, mainnet } from "viem/chains"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { TokenboundClient } from "../index"

const TIMEOUT = 120_000

/** The ETH the account sends on the destination chain. */
const TRANSFER = parseEther("0.001")

/** The gas the SDK asks LayerZero's executor to forward on delivery. */
const EXECUTOR_GAS = 200_000n

const eoa = privateKeyToAccount(ANVIL_ACCOUNTS[0].privateKey)

/** A TokenboundClient backed by an ethers v5 or v6 signer for `rpcUrl`. */
function ethersClient(version: 5 | 6, chain: Chain, rpcUrl: string) {
	const signer =
		version === 5
			? new ethers.Wallet(
					ANVIL_ACCOUNTS[0].privateKey,
					new ethers.providers.JsonRpcProvider(rpcUrl),
				)
			: new JsonRpcSigner(new JsonRpcProvider(rpcUrl), getAddress(eoa.address))
	return new TokenboundClient({ signer, chain })
}

describe.each([{ version: 5 as const }, { version: 6 as const }])(
	"ethers v$version — cross-chain execution, delivered end to end (mainnet → Base)",
	({ version }) => {
		const originFork = createForkInstance()
		const destinationFork = createBaseForkInstance()

		let originPublic: PublicClient
		let destinationPublic: PublicClient
		let destinationTest: TestClient

		/** The tokenbound account — one address, deployed on both chains. */
		let account: Address
		let sendHash: Hex

		beforeAll(async () => {
			await Promise.all([originFork.start(), destinationFork.start()])

			originPublic = createPublicClient({
				chain: mainnet,
				transport: http(originFork.url),
			}) as PublicClient
			destinationPublic = createPublicClient({
				chain: base,
				transport: http(destinationFork.url),
			}) as PublicClient
			destinationTest = createTestClient({
				chain: base,
				mode: "anvil",
				transport: http(destinationFork.url),
			})

			const originClient = ethersClient(version, mainnet, originFork.url)
			const destinationClient = ethersClient(version, base, destinationFork.url)

			// Setup that is not under test (the mint and the funding) goes through
			// viem; everything the SDK does goes through the ethers client.
			const originWallet = createWalletClient({
				chain: mainnet,
				account: eoa,
				transport: http(originFork.url),
			})
			const mint = await pollForReceipt(
				originPublic,
				await originWallet.sendTransaction({
					to: zora721.proxyContractAddress,
					value: zora721.mintPrice,
					data: encodeFunctionData({
						abi: zora721.abi,
						functionName: "purchase",
						args: [1n],
					}),
				}),
			)
			const transferLog = mint.logs.find(
				(log) =>
					isAddressMatch(log.address, zora721.proxyContractAddress) &&
					log.topics.length === 4,
			)
			if (!transferLog?.topics[3]) {
				throw new Error("Could not determine the minted tokenId")
			}
			const nft = {
				tokenContract: zora721.proxyContractAddress,
				tokenId: BigInt(transferLog.topics[3]).toString(),
			}

			// The account must exist on both chains. On Base it is created for the
			// mainnet NFT (chainId 1), which is what makes the address identical.
			const created = await originClient.createAccount(nft)
			await pollForReceipt(originPublic, created.txHash)
			account = created.account

			const mirrored = await destinationClient.createAccount({
				...nft,
				chainId: mainnet.id,
			})
			await pollForReceipt(destinationPublic, mirrored.txHash)
			if (mirrored.account !== account) {
				throw new Error(
					`Account addresses differ across chains: ${account} vs ${mirrored.account}`,
				)
			}

			// The destination call spends the account's Base balance: the LayerZero
			// executor forwards no ETH.
			const destinationWallet = createWalletClient({
				chain: base,
				account: eoa,
				transport: http(destinationFork.url),
			})
			await pollForReceipt(
				destinationPublic,
				await destinationWallet.sendTransaction({
					to: account,
					value: TRANSFER,
				}),
			)

			// The call under test: execute on Base, from mainnet, via ethers.
			sendHash = await originClient.execute({
				account,
				to: RECIPIENT_ADDRESS,
				value: TRANSFER,
				data: "0x",
				chainId: base.id,
			})
		}, TIMEOUT)

		afterAll(async () => {
			await Promise.all([originFork.stop(), destinationFork.stop()])
		})

		it(
			"sends the account's execute() call through LayerZero",
			async () => {
				const receipt = await pollForReceipt(originPublic, sendHash)
				// A send with too small a fee reverts in LayerZero's endpoint, so a
				// successful transaction also shows the ethers quote was enough.
				expect(receipt.status).toBe("success")

				const [sender, payload] = decodeAbiParameters(
					[{ type: "address" }, { type: "bytes" }],
					findSentPacket(receipt).message,
				)
				// The executor calls `sender` on the destination, so this must be
				// the account, not the ethers signer.
				expect(isAddressMatch(sender, account)).toBe(true)

				const call = decodeFunctionData({
					abi: ERC_6551_DEFAULT.IMPLEMENTATION.ABI,
					data: payload as Hex,
				})
				expect(call.functionName).toBe("execute")
				const [to, ...rest] = call.args as [Address, bigint, Hex, number]
				expect(isAddressMatch(to, RECIPIENT_ADDRESS)).toBe(true)
				expect(rest).toEqual([TRANSFER, "0x", 0])
			},
			TIMEOUT,
		)

		it(
			"delivers on the destination and runs the call, within the executor gas",
			async () => {
				const packet = findSentPacket(
					await pollForReceipt(originPublic, sendHash),
				)
				const [recipientBefore, accountBefore] = await Promise.all([
					destinationPublic.getBalance({ address: RECIPIENT_ADDRESS }),
					destinationPublic.getBalance({ address: account }),
				])

				const delivery = await deliverPacket({
					packet,
					publicClient: destinationPublic,
					testClient: destinationTest,
					rpcUrl: destinationFork.url,
					gasLimit: EXECUTOR_GAS,
				})
				expect(delivery.status).toBe("success")

				const [recipientAfter, accountAfter] = await Promise.all([
					destinationPublic.getBalance({ address: RECIPIENT_ADDRESS }),
					destinationPublic.getBalance({ address: account }),
				])
				expect(recipientAfter - recipientBefore).toBe(TRANSFER)
				expect(accountBefore - accountAfter).toBe(TRANSFER)
			},
			TIMEOUT,
		)
	},
)
