import {
	type Address,
	type Chain,
	createPublicClient,
	custom,
	encodeFunctionData,
	type GetCodeReturnType,
	type Hex,
	http,
	numberToHex,
	type PublicClient,
	type SignableMessage,
	type WalletClient,
} from "viem"
import { version as TB_SDK_VERSION } from "../package.json"
import {
	deconstructBytecode as deconstructBytecodeFromHex,
	encodeERC20Transfer,
	encodeETHTransfer,
	encodeExecuteCall,
	encodeNFTTransfer,
	getAccountAddress,
	prepareCreateAccountTx,
	type ResolvedDeployment,
	resolveDeployment,
	VALID_SIGNER_MAGIC_VALUE,
} from "./protocol"
import { ERC_6551_DEFAULT, ERC_6551_LEGACY_V2 } from "./protocol/constants"
import { createAccount, encodeCrossChainCall } from "./protocol/functions"
import {
	type BytecodeParams,
	CALL_OPERATIONS,
	type CallData,
	type CreateAccountParams,
	type ERC20TransferParams,
	type ETHTransferParams,
	type ExecuteCallParams,
	type ExecuteParams,
	type GetAccountParams,
	type MultiCallTx,
	type NFTTransferParams,
	type PrepareCreateAccountParams,
	type PrepareExecuteCallParams,
	type PrepareExecutionParams,
	type SegmentedERC6551Bytecode,
	type SignMessageParams,
	type TokenboundAccountNFT,
	type TokenboundClientOptions,
	type ValidSignerParams,
} from "./types"
import { getImplementationName, resolvePossibleENS } from "./utils"

declare global {
	interface Window {
		tokenboundSDK?: string
	}
}

class TokenboundClient {
	private chainId: number
	private chain: Chain
	public isInitialized = false
	public publicClient: PublicClient
	private walletClient?: WalletClient
	private deployment: ResolvedDeployment

	constructor(options: TokenboundClientOptions) {
		const {
			chain,
			walletClient,
			publicClient,
			implementationAddress,
			registryAddress,
			publicClientRPCUrl,
			version,
		} = options

		if (!chain) {
			throw new Error(
				"`chain` is required. Pass a viem Chain (e.g. `import { mainnet } from 'viem/chains'`). Passing only `chainId` is no longer supported: it forced every viem chain into consumer bundles.",
			)
		}

		if (publicClient && publicClientRPCUrl) {
			throw new Error(
				"Only one of `publicClient` or `publicClientRPCUrl` should be provided.",
			)
		}

		this.chainId = chain.id
		this.chain = chain
		this.walletClient = walletClient

		// Use a custom publicClient if provided.
		// If a walletClient is provided, use its transport so publicClient can share the connection.
		// Otherwise create a new one, specifying a custom RPC URL if provided but
		// defaulting to the default viem http() RPC URL.
		this.publicClient =
			publicClient ??
			createPublicClient({
				chain: this.chain,
				transport:
					walletClient && !publicClientRPCUrl
						? custom(walletClient.transport)
						: http(publicClientRPCUrl ?? undefined),
			})

		this.deployment = resolveDeployment({
			implementationAddress,
			registryAddress,
			version,
		})

		this.isInitialized = true

		if (typeof window !== "undefined") {
			const implementationName = getImplementationName(implementationAddress)
			window.tokenboundSDK = `Tokenbound SDK ${TB_SDK_VERSION} - ${implementationName}`
		}
	}

	/** Throws unless a walletClient was supplied. */
	private requireWalletClient(): WalletClient {
		if (!this.walletClient) {
			throw new Error("No wallet client available.")
		}
		return this.walletClient
	}

	/**
	 * Sends a prepared transaction via the wallet client, filling in the chain
	 * and account that are optional at WalletClient construction time.
	 */
	private async sendTransaction(tx: CallData | MultiCallTx): Promise<Hex> {
		const walletClient = this.requireWalletClient()
		if (!walletClient.account) {
			throw new Error("No account available on the wallet client.")
		}
		return await walletClient.sendTransaction({
			...tx,
			chain: this.chain,
			account: walletClient.account,
		} as Parameters<WalletClient["sendTransaction"]>[0])
	}

	/**
	 * Returns the SDK's package version.
	 * @returns The version of the SDK.
	 */
	public getSDKVersion(): string {
		return TB_SDK_VERSION
	}

