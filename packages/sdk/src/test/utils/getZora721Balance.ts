import type { PublicClient } from "viem"
import type { PossibleENSAddress } from "../../types"
import { resolvePossibleENS } from "../../utils"
import { zora721 } from "../config"
import { zora721DropABI } from "../wagmi-cli-hooks/generated"

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
		abi: zora721DropABI,
		functionName: "balanceOf",
		args: [address],
	})
}
