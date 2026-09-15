// Type-level tests for the viem .extend(tokenboundActions()) surface.
//
// These assert on *values* returned by the actions rather than on
// `expectTypeOf(fn).returns`, because the latter erases to `any` and would
// silently pass. Failures here surface as compile errors under
// `vitest --typecheck`.
//
// Async assertions live inside `assertTypes` callbacks that are type-checked
// but never invoked, so no RPC is ever dispatched from this file.

import {
	type Address,
	createPublicClient,
	createWalletClient,
	type Hex,
	http,
} from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { mainnet } from "viem/chains"
import { describe, expectTypeOf, it } from "vitest"
import type { CallData, MultiCallTx, TokenboundAccountNFT } from "../../types"
import { tokenboundActions } from "../../viem"

const account = privateKeyToAccount(
	"0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
)

const publicClient = createPublicClient({
	chain: mainnet,
	transport: http("http://127.0.0.1:8545"),
})

const walletClient = createWalletClient({
	chain: mainnet,
	transport: http("http://127.0.0.1:8545"),
	account,
})

/** Type-checks its body without ever executing it. */
const assertTypes = (_fn: () => Promise<void>) => {}

const TOKEN = {
	tokenContract: "0x7c74dfe39976dc395529c14e54a597809980e01c",
	tokenId: "1",
} as const

describe("viem extension typing", () => {
	it("infers a deterministic Address for getAccount", () => {
		const client = publicClient.extend(tokenboundActions())
		const result = client.tokenbound.getAccount(TOKEN)
		expectTypeOf(result).toEqualTypeOf<Address>()
	})

	it("infers Hex for wallet write actions", () => {
		assertTypes(async () => {
			const client = walletClient.extend(tokenboundActions())

			const executed = await client.tokenbound.execute({
				account: TOKEN.tokenContract,
				to: TOKEN.tokenContract,
				value: 0n,
				data: "0x",
			})
			expectTypeOf(executed).toEqualTypeOf<Hex>()

			const sentEth = await client.tokenbound.transferETH({
				account: TOKEN.tokenContract,
				recipientAddress: TOKEN.tokenContract,
				amount: 0.1,
			})
			expectTypeOf(sentEth).toEqualTypeOf<Hex>()

			const signed = await client.tokenbound.signMessage({ message: "gm" })
			expectTypeOf(signed).toEqualTypeOf<Hex>()
		})
	})

	it("infers the createAccount result shape", () => {
		assertTypes(async () => {
			const client = walletClient.extend(tokenboundActions())
			const created = await client.tokenbound.createAccount(TOKEN)
			expectTypeOf(created).toEqualTypeOf<{ account: Address; txHash: Hex }>()
		})
	})

	it("infers prepared-transaction and read shapes", () => {
		assertTypes(async () => {
			const client = publicClient.extend(tokenboundActions())

			const prepared = await client.tokenbound.prepareCreateAccount(TOKEN)
			expectTypeOf(prepared).toEqualTypeOf<MultiCallTx | CallData>()

			const execution = await client.tokenbound.prepareExecution({
				account: TOKEN.tokenContract,
				to: TOKEN.tokenContract,
				value: 0n,
				data: "0x",
			})
			expectTypeOf(execution).toEqualTypeOf<CallData>()

			const deployed = await client.tokenbound.checkAccountDeployment({
				accountAddress: TOKEN.tokenContract,
			})
			expectTypeOf(deployed).toEqualTypeOf<boolean>()

			const nft = await client.tokenbound.getNFT({
				accountAddress: TOKEN.tokenContract,
			})
			expectTypeOf(nft).toEqualTypeOf<TokenboundAccountNFT>()
		})
	})

	it("preserves viem's own client type inference", () => {
		const client = walletClient.extend(tokenboundActions())
		expectTypeOf(client.chain).toEqualTypeOf<typeof mainnet>()
		expectTypeOf(client.account).toEqualTypeOf<typeof account>()
	})

	it("narrows a public client to read-only tokenbound actions", () => {
		const client = publicClient.extend(tokenboundActions())
		expectTypeOf(client.tokenbound).toHaveProperty("getAccount")
		expectTypeOf(client.tokenbound).not.toHaveProperty("execute")
	})

	it("exposes write actions for the wagmi `Address | undefined` shape", () => {
		// wagmi's useAccount() returns `Address | undefined`, which is the most
		// common way a wallet client is built in an app. It must still get the
		// full action surface.
		const maybeAddress = undefined as Address | undefined
		const client = createWalletClient({
			chain: mainnet,
			transport: http("http://127.0.0.1:8545"),
			account: maybeAddress,
		}).extend(tokenboundActions())
		expectTypeOf(client.tokenbound).toHaveProperty("execute")
		expectTypeOf(client.tokenbound).toHaveProperty("transferETH")
	})
})
