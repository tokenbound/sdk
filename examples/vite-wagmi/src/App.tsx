import { ConnectKitButton } from "connectkit";
import { useAccount, useProvider, useSigner } from "wagmi";

import { Account } from "./components";

import { createPublicClient, http } from "viem";
import { goerli } from "viem/chains";
import { getAccount, prepareExecuteCall } from "@tokenbound/sdk";
import {
  erc6551AccountImplementationAddress,
  getAccount as getAccountEthers,
  prepareExecuteCall as prepareExecuteCallEthers,
} from "@tokenbound/sdk-ethers";

import { useEffect } from "react";

const client = createPublicClient({
  chain: goerli,
  transport: http(),
});

export function App() {
  const { isConnected } = useAccount();

  const provider = useProvider();
  const { data: signer, isError, isLoading } = useSigner();

  useEffect(() => {
    async function testViemSdk() {
      const account = await getAccount(
        "0xe7134a029cd2fd55f678d6809e64d0b6a0caddcb",
        "9",
        client
      );

      console.log(account);

      const encoded = await prepareExecuteCall(account, account, 0n, "");
      console.log(encoded);
    }

    testViemSdk();
  }, []);

  useEffect(() => {
    async function testEthersSdk() {
      const account = await getAccountEthers(
        "0xe7134a029cd2fd55f678d6809e64d0b6a0caddcb",
        "9",
        provider
      );

      console.log(account);

      const encoded = await prepareExecuteCallEthers(account, account, 0, "0x");

      console.log(encoded);
    }

    testEthersSdk();
  }, []);

  return (
    <>
      <h1>wagmi + ConnectKit + Vite</h1>
      <ConnectKitButton />
      {isConnected && <Account />}
    </>
  );
}
