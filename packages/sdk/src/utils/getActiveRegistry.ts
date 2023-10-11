import { getAddress } from 'viem'
import { ERC_6551_DEFAULT } from '../constants'

export function getActiveRegistry(registryAddress?: `0x${string}`): `0x${string}` {
  return registryAddress ? getAddress(registryAddress) : ERC_6551_DEFAULT.REGISTRY
}
