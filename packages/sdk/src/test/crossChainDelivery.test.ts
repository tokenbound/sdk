// Cross-chain execution, sent on one fork and delivered on another.
//
// crossChain.test.ts proves the origin transaction is encoded and funded
// correctly. This suite goes further: it sends that transaction on a mainnet
// fork, takes the packet LayerZero would carry, and delivers it on a Base fork,
// asserting the call actually runs there.
//
// Both forks run the real deployed contracts locally; the relay between them is
// simulated (see test-fixtures/src/layerzero.ts), standing in for LayerZero's
// off-chain verifiers (DVNs) and executor.
//
// What passing proves: everything on-chain on both sides works — LayerZero's
// endpoint accepting the fee and the packet, Tokenbound's executor decoding it,
// the account guardian trusting that executor on Base, the account executing
// the call, and the SDK's 200,000 gas covering it.
//
// What it does not prove: that LayerZero will deliver in production. The
// simulated relay acts as the receive library, skipping the DVN attestations
// and the library's quorum check, so a missing or broken DVN configuration for
// this route would pass here and fail for real. Confirmation timing and
// LayerZero's off-chain services are untested too.

import {
	ANVIL_ACCOUNTS,
	bytes32ToAddress,
	createBaseForkInstance,
	createForkInstance,
	deliverPacket,
	findSentPacket,
	isAddressMatch,
	type LayerZeroPacket,
	pollForReceipt,
	RECIPIENT_ADDRESS,
	zora721,
} from "@tokenbound/test-fixtures"
import {
	type Address,
	createPublicClient,
	createTestClient,
	createWalletClient,
	decodeAbiParameters,
	decodeFunctionData,
	encodeFunctionData,
	type Hex,
	http,
	type PublicClient,
	parseEther,
	type TestClient,
	type TransactionReceipt,
	type WalletClient,
} from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { base, mainnet } from "viem/chains"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { TokenboundClient } from "../"
import { ERC_6551_DEFAULT, LZ_EIDS, LZ_EXECUTORS } from "../protocol/constants"

const TIMEOUT = 120_000

/** The ETH the account sends on the destination chain. */
const TRANSFER = parseEther("0.001")

/**
 * The gas LayerZero's executor forwards on delivery. Must match the
 * `addExecutorLzReceiveOption(200000, 0)` options the SDK sends, so that a
 * passing delivery shows the SDK requests enough.
 */
const EXECUTOR_GAS = 200_000n

describe("cross-chain execution, delivered end to end (mainnet → Base)", () => {
	const originFork = createForkInstance()
	const destinationFork = createBaseForkInstance()
	const eoa = privateKeyToAccount(ANVIL_ACCOUNTS[0].privateKey)

	let originPublic: PublicClient
	let destinationPublic: PublicClient
	let destinationTest: TestClient
	let originClient: TokenboundClient

	/** The tokenbound account — one address, deployed on both chains. */
	let account: Address
	let originReceipt: TransactionReceipt
	let packet: LayerZeroPacket

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

		const originWallet = createWalletClient({
			chain: mainnet,
			account: eoa,
			transport: http(originFork.url),
		}) as WalletClient
		const destinationWallet = createWalletClient({
			chain: base,
			account: eoa,
			transport: http(destinationFork.url),
		}) as WalletClient

		originClient = new TokenboundClient({
			chain: mainnet,
			walletClient: originWallet,
			publicClient: originPublic,
		})
		const destinationClient = new TokenboundClient({
			chain: base,
			walletClient: destinationWallet,
			publicClient: destinationPublic,
		})

		// The NFT lives on mainnet, so the account is defined by it there.
		const mintHash = await originWallet.sendTransaction({
			account: eoa,
			chain: mainnet,
			to: zora721.proxyContractAddress,
			value: zora721.mintPrice,
			data: encodeFunctionData({
				abi: zora721.abi,
				functionName: "purchase",
				args: [1n],
			}),
		})
		const mint = await pollForReceipt(originPublic, mintHash)
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
		const fundHash = await destinationWallet.sendTransaction({
			account: eoa,
			chain: base,
			to: account,
			value: TRANSFER,
		})
		await pollForReceipt(destinationPublic, fundHash)

		// The call under test: execute on Base, from mainnet.
		const sendHash = await originClient.execute({
			account,
			to: RECIPIENT_ADDRESS,
			value: TRANSFER,
			data: "0x",
			chainId: base.id,
		})
		originReceipt = await pollForReceipt(originPublic, sendHash)
		packet = findSentPacket(originReceipt)
	}, TIMEOUT)

	afterAll(async () => {
		await Promise.all([originFork.stop(), destinationFork.stop()])
	})

	it("sends through LayerZero on the origin chain", () => {
		// A send with too small a fee reverts in LayerZero's endpoint, so a
		// successful transaction also shows the quoted fee was enough.
		expect(originReceipt.status).toBe("success")

		expect(packet.srcEid).toBe(LZ_EIDS[mainnet.id])
		expect(packet.dstEid).toBe(LZ_EIDS[base.id])
		// Tokenbound's executor is its own peer on every chain.
		expect(
			isAddressMatch(bytes32ToAddress(packet.sender), LZ_EXECUTORS[mainnet.id]),
		).toBe(true)
		expect(
			isAddressMatch(bytes32ToAddress(packet.receiver), LZ_EXECUTORS[base.id]),
		).toBe(true)
	})

	it("carries the account's execute() call as the message", () => {
		const [sender, payload] = decodeAbiParameters(
			[{ type: "address" }, { type: "bytes" }],
			packet.message,
		)
		// The executor calls `sender` on the destination, so this must be the
		// account, not the user's wallet.
		expect(isAddressMatch(sender, account)).toBe(true)

		const call = decodeFunctionData({
			abi: ERC_6551_DEFAULT.IMPLEMENTATION.ABI,
			data: payload as Hex,
		})
		expect(call.functionName).toBe("execute")
		const [to, value, data, operation] = call.args as [
			Address,
			bigint,
			Hex,
			number,
		]
		expect(isAddressMatch(to, RECIPIENT_ADDRESS)).toBe(true)
		expect(value).toBe(TRANSFER)
		expect(data).toBe("0x")
		expect(operation).toBe(0)
	})

	it(
		"delivers on the destination and runs the call, within the executor gas",
		async () => {
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
			// Succeeding within EXECUTOR_GAS shows the gas the SDK requests is
			// enough for this call. The account accepting the executor at all
			// shows the guardian trusts it on Base.
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
})
