import { TransactionRequestEIP1559 } from 'viem'
export type MultiCallTx = Omit<
  TransactionRequestEIP1559<bigint, number, 'eip1559'>,
  'from' | 'account'
>
