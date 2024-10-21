import { Chain } from "viem"
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
	baseGoerli,
	baseSepolia,
	lineaTestnet,
	linea,
	gnosis,
	zora,
	zoraTestnet,
} from "viem/chains"

const enabledChains = {
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
	baseGoerli,
	baseSepolia,
	lineaTestnet,
	linea,
	zora,
	zoraTestnet,
}

/**
 * Gets the chain object for the given chain id.
 * @param chainId - Chain id of the target EVM chain.
 * @returns Viem's chain object.
 */

export function chainIdToChain(chainId: number): Chain {
	for (const chain of Object.values(enabledChains)) {
		if (chain.id === chainId) {
			return chain
		}
	}

	throw new Error(`Chain with id ${chainId} not found`)
}
