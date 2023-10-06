import { PublicClient } from 'viem'
import { erc20ABI } from 'wagmi'
import { WETH_CONTRACT_ADDRESS } from '../constants'
import { resolvePossibleENS } from '../../utils'
import { PossibleENSAddress } from '../../types'

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
    abi: erc20ABI,
    functionName: 'balanceOf',
    args: [address],
  })
}
