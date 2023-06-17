import { getDefaultClient } from "connectkit";
import { createClient } from "wagmi";
import { goerli } from "wagmi";

export const wagmiClient = createClient(
  getDefaultClient({
    autoConnect: true,
    appName: "My wagmi + ConnectKit App",
    chains: [goerli],
  })
)