// Library-independent ERC-6551 protocol core.
//
// Every function here is pure: it takes standard Ethereum primitives and
// returns encoded calldata or a deterministic address. Nothing in this file
// touches a viem client, an ethers Signer, or any network transport, so it is
// shared verbatim by the viem core and by @tokenbound/ethers.

import {
	type Abi,
	type Address,
	encodeFunctionData,
	getAddress,
	type Hex,
	hexToNumber,
	isAddressEqual,
} from "viem"
import type {
	Call3,
	CallData,
	MultiCallTx,
	SegmentedERC6551Bytecode,
	TBImplementationVersion,
} from "../types"
import { TBVersion } from "../types"
import { CALL_OPERATIONS, type CallOperation } from "../types/operations"
import { segmentBytecode } from "../utils/segmentBytecode"
import { multicall3AuthenticatedABI } from "./abis"
import {
	ERC_6551_DEFAULT,
	ERC_6551_LEGACY_V2,
	MULTICALL_AUTHENTICATED_ADDRESS,
	TOKENBOUND_V3_DEPLOYER_URL,
} from "./constants"
import {
	computeAccount,
	getCreationCode,
	prepareCreateAccount as prepareCreateAccountV2,
	prepareExecuteCall as prepareExecuteCallV2,
} from "./functions/v2"
import {
	getTokenboundV3Account,
	prepareCreateTokenboundV3Account,
} from "./functions/v3"

/**
 * The resolved ERC-6551 deployment a client is pointed at. Produced once by
 * `resolveDeployment` and then threaded through the pure protocol functions,
 * so version branching happens in exactly one place.
 */
export type ResolvedDeployment = {
	supportsV3: boolean
	implementationAddress: Address
	registryAddress: Address
}

/**
 * Resolves which ERC-6551 deployment (V2 legacy or V3 default) is in use,
 * applying the same precedence rules the SDK has always used:
 * an explicit `version`, then a recognised legacy implementation address,
 * otherwise the current V3 default.
 */
export function resolveDeployment(options: {
	implementationAddress?: Address
	registryAddress?: Address
	version?: TBImplementationVersion
}): ResolvedDeployment {
	const { implementationAddress, registryAddress, version } = options

	if (!ERC_6551_DEFAULT.ACCOUNT_PROXY) {
		throw new Error("ERC_6551_DEFAULT.ACCOUNT_PROXY is undefined")
	}

	const isV2 =
		version === TBVersion.V2 ||
		(!!implementationAddress &&
			isAddressEqual(
				implementationAddress,
				ERC_6551_LEGACY_V2.IMPLEMENTATION.ADDRESS,
			))

	if (isV2) {
		return {
			supportsV3: false,
			implementationAddress:
				implementationAddress ?? ERC_6551_LEGACY_V2.IMPLEMENTATION.ADDRESS,
			registryAddress: registryAddress ?? ERC_6551_LEGACY_V2.REGISTRY.ADDRESS,
		}
	}

	return {
		supportsV3: true,
		implementationAddress:
			implementationAddress ?? ERC_6551_DEFAULT.ACCOUNT_PROXY.ADDRESS,
		registryAddress: registryAddress ?? ERC_6551_DEFAULT.REGISTRY.ADDRESS,
	}
}

/**
 * True when an `eth_getCode` result represents a contract rather than an empty
 * account. Shared so the viem core and @tokenbound/ethers agree on what counts
 * as deployed, even though each fetches the bytecode through its own transport.
 */
export function hasBytecode(bytecode: Hex | undefined | null): boolean {
	return bytecode ? bytecode.length > 2 : false
}

/**
 * The result of probing a chain for the ERC-6551 contracts a client targets.
 * Reports each contract separately so a partial deployment is distinguishable
 * from no deployment at all.
 */
export type ProtocolDeploymentStatus = {
	/** True when the ERC-6551 registry is live at `registryAddress`. */
	registry: boolean
	/** True when the account implementation is live at `implementationAddress`. */
	implementation: boolean
	/** True only when both contracts are present. */
	isFullyDeployed: boolean
	registryAddress: Address
	implementationAddress: Address
	/**
	 * Where the missing contracts can be deployed. Present only when
	 * `isFullyDeployed` is false, so a caller can surface the fix alongside the
	 * problem; `undefined` on a fully deployed chain.
	 */
	deployerUrl?: string
}

/**
 * Assembles the deployment status from two already-fetched bytecode results.
 * Pure: the caller does the fetching, so the viem core and @tokenbound/ethers
 * share this logic without sharing a transport.
 */
export function toProtocolDeploymentStatus(params: {
	registryCode: Hex | undefined | null
	implementationCode: Hex | undefined | null
	registryAddress: Address
	implementationAddress: Address
}): ProtocolDeploymentStatus {
	const registry = hasBytecode(params.registryCode)
	const implementation = hasBytecode(params.implementationCode)
	const isFullyDeployed = registry && implementation

	return {
		registry,
		implementation,
		isFullyDeployed,
		registryAddress: params.registryAddress,
		implementationAddress: params.implementationAddress,
		...(isFullyDeployed ? {} : { deployerUrl: TOKENBOUND_V3_DEPLOYER_URL }),
	}
}

/**
 * Deterministically derives a tokenbound account address. No network access.
 */
export function getAccountAddress(
	params: {
		tokenContract: Address
		tokenId: string
		chainId: number
		salt?: number
	},
	deployment: ResolvedDeployment,
): Address {
	const { tokenContract, tokenId, chainId, salt = 0 } = params
	const derive = deployment.supportsV3 ? getTokenboundV3Account : computeAccount

	return derive(
		tokenContract,
		tokenId,
		chainId,
		deployment.implementationAddress,
		deployment.registryAddress,
		salt,
	)
}

