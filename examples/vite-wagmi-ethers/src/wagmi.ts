// import { getDefaultClient } from "connectkit";
// import { createClient } from "wagmi";
// import { goerli } from "wagmi";

// export const wagmiClient = createClient(
//   getDefaultClient({
//     autoConnect: true,
//     appName: "My wagmi + ConnectKit App",
//     chains: [goerli],
//   })
// )

import { getDefaultConfig } from "connectkit";
import { createConfig } from "wagmi";
import { goerli } from 'wagmi/chains'

const chains = [goerli]

export const wagmiConfig = createConfig(
  getDefaultConfig({
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    // alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    chains,
    appName: 'Vite Tokenbound SDK Example',
    appDescription: 'Tokenbound SDK Example',
    appUrl: 'https://tokenbound.org',
  })
)