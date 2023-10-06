import { PublicClient, getAddress } from 'viem'
import { zora721 } from '../config'
import { zora721DropABI } from '../wagmi-cli-hooks/generated'
import { resolvePossibleENS } from '../../utils'
import { PossibleENSAddress } from '../../types'

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
    functionName: 'balanceOf',
    args: [address],
  })
}
