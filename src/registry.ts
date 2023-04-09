import {
  Address,
  getContract,
  createWalletClient,
  custom,
  fallback,
} from "viem";
import { tokenBoundABI } from "./abis/abi";
import { publicClient } from "./client";
import { goerli, mainnet } from "viem/chains";

export interface AccountArgs {
  implementation?: Address | null;
  abi?: any;
  chainId?: any;
  tokenContract: Address;
  tokenId: any;
  salt?: any;
  rpcUrls?: any;
}

export interface CreateAccountArgs {
  implementation: Address;
  abi?: any;
  chainId?: any;
  tokenContract: Address;
  tokenId: any;
  // TODO: change seed key to salt once contract is updated
  seed: any;
  initData?: string;
  rpcUrls?: any;
  signer?: string;
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

export const tokenBoundCreateAccount = async (args: CreateAccountArgs) => {
  const registryContract = getContract({
    address:
      args.implementation == undefined
        ? "0xd8d0EB5909e3e0e5F3490B9D9e09B2ba6dE80c75"
        : args.implementation,
    abi: args.abi == undefined ? tokenBoundABI : args.abi,
    publicClient,
  });
  const argumentValues = Object.values(args);
};

// TODO: return encoded function call data including the Token Bound address for executeCall({encodedData})
