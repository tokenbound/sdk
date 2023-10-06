import { PublicClient } from 'viem'
import { zora1155 } from '../config'
import { zora1155ABI } from '../wagmi-cli-hooks/generated'
import { resolvePossibleENS } from '../../utils'
import { PossibleENSAddress } from '../../types'

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
    abi: zora1155ABI,
    functionName: 'balanceOf',
    args: [address, zora1155.tokenId],
  })
}
