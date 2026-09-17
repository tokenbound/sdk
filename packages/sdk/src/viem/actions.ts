// Standalone viem actions.
//
// Each action takes an explicit viem client plus parameters, and delegates all
// encoding/derivation to the library-independent protocol layer. The
// `tokenboundActions()` decorator in ./tokenboundActions.ts binds these to a
// client, so there is exactly one implementation of each operation.

import type {
	Account,
	Address,
	Chain,
	Client,
	Hex,
	PublicClient,
	SignableMessage,
	Transport,
	WalletClient,
} from "viem"

/**
 * The minimum client shape a write action needs: a viem Client that carries an
 * Account. Accepting this rather than the full `WalletClient` lets the same
 * functions serve both `createWalletClient(...)` results and decorated clients.
 */
export type TokenboundWalletClient<
	chain extends Chain | undefined = Chain | undefined,
	account extends Account | undefined = Account | undefined,
> = Client<Transport, chain, account>

import {
	getCode,
	readContract,
	sendTransaction,
	signMessage as viemSignMessage,
} from "viem/actions"

import {
	deconstructBytecode as deconstructBytecodeFromHex,
	encodeERC20Transfer,
	encodeETHTransfer,
	encodeNFTTransfer,
	getAccountAddress,
	hasBytecode,
	type ProtocolDeploymentStatus,
	prepareCreateAccountTx,
	type ResolvedDeployment,
	resolveDeployment,
	toProtocolDeploymentStatus,
	VALID_SIGNER_MAGIC_VALUE,
} from "../protocol"
import { ERC_6551_DEFAULT } from "../protocol/constants"
import { encodeCrossChainCall } from "../protocol/functions"
import type {
	Call3,
	CallData,
	MultiCallTx,
	NFTTokenType,
	SegmentedERC6551Bytecode,
	TBImplementationVersion,
	TokenboundAccountNFT,
} from "../types"
import type { PossibleENSAddress } from "../types/addresses"
import { CALL_OPERATIONS } from "../types/operations"
import type { Prettify } from "../types/prettify"
import { resolvePossibleENS } from "../utils"

/** Options that pin the actions to a specific ERC-6551 deployment. */
export type TokenboundConfig = {
	implementationAddress?: Address
	registryAddress?: Address
	version?: TBImplementationVersion
}

type TokenType = (typeof NFTTokenType)[keyof typeof NFTTokenType]

export type GetAccountActionParams = {
	tokenContract: Address
	tokenId: string
	chainId?: number
	salt?: number
}

export type PrepareCreateAccountActionParams = Prettify<
	GetAccountActionParams & {
		appendedCalls?: Call3[]
	}
>

export type ExecuteActionParams = {
	account: Address
	to: Address
	value: bigint
	data: Hex
	chainId?: number
}

export type TransferNFTActionParams = {
	account: Address
	tokenType: TokenType
	tokenContract: Address
	tokenId: string
	recipientAddress: PossibleENSAddress
	amount?: number
	chainId?: number
}

export type TransferETHActionParams = {
	account: Address
	recipientAddress: PossibleENSAddress
	amount: number
	chainId?: number
}

export type TransferERC20ActionParams = {
	account: Address
	recipientAddress: PossibleENSAddress
	amount: number
	erc20tokenAddress: Address
	erc20tokenDecimals: number
	chainId?: number
}

/** Resolves the chain id a client is pointed at. */
function clientChainId(client: Client): number {
	const chainId = client.chain?.id
	if (chainId === undefined) {
		throw new Error(
			"Unable to determine chainId. Provide a chain on the viem client.",
		)
	}
	return chainId
}

/**
 * Derives a tokenbound account address. Purely deterministic — no network access.
 */
export function getAccount(
	client: Client,
	params: GetAccountActionParams,
	config: TokenboundConfig = {},
): Address {
	const deployment = resolveDeployment(config)
	return getAccountAddress(
		{
			tokenContract: params.tokenContract,
			tokenId: params.tokenId,
			chainId: params.chainId ?? clientChainId(client),
			salt: params.salt,
		},
		deployment,
	)
}

/**
 * Builds the transaction that creates a tokenbound account, without sending it.
 */
export async function prepareCreateAccount(
	client: Client,
	params: PrepareCreateAccountActionParams,
	config: TokenboundConfig = {},
): Promise<MultiCallTx | CallData> {
	const deployment = resolveDeployment(config)
	return await prepareCreateAccountTx(
		{
			tokenContract: params.tokenContract,
			tokenId: params.tokenId,
			chainId: params.chainId ?? clientChainId(client),
			salt: params.salt,
			appendedCalls: params.appendedCalls,
		},
		deployment,
	)
}

