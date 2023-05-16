import {
  getContract,
  PublicClient,
  WalletClient,
  encodeFunctionData,
} from "viem";

import erc6551RegistryAbi from "../abis/ERC6551Registry.json";
import erc6551AccountAbi from "../abis/IERC6551Account.json";

export { erc6551AccountAbi, erc6551RegistryAbi };

export const erc6551RegistryAddress =
  "0x02101dfB77FDE026414827Fdc604ddAF224F0921" as const;

export const erc6551AccountImplementationAddress =
  "0x2d25602551487c3f3354dd80d76d54383a243358" as const;

export async function getAccount(
  tokenContract: string,
  tokenId: string,
  client: PublicClient
): Promise<`0x${string}`> {
  const registry = getContract({
    address: erc6551RegistryAddress,
    abi: erc6551RegistryAbi,
    publicClient: client,
  });

  const chainId = await client.getChainId();

  const account = await registry.read.account([
    erc6551AccountImplementationAddress,
    chainId,
    tokenContract,
    tokenId,
    0,
  ]);

  return account as `0x${string}`;
}

export async function createAccount(
  tokenContract: string,
  tokenId: string,
  client: WalletClient
) {
  const registry = getContract({
    address: erc6551RegistryAddress,
    abi: erc6551RegistryAbi,
    walletClient: client,
  });

  const chainId = await client.getChainId();

  const initData = encodeFunctionData({
    abi: [
      {
        inputs: [],
        name: "initialize",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    functionName: "initialize",
  });

  return registry.write.createAccount([
    erc6551AccountImplementationAddress,
    chainId,
    tokenContract,
    tokenId,
    0,
    initData,
  ]);
}

export async function prepareExecuteCall(
  account: string,
  to: string,
  value: bigint,
  data: string
) {
  return {
    to: account as `0x${string}`,
    value,
    data: encodeFunctionData({
      abi: erc6551AccountAbi,
      functionName: "executeCall",
      args: [to as `0x${string}`, value, data as `0x${string}`],
    }),
  };
}

export async function executeCall(
  account: string,
  to: string,
  value: bigint,
  data: string,
  client: WalletClient
) {
  const registry = getContract({
    address: account as `0x${string}`,
    abi: erc6551AccountAbi,
    walletClient: client,
  });

  return registry.write.executeCall([
    to as `0x${string}`,
    value,
    data as `0x${string}`,
  ]);
}
