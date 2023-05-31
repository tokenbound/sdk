import { test, expect } from "vitest";
import { getAccount } from "../src/index";

test(".getAccount", async () => {
  const result = getAccount(5, "0x7a77F2cFB02546F217d39157471d5B5914DD7644", "1");
  expect(result).toEqual("0x5194b1c04Ed6464b3225324d6794f7d2698D8d1c");
});
