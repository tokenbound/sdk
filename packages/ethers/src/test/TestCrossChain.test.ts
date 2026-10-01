// Cross-chain execution through @tokenbound/ethers, against the real executor.
//
// The mainnet fork carries LayerZero's deployed executor, so the fee quote here
// is a genuine eth_call made through the ethers adapter — the same path
// production takes. The calldata is then compared against the viem core's, which
// is what "supported on both" has to mean.

import {
	encodeCrossChainCall,
	encodeExecution,
	getAccountAddress,
	resolveDeployment,
} from "@tokenbound/sdk"
import {
	ANVIL_ACCOUNTS,
	CREATE_ANVIL_OPTIONS,
	CROSS_CHAIN_SENDER_NFT,
	RECIPIENT_ADDRESS,
} from "@tokenbound/test-fixtures"
import { createAnvil } from "@viem/anvil"
import { ethers } from "ethers"
import { JsonRpcProvider, JsonRpcSigner } from "ethers6"
import {
	createPublicClient,
	getAddress,
	type Hex,
	http,
	type PublicClient,
} from "viem"
import { base, mainnet } from "viem/chains"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { TokenboundClient } from "../index"

const TIMEOUT = 60000

const SENDING_TBA = getAccountAddress(
	{ ...CROSS_CHAIN_SENDER_NFT, chainId: mainnet.id },
	resolveDeployment({}),
)

describe.each([{ version: 5 as const }, { version: 6 as const }])(
	"ethers v$version — cross-chain execution",
	({ version }) => {
		const anvil = createAnvil({ ...CREATE_ANVIL_OPTIONS })
		const rpcUrl = `http://127.0.0.1:${anvil.port}`

		let tokenboundClient: TokenboundClient
		let publicClient: PublicClient

		beforeAll(async () => {
			await anvil.start()

			publicClient = createPublicClient({
				chain: mainnet,
				transport: http(rpcUrl),
			}) as PublicClient

			const signer =
				version === 5
					? new ethers.Wallet(
							ANVIL_ACCOUNTS[0].privateKey,
							new ethers.providers.JsonRpcProvider(rpcUrl),
						)
					: new JsonRpcSigner(
							new JsonRpcProvider(rpcUrl),
							getAddress(ANVIL_ACCOUNTS[0].address),
						)

			tokenboundClient = new TokenboundClient({ signer, chain: mainnet })
		}, TIMEOUT)

		afterAll(async () => {
			await anvil.stop()
		})

		const prepareCrossChain = () =>
			tokenboundClient.prepareExecution({
				account: SENDING_TBA,
				to: RECIPIENT_ADDRESS,
				value: 0n,
				data: "0x",
				chainId: base.id,
			})

		it(
			"quotes the fee through the ethers adapter",
			async () => {
				const prepared = await prepareCrossChain()

				// The fee is fetched via adapter.call against the forked executor, so
				// a zero value would mean the quote never happened.
				expect(prepared.value).toBeGreaterThan(0n)
				expect(prepared.value).toBeLessThan(10n ** 18n)
			},
			TIMEOUT,
		)

		it(
			"targets the account, not the LayerZero executor",
			async () => {
				const prepared = await prepareCrossChain()

				// The account executes the LayerZero call, so the outer transaction
				// goes to the account. Sending straight to the executor would bypass
				// the tokenbound account entirely.
				expect(prepared.to).toBe(SENDING_TBA)
				// execute(address,uint256,bytes,uint8)
				expect(prepared.data.slice(0, 10)).toBe("0x51945447")
			},
			TIMEOUT,
		)

		it(
			"encodes identically to the viem core",
			async () => {
				const prepared = await prepareCrossChain()

				// What @tokenbound/sdk produces for the same inputs, quoted through a
				// viem client instead of the adapter.
				const crossChain = await encodeCrossChainCall({
					caller: {
						call: async (tx) => {
							const { data } = await publicClient.call(tx)
							if (data === undefined) {
								throw new Error("no data")
							}
							return data
						},
					},
					account: SENDING_TBA,
					to: RECIPIENT_ADDRESS,
					value: 0n,
					data: "0x",
					originChainId: mainnet.id,
					destinationChainId: base.id,
				})
				// The fee rides on the outer transaction, which encodeExecution zeroes.
				const expected = {
					...encodeExecution({
						account: SENDING_TBA,
						to: crossChain.to,
						value: crossChain.value,
						data: crossChain.data as Hex,
					}),
					value: crossChain.value,
				}

				expect(prepared.to).toBe(expected.to)
				expect(prepared.data).toBe(expected.data)
				// The quotes are independent calls, so the fees can differ by the
				// executor's per-block pricing — compare within a tolerance.
				const delta =
					prepared.value > expected.value
						? prepared.value - expected.value
						: expected.value - prepared.value
				expect(delta).toBeLessThan(expected.value / 100n + 100n)
			},
			TIMEOUT,
		)

		it(
			"leaves same-chain execution unchanged",
			async () => {
				const sameChain = await tokenboundClient.prepareExecution({
					account: SENDING_TBA,
					to: RECIPIENT_ADDRESS,
					value: 0n,
					data: "0x",
				})

				expect(sameChain.to).toBe(SENDING_TBA)
				// No LayerZero fee on a same-chain call.
				expect(sameChain.value).toBe(0n)
			},
			TIMEOUT,
		)
	},
)
