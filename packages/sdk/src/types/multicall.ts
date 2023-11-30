import { TransactionRequestEIP1559 } from 'viem'

export type Call3 = {
  target: `0x${string}` // The target contract
  allowFailure: boolean // If false, the entire call will revert if the call fails.
  callData: `0x${string}` // Encoded function data to call on the target contract.
}

export type MultiCallTx = Omit<
  TransactionRequestEIP1559<bigint, number, 'eip1559'>,
  'from' | 'account'
>
