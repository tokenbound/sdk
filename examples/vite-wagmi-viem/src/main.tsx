import '@rainbow-me/rainbowkit/styles.css'

import { http } from 'viem';
import { createConfig, WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit'
import { baseSepolia } from 'wagmi/chains';

import * as React from 'react'
import * as ReactDOM from 'react-dom/client'

import { App } from './App'
// import { wagmiConfig } from './wagmi'

const queryClient = new QueryClient()

export const config = createConfig({
	chains: [baseSepolia],
	transports: {
		[baseSepolia.id]: http(),
	},
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={lightTheme()}>
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
)
