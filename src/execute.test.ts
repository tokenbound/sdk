import { assertType, describe, expect, it } from "vitest";
import { AccountArgs, createAccount, getAccount } from "./registry";
import { decodeFunctionData } from "viem";
import { encodeExecuteCall } from "./execute";

import zoraJSON from "./abis/zora.json";

const defaultArgs: AccountArgs = {
  implementation: "0xc3321f259927a20f268f56514d73ec8796911e79",
  chainId: BigInt(5),
  tokenContract: "0xc3321f259927a20f268f56514d73ec8796911e79",
  tokenId: BigInt(96),
  salt: BigInt(0),
};

// TODO: more robust tests with dynamic data
describe("encodeExecuteCall", async () => {
  it("should return valid byte data for a function call to executeCall, containing the encoded function call specified by the user", async () => {
    const encodedData = await encodeExecuteCall(
      zoraJSON,
      "safeTransferFrom",
      [
        "0x1D6b509a0df53cE05c35EC07Ede7f97E3c603c4a",
        "0xb16DCe62747EdF40Be910f3e9D7CE421ab7a1174",
        4,
      ],
      "0x1D6b509a0df53cE05c35EC07Ede7f97E3c603c4a",
      BigInt(0)
    );

    assertType<string>(encodedData);
  });
});
