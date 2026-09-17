// Shared on-chain fixtures for every Tokenbound test suite.
//
// PRIVATE: this package is never published (see "private": true). It exists so
// the viem suite (packages/sdk) and the ethers suites (packages/ethers) assert
// against the SAME mainnet contracts, accounts and ENS name. Importing these
// rather than copying literals is what actually prevents the suites drifting
// apart — a copied constant with a comment saying "keep in sync" does not.

import { getAddress, parseUnits } from "viem"
import { foundry } from "viem/chains"

/** Zora "Webb's First Deep Field" 721 drop — open, free public mint. */
export const ZORA_721 = {
	address: getAddress("0x28ee638f2fcb66b4106acab7efd225aeb2bd7e8d"),
	mintPrice: 0n,
	/** Minted in a single purchase; the drop caps purchases per address. */
	quantity: 4,
} as const

/** Zora 1155, minted through the fixed-price sales strategy. */
export const ZORA_1155 = {
	address: getAddress("0x373075bab7d668ed2473d8233ebdebcf49eb758e"),
	minter: getAddress("0x5Ff5a77dD2214d863aCA809C0168941052d9b180"),
	tokenId: 1n,
	mintFee: parseUnits("0.000777", 18),
	quantity: 5n,
} as const

export const WETH_CONTRACT_ADDRESS = getAddress(
	"0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
)

/** ENS name used by the ENS-recipient tests in both suites. */
export const ENS_NAME = "jeebay.eth"

/**
 * An arbitrary recipient. Deliberately NOT a Tokenbound contract: using the
 * ERC-6551 registry here once made execution calldata targeting the registry
 * look plausible in test output.
 */
export const RECIPIENT_ADDRESS = getAddress(
	"0x000000000000000000000000000000000000d00d",
)

export const ANVIL_RPC_URL = foundry.rpcUrls.default.http[0]

export const ANVIL_ACCOUNTS = [
	{
		name: "BJ",
		address: getAddress("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"),
		privateKey:
			"0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
	},
	{
		name: "Jayden",
		address: getAddress("0x70997970c51812dc3a010c7d01b50e0d17dc79c8"),
		privateKey:
			"0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
	},
] as const

/**
 * A 20-byte Ethereum address: 0x + 40 hex chars.
 *
 * NOTE: intentionally unanchored at the end — some existing assertions match an
 * address appearing at the start of a longer string. Use ETH_ADDRESS_REGEX when
 * the value must be exactly an address.
 */
export const ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}/

/** A 20-byte Ethereum address and nothing else. */
export const ETH_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/

/** A 32-byte transaction hash: 0x + 64 hex chars. */
export const TX_HASH_REGEX = /^0x[a-fA-F0-9]{64}$/

/** An ECDSA signature: 0x + 65 bytes (r, s, v) as 130 hex chars. */
export const ECDSA_SIGNATURE_REGEX = /^0x[a-fA-F0-9]{130}$/

export const ERC1167_HEADER = "363d3d373d3d3d363d73"
export const ERC1167_FOOTER = "5af43d82803e903d91602b57fd5bf3"

/**
 * Whether the suites should emit their progress logging.
 *
 * The fork-backed tests log balances, derived addresses and tx hashes, which is
 * what you actually want when a mainnet-fork test fails. In a normal run it is
 * just noise that buries real failures, so it is off unless asked for:
 *
 *   USE_VERBOSE_TESTS=1 pnpm test
 */
export const TEST_VERBOSE =
	process.env.USE_VERBOSE_TESTS === "1" ||
	process.env.USE_VERBOSE_TESTS === "true"

/** console.log, but only when USE_VERBOSE_TESTS is set. */
export const testLog = (...args: unknown[]): void => {
	if (TEST_VERBOSE) console.log(...args)
}

/**
 * Compares two Ethereum addresses for equality, ignoring case.
 *
 * Addresses arrive from RPC responses, event logs and ethers/viem helpers in
 * inconsistent casing, so `a === b` on raw strings gives false negatives.
 * Checksumming both sides normalizes that. Returns false rather than throwing
 * when either value is missing or is not a valid address, so it is safe to use
 * directly in a filter or conditional.
 */
export const isAddressMatch = (
	a?: string | null,
	b?: string | null,
): boolean => {
	if (!a || !b) return false
	try {
		return getAddress(a) === getAddress(b)
	} catch {
		return false
	}
}
