import { 
  // getDefaultClient,
   getDefaultConfig } from "connectkit";
// import { createClient, goerli } from "wagmi";
import { createConfig } from "wagmi";
import { goerli, mainnet } from 'wagmi/chains'

// const chains = [mainnet, goerli]
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

// export const client = createConfig(
//   getDefaultConfig({
//     autoConnect: true,
//     appName: "My wagmi + ConnectKit App",
//     chains: [goerli],
//   })
// );
