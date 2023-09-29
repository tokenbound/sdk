import { PublicClient } from 'viem'
import { zora721 } from '../config'
import { zora721DropABI } from '../wagmi-cli-hooks/generated'

export async function getZora721Balance({
  publicClient,
  walletAddress,
}: {
  publicClient: PublicClient
  walletAddress: `0x${string}`
}) {
  return await publicClient.readContract({
    address: zora721.proxyContractAddress,
    abi: zora721DropABI,
    functionName: 'balanceOf',
    args: [walletAddress],
  })
}
