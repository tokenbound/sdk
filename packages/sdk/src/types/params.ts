import { WalletClient, PublicClient, Chain } from 'viem'
import { Prettify } from './prettify'
import { UniversalSignableMessage, CallOperation } from '.'
import { PossibleENSAddress } from './addresses'
import { ERC_6551_LEGACY_V2 } from '../constants'

export const NFTTokenType = {
  ERC721: 'ERC721',
  ERC1155: 'ERC1155',
} as const

export const TBVersion = {
  V2: 2,
  V3: 3,
} as const

export type TBImplementationVersion = (typeof TBVersion)[keyof typeof TBVersion]

type TokenType = (typeof NFTTokenType)[keyof typeof NFTTokenType]

type NFTParams = Prettify<{
  tokenContract: `0x${string}`
  tokenId: string
}>

export type TokenboundAccountNFT = Prettify<
  NFTParams & {
    chainId: number
  }
>

interface TokenTypeParams {
  tokenType: TokenType
}

export type NFTTransferParams = Prettify<
  TokenTypeParams &
    NFTParams & {
      recipientAddress: PossibleENSAddress
      account: `0x${string}`
      amount?: number
    }
>

export type ETHTransferParams = Prettify<{
  account: `0x${string}`
  recipientAddress: PossibleENSAddress
  amount: number
}>

export type ERC20TransferParams = Prettify<{
  account: `0x${string}`
  recipientAddress: PossibleENSAddress
  amount: number
  erc20tokenAddress: `0x${string}`
  erc20tokenDecimals: number
}>

type ImplementationAddress =
  | `0x${string}`
  | typeof ERC_6551_LEGACY_V2.IMPLEMENTATION.ADDRESS

export type TokenboundClientOptions = Prettify<{
  chainId?: number
  chain?: Chain
  signer?: any
  walletClient?: WalletClient
  publicClient?: PublicClient
  publicClientRPCUrl?: string
  implementationAddress?: ImplementationAddress
  registryAddress?: `0x${string}`
  version?: TBImplementationVersion
}>

type Custom6551Implementation = Prettify<{
  salt?: number
}>

export type TBAccountParams = NFTParams

export type GetAccountParams = Prettify<
  TBAccountParams & Partial<Custom6551Implementation>
>

export type PrepareCreateAccountParams = Prettify<
  TBAccountParams & Partial<Custom6551Implementation>
>
export type CreateAccountParams = Prettify<
  TBAccountParams & Partial<Custom6551Implementation>
>

export type ExecuteCallParams = Prettify<{
  account: `0x${string}`
  to: `0x${string}`
  value: bigint
  data: string
}>
export type PrepareExecuteCallParams = ExecuteCallParams

export type ExecuteParams = Prettify<ExecuteCallParams & { operation?: CallOperation }>
export type PrepareExecutionParams = ExecuteParams

export type ValidSignerParams = Prettify<{
  //   walletAddress: `0x${string}`
  account: `0x${string}`
  data?: string
}>

export type ComputeAccountParams = Prettify<
  TBAccountParams & {
    chainId: number
  } & Partial<Custom6551Implementation>
>

export type GetCreationCodeParams = Prettify<{
  implementation_: `0x${string}`
  chainId_: number
  tokenContract_: string
  tokenId_: string
  salt_: string
}>

export type BytecodeParams = Prettify<{
  accountAddress: `0x${string}`
}>

export type SignMessageParams = Prettify<{
  message: UniversalSignableMessage
}>
