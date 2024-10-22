import "@rainbow-me/rainbowkit/styles.css"

import * as React from "react"
import * as ReactDOM from "react-dom/client"
import { WagmiProvider } from "wagmi"

import { baseSepolia } from "wagmi/chains"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"

import { App } from "./App"
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit"
const queryClient = new QueryClient()

const config = getDefaultConfig({
	appName: "My RainbowKit App",
	projectId: "YOUR_PROJECT_ID",
	chains: [baseSepolia],
})

const htmlRoot = document.getElementById("root")

if (htmlRoot) {
	ReactDOM.createRoot(htmlRoot).render(
		<React.StrictMode>
			<WagmiProvider config={config}>
				<QueryClientProvider client={queryClient}>
					<RainbowKitProvider>
						<App />
					</RainbowKitProvider>
				</QueryClientProvider>
			</WagmiProvider>
		</React.StrictMode>,
	)
} else {
	console.error("Failed to find the root element")
}
