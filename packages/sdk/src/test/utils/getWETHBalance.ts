import { erc20Abi, type PublicClient } from "viem"
import type { PossibleENSAddress } from "../../types"
import { resolvePossibleENS } from "../../utils"
import { WETH_CONTRACT_ADDRESS } from "../constants"

export async function getWETHBalance({
	publicClient,
	walletAddress,
}: {
	publicClient: PublicClient
	walletAddress: PossibleENSAddress
}) {
	const address = await resolvePossibleENS(publicClient, walletAddress)
	return await publicClient.readContract({
		address: WETH_CONTRACT_ADDRESS,
		abi: erc20Abi,
		functionName: "balanceOf",
		args: [address],
	})
}
