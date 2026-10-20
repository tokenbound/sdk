// Pure calldata encoders for the asset-transfer helpers.
// Shared by the viem core and @tokenbound/ethers so transfer semantics
// (including the ERC721 amount guard) exist in exactly one place.

import { type Address, encodeFunctionData, type Hex, parseUnits } from "viem"
import { NFTTokenType } from "../types"
import { erc20Abi, erc721Abi, erc1155Abi } from "./abis"

type TokenType = (typeof NFTTokenType)[keyof typeof NFTTokenType]

/**
 * Encodes an ERC721/ERC1155 `safeTransferFrom` from a tokenbound account.
 * @throws if an ERC721 transfer requests an amount other than 1.
 */
export function encodeNFTTransfer(params: {
	account: Address
	tokenType: TokenType
	tokenContract: Address
	tokenId: string
	recipient: Address
	amount?: number
}): { to: Address; value: bigint; data: Hex } {
	const {
		account,
		tokenType,
		tokenContract,
		tokenId,
		recipient,
		amount = 1,
	} = params

	const is1155 = tokenType === NFTTokenType.ERC1155

	if (!is1155 && amount !== 1) {
		throw new Error("ERC721 transfers can only transfer one token at a time.")
	}

	// ERC1155: safeTransferFrom(address,address,uint256,uint256,bytes)
	// ERC721:  safeTransferFrom(address,address,uint256)
	const sharedArgs = [account, recipient, tokenId]
	const transferArgs: unknown[] = is1155
		? [...sharedArgs, amount, "0x"]
		: sharedArgs

	return {
		to: tokenContract,
		value: BigInt(0),
		data: encodeFunctionData({
			abi: is1155 ? erc1155Abi : erc721Abi,
			functionName: "safeTransferFrom",
			args: transferArgs,
		}),
	}
}

/**
 * Encodes an ETH transfer from a tokenbound account. `amount` is in decimal ETH.
 */
export function encodeETHTransfer(params: {
	recipient: Address
	amount: number
}): { to: Address; value: bigint; data: Hex } {
	return {
		to: params.recipient,
		value: parseUnits(`${params.amount}`, 18),
		data: "0x",
	}
}

/**
 * Encodes an ERC-20 `transfer` from a tokenbound account.
 * @throws if the token decimals are outside the 0-18 range.
 */
export function encodeERC20Transfer(params: {
	recipient: Address
	amount: number
	erc20tokenAddress: Address
	erc20tokenDecimals: number
}): { to: Address; value: bigint; data: Hex } {
	const { recipient, amount, erc20tokenAddress, erc20tokenDecimals } = params

	if (erc20tokenDecimals < 0 || erc20tokenDecimals > 18) {
		throw new Error("Decimal value out of range. Should be between 0 and 18.")
	}

	return {
		to: erc20tokenAddress,
		value: 0n,
		data: encodeFunctionData({
			abi: erc20Abi,
			functionName: "transfer",
			args: [recipient, parseUnits(`${amount}`, erc20tokenDecimals)],
		}),
	}
}
