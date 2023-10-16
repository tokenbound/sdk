import { isAddressEqual } from 'viem'
import { ERC_6551_DEFAULT, ERC_6551_LEGACY_V2 } from '../constants'
import { ContractABIPair } from '../types'

export function getActiveRegistry(registryAddress?: `0x${string}`): ContractABIPair {
  return !!registryAddress &&
    isAddressEqual(registryAddress, ERC_6551_LEGACY_V2.REGISTRY.ADDRESS)
    ? ERC_6551_LEGACY_V2.REGISTRY
    : ERC_6551_DEFAULT.REGISTRY
}
