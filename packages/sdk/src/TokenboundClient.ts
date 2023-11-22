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
  isAddressEqual,
  numberToHex,
  multicall3Abi,
  createWalletClient,
  custom,
} from 'viem'
// import { privateKeyToAccount } from 'viem/accounts'
import { erc1155Abi, erc721Abi, erc20Abi } from '../abis'
import {
  getAccount,
  computeAccount,
  createAccount,
  getCreationCode,
  prepareExecuteCall,
  executeCall,
  prepareCreateAccount,
  getTokenboundV3Account,
  prepareCreateTokenboundV3Account,
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
  TBVersion,
  PrepareCreateAccountParams,
  PrepareExecuteCallParams,
  SegmentedERC6551Bytecode,
  TokenboundAccountNFT,
  TokenboundClientOptions,
  EthersSignableMessage,
  ExecuteParams,
  CALL_OPERATIONS,
  PrepareExecutionParams,
  ValidSignerParams,
  MultiCallTx,
} from './types'
import {
  chainIdToChain,
  segmentBytecode,
  normalizeMessage,
  isEthers5SignableMessage,
  isEthers6SignableMessage,
  isViemSignableMessage,
  resolvePossibleENS,
  getImplementationName,
  ethersWalletToAccount,
} from './utils'
import { ERC_6551_DEFAULT, ERC_6551_LEGACY_V2, MULTICALL_ADDRESS } from './constants'
import { version as TB_SDK_VERSION } from '../package.json'

declare global {
  interface Window {
    tokenboundSDK?: string
  }
}

class TokenboundClient {
  private chainId: number
  public isInitialized: boolean = false
  public publicClient: PublicClient
  private supportsV3: boolean = true // Default to V3 implementation
  private signer?: AbstractEthersSigner
  private walletClient?: WalletClient
  private implementationAddress: `0x${string}`
  private registryAddress: `0x${string}`

  // private eip1193Bridge:any

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
      version,
      eip1193Bridge,
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

    this.chainId = chainId ?? chain!.id

    if (signer) {
      // this.signer = signer
      // const signerToWalletClient = createWalletClient({
      //   transport: custom(signer.provider.provider as any),
      //   chain,
      //   account: signer._address,
      //   pollingInterval: 100,
      // })
      // this.walletClient = signerToWalletClient
      // const account = ethersWalletToAccount(signer)

      const walletClient = createWalletClient({
        transport: custom(eip1193Bridge),
        // account,
        account: signer.address ?? signer._address,
        chain: chain ?? chainIdToChain(this.chainId),
      })

      this.walletClient = walletClient
    } else if (walletClient) {
      this.walletClient = walletClient
    }

    // Use a custom publicClient if provided
    // Otherwise create a new one, specifying a custom RPC URL if provided but defaulting to the default viem http() RPC URL
    this.publicClient =
      publicClient ??
      createPublicClient({
        chain: chain ?? chainIdToChain(this.chainId),
        transport: http(publicClientRPCUrl ?? undefined),
      })

    this.registryAddress = registryAddress ?? ERC_6551_DEFAULT.REGISTRY.ADDRESS
    this.implementationAddress =
      implementationAddress ?? ERC_6551_DEFAULT.ACCOUNT_PROXY!.ADDRESS

    // If legacy V2 implementation is in use, use V2 registry (unless custom registry is provided)
    const isV2 =
      (version && version === TBVersion.V2) ||
      (implementationAddress &&
        isAddressEqual(implementationAddress, ERC_6551_LEGACY_V2.IMPLEMENTATION.ADDRESS))

    if (isV2) {
      this.supportsV3 = false
      if (!registryAddress) this.registryAddress = ERC_6551_LEGACY_V2.REGISTRY.ADDRESS
    }

    this.isInitialized = true

