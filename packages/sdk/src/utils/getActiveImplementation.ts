import { isAddressEqual } from 'viem'
import { ERC_6551_DEFAULT, ERC_6551_LEGACY_V2 } from '../constants'
import { ContractABIPair } from '../types'

export function getActiveImplementation(
  implementationAddress?: `0x${string}`
): ContractABIPair {
  if (!implementationAddress) {
    return ERC_6551_DEFAULT.IMPLEMENTATION
  }

  if (isAddressEqual(implementationAddress, ERC_6551_LEGACY_V2.IMPLEMENTATION.ADDRESS)) {
    return ERC_6551_LEGACY_V2.IMPLEMENTATION
  }

  // If it's a custom implementation, we need to know if it supports V2 or V3

  // return !!implementationAddress &&
  //   isAddressEqual(implementationAddress, ERC_6551_LEGACY_V2.IMPLEMENTATION.ADDRESS)
  //   ? ERC_6551_LEGACY_V2.IMPLEMENTATION
  //   : ERC_6551_DEFAULT.IMPLEMENTATION

  return ERC_6551_DEFAULT.IMPLEMENTATION
}
