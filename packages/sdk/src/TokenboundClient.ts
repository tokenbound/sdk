import {
  WalletClient,
  PublicClient,
  createPublicClient,
  http,
  GetBytecodeReturnType,
  hexToNumber,
  getAddress,
  encodeFunctionData,
  parseUnits,
  SignableMessage,
} from 'viem'
import {
  // erc6551AccountAbiV2,
  // erc6551RegistryAbiV2,
  // erc6551AccountAbiV3,
  // erc6551RegistryAbiV3,
  erc1155Abi,
  erc721Abi,
  erc20Abi,
} from '../abis'
import {
  getAccount,
  computeAccount,
  createAccount,
  getCreationCode,
  prepareExecuteCall,
  executeCall,
  prepareCreateAccount,
} from './functions'
import {
  AbstractEthersSigner,
  AbstractEthersTransactionResponse,
  BytecodeParams,
  CreateAccountParams,
  ERC20TransferParams,
  SignMessageParams,
  ETHTransferParams,
  ExecuteCallParams,
  GetAccountParams,
  NFTTokenType,
  NFTTransferParams,
  PrepareCreateAccountParams,
  PrepareExecuteCallParams,
  SegmentedERC6551Bytecode,
  TokenboundAccountNFT,
  TokenboundClientOptions,
  EthersSignableMessage,
} from './types'
import {
  chainIdToChain,
  segmentBytecode,
  normalizeMessage,
  isEthers5SignableMessage,
  isEthers6SignableMessage,
  isViemSignableMessage,
  resolvePossibleENS,
} from './utils'
import { version as TB_SDK_VERSION } from '../package.json'
// import { ERC_6551_DEFAULT, ERC_6551_LEGACY_V2 } from './constants'

declare global {
  interface Window {
    tokenboundSDK?: string
  }
}
class TokenboundClient {
  private chainId: number
  public isInitialized: boolean = false
  public publicClient: PublicClient
  private signer?: AbstractEthersSigner
  private walletClient?: WalletClient
  private implementationAddress?: `0x${string}`
  private registryAddress?: `0x${string}`

  constructor(options: TokenboundClientOptions) {
    const {
      chainId,
      chain,
      signer,
      walletClient,
      publicClient,
      implementationAddress,
      registryAddress,
      publicClientRPCUrl,
    } = options

    if (!chainId && !chain) {
      throw new Error('chain or chainId required.')
    }

    if (signer && walletClient) {
      throw new Error('Only one of `signer` or `walletClient` should be provided.')
    }

    if (publicClient && publicClientRPCUrl) {
      throw new Error(
        'Only one of `publicClient` or `publicClientRPCUrl` should be provided.'
      )
    }

    if (signer && publicClient) {
      throw new Error('`publicClient` cannot be provided when using Ethers `signer`.')
    }

    this.chainId = chainId ?? chain!.id

    if (signer) {
      this.signer = signer
    } else if (walletClient) {
      this.walletClient = walletClient
    }

    if (implementationAddress) {
      this.implementationAddress = implementationAddress
    }
    if (registryAddress) {
      this.registryAddress = registryAddress
    }

    this.publicClient =
      publicClient ??
      createPublicClient({
        chain: chain ?? chainIdToChain(this.chainId),
        transport: http(publicClientRPCUrl ?? undefined),
      })

    this.isInitialized = true

    if (typeof window !== 'undefined') {
      window.tokenboundSDK = `Tokenbound SDK ${TB_SDK_VERSION} Implementation: ${
        this.implementationAddress ?? 'Default'
      }`
    }
  }

