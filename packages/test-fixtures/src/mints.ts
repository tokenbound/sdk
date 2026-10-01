// The contracts both suites transact against, each paired with the ABI used to
// call it.
//
// The ABIs come from ./generated.ts, which @wagmi/cli pulls from Etherscan at
// the verified deployment addresses (see packages/sdk/wagmi.config.ts) — they
// are never hand-written. Pairing each address with its ABI here means neither
// suite can call one contract while encoding against another's interface.

import {
	ERC1167_FOOTER,
	ERC1167_HEADER,
	RECIPIENT_ADDRESS,
	WETH_CONTRACT_ADDRESS,
	ZORA_721,
	ZORA_1155,
} from "./fixtures"
import { wethABI, zora721DropABI, zora1155ABI } from "./generated"

/** Zora "Webb's First Deep Field": https://zora.co/collect/eth:0x28ee638f2fcb66b4106acab7efd225aeb2bd7e8d */
export const zora721 = {
	abi: zora721DropABI,
	proxyContractAddress: ZORA_721.address,
	mintPrice: ZORA_721.mintPrice,
	quantity: ZORA_721.quantity,
}

/** https://zora.co/collect/eth:0x373075bab7d668ed2473d8233ebdebcf49eb758e/1 */
export const zora1155 = {
	abi: zora1155ABI,
	fixedPriceSalesStrategy: ZORA_1155.minter,
	proxyContractAddress: ZORA_1155.address,
	tokenId: ZORA_1155.tokenId,
	mintFee: ZORA_1155.mintFee,
	quantity: ZORA_1155.quantity,
}

/** WETH, used by the ERC-20 transfer tests. */
export const weth = {
	abi: wethABI,
	contractAddress: WETH_CONTRACT_ADDRESS,
}

/** Values the bytecode-deconstruction assertions compare against. */
export const TEST_CONFIG = {
	RECIPIENT_ADDRESS,
	ERC1167_HEADER,
	ERC1167_FOOTER,
}
