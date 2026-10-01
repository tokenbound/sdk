import { type Client, getAddress } from "viem"
import { getEnsAddress } from "viem/actions"
import { normalize } from "viem/ens"
import type { PossibleENSAddress } from "../types"

/**
 * Resolves a `.eth` name to an address, or normalizes an address that is
 * already hex. Accepts any viem Client so wallet clients can resolve ENS
 * without being cast to a PublicClient.
 */
export async function resolvePossibleENS(
	client: Client,
	possibleENSAddress: PossibleENSAddress,
): Promise<`0x${string}`> {
	const isENS = possibleENSAddress.endsWith(".eth")
	const address = isENS
		? await getEnsAddress(client, { name: normalize(possibleENSAddress) })
		: getAddress(possibleENSAddress)

	if (!address) {
		throw new Error("Failed to resolve ENS address")
	}

	return address
}
