import {
	bytesToHex,
	concat,
	encodeAbiParameters,
	encodeFunctionData,
	getAddress,
	getContractAddress,
	numberToBytes,
	pad,
} from "viem"
import type { CallData } from "../../types"
import { addressToUint8Array } from "../../utils"
import {
	ERC_6551_DEFAULT,
	STANDARD_EIP_1167_IMPLEMENTATION,
} from "../constants"

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
	if (!ERC_6551_DEFAULT.ACCOUNT_PROXY) {
		throw new Error("ERC_6551_DEFAULT.ACCOUNT_PROXY is undefined")
	}

	const saltValue = salt ?? 0
	const erc6551implementation =
		implementationAddress ?? ERC_6551_DEFAULT.ACCOUNT_PROXY?.ADDRESS
	const erc6551registry = registryAddress ?? ERC_6551_DEFAULT.REGISTRY.ADDRESS

	return {
		to: getAddress(erc6551registry),
		value: BigInt(0),
		data: encodeFunctionData({
			abi: ERC_6551_DEFAULT.REGISTRY.ABI,
			functionName: "createAccount",
			args: [
				getAddress(erc6551implementation),
				bytesToHex(numberToBytes(saltValue, { size: 32 })),
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
export function getTokenboundV3Account(
	tokenContract: string,
	tokenId: string,
	chainId: number,
	implementationAddress?: `0x${string}`,
	registryAddress?: `0x${string}`,
	salt?: number,
): `0x${string}` {
	const saltValue = salt ?? 0

	if (!ERC_6551_DEFAULT.ACCOUNT_PROXY) {
		throw new Error("ERC_6551_DEFAULT.ACCOUNT_PROXY is undefined")
	}

	const erc6551implementation =
		implementationAddress ?? ERC_6551_DEFAULT.ACCOUNT_PROXY.ADDRESS
	const erc6551registry = registryAddress ?? ERC_6551_DEFAULT.REGISTRY.ADDRESS
	const types = [
		{ type: "uint256" }, // salt
		{ type: "uint256" }, // chainId
		{ type: "address" }, // tokenContract
		{ type: "uint256" }, // tokenId
	]

	const values: (string | bigint)[] = [
		saltValue.toString(),
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
	const bigIntSalt = BigInt(saltValue).toString(16) as `0x${string}`
	const saltHex = pad(bigIntSalt, { size: 32 })

	return getContractAddress({
		bytecode: creationCode,
		from: getAddress(erc6551registry),
		opcode: "CREATE2",
		salt: saltHex,
	})
}
