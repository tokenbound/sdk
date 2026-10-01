import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ConnectKitProvider } from "connectkit"
import * as React from "react"
import * as ReactDOM from "react-dom/client"
import { http } from "viem"
import { createConfig, WagmiProvider } from "wagmi"
import { base, baseSepolia, mainnet, sepolia, zora } from "wagmi/chains"

import { App } from "./App"

const queryClient = new QueryClient()

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

export const config = createConfig({
	chains: SUPPORTED_CHAINS,
	transports: {
		[baseSepolia.id]: http(),
		[sepolia.id]: http(),
		[base.id]: http(),
		[mainnet.id]: http(),
		[zora.id]: http(),
	},
})

const htmlRoot = document.getElementById("root")

if (htmlRoot) {
	ReactDOM.createRoot(htmlRoot).render(
		<React.StrictMode>
			<WagmiProvider config={config}>
				<QueryClientProvider client={queryClient}>
					<ConnectKitProvider>
						<App />
					</ConnectKitProvider>
				</QueryClientProvider>
			</WagmiProvider>
		</React.StrictMode>,
	)
} else {
	console.error("Failed to find the root element")
}
