import { assertType, describe, expect, it } from "vitest";
import assert from "assert";
import { AccountArgs, Registry } from "./registry";
import { Address } from "viem";

describe("Account", async () => {
  it("should return a valid Ox address for the Token Bound account", async () => {
    const useTokenBound = new Registry({
      implementation: "0x1D6b509a0df53cE05c35EC07Ede7f97E3c603c4a",
      chainId: BigInt(123),
      tokenContract: "0x1D6b509a0df53cE05c35EC07Ede7f97E3c603c4a",
      tokenId: BigInt(456),
      salt: BigInt(789),
    });

    const tokenBoundAddress = await useTokenBound.address();
    assertType<Address>(tokenBoundAddress);

    const consecutiveTokenBoundAddressCall = await useTokenBound.address();
    expect(consecutiveTokenBoundAddressCall).toStrictEqual(tokenBoundAddress);
  });
});
