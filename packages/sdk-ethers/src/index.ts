import { Contract, Signer, providers, utils, BigNumberish } from "ethers";
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

  const initData = new utils.Interface([
    "function initialize()",
  ]).encodeFunctionData("initialize");

  return registry.createAccount(
    erc6551AccountImplementationAddress,
    chainId,
    tokenContract,
    tokenId,
    0,
    initData
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