  /**
   * Returns the tokenbound account address for a given token contract and token ID.
   * @param {`0x${string}`} params.tokenContract The address of the token contract.
   * @param {string} params.tokenId The token ID.
   * @param {`0x${string}`} [params.implementationAddress] The address of the implementation contract.
   * @param {`0x${string}`} [params.registryAddress] The address of the registry contract.
   * @returns The tokenbound account address.
   */
  public getAccount(params: GetAccountParams): `0x${string}` {
    const { tokenContract, tokenId, implementationAddress, registryAddress } = params
    const implementation = implementationAddress ?? this.implementationAddress
    const registry = registryAddress ?? this.registryAddress

    try {
      // Here we call computeAccount rather than getAccount to avoid
      // making an async contract call via publicClient
      return computeAccount(
        tokenContract,
        tokenId,
        this.chainId,
        implementation,
        registry
      )
    } catch (error) {
      throw error
    }
  }

  /**
   * Returns the prepared transaction to create a tokenbound account for a given token contract and token ID.
   * @param {`0x${string}`} params.tokenContract The address of the token contract.
   * @param {string} params.tokenId The token ID.
   * @param {`0x${string}`} [params.implementationAddress] The address of the implementation contract.
   * @param {`0x${string}`} [params.registryAddress] The address of the registry contract.
   * @returns The prepared transaction to create a tokenbound account. Can be sent via `sendTransaction` on an Ethers signer or viem WalletClient.
   */
  public async prepareCreateAccount(params: PrepareCreateAccountParams): Promise<{
    to: `0x${string}`
    value: bigint
    data: `0x${string}`
  }> {
    const { tokenContract, tokenId, implementationAddress, registryAddress } = params
    const implementation = implementationAddress ?? this.implementationAddress
    const registry = registryAddress ?? this.registryAddress

    return prepareCreateAccount(
      tokenContract,
      tokenId,
      this.chainId,
      implementation,
      registry
    )
  }

  /**
   * Returns the transaction hash of the transaction that created the tokenbound account for a given token contract and token ID.
   * @param {`0x${string}`} params.tokenContract The address of the token contract.
   * @param {string} params.tokenId The token ID.
   * @param {`0x${string}`} [params.implementationAddress] The address of the implementation contract.
   * @param {`0x${string}`} [params.registryAddress] The address of the registry contract.
   * @returns a Promise that resolves to the account address of the created token bound account.
   */
  public async createAccount(params: CreateAccountParams): Promise<`0x${string}`> {
    const { tokenContract, tokenId, implementationAddress, registryAddress } = params
    const implementation = implementationAddress ?? this.implementationAddress
    const registry = registryAddress ?? this.registryAddress

    try {
      let txHash: `0x${string}` | undefined

      if (this.signer) {
        // Ethers
        const prepareCreateAccount = await this.prepareCreateAccount({
          tokenContract,
          tokenId,
          implementationAddress: implementation,
          registryAddress: registry,
        })

        txHash = (await this.signer
          .sendTransaction(prepareCreateAccount)
          .then((tx: AbstractEthersTransactionResponse) => tx.hash)) as `0x${string}`
      } else if (this.walletClient) {
        txHash = await createAccount(tokenContract, tokenId, this.walletClient)
      }

      if (txHash) {
        return computeAccount(
          tokenContract,
          tokenId,
          this.chainId,
          implementation,
          registry
        )
      } else {
        throw new Error('No wallet client or signer available.')
      }
    } catch (error) {
      throw error
    }
  }

  /**
   * Returns prepared transaction to execute a call on a tokenbound account
   * @param {string} params.account The tokenbound account address
   * @param {string} params.to The recipient address
   * @param {bigint} params.value The value to send, in wei
   * @param {string} params.data The data to send
   * @returns a Promise with prepared transaction to execute a call on a tokenbound account. Can be sent via `sendTransaction` on a viem WalletClient or Ethers signer.
   */
  public async prepareExecuteCall(params: PrepareExecuteCallParams): Promise<{
    to: `0x${string}`
    value: bigint
    data: `0x${string}`
  }> {
    const { account, to, value, data } = params
    return prepareExecuteCall(account, to, value, data)
  }

