import { getAddress } from 'viem'
import { ERC_6551_DEFAULT } from '../constants'

export function getActiveImplementation(
  implementationAddress?: `0x${string}`
): `0x${string}` {
  return implementationAddress
    ? getAddress(implementationAddress)
    : ERC_6551_DEFAULT.IMPLEMENTATION
}