/**
 * Creates a tokenbound account and returns both the derived address and the
 * transaction hash.
 */
export async function createAccount<
	chain extends Chain | undefined,
	account extends Account | undefined,
>(
	client: TokenboundWalletClient<chain, account>,
	params: PrepareCreateAccountActionParams,
	config: TokenboundConfig = {},
): Promise<{ account: Address; txHash: Hex }> {
	const deployment = resolveDeployment(config)
	const chainId = params.chainId ?? clientChainId(client)

	const derived = getAccountAddress(
		{
			tokenContract: params.tokenContract,
			tokenId: params.tokenId,
			chainId,
			salt: params.salt,
		},
		deployment,
	)

	const tx = await prepareCreateAccountTx(
		{ ...params, chainId, salt: params.salt },
		deployment,
	)

	const txHash = await sendTx(client, tx)

	return { account: derived, txHash }
}

/**
 * Encodes an execution against a tokenbound account, handling cross-chain
 * encoding when the destination chain differs from the client's chain.
 */
export async function prepareExecution(
	client: Client,
	params: ExecuteActionParams,
	config: TokenboundConfig = {},
): Promise<CallData> {
	const deployment = resolveDeployment(config)
	const { account, to, value, data } = params
	const originChainId = clientChainId(client)
	const destinationChainId = params.chainId ?? originChainId
	const operation = CALL_OPERATIONS.CALL

	if (!deployment.supportsV3) {
		const { encodeExecuteCall } = await import("../protocol/core")
		return await encodeExecuteCall({ account, to, value, data })
	}

	let executionArgs: unknown[] = [to, value, data, operation]
	let executionValue = 0n

	if (originChainId !== destinationChainId) {
		const {
			to: crossChainTo,
			value: crossChainValue,
			data: crossChainData,
		} = await encodeCrossChainCall({
			publicClient: client as PublicClient,
			account,
			to,
			value,
			data,
			originChainId,
			destinationChainId,
		})

		executionArgs = [crossChainTo, crossChainValue, crossChainData, operation]
		executionValue = crossChainValue
	}

	const { encodeFunctionData } = await import("viem")

	return {
		to: account,
		value: executionValue,
		data: encodeFunctionData({
			abi: ERC_6551_DEFAULT.IMPLEMENTATION.ABI,
			functionName: "execute",
			args: executionArgs,
		}),
	}
}

/** Executes a call from a tokenbound account. */
export async function execute<
	chain extends Chain | undefined,
	account extends Account | undefined,
>(
	client: TokenboundWalletClient<chain, account>,
	params: ExecuteActionParams,
	config: TokenboundConfig = {},
): Promise<Hex> {
	const prepared = await prepareExecution(client, params, config)
	return await sendTx(client, prepared)
}

/** Transfers an ERC721/ERC1155 out of a tokenbound account. */
export async function transferNFT<
	chain extends Chain | undefined,
	account extends Account | undefined,
>(
	client: TokenboundWalletClient<chain, account>,
	params: TransferNFTActionParams,
	config: TokenboundConfig = {},
): Promise<Hex> {
	const recipient = await resolvePossibleENS(client, params.recipientAddress)

	const transfer = encodeNFTTransfer({
		account: params.account,
		tokenType: params.tokenType,
		tokenContract: params.tokenContract,
		tokenId: params.tokenId,
		recipient,
		amount: params.amount,
	})

	return await execute(
		client,
		{ account: params.account, ...transfer, chainId: params.chainId },
		config,
	)
}

/** Transfers ETH out of a tokenbound account. `amount` is in decimal ETH. */
export async function transferETH<
	chain extends Chain | undefined,
	account extends Account | undefined,
>(
	client: TokenboundWalletClient<chain, account>,
	params: TransferETHActionParams,
	config: TokenboundConfig = {},
): Promise<Hex> {
	const recipient = await resolvePossibleENS(client, params.recipientAddress)

	const transfer = encodeETHTransfer({ recipient, amount: params.amount })

	return await execute(
		client,
		{ account: params.account, ...transfer, chainId: params.chainId },
		config,
	)
}

/** Transfers an ERC-20 out of a tokenbound account. `amount` is in decimal units. */
export async function transferERC20<
	chain extends Chain | undefined,
	account extends Account | undefined,
