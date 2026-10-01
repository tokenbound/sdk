import { Options } from "@layerzerolabs/lz-v2-utilities"
import {
	type Address,
	decodeFunctionResult,
	encodeFunctionData,
	type Hex,
	parseAbi,
} from "viem"
import type { CallData, Prettify } from "../../types"
import { ERC_6551_DEFAULT, LZ_EIDS, LZ_EXECUTORS } from "../constants"

/**
 * A read-only `eth_call` returning raw return data.
 *
 * Satisfied by a viem client and by @tokenbound/ethers' adapter, so cross-chain
 * encoding works on either.
 */
export type ProtocolCaller = {
	call: (tx: { to: Address; data: Hex }) => Promise<Hex>
}

type CrossChainCallParams = Prettify<
	{
		caller: ProtocolCaller
		account: `0x${string}`
		originChainId: number
		destinationChainId: number
	} & CallData
>

export async function encodeCrossChainCall(
	params: CrossChainCallParams,
): Promise<CallData> {
	const {
		originChainId,
		destinationChainId,
		to,
		value,
		data,
		account,
		caller,
	} = params

	const lzExecutorAbi = parseAbi([
		"function quote(uint32 eid, address sender, bytes calldata payload, bytes calldata options) external view returns (uint256 nativeFee, uint256 lzTokenFee)",
		"function execute(uint32 eid, bytes calldata payload, bytes calldata options) external payable",
	])

	const lzExecutor = LZ_EXECUTORS[originChainId]
	const lzEid = LZ_EIDS[destinationChainId]

	const destinationExecutionData = encodeFunctionData({
		abi: ERC_6551_DEFAULT.IMPLEMENTATION.ABI,
		functionName: "execute",
		args: [to, value, data, 0],
	})

	const txOptions = Options.newOptions().addExecutorLzReceiveOption(200000, 0)

	const txOptionsHex = txOptions.toHex() as `0x${string}`

	// Encoded by hand rather than via readContract(), which is viem-only. A
	// revert arrives as a bare call failure, so it is given context.
	let quoteResult: Hex
	try {
		quoteResult = await caller.call({
			to: lzExecutor,
			data: encodeFunctionData({
				abi: lzExecutorAbi,
				functionName: "quote",
				args: [lzEid, account, destinationExecutionData, txOptionsHex],
			}),
		})
	} catch (error) {
		throw new Error(
			`Failed to quote the LayerZero fee for chain ${destinationChainId} (executor ${lzExecutor}): ${
				error instanceof Error ? error.message : String(error)
			}`,
		)
	}

	if (quoteResult === "0x") {
		throw new Error(
			`The LayerZero executor at ${lzExecutor} returned no fee quote for chain ${destinationChainId}. Is cross-chain execution supported from chain ${originChainId}?`,
		)
	}

	const [nativeFee] = decodeFunctionResult({
		abi: lzExecutorAbi,
		functionName: "quote",
		data: quoteResult,
	})

	const txValue = nativeFee ?? 0n

	const encodedLzCall = encodeFunctionData({
		abi: lzExecutorAbi,
		functionName: "execute",
		args: [lzEid, destinationExecutionData, txOptionsHex],
	})

	return {
		to: lzExecutor,
		value: txValue + 10n,
		data: encodedLzCall,
	}
}
