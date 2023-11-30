import {
  getContract,
  getContractAddress,
  concat,
  PublicClient,
  WalletClient,
  encodeFunctionData,
  encodeAbiParameters,
  pad,
  getAddress,
} from 'viem'

import { erc6551AccountAbiV2, erc6551RegistryAbiV2 } from '../../abis'
import {
  erc6551AccountProxyV3ABI,
  erc6551AccountV3ABI,
  erc6551RegistryV3ABI,
} from '../../src/test/wagmi-cli-hooks/generated'
import { addressToUint8Array } from '../utils'
import { ERC_6551_LEGACY_V2 } from '../constants'

export {
  erc6551AccountAbiV2,
  erc6551RegistryAbiV2,
  erc6551AccountProxyV3ABI,
  erc6551AccountV3ABI,
  erc6551RegistryV3ABI,
}

/**
 * @deprecated Direct consumption of this function is deprecated. Consume via TokenboundClient instead.
 * @internal
 */
export async function getAccount(
  tokenContract: string,
  tokenId: string,
  client: PublicClient,
  implementationAddress?: `0x${string}`,
  registryAddress?: `0x${string}`
): Promise<`0x${string}`> {
  const erc6551registry = registryAddress
    ? getAddress(registryAddress)
    : ERC_6551_LEGACY_V2.REGISTRY.ADDRESS

  const registry = getContract({
    address: erc6551registry,
    abi: ERC_6551_LEGACY_V2.REGISTRY.ABI,
    publicClient: client as PublicClient,
  })

  const chainId = await client.getChainId()

  const account = await registry.read.account([
    implementationAddress
      ? getAddress(implementationAddress)
      : ERC_6551_LEGACY_V2.IMPLEMENTATION.ADDRESS,
    chainId,
    tokenContract,
    tokenId,
    0,
  ])

  return account as `0x${string}`
}

/**
 * @deprecated Direct consumption of this function is deprecated. Consume via TokenboundClient instead.
 * @internal
 */
export async function prepareCreateAccount(
  tokenContract: string,
  tokenId: string,
  chainId: number,
  implementationAddress?: `0x${string}`,
  registryAddress?: `0x${string}`,
  salt?: number
): Promise<{
  to: `0x${string}`
  value: bigint
  data: `0x${string}`
}> {
  salt = salt ?? 0
  const implementation = implementationAddress
    ? getAddress(implementationAddress)
    : ERC_6551_LEGACY_V2.IMPLEMENTATION.ADDRESS
  const erc6551registry = registryAddress
    ? getAddress(registryAddress)
    : ERC_6551_LEGACY_V2.REGISTRY.ADDRESS

  const initData = encodeFunctionData({
    abi: [
      {
        inputs: [],
        name: 'initialize',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],
    functionName: 'initialize',
  })

  return {
    to: erc6551registry,
    value: BigInt(0),
    data: encodeFunctionData({
      abi: ERC_6551_LEGACY_V2.REGISTRY.ABI,
      functionName: 'createAccount',
      args: [implementation, chainId, tokenContract, tokenId, salt, initData],
    }),
  }
}

/**
 * @deprecated Direct consumption of this function is deprecated. Consume via TokenboundClient instead.
 * @internal
 */
export async function createAccount(
  tokenContract: string,
  tokenId: string,
  client: WalletClient,
  implementationAddress?: `0x${string}`,
  registryAddress?: `0x${string}`,
  salt?: number,
  chainId?: number
): Promise<`0x${string}`> {
  salt = salt ?? 0
  const implementation = implementationAddress
    ? getAddress(implementationAddress)
    : ERC_6551_LEGACY_V2.IMPLEMENTATION.ADDRESS
  const erc6551registry = registryAddress
    ? getAddress(registryAddress)
    : ERC_6551_LEGACY_V2.REGISTRY.ADDRESS

  const registry = getContract({
    address: erc6551registry,
    abi: ERC_6551_LEGACY_V2.REGISTRY.ABI,
    walletClient: client,
  })

  const _chainId = chainId || (await client.getChainId())

  const initData = encodeFunctionData({
    abi: [
      {
        inputs: [],
        name: 'initialize',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],
    functionName: 'initialize',
  })

  return registry.write.createAccount([
    implementation,
    _chainId,
    tokenContract,
    tokenId,
    salt,
    initData,
  ])
}

/**
 * @deprecated Direct consumption of this function is deprecated. Consume via TokenboundClient instead.
 * @internal
 */
export async function prepareExecuteCall(
  account: string,
  to: string,
  value: bigint,
  data: string
): Promise<{
  to: `0x${string}`
  value: bigint
  data: `0x${string}`
}> {
  return {
    to: account as `0x${string}`,
    value: 0n,
    data: encodeFunctionData({
      abi: ERC_6551_LEGACY_V2.IMPLEMENTATION.ABI,
      functionName: 'executeCall',
      args: [to as `0x${string}`, value, data as `0x${string}`],
    }),
  }
}

/**
 * @deprecated Direct consumption of this function is deprecated. Consume via TokenboundClient instead.
 * @internal
 */
export async function executeCall(
  account: string,
  to: string,
  value: bigint,
  data: string,
  client: WalletClient
) {
  const registry = getContract({
    address: account as `0x${string}`,
    abi: ERC_6551_LEGACY_V2.IMPLEMENTATION.ABI,
    walletClient: client,
  })

  return registry.write.executeCall([to as `0x${string}`, value, data as `0x${string}`])
}

/**
 * @deprecated Direct consumption of this function is deprecated. Consume via TokenboundClient instead.
 * @internal
 */
export function computeAccount(
  tokenContract: string,
  tokenId: string,
  chainId: number,
  implementationAddress?: `0x${string}`,
  registryAddress?: `0x${string}`,
  salt?: number
): `0x${string}` {
  salt = salt ?? 0
  const implementation = implementationAddress
    ? getAddress(implementationAddress)
    : ERC_6551_LEGACY_V2.IMPLEMENTATION.ADDRESS
  const erc6551registry = registryAddress
    ? getAddress(registryAddress)
    : ERC_6551_LEGACY_V2.REGISTRY.ADDRESS

  const code = getCreationCode(
    implementation,
    chainId,
    tokenContract,
    tokenId,
    salt.toString()
  )

  const bigIntSalt = BigInt(salt).toString(16) as `0x${string}`
  const saltHex = pad(bigIntSalt, { size: 32 })

  return getContractAddress({
    bytecode: code,
    from: erc6551registry,
    opcode: 'CREATE2',
    salt: saltHex,
  })
}

/**
 * @deprecated Direct consumption of this function is deprecated. Consume via TokenboundClient instead.
 * @internal
 */
export function getCreationCode(
  implementation_: `0x${string}`,
  chainId_: number,
  tokenContract_: string,
  tokenId_: string,
  salt_: string
): Uint8Array {
  const types = [
    { type: 'uint256' },
    { type: 'uint256' },
    { type: 'address' },
    { type: 'uint256' },
  ]
  const values: (string | bigint)[] = [salt_, BigInt(chainId_), tokenContract_, tokenId_]
  const encodedABI = encodeAbiParameters(types, values)
  const hexImplementation = implementation_ as `0x${string}`

  const hexCreationCode = concat([
    '0x3d60ad80600a3d3981f3363d3d373d3d3d363d73',
    hexImplementation,
    '0x5af43d82803e903d91602b57fd5bf3',
    encodedABI,
  ])

  const creationCode = addressToUint8Array(hexCreationCode)

  return creationCode
}