>(
	client: TokenboundWalletClient<chain, account>,
	params: TransferERC20ActionParams,
	config: TokenboundConfig = {},
): Promise<Hex> {
	const recipient = await resolvePossibleENS(client, params.recipientAddress)

	const transfer = encodeERC20Transfer({
		recipient,
		amount: params.amount,
		erc20tokenAddress: params.erc20tokenAddress,
		erc20tokenDecimals: params.erc20tokenDecimals,
	})

	return await execute(
		client,
		{ account: params.account, ...transfer, chainId: params.chainId },
		config,
	)
}

/** Returns true when a tokenbound account has been deployed on-chain. */
export async function checkAccountDeployment(
	client: Client,
	params: { accountAddress: Address },
): Promise<boolean> {
	return hasBytecode(await getCode(client, { address: params.accountAddress }))
}

/**
 * Checks whether the ERC-6551 protocol contracts are deployed on the chain the
 * client is connected to.
 *
 * This is about the protocol, not about any individual account: use
 * `checkAccountDeployment` to ask whether a particular tokenbound account
 * exists. The addresses probed are the ones `config` resolves to, so pinning a
 * custom implementation/registry or the legacy V2 version checks those instead
 * of the current defaults.
 */
export async function checkProtocolDeployment(
	client: Client,
	config: TokenboundConfig = {},
): Promise<ProtocolDeploymentStatus> {
	const { registryAddress, implementationAddress } = resolveDeployment(config)

	// Independent reads: one round trip rather than two on a slow transport.
	const [registryCode, implementationCode] = await Promise.all([
		getCode(client, { address: registryAddress }),
		getCode(client, { address: implementationAddress }),
	])

	return toProtocolDeploymentStatus({
		registryCode,
		implementationCode,
		registryAddress,
		implementationAddress,
	})
}

/** Splits a deployed account's bytecode into its ERC-6551 components. */
export async function deconstructBytecode(
	client: Client,
	params: { accountAddress: Address },
): Promise<SegmentedERC6551Bytecode | null> {
	const bytecode = await getCode(client, { address: params.accountAddress })
	return deconstructBytecodeFromHex(bytecode)
}

/** Returns the NFT that owns a tokenbound account. */
export async function getNFT(
	client: Client,
	params: { accountAddress: Address },
): Promise<TokenboundAccountNFT> {
	const deconstructed = await deconstructBytecode(client, params)
	if (!deconstructed) {
		throw new Error(
			"The tokenbound account has not been deployed at this address",
		)
	}
	const { chainId, tokenContract, tokenId } = deconstructed
	return { tokenContract, tokenId, chainId }
}

/** Checks whether the client's account is a valid signer for a tokenbound account. */
export async function isValidSigner(
	client: Client,
	params: { account: Address; signerAddress?: Address },
	config: TokenboundConfig = {},
): Promise<boolean> {
	const deployment = resolveDeployment(config)

	if (!deployment.supportsV3) {
		throw new Error(
			"isValidSigner is not supported using the V2 implementation",
		)
	}

	const signerAddress =
		params.signerAddress ??
		(client as WalletClient).account?.address ??
		(client.account as Account | undefined)?.address

	if (!signerAddress) {
		throw new Error("No signer address available.")
	}

	const { numberToHex } = await import("viem")

	const result = await readContract(client, {
		address: params.account,
		abi: ERC_6551_DEFAULT.IMPLEMENTATION.ABI,
		functionName: "isValidSigner",
		args: [signerAddress, numberToHex(0, { size: 32 })],
	})

	return result === VALID_SIGNER_MAGIC_VALUE
}

/** Signs a message with the client's account. */
export async function signMessage<
	chain extends Chain | undefined,
	account extends Account | undefined,
>(
	client: TokenboundWalletClient<chain, account>,
	params: { message: SignableMessage },
): Promise<Hex> {
	const signerAccount = client.account
	if (!signerAccount) {
		throw new Error("No account available on the wallet client.")
	}
	return await viemSignMessage(client, {
		account: signerAccount,
		message: params.message,
	})
}

/** Sends a prepared transaction, filling in chain/account from the client. */
async function sendTx<
	chain extends Chain | undefined,
	account extends Account | undefined,
>(
	client: TokenboundWalletClient<chain, account>,
	tx: CallData | MultiCallTx,
): Promise<Hex> {
	const signerAccount = client.account
	if (!signerAccount) {
		throw new Error("No account available on the wallet client.")
	}
	return await sendTransaction(client, {
		...tx,
		account: signerAccount,
		chain: client.chain,
	} as Parameters<typeof sendTransaction>[1])
}

export type { ProtocolDeploymentStatus } from "../protocol"
export type { ResolvedDeployment }
