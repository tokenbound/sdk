import { Address, getContract } from "viem";
import { tokenBoundABI } from "./abis/abi";
import { publicClient } from "./client";

const registryContract = getContract({
  address: "0xd8d0EB5909e3e0e5F3490B9D9e09B2ba6dE80c75",
  abi: tokenBoundABI,
  publicClient,
});

export interface AccountArgs {
  implementation: Address;
  chainId: any;
  tokenContract: Address;
  tokenId: any;
  salt: any;
  initData?: string;
  signer?: string;
}

export class Registry {
  constructor(public readonly args: AccountArgs) {}

  public async address(): Promise<Address> {
    const argumentValues: any = Object.values(this.args);
    return await registryContract.read.account(argumentValues);
  }

  // TODO: add ability to pass wallet client in to deploy accounts to registry
  public async create(): Promise<Address> {
    const argumentValues = Object.values(this.args);
    const signer = argumentValues.pop();
    console.log(argumentValues, signer);
    return `0xhello`;
  }
}