  /**
   * Executes a transaction call on a tokenbound account
   * @param {string} params.account The tokenbound account address
   * @param {string} params.to The recipient contract address
   * @param {bigint} params.value The value to send, in wei
   * @param {string} params.data The data to send
   * @returns a Promise that resolves to the transaction hash of the executed call
   */
  public async executeCall(params: ExecuteCallParams): Promise<`0x${string}`> {
    const preparedExecuteCall = await this.prepareExecuteCall(params)

    try {
      if (this.signer) {
        // Ethers
        return (await this.signer
          .sendTransaction(preparedExecuteCall)
          .then((tx: AbstractEthersTransactionResponse) => tx.hash)) as `0x${string}`
      } else if (this.walletClient) {
        return await this.walletClient.sendTransaction({
          // chain and account need to be added explicitly
          // because they're optional when instantiating a WalletClient
          chain: chainIdToChain(this.chainId),
          account: this.walletClient.account!,
          ...preparedExecuteCall,
        })
      } else {
        throw new Error('No wallet client or signer available.')
      }
    } catch (error) {
      throw error
    }
  }

  /**
   * Check if a tokenbound account has been deployed
   * @param {string} params.accountAddress The tokenbound account address
   * @returns a Promise that resolves to true if the account is deployed, otherwise false
   */
  public async checkAccountDeployment({
    accountAddress,
  }: BytecodeParams): Promise<boolean> {
    try {
      return await this.publicClient
        .getBytecode({ address: accountAddress })
        .then((bytecode: GetBytecodeReturnType) =>
          bytecode ? bytecode.length > 2 : false
        )
    } catch (error) {
      throw error
    }
  }

