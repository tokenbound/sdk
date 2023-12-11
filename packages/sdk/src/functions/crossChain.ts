import { encodeFunctionData, parseAbi } from 'viem'
import { ERC_6551_DEFAULT } from '../constants'

type CrossChainCallParams = {
  to: `0x${string}`
  value: bigint
  data: `0x${string}`
  originChainId: number
  destinationChainId: number
}

type CrossChainCallData = {
  to: `0x${string}`
  value: bigint
  data: `0x${string}`
}

function encodeEthToPolygonCall(params: CrossChainCallParams): CrossChainCallData {
  const fxRoot = '0xfe5e5D361b2ad62c541bAb87C45a0B9B018389a2'
  const fxChildExecutor = '0x33937f3B8A9107E409931b70478aE716CB51aEE8'
  const { to, value, data } = params

  const l2ExecutionData = encodeFunctionData({
    abi: ERC_6551_DEFAULT.IMPLEMENTATION.ABI,
    functionName: 'execute',
    args: [to, value, data, 0],
  })

  const fxCallData = encodeFunctionData({
    abi: parseAbi(['function sendMessageToChild(address,bytes)']),
    functionName: 'sendMessageToChild',
    args: [fxChildExecutor, l2ExecutionData],
  })

  return {
    to: fxRoot,
    value: 0n,
    data: fxCallData,
  }
}

const SUPPORTED_ENCODERS: {
  [originChainId: number]: {
    [destinationChainId: number]: (params: CrossChainCallParams) => CrossChainCallData
  }
} = {
  1: {
    137: encodeEthToPolygonCall,
  },
}

export function encodeCrossChainCall(params: CrossChainCallParams): CrossChainCallData {
  const { originChainId, destinationChainId } = params

  const encoder = SUPPORTED_ENCODERS?.[originChainId]?.[destinationChainId]

  return encoder(params)
}
