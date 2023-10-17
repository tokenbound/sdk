import {
  getContract,
  getContractAddress,
  concat,
  PublicClient,
  WalletClient,
  encodeFunctionData,
  encodeAbiParameters,
  pad,
  isAddressEqual,
  parseAbiParameters,
  numberToHex,
} from 'viem'

import {
  erc6551AccountAbiV2,
  erc6551RegistryAbiV2,
  erc6551AccountAbiV3,
  erc6551RegistryAbiV3,
} from '../../abis'
import { addressToUint8Array, getActiveImplementation, getActiveRegistry } from '../utils'
import { ERC_6551_LEGACY_V2 } from '../constants'

export {
  erc6551AccountAbiV2,
  erc6551RegistryAbiV2,
  erc6551AccountAbiV3,
  erc6551RegistryAbiV3,
}

// const zeroBytes32: string = '0x' + '0'.repeat(64)

/**
 * @deprecated Direct consumption of this function is deprecated. Consume via TokenboundClient instead.
 * @internal
 */
export async function getTokenboundAccount(
  tokenContract: string,
  tokenId: string,
  client: PublicClient,
  implementationAddress?: `0x${string}`,
  registryAddress?: `0x${string}`
): Promise<`0x${string}`> {
  const implementation = getActiveImplementation(implementationAddress)
  const erc6551registry = getActiveRegistry(registryAddress)

  // console.log('getAcct test', implementation, erc6551registry)
  // getAcct 0x2D25602551487C3f3354dD80D76D54383A243358 0x002c0c13181038780F552f0eC1B72e8C720147E6
  // console.log('getAccount impl', implementationAddress, ' > ', implementation.ADDRESS)

  const registry = getContract({
    address: erc6551registry.ADDRESS,
    abi: erc6551registry.ABI,
    publicClient: client,
  })

  const chainId = await client.getChainId()

  // const isV2Compatible = isAddressEqual(
  //   implementation.ADDRESS,
  //   ERC_6551_LEGACY_V2.IMPLEMENTATION.ADDRESS
  // )
  const account: `0x${string}` = (await registry.read.account([
    implementation.ADDRESS,
    // 0,
    // numberToBytes(0, { size: 32 }),
    encodeAbiParameters(parseAbiParameters(['bytes32']), [numberToHex(0, { size: 32 })]),

    chainId,
    tokenContract,
    tokenId,
  ])) as `0x${string}`

  return account
}

/**
 * @deprecated Direct consumption of this function is deprecated. Consume via TokenboundClient instead.
 * @internal
 */
export async function prepareCreateTokenboundAccount(
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
  const implementation = getActiveImplementation(implementationAddress)
  const erc6551registry = getActiveRegistry(registryAddress)

  const isV2Compatible = isAddressEqual(
    implementation.ADDRESS,
    ERC_6551_LEGACY_V2.IMPLEMENTATION.ADDRESS
  )

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

  const createAcctArgs = isV2Compatible
    ? [
        implementation.ADDRESS,
        chainId,
        tokenContract,
        tokenId,
        0, // salt
        initData,
      ]
    : [
        implementation.ADDRESS,
        encodeAbiParameters(parseAbiParameters(['bytes32']), [
          // salt of 0
          numberToHex(0, { size: 32 }),
        ]),
        chainId,
        tokenContract,
        tokenId,
      ]

  return {
    to: erc6551registry.ADDRESS,
    value: BigInt(0),
    data: encodeFunctionData({
      abi: erc6551registry.ABI,
      functionName: 'createAccount',
      args: createAcctArgs,
    }),
  }
}

/**
 * @deprecated Direct consumption of this function is deprecated. Consume via TokenboundClient instead.
 * @internal
 */
