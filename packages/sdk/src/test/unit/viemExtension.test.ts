// viem .extend(tokenboundActions()) tests: shape, wiring, deterministic
// behavior and type inference. These run without anvil; the anvil-backed
// integration coverage lives in TestAll.test.ts.

import {
	type Address,
	createPublicClient,
	createWalletClient,
	http,
	isAddress,
} from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { mainnet } from "viem/chains"
import { describe, expect, it } from "vitest"
import {
	encodeExecuteCall,
	getAccountAddress,
	resolveDeployment,
} from "../../protocol"
import { TBVersion } from "../../types"
import { tokenboundActions } from "../../viem"
import { getAccount as getAccountAction } from "../../viem/actions"

const TOKEN_CONTRACT: Address = "0x7c74dfe39976dc395529c14e54a597809980e01c"
const TOKEN_ID = "1"
const RPC = "http://127.0.0.1:8545"

const account = privateKeyToAccount(
	"0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
)

const publicClient = createPublicClient({
	chain: mainnet,
	transport: http(RPC),
})
const walletClient = createWalletClient({
	chain: mainnet,
	transport: http(RPC),
	account,
})

describe("tokenboundActions decorator", () => {
	it("namespaces the API under .tokenbound", () => {
		const client = publicClient.extend(tokenboundActions())
		expect(client.tokenbound).toBeDefined()
		expect(typeof client.tokenbound.getAccount).toBe("function")
	})

	it("preserves the underlying viem client actions", () => {
		const client = publicClient.extend(tokenboundActions())
		// The decorator must not shadow viem's own actions.
		expect(typeof client.getBlockNumber).toBe("function")
		expect(typeof client.readContract).toBe("function")
		expect(client.chain?.id).toBe(mainnet.id)
	})

	it("exposes read actions on a public client", () => {
		const client = publicClient.extend(tokenboundActions())
		for (const method of [
			"getAccount",
			"prepareCreateAccount",
			"prepareExecution",
			"checkAccountDeployment",
			"deconstructBytecode",
			"getNFT",
			"isValidSigner",
		]) {
			expect(typeof (client.tokenbound as never)[method]).toBe("function")
		}
	})

	it("exposes write actions on a wallet client", () => {
		const client = walletClient.extend(tokenboundActions())
		for (const method of [
			"createAccount",
			"execute",
			"transferNFT",
			"transferETH",
			"transferERC20",
			"signMessage",
		]) {
			expect(typeof (client.tokenbound as never)[method]).toBe("function")
		}
	})

	it("derives the same address as the protocol layer", () => {
		const client = publicClient.extend(tokenboundActions())
		const viaExtension = client.tokenbound.getAccount({
			tokenContract: TOKEN_CONTRACT,
			tokenId: TOKEN_ID,
		})
		const viaProtocol = getAccountAddress(
			{ tokenContract: TOKEN_CONTRACT, tokenId: TOKEN_ID, chainId: mainnet.id },
			resolveDeployment({}),
		)
		expect(viaExtension).toBe(viaProtocol)
		expect(isAddress(viaExtension)).toBe(true)
	})

	it("derives the same address as the standalone action", () => {
		const client = publicClient.extend(tokenboundActions())
		expect(
			client.tokenbound.getAccount({
				tokenContract: TOKEN_CONTRACT,
				tokenId: TOKEN_ID,
			}),
		).toBe(
			getAccountAction(publicClient, {
				tokenContract: TOKEN_CONTRACT,
				tokenId: TOKEN_ID,
			}),
		)
	})

	it("honours a pinned V2 deployment passed to the decorator", () => {
		const v3Client = publicClient.extend(tokenboundActions())
		const v2Client = publicClient.extend(
			tokenboundActions({ version: TBVersion.V2 }),
		)
		const params = { tokenContract: TOKEN_CONTRACT, tokenId: TOKEN_ID }
		expect(v2Client.tokenbound.getAccount(params)).not.toBe(
			v3Client.tokenbound.getAccount(params),
		)
	})

	it("routes prepareExecution through V2 executeCall encoding", async () => {
		// On a V2 deployment the extension must fall back to the legacy
		// executeCall encoding, exactly as the class API does.
		const v2Client = publicClient.extend(
			tokenboundActions({ version: TBVersion.V2 }),
		)
		const account = v2Client.tokenbound.getAccount({
			tokenContract: TOKEN_CONTRACT,
			tokenId: TOKEN_ID,
		})
		const args = {
			account,
			to: TOKEN_CONTRACT,
			value: 0n,
			data: "0x" as const,
		}

		const viaExtension = await v2Client.tokenbound.prepareExecution(args)
		const viaProtocol = await encodeExecuteCall(args)

		expect(viaExtension.data).toBe(viaProtocol.data)
		expect(viaExtension.to).toBe(account)
	})

	it("encodes V2 and V3 executions differently", async () => {
		const v2Client = publicClient.extend(
			tokenboundActions({ version: TBVersion.V2 }),
		)
		const v3Client = publicClient.extend(tokenboundActions())
		const account = v3Client.tokenbound.getAccount({
			tokenContract: TOKEN_CONTRACT,
			tokenId: TOKEN_ID,
		})
		const args = { account, to: TOKEN_CONTRACT, value: 1n, data: "0x" as const }

		const v2 = await v2Client.tokenbound.prepareExecution(args)
		const v3 = await v3Client.tokenbound.prepareExecution(args)

		expect(v2.data).not.toBe(v3.data)
	})

	it("rejects isValidSigner on a V2 deployment", async () => {
		const v2Client = walletClient.extend(
			tokenboundActions({ version: TBVersion.V2 }),
		)
		await expect(
			v2Client.tokenbound.isValidSigner({
				account: TOKEN_CONTRACT,
			}),
		).rejects.toThrow(/not supported using the V2 implementation/)
	})

	it("rejects appendedCalls on a V2 deployment", async () => {
		const v2Client = publicClient.extend(
			tokenboundActions({ version: TBVersion.V2 }),
		)
		await expect(
			v2Client.tokenbound.prepareCreateAccount({
				tokenContract: TOKEN_CONTRACT,
				tokenId: TOKEN_ID,
				appendedCalls: [
					{ target: TOKEN_CONTRACT, allowFailure: false, callData: "0x" },
				],
			}),
		).rejects.toThrow(/Multicall via appendedCalls is not supported/)
	})

	it("derives V2 accounts identically to the protocol layer", () => {
		const v2Client = publicClient.extend(
			tokenboundActions({ version: TBVersion.V2 }),
		)
		expect(
			v2Client.tokenbound.getAccount({
				tokenContract: TOKEN_CONTRACT,
				tokenId: TOKEN_ID,
			}),
		).toBe(
			getAccountAddress(
				{
					tokenContract: TOKEN_CONTRACT,
					tokenId: TOKEN_ID,
					chainId: mainnet.id,
				},
				resolveDeployment({ version: TBVersion.V2 }),
			),
		)
	})

	it("honours a custom salt", () => {
		const client = publicClient.extend(tokenboundActions())
		expect(
			client.tokenbound.getAccount({
				tokenContract: TOKEN_CONTRACT,
				tokenId: TOKEN_ID,
				salt: 6551,
			}),
		).not.toBe(
			client.tokenbound.getAccount({
				tokenContract: TOKEN_CONTRACT,
				tokenId: TOKEN_ID,
			}),
		)
	})

	it("prepares a create-account transaction without sending it", async () => {
		const client = publicClient.extend(tokenboundActions())
		const tx = await client.tokenbound.prepareCreateAccount({
			tokenContract: TOKEN_CONTRACT,
			tokenId: TOKEN_ID,
		})
		expect(tx.data).toMatch(/^0x/)
	})

	it("composes with other decorators", () => {
		const client = publicClient
			.extend(tokenboundActions())
			.extend(() => ({ customAction: () => "ok" as const }))
		expect(client.tokenbound).toBeDefined()
		expect(client.customAction()).toBe("ok")
	})
})
