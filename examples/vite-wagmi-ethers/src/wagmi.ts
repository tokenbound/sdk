import { getDefaultConfig } from "connectkit";
import { createConfig } from "wagmi";
import { baseSepolia } from 'wagmi/chains'

import { Chain } from 'viem'

const chains: readonly [Chain, ...Chain[]] = [baseSepolia]

export const wagmiConfig = createConfig(
  getDefaultConfig({
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    chains,
    appName: 'Vite Tokenbound SDK Example',
    appDescription: 'Tokenbound SDK Example',
    appUrl: 'https://tokenbound.org',
  })
)