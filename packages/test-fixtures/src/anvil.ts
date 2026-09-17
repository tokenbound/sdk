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
	process.env.VITE_ANVIL_MAINNET_FORK_ENDPOINT ??
	"https://ethereum-rpc.publicnode.com"

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
}
