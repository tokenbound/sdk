import { CreateAnvilOptions } from '@viem/anvil'
import { mainnet } from 'viem/chains'

const ACTIVE_CHAIN = mainnet

export const ANVIL_CONFIG = {
  TIMEOUT: 60000, // default 10000
  ACTIVE_CHAIN: ACTIVE_CHAIN,
}

export const CREATE_ANVIL_OPTIONS: CreateAnvilOptions = {
  forkChainId: ACTIVE_CHAIN.id,
  forkUrl: import.meta.env.VITE_ANVIL_MAINNET_FORK_ENDPOINT,
  forkBlockNumber: import.meta.env.VITE_ANVIL_MAINNET_FORK_BLOCK_NUMBER
    ? parseInt(import.meta.env.VITE_ANVIL_MAINNET_FORK_BLOCK_NUMBER)
    : undefined,
}