    if (typeof window !== 'undefined') {
      const implementationName = getImplementationName(implementationAddress)
      window.tokenboundSDK = `Tokenbound SDK ${TB_SDK_VERSION} - ${implementationName}`
    }
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
  public getAccount(params: GetAccountParams): `0x${string}` {
    const { tokenContract, tokenId, chain, salt = 0 } = params

    // V3 implementations can override client's chainId to enable cross-chain account deployment
    const chainIdForGetAcct = chain && this.supportsV3 ? chain.id : this.chainId

    try {
      const getAcct = this.supportsV3 ? getTokenboundV3Account : computeAccount
      return getAcct(
        tokenContract,
        tokenId,
        chainIdForGetAcct,
        this.implementationAddress,
        this.registryAddress,
        salt
      )
    } catch (error) {
      throw error
    }
  }

  /**
   * Returns the prepared transaction to create a tokenbound account for a given token contract and token ID.
   * @param {`0x${string}`} params.tokenContract The address of the token contract.
   * @param {string} params.tokenId The token ID.
   * @returns The prepared transaction to create a tokenbound account. Can be sent via `sendTransaction` on an Ethers signer or viem WalletClient.
   */
  public async prepareCreateAccount(params: PrepareCreateAccountParams): Promise<
    | MultiCallTx
    | {
        to: `0x${string}`
        value: bigint
        data: `0x${string}`
      }
  > {
    const { tokenContract, tokenId, chain, salt = 0 } = params

    if (chain && !this.supportsV3) {
      throw new Error('V2 does not support cross-chain account creation.')
    }

    // V3 implementations can override client's chainId to enable cross-chain account deployment
    const createWithChainId = chain && this.supportsV3 ? chain.id : this.chainId

    const getAcct = this.supportsV3 ? getTokenboundV3Account : computeAccount

    const computedAcct = getAcct(
      tokenContract,
      tokenId,
      createWithChainId,
      this.implementationAddress,
      this.registryAddress,
      salt
    )

    const isCustomImplementation = ![
      ERC_6551_DEFAULT.ACCOUNT_PROXY!.ADDRESS,
      ERC_6551_DEFAULT.IMPLEMENTATION.ADDRESS,
    ].includes(getAddress(this.implementationAddress))

    const prepareBasicCreateAccount = this.supportsV3
      ? prepareCreateTokenboundV3Account
      : prepareCreateAccount

    chain && console.log('PRE-PREPARE')

    const preparedImplAgnosticCreation = await prepareBasicCreateAccount(
      tokenContract,
      tokenId,
      createWithChainId,
      this.implementationAddress,
      this.registryAddress,
      salt
    )

    chain &&
      console.log('PREPARED CREATE ACCOUNT PRE-INIT: ', preparedImplAgnosticCreation)

    if (isCustomImplementation) {
      // Don't initialize for custom implementations. Allow third-party handling of initialization.
      return preparedImplAgnosticCreation
    } else {
      // For standard implementations, use the multicall3 aggregate function to create and initialize the account in one transaction
      return {
        to: MULTICALL_ADDRESS,
        value: BigInt(0),
        chainId: createWithChainId, // just a test for ethers
        data: encodeFunctionData({
          abi: multicall3Abi,
          functionName: 'aggregate3',
          args: [
            [
              {
                target: this.registryAddress,
                allowFailure: false,
                callData: preparedImplAgnosticCreation.data,
              },
              {
                target: computedAcct,
                allowFailure: false,
                callData: encodeFunctionData({
                  abi: ERC_6551_DEFAULT.ACCOUNT_PROXY?.ABI!,
                  functionName: 'initialize',
                  args: [ERC_6551_DEFAULT.IMPLEMENTATION!.ADDRESS],
                }),
              },
            ],
          ],
        }),
      } as MultiCallTx
    }
  }

