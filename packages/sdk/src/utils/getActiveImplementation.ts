import { isAddressEqual } from 'viem'
import { ERC_6551_DEFAULT, ERC_6551_LEGACY_V2 } from '../constants'
import { ContractABIPair } from '../types'

export function getActiveImplementation(
  implementationAddress?: `0x${string}`
): ContractABIPair {
  return !!implementationAddress &&
    isAddressEqual(implementationAddress, ERC_6551_LEGACY_V2.IMPLEMENTATION.ADDRESS)
    ? ERC_6551_LEGACY_V2.IMPLEMENTATION
    : ERC_6551_DEFAULT.IMPLEMENTATION
}
