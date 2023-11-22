import { TransactionRequestEIP1559 } from 'viem'
import { Prettify } from './prettify'
export type MultiCallTx = Prettify<
  Omit<TransactionRequestEIP1559<bigint, number, 'eip1559'>, 'from' | 'account'> & {
    chainId?: number
  }
>
