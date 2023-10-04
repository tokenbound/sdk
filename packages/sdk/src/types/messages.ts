import { SignableMessage } from 'viem'
import { Prettify } from './prettify'

export type Bytes = ArrayLike<number>
export type Ethers5SignableMessage = Bytes | string
export type Ethers6SignableMessage = string | Uint8Array

export type EthersSignableMessage = Ethers5SignableMessage | Ethers6SignableMessage

export type UniversalSignableMessage = Prettify<EthersSignableMessage | SignableMessage> // SignableMessage is string | { raw: Hex | ByteArray }  // where ByteArray = Uint8Array
