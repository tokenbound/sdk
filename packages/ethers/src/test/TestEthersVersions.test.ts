// Unit tests for the ethers version boundary.
//
// These run without a chain: they verify that v5 and v6 signers are detected
// correctly and that message normalization respects each major version's
// accepted input types. v5 and v6 are asserted independently.

import { describe, expect, it, vi } from "vitest"
import { detectEthersVersion, resolveAdapter } from "../index"
import { normalizeV5Message } from "../v5/adapter"
import { normalizeV6Message } from "../v6/adapter"

/** Minimal stand-ins; the package only relies on structural shape. */
const makeV5Signer = (overrides: Record<string, unknown> = {}) => ({
	_isSigner: true,
	sendTransaction: vi.fn(async () => ({ hash: "0xv5hash" })),
	signMessage: vi.fn(async () => "0xv5sig"),
	getAddress: vi.fn(async () => "0x000000000000000000000000000000000000c0de"),
	...overrides,
})

const makeV6Signer = (overrides: Record<string, unknown> = {}) => ({
	sendTransaction: vi.fn(async () => ({ hash: "0xv6hash" })),
	signMessage: vi.fn(async () => "0xv6sig"),
	getAddress: vi.fn(async () => "0x000000000000000000000000000000000000c0de"),
	provider: { getNetwork: vi.fn() },
	...overrides,
})

describe("detectEthersVersion", () => {
	it("detects an ethers v5 signer via _isSigner", () => {
		expect(detectEthersVersion(makeV5Signer())).toBe(5)
	})

	it("detects an ethers v5 provider via _isProvider", () => {
		expect(detectEthersVersion({ _isProvider: true } as never)).toBe(5)
	})

	it("detects an ethers v6 signer", () => {
		expect(detectEthersVersion(makeV6Signer())).toBe(6)
	})

	it("throws on a non-object", () => {
		expect(() => detectEthersVersion(null as never)).toThrow()
	})
})

describe("resolveAdapter", () => {
	it("rejects objects without sendTransaction", () => {
		expect(() => resolveAdapter({})).toThrow(/sendTransaction/)
	})

	it("builds a v5 adapter that reports version 5", () => {
		expect(resolveAdapter(makeV5Signer()).version).toBe(5)
	})

	it("builds a v6 adapter that reports version 6", () => {
		expect(resolveAdapter(makeV6Signer()).version).toBe(6)
	})

	it("returns the transaction hash from a v5 signer", async () => {
		const signer = makeV5Signer()
		const adapter = resolveAdapter(signer)
		const hash = await adapter.sendTransaction({
			to: "0x000000000000000000000000000000000000c0de",
			value: 0n,
			data: "0x",
		})
		expect(hash).toBe("0xv5hash")
		expect(signer.sendTransaction).toHaveBeenCalledOnce()
	})

	it("returns the transaction hash from a v6 signer", async () => {
		const signer = makeV6Signer()
		const adapter = resolveAdapter(signer)
		const hash = await adapter.sendTransaction({
			to: "0x000000000000000000000000000000000000c0de",
			value: 0n,
			data: "0x",
		})
		expect(hash).toBe("0xv6hash")
		expect(signer.sendTransaction).toHaveBeenCalledOnce()
	})

	it("signs via the v5 signer", async () => {
		const signer = makeV5Signer()
		expect(await resolveAdapter(signer).signMessage("gm")).toBe("0xv5sig")
	})

	it("signs via the v6 signer", async () => {
		const signer = makeV6Signer()
		expect(await resolveAdapter(signer).signMessage("gm")).toBe("0xv6sig")
	})
})

