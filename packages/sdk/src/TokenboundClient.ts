import { 
  WalletClient,
  PublicClient,
  createPublicClient,
  http,
  GetBytecodeReturnType,
  hexToNumber,  
  getAddress,
  encodeFunctionData,
  Abi,
  parseUnits,
  // BaseError,
  // ContractFunctionRevertedError
} from "viem"
import { erc6551AccountAbi, erc6551RegistryAbi, erc1155Abi, erc721Abi, erc20Abi } from '../abis'
import { 
  getAccount,
  computeAccount,
  createAccount,
  getCreationCode,
  prepareExecuteCall,
  executeCall,
  prepareCreateAccount
} from './functions'
import { 
  AbstractEthersSigner,
  AbstractEthersTransactionResponse,
  SegmentedERC1155Bytecode
} from "./types"
import { chainIdToChain, segmentBytecode } from "./utils"
import { normalize } from "viem/ens"

export const NFTTokenType = {
  ERC721: "ERC721",
  ERC1155: "ERC1155",
} as const
type TokenType = typeof NFTTokenType[keyof typeof NFTTokenType]

type NFTParams = {
  tokenContract: `0x${string}`
  tokenId: string
}

export type TokenboundAccountNFT = NFTParams & {
  chainId: number
}

interface TokenTypeParams {
  tokenType: TokenType
}

export type NFTTransferParams = TokenTypeParams & NFTParams & {
  recipientAddress: `0x${string}`
  account: `0x${string}`
}

export type ETHTransferParams = {
  account: `0x${string}`
  recipientAddress: `0x${string}` // | `${string}.eth`
  amount: number
}

export type ERC20TransferParams = {
  account: `0x${string}`
  recipientAddress: `0x${string}`
  amount: number
  erc20tokenAddress: `0x${string}`
  erc20tokenDecimals: number
}

export type TokenboundClientOptions = {
  chainId: number
  signer?: any
  walletClient?: WalletClient
  publicClient?: PublicClient
  implementationAddress?: `0x${string}`
  registryAddress?: `0x${string}`
}

type Custom6551Implementation = {
  implementationAddress: `0x${string}`
  registryAddress?: `0x${string}`
}

export type TBAccountParams = NFTParams

export type GetAccountParams = TBAccountParams & Partial<Custom6551Implementation>
export type PrepareCreateAccountParams = TBAccountParams & Partial<Custom6551Implementation>
export type CreateAccountParams = TBAccountParams & Partial<Custom6551Implementation>

export type ExecuteCallParams = {
  account: `0x${string}`
  to: `0x${string}`
  value: bigint
  data: string
}

export type PrepareExecuteCallParams = ExecuteCallParams

export type ComputeAccountParams = TBAccountParams & {
  chainId: number
} & Partial<Custom6551Implementation>

export type GetCreationCodeParams = {
  implementation_: `0x${string}`
  chainId_: number
  tokenContract_: string
  tokenId_: string
  salt_: string
}

export type BytecodeParams = {
  accountAddress: `0x${string}`
}

class TokenboundClient {
  private chainId: number
  public isInitialized: boolean = false
  private publicClient: PublicClient
  private signer?: AbstractEthersSigner
  private walletClient?: WalletClient
  private implementationAddress?: `0x${string}`
  private registryAddress?: `0x${string}`

