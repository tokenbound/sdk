import { useState, useEffect, SetStateAction } from "react";

import "./App.css";
import { Address, getContract } from "viem";
import { publicClient } from "./client";

import { tokenBoundABI } from "./abis/abi";
import { AccountArgs, Registry } from "./registry";
import ArgInput from "./components/ArgInput";

function App() {
  // Frontend test form vlaues
  const [implementation, setImplementation] = useState<Address>(
    "0x1D6b509a0df53cE05c35EC07Ede7f97E3c603c4a"
  );
  const [chainId, setChainId] = useState("5");
  const [tokenContract, setTokenContract] = useState<Address>(
    "0xc3321f259927a20f268f56514d73ec8796911e79"
  );
  const [tokenId, setTokenId] = useState("96");
  const [salt, setSalt] = useState("808");
  const [queryStarted, setQueryStarted] = useState(false);
  const [resultFetched, setResultFetched] = useState(false);

  //Registry class instance
  const useTokenBound = async (args: AccountArgs) => {
    const account = new Registry(args);
    const tokenBoundAddress = await account.address();
    console.log(tokenBoundAddress);
  };

  //frontend test form handling
  const handleFormSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    setQueryStarted(true);
    try {
      const result: any = await useTokenBound({
        implementation: implementation,
        chainId: BigInt(chainId),
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

  return (
    <div className="w-full p-4">
      <p className="account"></p>
      <form className="w-1/2" onSubmit={handleFormSubmit}>
        <p className="underline">Account</p>
        <ArgInput
          arg={"implementation"}
          argType={"address"}
          value={implementation}
          onChange={(e: { target: { value: SetStateAction<Address> } }) =>
            setImplementation(e.target.value)
          }
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

        <button
          type="submit"
          className={`rounded-md bg-indigo-600 px-3.5 py-2.5 my-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
            queryStarted ? "blur-sm" : ""
          }`}
        >
          Log To Console
        </button>
      </form>
    </div>
  );
}

export default App;
