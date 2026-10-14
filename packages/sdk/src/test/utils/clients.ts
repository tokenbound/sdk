import { ANVIL_RPC_URL } from "@tokenbound/test-fixtures"
import { type Chain, createPublicClient, http, type PublicClient } from "viem"

export const getPublicClient = ({ chain }: { chain: Chain }): PublicClient => {
	return createPublicClient({
		transport: http(ANVIL_RPC_URL),
		chain,
		pollingInterval: 100,
	})
}
