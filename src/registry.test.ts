import { assertType, describe, expect, it } from "vitest";
import { AccountArgs, createAccount, getAccount } from "./registry";
import { Address } from "viem";

const defaultArgs: AccountArgs = {
  implementation: "0xc3321f259927a20f268f56514d73ec8796911e79",
  chainId: BigInt(5),
  tokenContract: "0xc3321f259927a20f268f56514d73ec8796911e79",
  tokenId: BigInt(96),
  salt: BigInt(0),
};

// TODO: more robust tests with dynamic data
describe("getAccount", async () => {
  it("should return a valid Ox address for the Token Bound account", async () => {
    const tokenBoundAddress = await getAccount(defaultArgs);

    assertType<Address>(tokenBoundAddress);

    const consecutiveTokenBoundAddressCall = await getAccount(defaultArgs);
    expect(consecutiveTokenBoundAddressCall).toStrictEqual(tokenBoundAddress);
  });
});

describe("createAccount", async () => {
  it("should return a valid Ox address for the created Token Bound account", async () => {
    const createdAccountAddress = await createAccount({
      ...defaultArgs,
      initData: "",
    });

    assertType<Address>(createdAccountAddress);

    const consecutiveTokenBoundAddressCall = await createAccount({
      ...defaultArgs,
      initData: "",
    });
    expect(consecutiveTokenBoundAddressCall).toStrictEqual(
      createdAccountAddress
    );
  });
});
