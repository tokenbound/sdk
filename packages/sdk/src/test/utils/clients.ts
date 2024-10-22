import {
	createPublicClient,
	type PublicClient,
	http,
	type Chain,
} from "viem"
// import { chainIdToChain } from '../../utils'
import { ANVIL_RPC_URL, } from "../constants"

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