export async function createTokenboundAccount(
  tokenContract: string,
  tokenId: string,
  client: WalletClient,
  implementationAddress?: `0x${string}`,
  registryAddress?: `0x${string}`
): Promise<`0x${string}`> {
  const implementation = getActiveImplementation(implementationAddress)
  const erc6551registry = getActiveRegistry(registryAddress)

  // const isV2Compatible = isAddressEqual(
  //   implementation.ADDRESS,
  //   ERC_6551_LEGACY_V2.IMPLEMENTATION.ADDRESS
  // )

  // console.log('createAccount test', implementation, erc6551registry)

  const registry = getContract({
    address: erc6551registry.ADDRESS,
    abi: erc6551registry.ABI,
    walletClient: client,
  })

  const chainId = await client.getChainId()

  // const initData = encodeFunctionData({
  //   abi: [
  //     {
  //       inputs: [],
  //       name: 'initialize',
  //       outputs: [],
  //       stateMutability: 'nonpayable',
  //       type: 'function',
  //     },
  //   ],
  //   functionName: 'initialize',
  // })

  const createAcctArgs =
    // isV2Compatible
    //   ? [
    //       implementation.ADDRESS,
    //       chainId,
    //       tokenContract,
    //       tokenId,
    //       0, // salt
    //       initData,
    //     ]
    //   :
    [
      implementation.ADDRESS,
      encodeAbiParameters(parseAbiParameters(['bytes32']), [
        // salt of 0
        numberToHex(0, { size: 32 }),
      ]),
      chainId,
      tokenContract,
      tokenId,
    ]

  // const initData = encodeFunctionData({
  //   abi: [
  //     {
  //       inputs: [],
  //       name: 'initialize',
  //       outputs: [],
  //       stateMutability: 'nonpayable',
  //       type: 'function',
  //     },
  //   ],
  //   functionName: 'initialize',
  // })

  return registry.write.createAccount(createAcctArgs)
  // return registry.write.createAccount([
  //   implementation.ADDRESS,
  //   chainId,
  //   tokenContract,
  //   tokenId,
  //   0, // salt
  //   isV2Compatible ? initData : undefined,
  // ])
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
  const implementation = getActiveImplementation(
    ERC_6551_LEGACY_V2.IMPLEMENTATION.ADDRESS
  )
  return {
    to: account as `0x${string}`,
    value: 0n,
    data: encodeFunctionData({
      abi: implementation.ABI,
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
  const implementation = getActiveImplementation(
    ERC_6551_LEGACY_V2.IMPLEMENTATION.ADDRESS
  )
  const registry = getContract({
    address: account as `0x${string}`,
    // abi: erc6551AccountAbi,
    abi: implementation.ABI,
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
  registryAddress?: `0x${string}`
): `0x${string}` {
  const implementation = getActiveImplementation(implementationAddress)
  const erc6551registry = getActiveRegistry(registryAddress)

  // console.log('computeAccount test', implementation, erc6551registry)

  console.log('computeAccount impl', implementationAddress, ' > ', implementation.ADDRESS)

  // computeAccount test 0x2D25602551487C3f3354dD80D76D54383A243358 0x002c0c13181038780F552f0eC1B72e8C720147E6

  // const code = getCreationCode(
  //   implementation.ADDRESS,
  //   chainId,
  //   tokenContract,
  //   tokenId,
  //   '0'
  // )

  const types = [
    { type: 'uint256' },
    { type: 'uint256' },
    { type: 'address' },
    { type: 'uint256' },
  ]

  const salt = '0'
  const values: (string | bigint)[] = [salt, BigInt(chainId), tokenContract, tokenId]
  const encodedABI = encodeAbiParameters(types, values)
  // const hexImplementation = implementation_ as `0x${string}`

  const StandardEIP1167Implementation = '0x5af43d82803e903d91602b57fd5bf3'

  const hexCreationCode = concat([
    '0x3d60ad80600a3d3981f3363d3d373d3d3d363d73',
    implementation.ADDRESS,
    StandardEIP1167Implementation,
    encodedABI,
  ])

  const creationCode = addressToUint8Array(hexCreationCode)
  const bigIntZero = BigInt('0').toString(16) as `0x${string}`
  const saltHex = pad(bigIntZero, { size: 32 })

  return getContractAddress({
    bytecode: creationCode,
    from: erc6551registry.ADDRESS,
    opcode: 'CREATE2',
    salt: saltHex,
  })
}

/**
 * @deprecated Direct consumption of this function is deprecated. Consume via TokenboundClient instead.
 * @internal
 */
// export function getCreationCode(
//   implementation_: `0x${string}`,
//   chainId_: number,
//   tokenContract_: string,
//   tokenId_: string,
//   salt_: string
// ): Uint8Array {
//   const types = [
//     { type: 'uint256' },
//     { type: 'uint256' },
//     { type: 'address' },
//     { type: 'uint256' },
//   ]
//   const values: (string | bigint)[] = [salt_, BigInt(chainId_), tokenContract_, tokenId_]
//   const encodedABI = encodeAbiParameters(types, values)
//   const hexImplementation = implementation_ as `0x${string}`

//   const hexCreationCode = concat([
//     '0x3d60ad80600a3d3981f3363d3d373d3d3d363d73',
//     hexImplementation,
//     '0x5af43d82803e903d91602b57fd5bf3',
//     encodedABI,
//   ])

//   const creationCode = addressToUint8Array(hexCreationCode)

//   return creationCode
// }
