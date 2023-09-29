import { PublicClient } from 'viem'
import { zora1155 } from '../config'
import { zora1155ABI } from '../wagmi-cli-hooks/generated'

export async function getZora1155Balance({
  publicClient,
  walletAddress,
}: {
  publicClient: PublicClient
  walletAddress: `0x${string}`
}) {
  return await publicClient.readContract({
    address: zora1155.proxyContractAddress,
    abi: zora1155ABI,
    functionName: 'balanceOf',
    args: [walletAddress, zora1155.tokenId],
  })
}