describe("reads via the signer's Provider", () => {
	it("routes getCode through the provider", async () => {
		const getCode = vi.fn(async () => "0xdeadbeef")
		const adapter = resolveAdapter(makeV6Signer({ provider: { getCode } }))
		expect(
			await adapter.getCode("0x000000000000000000000000000000000000c0de"),
		).toBe("0xdeadbeef")
		expect(getCode).toHaveBeenCalledOnce()
	})

	it("routes call through the provider", async () => {
		const call = vi.fn(async () => "0x523e3260")
		const adapter = resolveAdapter(makeV5Signer({ provider: { call } }))
		expect(
			await adapter.call({
				to: "0x000000000000000000000000000000000000c0de",
				data: "0x",
			}),
		).toBe("0x523e3260")
	})

	it("routes ENS resolution through the provider", async () => {
		// An arbitrary address — deliberately NOT a Tokenbound contract, so a
		// mix-up with the registry/implementation can't pass unnoticed.
		const RESOLVED = "0x000000000000000000000000000000000000d00d"
		const resolveName = vi.fn(async () => RESOLVED)
		const adapter = resolveAdapter(makeV6Signer({ provider: { resolveName } }))
		expect(await adapter.resolveName("jeebay.eth")).toBe(RESOLVED)
	})

	it("throws a clear error when the signer has no provider", async () => {
		// A Wallet constructed without a provider can still sign, but cannot read.
		const adapter = resolveAdapter(makeV6Signer({ provider: null }))
		await expect(
			adapter.getCode("0x000000000000000000000000000000000000c0de"),
		).rejects.toThrow(/must be connected to a Provider/)
	})

	it("reports the same error for v5 signers without a provider", async () => {
		const adapter = resolveAdapter(makeV5Signer({ provider: undefined }))
		await expect(
			adapter.call({
				to: "0x000000000000000000000000000000000000c0de",
				data: "0x",
			}),
		).rejects.toThrow(/must be connected to a Provider/)
	})
})

describe("message normalization", () => {
	it("passes strings through unchanged on v5 and v6", () => {
		expect(normalizeV5Message("gm")).toBe("gm")
		expect(normalizeV6Message("gm")).toBe("gm")
	})

	it("passes Uint8Array through unchanged on v5 and v6", () => {
		const bytes = new Uint8Array([72, 101, 108, 108, 111])
		expect(normalizeV5Message(bytes)).toBe(bytes)
		expect(normalizeV6Message(bytes)).toBe(bytes)
	})

	it("converts ArrayLike<number> to Uint8Array for v6, which rejects arrays", () => {
		const normalized = normalizeV6Message([72, 101, 108, 108, 111])
		expect(normalized).toBeInstanceOf(Uint8Array)
		expect(Array.from(normalized as Uint8Array)).toEqual([
			72, 101, 108, 108, 111,
		])
	})

	it("converts ArrayLike<number> to Uint8Array for v5 as well", () => {
		const normalized = normalizeV5Message([72, 101, 108, 108, 111])
		expect(normalized).toBeInstanceOf(Uint8Array)
		expect(Array.from(normalized as Uint8Array)).toEqual([
			72, 101, 108, 108, 111,
		])
	})

	it("is the property that lets v5 and v6 share one adapter", async () => {
		// v5 accepts number[] but v6 rejects it ("invalid BytesLike value").
		// Normalizing both to Uint8Array makes the two majors agree, which is
		// why createAdapter is version-parameterized rather than duplicated.
		const arrayLike = [72, 105]
		expect(normalizeV5Message(arrayLike)).toEqual(normalizeV6Message(arrayLike))
		expect(normalizeV5Message("gm")).toEqual(normalizeV6Message("gm"))

		const bytes = new Uint8Array([72, 105])
		expect(normalizeV5Message(bytes)).toEqual(normalizeV6Message(bytes))
	})

	it("normalizes the message before handing it to the signer", async () => {
		const v5 = makeV5Signer()
		await resolveAdapter(v5).signMessage([72, 105])
		expect(v5.signMessage).toHaveBeenCalledWith(new Uint8Array([72, 105]))

		const v6 = makeV6Signer()
		await resolveAdapter(v6).signMessage([72, 105])
		expect(v6.signMessage).toHaveBeenCalledWith(new Uint8Array([72, 105]))
	})
})