/**
 * Returns true when the implementation address is not one of the canonical
 * Tokenbound deployments, in which case the SDK must not auto-initialize.
 */
export function isCustomImplementation(
	deployment: ResolvedDeployment,
): boolean {
	if (!ERC_6551_DEFAULT.ACCOUNT_PROXY) return true
	return ![
		ERC_6551_DEFAULT.ACCOUNT_PROXY.ADDRESS,
		ERC_6551_DEFAULT.IMPLEMENTATION.ADDRESS,
	].includes(getAddress(deployment.implementationAddress))
}

/**
 * Builds the transaction that creates (and, for standard deployments,
 * initializes) a tokenbound account. Pure calldata construction.
 */
export async function prepareCreateAccountTx(
	params: {
		tokenContract: Address
		tokenId: string
		chainId: number
		salt?: number
		appendedCalls?: Call3[]
	},
	deployment: ResolvedDeployment,
): Promise<MultiCallTx | CallData> {
	if (!ERC_6551_DEFAULT.ACCOUNT_PROXY) {
		throw new Error("ERC_6551_DEFAULT.ACCOUNT_PROXY is undefined")
	}

	const {
		tokenContract,
		tokenId,
		chainId,
		salt = 0,
		appendedCalls = [],
	} = params

	const computedAcct = getAccountAddress(
		{ tokenContract, tokenId, chainId, salt },
		deployment,
	)

	const custom = isCustomImplementation(deployment)

	const prepareBasicCreateAccount = deployment.supportsV3
		? prepareCreateTokenboundV3Account
		: prepareCreateAccountV2

	const preparedBasicCreateAccount = await prepareBasicCreateAccount(
		tokenContract,
		tokenId,
		chainId,
		deployment.implementationAddress,
		deployment.registryAddress,
		salt,
	)

	if (appendedCalls.length > 0 && (!deployment.supportsV3 || custom)) {
		throw new Error(
			"Multicall via appendedCalls is not supported using the legacy V2 implementation or custom implementations",
		)
	}

	if (custom) {
		// Don't initialize for custom implementations. Allow third-party handling of initialization.
		return preparedBasicCreateAccount
	}

	// For standard implementations, use the multicall3 aggregate function to
	// create and initialize the account in one transaction.
	return {
		to: MULTICALL_AUTHENTICATED_ADDRESS,
		value: BigInt(0),
		data: encodeFunctionData({
			abi: multicall3AuthenticatedABI,
			functionName: "aggregate3",
			args: [
				[
					{
						target: deployment.registryAddress,
						allowFailure: false,
						callData: preparedBasicCreateAccount.data,
					},
					{
						target: computedAcct,
						allowFailure: false,
						callData: encodeFunctionData({
							abi: ERC_6551_DEFAULT.ACCOUNT_PROXY.ABI,
							functionName: "initialize",
							args: [ERC_6551_DEFAULT.IMPLEMENTATION.ADDRESS],
						}),
					},
					// Append Multicall3 calls, so the newly-created Tokenbound account
					// can be used to execute calls immediately after creation
					...appendedCalls,
				],
			],
		}),
	} as MultiCallTx
}

/**
 * Encodes a same-chain execution call against a tokenbound account.
 * Cross-chain encoding needs a public client for fee quoting and therefore
 * lives in the viem layer.
 */
export function encodeExecution(params: {
	account: Address
	to: Address
	value: bigint
	data: Hex
	operation?: CallOperation
}): CallData {
	const { account, to, value, data, operation = CALL_OPERATIONS.CALL } = params

	return {
		to: account,
		value: 0n,
		data: encodeFunctionData({
			abi: ERC_6551_DEFAULT.IMPLEMENTATION.ABI,
			functionName: "execute",
			args: [to, value, data, operation],
		}),
	}
}

/**
 * Encodes a legacy V2 `executeCall` against a tokenbound account.
 */
export async function encodeExecuteCall(params: {
	account: Address
	to: Address
	value: bigint
	data: string
}): Promise<CallData> {
	const { account, to, value, data } = params
	return prepareExecuteCallV2(account, to, value, data)
}

/**
 * Splits deployed ERC-6551 account bytecode into its constituent parts.
 * Takes raw bytecode so it needs no client.
 */
export function deconstructBytecode(
	rawBytecode: Hex | undefined,
): SegmentedERC6551Bytecode | null {
	const bytecode = rawBytecode?.slice(2)

	if (!bytecode || !rawBytecode || !(rawBytecode.length > 2)) return null

	const [
		erc1167Header,
		rawImplementationAddress,
		erc1167Footer,
		rawSalt,
		rawChainId,
		rawTokenContract,
		rawTokenId,
	] = segmentBytecode(bytecode, 10, 20, 15, 32, 32, 32, 32)

	const chainId = hexToNumber(`0x${rawChainId}`, { size: 32 })
	const implementationAddress: Address = getAddress(
		`0x${rawImplementationAddress}`,
	)
	const salt = hexToNumber(`0x${rawSalt}`, { size: 32 })
	const tokenContract: Address = getAddress(
		`0x${rawTokenContract.slice(
			rawTokenContract.length - 40,
			rawTokenContract.length,
		)}`,
	)
	const tokenId = hexToNumber(`0x${rawTokenId}`, { size: 32 }).toString()

	return {
		erc1167Header,
		implementationAddress,
		erc1167Footer,
		salt,
		tokenId,
		tokenContract,
		chainId,
	}
}

/** `isValidSigner` MUST return this bytes4 magic value if the signer is valid. */
export const VALID_SIGNER_MAGIC_VALUE = "0x523e3260"

export type { Abi }
export { computeAccount, getCreationCode, getTokenboundV3Account }