	/**
	 * Returns the tokenbound account address for a given token contract and token ID.
	 * @param {`0x${string}`} params.tokenContract The address of the token contract.
	 * @param {string} params.tokenId The token ID.
	 * @returns The tokenbound account address.
	 */
	public getAccount(params: GetAccountParams): Address {
		const { tokenContract, tokenId, salt = 0, chainId = this.chainId } = params
		return getAccountAddress(
			{ tokenContract, tokenId, chainId, salt },
			this.deployment,
		)
	}

	/**
	 * Returns the prepared transaction to create a tokenbound account for a given token contract and token ID.
	 * @param {`0x${string}`} params.tokenContract The address of the token contract.
	 * @param {string} params.tokenId The token ID.
	 * @returns The prepared transaction to create a tokenbound account. Can be sent via `sendTransaction` on a viem WalletClient.
	 */
	public async prepareCreateAccount(
		params: PrepareCreateAccountParams,
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
	 * Returns the transaction hash of the transaction that created the tokenbound account for a given token contract and token ID.
	 * @param {`0x${string}`} params.tokenContract The address of the token contract.
	 * @param {string} params.tokenId The token ID.
	 * @returns a Promise that resolves to the account address of the created tokenbound account.
	 */
	public async createAccount(
		params: CreateAccountParams,
	): Promise<{ account: Address; txHash: Hex }> {
		const {
			tokenContract,
			tokenId,
			salt = 0,
			chainId = this.chainId,
			appendedCalls = [],
		} = params

		const walletClient = this.requireWalletClient()

		const computedAcct = this.getAccount({
			tokenContract,
			tokenId,
			chainId,
			salt,
		})

		const preparedCreateAccount = await this.prepareCreateAccount({
			tokenContract,
			tokenId,
			chainId,
			salt,
			appendedCalls,
		})

		const txHash = this.deployment.supportsV3
			? await this.sendTransaction(preparedCreateAccount)
			: await createAccount(
					tokenContract,
					tokenId,
					walletClient,
					this.deployment.implementationAddress,
					this.deployment.registryAddress,
					salt,
					chainId,
				)

		return {
			account: computedAcct,
			txHash,
		}
	}

	/**
	 * Returns prepared transaction to execute a call on a tokenbound account
	 * @param {string} params.account The tokenbound account address
	 * @param {string} params.to The recipient address
	 * @param {bigint} params.value The value to send, in wei
	 * @param {string} params.data The data to send
	 * @returns a Promise with prepared transaction to execute a call on a tokenbound account. Can be sent via `sendTransaction` on a viem WalletClient.
	 * @deprecated this method is deprecated, but still available for use with legacy V2 deployments. Use prepareExecution() instead.
	 */
	public async prepareExecuteCall(
		params: PrepareExecuteCallParams,
	): Promise<CallData> {
		if (this.deployment.supportsV3) {
			throw new Error(
				"prepareExecuteCall() is not supported on V3 implementation deployments, use prepareExecution() instead.",
			)
		}

		const { account, to, value, data } = params
		return await encodeExecuteCall({ account, to, value, data })
	}

	/**
	 * Executes a transaction call on a tokenbound account
	 * @param {string} params.account The tokenbound account address
	 * @param {string} params.to The recipient contract address
	 * @param {bigint} params.value The value to send, in wei
	 * @param {string} params.data The data to send
	 * @returns a Promise that resolves to the transaction hash of the executed call
	 * @deprecated this method is deprecated, but still available for use with legacy V2 deployments. Use execute() instead.
	 */
	public async executeCall(params: ExecuteCallParams): Promise<Hex> {
		const preparedExecuteCall = await this.prepareExecuteCall(params)
		return await this.sendTransaction(preparedExecuteCall)
	}

	/**
	 * Returns prepared transaction to execute on a tokenbound account
	 * @param {string} params.account The tokenbound account address
	 * @param {string} params.to The contract address to execute the call on
	 * @param {bigint} params.value The value to send, in wei
	 * @param {string} params.data The encoded operation calldata to send
	 * @returns a Promise with prepared transaction to execute on a tokenbound account. Can be sent via `sendTransaction` on a viem WalletClient.
	 */
	public async prepareExecution(
		params: PrepareExecutionParams,
	): Promise<CallData> {
		const { account, to, value, data, chainId = this.chainId } = params
		const operation = CALL_OPERATIONS.CALL

		if (!this.deployment.supportsV3) {
			return await this.prepareExecuteCall(params)
		}

		let executionArgs = [to, value, data, operation]
		let executionValue = 0n

		// Handle cross-chain call encoding
		if (this.chainId !== chainId) {
			const {
				to: crossChainTo,
				value: crossChainValue,
				data: crossChainData,
			} = await encodeCrossChainCall({
				publicClient: this.publicClient,
				account,
				to,
				value,
				data: data as Hex,
				originChainId: this.chainId,
				destinationChainId: chainId,
			})

			executionArgs = [crossChainTo, crossChainValue, crossChainData, operation]
			executionValue = crossChainValue
		}

		const executionData = encodeFunctionData({
			abi: ERC_6551_DEFAULT.IMPLEMENTATION.ABI,
			functionName: "execute",
			args: executionArgs,
		})

		return {
			to: account,
			value: executionValue,
			data: executionData,
		}
	}

	/**
	 * Executes a transaction call on a tokenbound account
	 * @param {string} params.account The tokenbound account address
	 * @param {string} params.to The contract address to execute the call on
	 * @param {bigint} params.value The value to send, in wei
	 * @param {string} params.data The encoded operation calldata to send
	 * @returns a Promise that resolves to the transaction hash of the executed call
	 */
	public async execute(params: ExecuteParams): Promise<Hex> {
		if (!this.deployment.supportsV3) {
			return await this.executeCall(params)
		}

		const preparedExecution = await this.prepareExecution(params)
		return await this.sendTransaction(preparedExecution)
	}

	/**
	 * Check if a tokenbound account is a valid signer for a transaction
	 * @param {string} params.account The tokenbound account address
	 * @returns a Promise that resolves to true if the account is a valid signer, otherwise false
	 */
	public async isValidSigner({ account }: ValidSignerParams): Promise<boolean> {
		const walletClient = this.requireWalletClient()
		const data = numberToHex(0, { size: 32 })
		const walletAddress = walletClient.account?.address

		if (!this.deployment.supportsV3) {
			throw new Error(
				"isValidSigner is not supported using the V2 implementation",
			)
		}

		const validityCheck = await this.publicClient.readContract({
			address: account,
			abi: ERC_6551_DEFAULT.IMPLEMENTATION.ABI,
			functionName: "isValidSigner",
			args: [walletAddress, data],
		})

		return validityCheck === VALID_SIGNER_MAGIC_VALUE
	}

	/**
	 * Check if a tokenbound account has been deployed
	 * @param {string} params.accountAddress The tokenbound account address
	 * @returns a Promise that resolves to true if the account is deployed, otherwise false
	 */
	public async checkAccountDeployment({
		accountAddress,
	}: BytecodeParams): Promise<boolean> {
		return await this.publicClient
			.getCode({ address: accountAddress })
			.then((bytecode: GetCodeReturnType) => {
				return bytecode ? bytecode.length > 2 : false
			})
	}

	/**
	 * Deconstructs the bytecode of a tokenbound account into its constituent parts.
	 * @param {`0x${string}`} params.accountAddress The address of the tokenbound account.
	 * @returns a Promise that resolves to a SegmentedERC6551Bytecode object, or null if the account is not deployed
	 */
	public async deconstructBytecode({
		accountAddress,
	}: BytecodeParams): Promise<SegmentedERC6551Bytecode | null> {
		const rawBytecode = await this.publicClient.getCode({
			address: accountAddress,
		})

		return deconstructBytecodeFromHex(rawBytecode)
	}

	/**
	 * Get NFT information from a tokenbound account
	 * @param {`0x${string}`} params.accountAddress The address of the tokenbound account.
	 * @returns a Promise that resolves to an object containing the token contract address, token ID, and chain ID
	 */
	public async getNFT({
		accountAddress,
	}: BytecodeParams): Promise<TokenboundAccountNFT> {
		const deconstructedBytecode = await this.deconstructBytecode({
			accountAddress,
		})
		if (!deconstructedBytecode)
			throw new Error(
				"The tokenbound account has not been deployed at this address",
			)

		const { chainId, tokenContract, tokenId } = deconstructedBytecode

		return {
			tokenContract,
			tokenId,
			chainId,
		}
	}

	/**
	 * Executes an NFT transfer call on a tokenbound account
	 * @param {string} params.account The tokenbound account address
	 * @param {string} params.tokenType The type of token, either 'ERC721' or 'ERC1155'
	 * @param {string} params.tokenContract The address of the token contract
	 * @param {string} params.tokenId The token ID
	 * @param {string} params.recipientAddress The address to which the token should be transferred
	 * @param {string} params.amount The amount of tokens to transfer, (eg. 1 NFT = 1). Defaults to 1. 1155 only.
	 * @returns a Promise that resolves to the transaction hash of the executed call
	 */
	public async transferNFT(params: NFTTransferParams): Promise<Hex> {
		const {
			account: tbAccountAddress,
			tokenType,
			tokenContract,
			tokenId,
			amount = 1,
			recipientAddress,
			chainId,
		} = params

		try {
			const recipient = await resolvePossibleENS(
				this.publicClient,
				recipientAddress,
			)

			const transfer = encodeNFTTransfer({
				account: tbAccountAddress,
				tokenType,
				tokenContract,
				tokenId,
				recipient,
				amount,
			})

			return await this.executeTransfer(tbAccountAddress, transfer, chainId)
		} catch (error) {
			console.log(error)
			throw error
		}
	}

	/**
	 * Executes an ETH transfer call on a tokenbound account
	 * @param {string} params.account The tokenbound account address
	 * @param {number} params.amount The amount of ETH to transfer, in decimal format (eg. 0.1 ETH = 0.1)
	 * @param {string} params.recipientAddress The address to which the ETH should be transferred
	 * @returns a Promise that resolves to the transaction hash of the executed call
	 */
	public async transferETH(params: ETHTransferParams): Promise<Hex> {
		const {
			account: tbAccountAddress,
			amount,
			recipientAddress,
			chainId,
		} = params

		try {
			const recipient = await resolvePossibleENS(
				this.publicClient,
				recipientAddress,
			)

			const transfer = encodeETHTransfer({ recipient, amount })

			return await this.executeTransfer(tbAccountAddress, transfer, chainId)
		} catch (err) {
			console.log(err)
			throw err
		}
	}

	/**
	 * Executes an ERC-20 transfer call on a tokenbound account
	 * @param {string} params.account The tokenbound account address
	 * @param {number} params.amount The amount of ERC-20 to transfer, in decimal format (eg. 0.1 USDC = 0.1)
	 * @param {string} params.recipientAddress The address to which the ETH should be transferred
	 * @param {string} params.erc20tokenAddress The address of the ERC-20 token contract
	 * @param {string} params.erc20tokenDecimals The decimal specification of the ERC-20 token
	 * @returns a Promise that resolves to the transaction hash of the executed call
	 */
	public async transferERC20(params: ERC20TransferParams): Promise<Hex> {
		const {
			account: tbAccountAddress,
			amount,
			recipientAddress,
			erc20tokenAddress,
			erc20tokenDecimals,
			chainId,
		} = params

		// Validate decimals before any network access, preserving prior behavior.
		if (erc20tokenDecimals < 0 || erc20tokenDecimals > 18)
			throw new Error("Decimal value out of range. Should be between 0 and 18.")

		try {
			const recipient = await resolvePossibleENS(
				this.publicClient,
				recipientAddress,
			)

			const transfer = encodeERC20Transfer({
				recipient,
				amount,
				erc20tokenAddress,
				erc20tokenDecimals,
			})

			return await this.executeTransfer(tbAccountAddress, transfer, chainId)
		} catch (error) {
			console.log(error)
			throw error
		}
	}

	/** Routes an encoded transfer through execute() or the legacy executeCall(). */
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

	/**
	 * Calculates an Ethereum-specific signature
	 * @param {string} params.message The message to be signed
	 * @returns a Promise that resolves to a signed Hex string
	 */
	public async signMessage(params: SignMessageParams): Promise<Hex> {
		const { message } = params
		const walletClient = this.requireWalletClient()

		try {
			if (!walletClient.account) {
				throw new Error("No account available on the wallet client.")
			}
			return await walletClient.signMessage({
				account: walletClient.account,
				message: message as SignableMessage,
			})
		} catch (error) {
			console.log(error)
			throw error
		}
	}
}

const erc6551AccountAbiV2 = ERC_6551_LEGACY_V2.IMPLEMENTATION.ABI
const erc6551RegistryAbiV2 = ERC_6551_LEGACY_V2.REGISTRY.ABI
const erc6551AccountAbiV3 = ERC_6551_DEFAULT.IMPLEMENTATION.ABI
const erc6551AccountProxyAbiV3 = ERC_6551_DEFAULT.ACCOUNT_PROXY?.ABI
const erc6551RegistryAbiV3 = ERC_6551_DEFAULT.REGISTRY.ABI

export {
	erc6551AccountAbiV2,
	erc6551AccountAbiV3,
	erc6551AccountProxyAbiV3,
	erc6551RegistryAbiV2,
	erc6551RegistryAbiV3,
	TokenboundClient,
}
