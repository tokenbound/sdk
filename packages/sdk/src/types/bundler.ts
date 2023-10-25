export type BundlerBase = {
  jsonrpc: string
  id: number
  error?: {
    message: string
  }
}

export interface BundlerGasPriceResponse extends BundlerBase {
  result: {
    maxPriorityFeePerGas: string
    maxFeePerGas: string
  }
}

export interface BundlerEstimateUserOperationGasResponse extends BundlerBase {
  result: {
    preVerificationGas: string
    verificationGasLimit: string
    verificationGas: string
    validUntil: string
    callGasLimit: string
    maxFeePerGas: string
    maxPriorityFeePerGas: string
  }
}

export interface BundlerSendUserOperationResponse extends BundlerBase {
  result: `0x${string}`
}

export interface BundlerTransactionReceiptResponse extends BundlerBase {
  result: {
    userOperation: UserOperation
    entryPoint: string
    transactionHash: string
    blockHash: string
    blockNumber: string
  } | null
}

export type UserOperation = {
  sender: string
  nonce: string
  initCode: string
  callData: string
  maxFeePerGas: string
  maxPriorityFeePerGas: string
  preVerificationGas: string
  verificationGasLimit: string
  callGasLimit: string
  paymasterAndData: string
  signature: string
}
