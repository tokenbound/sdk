import { SignableMessage } from 'viem'
import {
  Ethers5SignableMessage,
  Ethers6SignableMessage,
  UniversalSignableMessage,
} from '../types'

export function isEthers5SignableMessage(
  message: UniversalSignableMessage
): message is Ethers5SignableMessage {
  return (
    Array.isArray(message) ||
    typeof message === 'string' ||
    ('length' in message && 'byteLength' in message === false)
  )
}

export function isEthers6SignableMessage(
  message: UniversalSignableMessage
): message is Ethers6SignableMessage {
  return typeof message === 'string' || message instanceof Uint8Array
}

export function isViemSignableMessage(
  message: UniversalSignableMessage
): message is SignableMessage {
  return typeof message === 'string' || 'raw' in message
}
