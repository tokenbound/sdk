import { useState, useEffect, SetStateAction } from "react";

import "./App.css";
import { Address, getContract, decodeFunctionData } from "viem";
import { publicClient } from "./clients";

import { tokenBoundABI, zoraABI, demoAccountABI } from "./abis/abi";
import zoraJSON from "./abis/zora.json";
import { AccountArgs, getAccount, createAccount } from "./registry";
import ArgInput from "./components/ArgInput";
import { useAccount } from "wagmi";
import { ConnectKitButton } from "connectkit";
import { encodeExecuteCall } from "./execute";

function App() {
  const { address, isConnecting, isDisconnected } = useAccount();
  // Frontend test form vlaues
  const [implementation, setImplementation] = useState<Address | undefined>(
    undefined
  );
  const [chainId, setChainId] = useState("");
  const [tokenContract, setTokenContract] = useState<Address>(
    "0xc3321f259927a20f268f56514d73ec8796911e79"
  );
  const [tokenId, setTokenId] = useState("96");
  const [salt, setSalt] = useState("0");
  const [queryStarted, setQueryStarted] = useState(false);
  const [resultFetched, setResultFetched] = useState(false);

  //Registry class instance
  const useTokenBoundAccount = async (args: AccountArgs) => {
    const tokenBoundAddress = await getAccount(args);
    console.log(tokenBoundAddress);
  };
  const useTokenBoundCreateAccount = async () => {
    const createdAccountAddress = await createAccount({
      implementation: implementation,
      chainId: chainId,
      tokenContract: tokenContract,
      tokenId: BigInt(tokenId),
      salt: BigInt(salt),
    });
    console.log(createdAccountAddress);
  };

  //frontend test form handling
  const handleAccountSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    setQueryStarted(true);
    try {
      const result: any = await useTokenBoundAccount({
        implementation: implementation,
        chainId: chainId,
        tokenContract: tokenContract,
        tokenId: BigInt(tokenId),
        salt: BigInt(salt),
      });

      console.log(result);
      setResultFetched(true);
      setQueryStarted(false);
    } catch (error) {
      console.error(error);

      setQueryStarted(false);
    }
  };

  const handleEncodeFunctionData = async (e: {
    preventDefault: () => void;
  }) => {
    e.preventDefault();
    const encodedData = await encodeExecuteCall(
      zoraJSON,
      "safeTransferFrom",
      [
        "0x1D6b509a0df53cE05c35EC07Ede7f97E3c603c4a",
        "0xb16DCe62747EdF40Be910f3e9D7CE421ab7a1174",
        4,
      ],
      "0x1D6b509a0df53cE05c35EC07Ede7f97E3c603c4a",
      BigInt(0)
    );
    console.log(encodedData);

    const { functionName, args } = decodeFunctionData({
      abi: demoAccountABI,
      data: encodedData,
    });
    console.log({ functionName, args });
  };

  return (
    <div className="w-full p-4 relative">
      <div className="absolute top-2 right-2">
        <div>data</div>
      </div>
      <div className="py-4">
        <ConnectKitButton />
      </div>

      <p className="account"></p>
      <form className="w-1/2" onSubmit={handleAccountSubmit}>
        <p className="underline">Account</p>
        <ArgInput
          arg={"implementation"}
          argType={"address"}
          value={implementation}
          onChange={(e: {
            target: { value: SetStateAction<Address | undefined> };
          }) => setImplementation(e.target.value)}
        />
        <ArgInput
          arg={"chainId"}
          argType={"uint256"}
          value={chainId}
          onChange={(e: { target: { value: SetStateAction<string> } }) =>
            setChainId(e.target.value)
          }
        />
        <ArgInput
          arg={"tokenContract"}
          argType={"address"}
          value={tokenContract}
          onChange={(e: { target: { value: SetStateAction<Address> } }) =>
            setTokenContract(e.target.value)
          }
        />
        <ArgInput
          arg={"tokenId"}
          argType={"uint256"}
          value={tokenId}
          onChange={(e: { target: { value: SetStateAction<string> } }) =>
            setTokenId(e.target.value)
          }
        />
        <ArgInput
          arg={"salt"}
          argType={"uint256"}
          value={salt}
          onChange={(e: { target: { value: SetStateAction<string> } }) =>
            setSalt(e.target.value)
          }
        />

        <div className="w-full flex justify-between">
          <button
            type="submit"
            className={`rounded-md bg-black/90 px-3.5 py-2.5 my-4 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600 ${
              queryStarted ? "blur-sm" : ""
            }`}
          >
            account()
          </button>
          <button
            onClick={useTokenBoundCreateAccount}
            className={`rounded-md bg-black/90 px-3.5 py-2.5 my-4 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600 ${
              queryStarted ? "blur-sm" : ""
            }`}
          >
            createAccount()
          </button>
          <button
            onClick={handleEncodeFunctionData}
            className={`rounded-md bg-black/90 px-3.5 py-2.5 my-4 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600 ${
              queryStarted ? "blur-sm" : ""
            }`}
          >
            encodeFunctionData
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;
