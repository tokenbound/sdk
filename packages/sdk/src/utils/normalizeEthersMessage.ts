import { Bytes } from '../types'

// The types Bytes | string in Ethers 5 and string | Uint8Array in Ethers 6 are somewhat compatible but not entirely.
// This function normalizes the message type to Uint8Array so we can sign using the AbstractEthersSigner without knowing the Ethers version.

export function normalizeMessage(
  message: Bytes | string | Uint8Array
): string | Uint8Array {
  if (typeof message === 'string') {
    return message
  }

  if (message instanceof Uint8Array) {
    return message
  }

  // Convert ArrayLike<number> to Uint8Array
  return new Uint8Array(Array.from(message))
}
