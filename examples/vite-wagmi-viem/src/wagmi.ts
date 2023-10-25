import { getDefaultConfig } from 'connectkit'
import { createConfig } from 'wagmi'
import { goerli, mainnet } from 'wagmi/chains'

const chains = [goerli, mainnet]

export const wagmiConfig = createConfig(
  getDefaultConfig({
    walletConnectProjectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID!,
    chains,
    appName: 'Vite Tokenbound SDK Example',
    appDescription: 'Tokenbound SDK Example',
    appUrl: 'https://tokenbound.org',
  })
)
