import { ConnectKitProvider } from 'connectkit'
import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import { WagmiProvider } from 'wagmi'

import { App } from './App'
import { wagmiConfig } from './wagmi'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>
          <App />
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
)
