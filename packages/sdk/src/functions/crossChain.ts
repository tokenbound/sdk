import { PublicClient, encodeFunctionData, parseAbi } from 'viem'
import { ERC_6551_DEFAULT, LZ_EXECUTORS, LZ_EIDS } from '../constants'
import { Options } from '@layerzerolabs/lz-v2-utilities'
import { CallData } from '../types'

type CrossChainCallParams = {
  publicClient: PublicClient
  account: `0x${string}`
  originChainId: number
  destinationChainId: number
} & CallData

export async function encodeCrossChainCall(
  params: CrossChainCallParams
): Promise<CallData> {
  const { originChainId, destinationChainId, to, value, data, account, publicClient } =
    params

  const lzExecutorAbi = parseAbi([
    'function quote(uint32 eid, address sender, bytes calldata payload, bytes calldata options) external view returns (uint256 nativeFee, uint256 lzTokenFee)',
    'function execute(uint32 eid, bytes calldata payload, bytes calldata options) external payable',
  ])

  const lzExecutor = LZ_EXECUTORS[originChainId]
  const lzEid = LZ_EIDS[destinationChainId]

  const destinationExecutionData = encodeFunctionData({
    abi: ERC_6551_DEFAULT.IMPLEMENTATION.ABI,
    functionName: 'execute',
    args: [to, value, data, 0],
  })

  const txOptions = Options.newOptions().addExecutorLzReceiveOption(200000, 0)

  const txOptionsHex = txOptions.toHex() as `0x${string}`

  const quoteData = await publicClient.readContract({
    address: lzExecutor,
    abi: lzExecutorAbi,
    functionName: 'quote',
    args: [lzEid, account, destinationExecutionData, txOptionsHex],
  })

  const txValue = quoteData.at(0) || 0n

  const encodedLzCall = encodeFunctionData({
    abi: lzExecutorAbi,
    functionName: 'execute',
    args: [lzEid, destinationExecutionData, txOptionsHex],
  })

  return {
    to: lzExecutor,
    value: txValue + 10n,
    data: encodedLzCall,
  }
}
