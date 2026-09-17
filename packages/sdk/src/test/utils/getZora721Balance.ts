import { zora721 } from "@tokenbound/test-fixtures"
import type { PublicClient } from "viem"
import type { PossibleENSAddress } from "../../types"
import { resolvePossibleENS } from "../../utils"

export async function getZora721Balance({
	publicClient,
	walletAddress,
}: {
	publicClient: PublicClient
	walletAddress: PossibleENSAddress
}) {
	const address = await resolvePossibleENS(publicClient, walletAddress)

	return await publicClient.readContract({
		address: zora721.proxyContractAddress,
		abi: zora721.abi,
		functionName: "balanceOf",
		args: [address],
	})
}
