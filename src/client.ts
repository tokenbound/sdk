import { createPublicClient, http, createWalletClient, custom } from "viem";
import { goerli, mainnet } from "viem/chains";

export const publicClient = createPublicClient({
  chain: goerli,
  transport: http(),
});

// TODO: add wallet client for signing transactions
