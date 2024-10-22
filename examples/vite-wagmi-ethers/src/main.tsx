import { ConnectKitProvider } from "connectkit"
import * as React from "react"
import * as ReactDOM from "react-dom/client"
import { WagmiProvider } from "wagmi"

import { App } from "./App"
import { wagmiConfig } from "./wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

const htmlRoot = document.getElementById("root")

if (htmlRoot) {
	ReactDOM.createRoot(htmlRoot).render(
		<React.StrictMode>
			<WagmiProvider config={wagmiConfig}>
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
