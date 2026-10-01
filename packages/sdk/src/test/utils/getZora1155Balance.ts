import { zora1155 } from "@tokenbound/test-fixtures"
import type { PublicClient } from "viem"
import type { PossibleENSAddress } from "../../types"
import { resolvePossibleENS } from "../../utils"

export async function getZora1155Balance({
	publicClient,
	walletAddress,
}: {
	publicClient: PublicClient
	walletAddress: PossibleENSAddress
}) {
	const address = await resolvePossibleENS(publicClient, walletAddress)
	return await publicClient.readContract({
		address: zora1155.proxyContractAddress,
		abi: zora1155.abi,
		functionName: "balanceOf",
		args: [address, zora1155.tokenId],
	})
}
