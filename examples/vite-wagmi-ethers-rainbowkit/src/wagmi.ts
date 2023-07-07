import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig } from "wagmi";
import { goerli } from 'wagmi/chains'

import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';


const NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID = '6319aa80666a39009543c309a5828a1b'

export const { chains, publicClient } = configureChains(
  [goerli],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY! }),
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'Tokenbound SDK Example with Rainbow',
  projectId: NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  chains
});

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
})