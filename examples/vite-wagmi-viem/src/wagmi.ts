// import { getDefaultConfig } from 'connectkit'
import { Chain, goerli, mainnet } from 'wagmi/chains'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'

const chains: [Chain, ...Chain[]] = [goerli]

export const wagmiConfig = getDefaultConfig({
  appName: 'Vite Tokenbound SDK Example',
  appDescription: 'Tokenbound SDK Example',
  appUrl: 'https://tokenbound.org',
  // projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID!,
  projectId: 'f8fc7a00d1a59a1aece2454402025e79',
  chains: chains,
  // walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_ID!,
})
