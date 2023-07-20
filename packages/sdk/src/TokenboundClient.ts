import { WalletClient, encodeFunctionData, 
  // getContract,
  // Abi,
} from "viem"
import { erc6551AccountAbi, erc6551RegistryAbi, erc1155Abi, erc721Abi } from '../abis'
import { 
  getAccount,
  computeAccount,
  createAccount,
  getCreationCode,
  prepareExecuteCall,
  executeCall,
  prepareCreateAccount
} from './functions'
import { AbstractEthersSigner, AbstractEthersTransactionResponse } from "./types"
import { chainIdToChain } from "./utils"

type TokenType = "ERC721" | "ERC1155"

type NFTParams = {
  tokenContract: `0x${string}`
  tokenId: string
}

interface TokenTypeParams {
  tokenType: TokenType
}

export type NFTTransferParams = TokenTypeParams & NFTParams & {
  recipientAddress: `0x${string}`
  account: `0x${string}`
  data: string
}

export type TokenboundClientOptions = {
  chainId: number
  signer?: any
  walletClient?: WalletClient
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

class TokenboundClient {
  private chainId: number
  public isInitialized: boolean = false
  private signer?: AbstractEthersSigner
  private walletClient?: WalletClient
  private implementationAddress?: `0x${string}`
  private registryAddress?: `0x${string}`

  constructor(options: TokenboundClientOptions) {

    if(!options.chainId) {
      throw new Error("chainId is required.")
    }

    if (options.signer && options.walletClient) {
      throw new Error("Only one of `signer` or `walletClient` should be provided.")
    }
    
    this.chainId = options.chainId

    if (options.signer) {
      this.signer = options.signer
    } else if (options.walletClient) {
      this.walletClient = options.walletClient
    }

    if (options.implementationAddress) {
      this.implementationAddress = options.implementationAddress
    }
    if (options.registryAddress) {
      this.registryAddress = options.registryAddress
    }

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
    const { tokenContract, tokenId, implementationAddress, registryAddress } = params;
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
 * @returns a Promise that resolves to the transaction hash of the transaction that created the tokenbound account.
 */
  public async createAccount(params: CreateAccountParams): Promise<`0x${string}`> {
    const { tokenContract, tokenId, implementationAddress, registryAddress } = params
    const implementation = implementationAddress ?? this.implementationAddress
    const registry = registryAddress ?? this.registryAddress

    try {
      if(this.signer) { // Ethers
        const prepareCreateAccount = await this.prepareCreateAccount({
          tokenContract: tokenContract as `0x${string}`,
          tokenId: tokenId,
          implementationAddress: implementation,
          registryAddress: registry
        })

        // Extract the txHash from the TransactionResponse
        return await this.signer.sendTransaction(prepareCreateAccount).then((tx:AbstractEthersTransactionResponse) => tx.hash) as `0x${string}`

      }
      else if(this.walletClient) {
        return createAccount(tokenContract, tokenId, this.walletClient)
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
    const { account, to, value, data } = params

    // Prepare the transaction
    const preparedExecuteCall =  await this.prepareExecuteCall({
      account: account,
      to: to,
      value: value,
      data: data
    })

    try {
      if(this.signer) { // Ethers
        // Extract the txHash from the TransactionResponse
        return  await this.signer.sendTransaction(preparedExecuteCall).then((tx: AbstractEthersTransactionResponse) => tx.hash) as `0x${string}`
      }
      else if(this.walletClient) {
        return await this.walletClient.sendTransaction({
          // chain and account need to be added explicitly
          // because they're optional when instantiating a WalletClient
          chain: chainIdToChain(this.chainId),
          account: account as `0x${string}`,
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
   * Executes a transaction call on a tokenbound account
   * @param {string} params.account The tokenbound account address
   * @param {string} params.tokenType The type of token, either 'ERC721' or 'ERC1155'
   * @param {string} params.tokenContract The address of the token contract
   * @param {string} params.tokenId The token ID
   * @param {string} params.recipientAddress The address to which the token should be transferred
   * @param {string} params.data The data to send
   * @returns a Promise that resolves to the transaction hash of the executed call
   */
  public async transferNFT(params: NFTTransferParams): Promise<`0x${string}`> {
    const { account, 
      // to, value,
      tokenType,
      tokenContract,
      tokenId,
      recipientAddress
    } = params

    const is1155: boolean = tokenType === 'ERC1155'

    // Configure required args based on token type
    const transferArgs: unknown[] = is1155 ?
    [
      // ERC1155: safeTransferFrom(address,address,uint256,uint256,bytes)
      account,
      recipientAddress,
      tokenId,
      1,
      '0x'
    ] : [
      // ERC721: safeTransferFrom(address,address,uint256)
      account,
      recipientAddress,
      tokenId
    ] 

    const callData = encodeFunctionData({
      abi: is1155 ? erc1155Abi : erc721Abi,
      functionName: 'safeTransferFrom',
      args: transferArgs
    })

    const preparedTransaction = {
      to: tokenContract,
      data: callData
    }

    // return contract.write.executeCall([
    //   recipientAddress as `0x${string}`,
    //   0n,
    //   callData as `0x${string}`,
    // ])
    

    // const result = await accountContract.executeCall(
    //   populatedTransfer.to,
    //   0,
    //   populatedTransfer.data
    // )


    // {
    //   to: account as `0x${string}`,
    //   value,
    //   data: encodeFunctionData({
    //     abi: erc6551AccountAbi,
    //     functionName: "executeCall",
    //     args: [
    //       to as `0x${string}`,
    //       value,
    //       data as `0x${string}`
    //     ],
    //   }),
    // }


    // Prepare the transaction
    // const preparedTransferCall =  await this.prepareExecuteCall({
    //   account: account,
    //   // to: to,
    //   to: recipientAddress,
    //   value: 0n,
    //   data: callData
    // }) // The issue with using prepareExecuteCall is that the tokenContract is never used

    try {

      if(this.signer) { // Ethers
        // Extract the txHash from the TransactionResponse
        // return  await this.signer.sendTransaction(preparedTransferCall).then((tx: AbstractEthersTransactionResponse) => tx.hash) as `0x${string}`
        return  await this.signer.sendTransaction(preparedTransaction).then((tx: AbstractEthersTransactionResponse) => tx.hash) as `0x${string}`
      }
      else if(this.walletClient) {

        // ↓↓↓↓↓↓ Mimics tb.org implementation

        // const nftContract = getContract({
        //   abi: is1155 ? erc1155Abi as Abi : erc721ABI,
        //   address: tokenContract,
        //   walletClient: this.walletClient,
        //   // @BJ: how to do this for ethers?
        // })
        
        // return await nftContract.write.executeCall([
        //   recipientAddress as `0x${string}`,
        //   0n,
        //   callData as `0x${string}`,
        // ])

        // ↑↑↑↑↑↑ Mimics tb.org implementation

        return await this.walletClient.sendTransaction({
          // chain and account need to be added explicitly
          // because they're optional when instantiating a WalletClient
          chain: chainIdToChain(this.chainId),
          account: account as `0x${string}`,
          // ...preparedTransferCall
          ...preparedTransaction
        })

      }
      else {
        throw new Error("No wallet client or signer available.")
      }  
    } catch (error) {
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