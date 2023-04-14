import { Contract, Signer, providers, utils, BigNumberish } from "ethers";
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
  provider: providers.BaseProvider
) {
  const registry = new Contract(
    erc6551RegistryAddress,
    erc6551RegistryAbi,
    provider
  );

  const { chainId } = await provider.getNetwork();

  return registry.callStatic.account(
    erc6551AccountImplementationAddress,
    chainId,
    tokenContract,
    tokenId,
    0
  );
}

export async function createAccount(
  tokenContract: string,
  tokenId: string,
  signer: Signer
) {
  const registry = new Contract(
    erc6551RegistryAddress,
    erc6551RegistryAbi,
    signer
  );

  if (!signer.provider) throw Error("Signer has no provider");

  const { chainId } = await signer.provider.getNetwork();

  return registry.createAccount(
    erc6551AccountImplementationAddress,
    chainId,
    tokenContract,
    tokenId,
    0
  );
}

export async function prepareExecuteCall(
  account: string,
  to: string,
  value: BigNumberish,
  data: string
) {
  const accountInterface = new utils.Interface(erc6551AccountAbi);
  return {
    to: account,
    value,
    data: accountInterface.encodeFunctionData("executeCall", [to, value, data]),
  };
}

export async function executeCall(
  account: string,
  to: string,
  value: bigint,
  data: string,
  signer: Signer
) {
  const accountContract = new Contract(account, erc6551AccountAbi, signer);

  return accountContract.executeCall([to, value, data]);
}
