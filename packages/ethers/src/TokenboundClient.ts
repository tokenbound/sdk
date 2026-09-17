// Ethers-backed TokenboundClient.
//
// The public API deliberately mirrors @tokenbound/sdk's TokenboundClient so
// existing ethers users migrate by changing only their import. All ERC-6551
// encoding and address derivation is reused from @tokenbound/sdk's protocol
// layer — nothing is reimplemented here.

import {
	type CallData,
	type CreateAccountParams,
	deconstructBytecode as deconstructBytecodeFromHex,
	ERC_6551_DEFAULT,
	type ERC20TransferParams,
	type ETHTransferParams,
	type ExecuteParams,
	encodeERC20Transfer,
	encodeETHTransfer,
	encodeExecuteCall,
	encodeExecution,
	encodeNFTTransfer,
	type GetAccountParams,
	getAccountAddress,
	hasBytecode,
	type MultiCallTx,
	type NFTTransferParams,
	type PossibleENSAddress,
	type ProtocolDeploymentStatus,
	prepareCreateAccountTx,
	type ResolvedDeployment,
	resolveDeployment,
	type SegmentedERC6551Bytecode,
	type TBImplementationVersion,
	type TokenboundAccountNFT,
	toProtocolDeploymentStatus,
	VALID_SIGNER_MAGIC_VALUE,
} from "@tokenbound/sdk"
import type { Address, Chain, Hex } from "viem"
import { encodeFunctionData, getAddress, numberToHex } from "viem/utils"

import { type EthersAdapter, resolveAdapter } from "./adapter"
import type { EthersSignableMessage } from "./types"

export type TokenboundEthersClientOptions = {
	/** An ethers v5 or v6 Signer. */
	signer: unknown
	/**
	 * The viem Chain to operate on. Required, mirroring @tokenbound/sdk: the
	 * SDK no longer maps a bare chainId to a Chain.
	 */
	chain: Chain
	implementationAddress?: Address
	registryAddress?: Address
	version?: TBImplementationVersion
}

// Parameter types come from @tokenbound/sdk rather than being redefined here:
// the two clients expose the same API, so a consumer switching between them
// (or a shared helper typed against one) must see identical shapes. Re-exported
// below so `import type { GetAccountParams } from "@tokenbound/ethers"` works.
export type {
	CreateAccountParams,
	ERC20TransferParams,
	ETHTransferParams,
	ExecuteParams,
	GetAccountParams,
	NFTTransferParams,
}

export class TokenboundClient {
	private chain: Chain
	public isInitialized = false
	private adapter: EthersAdapter
	private deployment: ResolvedDeployment

	/** Always the configured chain's id; derived rather than stored separately. */
	private get chainId(): number {
		return this.chain.id
	}

	constructor(options: TokenboundEthersClientOptions) {
		const { signer, chain, implementationAddress, registryAddress, version } =
			options

		if (!chain) {
			throw new Error(
				"`chain` is required. Pass a viem Chain (e.g. `import { mainnet } from 'viem/chains'`).",
			)
		}

		if (!signer) {
			throw new Error("signer required.")
		}

		this.chain = chain
		this.adapter = resolveAdapter(signer)

		this.deployment = resolveDeployment({
			implementationAddress,
			registryAddress,
			version,
		})

		this.isInitialized = true
	}

	/** The detected ethers major version (5 or 6). */
	public getEthersVersion(): 5 | 6 {
		return this.adapter.version
	}

	/**
	 * Returns the tokenbound account address for a given token contract and token ID.
	 */
	public getAccount(params: GetAccountParams): Address {
		const { tokenContract, tokenId, salt = 0, chainId = this.chainId } = params
		return getAccountAddress(
			{ tokenContract, tokenId, chainId, salt },
			this.deployment,
		)
	}

	/**
	 * Returns the prepared transaction to create a tokenbound account.
	 * Can be sent via `sendTransaction` on an ethers Signer.
	 */
	public async prepareCreateAccount(
		params: CreateAccountParams,
	): Promise<MultiCallTx | CallData> {
		const {
			tokenContract,
			tokenId,
			salt = 0,
			chainId = this.chainId,
			appendedCalls = [],
		} = params

		return await prepareCreateAccountTx(
			{ tokenContract, tokenId, chainId, salt, appendedCalls },
			this.deployment,
		)
	}

