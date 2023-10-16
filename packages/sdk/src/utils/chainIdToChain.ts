import { Chain } from 'viem'
import {
  mainnet,
  goerli,
  polygon,
  polygonMumbai,
  sepolia,
  optimism,
  arbitrum,
  optimismGoerli,
  base,
  gnosis,
} from 'viem/chains'

const allChains = {
  mainnet,
  goerli,
  optimismGoerli,
  polygon,
  polygonMumbai,
  sepolia,
  optimism,
  arbitrum,
  base,
  gnosis,
}

/**
 * Gets the chain object for the given chain id.
 * @param chainId - Chain id of the target EVM chain.
 * @returns Viem's chain object.
 */

export function chainIdToChain(chainId: number): Chain {
  for (const chain of Object.values(allChains)) {
    if (chain.id === chainId) {
      return chain
    }
  }

  throw new Error(`Chain with id ${chainId} not found`)
}
