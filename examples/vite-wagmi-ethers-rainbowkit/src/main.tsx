import '@rainbow-me/rainbowkit/styles.css'

import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { WagmiConfig } from 'wagmi'
import { wagmiConfig, chains } from './wagmi'

import { App } from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        chains={chains}
        appInfo={{
          appName: 'Rainbowkit Demo',
          learnMoreUrl: 'https://learnaboutcryptowallets.example',
        }}
      >
        <App />
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>
)
