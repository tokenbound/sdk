import { getDefaultConfig } from "connectkit"
import type { Chain } from "viem"
import { createConfig } from "wagmi"
import { base, baseSepolia, mainnet, sepolia, zora } from "wagmi/chains"

// Chains offered in the app's chain picker. Base Sepolia is first, so it is
// wagmi's default: the write actions cost real funds on a mainnet, and the
// testnet keeps the demo free to click through.
export const SUPPORTED_CHAINS = [
	baseSepolia,
	sepolia,
	base,
	mainnet,
	zora,
] as const

const chains: readonly [Chain, ...Chain[]] = [...SUPPORTED_CHAINS]

export const wagmiConfig = createConfig(
	getDefaultConfig({
		// Vite only exposes VITE_-prefixed vars, and via import.meta.env — not
		// process.env. Get a project id at https://cloud.reown.com.
		walletConnectProjectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID ?? "",
		chains,
		appName: "Vite Tokenbound SDK Example",
		appDescription: "Tokenbound SDK Example",
		appUrl: "https://tokenbound.org",
	}),
)
