import { ERC_6551_DEFAULT, ERC_6551_LEGACY_V1 } from '../constants'

export function getImplementationName(implementationAddress?: `0x${string}`): string {
  switch (implementationAddress) {
    case ERC_6551_LEGACY_V1.IMPLEMENTATION:
      return 'Implementation: Default V1'
    case ERC_6551_DEFAULT.IMPLEMENTATION:
    case undefined:
      return 'Implementation: Default V3'
    default:
      return `Custom Implementation: ${implementationAddress}`
  }
}
