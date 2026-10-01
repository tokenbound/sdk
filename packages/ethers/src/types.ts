// Structural ethers types.
//
// @tokenbound/ethers never imports ethers itself — ethers is a peer dependency
// supplied by the consumer, and v5/v6 ship incompatible type trees. Describing
// the small surface we actually use structurally keeps the package free of a
// hard dependency on either major version.

import type { Address, Hex } from "viem"

/** An ethers v5 or v6 TransactionResponse, narrowed to what we consume. */
export type EthersTransactionResponse = {
	hash: string
} & Record<string, any>

/** The subset of an ethers Signer this package relies on. */
export type EthersSigner = {
	sendTransaction: (tx: {
		to?: string
		value?: bigint | unknown
		data?: string
	}) => Promise<EthersTransactionResponse>
	signMessage: (message: string | Uint8Array) => Promise<string>
	getAddress: () => Promise<string>
	provider?: EthersProvider | null
} & Record<string, any>

/** The subset of an ethers Provider this package relies on. */
export type EthersProvider = {
	call: (tx: { to: string; data: string }) => Promise<string>
	getCode: (address: string) => Promise<string>
	resolveName?: (name: string) => Promise<string | null>
} & Record<string, any>

/** The detected major version of an ethers object. */
export type EthersVersion = 5 | 6

/** Message shapes accepted by ethers v5's `signMessage`. */
export type Ethers5SignableMessage = ArrayLike<number> | string
/** Message shapes accepted by ethers v6's `signMessage`. */
export type Ethers6SignableMessage = string | Uint8Array
/** Any message either ethers major version can sign. */
export type EthersSignableMessage =
	| Ethers5SignableMessage
	| Ethers6SignableMessage

export type { Address, Hex }
