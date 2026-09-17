// The version-agnostic adapter interface.
//
// `resolveAdapter` is the only place that chooses between v5 and v6; every
// other module in this package talks to the resulting `EthersAdapter`.
//
// The v5 and v6 adapters are currently one implementation, because the only
// difference between the majors that we actually touch is which message shapes
// `signMessage` accepts — and normalizing to `string | Uint8Array` satisfies
// both. Verified against both majors: v5 accepts `number[]`, v6 rejects it with
// "invalid BytesLike value", and both produce identical signatures for the
// equivalent `Uint8Array`. The per-version normalizers in ./v5 and ./v6 remain
// the seam to reimplement if the majors ever diverge further.

import { assertSigner, detectEthersVersion } from "./detect"
import type {
	Address,
	EthersSignableMessage,
	EthersSigner,
	EthersVersion,
	Hex,
} from "./types"
import { normalizeV5Message } from "./v5/adapter"
import { normalizeV6Message } from "./v6/adapter"

/** A uniform view over an ethers v5 or v6 Signer. */
export type EthersAdapter = {
	/** Which ethers major version backs this adapter. */
	version: EthersVersion
	/** The underlying ethers Signer. */
	signer: EthersSigner
	/** Sends a prepared transaction and returns its hash. */
	sendTransaction: (tx: {
		to: Address
		value: bigint
		data: Hex
	}) => Promise<Hex>
	/** Signs a message, normalizing it for the detected ethers version. */
	signMessage: (message: EthersSignableMessage) => Promise<Hex>
	/** Returns the signer's address. */
	getAddress: () => Promise<Address>
	/** Returns the deployed bytecode at an address ("0x" when undeployed). */
	getCode: (address: Address) => Promise<Hex>
	/** Performs a read-only contract call and returns the raw return data. */
	call: (tx: { to: Address; data: Hex }) => Promise<Hex>
	/** Resolves an ENS name, or null when it does not resolve. */
	resolveName: (name: string) => Promise<Address | null>
}

/** Message normalization, per ethers major version. */
const NORMALIZERS = {
	5: normalizeV5Message,
	6: normalizeV6Message,
} as const satisfies Record<
	EthersVersion,
	(message: EthersSignableMessage) => string | Uint8Array
>

/**
 * Builds an adapter over an already-validated signer for a known version.
 * `value` is passed through as a JS bigint: v6 uses native bigint, and v5
 * coerces it via BigNumber.
 */
export function createAdapter(
	signer: EthersSigner,
	version: EthersVersion,
): EthersAdapter {
	const normalize = NORMALIZERS[version]

	/**
	 * Reads go through the signer's own Provider rather than a separate viem
	 * client, so ethers consumers do not pay for a second RPC stack. `getCode`,
	 * `call` and `resolveName` exist with the same shape on v5 and v6, so no
	 * version branching is needed here.
	 */
	const requireProvider = () => {
		const provider = signer.provider
		if (!provider) {
			throw new Error(
				"The ethers Signer must be connected to a Provider for read operations. Use `signer.connect(provider)`.",
			)
		}
		return provider
	}

	return {
		version,
		signer,
		async sendTransaction(tx) {
			const response = await signer.sendTransaction({
				to: tx.to,
				value: tx.value,
				data: tx.data,
			})
			return response.hash as Hex
		},
		async signMessage(message) {
			return (await signer.signMessage(normalize(message))) as Hex
		},
		async getAddress() {
			return (await signer.getAddress()) as Address
		},
		async getCode(address) {
			return (await requireProvider().getCode(address)) as Hex
		},
		async call(tx) {
			return (await requireProvider().call(tx)) as Hex
		},
		async resolveName(name) {
			const provider = requireProvider()
			if (typeof provider.resolveName !== "function") {
				throw new Error("This ethers Provider does not support ENS resolution.")
			}
			return (await provider.resolveName(name)) as Address | null
		},
	}
}

/**
 * Wraps an ethers v5 or v6 Signer in a version-agnostic adapter.
 * Detection happens once, here.
 */
export function resolveAdapter(signer: unknown): EthersAdapter {
	const ethersSigner = assertSigner(signer)
	return createAdapter(ethersSigner, detectEthersVersion(ethersSigner))
}
