import { createPublicClient, createTestClient, http, custom } from "viem";
import { goerli, mainnet, foundry } from "viem/chains";

export const publicClient = createPublicClient({
  chain: goerli,
  transport: http(),
});

export const testClient = createTestClient({
  chain: foundry,
  mode: "anvil",
  transport: http("http://127.0.0.1:8545"),
});

// TODO: add wallet client for signing transactions
