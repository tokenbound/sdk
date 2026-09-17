import {
	ANVIL_ACCOUNTS,
	isAddressMatch,
	RECIPIENT_ADDRESS,
	WETH_CONTRACT_ADDRESS,
	ZORA_721,
} from "@tokenbound/test-fixtures"
import { describe, expect, it } from "vitest"

const WETH_ADDRESS = WETH_CONTRACT_ADDRESS // checksummed by the fixtures package
const WETH_LOWERCASE_ADDRESS = WETH_CONTRACT_ADDRESS.toLowerCase()
const ZORA_ADDRESS = ZORA_721.address
const INVALID_ADDRESS = "NOT AN ADDRESS"

describe("isAddressMatch", () => {
	it("should return true for two identical addresses", () => {
		expect(isAddressMatch(WETH_ADDRESS, WETH_ADDRESS)).toBe(true)
	})

	it("should return true for two addresses that differ only in case", () => {
		expect(isAddressMatch(WETH_ADDRESS, WETH_LOWERCASE_ADDRESS)).toBe(true)
	})

	it("should return false for two different addresses", () => {
		expect(isAddressMatch(WETH_ADDRESS, ZORA_ADDRESS)).toBe(false)
	})

	it("should return false for invalid address", () => {
		expect(isAddressMatch(WETH_ADDRESS, INVALID_ADDRESS)).toBe(false)
	})

	it("should return false for null or undefined addresses", () => {
		expect(isAddressMatch(null, WETH_ADDRESS)).toBe(false)
		expect(isAddressMatch(WETH_ADDRESS, undefined)).toBe(false)
		expect(isAddressMatch(null, undefined)).toBe(false)
	})

	it("matches an Anvil account address across casings", () => {
		const anvil = ANVIL_ACCOUNTS[0].address
		expect(isAddressMatch(anvil, anvil.toLowerCase())).toBe(true)
		expect(isAddressMatch(anvil, RECIPIENT_ADDRESS)).toBe(false)
	})
})
