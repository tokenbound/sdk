import {
  Address,
  getContract,
  createWalletClient,
  custom,
  fallback,
} from "viem";
import { tokenBoundABI } from "./abis/abi";
import { publicClient, testClient } from "./clients";
import { goerli, mainnet } from "viem/chains";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";

export interface AccountArgs {
  implementation?: Address | null;
  abi?: any;
  chainId?: any;
  tokenContract: Address;
  tokenId: any;
  salt?: any;
  rpcUrls?: any;
  initData?: any;
  signer?: any;
}

const TBImplementation = "0xd8d0EB5909e3e0e5F3490B9D9e09B2ba6dE80c75";

// Account

//TODO: come up with a better function naming scheme
export const tokenBoundAccount = async (args: AccountArgs) => {
  const registryContract = getContract({
    address: args.implementation ?? TBImplementation,
    abi: args.abi ?? tokenBoundABI,
    // TODO: add RPC client args and fallbacks
    publicClient,
  });

  return await registryContract.read.account([
    args.implementation ?? TBImplementation,
    // TODO: use connected chainID or add top-level config option
    args.chainId ?? 5,
    args.tokenContract,
    args.tokenId,
    args.salt ?? 0,
  ]);
};

export const tokenBoundCreateAccount = async (callData: AccountArgs) => {
  const privateKey = generatePrivateKey();
  const account = privateKeyToAccount(privateKey);
  const { result } = await publicClient.simulateContract({
    address: callData.implementation ?? TBImplementation,
    abi: callData.abi ?? tokenBoundABI,
    functionName: "createAccount",
    args: [
      callData.implementation ?? TBImplementation,
      // TODO: use connected chainID or add top-level config option
      callData.chainId ?? 5,
      callData.tokenContract,
      callData.tokenId,
      callData.salt ?? 0,
      callData.initData ?? "",
    ],
    account,
  });
};

// TODO: return encoded function call data including the Token Bound address for executeCall({encodedData})
