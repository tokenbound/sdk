import { ConnectKitProvider } from "connectkit"
import * as React from "react"
import * as ReactDOM from "react-dom/client"
import { createConfig, WagmiProvider } from "wagmi"

import { baseSepolia } from "wagmi/chains"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { http } from "viem"

import { App } from "./App"
const queryClient = new QueryClient()

export const config = createConfig({
	chains: [baseSepolia],
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
