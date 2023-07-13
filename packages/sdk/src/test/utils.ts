import { createPublicClient, createWalletClient, http } from 'viem'
import { foundry } from 'viem/chains'
import { chainIdToChain } from '../utils'
import { ANVIL_ACCOUNTS } from './anvilTestAccounts'

export const ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}/
export const ANVIL_RPC_URL = foundry.rpcUrls.default.http[0]

export const getMockWalletClient = () =>
  createWalletClient({
    transport: http(ANVIL_RPC_URL),
    chain: foundry,
    account: ANVIL_ACCOUNTS[0].address,
    key: ANVIL_ACCOUNTS[0].privateKey,
    pollingInterval: 100,
  })

  export const getPublicClient = ({
    chainId = foundry.id,
  }: {
    chainId?: number
  }) => {
  
    const chain = chainIdToChain(chainId)
  
    if (!chain) throw new Error(`Chain ${chainId} not found`)
  
    return createPublicClient({
      transport: http(ANVIL_RPC_URL),
      chain,
      pollingInterval: 100,
    })
  }