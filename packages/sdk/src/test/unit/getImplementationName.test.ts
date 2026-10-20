import { describe, expect, it } from "vitest"
import { ERC_6551_DEFAULT, ERC_6551_LEGACY_V2 } from "../../protocol/constants"
import { getImplementationName } from "../../utils/getImplementationName"

const LEGACY = ERC_6551_LEGACY_V2.IMPLEMENTATION.ADDRESS
const V3_PROXY = ERC_6551_DEFAULT.ACCOUNT_PROXY?.ADDRESS as `0x${string}`
const CUSTOM = "0x000000000000000000000000000000000000d00d" as const

describe("getImplementationName", () => {
	it("labels the default when no address is given", () => {
		expect(getImplementationName()).toBe("Implementation: Default V3")
	})

	it("recognizes the known implementations", () => {
		expect(getImplementationName(LEGACY)).toBe("Implementation: Default V1")
		expect(getImplementationName(V3_PROXY)).toBe("Implementation: Default V3")
	})

	it("recognizes them regardless of letter case", () => {
		expect(getImplementationName(LEGACY.toLowerCase() as `0x${string}`)).toBe(
			"Implementation: Default V1",
		)
		expect(getImplementationName(V3_PROXY.toLowerCase() as `0x${string}`)).toBe(
			"Implementation: Default V3",
		)
	})

	it("labels anything else as custom, checksummed", () => {
		expect(getImplementationName(CUSTOM)).toBe(
			"Custom Implementation: 0x000000000000000000000000000000000000D00d",
		)
	})
})
