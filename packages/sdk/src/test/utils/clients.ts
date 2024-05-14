import {
  createPublicClient,
  WalletClient,
  PublicClient,
  createWalletClient,
  http,
  Chain,
} from 'viem'
import { foundry } from 'viem/chains'
// import { chainIdToChain } from '../../utils'
import { ANVIL_RPC_URL, ANVIL_ACCOUNTS } from '../constants'

export const getPublicClient = ({
  // chainId = foundry.id,
  chain,
}: {
  // chainId?: number
  chain: Chain
}): PublicClient => {
  // const chain = chainIdToChain(chainId)

  // if (!chain) throw new Error(`Chain ${chain.name} not found`)

  return createPublicClient({
    transport: http(ANVIL_RPC_URL),
    chain,
    pollingInterval: 100,
  })
}
