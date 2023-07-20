import { WalletClient, encodeFunctionData, getContract, Abi } from "viem"
import { erc721ABI } from "wagmi"
import { erc6551AccountAbi, erc6551RegistryAbi, erc1155Abi } from '../abis'
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
// import ACCOUNT_ABI from "../abis/IERC6551Account.json";
// import {erc6551AccountAbi} from "../abis/";

type NFTParams = {
  tokenContract: `0x${string}`
  tokenId: string
}

type TokenType = "ERC721" | "ERC1155"

interface TokenTypeParams {
  tokenType: TokenType
}

type NFTTransferParams = TokenTypeParams & NFTParams & {
  recipientAddress: `0x${string}`
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

export type ExecuteTransferParams = ExecuteCallParams & NFTTransferParams

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
 * Returns a hash of the transaction that executed a call on a tokenbound account
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

  


  
  public async transferNFT(params: ExecuteTransferParams): Promise<`0x${string}`> {
    const { account, 
      // to, value,
      tokenType,
      recipientAddress,
      tokenContract,
      tokenId
    } = params

    const is1155: boolean = tokenType === 'ERC1155'

    const transferArgs: readonly unknown[] = is1155 ?
    [
      account,
      recipientAddress,
      tokenId,
      1,
      '0x'
    ] : [
      account,
      recipientAddress,
      tokenId
    ] 

    const callData = encodeFunctionData({
      abi: is1155 ? erc1155Abi as Abi : erc721ABI,
      functionName: 'safeTransferFrom',
      // 'safeTransferFrom(address,address,uint256,uint256,bytes)' // ERC1155
      // 'safeTransferFrom(address,address,uint256)' // ERC721
      args: transferArgs
    })



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
    const preparedTransferCall =  await this.prepareExecuteCall({
      account: account,
      // to: to,
      to: recipientAddress,
      value: 0n,
      data: callData
    })

    try {


 
      if(this.signer) { // Ethers
        // Extract the txHash from the TransactionResponse
        return  await this.signer.sendTransaction(preparedTransferCall).then((tx: AbstractEthersTransactionResponse) => tx.hash) as `0x${string}`
      }
      else if(this.walletClient) {

        const nftContract = getContract({
          ...{ 
            abi: is1155 ? erc1155Abi as Abi : erc721ABI,
            address: tokenContract
          },
          walletClient: this.walletClient,
          // @BJ: how to do this for ethers?
        })
        
        return await nftContract.write.executeCall([
          recipientAddress as `0x${string}`,
          0n,
          callData as `0x${string}`,
        ])


        // return await this.walletClient.sendTransaction({
        //   // chain and account need to be added explicitly
        //   // because they're optional when instantiating a WalletClient
        //   chain: chainIdToChain(this.chainId),
        //   account: account as `0x${string}`,
        //   ...preparedTransferCall
        // })

      }
      else {
        throw new Error("No wallet client or signer available.")
      }  
    } catch (error) {
      throw error
    }
  }


  // const { trigger: triggerNftTransfer } = useSWRMutation(
  //   `/${accountAddress}/nftTransfer`,
  //   async (_, { arg }) => {
  //     let populatedTransfer

  //     if (arg.tokenType === NftTokenType.ERC1155) {
  //       const erc1155Contract = new ethers.Contract(
  //         arg.tokenContract,
  //         erc1155ABI,
  //         signer
  //       )
  //       populatedTransfer = await erc1155Contract.populateTransaction[
  //         'safeTransferFrom(address,address,uint256,uint256,bytes)'
  //       ](accountAddress, arg.recipientAddress, arg.tokenId, 1, '0x')
  //     } else {
  //       // default to nft transfer
  //       const erc721Contract = new ethers.Contract(
  //         arg.tokenContract,
  //         erc721ABI,
  //         signer
  //       )
  //       populatedTransfer = await erc721Contract.populateTransaction[
  //         'safeTransferFrom(address,address,uint256)'
  //       ](accountAddress, arg.recipientAddress, arg.tokenId)
  //     }

  //     const accountContract = new ethers.Contract(
  //       accountAddress,
  //       erc6551AccountAbi,
  //       signer
  //     )

  //     const result = await accountContract.executeCall(
  //       populatedTransfer.to,
  //       0,
  //       populatedTransfer.data
  //     )

  //     return await result.wait()
  //   }
  // )




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