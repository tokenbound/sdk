import { WalletClient, PublicClient, Chain } from 'viem'
import { Prettify } from './prettify'
import { UniversalSignableMessage } from './messages'
import { PossibleENSAddress } from './addresses'

export const NFTTokenType = {
  ERC721: 'ERC721',
  ERC1155: 'ERC1155',
} as const

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

export type TokenboundClientOptions = Prettify<{
  chainId?: number
  chain?: Chain
  signer?: any
  walletClient?: WalletClient
  publicClient?: PublicClient
  publicClientRPCUrl?: string
  implementationAddress?: `0x${string}`
  registryAddress?: `0x${string}`
}>

type Custom6551Implementation = Prettify<{
  implementationAddress: `0x${string}`
  registryAddress?: `0x${string}`
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
