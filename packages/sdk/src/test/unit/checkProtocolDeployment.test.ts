// Unit coverage for checkProtocolDeployment.
//
// The forked-chain suites assert the positive case against mainnet, where both
// the V2 and V3 deployments exist. What cannot be exercised there is a chain
// that is missing the contracts, or one that has only some of them — so those
// paths are covered here with a stub transport, no network required.
//
// The partial case is not hypothetical: Gnosis (id 100) carries the ERC-6551
// registry but no Tokenbound account implementation, which is exactly why the
// action reports each contract separately rather than a single boolean.

import { type Address, createPublicClient, custom, type Hex } from "viem"
import { mainnet } from "viem/chains"
import { describe, expect, it } from "vitest"
import {
	ERC_6551_DEFAULT,
	ERC_6551_LEGACY_V2,
	TOKENBOUND_V3_DEPLOYER_URL,
} from "../../protocol/constants"
import { TBVersion } from "../../types"
import { checkProtocolDeployment } from "../../viem/actions"

const DEPLOYED_BYTECODE: Hex = "0x60806040523480156100" // non-empty
const EMPTY_BYTECODE: Hex = "0x"

/**
 * A client whose eth_getCode answers from `codeByAddress`, defaulting to empty.
 * Addresses are compared lowercased so the stub is checksum-insensitive.
 */
const stubClient = (codeByAddress: Record<string, Hex>) => {
	const lookup = Object.fromEntries(
		Object.entries(codeByAddress).map(([k, v]) => [k.toLowerCase(), v]),
	)
	return createPublicClient({
		chain: mainnet,
		transport: custom({
			request: async ({ method, params }) => {
				if (method === "eth_getCode") {
					const address = (params as [Address, string])[0]
					return lookup[address.toLowerCase()] ?? EMPTY_BYTECODE
				}
				throw new Error(`Unexpected RPC call: ${method}`)
			},
		}),
	})
}

const V3_REGISTRY = ERC_6551_DEFAULT.REGISTRY.ADDRESS
// resolveDeployment pins V3 to the account proxy, not the upgradeable
// implementation behind it — accounts are deployed against the proxy, so that
// is the address whose presence actually gates the protocol on a chain.
const V3_IMPLEMENTATION = ERC_6551_DEFAULT.ACCOUNT_PROXY?.ADDRESS as Address
const V2_REGISTRY = ERC_6551_LEGACY_V2.REGISTRY.ADDRESS
const V2_IMPLEMENTATION = ERC_6551_LEGACY_V2.IMPLEMENTATION.ADDRESS

describe("checkProtocolDeployment", () => {
	it("reports a fully deployed chain", async () => {
		const client = stubClient({
			[V3_REGISTRY]: DEPLOYED_BYTECODE,
			[V3_IMPLEMENTATION]: DEPLOYED_BYTECODE,
		})

		expect(await checkProtocolDeployment(client)).toEqual({
			registry: true,
			implementation: true,
			isFullyDeployed: true,
			registryAddress: V3_REGISTRY,
			implementationAddress: V3_IMPLEMENTATION,
			// No deployer link when there is nothing to deploy.
		})
	})

	it("reports a chain with no deployment at all", async () => {
		const status = await checkProtocolDeployment(stubClient({}))

		expect(status.registry).toBe(false)
		expect(status.implementation).toBe(false)
		expect(status.isFullyDeployed).toBe(false)
	})

	it("distinguishes a partial deployment (registry only, as on Gnosis)", async () => {
		const status = await checkProtocolDeployment(
			stubClient({ [V3_REGISTRY]: DEPLOYED_BYTECODE }),
		)

		// The whole point of the split return: this is not simply "not deployed".
		expect(status.registry).toBe(true)
		expect(status.implementation).toBe(false)
		expect(status.isFullyDeployed).toBe(false)
	})

	it("points at the deployer only when something is missing", async () => {
		const missing = await checkProtocolDeployment(stubClient({}))
		expect(missing.deployerUrl).toBe(TOKENBOUND_V3_DEPLOYER_URL)

		const partial = await checkProtocolDeployment(
			stubClient({ [V3_REGISTRY]: DEPLOYED_BYTECODE }),
		)
		expect(partial.deployerUrl).toBe(TOKENBOUND_V3_DEPLOYER_URL)

		const complete = await checkProtocolDeployment(
			stubClient({
				[V3_REGISTRY]: DEPLOYED_BYTECODE,
				[V3_IMPLEMENTATION]: DEPLOYED_BYTECODE,
			}),
		)
		expect(complete.deployerUrl).toBeUndefined()
	})

	it("treats empty bytecode as not deployed", async () => {
		const status = await checkProtocolDeployment(
			stubClient({
				[V3_REGISTRY]: EMPTY_BYTECODE,
				[V3_IMPLEMENTATION]: EMPTY_BYTECODE,
			}),
		)

		expect(status.isFullyDeployed).toBe(false)
	})

	it("probes the V2 addresses when pinned to the legacy version", async () => {
		const client = stubClient({
			[V2_REGISTRY]: DEPLOYED_BYTECODE,
			[V2_IMPLEMENTATION]: DEPLOYED_BYTECODE,
			// The V3 contracts are absent, so a V2 client must not consult them.
		})

		const status = await checkProtocolDeployment(client, {
			version: TBVersion.V2,
		})

		expect(status.registryAddress).toBe(V2_REGISTRY)
		expect(status.implementationAddress).toBe(V2_IMPLEMENTATION)
		expect(status.isFullyDeployed).toBe(true)
	})

	it("probes custom addresses when the deployment is overridden", async () => {
		const customRegistry = "0x1111111111111111111111111111111111111111" as const
		const customImplementation =
			"0x2222222222222222222222222222222222222222" as const

		const status = await checkProtocolDeployment(
			stubClient({
				[customRegistry]: DEPLOYED_BYTECODE,
				[customImplementation]: DEPLOYED_BYTECODE,
			}),
			{
				registryAddress: customRegistry,
				implementationAddress: customImplementation,
			},
		)

		expect(status.registryAddress).toBe(customRegistry)
		expect(status.implementationAddress).toBe(customImplementation)
		expect(status.isFullyDeployed).toBe(true)
	})
})