  /**
   * Returns the transaction hash of the transaction that created the tokenbound account for a given token contract and token ID.
   * @param {`0x${string}`} params.tokenContract The address of the token contract.
   * @param {string} params.tokenId The token ID.
   * @returns a Promise that resolves to the account address of the created tokenbound account.
   */
  public async createAccount(
    params: CreateAccountParams
  ): Promise<{ account: `0x${string}`; txHash: `0x${string}` }> {
    const { tokenContract, tokenId, chain, provider, salt = 0 } = params

    if (chain && !this.supportsV3) {
      throw new Error('V2 does not support cross-chain account creation.')
    }

    // V3 implementations can override client's chainId to enable cross-chain account deployment
    const createWithChainId = chain && this.supportsV3 ? chain.id : this.chainId

    chain && console.log('CUSTOM CHAIN: ', chain.id)

    try {
      let txHash: `0x${string}` | undefined

      const getAcct = this.supportsV3 ? getTokenboundV3Account : computeAccount

      let preparedCreateAccount = await this.prepareCreateAccount({
        tokenContract,
        tokenId,
        // chain: chain ?? undefined,
        chain,
        salt,
      })

      chain && console.log('POST-PREPARE: ', preparedCreateAccount)

      let signerL2

      if (this.signer) {
        // @BJ: can set anyNetwork: true on the provider (in useEthersSigner) to allow for any chainId
        // if (chain || provider) {
        if (chain) {
          const account = ethersWalletToAccount(this.signer)
          console.log('signer', this.signer, this.signer.address, account)
          const signerToWalletClient = createWalletClient({
            // transport: custom(this.signer.provider.provider as any), // works in Ethers 5, seemingly missing provider.request in Ethers6

            // Ethers5: has signer.provider.provider.request

            // transport: custom(this.signer.provider.provider as any),
            transport: custom(this.signer.provider as any),
            // transport: custom(window.ethereum),

            // transport: http(),
            chain,
            // account: this.signer._address,
            account,
            // pollingInterval: 100,
          })

          // const account = privateKeyToAccount(this.signer.privateKey)

          // const signerToWalletClient = createWalletClient({
          //   account,
          //   chain,
          //   transport: http(),
          // })

          // const signerToWalletClient = createWalletClient({
          //   transport: custom(this.signer.provider.provider as any),
          // })

          console.log('new.walletClient', signerToWalletClient)
          await signerToWalletClient.addChain({ chain: chain })
          await signerToWalletClient.switchChain({ id: chain.id })

          txHash = await signerToWalletClient.sendTransaction({
            ...preparedCreateAccount,
            chain: chainIdToChain(createWithChainId),
            // chain: chainIdToChain(this.chainId),
            // chain: The target chain. If there is a mismatch between the wallet's current chain & the target chain, an error will be thrown.

            account: signerToWalletClient?.account?.address!,
          })

          // if (chain) {
          // await this.signer.provider?.request({
          //   method: 'wallet_addEthereumChain',
          //   params: [chain],
          // })

          // const newChainRPCUrl = chain.rpcUrls.default.http[0] // or chain.rpcUrls.public.http[0]?

          // Create new provider + connect to the chain:
          // new ethers.providers.JsonRpcProvider(ANVIL_RPC_URL) // ethers6
          // const ethers6Provider = new JsonRpcProvider(ANVIL_RPC_URL) // ethers5
          // this.signer.connect(chain.id)

          // this.signer.provider.on('chainChanged', (chainId: number) =>
          //   // console.log('RESP', resp)
          //   console.log(`chain changed to ${chainId}! updating providers`)
          // )

          // this.signer.connect({ chainId: chain.id, url: newChainRPCUrl })
          // await this.signer.connect(provider)

          // Construct a new signer for Layer 2 by using the L2 chainId.
          // signerL2 = await this.signer.connectUnchecked({
          //   chainId: chain.id,
          // })

          // if (typeof window !== 'undefined' && 'ethereum' in window && 'request' in window.ethereum) {

          // await window.ethereum!.request({
          //   method: 'wallet_switchEthereumChain',
          //   params: [{ chainId: '0x13881' }],    // chainId must be in HEX with 0x in front
          //   });
          // }

          // this.signer.network

          // preparedCreateAccount = { chainId: chain.id, ...preparedCreateAccount }
          console.log(
            'AFTER ADDING CHAIN ID',
            preparedCreateAccount,
            // await this.signer.provider.getNetwork(),
            provider,
            signerL2 //  has anyNetwork: true on the provider, but no chainId is evident
          )
          console.log('L1', this.signer)

          console.log(
            'L2',
            signerL2 //  has anyNetwork: true on the provider, but no chainId is evident
          )
        }

        const signerOrL2 = signerL2 ?? this.signer

        txHash = (await signerOrL2
          .sendTransaction(preparedCreateAccount)
          .then((tx: AbstractEthersTransactionResponse) => tx.hash)) as `0x${string}`
        // txHash = (await this.signer
        //   .sendTransaction(preparedCreateAccount)
        //   .then((tx: AbstractEthersTransactionResponse) => tx.hash)) as `0x${string}`
      } else if (this.walletClient) {
        // switch chains if a chain is specified

        console.log('this.walletClient', this.walletClient)
        if (chain) {
          await this.walletClient.addChain({ chain })
          await this.walletClient.switchChain({ id: chain.id })

          // MethodNotFoundRpcError: The method does not exist / is not available.
          // URL: http://127.0.0.1:8545
          // Request body: {"method":"wallet_addEthereumChain","params":[{"chainId":"0x76adf1","chainName":"Zora","nativeCurrency":{"decimals":18,"name":"Ether","symbol":"ETH"},"rpcUrls":["https://rpc.zora.energy"],"blockExplorerUrls":["https://explorer.zora.energy"]}]}

          console.log('this.walletClient.chain', this.walletClient.chain)
        }
        console.log('preparedCREATE', preparedCreateAccount)
        txHash = this.supportsV3
          ? await this.walletClient.sendTransaction({
              ...preparedCreateAccount,
              chain: chainIdToChain(createWithChainId),
              // chain: chainIdToChain(this.chainId),
              // chain: The target chain. If there is a mismatch between the wallet's current chain & the target chain, an error will be thrown.

              account: this.walletClient?.account?.address!,
            }) // @BJ TODO: extract into viemV3?
          : await createAccount(
              tokenContract,
              tokenId,
              this.walletClient,
              this.implementationAddress,
              this.registryAddress,
              salt
            )
      }

      const computedAcct = getAcct(
        tokenContract,
        tokenId,
        createWithChainId,
        this.implementationAddress,
        this.registryAddress,
        salt
      )

      console.log('COMPUTED: ', computedAcct)

      if (txHash) {
        return {
          account: computedAcct,
          txHash,
        }
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
   * @deprecated this method is deprecated, but still available for use with legacy V2 deployments. Use prepareExecute() instead.
   */
  public async prepareExecuteCall(params: PrepareExecuteCallParams): Promise<{
    to: `0x${string}`
    value: bigint
    data: `0x${string}`
  }> {
    if (this.supportsV3) {
      throw new Error(
        'prepareExecuteCall() is not supported on V3 implementation deployments, use prepareExecute() instead.'
      )
    }

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
   * @deprecated this method is deprecated, but still available for use with legacy V2 deployments. Use execute() instead.
   */
  public async executeCall(params: ExecuteCallParams): Promise<`0x${string}`> {
    const preparedExecuteCall = await this.prepareExecuteCall(params)

    if (this.supportsV3) {
      throw new Error(
        'executeCall() is not supported on V3 implementation deployments, use execute() instead.'
      )
    }
    try {
      if (this.signer) {
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
   * Returns prepared transaction to execute on a tokenbound account
   * @param {string} params.account The tokenbound account address
   * @param {string} params.to The recipient address
   * @param {bigint} params.value The value to send, in wei
   * @param {string} params.data The encoded operation calldata to send
   * @returns a Promise with prepared transaction to execute on a tokenbound account. Can be sent via `sendTransaction` on a viem WalletClient or Ethers signer.
   */
  public async prepareExecution(params: PrepareExecutionParams): Promise<{
    to: `0x${string}`
    value: bigint
    data: `0x${string}`
    // operation?: CallOperation // The type of operation to perform ( CALL: 0, DELEGATECALL: 1, CREATE: 2, CREATE2: 3)
  }> {
    const { account, to, value, data } = params
    const operation = CALL_OPERATIONS.CALL

    if (!this.supportsV3) {
      // const { operation, ...rest } = params
      return await this.prepareExecuteCall(params)
    }

    return {
      to: account as `0x${string}`,
      value: 0n,
      data: encodeFunctionData({
        abi: ERC_6551_DEFAULT.IMPLEMENTATION.ABI,
        functionName: 'execute',
        args: [to, value, data, operation],
      }),
    }
  }

  /**
   * Executes a transaction call on a tokenbound account
   * @param {string} params.account The tokenbound account address
   * @param {string} params.to The recipient contract address
   * @param {bigint} params.value The value to send, in wei
   * @param {string} params.data The encoded operation calldata to send
   * @returns a Promise that resolves to the transaction hash of the executed call
   */
  public async execute(params: ExecuteParams): Promise<`0x${string}`> {
    try {
      if (!this.supportsV3) {
        // const { operation, ...rest } = params
        return await this.executeCall(params)
      }

      const preparedExecution = await this.prepareExecution(params)

      if (this.signer) {
        return (await this.signer
          .sendTransaction(preparedExecution)
          .then((tx: AbstractEthersTransactionResponse) => tx.hash)) as `0x${string}`
      } else if (this.walletClient) {
        return await this.walletClient.sendTransaction({
          // chain and account need to be added explicitly
          // because they're optional when instantiating a WalletClient
          chain: chainIdToChain(this.chainId),
          account: this.walletClient.account!,
          ...preparedExecution,
        })
      } else {
        throw new Error('No wallet client or signer available.')
      }
    } catch (error) {
      throw error
    }
  }

  /**
   * Check if a tokenbound account is a valid signer for a transaction
   * @param {string} params.account The tokenbound account address
   * @returns a Promise that resolves to true if the account is a valid signer, otherwise false
   */
  public async isValidSigner({ account }: ValidSignerParams): Promise<boolean> {
    const { signer, walletClient } = this
    const data = numberToHex(0, { size: 32 })
    const VALID_SIGNER_MAGIC_VALUE = '0x523e3260' // isValidSigner MUST return this bytes4 magic value if the given signer is valid
    const walletAddress: `0x${string}` = walletClient?.account?.address ?? signer?.address

    try {
      if (!signer && !walletClient) {
        throw new Error('No signer or wallet client available.')
      }

      if (!this.supportsV3) {
        throw new Error('isValidSigner is not supported using the V2 implementation')
      }

      const validityCheck = await this.publicClient.readContract({
        address: account,
        abi: ERC_6551_DEFAULT.IMPLEMENTATION.ABI,
        functionName: 'isValidSigner',
        args: [walletAddress, data],
      })

      return validityCheck === VALID_SIGNER_MAGIC_VALUE
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
        .then((bytecode: GetBytecodeReturnType) => {
          return bytecode ? bytecode.length > 2 : false
        })
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

      const execution = {
        account: tbAccountAddress,
        to: tokenContract,
        value: BigInt(0),
        data: transferCallData,
      }

      if (this.supportsV3) {
        return await this.execute(execution)
      }

      return await this.executeCall(execution)
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

      const execution = {
        account: tbAccountAddress,
        to: recipient,
        value: weiValue,
        data: '0x',
      }

      if (this.supportsV3) {
        return await this.execute(execution)
      }
      return await this.executeCall(execution)
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

      const execution = {
        account: tbAccountAddress,
        to: erc20tokenAddress,
        value: 0n,
        data: callData,
      }

      if (this.supportsV3) {
        return await this.execute(execution)
      }
      return await this.executeCall(execution)
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
        // Normalize message for Ethers 5 and 6 compatibility
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
const erc6551AccountAbiV2 = ERC_6551_LEGACY_V2.IMPLEMENTATION.ABI
const erc6551RegistryAbiV2 = ERC_6551_LEGACY_V2.REGISTRY.ABI
const erc6551AccountAbiV3 = ERC_6551_DEFAULT.IMPLEMENTATION.ABI
const erc6551AccountProxyAbiV3 = ERC_6551_DEFAULT.ACCOUNT_PROXY!.ABI
const erc6551RegistryAbiV3 = ERC_6551_DEFAULT.REGISTRY.ABI

export {
  TokenboundClient,
  erc6551AccountAbiV2,
  erc6551RegistryAbiV2,
  erc6551AccountAbiV3,
  erc6551AccountProxyAbiV3,
  erc6551RegistryAbiV3,
  getAccount,
  createAccount,
  getCreationCode,
  computeAccount,
  prepareExecuteCall,
  executeCall,
}
