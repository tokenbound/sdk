import {
	getContract,
	getContractAddress,
	concat,
	WalletClient,
	encodeFunctionData,
	encodeAbiParameters,
	pad,
	parseAbiParameters,
	numberToHex,
	getAddress,
	numberToBytes,
	bytesToHex,
} from "viem"

import {
	erc6551AccountProxyV3ABI,
	erc6551AccountV3ABI,
	erc6551RegistryV3ABI,
} from "../../src/test/wagmi-cli-hooks/generated"
import { addressToUint8Array } from "../utils"

import {
	ERC_6551_DEFAULT,
	STANDARD_EIP_1167_IMPLEMENTATION,
} from "../constants"
import { CallData } from "../types"
export { erc6551AccountProxyV3ABI, erc6551AccountV3ABI, erc6551RegistryV3ABI }

/**
 * @deprecated Direct consumption of this function is deprecated. Consume via TokenboundClient instead.
 * @internal
 */
export async function prepareCreateTokenboundV3Account(
	tokenContract: string,
	tokenId: string,
	chainId: number,
	implementationAddress?: `0x${string}`,
	registryAddress?: `0x${string}`,
	salt?: number,
): Promise<CallData> {
	salt = salt ?? 0
	const erc6551implementation =
		implementationAddress ?? ERC_6551_DEFAULT.ACCOUNT_PROXY!.ADDRESS
	const erc6551registry = registryAddress ?? ERC_6551_DEFAULT.REGISTRY.ADDRESS

	return {
		to: getAddress(erc6551registry),
		value: BigInt(0),
		data: encodeFunctionData({
			abi: ERC_6551_DEFAULT.REGISTRY.ABI,
			functionName: "createAccount",
			args: [
				getAddress(erc6551implementation),
				bytesToHex(numberToBytes(salt, { size: 32 })),
				chainId,
				tokenContract,
				tokenId,
			],
		}),
	}
}

/**
 * @deprecated Direct consumption of this function is deprecated. Consume via TokenboundClient instead.
 * @internal
 */
export async function createTokenboundV3Account(
	tokenContract: string,
	tokenId: string,
	client: WalletClient,
	implementationAddress?: `0x${string}`,
	registryAddress?: `0x${string}`,
	salt?: number,
): Promise<`0x${string}`> {
	salt = salt ?? 0
	const erc6551implementation =
		implementationAddress ?? ERC_6551_DEFAULT.ACCOUNT_PROXY!.ADDRESS
	const erc6551registry = registryAddress ?? ERC_6551_DEFAULT.REGISTRY.ADDRESS

	const registry = getContract({
		address: erc6551registry,
		abi: ERC_6551_DEFAULT.REGISTRY.ABI,
		client: {
			wallet: client,
		},
	})

	const chainId = await client.getChainId()

	return await registry.write.createAccount([
		erc6551implementation,
		encodeAbiParameters(parseAbiParameters(["bytes32"]), [
			numberToHex(salt, { size: 32 }),
		]),
		chainId,
		tokenContract,
		tokenId,
	])
}

/**
 * @deprecated Direct consumption of this function is deprecated. Consume via TokenboundClient instead.
 * @internal
 */
export async function prepareTokenboundV3Execute(
	account: string,
	to: string,
	value: bigint,
	data: string,
): Promise<CallData> {
	return {
		to: account as `0x${string}`,
		value: 0n,
		data: encodeFunctionData({
			abi: ERC_6551_DEFAULT.IMPLEMENTATION.ABI,
			functionName: "execute",
			args: [to as `0x${string}`, value, data as `0x${string}`],
		}),
	}
}

/**
 * @deprecated Direct consumption of this function is deprecated. Consume via TokenboundClient instead.
 * @internal
 */
export async function tokenboundV3Execute(
	account: string,
	to: string,
	value: bigint,
	data: string,
	client: WalletClient,
) {
	const registry = getContract({
		address: account as `0x${string}`,
		abi: ERC_6551_DEFAULT.IMPLEMENTATION.ABI,
		client: {
			wallet: client,
		},
	})

	return await registry.write.execute([
		to as `0x${string}`,
		value,
		data as `0x${string}`,
	])
}

/**
 * @deprecated Direct consumption of this function is deprecated. Consume via TokenboundClient instead.
 * @internal
 */
export function getTokenboundV3Account(
	tokenContract: string,
	tokenId: string,
	chainId: number,
	implementationAddress?: `0x${string}`,
	registryAddress?: `0x${string}`,
	salt?: number,
): `0x${string}` {
	salt = salt ?? 0
	const erc6551implementation =
		implementationAddress ?? ERC_6551_DEFAULT.ACCOUNT_PROXY!.ADDRESS
	const erc6551registry = registryAddress ?? ERC_6551_DEFAULT.REGISTRY.ADDRESS
	const types = [
		{ type: "uint256" }, // salt
		{ type: "uint256" }, // chainId
		{ type: "address" }, // tokenContract
		{ type: "uint256" }, // tokenId
	]

	const values: (string | bigint)[] = [
		salt.toString(),
		BigInt(chainId),
		tokenContract,
		tokenId,
	]
	const encodedABI = encodeAbiParameters(types, values)

	const hexCreationCode = concat([
		"0x3d60ad80600a3d3981f3363d3d373d3d3d363d73",
		getAddress(erc6551implementation),
		STANDARD_EIP_1167_IMPLEMENTATION,
		encodedABI,
	])

	const creationCode = addressToUint8Array(hexCreationCode)
	const bigIntSalt = BigInt(salt).toString(16) as `0x${string}`
	const saltHex = pad(bigIntSalt, { size: 32 })

	return getContractAddress({
		bytecode: creationCode,
		from: getAddress(erc6551registry),
		opcode: "CREATE2",
		salt: saltHex,
	})
}
