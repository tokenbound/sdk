import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { WagmiConfig, createClient, configureChains } from "wagmi";
import { mainnet, goerli } from "wagmi/chains";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

import {
  ConnectKitProvider,
  ConnectKitButton,
  getDefaultClient,
} from "connectkit";

import { Types } from "connectkit";

const TokenBoundAvatar = ({
  address,
  ensImage,
  ensName,
  size,
  radius,
}: Types.CustomAvatarProps) => {
  return (
    <div
      style={{
        overflow: "hidden",
        borderRadius: radius,
        height: size,
        width: size,
        background: "#fff",
      }}
    >
      <img src={"/swirl.png"} alt={"token bound"} width="100%" height="100%" />
    </div>
  );
};

const localNode = "http://127.0.0.1:8545";

const { chains, provider } = configureChains(
  [goerli],
  [
    // infuraProvider({
    //   apiKey: localNode,
    // }),
    jsonRpcProvider({
      rpc: () => ({
        http: `http://127.0.0.1:8545`,
      }),
    }),
    publicProvider(),
  ]
);

// => {
//   chains: Chain[],
//   provider: BaseProvider,
//   webSocketProvider: WebSocketProvider
// }

const client = createClient(
  getDefaultClient({
    appName: "Token Bound",
    chains,
  })
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <WagmiConfig client={client}>
    <ConnectKitProvider
      theme="retro"
      options={{
        customAvatar: TokenBoundAvatar,
        embedGoogleFonts: true,
      }}
    >
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </ConnectKitProvider>
  </WagmiConfig>
);
