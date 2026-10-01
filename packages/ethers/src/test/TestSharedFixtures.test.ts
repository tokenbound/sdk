// Guards the shared-fixture contract: if either suite starts using a different
// contract, account or recipient, this fails instead of silently diverging.

import {
	ANVIL_ACCOUNTS,
	ETH_ADDRESS_REGEX,
	RECIPIENT_ADDRESS,
	WETH_CONTRACT_ADDRESS,
	ZORA_721,
	ZORA_1155,
} from "@tokenbound/test-fixtures"
import { describe, expect, it } from "vitest"

describe("shared fixtures", () => {
	it("exposes the contracts both suites transact against", () => {
		expect(ZORA_721.address).toMatch(ETH_ADDRESS_REGEX)
		expect(ZORA_1155.address).toMatch(ETH_ADDRESS_REGEX)
		expect(WETH_CONTRACT_ADDRESS).toMatch(ETH_ADDRESS_REGEX)
	})

	it("uses a recipient that is not a Tokenbound contract", () => {
		expect(RECIPIENT_ADDRESS).toMatch(ETH_ADDRESS_REGEX)
	})

	it("exposes the anvil accounts both suites sign with", () => {
		expect(ANVIL_ACCOUNTS).toHaveLength(2)
		expect(ANVIL_ACCOUNTS[0].address).toMatch(ETH_ADDRESS_REGEX)
	})
})
