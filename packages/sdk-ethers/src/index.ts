import { Contract, Signer, utils, BigNumberish, BigNumber } from "ethers";
import erc6551RegistryAbi from "../abis/ERC6551Registry.json";
import erc6551AccountAbi from "../abis/IERC6551Account.json";

export { erc6551AccountAbi, erc6551RegistryAbi };

export const erc6551RegistryAddress =
  "0x1472D0f5c6c151df96352Ec271B8dF1093370A7A" as const;

export const erc6551AccountImplementationAddress =
  "0x36963236d915e4e9b5f70677eBD1ea3e69Cfbbd6" as const;

export function getAccount(
  tokenContract: string,
  tokenId: string,
  chainId: number,
): string {
  const code = getCreationCode(
    erc6551AccountImplementationAddress,
    chainId,
    tokenContract,
    tokenId,
    "0"
  );
  const codeHash = utils.keccak256(code);
  const saltHex = utils.hexZeroPad(BigNumber.from("0").toHexString(), 32);
  return utils.getCreate2Address(
    erc6551RegistryAddress,
    saltHex,
    codeHash,
  );
}

export function getCreationCode(
  implementation_: string,
  chainId_: number,
  tokenContract_: string,
  tokenId_: string,
  salt_: string,
): Uint8Array {
  const types = ["uint256", "uint256", "address", "uint256"];
  const values = [salt_, chainId_, tokenContract_, tokenId_];
  const creationCode = utils.concat([
    "0x3d60ad80600a3d3981f3363d3d373d3d3d363d73",
    utils.hexlify(implementation_),
    "0x5af43d82803e903d91602b57fd5bf3",
    utils.defaultAbiCoder.encode(types, values)
  ]);

  return creationCode;
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
    0,
    "0x"
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
