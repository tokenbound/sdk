import { getAddress } from 'viem'
import { ethToWei } from '../utils'
import { zora721DropABI } from '../wagmi-cli-hooks/generated'

// Zora Webb's First Deep Field: https://zora.co/collect/eth:0x28ee638f2fcb66b4106acab7efd225aeb2bd7e8d
export const zora721 = {
  abi: zora721DropABI,
  proxyContractAddress: getAddress('0x28ee638f2fcb66b4106acab7efd225aeb2bd7e8d'),
  mintPrice: BigInt(0),
  quantity: 3,
}

// https://zora.co/collect/eth:0x373075bab7d668ed2473d8233ebdebcf49eb758e/1
export const zora1155 = {
  fixedPriceSalesStrategy: getAddress('0x8A1DBE9b1CeB1d17f92Bebf10216FCFAb5C3fbA7'), // IMinter1155 minter contract from https://github.com/ourzora/zora-1155-contracts/blob/main/addresses/1.json
  proxyContractAddress: getAddress('0x373075bab7d668ed2473d8233ebdebcf49eb758e'), // proxied Zora 1155 contract
  tokenId: BigInt(1),
  mintFee: ethToWei(0.000777), // 0.000777 ETH
  quantity: BigInt(5),
}
