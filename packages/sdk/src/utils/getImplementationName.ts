import { getAddress } from "viem"
import { ERC_6551_DEFAULT, ERC_6551_LEGACY_V2 } from "../protocol/constants"

export function getImplementationName(
	implementationAddress?: `0x${string}`,
): string {
	if (!implementationAddress) return "Implementation: Default V3"

	// Checksum for case-insensitive comparison
	const address = getAddress(implementationAddress)

	switch (address) {
		case ERC_6551_LEGACY_V2.IMPLEMENTATION.ADDRESS:
			return "Implementation: Default V1"
		case ERC_6551_DEFAULT.ACCOUNT_PROXY?.ADDRESS:
			return "Implementation: Default V3"
		default:
			return `Custom Implementation: ${address}`
	}
}