  /**
   * Deconstructs the bytecode of a tokenbound account into its constituent parts.
   * @param {`0x${string}`} params.accountAddress The address of the tokenbound account.
   * @returns a Promise that resolves to a SegmentedERC6551Bytecode object, or null if the account is not deployed
   */
  public async deconstructBytecode({
    accountAddress,
  }: BytecodeParams): Promise<SegmentedERC6551Bytecode | null> {
    try {
      const rawBytecode = await this.publicClient.getBytecode({ address: accountAddress })
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
      const implementationAddress: `0x${string}` = getAddress(
        `0x${rawImplementationAddress}`
      )
      const salt = hexToNumber(`0x${rawSalt}`, { size: 32 })
      const tokenContract: `0x${string}` = getAddress(
        `0x${rawTokenContract.slice(
          rawTokenContract.length - 40,
          rawTokenContract.length
        )}`
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
    } catch (error) {
      throw error
    }
  }

  /**
   * Get NFT information from a tokenbound account
   * @param {`0x${string}`} params.accountAddress The address of the tokenbound account.
   * @returns a Promise that resolves to an object containing the token contract address, token ID, and chain ID
   */
  public async getNFT({ accountAddress }: BytecodeParams): Promise<TokenboundAccountNFT> {
    try {
      const deconstructedBytecode = await this.deconstructBytecode({ accountAddress })
      if (!deconstructedBytecode)
        throw new Error('The tokenbound account has not been deployed at this address')

      const { chainId, tokenContract, tokenId } = deconstructedBytecode

      return {
        tokenContract,
        tokenId,
        chainId,
      }
    } catch (error) {
      throw error
    }
  }

  /**
   * Executes a transaction call on a tokenbound account
   * @param {string} params.account The tokenbound account address
   * @param {string} params.tokenType The type of token, either 'ERC721' or 'ERC1155'
   * @param {string} params.tokenContract The address of the token contract
   * @param {string} params.tokenId The token ID
   * @param {string} params.recipientAddress The address to which the token should be transferred
   * @param {string} params.amount The amount of tokens to transfer, (eg. 1 NFT = 1). Defaults to 1. 1155 only.
   * @returns a Promise that resolves to the transaction hash of the executed call
   */
  public async transferNFT(params: NFTTransferParams): Promise<`0x${string}`> {
    const {
      account: tbAccountAddress,
      tokenType,
      tokenContract,
      tokenId,
      amount = 1,
      recipientAddress,
    } = params

    const is1155: boolean = tokenType === NFTTokenType.ERC1155

    if (!is1155 && amount !== 1) {
      throw new Error('ERC721 transfers can only transfer one token at a time.')
    }

    try {
      const recipient = await resolvePossibleENS(this.publicClient, recipientAddress)

      // Configure required args based on token type
      // ERC1155: safeTransferFrom(address,address,uint256,uint256,bytes)
      // ERC721: safeTransferFrom(address,address,uint256)
      const sharedArgs = [tbAccountAddress, recipient, tokenId]
      const transferArgs: unknown[] = is1155 ? [...sharedArgs, amount, '0x'] : sharedArgs

      const transferCallData = encodeFunctionData({
        abi: is1155 ? erc1155Abi : erc721Abi,
        functionName: 'safeTransferFrom',
        args: transferArgs,
      })

      return await this.executeCall({
        account: tbAccountAddress,
        to: tokenContract,
        value: BigInt(0),
        data: transferCallData,
      })
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
  public async transferETH(params: ETHTransferParams): Promise<`0x${string}`> {
    const { account: tbAccountAddress, amount, recipientAddress } = params
    const weiValue = parseUnits(`${amount}`, 18) // convert ETH to wei

    try {
      const recipient = await resolvePossibleENS(this.publicClient, recipientAddress)

      return await this.executeCall({
        account: tbAccountAddress,
        to: recipient,
        value: weiValue,
        data: '0x',
      })
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
  public async transferERC20(params: ERC20TransferParams): Promise<`0x${string}`> {
    const {
      account: tbAccountAddress,
      amount,
      recipientAddress,
      erc20tokenAddress,
      erc20tokenDecimals,
    } = params

    if (erc20tokenDecimals < 0 || erc20tokenDecimals > 18)
      throw new Error('Decimal value out of range. Should be between 0 and 18.')

    const amountBaseUnit = parseUnits(`${amount}`, erc20tokenDecimals)

    try {
      const recipient = await resolvePossibleENS(this.publicClient, recipientAddress)

      const callData = encodeFunctionData({
        abi: erc20Abi,
        functionName: 'transfer',
        args: [recipient, amountBaseUnit],
      })
      return await this.executeCall({
        account: tbAccountAddress,
        to: erc20tokenAddress,
        value: 0n,
        data: callData,
      })
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  /**
   * Calculates an Ethereum-specific signature
   * @param {string} params.message The message to be signed
   * @returns a Promise that resolves to a signed Hex string
   */
  public async signMessage(params: SignMessageParams): Promise<`0x${string}`> {
    const { message } = params

    try {
      if (this.signer) {
        // Normalize message so it'll be compatible with Ethers 5 and 6
        if (!isEthers5SignableMessage && !isEthers6SignableMessage) {
          throw new Error('Message is not a valid Ethers signable message.')
        }
        const normalizedMessage = normalizeMessage(message as EthersSignableMessage)
        return await this.signer.signMessage(normalizedMessage)
      } else if (this.walletClient) {
        if (!isViemSignableMessage(message)) {
          throw new Error('Message is not a valid viem signable message.')
        }
        return await this.walletClient.signMessage({
          account: this.walletClient.account!,
          message: message as SignableMessage,
        })
      }
      throw new Error('No wallet client or signer available.')
    } catch (error) {
      console.log(error)
      throw error
    }
  }
}
// const erc6551AccountAbiV2 = ERC_6551_LEGACY_V2.IMPLEMENTATION.ABI
// const erc6551RegistryAbiV2 = ERC_6551_LEGACY_V2.REGISTRY.ABI
// const erc6551AccountAbiV3 = ERC_6551_DEFAULT.IMPLEMENTATION.ABI
// const erc6551RegistryAbiV3 = ERC_6551_DEFAULT.REGISTRY.ABI
export {
  TokenboundClient,
  // erc6551AccountAbiV2,
  // erc6551RegistryAbiV2,
  // erc6551AccountAbiV3,
  // erc6551RegistryAbiV3,
  getAccount,
  createAccount,
  getCreationCode,
  computeAccount,
  prepareExecuteCall,
  executeCall,
}
