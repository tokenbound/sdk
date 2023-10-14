import { Abi } from 'viem'

export type ContractABIPair = {
  ADDRESS: `0x${string}`
  //   ABI: any // Replace 'any' with the exact ABI type you are using
  ABI: Abi
}
