import { Contract, Signer, utils, providers, BigNumberish, BigNumber } from "ethers";
// import erc6551RegistryAbi from "../abis/ERC6551Registry.json";
// import erc6551AccountAbi from "../abis/IERC6551Account.json";

import { erc6551AccountAbi, erc6551RegistryAbi} from '../../../abis'
import { erc6551AccountImplementationAddress, erc6551RegistryAddress } from "../../constants";

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

export function computeAccount(
  tokenContract: string,
  tokenId: string,
  chainId: number,
): `0x${string}` {
  const code = getCreationCode(
    erc6551AccountImplementationAddress,
    chainId,
    tokenContract,
    tokenId,
    "0"
  );
  const codeHash = utils.keccak256(code);
  const saltHex = utils.hexZeroPad(BigNumber.from("0").toHexString(), 32);

  // console.log('ETHR', code, codeHash, saltHex)

  return utils.getCreate2Address(
    erc6551RegistryAddress,
    saltHex,
    codeHash,
  ) as `0x${string}`
}

export function getCreationCode(
  implementation_: `0x${string}`,
  chainId_: number,
  tokenContract_: string,
  tokenId_: string,
  salt_: string,
): Uint8Array {
  const types = ["uint256", "uint256", "address", "uint256"];
  const values = [salt_, chainId_, tokenContract_, tokenId_];

  const encodedABI = utils.defaultAbiCoder.encode(types, values)
  const hexImplementation = utils.hexlify(implementation_)

  // console.log('encodedABI ethers', encodedABI) // OK
  // console.log('hexImplementation ethers', hexImplementation)
  // // returns 0x2d25602551487c3f3354dd80d76d54383a243358 (this is just the address of the implementation contract)


  
  const creationCode = utils.concat([
    "0x3d60ad80600a3d3981f3363d3d373d3d3d363d73",
    hexImplementation,
    "0x5af43d82803e903d91602b57fd5bf3",
    encodedABI
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
