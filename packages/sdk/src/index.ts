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
  "0x1472D0f5c6c151df96352Ec271B8dF1093370A7A" as const;

export const erc6551AccountImplementationAddress =
  "0x36963236d915e4e9b5f70677eBD1ea3e69Cfbbd6" as const;

export async function getAccount(
  tokenContract: string,
  tokenId: string,
  client: PublicClient
): Promise<`0x${string}`> {
  const registry = getContract({
    address: "0x1472d0f5c6c151df96352ec271b8df1093370a7a",
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
    address: "0x1472d0f5c6c151df96352ec271b8df1093370a7a",
    abi: erc6551RegistryAbi,
    walletClient: client,
  });

  const chainId = await client.getChainId();

  return registry.write.createAccount([
    erc6551AccountImplementationAddress,
    chainId,
    tokenContract,
    tokenId,
    0,
    "",
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
