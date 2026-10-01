// Cross-chain encoding, with the fee quote served by a stub.
//
// The fork-backed suites run a single anvil instance, so a genuine two-chain
// flow is out of reach there — but the encoding is deterministic given a quote,
// which is what these cover. ProtocolCaller exists precisely so the read can be
// stubbed without a client.

import { decodeFunctionData, type Hex, parseAbi } from "viem"
import { describe, expect, it } from "vitest"
import { LZ_EIDS, LZ_EXECUTORS } from "../../protocol/constants"
import {
	encodeCrossChainCall,
	type ProtocolCaller,
} from "../../protocol/functions"

const ORIGIN_CHAIN_ID = 1
const DESTINATION_CHAIN_ID = 8453
const ACCOUNT = "0x5F50CAf6244d10C32965354F8c4d84D84503D42D" as const
const TARGET = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" as const

const NATIVE_FEE = 1_000_000_000_000_000n // 0.001 ETH
const LZ_TOKEN_FEE = 0n

/** quote() returns (uint256 nativeFee, uint256 lzTokenFee). */
const encodeQuote = (nativeFee: bigint, lzTokenFee = 0n): Hex =>
	`0x${nativeFee.toString(16).padStart(64, "0")}${lzTokenFee
		.toString(16)
		.padStart(64, "0")}`

/** Records the call it was asked to make, and answers with a fixed quote. */
const stubCaller = (
	returnData: Hex = encodeQuote(NATIVE_FEE, LZ_TOKEN_FEE),
): ProtocolCaller & { calls: Array<{ to: string; data: Hex }> } => {
	const calls: Array<{ to: string; data: Hex }> = []
	return {
		calls,
		call: async (tx) => {
			calls.push({ to: tx.to, data: tx.data })
			return returnData
		},
	}
}

const params = {
	account: ACCOUNT,
	to: TARGET,
	value: 0n,
	data: "0x" as Hex,
	originChainId: ORIGIN_CHAIN_ID,
	destinationChainId: DESTINATION_CHAIN_ID,
}

describe("encodeCrossChainCall", () => {
	it("targets the origin chain's LayerZero executor", async () => {
		const result = await encodeCrossChainCall({
			caller: stubCaller(),
			...params,
		})
		expect(result.to).toBe(LZ_EXECUTORS[ORIGIN_CHAIN_ID])
	})

	it("carries the quoted native fee as the tx value", async () => {
		const result = await encodeCrossChainCall({
			caller: stubCaller(),
			...params,
		})
		// The encoder adds a small buffer over the quote.
		expect(result.value).toBe(NATIVE_FEE + 10n)
	})

	it("quotes against the executor before encoding", async () => {
		const caller = stubCaller()
		await encodeCrossChainCall({ caller, ...params })

		expect(caller.calls).toHaveLength(1)
		expect(caller.calls[0].to).toBe(LZ_EXECUTORS[ORIGIN_CHAIN_ID])

		// The quote is made with the destination's endpoint id, not its chain id.
		const quoteAbi = parseAbi([
			"function quote(uint32 eid, address sender, bytes calldata payload, bytes calldata options) external view returns (uint256 nativeFee, uint256 lzTokenFee)",
		])
		const decoded = decodeFunctionData({
			abi: quoteAbi,
			data: caller.calls[0].data,
		})
		expect(decoded.functionName).toBe("quote")
		expect(decoded.args[0]).toBe(LZ_EIDS[DESTINATION_CHAIN_ID])
		expect(decoded.args[1]).toBe(ACCOUNT)
	})

	it("encodes an execute() call on the executor", async () => {
		const result = await encodeCrossChainCall({
			caller: stubCaller(),
			...params,
		})

		const executeAbi = parseAbi([
			"function execute(uint32 eid, bytes calldata payload, bytes calldata options) external payable",
		])
		const decoded = decodeFunctionData({ abi: executeAbi, data: result.data })
		expect(decoded.functionName).toBe("execute")
		expect(decoded.args[0]).toBe(LZ_EIDS[DESTINATION_CHAIN_ID])
	})

	it("sends the same options blob to quote() and execute()", async () => {
		const caller = stubCaller()
		const result = await encodeCrossChainCall({ caller, ...params })

		// A mismatch here would mean paying for one configuration and requesting
		// another, so the two must agree.
		const quoteAbi = parseAbi([
			"function quote(uint32 eid, address sender, bytes calldata payload, bytes calldata options) external view returns (uint256 nativeFee, uint256 lzTokenFee)",
		])
		const executeAbi = parseAbi([
			"function execute(uint32 eid, bytes calldata payload, bytes calldata options) external payable",
		])
		const quoted = decodeFunctionData({
			abi: quoteAbi,
			data: caller.calls[0].data,
		})
		const executed = decodeFunctionData({ abi: executeAbi, data: result.data })

		expect(executed.args[2]).toBe(quoted.args[3])
		// Same payload, too.
		expect(executed.args[1]).toBe(quoted.args[2])
	})

	it("reports an empty quote rather than failing in the decoder", async () => {
		await expect(
			encodeCrossChainCall({ caller: stubCaller("0x"), ...params }),
		).rejects.toThrow(/returned no fee quote/)
	})

	it("gives context when the quote call reverts", async () => {
		const failing: ProtocolCaller = {
			call: async () => {
				throw new Error("execution reverted")
			},
		}
		await expect(
			encodeCrossChainCall({ caller: failing, ...params }),
		).rejects.toThrow(/Failed to quote the LayerZero fee/)
	})
})
