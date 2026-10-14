// ethers v5 message normalization.
//
// v5's `signMessage` accepts `Bytes | string`, where `Bytes` is
// `ArrayLike<number>` — so a plain `number[]` is valid, and so is a
// `Uint8Array`. We still convert array-likes to `Uint8Array` so that the same
// input produces the same signature on both majors (v6 rejects `number[]`).

import type { EthersSignableMessage } from "../types"

/** Normalizes a message into something ethers v5's `signMessage` accepts. */
export function normalizeV5Message(
	message: EthersSignableMessage,
): string | Uint8Array {
	if (typeof message === "string") return message
	if (message instanceof Uint8Array) return message
	return new Uint8Array(Array.from(message))
}
