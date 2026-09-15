// Deterministic protocol tests. No network, no anvil: these exercise the
// library-independent layer that both @tokenbound/sdk and @tokenbound/ethers use.

import { getAddress, isAddress, isHex } from "viem"
import { describe, expect, it } from "vitest"
import {
	computeAccount,
	deconstructBytecode,
	encodeERC20Transfer,
	encodeETHTransfer,
	encodeExecuteCall,
	encodeExecution,
	encodeNFTTransfer,
	getAccountAddress,
	getTokenboundV3Account,
	isCustomImplementation,
	prepareCreateAccountTx,
	resolveDeployment,
} from "../../protocol"
import { ERC_6551_DEFAULT, ERC_6551_LEGACY_V2 } from "../../protocol/constants"
import { TBVersion } from "../../types"

const TOKEN_CONTRACT = getAddress("0x7c74dfe39976dc395529c14e54a597809980e01c")
const TOKEN_ID = "1"
const CHAIN_ID = 1

describe("resolveDeployment", () => {
	it("defaults to the V3 deployment", () => {
		const deployment = resolveDeployment({})
		expect(deployment.supportsV3).toBe(true)
		expect(deployment.implementationAddress).toBe(
			ERC_6551_DEFAULT.ACCOUNT_PROXY?.ADDRESS,
		)
		expect(deployment.registryAddress).toBe(ERC_6551_DEFAULT.REGISTRY.ADDRESS)
	})

	it("resolves V2 when the version is pinned", () => {
		const deployment = resolveDeployment({ version: TBVersion.V2 })
		expect(deployment.supportsV3).toBe(false)
		expect(deployment.registryAddress).toBe(ERC_6551_LEGACY_V2.REGISTRY.ADDRESS)
	})

	it("infers V2 from a legacy implementation address", () => {
		const deployment = resolveDeployment({
			implementationAddress: ERC_6551_LEGACY_V2.IMPLEMENTATION.ADDRESS,
		})
		expect(deployment.supportsV3).toBe(false)
		expect(deployment.registryAddress).toBe(ERC_6551_LEGACY_V2.REGISTRY.ADDRESS)
	})

	it("honours a custom registry address when pinned to V2", () => {
		const custom = getAddress("0x000000000000000000000000000000000000dEaD")
		const deployment = resolveDeployment({
			version: TBVersion.V2,
			registryAddress: custom,
		})
		expect(deployment.registryAddress).toBe(custom)
	})
})

describe("account derivation", () => {
	it("derives a V3 account deterministically", () => {
		const a = getAccountAddress(
			{ tokenContract: TOKEN_CONTRACT, tokenId: TOKEN_ID, chainId: CHAIN_ID },
			resolveDeployment({}),
		)
		const b = getAccountAddress(
			{ tokenContract: TOKEN_CONTRACT, tokenId: TOKEN_ID, chainId: CHAIN_ID },
			resolveDeployment({}),
		)
		expect(isAddress(a)).toBe(true)
		expect(a).toBe(b)
	})

	it("matches the standalone V3 derivation function", () => {
		const deployment = resolveDeployment({})
		expect(
			getAccountAddress(
				{ tokenContract: TOKEN_CONTRACT, tokenId: TOKEN_ID, chainId: CHAIN_ID },
				deployment,
			),
		).toBe(
			getTokenboundV3Account(
				TOKEN_CONTRACT,
				TOKEN_ID,
				CHAIN_ID,
				deployment.implementationAddress,
				deployment.registryAddress,
				0,
			),
		)
	})

	it("matches the standalone V2 derivation function", () => {
		const deployment = resolveDeployment({ version: TBVersion.V2 })
		expect(
			getAccountAddress(
				{ tokenContract: TOKEN_CONTRACT, tokenId: TOKEN_ID, chainId: CHAIN_ID },
				deployment,
			),
		).toBe(
			computeAccount(
				TOKEN_CONTRACT,
				TOKEN_ID,
				CHAIN_ID,
				deployment.implementationAddress,
				deployment.registryAddress,
				0,
			),
		)
	})

	it("derives a different address for a different salt", () => {
		const deployment = resolveDeployment({})
		const base = getAccountAddress(
			{ tokenContract: TOKEN_CONTRACT, tokenId: TOKEN_ID, chainId: CHAIN_ID },
			deployment,
		)
		const salted = getAccountAddress(
			{
				tokenContract: TOKEN_CONTRACT,
				tokenId: TOKEN_ID,
				chainId: CHAIN_ID,
				salt: 6551,
			},
			deployment,
		)
		expect(salted).not.toBe(base)
	})

	it("derives a different address per chain", () => {
		const deployment = resolveDeployment({})
		const mainnetAcct = getAccountAddress(
			{ tokenContract: TOKEN_CONTRACT, tokenId: TOKEN_ID, chainId: 1 },
			deployment,
		)
		const zoraAcct = getAccountAddress(
			{ tokenContract: TOKEN_CONTRACT, tokenId: TOKEN_ID, chainId: 7777777 },
			deployment,
		)
		expect(mainnetAcct).not.toBe(zoraAcct)
	})

	it("derives V2 and V3 accounts to different addresses", () => {
		const v3 = getAccountAddress(
			{ tokenContract: TOKEN_CONTRACT, tokenId: TOKEN_ID, chainId: CHAIN_ID },
			resolveDeployment({}),
		)
		const v2 = getAccountAddress(
			{ tokenContract: TOKEN_CONTRACT, tokenId: TOKEN_ID, chainId: CHAIN_ID },
			resolveDeployment({ version: TBVersion.V2 }),
		)
		expect(v2).not.toBe(v3)
	})
})

