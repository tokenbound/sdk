// Idiomatic viem client decorator.
//
// Usage:
//   const client = createWalletClient({ ... }).extend(tokenboundActions())
//   await client.tokenbound.getAccount({ tokenContract, tokenId })
//
// Everything is namespaced under `.tokenbound` so the decorator can never
// collide with viem's own actions or with other decorators. Write actions are
// only present in the type when the client is a WalletClient, so public-only
// clients get a correctly narrowed surface.

import type {
	Account,
	Address,
	Chain,
	Client,
	Hex,
	SignableMessage,
} from "viem"
import type {
	CallData,
	MultiCallTx,
	SegmentedERC6551Bytecode,
	TokenboundAccountNFT,
} from "../types"
import {
	checkAccountDeployment,
	checkProtocolDeployment,
	createAccount,
	deconstructBytecode,
	type ExecuteActionParams,
	execute,
	type GetAccountActionParams,
	getAccount,
	getNFT,
	isValidSigner,
	type PrepareCreateAccountActionParams,
	type ProtocolDeploymentStatus,
	prepareCreateAccount,
	prepareExecution,
	signMessage,
	type TokenboundConfig,
	type TokenboundWalletClient,
	type TransferERC20ActionParams,
	type TransferETHActionParams,
	type TransferNFTActionParams,
	transferERC20,
	transferETH,
	transferNFT,
} from "./actions"

/** Actions available on any client (public or wallet). */
export type TokenboundPublicActions = {
	/** Derives a tokenbound account address. Deterministic, no network access. */
	getAccount: (params: GetAccountActionParams) => Address
	/** Builds the account-creation transaction without sending it. */
	prepareCreateAccount: (
		params: PrepareCreateAccountActionParams,
	) => Promise<MultiCallTx | CallData>
	/** Encodes an execution against a tokenbound account without sending it. */
	prepareExecution: (params: ExecuteActionParams) => Promise<CallData>
	/** Returns true when the account has been deployed on-chain. */
	checkAccountDeployment: (params: {
		accountAddress: Address
	}) => Promise<boolean>
	/** Reports whether the ERC-6551 contracts are deployed on the connected chain. */
	checkProtocolDeployment: () => Promise<ProtocolDeploymentStatus>
	/** Splits a deployed account's bytecode into its ERC-6551 components. */
	deconstructBytecode: (params: {
		accountAddress: Address
	}) => Promise<SegmentedERC6551Bytecode | null>
	/** Returns the NFT that owns a tokenbound account. */
	getNFT: (params: { accountAddress: Address }) => Promise<TokenboundAccountNFT>
	/** Checks whether an address is a valid signer for a tokenbound account. */
	isValidSigner: (params: {
		account: Address
		signerAddress?: Address
	}) => Promise<boolean>
}

/** Additional actions available only when the client can sign/send. */
export type TokenboundWalletActions = {
	/** Creates a tokenbound account, returning its address and the tx hash. */
	createAccount: (
		params: PrepareCreateAccountActionParams,
	) => Promise<{ account: Address; txHash: Hex }>
	/** Executes a call from a tokenbound account. */
	execute: (params: ExecuteActionParams) => Promise<Hex>
	/** Transfers an ERC721/ERC1155 out of a tokenbound account. */
	transferNFT: (params: TransferNFTActionParams) => Promise<Hex>
	/** Transfers ETH out of a tokenbound account. */
	transferETH: (params: TransferETHActionParams) => Promise<Hex>
	/** Transfers an ERC-20 out of a tokenbound account. */
	transferERC20: (params: TransferERC20ActionParams) => Promise<Hex>
	/** Signs a message with the client's account. */
	signMessage: (params: { message: SignableMessage }) => Promise<Hex>
}

export type TokenboundActions = TokenboundPublicActions &
	TokenboundWalletActions

/**
 * Creates a viem client decorator exposing the Tokenbound API under
 * `client.tokenbound`.
 *
 * Wallet clients (those carrying an `account`) receive the full surface;
 * clients without an account are typed with the read-only subset.
 *
 * @param config Optionally pins the actions to a specific ERC-6551 deployment
 * (custom implementation/registry address, or the legacy V2 version).
 */
export function tokenboundActions(config: TokenboundConfig = {}) {
	// The client parameter is intentionally structural rather than
	// `Client<transport, chain, account>`: a client built with a union transport
	// (e.g. `custom(...) | http()`) fails to infer against the stricter form and
	// collapses the whole intersection to `never`.
	//
	// Write actions are exposed when the client's `account` can be an Account —
	// including the common wagmi shape where the connected address is
	// `Address | undefined`. A PublicClient, whose `account` is exactly
	// `undefined`, is narrowed to the read-only set.
	return <
		client extends { account?: Account | undefined; chain?: Chain | undefined },
	>(
		client: client,
	): {
		tokenbound: [NonNullable<client["account"]>] extends [never]
			? TokenboundPublicActions
			: TokenboundActions
	} => {
		const viemClient = client as unknown as Client
		const walletClient = client as unknown as TokenboundWalletClient

		const actions: TokenboundActions = {
			getAccount: (params) => getAccount(viemClient, params, config),
			prepareCreateAccount: (params) =>
				prepareCreateAccount(viemClient, params, config),
			prepareExecution: (params) =>
				prepareExecution(viemClient, params, config),
			checkAccountDeployment: (params) =>
				checkAccountDeployment(viemClient, params),
			checkProtocolDeployment: () =>
				checkProtocolDeployment(viemClient, config),
			deconstructBytecode: (params) => deconstructBytecode(viemClient, params),
			getNFT: (params) => getNFT(viemClient, params),
			isValidSigner: (params) => isValidSigner(viemClient, params, config),
			createAccount: (params) => createAccount(walletClient, params, config),
			execute: (params) => execute(walletClient, params, config),
			transferNFT: (params) => transferNFT(walletClient, params, config),
			transferETH: (params) => transferETH(walletClient, params, config),
			transferERC20: (params) => transferERC20(walletClient, params, config),
			signMessage: (params) => signMessage(walletClient, params),
		}

		return { tokenbound: actions } as {
			tokenbound: [NonNullable<client["account"]>] extends [never]
				? TokenboundPublicActions
				: TokenboundActions
		}
	}
}
