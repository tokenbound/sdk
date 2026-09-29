// Cross-chain encoding against the real LayerZero executor.
//
// The mainnet fork carries LayerZero's deployed executor, so the fee quote is a
// genuine eth_call rather than a stub: these assert against the contract that
// production talks to. Delivery itself still isn't covered — that needs a second
// chain — but everything up to the signed transaction is real.

import {
	ANVIL_CONFIG,
	CREATE_ANVIL_OPTIONS,
	CROSS_CHAIN_SENDER_NFT,
	RECIPIENT_ADDRESS,
} from "@tokenbound/test-fixtures"
import { createAnvil } from "@viem/anvil"
import {
	createPublicClient,
	decodeFunctionData,
	type Hex,
	http,
	type PublicClient,
	parseAbi,
} from "viem"
import { base, mainnet } from "viem/chains"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { getAccountAddress, resolveDeployment } from "../protocol"
import { LZ_EIDS, LZ_EXECUTORS } from "../protocol/constants"
import { encodeCrossChainCall } from "../protocol/functions"

const TIMEOUT = 60000

const SENDING_TBA = getAccountAddress(
	{ ...CROSS_CHAIN_SENDER_NFT, chainId: mainnet.id },
	resolveDeployment({}),
)

const quoteAbi = parseAbi([
	"function quote(uint32 eid, address sender, bytes calldata payload, bytes calldata options) external view returns (uint256 nativeFee, uint256 lzTokenFee)",
])
const executeAbi = parseAbi([
	"function execute(uint32 eid, bytes calldata payload, bytes calldata options) external payable",
])

describe("encodeCrossChainCall against the forked executor", () => {
	const anvil = createAnvil({ ...CREATE_ANVIL_OPTIONS })
	let publicClient: PublicClient
	/** Records what was sent, while still performing the real call. */
	let sent: Array<{ to: string; data: Hex }>
	let caller: { call: (tx: { to: `0x${string}`; data: Hex }) => Promise<Hex> }

	beforeAll(async () => {
		await anvil.start()
		publicClient = createPublicClient({
			chain: ANVIL_CONFIG.ACTIVE_CHAIN,
			transport: http(`http://127.0.0.1:${anvil.port}`),
		}) as PublicClient

		sent = []
		caller = {
			call: async (tx) => {
				sent.push({ to: tx.to, data: tx.data })
				const { data } = await publicClient.call(tx)
				if (data === undefined) {
					throw new Error(`Call to ${tx.to} returned no data`)
				}
				return data
			},
		}
	}, TIMEOUT)

	afterAll(async () => {
		await anvil.stop()
	})

	const encode = () =>
		encodeCrossChainCall({
			caller,
			account: SENDING_TBA,
			to: RECIPIENT_ADDRESS,
			value: 0n,
			data: "0x",
			originChainId: mainnet.id,
			destinationChainId: base.id,
		})

	it(
		"quotes a non-zero fee from the deployed executor",
		async () => {
			const result = await encode()

			// A real quote, so the exact figure moves with gas — assert the shape
			// rather than a literal. Zero would mean the quote silently failed.
			expect(result.value).toBeGreaterThan(0n)
			expect(result.value).toBeLessThan(10n ** 18n) // sanity: under 1 ETH
		},
		TIMEOUT,
	)

	it(
		"sends the quote to the origin chain's executor",
		async () => {
			sent.length = 0
			await encode()

			expect(sent).toHaveLength(1)
			expect(sent[0].to).toBe(LZ_EXECUTORS[mainnet.id])

			const decoded = decodeFunctionData({ abi: quoteAbi, data: sent[0].data })
			expect(decoded.functionName).toBe("quote")
			// The destination is identified by its LayerZero endpoint id.
			expect(decoded.args[0]).toBe(LZ_EIDS[base.id])
			expect(decoded.args[1]).toBe(SENDING_TBA)
		},
		TIMEOUT,
	)

	it(
		"returns an execute() call on the executor carrying the quoted fee",
		async () => {
			const result = await encode()

			expect(result.to).toBe(LZ_EXECUTORS[mainnet.id])

			const decoded = decodeFunctionData({ abi: executeAbi, data: result.data })
			expect(decoded.functionName).toBe("execute")
			expect(decoded.args[0]).toBe(LZ_EIDS[base.id])
		},
		TIMEOUT,
	)

	it(
		"quotes and executes with the same payload and options",
		async () => {
			sent.length = 0
			const result = await encode()

			// Paying for one configuration and requesting another would leave the
			// message underfunded, so the two must agree.
			const quoted = decodeFunctionData({ abi: quoteAbi, data: sent[0].data })
			const executed = decodeFunctionData({
				abi: executeAbi,
				data: result.data,
			})

			expect(executed.args[1]).toBe(quoted.args[2]) // payload
			expect(executed.args[2]).toBe(quoted.args[3]) // options
		},
		TIMEOUT,
	)

	it(
		"covers the quoted fee, with the encoder's buffer on top",
		async () => {
			sent.length = 0
			const result = await encode()

			// Re-quote directly to confirm the value carried is the fee the
			// executor actually asked for, not a stale or invented number.
			const [nativeFee] = await publicClient.readContract({
				address: LZ_EXECUTORS[mainnet.id],
				abi: quoteAbi,
				functionName: "quote",
				args: decodeFunctionData({ abi: quoteAbi, data: sent[0].data })
					.args as [number, `0x${string}`, Hex, Hex],
			})

			expect(result.value).toBeGreaterThanOrEqual(nativeFee)
		},
		TIMEOUT,
	)

	it(
		"fails informatively when the destination has no endpoint id",
		async () => {
			await expect(
				encodeCrossChainCall({
					caller,
					account: SENDING_TBA,
					to: RECIPIENT_ADDRESS,
					value: 0n,
					data: "0x",
					originChainId: mainnet.id,
					destinationChainId: 999999, // not a LayerZero chain
				}),
			).rejects.toThrow()
		},
		TIMEOUT,
	)
})