  constructor(options: TokenboundClientOptions) {

    const { chainId, signer, walletClient, publicClient, implementationAddress, registryAddress } = options

    if(!chainId) {
      throw new Error("chainId is required.")
    }

    if (signer && walletClient) {
      throw new Error("Only one of `signer` or `walletClient` should be provided.")
    }
    
    this.chainId = chainId

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

    this.publicClient = publicClient ??
    createPublicClient({
      chain: chainIdToChain(this.chainId),
      transport: http(),
    })
  
    this.isInitialized = true

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
      return computeAccount(tokenContract, tokenId, this.chainId, implementation, registry)
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

    return prepareCreateAccount(tokenContract, tokenId, this.chainId, implementation, registry)
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

      if(this.signer) { // Ethers
        const prepareCreateAccount = await this.prepareCreateAccount({
          tokenContract,
          tokenId,
          implementationAddress: implementation,
          registryAddress: registry
        })

        txHash = await this.signer.sendTransaction(prepareCreateAccount).then((tx:AbstractEthersTransactionResponse) => tx.hash) as `0x${string}`

      }
      else if(this.walletClient) {
        txHash = await createAccount(tokenContract, tokenId, this.walletClient)
      }
      
      if(txHash){
        return computeAccount(tokenContract, tokenId, this.chainId, implementation, registry)
      }
      
      else {
        throw new Error("No wallet client or signer available.")
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
 * @returns a Promise with prepared transaction to execute a call on a tokenbound account. Can be sent via `sendTransaction` on an Ethers signer or viem WalletClient.
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
 * @param {string} params.to The recipient address
 * @param {bigint} params.value The value to send, in wei
 * @param {string} params.data The data to send
 * @returns a Promise that resolves to the transaction hash of the executed call
 */
  public async executeCall(params: ExecuteCallParams): Promise<`0x${string}`> {
    
    const preparedExecuteCall = await this.prepareExecuteCall(params)

    try {
      if(this.signer) { // Ethers
        return await this.signer.sendTransaction(preparedExecuteCall).then((tx: AbstractEthersTransactionResponse) => tx.hash) as `0x${string}`
      }
      else if(this.walletClient) {

        return await this.walletClient.sendTransaction({
          // chain and account need to be added explicitly
          // because they're optional when instantiating a WalletClient
          chain: chainIdToChain(this.chainId),
          account: this.walletClient.account!,
          ...preparedExecuteCall
        })

      }
      else {
        throw new Error("No wallet client or signer available.")
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
  public async checkAccountDeployment({accountAddress}: BytecodeParams): Promise<boolean> {

    try {
      return await this.publicClient.getBytecode({address: accountAddress}).then((bytecode: GetBytecodeReturnType) => bytecode ? bytecode.length > 2: false)
    } catch (error) {
      throw error
    }
  
  }

  /**
   * Deconstructs the bytecode of a tokenbound account into its constituent parts.
   * @param {`0x${string}`} params.accountAddress The address of the tokenbound account.
   * @returns a Promise that resolves to a SegmentedERC1155Bytecode object, or null if the account is not deployed
   */
  public async deconstructBytecode({accountAddress}: BytecodeParams): Promise<SegmentedERC1155Bytecode | null> {

    try {
      const rawBytecode = await this.publicClient.getBytecode({address: accountAddress})
      const bytecode = rawBytecode?.slice(2)

      if(!bytecode || !rawBytecode || !(rawBytecode.length > 2)) return null

      const [
        erc1167Header,
        rawImplementationAddress,
        erc1167Footer,
        rawSalt,
        rawChainId,
        rawTokenContract,
        rawTokenId
      ] = segmentBytecode(bytecode, 10, 20, 15, 32, 32, 32, 32)

      const chainId = hexToNumber(`0x${rawChainId}`, {size: 32})
      const implementationAddress: `0x${string}` = getAddress(`0x${rawImplementationAddress}`)
      const salt = hexToNumber(`0x${rawSalt}`, {size: 32})
      const tokenContract: `0x${string}` = getAddress(`0x${rawTokenContract.slice(rawTokenContract.length - 40, rawTokenContract.length)}`)
      const tokenId = hexToNumber(`0x${rawTokenId}`, {size: 32}).toString()
      
      return {
        erc1167Header,
        implementationAddress,
        erc1167Footer,
        salt,
        tokenId,
        tokenContract,
        chainId
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
  public async getNFT({accountAddress}: BytecodeParams): Promise<TokenboundAccountNFT> {

    try {
    
      const deconstructedBytecode = await this.deconstructBytecode({accountAddress})
      if(!deconstructedBytecode) throw new Error("The tokenbound account has not been deployed at this address")
      
      const { chainId, tokenContract, tokenId } = deconstructedBytecode

      return {
        tokenContract,
        tokenId,
        chainId
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
   * @returns a Promise that resolves to the transaction hash of the executed call
   */
  public async transferNFT(params: NFTTransferParams): Promise<`0x${string}`> {
    const { 
      account: tbAccountAddress, 
      tokenType,
      tokenContract,
      tokenId,
      recipientAddress
    } = params

    const is1155: boolean = tokenType === NFTTokenType.ERC1155

    // Configure required args based on token type
    const transferArgs: unknown[] = is1155
      ? [
          // ERC1155: safeTransferFrom(address,address,uint256,uint256,bytes)
          tbAccountAddress,
          recipientAddress,
          tokenId,
          1,
          '0x',
        ]
      : [
          // ERC721: safeTransferFrom(address,address,uint256)
          tbAccountAddress,
          recipientAddress,
          tokenId,
        ]

    const transferCallData = encodeFunctionData({
      abi: is1155 ? erc1155Abi : erc721Abi,
      functionName: 'safeTransferFrom',
      args: transferArgs,
    })

    const unencodedExecuteCall = {
      abi: erc6551AccountAbi as Abi,
      functionName: "executeCall",
      args: [
        tokenContract, 0, transferCallData
      ],
    }

    try {

      if(this.signer) { // Ethers

        const preparedNFTTransfer = {
          to: tbAccountAddress,
          value: BigInt(0),
          data: encodeFunctionData(unencodedExecuteCall),
        }

        return await this.signer.sendTransaction(preparedNFTTransfer).then((tx:AbstractEthersTransactionResponse) => tx.hash) as `0x${string}`
      
      }
      else if(this.walletClient) {

        const { request } = await this.publicClient.simulateContract({
          address: getAddress(tbAccountAddress),
          account: this.walletClient.account,
          ...unencodedExecuteCall
        })

        return await this.walletClient.writeContract(request)
      }
      else {
        throw new Error("No wallet client or signer available.")
      }  

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
    const { 
      account: tbAccountAddress, 
      amount,
      recipientAddress
    } = params

    const weiValue = parseUnits(`${amount}`, 18) // convert ETH to wei

    let recipient = getAddress(recipientAddress)
    
    // const isENS = recipientAddress.endsWith(".eth")
    // @BJ todo: debug
    // if (isENS) {
    //   recipient = await this.publicClient.getEnsResolver({name: normalize(recipientAddress)})
    //   if (!recipient) {
    //       throw new Error('Failed to resolve ENS address');
    //   }
    // }
    // console.log('RECIPIENT_ADDRESS', recipient)

    try {

      if(this.signer) { // Ethers

        const unencodedTransferETHExecuteCall = {
          abi: erc6551AccountAbi,
          functionName: 'executeCall',
          args: [recipient, weiValue, '0x'],
        }

        const preparedETHTransfer = {
          to: tbAccountAddress,
          value: BigInt(0),
          data: encodeFunctionData(unencodedTransferETHExecuteCall),
        }

        return await this.signer.sendTransaction(preparedETHTransfer).then((tx:AbstractEthersTransactionResponse) => tx.hash) as `0x${string}`
      
      }
      else if(this.walletClient) {
        
        // console.log('PUBLIC_CLIENT', this.publicClient)
        // const { request } = await this.publicClient.simulateContract({

        const txHash = await this.executeCall({
          account: tbAccountAddress,
          to: recipient,
          value: weiValue,
          data: '0x'
        })

          // const { request, result } = await this.publicClient.simulateContract({
          //   address: getAddress(tbAccountAddress),
          //   account: this.walletClient.account,
  
          //   ...unencodedTransferETHExecuteCall
          // })
          // console.log('SIMULATE ETH TRANSFER REQUEST', request)
          // console.log('SIMULATE ETH TRANSFER RESULT', result)
        // } catch(err) {
          // if (err instanceof BaseError) {
          //   const revertError = err.walk(err => err instanceof ContractFunctionRevertedError)
          //   if (revertError instanceof ContractFunctionRevertedError) {
          //     const errorName = revertError.data?.errorName ?? ''
          //     console.log('ERROR NAME', errorName)
          //     console.log('REVERT ERROR DATA', revertError)
          //     // do something with `errorName`
          //   }
          // }
        // }

        return txHash

        // return await this.walletClient.writeContract(request)
        // return '0x'
      }
      else {
        throw new Error("No wallet client or signer available.")
      }

    } catch (error) {
      console.log(error)
      throw error
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

    if(erc20tokenDecimals < 0 || erc20tokenDecimals > 18) throw new Error("Decimal value out of range. Should be between 0 and 18.")

    const amountBaseUnit = parseUnits(`${amount}`, erc20tokenDecimals)

    const recipient = recipientAddress.endsWith(".eth")
      ? await this.publicClient.getEnsResolver({name: normalize(recipientAddress)})
      : recipientAddress

    const callData = encodeFunctionData({
      abi: erc20Abi,
      functionName: 'transfer',
      args: [recipient, amountBaseUnit],
    })

    const unencodedTransferERC20ExecuteCall = {
      abi: erc6551AccountAbi,
      functionName: 'executeCall',
      args: [erc20tokenAddress, 0, callData],
    }

    try {

      if(this.signer) { // Ethers

        const preparedERC20Transfer = {
          to: tbAccountAddress,
          value: BigInt(0),
          data: encodeFunctionData(unencodedTransferERC20ExecuteCall),
        }

        return await this.signer.sendTransaction(preparedERC20Transfer).then((tx:AbstractEthersTransactionResponse) => tx.hash) as `0x${string}`
      
      }
      else if(this.walletClient) {
        const { request } = await this.publicClient.simulateContract({
          address: getAddress(tbAccountAddress),
          account: this.walletClient.account,
          ...unencodedTransferERC20ExecuteCall
        })

        return await this.walletClient.writeContract(request)
      }
      else {
        throw new Error("No wallet client or signer available.")
      }  

    } catch (error) {
      console.log(error)
      throw error
    }
  }

}

export { 
  TokenboundClient,
  erc6551AccountAbi, 
  erc6551RegistryAbi,
  getAccount,
  createAccount,
  getCreationCode,
  computeAccount,
  prepareExecuteCall,
  executeCall
}