// Anvil configuration shared by every fork-backed suite.
//
// Both suites fork the same endpoint with the same timeout, so neither package
// declares its own. Reads process.env (not import.meta.env) so this works under
// plain Node as well as vitest, without depending on vite/client types.

import { Instance } from "prool"
import { mainnet } from "viem/chains"

/**
 * The chain the suites fork. Both packages assert against mainnet state
 * (Zora drops, ENS, WETH), so this is not configurable per suite.
 */
export const ACTIVE_CHAIN = mainnet

/**
 * Mainnet fork endpoint. Set VITE_ANVIL_MAINNET_FORK_ENDPOINT in .env.test to
 * use your own provider; the fallback keeps a fresh clone and CI runnable.
 *
 * The fallback must serve historical state, not just recent blocks. These suites
 * start several anvil instances over a few minutes, and each forks at whatever
 * the head was when it launched — so an endpoint that prunes state after ~32
 * blocks (ethereum-rpc.publicnode.com, previously used here) fails partway
 * through with "block not found" or "failed to create genesis", at a different
 * point on every run.
 */
export const FORK_URL =
	// Trimmed, and `||` rather than `??`: CI renders an unset secret as an empty
	// string, which `??` would pass straight through to anvil's --fork-url.
	process.env.VITE_ANVIL_MAINNET_FORK_ENDPOINT?.trim() || "https://eth.drpc.org"

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
 * A fresh mainnet fork, managed by prool. Call `start()` in beforeAll and
 * `stop()` in afterAll; `url` is valid before start.
 *
 * Every suite shares one fixed port: they run sequentially (fileParallelism:
 * false, sequence.concurrent: false) and each afterAll stops its fork before the
 * next beforeAll starts. The host is pinned to 127.0.0.1 because prool defaults
 * to `localhost`, which Node may resolve to ::1 while anvil listens on IPv4.
 */
export function createForkInstance() {
	return Instance.anvil(
		{
			host: "127.0.0.1",
			port: 8545,
			forkUrl: FORK_URL,
			// Omitted entirely when unset, so anvil forks from the head.
			...(FORK_BLOCK_NUMBER === undefined
				? {}
				: { forkBlockNumber: FORK_BLOCK_NUMBER }),
		},
		// Forking fetches genesis state over the network, which can outlast
		// prool's 10s default on a cold CI runner.
		{ timeout: ANVIL_CONFIG.TIMEOUT },
	)
}

/**
 * Base fork endpoint for the cross-chain delivery suite, which needs a second
 * chain to receive LayerZero messages on. Same rules as FORK_URL: an empty value
 * falls back, and the fallback must serve historical state — more so on Base,
 * whose ~2s blocks age a fork point out of a pruning node within a minute.
 *
 * Base's official RPC rather than drpc: drpc's free tier rate-limits (HTTP 429)
 * under the repeated forking these suites do.
 */
export const BASE_FORK_URL =
	process.env.VITE_ANVIL_BASE_FORK_ENDPOINT?.trim() ||
	"https://mainnet.base.org"

/**
 * A fresh Base fork, on its own port so it can run alongside the mainnet fork.
 * Always forks from the head: FORK_BLOCK_NUMBER is a mainnet block number.
 */
export function createBaseForkInstance() {
	return Instance.anvil(
		{ host: "127.0.0.1", port: 8546, forkUrl: BASE_FORK_URL },
		{ timeout: ANVIL_CONFIG.TIMEOUT },
	)
}
