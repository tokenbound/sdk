import { createPublicClient, createWalletClient, http } from 'viem'
import { foundry } from 'viem/chains'
import { chainIdToChain } from '../../utils'
import { ANVIL_RPC_URL, ANVIL_ACCOUNTS } from '../constants'

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