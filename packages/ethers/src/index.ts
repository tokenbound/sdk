// @tokenbound/ethers — ethers v5/v6 compatibility layer for the Tokenbound SDK.
//
// Depends on @tokenbound/sdk for all ERC-6551 protocol logic. The dependency
// direction is strictly @tokenbound/ethers → @tokenbound/sdk.

export { type EthersAdapter, resolveAdapter } from "./adapter"
export { detectEthersVersion } from "./detect"
export {
	type CreateAccountParams,
	type ERC20TransferParams,
	type ETHTransferParams,
	type ExecuteParams,
	type GetAccountParams,
	type NFTTransferParams,
	TokenboundClient,
	type TokenboundEthersClientOptions,
} from "./TokenboundClient"
export type {
	Ethers5SignableMessage,
	Ethers6SignableMessage,
	EthersProvider,
	EthersSignableMessage,
	EthersSigner,
	EthersVersion,
} from "./types"
export { normalizeV5Message } from "./v5/adapter"
export { normalizeV6Message } from "./v6/adapter"
