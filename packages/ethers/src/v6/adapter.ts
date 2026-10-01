// ethers v6 message normalization.
//
// v6's `signMessage` accepts `string | Uint8Array` only. `ArrayLike<number>` is
// NOT accepted — passing `number[]` throws "invalid BytesLike value" — so
// array-likes must be converted before the message reaches ethers.

import type { EthersSignableMessage } from "../types"

/** Normalizes a message into something ethers v6's `signMessage` accepts. */
export function normalizeV6Message(
	message: EthersSignableMessage,
): string | Uint8Array {
	if (typeof message === "string") return message
	if (message instanceof Uint8Array) return message
	return new Uint8Array(Array.from(message))
}
