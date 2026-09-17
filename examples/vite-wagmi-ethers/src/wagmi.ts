import { getDefaultConfig } from "connectkit"
import type { Chain } from "viem"
import { createConfig } from "wagmi"
import { baseSepolia } from "wagmi/chains"

const chains: readonly [Chain, ...Chain[]] = [baseSepolia]

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
