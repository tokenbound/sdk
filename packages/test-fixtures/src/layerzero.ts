// Simulated LayerZero V2 delivery between two forks.
//
// The forks are local anvil processes running the real deployed contracts
// against real chain state; nothing is broadcast to a live network. Two forks
// cannot see each other, and in production LayerZero is what connects them:
//
//   1. Verification: off-chain DVNs watch the origin chain for PacketSent and
//      attest to it on the destination's receive library, which then calls
//      `endpoint.verify` once enough of them agree.
//   2. Execution: LayerZero's off-chain executor calls `endpoint.lzReceive`
//      with the gas the sender paid for.
//
// This module stands in for both. It carries the packet bytes across from the
// origin receipt, impersonates the receive library to call `verify` directly,
// then calls the permissionless `lzReceive` under the sender's gas limit.
//
// Acting as the receive library skips the DVN attestations and the library's
// quorum check, so delivery here says nothing about whether LayerZero itself
// would deliver. What that leaves proven is described where it is relied on,
// in packages/sdk/src/test/crossChainDelivery.test.ts.

import {
	type Address,
	concatHex,
	createWalletClient,
	decodeEventLog,
	encodeFunctionData,
	type Hex,
	hexToBigInt,
	hexToNumber,
	http,
	keccak256,
	type PublicClient,
	parseAbi,
	sliceHex,
	type TestClient,
	type TransactionReceipt,
} from "viem"

/** EndpointV2, deployed at the same address on every chain this suite forks. */
export const LAYERZERO_ENDPOINT_V2: Address =
	"0x1a44076050125825900e736c501f859c50fE728c"

export const layerZeroEndpointAbi = parseAbi([
	"event PacketSent(bytes encodedPayload, bytes options, address sendLibrary)",
	"struct Origin { uint32 srcEid; bytes32 sender; uint64 nonce; }",
	"function getReceiveLibrary(address receiver, uint32 srcEid) view returns (address lib, bool isDefault)",
	"function inboundNonce(address receiver, uint32 srcEid, bytes32 sender) view returns (uint64)",
	"function verify(Origin origin, address receiver, bytes32 payloadHash)",
	"function lzReceive(Origin origin, address receiver, bytes32 guid, bytes message, bytes extraData) payable",
])

/** A LayerZero V2 packet (PacketV1Codec layout). */
export type LayerZeroPacket = {
	nonce: bigint
	srcEid: number
	/** The sending OApp, left-padded to 32 bytes. */
	sender: Hex
	dstEid: number
	/** The receiving OApp, left-padded to 32 bytes. */
	receiver: Hex
	guid: Hex
	message: Hex
}

/**
 * Decodes PacketV1Codec bytes: version (1) · nonce (8) · srcEid (4) ·
 * sender (32) · dstEid (4) · receiver (32) · guid (32) · message (rest).
 */
export function decodePacket(encoded: Hex): LayerZeroPacket {
	return {
		nonce: hexToBigInt(sliceHex(encoded, 1, 9)),
		srcEid: hexToNumber(sliceHex(encoded, 9, 13)),
		sender: sliceHex(encoded, 13, 45),
		dstEid: hexToNumber(sliceHex(encoded, 45, 49)),
		receiver: sliceHex(encoded, 49, 81),
		guid: sliceHex(encoded, 81, 113),
		message: sliceHex(encoded, 113),
	}
}

/** Finds the packet an origin-chain transaction handed to LayerZero. */
export function findSentPacket(receipt: TransactionReceipt): LayerZeroPacket {
	for (const log of receipt.logs) {
		if (log.address.toLowerCase() !== LAYERZERO_ENDPOINT_V2.toLowerCase()) {
			continue
		}
		try {
			const event = decodeEventLog({
				abi: layerZeroEndpointAbi,
				data: log.data,
				topics: log.topics,
			})
			if (event.eventName === "PacketSent") {
				return decodePacket(event.args.encodedPayload)
			}
		} catch {
			// Another endpoint event; keep looking.
		}
	}
	throw new Error(
		`Transaction ${receipt.transactionHash} sent no LayerZero packet`,
	)
}

