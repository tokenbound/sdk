import { normalize } from 'viem/ens'
import { PossibleENSAddress } from '../types'
import { PublicClient, getAddress } from 'viem'

export async function resolvePossibleENS(
  publicClient: PublicClient,
  possibleENSAddress: PossibleENSAddress
): Promise<`0x${string}`> {
  const isENS = possibleENSAddress.endsWith('.eth')
  const address = isENS
    ? await publicClient.getEnsAddress({
        name: normalize(possibleENSAddress),
      })
    : getAddress(possibleENSAddress)

  if (!address) {
    throw new Error('Failed to resolve ENS address')
  }

  return address
}