describe("isCustomImplementation", () => {
	it("is false for the canonical deployment", () => {
		expect(isCustomImplementation(resolveDeployment({}))).toBe(false)
	})

	it("is true for a third-party implementation", () => {
		const deployment = resolveDeployment({
			implementationAddress: getAddress(
				"0x000000000000000000000000000000000000bEEF",
			),
		})
		expect(isCustomImplementation(deployment)).toBe(true)
	})
})

describe("prepareCreateAccountTx", () => {
	it("routes standard V3 creation through multicall3", async () => {
		const tx = await prepareCreateAccountTx(
			{ tokenContract: TOKEN_CONTRACT, tokenId: TOKEN_ID, chainId: CHAIN_ID },
			resolveDeployment({}),
		)
		expect(isHex(tx.data as string)).toBe(true)
		expect(tx.value).toBe(0n)
	})

	it("returns a direct registry call for custom implementations", async () => {
		const deployment = resolveDeployment({
			implementationAddress: getAddress(
				"0x000000000000000000000000000000000000bEEF",
			),
			registryAddress: ERC_6551_DEFAULT.REGISTRY.ADDRESS,
		})
		const tx = await prepareCreateAccountTx(
			{ tokenContract: TOKEN_CONTRACT, tokenId: TOKEN_ID, chainId: CHAIN_ID },
			deployment,
		)
		expect(getAddress(tx.to as string)).toBe(ERC_6551_DEFAULT.REGISTRY.ADDRESS)
	})

	it("rejects appendedCalls on the legacy V2 implementation", async () => {
		await expect(
			prepareCreateAccountTx(
				{
					tokenContract: TOKEN_CONTRACT,
					tokenId: TOKEN_ID,
					chainId: CHAIN_ID,
					appendedCalls: [
						{ target: TOKEN_CONTRACT, allowFailure: false, callData: "0x" },
					],
				},
				resolveDeployment({ version: TBVersion.V2 }),
			),
		).rejects.toThrow(/Multicall via appendedCalls is not supported/)
	})
})

describe("execution encoding", () => {
	const account = getAddress("0x000000000000000000000000000000000000c0de")

	it("encodes a V3 execution targeting the account", () => {
		const encoded = encodeExecution({
			account,
			to: TOKEN_CONTRACT,
			value: 0n,
			data: "0x",
		})
		expect(encoded.to).toBe(account)
		expect(isHex(encoded.data)).toBe(true)
	})

	it("encodes a legacy V2 executeCall", async () => {
		const encoded = await encodeExecuteCall({
			account,
			to: TOKEN_CONTRACT,
			value: 0n,
			data: "0x",
		})
		expect(encoded.to).toBe(account)
		expect(isHex(encoded.data)).toBe(true)
	})

	it("produces different calldata for V2 and V3 executions", async () => {
		const v3 = encodeExecution({
			account,
			to: TOKEN_CONTRACT,
			value: 1n,
			data: "0x",
		})
		const v2 = await encodeExecuteCall({
			account,
			to: TOKEN_CONTRACT,
			value: 1n,
			data: "0x",
		})
		expect(v3.data).not.toBe(v2.data)
	})
})

describe("transfer encoding", () => {
	const account = getAddress("0x000000000000000000000000000000000000c0de")
	const recipient = getAddress("0x02101dfb77fde026414827fdc604ddaf224f0921")

	it("encodes an ERC721 transfer", () => {
		const t = encodeNFTTransfer({
			account,
			tokenType: "ERC721",
			tokenContract: TOKEN_CONTRACT,
			tokenId: TOKEN_ID,
			recipient,
		})
		expect(t.to).toBe(TOKEN_CONTRACT)
		expect(t.value).toBe(0n)
		expect(isHex(t.data)).toBe(true)
	})

	it("rejects ERC721 transfers with an amount other than 1", () => {
		expect(() =>
			encodeNFTTransfer({
				account,
				tokenType: "ERC721",
				tokenContract: TOKEN_CONTRACT,
				tokenId: TOKEN_ID,
				recipient,
				amount: 2,
			}),
		).toThrow(/ERC721 transfers can only transfer one token at a time/)
	})

	it("encodes an ERC1155 transfer with an amount", () => {
		const t = encodeNFTTransfer({
			account,
			tokenType: "ERC1155",
			tokenContract: TOKEN_CONTRACT,
			tokenId: TOKEN_ID,
			recipient,
			amount: 4,
		})
		expect(isHex(t.data)).toBe(true)
	})

	it("encodes an ETH transfer in wei", () => {
		const t = encodeETHTransfer({ recipient, amount: 0.1 })
		expect(t.to).toBe(recipient)
		expect(t.value).toBe(100000000000000000n)
		expect(t.data).toBe("0x")
	})

	it("encodes an ERC-20 transfer", () => {
		const t = encodeERC20Transfer({
			recipient,
			amount: 1,
			erc20tokenAddress: TOKEN_CONTRACT,
			erc20tokenDecimals: 18,
		})
		expect(t.to).toBe(TOKEN_CONTRACT)
		expect(isHex(t.data)).toBe(true)
	})

	it("rejects out-of-range ERC-20 decimals", () => {
		expect(() =>
			encodeERC20Transfer({
				recipient,
				amount: 1,
				erc20tokenAddress: TOKEN_CONTRACT,
				erc20tokenDecimals: 19,
			}),
		).toThrow(/Decimal value out of range/)
	})
})

describe("deconstructBytecode", () => {
	it("returns null for undeployed accounts", () => {
		expect(deconstructBytecode(undefined)).toBeNull()
		expect(deconstructBytecode("0x")).toBeNull()
	})
})
