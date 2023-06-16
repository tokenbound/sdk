import { PublicClient, WalletClient,createPublicClient, http } from "viem"
// import { mainnet } from 'viem/chains'
// import * as chains from '@wagmi/chains'
import * as all from "viem/chains"

import { erc6551AccountAbi, erc6551RegistryAbi } from '../abis'
import { 
  getAccount,
  computeAccount,
  createAccount,
  getCreationCode,
  prepareExecuteCall,
  executeCall,
  prepareCreateAccount
} from './functions'
import { loadEthersImplementation } from "./loaders"
import { AbstractBigNumber, AbstractEthersSigner } from "./types"

export type TokenboundClientOptions = {
  signer?: any
  walletClient?: WalletClient
}

export type GetAccountParams = {
  tokenContract: string
  tokenId: string
}

export type PrepareCreateAccountParams = {
  tokenContract: `0x${string}`
  tokenId: string
  // chainId: number
}

export type CreateAccountParams = {
  tokenContract: string
  tokenId: string
}

export type PrepareExecuteCallParams = {
  account: string
  to: string
  value: bigint
  data: string
}

export type ExecuteCallParams = {
  account: string
  to: string
  value: bigint
  data: string
}

export type ComputeAccountParams = {
  tokenContract: `0x${string}`
  tokenId: string
  chainId: number
}

export type GetCreationCodeParams = {
  implementation_: `0x${string}`
  chainId_: number
  tokenContract_: string
  tokenId_: string
  salt_: string
}

/**
 * Gets the chain object for the given chain id.
 * @param chainId - Chain id of the target EVM chain.
 * @returns Viem's chain object.
 */
function getChain(chainId: number) {
  for (const chain of Object.values(all)) {
    if (chain.id === chainId) {
      return chain;
    }
  }

  throw new Error(`Chain with id ${chainId} not found`);
}

class TokenboundClient {
  private signer?: AbstractEthersSigner
  private walletClient?: WalletClient
  private publicClient: PublicClient | null

  constructor(options: TokenboundClientOptions) {

    this.publicClient = null


    if (options.signer && options.walletClient) {
      throw new Error("Only one of `signer` or `walletClient` should be provided.")
    }

    if (options.signer) {
      this.signer = options.signer
    } else if (options.walletClient) {
      this.walletClient = options.walletClient
    } else {
      throw new Error("Either `signer` or `walletClient` must be provided.")
    }


    this.initialize()

  }

  private async initialize() {

      // Initialize public client
      // Need to get chain from walletClient or signer

      // How to get chain from signer?:
      // const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');
      // const signer = provider.getSigner();

      // @BJ TODO: Ask Jayden about approach: should we just pass in chain/chainId?
      // or optional RPC provider? // defaultProvider, fallback to alchemy or infura?

      console.log('ALL', all)

      const chain = this.walletClient?.chain ?? await this.signer?.getChainId().then((chainId: number) => getChain(chainId))
      
      console.log('CHAIN', chain)

      this.publicClient = createPublicClient({ 
        chain: chain,
        transport: http()
      })

  }

  public async getAccount(params: GetAccountParams): Promise<`0x${string}`> {
    const { tokenContract, tokenId } = params
    if (!this.publicClient) {
      throw new Error("No public client available.")
    }

    return getAccount(tokenContract, tokenId, this.publicClient)
    // return getAccount(tokenContract, tokenId, client)
  }

  public async prepareCreateAccount(params: PrepareCreateAccountParams): Promise<{
    to: `0x${string}`
    value: bigint | AbstractBigNumber
    data: string
    
  // TODO: what should return type be? Need to account for both Viem and Ethers
    // @BJ TODO: Confirm types for Viem and Ethers sendTransaction
    // value: BigNumber (Ethers) or bigint (Viem)

    // return bigint by default, but if ethers, return AbstractBigNumber
    // how to do this?


  }> {
    const { tokenContract, tokenId } = params
    const { signer } = this
    const chainId = await this.walletClient?.getChainId()

    if(!chainId) {
      throw new Error("Missing chainId.")
    }

    if(signer) { // Ethers version
      const { ethersPrepareCreateAccount } = await loadEthersImplementation()
      return await ethersPrepareCreateAccount(tokenContract, tokenId, chainId)
    }

    return prepareCreateAccount(tokenContract, tokenId, chainId)
  }

  public async createAccount(params: CreateAccountParams): Promise<`0x${string}`> {
    const { tokenContract, tokenId } = params
    const { walletClient, signer } = this

    if (!walletClient || !signer) {
      throw new Error("No wallet client available.")
    }

    if(signer) { // Ethers version
      const { ethersCreateAccount } = await loadEthersImplementation()
      return await ethersCreateAccount(tokenContract,tokenId, signer)
    }

    return createAccount(tokenContract, tokenId, walletClient)
  }

  public async prepareExecuteCall(params: PrepareExecuteCallParams): Promise<{
    to: `0x${string}`
    value: bigint
    data: `0x${string}`
  }> {
    const { account, to, value, data } = params
    return prepareExecuteCall(account, to, value, data)
  }

  public async executeCall(params: ExecuteCallParams): Promise<`0x${string}`> {
    const { account, to, value, data } = params
    const {walletClient, signer} = this

    if (!walletClient || !signer) {
      throw new Error("No wallet client available.")
    }

    if(signer) { // Ethers version
      const { ethersExecuteCall } = await loadEthersImplementation()
      return await ethersExecuteCall(account, to, value, data, signer)
    }

    return executeCall(account, to, value, data, walletClient)
  }

  public computeAccount(params: ComputeAccountParams): `0x${string}` {
    const { tokenContract, tokenId, chainId } = params
    return computeAccount(tokenContract, tokenId, chainId)
  }

  public getCreationCode(params: GetCreationCodeParams): Uint8Array {
    const { implementation_, chainId_, tokenContract_, tokenId_, salt_ } = params
    return getCreationCode(implementation_, chainId_, tokenContract_, tokenId_, salt_)
  }
  
}

export { 
  TokenboundClient,
  erc6551AccountAbi, 
  erc6551RegistryAbi,
  getAccount,
  computeAccount,
  createAccount,
  getCreationCode,
  prepareExecuteCall,
  executeCall
}