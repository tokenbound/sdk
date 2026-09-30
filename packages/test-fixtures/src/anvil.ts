// Anvil configuration shared by every fork-backed suite.
//
// Both suites fork the same endpoint with the same timeout, so neither package
// declares its own. Reads process.env (not import.meta.env) so this works under
// plain Node as well as vitest, without depending on vite/client types.

import type { CreateAnvilOptions } from "@viem/anvil"
import { mainnet } from "viem/chains"

/**
 * The chain the suites fork. Both packages assert against mainnet state
 * (Zora drops, ENS, WETH), so this is not configurable per suite.
 */
export const ACTIVE_CHAIN = mainnet

/**
 * Mainnet fork endpoint. Set VITE_ANVIL_MAINNET_FORK_ENDPOINT in .env.test to
 * use your own provider; the public fallback keeps a fresh clone runnable, but
 * it rate-limits and retains only recent blocks.
 */
export const FORK_URL =
	// Trimmed, and `||` rather than `??`: CI renders an unset secret as an empty
	// string, which `??` would pass straight through to anvil's --fork-url.
	process.env.VITE_ANVIL_MAINNET_FORK_ENDPOINT?.trim() ||
	"https://ethereum-rpc.publicnode.com"

/**
 * Optional block to pin the fork at. Pinning makes runs deterministic — the
 * suites assert against live mainnet state (Zora drops, ENS, WETH), so an
 * unpinned fork re-reads a moving chain on every run.
 *
 * Requires an ARCHIVE endpoint. Serving state at a past block is an archive
 * request, and public RPCs refuse it: forking a pinned block against
 * ethereum-rpc.publicnode.com fails before genesis with "Archive requests
 * require a personal token". Anvil's on-disk cache (~/.foundry/cache/rpc) can
 * mask this locally — a machine that has already cached the block will pass
 * while a clean checkout or CI fails.
 *
 * Pins also go stale: as the block recedes, providers prune it and the mainnet
 * state these suites assert against drifts further from the assertions. That
 * surfaces as unrelated test failures rather than anything naming the block.
 *
 * So: set VITE_ANVIL_MAINNET_FORK_BLOCK_NUMBER only alongside an archive-capable
 * VITE_ANVIL_MAINNET_FORK_ENDPOINT (e.g. Alchemy), and refresh it periodically.
 * Leave it unset to fork from the chain head, which works on any endpoint.
 */
export const FORK_BLOCK_NUMBER = (() => {
	const raw = process.env.VITE_ANVIL_MAINNET_FORK_BLOCK_NUMBER?.trim()
	if (!raw) return undefined

	const parsed = Number(raw)
	if (!Number.isSafeInteger(parsed) || parsed <= 0) {
		throw new Error(
			`VITE_ANVIL_MAINNET_FORK_BLOCK_NUMBER must be a positive integer, got "${raw}"`,
		)
	}
	return parsed
})()

export const ANVIL_CONFIG = {
	TIMEOUT: 60000, // default 10000
	ACTIVE_CHAIN,
}

/**
 * No explicit port: suites run sequentially (fileParallelism: false,
 * sequence.concurrent: false) and each afterAll stops anvil before the next
 * beforeAll starts, so every variant can share the default port.
 */
export const CREATE_ANVIL_OPTIONS: CreateAnvilOptions = {
	forkUrl: FORK_URL,
	// Omitted entirely when unset, so anvil forks from the head as before.
	...(FORK_BLOCK_NUMBER === undefined
		? {}
		: { forkBlockNumber: FORK_BLOCK_NUMBER }),
}
