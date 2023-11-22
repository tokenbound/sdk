import { getDefaultConfig } from 'connectkit'
import { createConfig } from 'wagmi'
import { sepolia, goerli } from 'wagmi/chains'

const chains = [goerli, sepolia]

export const wagmiConfig = createConfig(
  getDefaultConfig({
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    chains,
    appName: 'Vite Tokenbound SDK Example',
    appDescription: 'Tokenbound SDK Example',
    appUrl: 'https://tokenbound.org',
  })
)
