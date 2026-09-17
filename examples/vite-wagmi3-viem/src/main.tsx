import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import * as React from "react"
import * as ReactDOM from "react-dom/client"
import { http } from "viem"
import { createConfig, WagmiProvider } from "wagmi"
import { baseSepolia } from "wagmi/chains"
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors"

import { App } from "./App"

// import { wagmiConfig } from './wagmi'

const queryClient = new QueryClient()

// WalletConnect needs a project id from https://cloud.reown.com. It is optional
// here: without one the example still runs, just without mobile-wallet support.
const walletConnectProjectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID

export const config = createConfig({
	chains: [baseSepolia],
	connectors: [
		// EIP-6963 discovery: MetaMask, Rabby, Phantom, Brave — any injected wallet
		// the browser announces. Without an explicit connector list wagmi falls back
		// to this alone, which is why Coinbase and WalletConnect are added below.
		injected(),
		coinbaseWallet({ appName: "Tokenbound SDK Example" }),
		...(walletConnectProjectId
			? [walletConnect({ projectId: walletConnectProjectId })]
			: []),
	],
	transports: {
		[baseSepolia.id]: http(),
	},
})

const htmlRoot = document.getElementById("root")

if (htmlRoot) {
	ReactDOM.createRoot(htmlRoot).render(
		<React.StrictMode>
			<WagmiProvider config={config}>
				<QueryClientProvider client={queryClient}>
					<App />
				</QueryClientProvider>
			</WagmiProvider>
		</React.StrictMode>,
	)
} else {
	console.error("Failed to find the root element")
}
