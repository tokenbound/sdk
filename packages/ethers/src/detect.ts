// The single ethers-version boundary for this package.
//
// Version detection happens here and nowhere else; the rest of the package
// receives an already-resolved adapter, so no version branching is scattered
// through shared code.

import type { EthersProvider, EthersSigner, EthersVersion } from "./types"

/**
 * Detects whether a signer or provider comes from ethers v5 or v6.
 *
 * ethers v5 stamps `_isSigner`/`_isProvider` onto its classes; v6 removed both
 * and instead exposes a `provider.getNetwork()`-bearing signer whose
 * constructor chain carries no `_isSigner` flag. We therefore treat the v5
 * markers as authoritative and default to v6.
 */
export function detectEthersVersion(
	subject: EthersSigner | EthersProvider,
): EthersVersion {
	if (typeof subject !== "object" || subject === null) {
		throw new Error("Expected an ethers Signer or Provider object.")
	}

	// ethers v5 markers.
	if (
		(subject as Record<string, unknown>)._isSigner === true ||
		(subject as Record<string, unknown>)._isProvider === true
	) {
		return 5
	}

	return 6
}

/** Narrows an unknown value to something signer-shaped, or throws. */
export function assertSigner(signer: unknown): EthersSigner {
	if (
		typeof signer !== "object" ||
		signer === null ||
		typeof (signer as EthersSigner).sendTransaction !== "function"
	) {
		throw new Error("Expected an ethers Signer with a sendTransaction method.")
	}
	return signer as EthersSigner
}
