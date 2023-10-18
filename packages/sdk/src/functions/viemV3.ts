import {
  getContract,
  getContractAddress,
  concat,
  // PublicClient,
  WalletClient,
  encodeFunctionData,
  encodeAbiParameters,
  pad,
  // isAddressEqual,
  parseAbiParameters,
  numberToHex,
  getAddress,
} from 'viem'

import { erc6551AccountAbiV3, erc6551RegistryAbiV3 } from '../../abis'
import { addressToUint8Array } from '../utils'
import { ERC_6551_DEFAULT, STANDARD_EIP_1167_IMPLEMENTATION } from '../constants'
export { erc6551AccountAbiV3, erc6551RegistryAbiV3 }

// const zeroBytes32: string = '0x' + '0'.repeat(64)

/**
 * @deprecated Direct consumption of this function is deprecated. Consume via TokenboundClient instead.
 * @internal
 */
export async function prepareCreateTokenboundV3Account(
  tokenContract: string,
  tokenId: string,
  chainId: number,
  implementationAddress?: `0x${string}`,
  registryAddress?: `0x${string}`
): Promise<{
  to: `0x${string}`
  value: bigint
  data: `0x${string}`
}> {
  const erc6551implementation =
    implementationAddress ?? ERC_6551_DEFAULT.IMPLEMENTATION.ADDRESS
  const erc6551registry = registryAddress ?? ERC_6551_DEFAULT.REGISTRY.ADDRESS

  return {
    to: getAddress(erc6551registry),
    value: BigInt(0),
    data: encodeFunctionData({
      abi: ERC_6551_DEFAULT.REGISTRY.ABI,
      functionName: 'createAccount',
      args: [
        getAddress(erc6551implementation),
        encodeAbiParameters(parseAbiParameters(['bytes32']), [
          // salt of 0
          numberToHex(0, { size: 32 }),
        ]),
        chainId,
        tokenContract,
        tokenId,
      ],
    }),
  }
}

/**
 * @deprecated Direct consumption of this function is deprecated. Consume via TokenboundClient instead.
 * @internal
 */
export async function createTokenboundV3Account(
  tokenContract: string,
  tokenId: string,
  client: WalletClient,
  implementationAddress?: `0x${string}`,
  registryAddress?: `0x${string}`
): Promise<`0x${string}`> {
  const erc6551implementation =
    implementationAddress ?? ERC_6551_DEFAULT.IMPLEMENTATION.ADDRESS
  const erc6551registry = registryAddress ?? ERC_6551_DEFAULT.REGISTRY.ADDRESS

  const registry = getContract({
    address: erc6551registry,
    abi: ERC_6551_DEFAULT.REGISTRY.ABI,
    walletClient: client,
  })

  const chainId = await client.getChainId()

  return registry.write.createAccount([
    erc6551implementation,
    encodeAbiParameters(parseAbiParameters(['bytes32']), [
      numberToHex(0, { size: 32 }), // salt of 0
    ]),
    chainId,
    tokenContract,
    tokenId,
  ])
}

/**
 * @deprecated Direct consumption of this function is deprecated. Consume via TokenboundClient instead.
 * @internal
 */
export async function prepareTokenboundV3Execute(
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
      abi: ERC_6551_DEFAULT.IMPLEMENTATION.ABI,
      functionName: 'execute',
      args: [to as `0x${string}`, value, data as `0x${string}`],
    }),
  }
}

/**
 * @deprecated Direct consumption of this function is deprecated. Consume via TokenboundClient instead.
 * @internal
 */
export async function tokenboundV3Execute(
  account: string,
  to: string,
  value: bigint,
  data: string,
  client: WalletClient
) {
  const registry = getContract({
    address: account as `0x${string}`,
    abi: ERC_6551_DEFAULT.IMPLEMENTATION.ABI,
    walletClient: client,
  })

  return registry.write.execute([to as `0x${string}`, value, data as `0x${string}`])
}

/**
 * @deprecated Direct consumption of this function is deprecated. Consume via TokenboundClient instead.
 * @internal
 */
// export function computeTokenboundAccount(
export function getTokenboundV3Account(
  tokenContract: string,
  tokenId: string,
  chainId: number,
  implementationAddress?: `0x${string}`,
  registryAddress?: `0x${string}`
): `0x${string}` {
  const erc6551implementation =
    implementationAddress ?? ERC_6551_DEFAULT.IMPLEMENTATION.ADDRESS
  const erc6551registry = registryAddress ?? ERC_6551_DEFAULT.REGISTRY.ADDRESS

  console.log(
    'computeAccount impl',
    implementationAddress,
    ' > ',
    ERC_6551_DEFAULT.IMPLEMENTATION.ADDRESS
  )

  // computeAccount test 0x2D25602551487C3f3354dD80D76D54383A243358 0x002c0c13181038780F552f0eC1B72e8C720147E6

  // const types = [
  //   { type: 'uint256' }, // salt
  //   { type: 'uint256' }, // chainId
  //   { type: 'address' }, // tokenContract
  //   { type: 'uint256' }, // tokenId
  // ]
  const types = [
    { type: 'uint256' }, // salt
    { type: 'uint256' }, // chainId
    { type: 'address' }, // tokenContract
    { type: 'uint256' }, // tokenId
  ]

  // args: [
  //   getAddress(erc6551implementation),
  //   encodeAbiParameters(parseAbiParameters(['bytes32']), [
  //     // salt of 0
  //     numberToHex(0, { size: 32 }),
  //   ]),
  //   chainId,
  //   tokenContract,
  //   tokenId,
  // ],

  const salt = '0'
  const values: (string | bigint)[] = [salt, BigInt(chainId), tokenContract, tokenId]
  const encodedABI = encodeAbiParameters(types, values)

  const hexCreationCode = concat([
    '0x3d60ad80600a3d3981f3363d3d373d3d3d363d73',
    getAddress(erc6551implementation),
    STANDARD_EIP_1167_IMPLEMENTATION,
    encodedABI,
  ])

  const creationCode = addressToUint8Array(hexCreationCode)
  const bigIntZero = BigInt('0').toString(16) as `0x${string}`
  const saltHex = pad(bigIntZero, { size: 32 })

  return getContractAddress({
    bytecode: creationCode,
    from: getAddress(erc6551registry),
    opcode: 'CREATE2',
    salt: saltHex,
  })
}
