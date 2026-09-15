import { type Chain, createPublicClient, http, type PublicClient } from "viem"
import { ANVIL_RPC_URL } from "../constants"

export const getPublicClient = ({ chain }: { chain: Chain }): PublicClient => {
	return createPublicClient({
		transport: http(ANVIL_RPC_URL),
		chain,
		pollingInterval: 100,
	})
}
