import { PublicClient } from 'viem'
import { erc20ABI } from 'wagmi'
import { WETH_CONTRACT_ADDRESS } from '../constants'

export async function getWETHBalance({
  publicClient,
  walletAddress,
}: {
  publicClient: PublicClient
  walletAddress: `0x${string}`
}) {
  return await publicClient.readContract({
    address: WETH_CONTRACT_ADDRESS,
    abi: erc20ABI,
    functionName: 'balanceOf',
    args: [walletAddress],
  })
}
