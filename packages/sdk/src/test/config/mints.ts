import { getAddress } from 'viem'
import { ethToWei } from '../utils'
import { zora721DropABI, zora1155ABI } from '../wagmi-cli-hooks/generated'

// Zora Webb's First Deep Field: https://zora.co/collect/eth:0x28ee638f2fcb66b4106acab7efd225aeb2bd7e8d
export const zora721 = {
  abi: zora721DropABI,
  proxyContractAddress: getAddress('0x28ee638f2fcb66b4106acab7efd225aeb2bd7e8d'),
  mintPrice: BigInt(0),
  quantity: 4,
}

// https://zora.co/collect/eth:0x373075bab7d668ed2473d8233ebdebcf49eb758e/1
export const zora1155 = {
  abi: zora1155ABI,
  fixedPriceSalesStrategy: getAddress('0x5Ff5a77dD2214d863aCA809C0168941052d9b180'), // Zora IMinter1155 from https://etherscan.io/address/0x5Ff5a77dD2214d863aCA809C0168941052d9b180
  proxyContractAddress: getAddress('0x373075bab7d668ed2473d8233ebdebcf49eb758e'), // proxied Zora 1155 contract
  tokenId: BigInt(1),
  mintFee: ethToWei(0.000777),
  quantity: BigInt(5),
}