	/**
	 * Creates a tokenbound account, returning the account address and tx hash.
	 */
	public async createAccount(
		params: CreateAccountParams,
	): Promise<{ account: Address; txHash: Hex }> {
		const { tokenContract, tokenId, salt = 0, chainId = this.chainId } = params

		const account = this.getAccount({ tokenContract, tokenId, chainId, salt })
		const prepared = await this.prepareCreateAccount(params)
		const txHash = await this.sendPrepared(prepared)

		return { account, txHash }
	}

	/**
	 * Returns prepared transaction to execute a call on a tokenbound account.
	 * @deprecated available for legacy V2 deployments. Use prepareExecution().
	 */
	public async prepareExecuteCall(params: ExecuteParams): Promise<CallData> {
		if (this.deployment.supportsV3) {
			throw new Error(
				"prepareExecuteCall() is not supported on V3 implementation deployments, use prepareExecution() instead.",
			)
		}
		const { account, to, value, data } = params
		return await encodeExecuteCall({ account, to, value, data })
	}

	/**
	 * Executes a call on a legacy V2 tokenbound account.
	 * @deprecated available for legacy V2 deployments. Use execute().
	 */
	public async executeCall(params: ExecuteParams): Promise<Hex> {
		const prepared = await this.prepareExecuteCall(params)
		return await this.sendPrepared(prepared)
	}

	/**
	 * Returns prepared transaction to execute on a tokenbound account.
	 * Cross-chain execution is not supported through the ethers adapter.
	 */
	public async prepareExecution(params: ExecuteParams): Promise<CallData> {
		const { account, to, value, data, chainId = this.chainId } = params

		if (!this.deployment.supportsV3) {
			return await this.prepareExecuteCall(params)
		}

		if (chainId !== this.chainId) {
			throw new Error(
				"Cross-chain execution is not supported via @tokenbound/ethers. Use @tokenbound/sdk with a viem client.",
			)
		}

		return encodeExecution({
			account,
			to,
			value,
			data: data as Hex,
		})
	}

	/** Executes a call from a tokenbound account. */
	public async execute(params: ExecuteParams): Promise<Hex> {
		if (!this.deployment.supportsV3) {
			return await this.executeCall(params)
		}
		const prepared = await this.prepareExecution(params)
		return await this.sendPrepared(prepared)
	}

	/** Checks whether the signer is a valid signer for a tokenbound account. */
	public async isValidSigner({
		account,
	}: {
		account: Address
	}): Promise<boolean> {
		if (!this.deployment.supportsV3) {
			throw new Error(
				"isValidSigner is not supported using the V2 implementation",
			)
		}

		const signerAddress = await this.adapter.getAddress()
		const data = encodeFunctionData({
			abi: ERC_6551_DEFAULT.IMPLEMENTATION.ABI,
			functionName: "isValidSigner",
			args: [signerAddress, numberToHex(0, { size: 32 })],
		})

		// The contract returns a bytes4 magic value, left-aligned in a 32-byte
		// word, so the first 4 bytes of the return data are the whole answer.
		const returnData = await this.adapter.call({ to: account, data })

		return returnData.slice(0, 10) === VALID_SIGNER_MAGIC_VALUE
	}

	/** Returns true when a tokenbound account has been deployed. */
	public async checkAccountDeployment({
		accountAddress,
	}: {
		accountAddress: Address
	}): Promise<boolean> {
		return hasBytecode(await this.adapter.getCode(accountAddress))
	}

	/**
	 * Reports whether the ERC-6551 protocol contracts are deployed on the
	 * configured chain. This asks about the protocol, not about an individual
	 * account — use `checkAccountDeployment` for that.
	 */
	public async checkProtocolDeployment(): Promise<ProtocolDeploymentStatus> {
		const { registryAddress, implementationAddress } = this.deployment

		// Independent reads: one round trip rather than two on a slow transport.
		const [registryCode, implementationCode] = await Promise.all([
			this.adapter.getCode(registryAddress),
			this.adapter.getCode(implementationAddress),
		])

		// The status is assembled by the shared protocol layer, so this client
		// and the viem core cannot drift on what counts as deployed.
		return toProtocolDeploymentStatus({
			registryCode,
			implementationCode,
			registryAddress,
			implementationAddress,
		})
	}