/** Intrinsic gas for a plain call: the base cost plus calldata (EIP-2028). */
function intrinsicGas(data: Hex): bigint {
	let cost = 21000n
	for (let i = 2; i < data.length; i += 2) {
		cost += data.slice(i, i + 2) === "00" ? 4n : 16n
	}
	return cost
}

/** Truncates a 32-byte LayerZero address back to its 20-byte form. */
export const bytes32ToAddress = (value: Hex): Address =>
	`0x${value.slice(-40)}` as Address

/**
 * Delivers a packet on the destination fork the way LayerZero would: verify it
 * as the trusted receive library, then call `lzReceive`.
 *
 * `gasLimit` caps the gas available to `lzReceive` execution, mirroring the
 * gas the sender requested in its executor options — LayerZero's executor
 * forwards exactly that much when it delivers.
 *
 * @returns the delivery transaction's receipt.
 */
export async function deliverPacket(params: {
	packet: LayerZeroPacket
	publicClient: PublicClient
	testClient: TestClient
	rpcUrl: string
	gasLimit: bigint
}): Promise<TransactionReceipt> {
	const { packet, publicClient, testClient, rpcUrl, gasLimit } = params
	const receiver = bytes32ToAddress(packet.receiver)
	const origin = {
		srcEid: packet.srcEid,
		sender: packet.sender,
		nonce: packet.nonce,
	}

	// LayerZero delivers each path in order. If the fork caught a real message
	// in flight, ours cannot be delivered until that one is — say so plainly
	// rather than surface the endpoint's nonce revert.
	const inbound = await publicClient.readContract({
		address: LAYERZERO_ENDPOINT_V2,
		abi: layerZeroEndpointAbi,
		functionName: "inboundNonce",
		args: [receiver, packet.srcEid, packet.sender],
	})
	if (inbound !== packet.nonce - 1n) {
		throw new Error(
			`Cannot deliver nonce ${packet.nonce}: the destination has delivered up to ${inbound}, so ${packet.nonce - 1n - inbound} real message(s) on this path were in flight when the forks were taken. Re-run to fork a later block.`,
		)
	}

	const [receiveLibrary] = await publicClient.readContract({
		address: LAYERZERO_ENDPOINT_V2,
		abi: layerZeroEndpointAbi,
		functionName: "getReceiveLibrary",
		args: [receiver, packet.srcEid],
	})

	await testClient.impersonateAccount({ address: receiveLibrary })
	await testClient.setBalance({ address: receiveLibrary, value: 10n ** 18n })

	// No local account: anvil signs for the impersonated address.
	const asLibrary = createWalletClient({
		chain: publicClient.chain,
		transport: http(rpcUrl),
	})

	const verifyHash = await asLibrary.writeContract({
		account: receiveLibrary,
		chain: publicClient.chain,
		address: LAYERZERO_ENDPOINT_V2,
		abi: layerZeroEndpointAbi,
		functionName: "verify",
		args: [
			origin,
			receiver,
			keccak256(concatHex([packet.guid, packet.message])),
		],
	})
	await pollForReceipt(publicClient, verifyHash)

	// lzReceive is permissionless once verified; any caller works.
	const data = encodeFunctionData({
		abi: layerZeroEndpointAbi,
		functionName: "lzReceive",
		args: [origin, receiver, packet.guid, packet.message, "0x"],
	})
	const deliverHash = await asLibrary.sendTransaction({
		account: receiveLibrary,
		chain: publicClient.chain,
		to: LAYERZERO_ENDPOINT_V2,
		data,
		// A transaction's gas limit also pays its intrinsic cost; add it so
		// `gasLimit` is what execution actually gets.
		gas: intrinsicGas(data) + gasLimit,
	})
	const receipt = await pollForReceipt(publicClient, deliverHash)

	await testClient.stopImpersonatingAccount({ address: receiveLibrary })
	return receipt
}

/**
 * Polls for a receipt. viem's waitForTransactionReceipt relies on a block
 * watcher that does not reliably observe anvil's blocks, and stalls.
 */
export async function pollForReceipt(
	publicClient: PublicClient,
	hash: Hex,
	timeoutMs = 30000,
): Promise<TransactionReceipt> {
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