	/** Splits a deployed account's bytecode into its ERC-6551 components. */
	public async deconstructBytecode({
		accountAddress,
	}: {
		accountAddress: Address
	}): Promise<SegmentedERC6551Bytecode | null> {
		const bytecode = await this.adapter.getCode(accountAddress)
		return deconstructBytecodeFromHex(bytecode)
	}

	/** Returns the NFT that owns a tokenbound account. */
	public async getNFT({
		accountAddress,
	}: {
		accountAddress: Address
	}): Promise<TokenboundAccountNFT> {
		const deconstructed = await this.deconstructBytecode({ accountAddress })
		if (!deconstructed) {
			throw new Error(
				"The tokenbound account has not been deployed at this address",
			)
		}
		const { chainId, tokenContract, tokenId } = deconstructed
		return { tokenContract, tokenId, chainId }
	}

	/** Transfers an ERC721/ERC1155 out of a tokenbound account. */
	public async transferNFT(params: NFTTransferParams): Promise<Hex> {
		const recipient = await this.resolveRecipient(params.recipientAddress)

		const transfer = encodeNFTTransfer({
			account: params.account,
			tokenType: params.tokenType,
			tokenContract: params.tokenContract,
			tokenId: params.tokenId,
			recipient,
			amount: params.amount,
		})

		return await this.executeTransfer(params.account, transfer, params.chainId)
	}

	/** Transfers ETH out of a tokenbound account. `amount` is in decimal ETH. */
	public async transferETH(params: ETHTransferParams): Promise<Hex> {
		const recipient = await this.resolveRecipient(params.recipientAddress)
		const transfer = encodeETHTransfer({ recipient, amount: params.amount })
		return await this.executeTransfer(params.account, transfer, params.chainId)
	}

	/** Transfers an ERC-20 out of a tokenbound account. */
	public async transferERC20(params: ERC20TransferParams): Promise<Hex> {
		if (params.erc20tokenDecimals < 0 || params.erc20tokenDecimals > 18) {
			throw new Error("Decimal value out of range. Should be between 0 and 18.")
		}

		const recipient = await this.resolveRecipient(params.recipientAddress)

		const transfer = encodeERC20Transfer({
			recipient,
			amount: params.amount,
			erc20tokenAddress: params.erc20tokenAddress,
			erc20tokenDecimals: params.erc20tokenDecimals,
		})

		return await this.executeTransfer(params.account, transfer, params.chainId)
	}

	/**
	 * Signs a message with the ethers signer, normalizing the message for the
	 * detected ethers version.
	 */
	public async signMessage(params: {
		message: EthersSignableMessage
	}): Promise<Hex> {
		return await this.adapter.signMessage(params.message)
	}

	/** Resolves an ENS name via the public client, or normalizes an address. */
	private async resolveRecipient(
		recipientAddress: PossibleENSAddress,
	): Promise<Address> {
		if (!recipientAddress.endsWith(".eth")) {
			return getAddress(recipientAddress)
		}

		// ethers normalizes ENS names internally, so no viem/ens import here.
		const resolved = await this.adapter.resolveName(recipientAddress)

		if (!resolved) {
			throw new Error("Failed to resolve ENS address")
		}
		return getAddress(resolved)
	}

	/** Routes an encoded transfer through execute() or legacy executeCall(). */
	private async executeTransfer(
		account: Address,
		transfer: { to: Address; value: bigint; data: Hex },
		chainId?: number,
	): Promise<Hex> {
		const execution = { account, ...transfer }
		if (this.deployment.supportsV3) {
			return await this.execute({ ...execution, chainId })
		}
		return await this.executeCall(execution)
	}

	/** Sends a prepared transaction through the ethers signer. */
	private async sendPrepared(tx: CallData | MultiCallTx): Promise<Hex> {
		return await this.adapter.sendTransaction({
			to: tx.to as Address,
			value: tx.value ?? 0n,
			data: tx.data as Hex,
		})
	}
}
