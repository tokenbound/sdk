import {
  useNetwork,
  useChainId,
  useContractWrite,
  Address,
  UseContractWriteConfig,
  usePrepareContractWrite,
  UsePrepareContractWriteConfig,
  useContractEvent,
  UseContractEventConfig,
  useContractRead,
  UseContractReadConfig,
} from 'wagmi'
import {
  WriteContractMode,
  PrepareWriteContractResult,
  ReadContractResult,
} from 'wagmi/actions'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ERC6551Account_V2_
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2D25602551487C3f3354dD80D76D54383A243358)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2D25602551487C3f3354dD80D76D54383A243358)
 */
export const erc6551AccountV2ABI = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [
      { name: '_defaultImplementation', internalType: 'address', type: 'address' },
    ],
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousAdmin', internalType: 'address', type: 'address', indexed: false },
      { name: 'newAdmin', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'AdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'beacon', internalType: 'address', type: 'address', indexed: true }],
    name: 'BeaconUpgraded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'implementation', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'Upgraded',
  },
  { stateMutability: 'payable', type: 'fallback' },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'initialize',
    outputs: [],
  },
  { stateMutability: 'payable', type: 'receive' },
] as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2D25602551487C3f3354dD80D76D54383A243358)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2D25602551487C3f3354dD80D76D54383A243358)
 */
export const erc6551AccountV2Address = {
  1: '0x2D25602551487C3f3354dD80D76D54383A243358',
  5: '0x2D25602551487C3f3354dD80D76D54383A243358',
} as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2D25602551487C3f3354dD80D76D54383A243358)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2D25602551487C3f3354dD80D76D54383A243358)
 */
export const erc6551AccountV2Config = {
  address: erc6551AccountV2Address,
  abi: erc6551AccountV2ABI,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ERC6551Account_V3_
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xDBb56A571a1eb9d5d973b1D682f3DC19bEE5Cbd2)
 */
export const erc6551AccountV3ABI = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [
      { name: 'entryPoint_', internalType: 'address', type: 'address' },
      { name: 'multicallForwarder', internalType: 'address', type: 'address' },
      { name: 'erc6551Registry', internalType: 'address', type: 'address' },
      { name: 'guardian', internalType: 'address', type: 'address' },
    ],
  },
  { type: 'error', inputs: [], name: 'AccountLocked' },
  { type: 'error', inputs: [], name: 'ContractCreationFailed' },
  { type: 'error', inputs: [], name: 'ExceedsMaxLockTime' },
  { type: 'error', inputs: [], name: 'InvalidAccountProof' },
  { type: 'error', inputs: [], name: 'InvalidERC6551Registry' },
  { type: 'error', inputs: [], name: 'InvalidEntryPoint' },
  { type: 'error', inputs: [], name: 'InvalidImplementation' },
  { type: 'error', inputs: [], name: 'InvalidInput' },
  { type: 'error', inputs: [], name: 'InvalidMulticallForwarder' },
  { type: 'error', inputs: [], name: 'InvalidOperation' },
  { type: 'error', inputs: [], name: 'NotAuthorized' },
  { type: 'error', inputs: [], name: 'OwnershipCycle' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousAdmin', internalType: 'address', type: 'address', indexed: false },
      { name: 'newAdmin', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'AdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'beacon', internalType: 'address', type: 'address', indexed: true }],
    name: 'BeaconUpgraded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'lockedUntil', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'LockUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address', indexed: false },
      { name: 'selector', internalType: 'bytes4', type: 'bytes4', indexed: false },
      {
        name: 'implementation',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'OverrideUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address', indexed: false },
      { name: 'caller', internalType: 'address', type: 'address', indexed: false },
      { name: 'hasPermission', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'PermissionUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'implementation', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'Upgraded',
  },
  { stateMutability: 'payable', type: 'fallback' },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'entryPoint',
    outputs: [{ name: '', internalType: 'contract IEntryPoint', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'erc6551Registry',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
      { name: 'operation', internalType: 'uint8', type: 'uint8' },
    ],
    name: 'execute',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      {
        name: 'operations',
        internalType: 'struct BatchExecutor.Operation[]',
        type: 'tuple[]',
        components: [
          { name: 'to', internalType: 'address', type: 'address' },
          { name: 'value', internalType: 'uint256', type: 'uint256' },
          { name: 'data', internalType: 'bytes', type: 'bytes' },
          { name: 'operation', internalType: 'uint8', type: 'uint8' },
        ],
      },
    ],
    name: 'executeBatch',
    outputs: [{ name: '', internalType: 'bytes[]', type: 'bytes[]' }],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
      { name: 'operation', internalType: 'uint8', type: 'uint8' },
      {
        name: 'proof',
        internalType: 'struct NestedAccountExecutor.ERC6551AccountInfo[]',
        type: 'tuple[]',
        components: [
          { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
          { name: 'tokenContract', internalType: 'address', type: 'address' },
          { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
    name: 'executeNested',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'extcall',
    outputs: [{ name: 'result', internalType: 'bytes', type: 'bytes' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'bytecode', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'extcreate',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
      { name: 'bytecode', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'extcreate2',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'slot', internalType: 'bytes32', type: 'bytes32' }],
    name: 'extsload',
    outputs: [{ name: 'value', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getNonce',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'isLocked',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'forwarder', internalType: 'address', type: 'address' }],
    name: 'isTrustedForwarder',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'hash', internalType: 'bytes32', type: 'bytes32' },
      { name: 'signature', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'isValidSignature',
    outputs: [{ name: 'magicValue', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'signer', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'isValidSigner',
    outputs: [{ name: 'magicValue', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: '_lockedUntil', internalType: 'uint256', type: 'uint256' }],
    name: 'lock',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'lockedUntil',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'onERC1155BatchReceived',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'onERC1155Received',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'onERC721Received',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'bytes4', type: 'bytes4' },
    ],
    name: 'overrides',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
    ],
    name: 'permissions',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'proxiableUUID',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'selectors', internalType: 'bytes4[]', type: 'bytes4[]' },
      { name: 'implementations', internalType: 'address[]', type: 'address[]' },
    ],
    name: 'setOverrides',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'callers', internalType: 'address[]', type: 'address[]' },
      { name: '_permissions', internalType: 'bool[]', type: 'bool[]' },
    ],
    name: 'setPermissions',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'state',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'token',
    outputs: [
      { name: 'chainId', internalType: 'uint256', type: 'uint256' },
      { name: 'tokenContract', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'newImplementation', internalType: 'address', type: 'address' }],
    name: 'upgradeTo',
    outputs: [],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: 'userOp',
        internalType: 'struct UserOperation',
        type: 'tuple',
        components: [
          { name: 'sender', internalType: 'address', type: 'address' },
          { name: 'nonce', internalType: 'uint256', type: 'uint256' },
          { name: 'initCode', internalType: 'bytes', type: 'bytes' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
          { name: 'callGasLimit', internalType: 'uint256', type: 'uint256' },
          { name: 'verificationGasLimit', internalType: 'uint256', type: 'uint256' },
          { name: 'preVerificationGas', internalType: 'uint256', type: 'uint256' },
          { name: 'maxFeePerGas', internalType: 'uint256', type: 'uint256' },
          { name: 'maxPriorityFeePerGas', internalType: 'uint256', type: 'uint256' },
          { name: 'paymasterAndData', internalType: 'bytes', type: 'bytes' },
          { name: 'signature', internalType: 'bytes', type: 'bytes' },
        ],
      },
      { name: 'userOpHash', internalType: 'bytes32', type: 'bytes32' },
      { name: 'missingAccountFunds', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'validateUserOp',
    outputs: [{ name: 'validationData', internalType: 'uint256', type: 'uint256' }],
  },
  { stateMutability: 'payable', type: 'receive' },
] as const

/**
 * [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xDBb56A571a1eb9d5d973b1D682f3DC19bEE5Cbd2)
 */
export const erc6551AccountV3Address = {
  5: '0xDBb56A571a1eb9d5d973b1D682f3DC19bEE5Cbd2',
} as const

/**
 * [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xDBb56A571a1eb9d5d973b1D682f3DC19bEE5Cbd2)
 */
export const erc6551AccountV3Config = {
  address: erc6551AccountV3Address,
  abi: erc6551AccountV3ABI,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ERC6551Registry_V2_
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x02101dfB77FDE026414827Fdc604ddAF224F0921)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x02101dfB77FDE026414827Fdc604ddAF224F0921)
 */
export const erc6551RegistryV2ABI = [
  { type: 'error', inputs: [], name: 'InitializationFailed' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'account', internalType: 'address', type: 'address', indexed: false },
      {
        name: 'implementation',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      { name: 'chainId', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'tokenContract', internalType: 'address', type: 'address', indexed: false },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'salt', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'AccountCreated',
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'implementation', internalType: 'address', type: 'address' },
      { name: 'chainId', internalType: 'uint256', type: 'uint256' },
      { name: 'tokenContract', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'salt', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'account',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'implementation', internalType: 'address', type: 'address' },
      { name: 'chainId', internalType: 'uint256', type: 'uint256' },
      { name: 'tokenContract', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'salt', internalType: 'uint256', type: 'uint256' },
      { name: 'initData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'createAccount',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
] as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x02101dfB77FDE026414827Fdc604ddAF224F0921)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x02101dfB77FDE026414827Fdc604ddAF224F0921)
 */
export const erc6551RegistryV2Address = {
  1: '0x02101dfB77FDE026414827Fdc604ddAF224F0921',
  5: '0x02101dfB77FDE026414827Fdc604ddAF224F0921',
} as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x02101dfB77FDE026414827Fdc604ddAF224F0921)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x02101dfB77FDE026414827Fdc604ddAF224F0921)
 */
export const erc6551RegistryV2Config = {
  address: erc6551RegistryV2Address,
  abi: erc6551RegistryV2ABI,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ERC6551Registry_V3_
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x002c0c13181038780F552f0eC1B72e8C720147E6)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x002c0c13181038780F552f0eC1B72e8C720147E6)
 */
export const erc6551RegistryV3ABI = [
  { type: 'error', inputs: [], name: 'AccountCreationFailed' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'account', internalType: 'address', type: 'address', indexed: false },
      { name: 'implementation', internalType: 'address', type: 'address', indexed: true },
      { name: 'salt', internalType: 'bytes32', type: 'bytes32', indexed: false },
      { name: 'chainId', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'tokenContract', internalType: 'address', type: 'address', indexed: true },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256', indexed: true },
    ],
    name: 'ERC6551AccountCreated',
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'implementation', internalType: 'address', type: 'address' },
      { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
      { name: 'chainId', internalType: 'uint256', type: 'uint256' },
      { name: 'tokenContract', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'account',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'implementation', internalType: 'address', type: 'address' },
      { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
      { name: 'chainId', internalType: 'uint256', type: 'uint256' },
      { name: 'tokenContract', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'createAccount',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
] as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x002c0c13181038780F552f0eC1B72e8C720147E6)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x002c0c13181038780F552f0eC1B72e8C720147E6)
 */
export const erc6551RegistryV3Address = {
  1: '0x002c0c13181038780F552f0eC1B72e8C720147E6',
  5: '0x002c0c13181038780F552f0eC1B72e8C720147E6',
} as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x002c0c13181038780F552f0eC1B72e8C720147E6)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x002c0c13181038780F552f0eC1B72e8C720147E6)
 */
export const erc6551RegistryV3Config = {
  address: erc6551RegistryV3Address,
  abi: erc6551RegistryV3ABI,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// WETH_
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6)
 */
export const wethABI = [
  {
    constant: true,
    payable: false,
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'string' }],
  },
  {
    constant: false,
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'guy', type: 'address' },
      { name: 'wad', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    constant: true,
    payable: false,
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    constant: false,
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'src', type: 'address' },
      { name: 'dst', type: 'address' },
      { name: 'wad', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    constant: false,
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'wad', type: 'uint256' }],
    name: 'withdraw',
    outputs: [],
  },
  {
    constant: true,
    payable: false,
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
  },
  {
    constant: true,
    payable: false,
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    constant: true,
    payable: false,
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
  },
  {
    constant: false,
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'dst', type: 'address' },
      { name: 'wad', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    constant: false,
    payable: true,
    stateMutability: 'payable',
    type: 'function',
    inputs: [],
    name: 'deposit',
    outputs: [],
  },
  {
    constant: true,
    payable: false,
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: '', type: 'address' },
      { name: '', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
  },
  { payable: true, stateMutability: 'payable', type: 'fallback' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'src', type: 'address', indexed: true },
      { name: 'guy', type: 'address', indexed: true },
      { name: 'wad', type: 'uint256', indexed: false },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'src', type: 'address', indexed: true },
      { name: 'dst', type: 'address', indexed: true },
      { name: 'wad', type: 'uint256', indexed: false },
    ],
    name: 'Transfer',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'dst', type: 'address', indexed: true },
      { name: 'wad', type: 'uint256', indexed: false },
    ],
    name: 'Deposit',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'src', type: 'address', indexed: true },
      { name: 'wad', type: 'uint256', indexed: false },
    ],
    name: 'Withdrawal',
  },
] as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6)
 */
export const wethAddress = {
  1: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  5: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
} as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6)
 */
export const wethConfig = { address: wethAddress, abi: wethABI } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Zora1155_
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export const zora1155ABI = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [
      { name: '_mintFeeRecipient', internalType: 'address', type: 'address' },
      { name: '_upgradeGate', internalType: 'address', type: 'address' },
      { name: '_protocolRewards', internalType: 'address', type: 'address' },
    ],
  },
  { type: 'error', inputs: [], name: 'ADDRESS_DELEGATECALL_TO_NON_CONTRACT' },
  { type: 'error', inputs: [], name: 'ADDRESS_LOW_LEVEL_CALL_FAILED' },
  {
    type: 'error',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'user', internalType: 'address', type: 'address' },
    ],
    name: 'Burn_NotOwnerOrApproved',
  },
  { type: 'error', inputs: [], name: 'CREATOR_FUNDS_RECIPIENT_NOT_SET' },
  {
    type: 'error',
    inputs: [{ name: 'reason', internalType: 'bytes', type: 'bytes' }],
    name: 'CallFailed',
  },
  { type: 'error', inputs: [], name: 'Call_TokenIdMismatch' },
  {
    type: 'error',
    inputs: [
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'quantity', internalType: 'uint256', type: 'uint256' },
      { name: 'totalMinted', internalType: 'uint256', type: 'uint256' },
      { name: 'maxSupply', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'CannotMintMoreTokens',
  },
  {
    type: 'error',
    inputs: [{ name: 'proposedAddress', internalType: 'address', type: 'address' }],
    name: 'Config_TransferHookNotSupported',
  },
  { type: 'error', inputs: [], name: 'ERC1155_ACCOUNTS_AND_IDS_LENGTH_MISMATCH' },
  { type: 'error', inputs: [], name: 'ERC1155_ADDRESS_ZERO_IS_NOT_A_VALID_OWNER' },
  { type: 'error', inputs: [], name: 'ERC1155_BURN_AMOUNT_EXCEEDS_BALANCE' },
  { type: 'error', inputs: [], name: 'ERC1155_BURN_FROM_ZERO_ADDRESS' },
  { type: 'error', inputs: [], name: 'ERC1155_CALLER_IS_NOT_TOKEN_OWNER_OR_APPROVED' },
  { type: 'error', inputs: [], name: 'ERC1155_ERC1155RECEIVER_REJECTED_TOKENS' },
  { type: 'error', inputs: [], name: 'ERC1155_IDS_AND_AMOUNTS_LENGTH_MISMATCH' },
  { type: 'error', inputs: [], name: 'ERC1155_INSUFFICIENT_BALANCE_FOR_TRANSFER' },
  { type: 'error', inputs: [], name: 'ERC1155_MINT_TO_ZERO_ADDRESS' },
  { type: 'error', inputs: [], name: 'ERC1155_SETTING_APPROVAL_FOR_SELF' },
  {
    type: 'error',
    inputs: [],
    name: 'ERC1155_TRANSFER_TO_NON_ERC1155RECEIVER_IMPLEMENTER',
  },
  { type: 'error', inputs: [], name: 'ERC1155_TRANSFER_TO_ZERO_ADDRESS' },
  { type: 'error', inputs: [], name: 'ERC1967_NEW_IMPL_NOT_CONTRACT' },
  { type: 'error', inputs: [], name: 'ERC1967_NEW_IMPL_NOT_UUPS' },
  { type: 'error', inputs: [], name: 'ERC1967_UNSUPPORTED_PROXIABLEUUID' },
  {
    type: 'error',
    inputs: [
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ETHWithdrawFailed',
  },
  { type: 'error', inputs: [], name: 'FUNCTION_MUST_BE_CALLED_THROUGH_ACTIVE_PROXY' },
  { type: 'error', inputs: [], name: 'FUNCTION_MUST_BE_CALLED_THROUGH_DELEGATECALL' },
  {
    type: 'error',
    inputs: [
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'contractValue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'FundsWithdrawInsolvent',
  },
  { type: 'error', inputs: [], name: 'INITIALIZABLE_CONTRACT_ALREADY_INITIALIZED' },
  { type: 'error', inputs: [], name: 'INITIALIZABLE_CONTRACT_IS_NOT_INITIALIZING' },
  { type: 'error', inputs: [], name: 'INVALID_ADDRESS_ZERO' },
  { type: 'error', inputs: [], name: 'INVALID_ETH_AMOUNT' },
  { type: 'error', inputs: [], name: 'InvalidMintSchedule' },
  { type: 'error', inputs: [], name: 'MintNotYetStarted' },
  { type: 'error', inputs: [], name: 'Mint_InsolventSaleTransfer' },
  { type: 'error', inputs: [], name: 'Mint_TokenIDMintNotAllowed' },
  { type: 'error', inputs: [], name: 'Mint_UnknownCommand' },
  { type: 'error', inputs: [], name: 'Mint_ValueTransferFail' },
  { type: 'error', inputs: [], name: 'NewOwnerNeedsToBeAdmin' },
  {
    type: 'error',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'NoRendererForToken',
  },
  { type: 'error', inputs: [], name: 'ONLY_CREATE_REFERRAL' },
  { type: 'error', inputs: [], name: 'PremintDeleted' },
  {
    type: 'error',
    inputs: [
      { name: 'caller', internalType: 'address', type: 'address' },
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ProtocolRewardsWithdrawFailed',
  },
  {
    type: 'error',
    inputs: [{ name: 'renderer', internalType: 'address', type: 'address' }],
    name: 'RendererNotValid',
  },
  { type: 'error', inputs: [], name: 'Renderer_NotValidRendererContract' },
  {
    type: 'error',
    inputs: [{ name: 'targetContract', internalType: 'address', type: 'address' }],
    name: 'Sale_CannotCallNonSalesContract',
  },
  {
    type: 'error',
    inputs: [
      { name: 'expected', internalType: 'uint256', type: 'uint256' },
      { name: 'actual', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'TokenIdMismatch',
  },
  {
    type: 'error',
    inputs: [],
    name: 'UUPS_UPGRADEABLE_MUST_NOT_BE_CALLED_THROUGH_DELEGATECALL',
  },
  {
    type: 'error',
    inputs: [
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'role', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'UserMissingRoleForToken',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousAdmin', internalType: 'address', type: 'address', indexed: false },
      { name: 'newAdmin', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'AdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'account', internalType: 'address', type: 'address', indexed: true },
      { name: 'operator', internalType: 'address', type: 'address', indexed: true },
      { name: 'approved', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'ApprovalForAll',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'beacon', internalType: 'address', type: 'address', indexed: true }],
    name: 'BeaconUpgraded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'updater', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'updateType',
        internalType: 'enum IZoraCreator1155.ConfigUpdate',
        type: 'uint8',
        indexed: true,
      },
      {
        name: 'newConfig',
        internalType: 'struct IZoraCreator1155TypesV1.ContractConfig',
        type: 'tuple',
        components: [
          { name: 'owner', internalType: 'address', type: 'address' },
          { name: '__gap1', internalType: 'uint96', type: 'uint96' },
          { name: 'fundsRecipient', internalType: 'address payable', type: 'address' },
          { name: '__gap2', internalType: 'uint96', type: 'uint96' },
          {
            name: 'transferHook',
            internalType: 'contract ITransferHookReceiver',
            type: 'address',
          },
          { name: '__gap3', internalType: 'uint96', type: 'uint96' },
        ],
        indexed: false,
      },
    ],
    name: 'ConfigUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'updater', internalType: 'address', type: 'address', indexed: true },
      { name: 'uri', internalType: 'string', type: 'string', indexed: false },
      { name: 'name', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'ContractMetadataUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'renderer',
        internalType: 'contract IRenderer1155',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'ContractRendererUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'structHash', internalType: 'bytes32', type: 'bytes32', indexed: false },
      { name: 'domainName', internalType: 'string', type: 'string', indexed: false },
      { name: 'version', internalType: 'string', type: 'string', indexed: false },
      { name: 'creator', internalType: 'address', type: 'address', indexed: false },
      { name: 'signature', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'CreatorAttribution',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'version', internalType: 'uint8', type: 'uint8', indexed: false }],
    name: 'Initialized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'lastOwner', internalType: 'address', type: 'address', indexed: false },
      { name: 'newOwner', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address', indexed: true },
      { name: 'minter', internalType: 'address', type: 'address', indexed: true },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'quantity', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'value', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'Purchased',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'tokenId', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'renderer', internalType: 'address', type: 'address', indexed: true },
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'RendererUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'tokenId', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'sender', internalType: 'address', type: 'address', indexed: true },
      { name: 'newURI', internalType: 'string', type: 'string', indexed: false },
      { name: 'maxSupply', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'SetupNewToken',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address', indexed: true },
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      { name: 'ids', internalType: 'uint256[]', type: 'uint256[]', indexed: false },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]', indexed: false },
    ],
    name: 'TransferBatch',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address', indexed: true },
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'value', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'TransferSingle',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'value', internalType: 'string', type: 'string', indexed: false },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true },
    ],
    name: 'URI',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'tokenId', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      { name: 'permissions', internalType: 'uint256', type: 'uint256', indexed: true },
    ],
    name: 'UpdatedPermissions',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'tokenId', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'user', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'configuration',
        internalType: 'struct ICreatorRoyaltiesControl.RoyaltyConfiguration',
        type: 'tuple',
        components: [
          { name: 'royaltyMintSchedule', internalType: 'uint32', type: 'uint32' },
          { name: 'royaltyBPS', internalType: 'uint32', type: 'uint32' },
          { name: 'royaltyRecipient', internalType: 'address', type: 'address' },
        ],
        indexed: false,
      },
    ],
    name: 'UpdatedRoyalties',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256', indexed: true },
      {
        name: 'tokenData',
        internalType: 'struct IZoraCreator1155TypesV1.TokenData',
        type: 'tuple',
        components: [
          { name: 'uri', internalType: 'string', type: 'string' },
          { name: 'maxSupply', internalType: 'uint256', type: 'uint256' },
          { name: 'totalMinted', internalType: 'uint256', type: 'uint256' },
        ],
        indexed: false,
      },
    ],
    name: 'UpdatedToken',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'implementation', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'Upgraded',
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'CONTRACT_BASE_ID',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'PERMISSION_BIT_ADMIN',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'PERMISSION_BIT_FUNDS_MANAGER',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'PERMISSION_BIT_METADATA',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'PERMISSION_BIT_MINTER',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'PERMISSION_BIT_SALES',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'permissionBits', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'addPermission',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'quantity', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'adminMint',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'tokenIds', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'quantities', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'adminMintBatch',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'lastTokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'assumeLastTokenIdMatches',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'accounts', internalType: 'address[]', type: 'address[]' },
      { name: 'ids', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'balanceOfBatch',
    outputs: [{ name: 'batchBalances', internalType: 'uint256[]', type: 'uint256[]' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'tokenIds', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'amounts', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    name: 'burnBatch',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'callRenderer',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'salesConfig', internalType: 'contract IMinter1155', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'callSale',
    outputs: [],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [{ name: 'numTokens', internalType: 'uint256', type: 'uint256' }],
    name: 'computeFreeMintRewards',
    outputs: [
      {
        name: '',
        internalType: 'struct RewardsSettings',
        type: 'tuple',
        components: [
          { name: 'creatorReward', internalType: 'uint256', type: 'uint256' },
          { name: 'createReferralReward', internalType: 'uint256', type: 'uint256' },
          { name: 'mintReferralReward', internalType: 'uint256', type: 'uint256' },
          { name: 'firstMinterReward', internalType: 'uint256', type: 'uint256' },
          { name: 'zoraReward', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [{ name: 'numTokens', internalType: 'uint256', type: 'uint256' }],
    name: 'computePaidMintRewards',
    outputs: [
      {
        name: '',
        internalType: 'struct RewardsSettings',
        type: 'tuple',
        components: [
          { name: 'creatorReward', internalType: 'uint256', type: 'uint256' },
          { name: 'createReferralReward', internalType: 'uint256', type: 'uint256' },
          { name: 'mintReferralReward', internalType: 'uint256', type: 'uint256' },
          { name: 'firstMinterReward', internalType: 'uint256', type: 'uint256' },
          { name: 'zoraReward', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [{ name: 'numTokens', internalType: 'uint256', type: 'uint256' }],
    name: 'computeTotalReward',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'config',
    outputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: '__gap1', internalType: 'uint96', type: 'uint96' },
      { name: 'fundsRecipient', internalType: 'address payable', type: 'address' },
      { name: '__gap2', internalType: 'uint96', type: 'uint96' },
      {
        name: 'transferHook',
        internalType: 'contract ITransferHookReceiver',
        type: 'address',
      },
      { name: '__gap3', internalType: 'uint96', type: 'uint96' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'contractURI',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [],
    name: 'contractVersion',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'createReferrals',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'customRenderers',
    outputs: [{ name: '', internalType: 'contract IRenderer1155', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: 'premintConfig',
        internalType: 'struct PremintConfig',
        type: 'tuple',
        components: [
          {
            name: 'tokenConfig',
            internalType: 'struct TokenCreationConfig',
            type: 'tuple',
            components: [
              { name: 'tokenURI', internalType: 'string', type: 'string' },
              { name: 'maxSupply', internalType: 'uint256', type: 'uint256' },
              { name: 'maxTokensPerAddress', internalType: 'uint64', type: 'uint64' },
              { name: 'pricePerToken', internalType: 'uint96', type: 'uint96' },
              { name: 'mintStart', internalType: 'uint64', type: 'uint64' },
              { name: 'mintDuration', internalType: 'uint64', type: 'uint64' },
              { name: 'royaltyMintSchedule', internalType: 'uint32', type: 'uint32' },
              { name: 'royaltyBPS', internalType: 'uint32', type: 'uint32' },
              { name: 'royaltyRecipient', internalType: 'address', type: 'address' },
              { name: 'fixedPriceMinter', internalType: 'address', type: 'address' },
            ],
          },
          { name: 'uid', internalType: 'uint32', type: 'uint32' },
          { name: 'version', internalType: 'uint32', type: 'uint32' },
          { name: 'deleted', internalType: 'bool', type: 'bool' },
        ],
      },
      { name: 'signature', internalType: 'bytes', type: 'bytes' },
      { name: 'sender', internalType: 'address', type: 'address' },
    ],
    name: 'delegateSetupNewToken',
    outputs: [{ name: 'newTokenId', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
    name: 'delegatedTokenId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'firstMinters',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getCreatorRewardRecipient',
    outputs: [{ name: '', internalType: 'address payable', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'getCustomRenderer',
    outputs: [
      { name: 'customRenderer', internalType: 'contract IRenderer1155', type: 'address' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'getRoyalties',
    outputs: [
      {
        name: '',
        internalType: 'struct ICreatorRoyaltiesControl.RoyaltyConfiguration',
        type: 'tuple',
        components: [
          { name: 'royaltyMintSchedule', internalType: 'uint32', type: 'uint32' },
          { name: 'royaltyBPS', internalType: 'uint32', type: 'uint32' },
          { name: 'royaltyRecipient', internalType: 'address', type: 'address' },
        ],
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'getTokenInfo',
    outputs: [
      {
        name: '',
        internalType: 'struct IZoraCreator1155TypesV1.TokenData',
        type: 'tuple',
        components: [
          { name: 'uri', internalType: 'string', type: 'string' },
          { name: 'maxSupply', internalType: 'uint256', type: 'uint256' },
          { name: 'totalMinted', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'implementation',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'contractName', internalType: 'string', type: 'string' },
      { name: 'newContractURI', internalType: 'string', type: 'string' },
      {
        name: 'defaultRoyaltyConfiguration',
        internalType: 'struct ICreatorRoyaltiesControl.RoyaltyConfiguration',
        type: 'tuple',
        components: [
          { name: 'royaltyMintSchedule', internalType: 'uint32', type: 'uint32' },
          { name: 'royaltyBPS', internalType: 'uint32', type: 'uint32' },
          { name: 'royaltyRecipient', internalType: 'address', type: 'address' },
        ],
      },
      { name: 'defaultAdmin', internalType: 'address payable', type: 'address' },
      { name: 'setupActions', internalType: 'bytes[]', type: 'bytes[]' },
    ],
    name: 'initialize',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'role', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'isAdminOrRole',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'operator', internalType: 'address', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'metadataRendererContract',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'minter', internalType: 'contract IMinter1155', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'quantity', internalType: 'uint256', type: 'uint256' },
      { name: 'minterArguments', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'mint',
    outputs: [],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [],
    name: 'mintFee',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'minter', internalType: 'contract IMinter1155', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'quantity', internalType: 'uint256', type: 'uint256' },
      { name: 'minterArguments', internalType: 'bytes', type: 'bytes' },
      { name: 'mintReferral', internalType: 'address', type: 'address' },
    ],
    name: 'mintWithRewards',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'data', internalType: 'bytes[]', type: 'bytes[]' }],
    name: 'multicall',
    outputs: [{ name: 'results', internalType: 'bytes[]', type: 'bytes[]' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'nextTokenId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'address', type: 'address' },
    ],
    name: 'permissions',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'proxiableUUID',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'user', internalType: 'address', type: 'address' },
      { name: 'permissionBits', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'removePermission',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'royalties',
    outputs: [
      { name: 'royaltyMintSchedule', internalType: 'uint32', type: 'uint32' },
      { name: 'royaltyBPS', internalType: 'uint32', type: 'uint32' },
      { name: 'royaltyRecipient', internalType: 'address', type: 'address' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'salePrice', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'royaltyInfo',
    outputs: [
      { name: 'receiver', internalType: 'address', type: 'address' },
      { name: 'royaltyAmount', internalType: 'uint256', type: 'uint256' },
    ],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'ids', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'amounts', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeBatchTransferFrom',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'approved', internalType: 'bool', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'fundsRecipient', internalType: 'address payable', type: 'address' },
    ],
    name: 'setFundsRecipient',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'setOwner',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'renderer', internalType: 'contract IRenderer1155', type: 'address' },
    ],
    name: 'setTokenMetadataRenderer',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: 'transferHook',
        internalType: 'contract ITransferHookReceiver',
        type: 'address',
      },
    ],
    name: 'setTransferHook',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'newURI', internalType: 'string', type: 'string' },
      { name: 'maxSupply', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'setupNewToken',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'newURI', internalType: 'string', type: 'string' },
      { name: 'maxSupply', internalType: 'uint256', type: 'uint256' },
      { name: 'createReferral', internalType: 'address', type: 'address' },
    ],
    name: 'setupNewTokenWithCreateReferral',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_newURI', internalType: 'string', type: 'string' },
      { name: '_newName', internalType: 'string', type: 'string' },
    ],
    name: 'updateContractMetadata',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'recipient', internalType: 'address', type: 'address' },
    ],
    name: 'updateCreateReferral',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      {
        name: 'newConfiguration',
        internalType: 'struct ICreatorRoyaltiesControl.RoyaltyConfiguration',
        type: 'tuple',
        components: [
          { name: 'royaltyMintSchedule', internalType: 'uint32', type: 'uint32' },
          { name: 'royaltyBPS', internalType: 'uint32', type: 'uint32' },
          { name: 'royaltyRecipient', internalType: 'address', type: 'address' },
        ],
      },
    ],
    name: 'updateRoyaltiesForToken',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: '_newURI', internalType: 'string', type: 'string' },
    ],
    name: 'updateTokenURI',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'newImplementation', internalType: 'address', type: 'address' }],
    name: 'upgradeTo',
    outputs: [],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'uri',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'withdraw',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'withdrawRewards',
    outputs: [],
  },
] as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export const zora1155Address = {
  1: '0x4482c5929618b848a46E3DA830A3D71085A5DE07',
  5: '0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA',
} as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export const zora1155Config = { address: zora1155Address, abi: zora1155ABI } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Zora721Drop_
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export const zora721DropABI = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [
      { name: '_zoraERC721TransferHelper', internalType: 'address', type: 'address' },
      {
        name: '_factoryUpgradeGate',
        internalType: 'contract IFactoryUpgradeGate',
        type: 'address',
      },
      { name: '_marketFilterDAOAddress', internalType: 'address', type: 'address' },
      { name: '_mintFeeAmount', internalType: 'uint256', type: 'uint256' },
      { name: '_mintFeeRecipient', internalType: 'address payable', type: 'address' },
      { name: '_protocolRewards', internalType: 'address', type: 'address' },
    ],
  },
  {
    type: 'error',
    inputs: [{ name: 'role', internalType: 'bytes32', type: 'bytes32' }],
    name: 'Access_MissingRoleOrAdmin',
  },
  { type: 'error', inputs: [], name: 'Access_OnlyAdmin' },
  { type: 'error', inputs: [], name: 'Access_WithdrawNotAllowed' },
  {
    type: 'error',
    inputs: [{ name: 'proposedAddress', internalType: 'address', type: 'address' }],
    name: 'Admin_InvalidUpgradeAddress',
  },
  { type: 'error', inputs: [], name: 'Admin_UnableToFinalizeNotOpenEdition' },
  { type: 'error', inputs: [], name: 'ApprovalCallerNotOwnerNorApproved' },
  { type: 'error', inputs: [], name: 'ApprovalQueryForNonexistentToken' },
  { type: 'error', inputs: [], name: 'ApprovalToCurrentOwner' },
  { type: 'error', inputs: [], name: 'ApproveToCaller' },
  { type: 'error', inputs: [], name: 'BalanceQueryForZeroAddress' },
  { type: 'error', inputs: [], name: 'CREATOR_FUNDS_RECIPIENT_NOT_SET' },
  { type: 'error', inputs: [], name: 'ExternalMetadataRenderer_CallFailed' },
  { type: 'error', inputs: [], name: 'INVALID_ADDRESS_ZERO' },
  { type: 'error', inputs: [], name: 'INVALID_ETH_AMOUNT' },
  { type: 'error', inputs: [], name: 'InvalidMintSchedule' },
  { type: 'error', inputs: [], name: 'MarketFilterDAOAddressNotSupportedForChain' },
  { type: 'error', inputs: [], name: 'MintFee_FundsSendFailure' },
  { type: 'error', inputs: [], name: 'MintToZeroAddress' },
  { type: 'error', inputs: [], name: 'MintZeroQuantity' },
  { type: 'error', inputs: [], name: 'Mint_SoldOut' },
  { type: 'error', inputs: [], name: 'ONLY_CREATE_REFERRAL' },
  { type: 'error', inputs: [], name: 'ONLY_OWNER' },
  { type: 'error', inputs: [], name: 'ONLY_PENDING_OWNER' },
  {
    type: 'error',
    inputs: [{ name: 'operator', internalType: 'address', type: 'address' }],
    name: 'OperatorNotAllowed',
  },
  { type: 'error', inputs: [], name: 'OwnerQueryForNonexistentToken' },
  { type: 'error', inputs: [], name: 'Presale_Inactive' },
  { type: 'error', inputs: [], name: 'Presale_MerkleNotApproved' },
  { type: 'error', inputs: [], name: 'Presale_TooManyForAddress' },
  { type: 'error', inputs: [], name: 'ProtocolRewards_WithdrawSendFailure' },
  { type: 'error', inputs: [], name: 'Purchase_TooManyForAddress' },
  {
    type: 'error',
    inputs: [{ name: 'correctPrice', internalType: 'uint256', type: 'uint256' }],
    name: 'Purchase_WrongPrice',
  },
  { type: 'error', inputs: [], name: 'RemoteOperatorFilterRegistryCallFailed' },
  { type: 'error', inputs: [], name: 'Sale_Inactive' },
  {
    type: 'error',
    inputs: [{ name: 'maxRoyaltyBPS', internalType: 'uint16', type: 'uint16' }],
    name: 'Setup_RoyaltyPercentageTooHigh',
  },
  { type: 'error', inputs: [], name: 'TransferCallerNotOwnerNorApproved' },
  { type: 'error', inputs: [], name: 'TransferFromIncorrectOwner' },
  { type: 'error', inputs: [], name: 'TransferToNonERC721ReceiverImplementer' },
  { type: 'error', inputs: [], name: 'TransferToZeroAddress' },
  { type: 'error', inputs: [], name: 'URIQueryForNonexistentToken' },
  { type: 'error', inputs: [], name: 'Withdraw_FundsSendFailure' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousAdmin', internalType: 'address', type: 'address', indexed: false },
      { name: 'newAdmin', internalType: 'address', type: 'address', indexed: false },
    ],
    name: 'AdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address', indexed: true },
      { name: 'approved', internalType: 'address', type: 'address', indexed: true },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256', indexed: true },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address', indexed: true },
      { name: 'operator', internalType: 'address', type: 'address', indexed: true },
      { name: 'approved', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'ApprovalForAll',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '_fromTokenId', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: '_toTokenId', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'BatchMetadataUpdate',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [{ name: 'beacon', internalType: 'address', type: 'address', indexed: true }],
    name: 'BeaconUpgraded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'source', internalType: 'address', type: 'address', indexed: true },
      { name: 'amount', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'FundsReceived',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'newAddress', internalType: 'address', type: 'address', indexed: true },
      { name: 'changedBy', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'FundsRecipientChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'withdrawnBy', internalType: 'address', type: 'address', indexed: true },
      { name: 'withdrawnTo', internalType: 'address', type: 'address', indexed: true },
      { name: 'amount', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'feeRecipient', internalType: 'address', type: 'address', indexed: false },
      { name: 'feeAmount', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'FundsWithdrawn',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: '_tokenId', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'MetadataUpdate',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address', indexed: true },
      { name: 'tokenContract', internalType: 'address', type: 'address', indexed: true },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'quantity', internalType: 'uint256', type: 'uint256', indexed: false },
      { name: 'comment', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'MintComment',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'mintFeeAmount', internalType: 'uint256', type: 'uint256', indexed: false },
      {
        name: 'mintFeeRecipient',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      { name: 'success', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'MintFeePayout',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address', indexed: true },
      { name: 'numberOfMints', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'OpenMintFinalized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousOwner', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'potentialNewOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnerCanceled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousOwner', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'potentialNewOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnerPending',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'previousOwner', internalType: 'address', type: 'address', indexed: true },
      { name: 'newOwner', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'previousAdminRole',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true,
      },
      { name: 'newAdminRole', internalType: 'bytes32', type: 'bytes32', indexed: true },
    ],
    name: 'RoleAdminChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'account', internalType: 'address', type: 'address', indexed: true },
      { name: 'sender', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'RoleGranted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      { name: 'account', internalType: 'address', type: 'address', indexed: true },
      { name: 'sender', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'RoleRevoked',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      { name: 'quantity', internalType: 'uint256', type: 'uint256', indexed: true },
      { name: 'pricePerToken', internalType: 'uint256', type: 'uint256', indexed: true },
      {
        name: 'firstPurchasedTokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Sale',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'changedBy', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'SalesConfigChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256', indexed: true },
    ],
    name: 'Transfer',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address', indexed: false },
      {
        name: 'renderer',
        internalType: 'contract IMetadataRenderer',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'UpdatedMetadataRenderer',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'implementation', internalType: 'address', type: 'address', indexed: true },
    ],
    name: 'Upgraded',
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'DEFAULT_ADMIN_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'MINTER_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'SALES_MANAGER_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'quantity', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'adminMint',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'recipients', internalType: 'address[]', type: 'address[]' }],
    name: 'adminMintAirdrop',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'burn',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'data', internalType: 'bytes', type: 'bytes' }],
    name: 'callMetadataRenderer',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [{ name: 'numTokens', internalType: 'uint256', type: 'uint256' }],
    name: 'computeFreeMintRewards',
    outputs: [
      {
        name: '',
        internalType: 'struct RewardsSettings',
        type: 'tuple',
        components: [
          { name: 'creatorReward', internalType: 'uint256', type: 'uint256' },
          { name: 'createReferralReward', internalType: 'uint256', type: 'uint256' },
          { name: 'mintReferralReward', internalType: 'uint256', type: 'uint256' },
          { name: 'firstMinterReward', internalType: 'uint256', type: 'uint256' },
          { name: 'zoraReward', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [{ name: 'numTokens', internalType: 'uint256', type: 'uint256' }],
    name: 'computePaidMintRewards',
    outputs: [
      {
        name: '',
        internalType: 'struct RewardsSettings',
        type: 'tuple',
        components: [
          { name: 'creatorReward', internalType: 'uint256', type: 'uint256' },
          { name: 'createReferralReward', internalType: 'uint256', type: 'uint256' },
          { name: 'mintReferralReward', internalType: 'uint256', type: 'uint256' },
          { name: 'firstMinterReward', internalType: 'uint256', type: 'uint256' },
          { name: 'zoraReward', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
  },
  {
    stateMutability: 'pure',
    type: 'function',
    inputs: [{ name: 'numTokens', internalType: 'uint256', type: 'uint256' }],
    name: 'computeTotalReward',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'config',
    outputs: [
      {
        name: 'metadataRenderer',
        internalType: 'contract IMetadataRenderer',
        type: 'address',
      },
      { name: 'editionSize', internalType: 'uint64', type: 'uint64' },
      { name: 'royaltyBPS', internalType: 'uint16', type: 'uint16' },
      { name: 'fundsRecipient', internalType: 'address payable', type: 'address' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'contractURI',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'contractVersion',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'createReferral',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'factoryUpgradeGate',
    outputs: [
      { name: '', internalType: 'contract IFactoryUpgradeGate', type: 'address' },
    ],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'finalizeOpenEdition',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'getApproved',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'role', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getRoleAdmin',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'grantRole',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'hasRole',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_contractName', internalType: 'string', type: 'string' },
      { name: '_contractSymbol', internalType: 'string', type: 'string' },
      { name: '_initialOwner', internalType: 'address', type: 'address' },
      { name: '_fundsRecipient', internalType: 'address payable', type: 'address' },
      { name: '_editionSize', internalType: 'uint64', type: 'uint64' },
      { name: '_royaltyBPS', internalType: 'uint16', type: 'uint16' },
      { name: '_setupCalls', internalType: 'bytes[]', type: 'bytes[]' },
      {
        name: '_metadataRenderer',
        internalType: 'contract IMetadataRenderer',
        type: 'address',
      },
      { name: '_metadataRendererInit', internalType: 'bytes', type: 'bytes' },
      { name: '_createReferral', internalType: 'address', type: 'address' },
    ],
    name: 'initialize',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'user', internalType: 'address', type: 'address' }],
    name: 'isAdmin',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'nftOwner', internalType: 'address', type: 'address' },
      { name: 'operator', internalType: 'address', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'enable', internalType: 'bool', type: 'bool' }],
    name: 'manageMarketFilterDAOSubscription',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'marketFilterDAOAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'metadataRenderer',
    outputs: [{ name: '', internalType: 'contract IMetadataRenderer', type: 'address' }],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'quantity', internalType: 'uint256', type: 'uint256' },
      { name: 'comment', internalType: 'string', type: 'string' },
      { name: 'mintReferral', internalType: 'address', type: 'address' },
    ],
    name: 'mintWithRewards',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'minter', internalType: 'address', type: 'address' }],
    name: 'mintedPerAddress',
    outputs: [
      {
        name: '',
        internalType: 'struct IERC721Drop.AddressMintDetails',
        type: 'tuple',
        components: [
          { name: 'totalMints', internalType: 'uint256', type: 'uint256' },
          { name: 'presaleMints', internalType: 'uint256', type: 'uint256' },
          { name: 'publicMints', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'data', internalType: 'bytes[]', type: 'bytes[]' }],
    name: 'multicall',
    outputs: [{ name: 'results', internalType: 'bytes[]', type: 'bytes[]' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'presaleMintsByAddress',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'proxiableUUID',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [{ name: 'quantity', internalType: 'uint256', type: 'uint256' }],
    name: 'purchase',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'quantity', internalType: 'uint256', type: 'uint256' },
      { name: 'maxQuantity', internalType: 'uint256', type: 'uint256' },
      { name: 'pricePerToken', internalType: 'uint256', type: 'uint256' },
      { name: 'merkleProof', internalType: 'bytes32[]', type: 'bytes32[]' },
    ],
    name: 'purchasePresale',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'quantity', internalType: 'uint256', type: 'uint256' },
      { name: 'maxQuantity', internalType: 'uint256', type: 'uint256' },
      { name: 'pricePerToken', internalType: 'uint256', type: 'uint256' },
      { name: 'merkleProof', internalType: 'bytes32[]', type: 'bytes32[]' },
      { name: 'comment', internalType: 'string', type: 'string' },
    ],
    name: 'purchasePresaleWithComment',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'quantity', internalType: 'uint256', type: 'uint256' },
      { name: 'maxQuantity', internalType: 'uint256', type: 'uint256' },
      { name: 'pricePerToken', internalType: 'uint256', type: 'uint256' },
      { name: 'merkleProof', internalType: 'bytes32[]', type: 'bytes32[]' },
      { name: 'comment', internalType: 'string', type: 'string' },
      { name: 'mintReferral', internalType: 'address', type: 'address' },
    ],
    name: 'purchasePresaleWithRewards',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'quantity', internalType: 'uint256', type: 'uint256' },
      { name: 'comment', internalType: 'string', type: 'string' },
    ],
    name: 'purchaseWithComment',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'quantity', internalType: 'uint256', type: 'uint256' },
      { name: 'comment', internalType: 'string', type: 'string' },
    ],
    name: 'purchaseWithRecipient',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'renounceRole',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'revokeRole',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '_salePrice', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'royaltyInfo',
    outputs: [
      { name: 'receiver', internalType: 'address', type: 'address' },
      { name: 'royaltyAmount', internalType: 'uint256', type: 'uint256' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'royaltyMintSchedule',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: '_data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'saleDetails',
    outputs: [
      {
        name: '',
        internalType: 'struct IERC721Drop.SaleDetails',
        type: 'tuple',
        components: [
          { name: 'publicSaleActive', internalType: 'bool', type: 'bool' },
          { name: 'presaleActive', internalType: 'bool', type: 'bool' },
          { name: 'publicSalePrice', internalType: 'uint256', type: 'uint256' },
          { name: 'publicSaleStart', internalType: 'uint64', type: 'uint64' },
          { name: 'publicSaleEnd', internalType: 'uint64', type: 'uint64' },
          { name: 'presaleStart', internalType: 'uint64', type: 'uint64' },
          { name: 'presaleEnd', internalType: 'uint64', type: 'uint64' },
          { name: 'presaleMerkleRoot', internalType: 'bytes32', type: 'bytes32' },
          { name: 'maxSalePurchasePerAddress', internalType: 'uint256', type: 'uint256' },
          { name: 'totalMinted', internalType: 'uint256', type: 'uint256' },
          { name: 'maxSupply', internalType: 'uint256', type: 'uint256' },
        ],
      },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'salesConfig',
    outputs: [
      { name: 'publicSalePrice', internalType: 'uint104', type: 'uint104' },
      { name: 'maxSalePurchasePerAddress', internalType: 'uint32', type: 'uint32' },
      { name: 'publicSaleStart', internalType: 'uint64', type: 'uint64' },
      { name: 'publicSaleEnd', internalType: 'uint64', type: 'uint64' },
      { name: 'presaleStart', internalType: 'uint64', type: 'uint64' },
      { name: 'presaleEnd', internalType: 'uint64', type: 'uint64' },
      { name: 'presaleMerkleRoot', internalType: 'bytes32', type: 'bytes32' },
    ],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'approved', internalType: 'bool', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'newRecipientAddress', internalType: 'address payable', type: 'address' },
    ],
    name: 'setFundsRecipient',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      {
        name: 'newRenderer',
        internalType: 'contract IMetadataRenderer',
        type: 'address',
      },
      { name: 'setupRenderer', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'setMetadataRenderer',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'setOwner',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'publicSalePrice', internalType: 'uint104', type: 'uint104' },
      { name: 'maxSalePurchasePerAddress', internalType: 'uint32', type: 'uint32' },
      { name: 'publicSaleStart', internalType: 'uint64', type: 'uint64' },
      { name: 'publicSaleEnd', internalType: 'uint64', type: 'uint64' },
      { name: 'presaleStart', internalType: 'uint64', type: 'uint64' },
      { name: 'presaleEnd', internalType: 'uint64', type: 'uint64' },
      { name: 'presaleMerkleRoot', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'setSaleConfiguration',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'recipient', internalType: 'address', type: 'address' }],
    name: 'updateCreateReferral',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'args', internalType: 'bytes', type: 'bytes' }],
    name: 'updateMarketFilterSettings',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'newSchedule', internalType: 'uint32', type: 'uint32' }],
    name: 'updateRoyaltyMintSchedule',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: 'newImplementation', internalType: 'address', type: 'address' }],
    name: 'upgradeTo',
    outputs: [],
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'newImplementation', internalType: 'address', type: 'address' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'withdraw',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'withdrawRewards',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'zoraERC721TransferHelper',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'quantity', internalType: 'uint256', type: 'uint256' }],
    name: 'zoraFeeForAmount',
    outputs: [
      { name: 'recipient', internalType: 'address payable', type: 'address' },
      { name: 'fee', internalType: 'uint256', type: 'uint256' },
    ],
  },
  { stateMutability: 'payable', type: 'receive' },
] as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export const zora721DropAddress = {
  1: '0x7C74dfe39976dc395529c14e54a597809980e01C',
  5: '0xe4c17055048aEe01D0d122804816fEe5E6ac4A67',
} as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export const zora721DropConfig = {
  address: zora721DropAddress,
  abi: zora721DropABI,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc6551AccountV2ABI}__.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2D25602551487C3f3354dD80D76D54383A243358)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2D25602551487C3f3354dD80D76D54383A243358)
 */
export function useErc6551AccountV2Write<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof erc6551AccountV2Address
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof erc6551AccountV2ABI, string>['request']['abi'],
        TFunctionName,
        TMode
      > & { address?: Address; chainId?: TChainId }
    : UseContractWriteConfig<typeof erc6551AccountV2ABI, TFunctionName, TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof erc6551AccountV2ABI, TFunctionName, TMode>({
    abi: erc6551AccountV2ABI,
    address: erc6551AccountV2Address[chainId as keyof typeof erc6551AccountV2Address],
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc6551AccountV2ABI}__ and `functionName` set to `"initialize"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2D25602551487C3f3354dD80D76D54383A243358)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2D25602551487C3f3354dD80D76D54383A243358)
 */
export function useErc6551AccountV2Initialize<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof erc6551AccountV2Address
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof erc6551AccountV2ABI,
          'initialize'
        >['request']['abi'],
        'initialize',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'initialize' }
    : UseContractWriteConfig<typeof erc6551AccountV2ABI, 'initialize', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'initialize'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof erc6551AccountV2ABI, 'initialize', TMode>({
    abi: erc6551AccountV2ABI,
    address: erc6551AccountV2Address[chainId as keyof typeof erc6551AccountV2Address],
    functionName: 'initialize',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc6551AccountV2ABI}__.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2D25602551487C3f3354dD80D76D54383A243358)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2D25602551487C3f3354dD80D76D54383A243358)
 */
export function usePrepareErc6551AccountV2Write<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc6551AccountV2ABI, TFunctionName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof erc6551AccountV2Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: erc6551AccountV2ABI,
    address: erc6551AccountV2Address[chainId as keyof typeof erc6551AccountV2Address],
    ...config,
  } as UsePrepareContractWriteConfig<typeof erc6551AccountV2ABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc6551AccountV2ABI}__ and `functionName` set to `"initialize"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2D25602551487C3f3354dD80D76D54383A243358)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2D25602551487C3f3354dD80D76D54383A243358)
 */
export function usePrepareErc6551AccountV2Initialize(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc6551AccountV2ABI, 'initialize'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof erc6551AccountV2Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: erc6551AccountV2ABI,
    address: erc6551AccountV2Address[chainId as keyof typeof erc6551AccountV2Address],
    functionName: 'initialize',
    ...config,
  } as UsePrepareContractWriteConfig<typeof erc6551AccountV2ABI, 'initialize'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link erc6551AccountV2ABI}__.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2D25602551487C3f3354dD80D76D54383A243358)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2D25602551487C3f3354dD80D76D54383A243358)
 */
export function useErc6551AccountV2Event<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof erc6551AccountV2ABI, TEventName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof erc6551AccountV2Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: erc6551AccountV2ABI,
    address: erc6551AccountV2Address[chainId as keyof typeof erc6551AccountV2Address],
    ...config,
  } as UseContractEventConfig<typeof erc6551AccountV2ABI, TEventName>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link erc6551AccountV2ABI}__ and `eventName` set to `"AdminChanged"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2D25602551487C3f3354dD80D76D54383A243358)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2D25602551487C3f3354dD80D76D54383A243358)
 */
export function useErc6551AccountV2AdminChangedEvent(
  config: Omit<
    UseContractEventConfig<typeof erc6551AccountV2ABI, 'AdminChanged'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof erc6551AccountV2Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: erc6551AccountV2ABI,
    address: erc6551AccountV2Address[chainId as keyof typeof erc6551AccountV2Address],
    eventName: 'AdminChanged',
    ...config,
  } as UseContractEventConfig<typeof erc6551AccountV2ABI, 'AdminChanged'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link erc6551AccountV2ABI}__ and `eventName` set to `"BeaconUpgraded"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2D25602551487C3f3354dD80D76D54383A243358)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2D25602551487C3f3354dD80D76D54383A243358)
 */
export function useErc6551AccountV2BeaconUpgradedEvent(
  config: Omit<
    UseContractEventConfig<typeof erc6551AccountV2ABI, 'BeaconUpgraded'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof erc6551AccountV2Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: erc6551AccountV2ABI,
    address: erc6551AccountV2Address[chainId as keyof typeof erc6551AccountV2Address],
    eventName: 'BeaconUpgraded',
    ...config,
  } as UseContractEventConfig<typeof erc6551AccountV2ABI, 'BeaconUpgraded'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link erc6551AccountV2ABI}__ and `eventName` set to `"Upgraded"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x2D25602551487C3f3354dD80D76D54383A243358)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x2D25602551487C3f3354dD80D76D54383A243358)
 */
export function useErc6551AccountV2UpgradedEvent(
  config: Omit<
    UseContractEventConfig<typeof erc6551AccountV2ABI, 'Upgraded'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof erc6551AccountV2Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: erc6551AccountV2ABI,
    address: erc6551AccountV2Address[chainId as keyof typeof erc6551AccountV2Address],
    eventName: 'Upgraded',
    ...config,
  } as UseContractEventConfig<typeof erc6551AccountV2ABI, 'Upgraded'>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc6551AccountV3ABI}__.
 *
 * [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xDBb56A571a1eb9d5d973b1D682f3DC19bEE5Cbd2)
 */
export function useErc6551AccountV3Read<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof erc6551AccountV3ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc6551AccountV3ABI, TFunctionName, TSelectData>,
    'abi' | 'address'
  > & { chainId?: keyof typeof erc6551AccountV3Address } = {} as any
) {
  return useContractRead({
    abi: erc6551AccountV3ABI,
    address: erc6551AccountV3Address[5],
    ...config,
  } as UseContractReadConfig<typeof erc6551AccountV3ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc6551AccountV3ABI}__ and `functionName` set to `"entryPoint"`.
 *
 * [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xDBb56A571a1eb9d5d973b1D682f3DC19bEE5Cbd2)
 */
export function useErc6551AccountV3EntryPoint<
  TFunctionName extends 'entryPoint',
  TSelectData = ReadContractResult<typeof erc6551AccountV3ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc6551AccountV3ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof erc6551AccountV3Address } = {} as any
) {
  return useContractRead({
    abi: erc6551AccountV3ABI,
    address: erc6551AccountV3Address[5],
    functionName: 'entryPoint',
    ...config,
  } as UseContractReadConfig<typeof erc6551AccountV3ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc6551AccountV3ABI}__ and `functionName` set to `"erc6551Registry"`.
 *
 * [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xDBb56A571a1eb9d5d973b1D682f3DC19bEE5Cbd2)
 */
export function useErc6551AccountV3Erc6551Registry<
  TFunctionName extends 'erc6551Registry',
  TSelectData = ReadContractResult<typeof erc6551AccountV3ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc6551AccountV3ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof erc6551AccountV3Address } = {} as any
) {
  return useContractRead({
    abi: erc6551AccountV3ABI,
    address: erc6551AccountV3Address[5],
    functionName: 'erc6551Registry',
    ...config,
  } as UseContractReadConfig<typeof erc6551AccountV3ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc6551AccountV3ABI}__ and `functionName` set to `"extsload"`.
 *
 * [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xDBb56A571a1eb9d5d973b1D682f3DC19bEE5Cbd2)
 */
export function useErc6551AccountV3Extsload<
  TFunctionName extends 'extsload',
  TSelectData = ReadContractResult<typeof erc6551AccountV3ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc6551AccountV3ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof erc6551AccountV3Address } = {} as any
) {
  return useContractRead({
    abi: erc6551AccountV3ABI,
    address: erc6551AccountV3Address[5],
    functionName: 'extsload',
    ...config,
  } as UseContractReadConfig<typeof erc6551AccountV3ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc6551AccountV3ABI}__ and `functionName` set to `"getNonce"`.
 *
 * [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xDBb56A571a1eb9d5d973b1D682f3DC19bEE5Cbd2)
 */
export function useErc6551AccountV3GetNonce<
  TFunctionName extends 'getNonce',
  TSelectData = ReadContractResult<typeof erc6551AccountV3ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc6551AccountV3ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof erc6551AccountV3Address } = {} as any
) {
  return useContractRead({
    abi: erc6551AccountV3ABI,
    address: erc6551AccountV3Address[5],
    functionName: 'getNonce',
    ...config,
  } as UseContractReadConfig<typeof erc6551AccountV3ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc6551AccountV3ABI}__ and `functionName` set to `"isLocked"`.
 *
 * [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xDBb56A571a1eb9d5d973b1D682f3DC19bEE5Cbd2)
 */
export function useErc6551AccountV3IsLocked<
  TFunctionName extends 'isLocked',
  TSelectData = ReadContractResult<typeof erc6551AccountV3ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc6551AccountV3ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof erc6551AccountV3Address } = {} as any
) {
  return useContractRead({
    abi: erc6551AccountV3ABI,
    address: erc6551AccountV3Address[5],
    functionName: 'isLocked',
    ...config,
  } as UseContractReadConfig<typeof erc6551AccountV3ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc6551AccountV3ABI}__ and `functionName` set to `"isTrustedForwarder"`.
 *
 * [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xDBb56A571a1eb9d5d973b1D682f3DC19bEE5Cbd2)
 */
export function useErc6551AccountV3IsTrustedForwarder<
  TFunctionName extends 'isTrustedForwarder',
  TSelectData = ReadContractResult<typeof erc6551AccountV3ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc6551AccountV3ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof erc6551AccountV3Address } = {} as any
) {
  return useContractRead({
    abi: erc6551AccountV3ABI,
    address: erc6551AccountV3Address[5],
    functionName: 'isTrustedForwarder',
    ...config,
  } as UseContractReadConfig<typeof erc6551AccountV3ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc6551AccountV3ABI}__ and `functionName` set to `"isValidSignature"`.
 *
 * [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xDBb56A571a1eb9d5d973b1D682f3DC19bEE5Cbd2)
 */
export function useErc6551AccountV3IsValidSignature<
  TFunctionName extends 'isValidSignature',
  TSelectData = ReadContractResult<typeof erc6551AccountV3ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc6551AccountV3ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof erc6551AccountV3Address } = {} as any
) {
  return useContractRead({
    abi: erc6551AccountV3ABI,
    address: erc6551AccountV3Address[5],
    functionName: 'isValidSignature',
    ...config,
  } as UseContractReadConfig<typeof erc6551AccountV3ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc6551AccountV3ABI}__ and `functionName` set to `"isValidSigner"`.
 *
 * [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xDBb56A571a1eb9d5d973b1D682f3DC19bEE5Cbd2)
 */
export function useErc6551AccountV3IsValidSigner<
  TFunctionName extends 'isValidSigner',
  TSelectData = ReadContractResult<typeof erc6551AccountV3ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc6551AccountV3ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof erc6551AccountV3Address } = {} as any
) {
  return useContractRead({
    abi: erc6551AccountV3ABI,
    address: erc6551AccountV3Address[5],
    functionName: 'isValidSigner',
    ...config,
  } as UseContractReadConfig<typeof erc6551AccountV3ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc6551AccountV3ABI}__ and `functionName` set to `"lockedUntil"`.
 *
 * [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xDBb56A571a1eb9d5d973b1D682f3DC19bEE5Cbd2)
 */
export function useErc6551AccountV3LockedUntil<
  TFunctionName extends 'lockedUntil',
  TSelectData = ReadContractResult<typeof erc6551AccountV3ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc6551AccountV3ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof erc6551AccountV3Address } = {} as any
) {
  return useContractRead({
    abi: erc6551AccountV3ABI,
    address: erc6551AccountV3Address[5],
    functionName: 'lockedUntil',
    ...config,
  } as UseContractReadConfig<typeof erc6551AccountV3ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc6551AccountV3ABI}__ and `functionName` set to `"overrides"`.
 *
 * [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xDBb56A571a1eb9d5d973b1D682f3DC19bEE5Cbd2)
 */
export function useErc6551AccountV3Overrides<
  TFunctionName extends 'overrides',
  TSelectData = ReadContractResult<typeof erc6551AccountV3ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc6551AccountV3ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof erc6551AccountV3Address } = {} as any
) {
  return useContractRead({
    abi: erc6551AccountV3ABI,
    address: erc6551AccountV3Address[5],
    functionName: 'overrides',
    ...config,
  } as UseContractReadConfig<typeof erc6551AccountV3ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc6551AccountV3ABI}__ and `functionName` set to `"owner"`.
 *
 * [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xDBb56A571a1eb9d5d973b1D682f3DC19bEE5Cbd2)
 */
export function useErc6551AccountV3Owner<
  TFunctionName extends 'owner',
  TSelectData = ReadContractResult<typeof erc6551AccountV3ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc6551AccountV3ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof erc6551AccountV3Address } = {} as any
) {
  return useContractRead({
    abi: erc6551AccountV3ABI,
    address: erc6551AccountV3Address[5],
    functionName: 'owner',
    ...config,
  } as UseContractReadConfig<typeof erc6551AccountV3ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc6551AccountV3ABI}__ and `functionName` set to `"permissions"`.
 *
 * [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xDBb56A571a1eb9d5d973b1D682f3DC19bEE5Cbd2)
 */
export function useErc6551AccountV3Permissions<
  TFunctionName extends 'permissions',
  TSelectData = ReadContractResult<typeof erc6551AccountV3ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc6551AccountV3ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof erc6551AccountV3Address } = {} as any
) {
  return useContractRead({
    abi: erc6551AccountV3ABI,
    address: erc6551AccountV3Address[5],
    functionName: 'permissions',
    ...config,
  } as UseContractReadConfig<typeof erc6551AccountV3ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc6551AccountV3ABI}__ and `functionName` set to `"proxiableUUID"`.
 *
 * [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xDBb56A571a1eb9d5d973b1D682f3DC19bEE5Cbd2)
 */
export function useErc6551AccountV3ProxiableUuid<
  TFunctionName extends 'proxiableUUID',
  TSelectData = ReadContractResult<typeof erc6551AccountV3ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc6551AccountV3ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof erc6551AccountV3Address } = {} as any
) {
  return useContractRead({
    abi: erc6551AccountV3ABI,
    address: erc6551AccountV3Address[5],
    functionName: 'proxiableUUID',
    ...config,
  } as UseContractReadConfig<typeof erc6551AccountV3ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc6551AccountV3ABI}__ and `functionName` set to `"state"`.
 *
 * [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xDBb56A571a1eb9d5d973b1D682f3DC19bEE5Cbd2)
 */
export function useErc6551AccountV3State<
  TFunctionName extends 'state',
  TSelectData = ReadContractResult<typeof erc6551AccountV3ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc6551AccountV3ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof erc6551AccountV3Address } = {} as any
) {
  return useContractRead({
    abi: erc6551AccountV3ABI,
    address: erc6551AccountV3Address[5],
    functionName: 'state',
    ...config,
  } as UseContractReadConfig<typeof erc6551AccountV3ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc6551AccountV3ABI}__ and `functionName` set to `"supportsInterface"`.
 *
 * [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xDBb56A571a1eb9d5d973b1D682f3DC19bEE5Cbd2)
 */
export function useErc6551AccountV3SupportsInterface<
  TFunctionName extends 'supportsInterface',
  TSelectData = ReadContractResult<typeof erc6551AccountV3ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc6551AccountV3ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof erc6551AccountV3Address } = {} as any
) {
  return useContractRead({
    abi: erc6551AccountV3ABI,
    address: erc6551AccountV3Address[5],
    functionName: 'supportsInterface',
    ...config,
  } as UseContractReadConfig<typeof erc6551AccountV3ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc6551AccountV3ABI}__ and `functionName` set to `"token"`.
 *
 * [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xDBb56A571a1eb9d5d973b1D682f3DC19bEE5Cbd2)
 */
export function useErc6551AccountV3Token<
  TFunctionName extends 'token',
  TSelectData = ReadContractResult<typeof erc6551AccountV3ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc6551AccountV3ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof erc6551AccountV3Address } = {} as any
) {
  return useContractRead({
    abi: erc6551AccountV3ABI,
    address: erc6551AccountV3Address[5],
    functionName: 'token',
    ...config,
  } as UseContractReadConfig<typeof erc6551AccountV3ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc6551AccountV3ABI}__.
 *
 * [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xDBb56A571a1eb9d5d973b1D682f3DC19bEE5Cbd2)
 */
export function useErc6551AccountV3Write<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof erc6551AccountV3Address
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof erc6551AccountV3ABI, string>['request']['abi'],
        TFunctionName,
        TMode
      > & { address?: Address; chainId?: TChainId }
    : UseContractWriteConfig<typeof erc6551AccountV3ABI, TFunctionName, TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
      } = {} as any
) {
  return useContractWrite<typeof erc6551AccountV3ABI, TFunctionName, TMode>({
    abi: erc6551AccountV3ABI,
    address: erc6551AccountV3Address[5],
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc6551AccountV3ABI}__ and `functionName` set to `"execute"`.
 *
 * [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xDBb56A571a1eb9d5d973b1D682f3DC19bEE5Cbd2)
 */
export function useErc6551AccountV3Execute<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof erc6551AccountV3Address
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof erc6551AccountV3ABI,
          'execute'
        >['request']['abi'],
        'execute',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'execute' }
    : UseContractWriteConfig<typeof erc6551AccountV3ABI, 'execute', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'execute'
      } = {} as any
) {
  return useContractWrite<typeof erc6551AccountV3ABI, 'execute', TMode>({
    abi: erc6551AccountV3ABI,
    address: erc6551AccountV3Address[5],
    functionName: 'execute',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc6551AccountV3ABI}__ and `functionName` set to `"executeBatch"`.
 *
 * [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xDBb56A571a1eb9d5d973b1D682f3DC19bEE5Cbd2)
 */
export function useErc6551AccountV3ExecuteBatch<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof erc6551AccountV3Address
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof erc6551AccountV3ABI,
          'executeBatch'
        >['request']['abi'],
        'executeBatch',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'executeBatch' }
    : UseContractWriteConfig<typeof erc6551AccountV3ABI, 'executeBatch', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'executeBatch'
      } = {} as any
) {
  return useContractWrite<typeof erc6551AccountV3ABI, 'executeBatch', TMode>({
    abi: erc6551AccountV3ABI,
    address: erc6551AccountV3Address[5],
    functionName: 'executeBatch',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc6551AccountV3ABI}__ and `functionName` set to `"executeNested"`.
 *
 * [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xDBb56A571a1eb9d5d973b1D682f3DC19bEE5Cbd2)
 */
export function useErc6551AccountV3ExecuteNested<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof erc6551AccountV3Address
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof erc6551AccountV3ABI,
          'executeNested'
        >['request']['abi'],
        'executeNested',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'executeNested' }
    : UseContractWriteConfig<typeof erc6551AccountV3ABI, 'executeNested', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'executeNested'
      } = {} as any
) {
  return useContractWrite<typeof erc6551AccountV3ABI, 'executeNested', TMode>({
    abi: erc6551AccountV3ABI,
    address: erc6551AccountV3Address[5],
    functionName: 'executeNested',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc6551AccountV3ABI}__ and `functionName` set to `"extcall"`.
 *
 * [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xDBb56A571a1eb9d5d973b1D682f3DC19bEE5Cbd2)
 */
export function useErc6551AccountV3Extcall<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof erc6551AccountV3Address
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof erc6551AccountV3ABI,
          'extcall'
        >['request']['abi'],
        'extcall',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'extcall' }
    : UseContractWriteConfig<typeof erc6551AccountV3ABI, 'extcall', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'extcall'
      } = {} as any
) {
  return useContractWrite<typeof erc6551AccountV3ABI, 'extcall', TMode>({
    abi: erc6551AccountV3ABI,
    address: erc6551AccountV3Address[5],
    functionName: 'extcall',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc6551AccountV3ABI}__ and `functionName` set to `"extcreate"`.
 *
 * [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xDBb56A571a1eb9d5d973b1D682f3DC19bEE5Cbd2)
 */
export function useErc6551AccountV3Extcreate<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof erc6551AccountV3Address
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof erc6551AccountV3ABI,
          'extcreate'
        >['request']['abi'],
        'extcreate',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'extcreate' }
    : UseContractWriteConfig<typeof erc6551AccountV3ABI, 'extcreate', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'extcreate'
      } = {} as any
) {
  return useContractWrite<typeof erc6551AccountV3ABI, 'extcreate', TMode>({
    abi: erc6551AccountV3ABI,
    address: erc6551AccountV3Address[5],
    functionName: 'extcreate',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc6551AccountV3ABI}__ and `functionName` set to `"extcreate2"`.
 *
 * [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xDBb56A571a1eb9d5d973b1D682f3DC19bEE5Cbd2)
 */
export function useErc6551AccountV3Extcreate2<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof erc6551AccountV3Address
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof erc6551AccountV3ABI,
          'extcreate2'
        >['request']['abi'],
        'extcreate2',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'extcreate2' }
    : UseContractWriteConfig<typeof erc6551AccountV3ABI, 'extcreate2', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'extcreate2'
      } = {} as any
) {
  return useContractWrite<typeof erc6551AccountV3ABI, 'extcreate2', TMode>({
    abi: erc6551AccountV3ABI,
    address: erc6551AccountV3Address[5],
    functionName: 'extcreate2',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc6551AccountV3ABI}__ and `functionName` set to `"lock"`.
 *
 * [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xDBb56A571a1eb9d5d973b1D682f3DC19bEE5Cbd2)
 */
export function useErc6551AccountV3Lock<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof erc6551AccountV3Address
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof erc6551AccountV3ABI, 'lock'>['request']['abi'],
        'lock',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'lock' }
    : UseContractWriteConfig<typeof erc6551AccountV3ABI, 'lock', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'lock'
      } = {} as any
) {
  return useContractWrite<typeof erc6551AccountV3ABI, 'lock', TMode>({
    abi: erc6551AccountV3ABI,
    address: erc6551AccountV3Address[5],
    functionName: 'lock',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc6551AccountV3ABI}__ and `functionName` set to `"onERC1155BatchReceived"`.
 *
 * [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xDBb56A571a1eb9d5d973b1D682f3DC19bEE5Cbd2)
 */
export function useErc6551AccountV3OnErc1155BatchReceived<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof erc6551AccountV3Address
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof erc6551AccountV3ABI,
          'onERC1155BatchReceived'
        >['request']['abi'],
        'onERC1155BatchReceived',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'onERC1155BatchReceived'
      }
    : UseContractWriteConfig<
        typeof erc6551AccountV3ABI,
        'onERC1155BatchReceived',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'onERC1155BatchReceived'
      } = {} as any
) {
  return useContractWrite<typeof erc6551AccountV3ABI, 'onERC1155BatchReceived', TMode>({
    abi: erc6551AccountV3ABI,
    address: erc6551AccountV3Address[5],
    functionName: 'onERC1155BatchReceived',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc6551AccountV3ABI}__ and `functionName` set to `"onERC1155Received"`.
 *
 * [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xDBb56A571a1eb9d5d973b1D682f3DC19bEE5Cbd2)
 */
export function useErc6551AccountV3OnErc1155Received<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof erc6551AccountV3Address
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof erc6551AccountV3ABI,
          'onERC1155Received'
        >['request']['abi'],
        'onERC1155Received',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'onERC1155Received' }
    : UseContractWriteConfig<typeof erc6551AccountV3ABI, 'onERC1155Received', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'onERC1155Received'
      } = {} as any
) {
  return useContractWrite<typeof erc6551AccountV3ABI, 'onERC1155Received', TMode>({
    abi: erc6551AccountV3ABI,
    address: erc6551AccountV3Address[5],
    functionName: 'onERC1155Received',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc6551AccountV3ABI}__ and `functionName` set to `"onERC721Received"`.
 *
 * [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xDBb56A571a1eb9d5d973b1D682f3DC19bEE5Cbd2)
 */
export function useErc6551AccountV3OnErc721Received<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof erc6551AccountV3Address
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof erc6551AccountV3ABI,
          'onERC721Received'
        >['request']['abi'],
        'onERC721Received',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'onERC721Received' }
    : UseContractWriteConfig<typeof erc6551AccountV3ABI, 'onERC721Received', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'onERC721Received'
      } = {} as any
) {
  return useContractWrite<typeof erc6551AccountV3ABI, 'onERC721Received', TMode>({
    abi: erc6551AccountV3ABI,
    address: erc6551AccountV3Address[5],
    functionName: 'onERC721Received',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc6551AccountV3ABI}__ and `functionName` set to `"setOverrides"`.
 *
 * [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xDBb56A571a1eb9d5d973b1D682f3DC19bEE5Cbd2)
 */
export function useErc6551AccountV3SetOverrides<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof erc6551AccountV3Address
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof erc6551AccountV3ABI,
          'setOverrides'
        >['request']['abi'],
        'setOverrides',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'setOverrides' }
    : UseContractWriteConfig<typeof erc6551AccountV3ABI, 'setOverrides', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'setOverrides'
      } = {} as any
) {
  return useContractWrite<typeof erc6551AccountV3ABI, 'setOverrides', TMode>({
    abi: erc6551AccountV3ABI,
    address: erc6551AccountV3Address[5],
    functionName: 'setOverrides',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc6551AccountV3ABI}__ and `functionName` set to `"setPermissions"`.
 *
 * [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xDBb56A571a1eb9d5d973b1D682f3DC19bEE5Cbd2)
 */
export function useErc6551AccountV3SetPermissions<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof erc6551AccountV3Address
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof erc6551AccountV3ABI,
          'setPermissions'
        >['request']['abi'],
        'setPermissions',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'setPermissions' }
    : UseContractWriteConfig<typeof erc6551AccountV3ABI, 'setPermissions', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'setPermissions'
      } = {} as any
) {
  return useContractWrite<typeof erc6551AccountV3ABI, 'setPermissions', TMode>({
    abi: erc6551AccountV3ABI,
    address: erc6551AccountV3Address[5],
    functionName: 'setPermissions',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc6551AccountV3ABI}__ and `functionName` set to `"upgradeTo"`.
 *
 * [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xDBb56A571a1eb9d5d973b1D682f3DC19bEE5Cbd2)
 */
export function useErc6551AccountV3UpgradeTo<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof erc6551AccountV3Address
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof erc6551AccountV3ABI,
          'upgradeTo'
        >['request']['abi'],
        'upgradeTo',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'upgradeTo' }
    : UseContractWriteConfig<typeof erc6551AccountV3ABI, 'upgradeTo', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'upgradeTo'
      } = {} as any
) {
  return useContractWrite<typeof erc6551AccountV3ABI, 'upgradeTo', TMode>({
    abi: erc6551AccountV3ABI,
    address: erc6551AccountV3Address[5],
    functionName: 'upgradeTo',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc6551AccountV3ABI}__ and `functionName` set to `"upgradeToAndCall"`.
 *
 * [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xDBb56A571a1eb9d5d973b1D682f3DC19bEE5Cbd2)
 */
export function useErc6551AccountV3UpgradeToAndCall<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof erc6551AccountV3Address
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof erc6551AccountV3ABI,
          'upgradeToAndCall'
        >['request']['abi'],
        'upgradeToAndCall',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'upgradeToAndCall' }
    : UseContractWriteConfig<typeof erc6551AccountV3ABI, 'upgradeToAndCall', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'upgradeToAndCall'
      } = {} as any
) {
  return useContractWrite<typeof erc6551AccountV3ABI, 'upgradeToAndCall', TMode>({
    abi: erc6551AccountV3ABI,
    address: erc6551AccountV3Address[5],
    functionName: 'upgradeToAndCall',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc6551AccountV3ABI}__ and `functionName` set to `"validateUserOp"`.
 *
 * [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xDBb56A571a1eb9d5d973b1D682f3DC19bEE5Cbd2)
 */
export function useErc6551AccountV3ValidateUserOp<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof erc6551AccountV3Address
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof erc6551AccountV3ABI,
          'validateUserOp'
        >['request']['abi'],
        'validateUserOp',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'validateUserOp' }
    : UseContractWriteConfig<typeof erc6551AccountV3ABI, 'validateUserOp', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'validateUserOp'
      } = {} as any
) {
  return useContractWrite<typeof erc6551AccountV3ABI, 'validateUserOp', TMode>({
    abi: erc6551AccountV3ABI,
    address: erc6551AccountV3Address[5],
    functionName: 'validateUserOp',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc6551AccountV3ABI}__.
 *
 * [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xDBb56A571a1eb9d5d973b1D682f3DC19bEE5Cbd2)
 */
export function usePrepareErc6551AccountV3Write<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc6551AccountV3ABI, TFunctionName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof erc6551AccountV3Address } = {} as any
) {
  return usePrepareContractWrite({
    abi: erc6551AccountV3ABI,
    address: erc6551AccountV3Address[5],
    ...config,
  } as UsePrepareContractWriteConfig<typeof erc6551AccountV3ABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc6551AccountV3ABI}__ and `functionName` set to `"execute"`.
 *
 * [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xDBb56A571a1eb9d5d973b1D682f3DC19bEE5Cbd2)
 */
export function usePrepareErc6551AccountV3Execute(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc6551AccountV3ABI, 'execute'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof erc6551AccountV3Address } = {} as any
) {
  return usePrepareContractWrite({
    abi: erc6551AccountV3ABI,
    address: erc6551AccountV3Address[5],
    functionName: 'execute',
    ...config,
  } as UsePrepareContractWriteConfig<typeof erc6551AccountV3ABI, 'execute'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc6551AccountV3ABI}__ and `functionName` set to `"executeBatch"`.
 *
 * [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xDBb56A571a1eb9d5d973b1D682f3DC19bEE5Cbd2)
 */
export function usePrepareErc6551AccountV3ExecuteBatch(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc6551AccountV3ABI, 'executeBatch'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof erc6551AccountV3Address } = {} as any
) {
  return usePrepareContractWrite({
    abi: erc6551AccountV3ABI,
    address: erc6551AccountV3Address[5],
    functionName: 'executeBatch',
    ...config,
  } as UsePrepareContractWriteConfig<typeof erc6551AccountV3ABI, 'executeBatch'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc6551AccountV3ABI}__ and `functionName` set to `"executeNested"`.
 *
 * [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xDBb56A571a1eb9d5d973b1D682f3DC19bEE5Cbd2)
 */
export function usePrepareErc6551AccountV3ExecuteNested(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc6551AccountV3ABI, 'executeNested'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof erc6551AccountV3Address } = {} as any
) {
  return usePrepareContractWrite({
    abi: erc6551AccountV3ABI,
    address: erc6551AccountV3Address[5],
    functionName: 'executeNested',
    ...config,
  } as UsePrepareContractWriteConfig<typeof erc6551AccountV3ABI, 'executeNested'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc6551AccountV3ABI}__ and `functionName` set to `"extcall"`.
 *
 * [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xDBb56A571a1eb9d5d973b1D682f3DC19bEE5Cbd2)
 */
export function usePrepareErc6551AccountV3Extcall(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc6551AccountV3ABI, 'extcall'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof erc6551AccountV3Address } = {} as any
) {
  return usePrepareContractWrite({
    abi: erc6551AccountV3ABI,
    address: erc6551AccountV3Address[5],
    functionName: 'extcall',
    ...config,
  } as UsePrepareContractWriteConfig<typeof erc6551AccountV3ABI, 'extcall'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc6551AccountV3ABI}__ and `functionName` set to `"extcreate"`.
 *
 * [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xDBb56A571a1eb9d5d973b1D682f3DC19bEE5Cbd2)
 */
export function usePrepareErc6551AccountV3Extcreate(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc6551AccountV3ABI, 'extcreate'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof erc6551AccountV3Address } = {} as any
) {
  return usePrepareContractWrite({
    abi: erc6551AccountV3ABI,
    address: erc6551AccountV3Address[5],
    functionName: 'extcreate',
    ...config,
  } as UsePrepareContractWriteConfig<typeof erc6551AccountV3ABI, 'extcreate'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc6551AccountV3ABI}__ and `functionName` set to `"extcreate2"`.
 *
 * [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xDBb56A571a1eb9d5d973b1D682f3DC19bEE5Cbd2)
 */
export function usePrepareErc6551AccountV3Extcreate2(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc6551AccountV3ABI, 'extcreate2'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof erc6551AccountV3Address } = {} as any
) {
  return usePrepareContractWrite({
    abi: erc6551AccountV3ABI,
    address: erc6551AccountV3Address[5],
    functionName: 'extcreate2',
    ...config,
  } as UsePrepareContractWriteConfig<typeof erc6551AccountV3ABI, 'extcreate2'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc6551AccountV3ABI}__ and `functionName` set to `"lock"`.
 *
 * [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xDBb56A571a1eb9d5d973b1D682f3DC19bEE5Cbd2)
 */
export function usePrepareErc6551AccountV3Lock(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc6551AccountV3ABI, 'lock'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof erc6551AccountV3Address } = {} as any
) {
  return usePrepareContractWrite({
    abi: erc6551AccountV3ABI,
    address: erc6551AccountV3Address[5],
    functionName: 'lock',
    ...config,
  } as UsePrepareContractWriteConfig<typeof erc6551AccountV3ABI, 'lock'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc6551AccountV3ABI}__ and `functionName` set to `"onERC1155BatchReceived"`.
 *
 * [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xDBb56A571a1eb9d5d973b1D682f3DC19bEE5Cbd2)
 */
export function usePrepareErc6551AccountV3OnErc1155BatchReceived(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc6551AccountV3ABI, 'onERC1155BatchReceived'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof erc6551AccountV3Address } = {} as any
) {
  return usePrepareContractWrite({
    abi: erc6551AccountV3ABI,
    address: erc6551AccountV3Address[5],
    functionName: 'onERC1155BatchReceived',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof erc6551AccountV3ABI,
    'onERC1155BatchReceived'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc6551AccountV3ABI}__ and `functionName` set to `"onERC1155Received"`.
 *
 * [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xDBb56A571a1eb9d5d973b1D682f3DC19bEE5Cbd2)
 */
export function usePrepareErc6551AccountV3OnErc1155Received(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc6551AccountV3ABI, 'onERC1155Received'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof erc6551AccountV3Address } = {} as any
) {
  return usePrepareContractWrite({
    abi: erc6551AccountV3ABI,
    address: erc6551AccountV3Address[5],
    functionName: 'onERC1155Received',
    ...config,
  } as UsePrepareContractWriteConfig<typeof erc6551AccountV3ABI, 'onERC1155Received'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc6551AccountV3ABI}__ and `functionName` set to `"onERC721Received"`.
 *
 * [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xDBb56A571a1eb9d5d973b1D682f3DC19bEE5Cbd2)
 */
export function usePrepareErc6551AccountV3OnErc721Received(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc6551AccountV3ABI, 'onERC721Received'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof erc6551AccountV3Address } = {} as any
) {
  return usePrepareContractWrite({
    abi: erc6551AccountV3ABI,
    address: erc6551AccountV3Address[5],
    functionName: 'onERC721Received',
    ...config,
  } as UsePrepareContractWriteConfig<typeof erc6551AccountV3ABI, 'onERC721Received'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc6551AccountV3ABI}__ and `functionName` set to `"setOverrides"`.
 *
 * [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xDBb56A571a1eb9d5d973b1D682f3DC19bEE5Cbd2)
 */
export function usePrepareErc6551AccountV3SetOverrides(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc6551AccountV3ABI, 'setOverrides'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof erc6551AccountV3Address } = {} as any
) {
  return usePrepareContractWrite({
    abi: erc6551AccountV3ABI,
    address: erc6551AccountV3Address[5],
    functionName: 'setOverrides',
    ...config,
  } as UsePrepareContractWriteConfig<typeof erc6551AccountV3ABI, 'setOverrides'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc6551AccountV3ABI}__ and `functionName` set to `"setPermissions"`.
 *
 * [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xDBb56A571a1eb9d5d973b1D682f3DC19bEE5Cbd2)
 */
export function usePrepareErc6551AccountV3SetPermissions(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc6551AccountV3ABI, 'setPermissions'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof erc6551AccountV3Address } = {} as any
) {
  return usePrepareContractWrite({
    abi: erc6551AccountV3ABI,
    address: erc6551AccountV3Address[5],
    functionName: 'setPermissions',
    ...config,
  } as UsePrepareContractWriteConfig<typeof erc6551AccountV3ABI, 'setPermissions'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc6551AccountV3ABI}__ and `functionName` set to `"upgradeTo"`.
 *
 * [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xDBb56A571a1eb9d5d973b1D682f3DC19bEE5Cbd2)
 */
export function usePrepareErc6551AccountV3UpgradeTo(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc6551AccountV3ABI, 'upgradeTo'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof erc6551AccountV3Address } = {} as any
) {
  return usePrepareContractWrite({
    abi: erc6551AccountV3ABI,
    address: erc6551AccountV3Address[5],
    functionName: 'upgradeTo',
    ...config,
  } as UsePrepareContractWriteConfig<typeof erc6551AccountV3ABI, 'upgradeTo'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc6551AccountV3ABI}__ and `functionName` set to `"upgradeToAndCall"`.
 *
 * [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xDBb56A571a1eb9d5d973b1D682f3DC19bEE5Cbd2)
 */
export function usePrepareErc6551AccountV3UpgradeToAndCall(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc6551AccountV3ABI, 'upgradeToAndCall'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof erc6551AccountV3Address } = {} as any
) {
  return usePrepareContractWrite({
    abi: erc6551AccountV3ABI,
    address: erc6551AccountV3Address[5],
    functionName: 'upgradeToAndCall',
    ...config,
  } as UsePrepareContractWriteConfig<typeof erc6551AccountV3ABI, 'upgradeToAndCall'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc6551AccountV3ABI}__ and `functionName` set to `"validateUserOp"`.
 *
 * [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xDBb56A571a1eb9d5d973b1D682f3DC19bEE5Cbd2)
 */
export function usePrepareErc6551AccountV3ValidateUserOp(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc6551AccountV3ABI, 'validateUserOp'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof erc6551AccountV3Address } = {} as any
) {
  return usePrepareContractWrite({
    abi: erc6551AccountV3ABI,
    address: erc6551AccountV3Address[5],
    functionName: 'validateUserOp',
    ...config,
  } as UsePrepareContractWriteConfig<typeof erc6551AccountV3ABI, 'validateUserOp'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link erc6551AccountV3ABI}__.
 *
 * [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xDBb56A571a1eb9d5d973b1D682f3DC19bEE5Cbd2)
 */
export function useErc6551AccountV3Event<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof erc6551AccountV3ABI, TEventName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof erc6551AccountV3Address } = {} as any
) {
  return useContractEvent({
    abi: erc6551AccountV3ABI,
    address: erc6551AccountV3Address[5],
    ...config,
  } as UseContractEventConfig<typeof erc6551AccountV3ABI, TEventName>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link erc6551AccountV3ABI}__ and `eventName` set to `"AdminChanged"`.
 *
 * [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xDBb56A571a1eb9d5d973b1D682f3DC19bEE5Cbd2)
 */
export function useErc6551AccountV3AdminChangedEvent(
  config: Omit<
    UseContractEventConfig<typeof erc6551AccountV3ABI, 'AdminChanged'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof erc6551AccountV3Address } = {} as any
) {
  return useContractEvent({
    abi: erc6551AccountV3ABI,
    address: erc6551AccountV3Address[5],
    eventName: 'AdminChanged',
    ...config,
  } as UseContractEventConfig<typeof erc6551AccountV3ABI, 'AdminChanged'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link erc6551AccountV3ABI}__ and `eventName` set to `"BeaconUpgraded"`.
 *
 * [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xDBb56A571a1eb9d5d973b1D682f3DC19bEE5Cbd2)
 */
export function useErc6551AccountV3BeaconUpgradedEvent(
  config: Omit<
    UseContractEventConfig<typeof erc6551AccountV3ABI, 'BeaconUpgraded'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof erc6551AccountV3Address } = {} as any
) {
  return useContractEvent({
    abi: erc6551AccountV3ABI,
    address: erc6551AccountV3Address[5],
    eventName: 'BeaconUpgraded',
    ...config,
  } as UseContractEventConfig<typeof erc6551AccountV3ABI, 'BeaconUpgraded'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link erc6551AccountV3ABI}__ and `eventName` set to `"LockUpdated"`.
 *
 * [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xDBb56A571a1eb9d5d973b1D682f3DC19bEE5Cbd2)
 */
export function useErc6551AccountV3LockUpdatedEvent(
  config: Omit<
    UseContractEventConfig<typeof erc6551AccountV3ABI, 'LockUpdated'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof erc6551AccountV3Address } = {} as any
) {
  return useContractEvent({
    abi: erc6551AccountV3ABI,
    address: erc6551AccountV3Address[5],
    eventName: 'LockUpdated',
    ...config,
  } as UseContractEventConfig<typeof erc6551AccountV3ABI, 'LockUpdated'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link erc6551AccountV3ABI}__ and `eventName` set to `"OverrideUpdated"`.
 *
 * [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xDBb56A571a1eb9d5d973b1D682f3DC19bEE5Cbd2)
 */
export function useErc6551AccountV3OverrideUpdatedEvent(
  config: Omit<
    UseContractEventConfig<typeof erc6551AccountV3ABI, 'OverrideUpdated'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof erc6551AccountV3Address } = {} as any
) {
  return useContractEvent({
    abi: erc6551AccountV3ABI,
    address: erc6551AccountV3Address[5],
    eventName: 'OverrideUpdated',
    ...config,
  } as UseContractEventConfig<typeof erc6551AccountV3ABI, 'OverrideUpdated'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link erc6551AccountV3ABI}__ and `eventName` set to `"PermissionUpdated"`.
 *
 * [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xDBb56A571a1eb9d5d973b1D682f3DC19bEE5Cbd2)
 */
export function useErc6551AccountV3PermissionUpdatedEvent(
  config: Omit<
    UseContractEventConfig<typeof erc6551AccountV3ABI, 'PermissionUpdated'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof erc6551AccountV3Address } = {} as any
) {
  return useContractEvent({
    abi: erc6551AccountV3ABI,
    address: erc6551AccountV3Address[5],
    eventName: 'PermissionUpdated',
    ...config,
  } as UseContractEventConfig<typeof erc6551AccountV3ABI, 'PermissionUpdated'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link erc6551AccountV3ABI}__ and `eventName` set to `"Upgraded"`.
 *
 * [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xDBb56A571a1eb9d5d973b1D682f3DC19bEE5Cbd2)
 */
export function useErc6551AccountV3UpgradedEvent(
  config: Omit<
    UseContractEventConfig<typeof erc6551AccountV3ABI, 'Upgraded'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof erc6551AccountV3Address } = {} as any
) {
  return useContractEvent({
    abi: erc6551AccountV3ABI,
    address: erc6551AccountV3Address[5],
    eventName: 'Upgraded',
    ...config,
  } as UseContractEventConfig<typeof erc6551AccountV3ABI, 'Upgraded'>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc6551RegistryV2ABI}__.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x02101dfB77FDE026414827Fdc604ddAF224F0921)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x02101dfB77FDE026414827Fdc604ddAF224F0921)
 */
export function useErc6551RegistryV2Read<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof erc6551RegistryV2ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc6551RegistryV2ABI, TFunctionName, TSelectData>,
    'abi' | 'address'
  > & { chainId?: keyof typeof erc6551RegistryV2Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: erc6551RegistryV2ABI,
    address: erc6551RegistryV2Address[chainId as keyof typeof erc6551RegistryV2Address],
    ...config,
  } as UseContractReadConfig<typeof erc6551RegistryV2ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc6551RegistryV2ABI}__ and `functionName` set to `"account"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x02101dfB77FDE026414827Fdc604ddAF224F0921)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x02101dfB77FDE026414827Fdc604ddAF224F0921)
 */
export function useErc6551RegistryV2Account<
  TFunctionName extends 'account',
  TSelectData = ReadContractResult<typeof erc6551RegistryV2ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc6551RegistryV2ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof erc6551RegistryV2Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: erc6551RegistryV2ABI,
    address: erc6551RegistryV2Address[chainId as keyof typeof erc6551RegistryV2Address],
    functionName: 'account',
    ...config,
  } as UseContractReadConfig<typeof erc6551RegistryV2ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc6551RegistryV2ABI}__.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x02101dfB77FDE026414827Fdc604ddAF224F0921)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x02101dfB77FDE026414827Fdc604ddAF224F0921)
 */
export function useErc6551RegistryV2Write<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof erc6551RegistryV2Address
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof erc6551RegistryV2ABI, string>['request']['abi'],
        TFunctionName,
        TMode
      > & { address?: Address; chainId?: TChainId }
    : UseContractWriteConfig<typeof erc6551RegistryV2ABI, TFunctionName, TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof erc6551RegistryV2ABI, TFunctionName, TMode>({
    abi: erc6551RegistryV2ABI,
    address: erc6551RegistryV2Address[chainId as keyof typeof erc6551RegistryV2Address],
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc6551RegistryV2ABI}__ and `functionName` set to `"createAccount"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x02101dfB77FDE026414827Fdc604ddAF224F0921)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x02101dfB77FDE026414827Fdc604ddAF224F0921)
 */
export function useErc6551RegistryV2CreateAccount<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof erc6551RegistryV2Address
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof erc6551RegistryV2ABI,
          'createAccount'
        >['request']['abi'],
        'createAccount',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'createAccount' }
    : UseContractWriteConfig<typeof erc6551RegistryV2ABI, 'createAccount', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'createAccount'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof erc6551RegistryV2ABI, 'createAccount', TMode>({
    abi: erc6551RegistryV2ABI,
    address: erc6551RegistryV2Address[chainId as keyof typeof erc6551RegistryV2Address],
    functionName: 'createAccount',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc6551RegistryV2ABI}__.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x02101dfB77FDE026414827Fdc604ddAF224F0921)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x02101dfB77FDE026414827Fdc604ddAF224F0921)
 */
export function usePrepareErc6551RegistryV2Write<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc6551RegistryV2ABI, TFunctionName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof erc6551RegistryV2Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: erc6551RegistryV2ABI,
    address: erc6551RegistryV2Address[chainId as keyof typeof erc6551RegistryV2Address],
    ...config,
  } as UsePrepareContractWriteConfig<typeof erc6551RegistryV2ABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc6551RegistryV2ABI}__ and `functionName` set to `"createAccount"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x02101dfB77FDE026414827Fdc604ddAF224F0921)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x02101dfB77FDE026414827Fdc604ddAF224F0921)
 */
export function usePrepareErc6551RegistryV2CreateAccount(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc6551RegistryV2ABI, 'createAccount'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof erc6551RegistryV2Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: erc6551RegistryV2ABI,
    address: erc6551RegistryV2Address[chainId as keyof typeof erc6551RegistryV2Address],
    functionName: 'createAccount',
    ...config,
  } as UsePrepareContractWriteConfig<typeof erc6551RegistryV2ABI, 'createAccount'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link erc6551RegistryV2ABI}__.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x02101dfB77FDE026414827Fdc604ddAF224F0921)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x02101dfB77FDE026414827Fdc604ddAF224F0921)
 */
export function useErc6551RegistryV2Event<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof erc6551RegistryV2ABI, TEventName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof erc6551RegistryV2Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: erc6551RegistryV2ABI,
    address: erc6551RegistryV2Address[chainId as keyof typeof erc6551RegistryV2Address],
    ...config,
  } as UseContractEventConfig<typeof erc6551RegistryV2ABI, TEventName>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link erc6551RegistryV2ABI}__ and `eventName` set to `"AccountCreated"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x02101dfB77FDE026414827Fdc604ddAF224F0921)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x02101dfB77FDE026414827Fdc604ddAF224F0921)
 */
export function useErc6551RegistryV2AccountCreatedEvent(
  config: Omit<
    UseContractEventConfig<typeof erc6551RegistryV2ABI, 'AccountCreated'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof erc6551RegistryV2Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: erc6551RegistryV2ABI,
    address: erc6551RegistryV2Address[chainId as keyof typeof erc6551RegistryV2Address],
    eventName: 'AccountCreated',
    ...config,
  } as UseContractEventConfig<typeof erc6551RegistryV2ABI, 'AccountCreated'>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc6551RegistryV3ABI}__.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x002c0c13181038780F552f0eC1B72e8C720147E6)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x002c0c13181038780F552f0eC1B72e8C720147E6)
 */
export function useErc6551RegistryV3Read<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof erc6551RegistryV3ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc6551RegistryV3ABI, TFunctionName, TSelectData>,
    'abi' | 'address'
  > & { chainId?: keyof typeof erc6551RegistryV3Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: erc6551RegistryV3ABI,
    address: erc6551RegistryV3Address[chainId as keyof typeof erc6551RegistryV3Address],
    ...config,
  } as UseContractReadConfig<typeof erc6551RegistryV3ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc6551RegistryV3ABI}__ and `functionName` set to `"account"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x002c0c13181038780F552f0eC1B72e8C720147E6)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x002c0c13181038780F552f0eC1B72e8C720147E6)
 */
export function useErc6551RegistryV3Account<
  TFunctionName extends 'account',
  TSelectData = ReadContractResult<typeof erc6551RegistryV3ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc6551RegistryV3ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof erc6551RegistryV3Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: erc6551RegistryV3ABI,
    address: erc6551RegistryV3Address[chainId as keyof typeof erc6551RegistryV3Address],
    functionName: 'account',
    ...config,
  } as UseContractReadConfig<typeof erc6551RegistryV3ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc6551RegistryV3ABI}__.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x002c0c13181038780F552f0eC1B72e8C720147E6)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x002c0c13181038780F552f0eC1B72e8C720147E6)
 */
export function useErc6551RegistryV3Write<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof erc6551RegistryV3Address
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof erc6551RegistryV3ABI, string>['request']['abi'],
        TFunctionName,
        TMode
      > & { address?: Address; chainId?: TChainId }
    : UseContractWriteConfig<typeof erc6551RegistryV3ABI, TFunctionName, TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof erc6551RegistryV3ABI, TFunctionName, TMode>({
    abi: erc6551RegistryV3ABI,
    address: erc6551RegistryV3Address[chainId as keyof typeof erc6551RegistryV3Address],
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc6551RegistryV3ABI}__ and `functionName` set to `"createAccount"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x002c0c13181038780F552f0eC1B72e8C720147E6)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x002c0c13181038780F552f0eC1B72e8C720147E6)
 */
export function useErc6551RegistryV3CreateAccount<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof erc6551RegistryV3Address
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof erc6551RegistryV3ABI,
          'createAccount'
        >['request']['abi'],
        'createAccount',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'createAccount' }
    : UseContractWriteConfig<typeof erc6551RegistryV3ABI, 'createAccount', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'createAccount'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof erc6551RegistryV3ABI, 'createAccount', TMode>({
    abi: erc6551RegistryV3ABI,
    address: erc6551RegistryV3Address[chainId as keyof typeof erc6551RegistryV3Address],
    functionName: 'createAccount',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc6551RegistryV3ABI}__.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x002c0c13181038780F552f0eC1B72e8C720147E6)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x002c0c13181038780F552f0eC1B72e8C720147E6)
 */
export function usePrepareErc6551RegistryV3Write<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc6551RegistryV3ABI, TFunctionName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof erc6551RegistryV3Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: erc6551RegistryV3ABI,
    address: erc6551RegistryV3Address[chainId as keyof typeof erc6551RegistryV3Address],
    ...config,
  } as UsePrepareContractWriteConfig<typeof erc6551RegistryV3ABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc6551RegistryV3ABI}__ and `functionName` set to `"createAccount"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x002c0c13181038780F552f0eC1B72e8C720147E6)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x002c0c13181038780F552f0eC1B72e8C720147E6)
 */
export function usePrepareErc6551RegistryV3CreateAccount(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc6551RegistryV3ABI, 'createAccount'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof erc6551RegistryV3Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: erc6551RegistryV3ABI,
    address: erc6551RegistryV3Address[chainId as keyof typeof erc6551RegistryV3Address],
    functionName: 'createAccount',
    ...config,
  } as UsePrepareContractWriteConfig<typeof erc6551RegistryV3ABI, 'createAccount'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link erc6551RegistryV3ABI}__.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x002c0c13181038780F552f0eC1B72e8C720147E6)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x002c0c13181038780F552f0eC1B72e8C720147E6)
 */
export function useErc6551RegistryV3Event<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof erc6551RegistryV3ABI, TEventName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof erc6551RegistryV3Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: erc6551RegistryV3ABI,
    address: erc6551RegistryV3Address[chainId as keyof typeof erc6551RegistryV3Address],
    ...config,
  } as UseContractEventConfig<typeof erc6551RegistryV3ABI, TEventName>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link erc6551RegistryV3ABI}__ and `eventName` set to `"ERC6551AccountCreated"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x002c0c13181038780F552f0eC1B72e8C720147E6)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x002c0c13181038780F552f0eC1B72e8C720147E6)
 */
export function useErc6551RegistryV3Erc6551AccountCreatedEvent(
  config: Omit<
    UseContractEventConfig<typeof erc6551RegistryV3ABI, 'ERC6551AccountCreated'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof erc6551RegistryV3Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: erc6551RegistryV3ABI,
    address: erc6551RegistryV3Address[chainId as keyof typeof erc6551RegistryV3Address],
    eventName: 'ERC6551AccountCreated',
    ...config,
  } as UseContractEventConfig<typeof erc6551RegistryV3ABI, 'ERC6551AccountCreated'>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link wethABI}__.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6)
 */
export function useWethRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof wethABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof wethABI, TFunctionName, TSelectData>,
    'abi' | 'address'
  > & { chainId?: keyof typeof wethAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: wethABI,
    address: wethAddress[chainId as keyof typeof wethAddress],
    ...config,
  } as UseContractReadConfig<typeof wethABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link wethABI}__ and `functionName` set to `"name"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6)
 */
export function useWethName<
  TFunctionName extends 'name',
  TSelectData = ReadContractResult<typeof wethABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof wethABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof wethAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: wethABI,
    address: wethAddress[chainId as keyof typeof wethAddress],
    functionName: 'name',
    ...config,
  } as UseContractReadConfig<typeof wethABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link wethABI}__ and `functionName` set to `"totalSupply"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6)
 */
export function useWethTotalSupply<
  TFunctionName extends 'totalSupply',
  TSelectData = ReadContractResult<typeof wethABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof wethABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof wethAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: wethABI,
    address: wethAddress[chainId as keyof typeof wethAddress],
    functionName: 'totalSupply',
    ...config,
  } as UseContractReadConfig<typeof wethABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link wethABI}__ and `functionName` set to `"decimals"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6)
 */
export function useWethDecimals<
  TFunctionName extends 'decimals',
  TSelectData = ReadContractResult<typeof wethABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof wethABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof wethAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: wethABI,
    address: wethAddress[chainId as keyof typeof wethAddress],
    functionName: 'decimals',
    ...config,
  } as UseContractReadConfig<typeof wethABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link wethABI}__ and `functionName` set to `"balanceOf"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6)
 */
export function useWethBalanceOf<
  TFunctionName extends 'balanceOf',
  TSelectData = ReadContractResult<typeof wethABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof wethABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof wethAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: wethABI,
    address: wethAddress[chainId as keyof typeof wethAddress],
    functionName: 'balanceOf',
    ...config,
  } as UseContractReadConfig<typeof wethABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link wethABI}__ and `functionName` set to `"symbol"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6)
 */
export function useWethSymbol<
  TFunctionName extends 'symbol',
  TSelectData = ReadContractResult<typeof wethABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof wethABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof wethAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: wethABI,
    address: wethAddress[chainId as keyof typeof wethAddress],
    functionName: 'symbol',
    ...config,
  } as UseContractReadConfig<typeof wethABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link wethABI}__ and `functionName` set to `"allowance"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6)
 */
export function useWethAllowance<
  TFunctionName extends 'allowance',
  TSelectData = ReadContractResult<typeof wethABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof wethABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof wethAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: wethABI,
    address: wethAddress[chainId as keyof typeof wethAddress],
    functionName: 'allowance',
    ...config,
  } as UseContractReadConfig<typeof wethABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link wethABI}__.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6)
 */
export function useWethWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof wethAddress
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof wethABI, string>['request']['abi'],
        TFunctionName,
        TMode
      > & { address?: Address; chainId?: TChainId }
    : UseContractWriteConfig<typeof wethABI, TFunctionName, TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof wethABI, TFunctionName, TMode>({
    abi: wethABI,
    address: wethAddress[chainId as keyof typeof wethAddress],
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link wethABI}__ and `functionName` set to `"approve"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6)
 */
export function useWethApprove<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof wethAddress
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof wethABI, 'approve'>['request']['abi'],
        'approve',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'approve' }
    : UseContractWriteConfig<typeof wethABI, 'approve', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'approve'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof wethABI, 'approve', TMode>({
    abi: wethABI,
    address: wethAddress[chainId as keyof typeof wethAddress],
    functionName: 'approve',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link wethABI}__ and `functionName` set to `"transferFrom"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6)
 */
export function useWethTransferFrom<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof wethAddress
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof wethABI, 'transferFrom'>['request']['abi'],
        'transferFrom',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'transferFrom' }
    : UseContractWriteConfig<typeof wethABI, 'transferFrom', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'transferFrom'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof wethABI, 'transferFrom', TMode>({
    abi: wethABI,
    address: wethAddress[chainId as keyof typeof wethAddress],
    functionName: 'transferFrom',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link wethABI}__ and `functionName` set to `"withdraw"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6)
 */
export function useWethWithdraw<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof wethAddress
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof wethABI, 'withdraw'>['request']['abi'],
        'withdraw',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'withdraw' }
    : UseContractWriteConfig<typeof wethABI, 'withdraw', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'withdraw'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof wethABI, 'withdraw', TMode>({
    abi: wethABI,
    address: wethAddress[chainId as keyof typeof wethAddress],
    functionName: 'withdraw',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link wethABI}__ and `functionName` set to `"transfer"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6)
 */
export function useWethTransfer<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof wethAddress
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof wethABI, 'transfer'>['request']['abi'],
        'transfer',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'transfer' }
    : UseContractWriteConfig<typeof wethABI, 'transfer', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'transfer'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof wethABI, 'transfer', TMode>({
    abi: wethABI,
    address: wethAddress[chainId as keyof typeof wethAddress],
    functionName: 'transfer',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link wethABI}__ and `functionName` set to `"deposit"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6)
 */
export function useWethDeposit<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof wethAddress
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof wethABI, 'deposit'>['request']['abi'],
        'deposit',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'deposit' }
    : UseContractWriteConfig<typeof wethABI, 'deposit', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'deposit'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof wethABI, 'deposit', TMode>({
    abi: wethABI,
    address: wethAddress[chainId as keyof typeof wethAddress],
    functionName: 'deposit',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link wethABI}__.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6)
 */
export function usePrepareWethWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof wethABI, TFunctionName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof wethAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: wethABI,
    address: wethAddress[chainId as keyof typeof wethAddress],
    ...config,
  } as UsePrepareContractWriteConfig<typeof wethABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link wethABI}__ and `functionName` set to `"approve"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6)
 */
export function usePrepareWethApprove(
  config: Omit<
    UsePrepareContractWriteConfig<typeof wethABI, 'approve'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof wethAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: wethABI,
    address: wethAddress[chainId as keyof typeof wethAddress],
    functionName: 'approve',
    ...config,
  } as UsePrepareContractWriteConfig<typeof wethABI, 'approve'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link wethABI}__ and `functionName` set to `"transferFrom"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6)
 */
export function usePrepareWethTransferFrom(
  config: Omit<
    UsePrepareContractWriteConfig<typeof wethABI, 'transferFrom'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof wethAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: wethABI,
    address: wethAddress[chainId as keyof typeof wethAddress],
    functionName: 'transferFrom',
    ...config,
  } as UsePrepareContractWriteConfig<typeof wethABI, 'transferFrom'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link wethABI}__ and `functionName` set to `"withdraw"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6)
 */
export function usePrepareWethWithdraw(
  config: Omit<
    UsePrepareContractWriteConfig<typeof wethABI, 'withdraw'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof wethAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: wethABI,
    address: wethAddress[chainId as keyof typeof wethAddress],
    functionName: 'withdraw',
    ...config,
  } as UsePrepareContractWriteConfig<typeof wethABI, 'withdraw'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link wethABI}__ and `functionName` set to `"transfer"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6)
 */
export function usePrepareWethTransfer(
  config: Omit<
    UsePrepareContractWriteConfig<typeof wethABI, 'transfer'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof wethAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: wethABI,
    address: wethAddress[chainId as keyof typeof wethAddress],
    functionName: 'transfer',
    ...config,
  } as UsePrepareContractWriteConfig<typeof wethABI, 'transfer'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link wethABI}__ and `functionName` set to `"deposit"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6)
 */
export function usePrepareWethDeposit(
  config: Omit<
    UsePrepareContractWriteConfig<typeof wethABI, 'deposit'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof wethAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: wethABI,
    address: wethAddress[chainId as keyof typeof wethAddress],
    functionName: 'deposit',
    ...config,
  } as UsePrepareContractWriteConfig<typeof wethABI, 'deposit'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link wethABI}__.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6)
 */
export function useWethEvent<TEventName extends string>(
  config: Omit<UseContractEventConfig<typeof wethABI, TEventName>, 'abi' | 'address'> & {
    chainId?: keyof typeof wethAddress
  } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: wethABI,
    address: wethAddress[chainId as keyof typeof wethAddress],
    ...config,
  } as UseContractEventConfig<typeof wethABI, TEventName>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link wethABI}__ and `eventName` set to `"Approval"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6)
 */
export function useWethApprovalEvent(
  config: Omit<
    UseContractEventConfig<typeof wethABI, 'Approval'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof wethAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: wethABI,
    address: wethAddress[chainId as keyof typeof wethAddress],
    eventName: 'Approval',
    ...config,
  } as UseContractEventConfig<typeof wethABI, 'Approval'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link wethABI}__ and `eventName` set to `"Transfer"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6)
 */
export function useWethTransferEvent(
  config: Omit<
    UseContractEventConfig<typeof wethABI, 'Transfer'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof wethAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: wethABI,
    address: wethAddress[chainId as keyof typeof wethAddress],
    eventName: 'Transfer',
    ...config,
  } as UseContractEventConfig<typeof wethABI, 'Transfer'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link wethABI}__ and `eventName` set to `"Deposit"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6)
 */
export function useWethDepositEvent(
  config: Omit<
    UseContractEventConfig<typeof wethABI, 'Deposit'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof wethAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: wethABI,
    address: wethAddress[chainId as keyof typeof wethAddress],
    eventName: 'Deposit',
    ...config,
  } as UseContractEventConfig<typeof wethABI, 'Deposit'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link wethABI}__ and `eventName` set to `"Withdrawal"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6)
 */
export function useWethWithdrawalEvent(
  config: Omit<
    UseContractEventConfig<typeof wethABI, 'Withdrawal'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof wethAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: wethABI,
    address: wethAddress[chainId as keyof typeof wethAddress],
    eventName: 'Withdrawal',
    ...config,
  } as UseContractEventConfig<typeof wethABI, 'Withdrawal'>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155Read<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof zora1155ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>,
    'abi' | 'address'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"CONTRACT_BASE_ID"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155ContractBaseId<
  TFunctionName extends 'CONTRACT_BASE_ID',
  TSelectData = ReadContractResult<typeof zora1155ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'CONTRACT_BASE_ID',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"PERMISSION_BIT_ADMIN"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155PermissionBitAdmin<
  TFunctionName extends 'PERMISSION_BIT_ADMIN',
  TSelectData = ReadContractResult<typeof zora1155ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'PERMISSION_BIT_ADMIN',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"PERMISSION_BIT_FUNDS_MANAGER"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155PermissionBitFundsManager<
  TFunctionName extends 'PERMISSION_BIT_FUNDS_MANAGER',
  TSelectData = ReadContractResult<typeof zora1155ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'PERMISSION_BIT_FUNDS_MANAGER',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"PERMISSION_BIT_METADATA"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155PermissionBitMetadata<
  TFunctionName extends 'PERMISSION_BIT_METADATA',
  TSelectData = ReadContractResult<typeof zora1155ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'PERMISSION_BIT_METADATA',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"PERMISSION_BIT_MINTER"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155PermissionBitMinter<
  TFunctionName extends 'PERMISSION_BIT_MINTER',
  TSelectData = ReadContractResult<typeof zora1155ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'PERMISSION_BIT_MINTER',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"PERMISSION_BIT_SALES"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155PermissionBitSales<
  TFunctionName extends 'PERMISSION_BIT_SALES',
  TSelectData = ReadContractResult<typeof zora1155ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'PERMISSION_BIT_SALES',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"assumeLastTokenIdMatches"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155AssumeLastTokenIdMatches<
  TFunctionName extends 'assumeLastTokenIdMatches',
  TSelectData = ReadContractResult<typeof zora1155ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'assumeLastTokenIdMatches',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"balanceOf"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155BalanceOf<
  TFunctionName extends 'balanceOf',
  TSelectData = ReadContractResult<typeof zora1155ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'balanceOf',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"balanceOfBatch"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155BalanceOfBatch<
  TFunctionName extends 'balanceOfBatch',
  TSelectData = ReadContractResult<typeof zora1155ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'balanceOfBatch',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"computeFreeMintRewards"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155ComputeFreeMintRewards<
  TFunctionName extends 'computeFreeMintRewards',
  TSelectData = ReadContractResult<typeof zora1155ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'computeFreeMintRewards',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"computePaidMintRewards"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155ComputePaidMintRewards<
  TFunctionName extends 'computePaidMintRewards',
  TSelectData = ReadContractResult<typeof zora1155ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'computePaidMintRewards',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"computeTotalReward"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155ComputeTotalReward<
  TFunctionName extends 'computeTotalReward',
  TSelectData = ReadContractResult<typeof zora1155ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'computeTotalReward',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"config"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155Config<
  TFunctionName extends 'config',
  TSelectData = ReadContractResult<typeof zora1155ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'config',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"contractURI"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155ContractUri<
  TFunctionName extends 'contractURI',
  TSelectData = ReadContractResult<typeof zora1155ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'contractURI',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"contractVersion"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155ContractVersion<
  TFunctionName extends 'contractVersion',
  TSelectData = ReadContractResult<typeof zora1155ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'contractVersion',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"createReferrals"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155CreateReferrals<
  TFunctionName extends 'createReferrals',
  TSelectData = ReadContractResult<typeof zora1155ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'createReferrals',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"customRenderers"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155CustomRenderers<
  TFunctionName extends 'customRenderers',
  TSelectData = ReadContractResult<typeof zora1155ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'customRenderers',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"delegatedTokenId"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155DelegatedTokenId<
  TFunctionName extends 'delegatedTokenId',
  TSelectData = ReadContractResult<typeof zora1155ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'delegatedTokenId',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"firstMinters"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155FirstMinters<
  TFunctionName extends 'firstMinters',
  TSelectData = ReadContractResult<typeof zora1155ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'firstMinters',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"getCreatorRewardRecipient"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155GetCreatorRewardRecipient<
  TFunctionName extends 'getCreatorRewardRecipient',
  TSelectData = ReadContractResult<typeof zora1155ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'getCreatorRewardRecipient',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"getCustomRenderer"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155GetCustomRenderer<
  TFunctionName extends 'getCustomRenderer',
  TSelectData = ReadContractResult<typeof zora1155ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'getCustomRenderer',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"getRoyalties"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155GetRoyalties<
  TFunctionName extends 'getRoyalties',
  TSelectData = ReadContractResult<typeof zora1155ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'getRoyalties',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"getTokenInfo"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155GetTokenInfo<
  TFunctionName extends 'getTokenInfo',
  TSelectData = ReadContractResult<typeof zora1155ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'getTokenInfo',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"implementation"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155Implementation<
  TFunctionName extends 'implementation',
  TSelectData = ReadContractResult<typeof zora1155ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'implementation',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"isAdminOrRole"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155IsAdminOrRole<
  TFunctionName extends 'isAdminOrRole',
  TSelectData = ReadContractResult<typeof zora1155ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'isAdminOrRole',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"isApprovedForAll"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155IsApprovedForAll<
  TFunctionName extends 'isApprovedForAll',
  TSelectData = ReadContractResult<typeof zora1155ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'isApprovedForAll',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"metadataRendererContract"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155MetadataRendererContract<
  TFunctionName extends 'metadataRendererContract',
  TSelectData = ReadContractResult<typeof zora1155ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'metadataRendererContract',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"mintFee"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155MintFee<
  TFunctionName extends 'mintFee',
  TSelectData = ReadContractResult<typeof zora1155ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'mintFee',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"name"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155Name<
  TFunctionName extends 'name',
  TSelectData = ReadContractResult<typeof zora1155ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'name',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"nextTokenId"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155NextTokenId<
  TFunctionName extends 'nextTokenId',
  TSelectData = ReadContractResult<typeof zora1155ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'nextTokenId',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"owner"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155Owner<
  TFunctionName extends 'owner',
  TSelectData = ReadContractResult<typeof zora1155ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'owner',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"permissions"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155Permissions<
  TFunctionName extends 'permissions',
  TSelectData = ReadContractResult<typeof zora1155ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'permissions',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"proxiableUUID"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155ProxiableUuid<
  TFunctionName extends 'proxiableUUID',
  TSelectData = ReadContractResult<typeof zora1155ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'proxiableUUID',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"royalties"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155Royalties<
  TFunctionName extends 'royalties',
  TSelectData = ReadContractResult<typeof zora1155ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'royalties',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"royaltyInfo"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155RoyaltyInfo<
  TFunctionName extends 'royaltyInfo',
  TSelectData = ReadContractResult<typeof zora1155ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'royaltyInfo',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"supportsInterface"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155SupportsInterface<
  TFunctionName extends 'supportsInterface',
  TSelectData = ReadContractResult<typeof zora1155ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'supportsInterface',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"symbol"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155Symbol<
  TFunctionName extends 'symbol',
  TSelectData = ReadContractResult<typeof zora1155ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'symbol',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"uri"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155Uri<
  TFunctionName extends 'uri',
  TSelectData = ReadContractResult<typeof zora1155ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'uri',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora1155ABI}__.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155Write<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zora1155Address
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof zora1155ABI, string>['request']['abi'],
        TFunctionName,
        TMode
      > & { address?: Address; chainId?: TChainId }
    : UseContractWriteConfig<typeof zora1155ABI, TFunctionName, TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zora1155ABI, TFunctionName, TMode>({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"addPermission"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155AddPermission<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zora1155Address
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof zora1155ABI, 'addPermission'>['request']['abi'],
        'addPermission',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'addPermission' }
    : UseContractWriteConfig<typeof zora1155ABI, 'addPermission', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'addPermission'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zora1155ABI, 'addPermission', TMode>({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'addPermission',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"adminMint"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155AdminMint<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zora1155Address
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof zora1155ABI, 'adminMint'>['request']['abi'],
        'adminMint',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'adminMint' }
    : UseContractWriteConfig<typeof zora1155ABI, 'adminMint', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'adminMint'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zora1155ABI, 'adminMint', TMode>({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'adminMint',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"adminMintBatch"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155AdminMintBatch<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zora1155Address
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof zora1155ABI,
          'adminMintBatch'
        >['request']['abi'],
        'adminMintBatch',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'adminMintBatch' }
    : UseContractWriteConfig<typeof zora1155ABI, 'adminMintBatch', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'adminMintBatch'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zora1155ABI, 'adminMintBatch', TMode>({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'adminMintBatch',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"burnBatch"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155BurnBatch<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zora1155Address
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof zora1155ABI, 'burnBatch'>['request']['abi'],
        'burnBatch',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'burnBatch' }
    : UseContractWriteConfig<typeof zora1155ABI, 'burnBatch', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'burnBatch'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zora1155ABI, 'burnBatch', TMode>({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'burnBatch',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"callRenderer"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155CallRenderer<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zora1155Address
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof zora1155ABI, 'callRenderer'>['request']['abi'],
        'callRenderer',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'callRenderer' }
    : UseContractWriteConfig<typeof zora1155ABI, 'callRenderer', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'callRenderer'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zora1155ABI, 'callRenderer', TMode>({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'callRenderer',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"callSale"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155CallSale<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zora1155Address
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof zora1155ABI, 'callSale'>['request']['abi'],
        'callSale',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'callSale' }
    : UseContractWriteConfig<typeof zora1155ABI, 'callSale', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'callSale'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zora1155ABI, 'callSale', TMode>({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'callSale',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"delegateSetupNewToken"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155DelegateSetupNewToken<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zora1155Address
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof zora1155ABI,
          'delegateSetupNewToken'
        >['request']['abi'],
        'delegateSetupNewToken',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'delegateSetupNewToken'
      }
    : UseContractWriteConfig<typeof zora1155ABI, 'delegateSetupNewToken', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'delegateSetupNewToken'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zora1155ABI, 'delegateSetupNewToken', TMode>({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'delegateSetupNewToken',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"initialize"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155Initialize<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zora1155Address
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof zora1155ABI, 'initialize'>['request']['abi'],
        'initialize',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'initialize' }
    : UseContractWriteConfig<typeof zora1155ABI, 'initialize', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'initialize'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zora1155ABI, 'initialize', TMode>({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'initialize',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"mint"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155Mint<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zora1155Address
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof zora1155ABI, 'mint'>['request']['abi'],
        'mint',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'mint' }
    : UseContractWriteConfig<typeof zora1155ABI, 'mint', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'mint'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zora1155ABI, 'mint', TMode>({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'mint',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"mintWithRewards"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155MintWithRewards<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zora1155Address
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof zora1155ABI,
          'mintWithRewards'
        >['request']['abi'],
        'mintWithRewards',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'mintWithRewards' }
    : UseContractWriteConfig<typeof zora1155ABI, 'mintWithRewards', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'mintWithRewards'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zora1155ABI, 'mintWithRewards', TMode>({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'mintWithRewards',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"multicall"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155Multicall<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zora1155Address
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof zora1155ABI, 'multicall'>['request']['abi'],
        'multicall',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'multicall' }
    : UseContractWriteConfig<typeof zora1155ABI, 'multicall', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'multicall'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zora1155ABI, 'multicall', TMode>({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'multicall',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"removePermission"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155RemovePermission<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zora1155Address
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof zora1155ABI,
          'removePermission'
        >['request']['abi'],
        'removePermission',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'removePermission' }
    : UseContractWriteConfig<typeof zora1155ABI, 'removePermission', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'removePermission'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zora1155ABI, 'removePermission', TMode>({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'removePermission',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"safeBatchTransferFrom"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155SafeBatchTransferFrom<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zora1155Address
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof zora1155ABI,
          'safeBatchTransferFrom'
        >['request']['abi'],
        'safeBatchTransferFrom',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'safeBatchTransferFrom'
      }
    : UseContractWriteConfig<typeof zora1155ABI, 'safeBatchTransferFrom', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'safeBatchTransferFrom'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zora1155ABI, 'safeBatchTransferFrom', TMode>({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'safeBatchTransferFrom',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"safeTransferFrom"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155SafeTransferFrom<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zora1155Address
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof zora1155ABI,
          'safeTransferFrom'
        >['request']['abi'],
        'safeTransferFrom',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'safeTransferFrom' }
    : UseContractWriteConfig<typeof zora1155ABI, 'safeTransferFrom', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'safeTransferFrom'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zora1155ABI, 'safeTransferFrom', TMode>({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'safeTransferFrom',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"setApprovalForAll"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155SetApprovalForAll<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zora1155Address
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof zora1155ABI,
          'setApprovalForAll'
        >['request']['abi'],
        'setApprovalForAll',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'setApprovalForAll' }
    : UseContractWriteConfig<typeof zora1155ABI, 'setApprovalForAll', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'setApprovalForAll'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zora1155ABI, 'setApprovalForAll', TMode>({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'setApprovalForAll',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"setFundsRecipient"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155SetFundsRecipient<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zora1155Address
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof zora1155ABI,
          'setFundsRecipient'
        >['request']['abi'],
        'setFundsRecipient',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'setFundsRecipient' }
    : UseContractWriteConfig<typeof zora1155ABI, 'setFundsRecipient', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'setFundsRecipient'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zora1155ABI, 'setFundsRecipient', TMode>({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'setFundsRecipient',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"setOwner"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155SetOwner<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zora1155Address
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof zora1155ABI, 'setOwner'>['request']['abi'],
        'setOwner',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'setOwner' }
    : UseContractWriteConfig<typeof zora1155ABI, 'setOwner', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'setOwner'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zora1155ABI, 'setOwner', TMode>({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'setOwner',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"setTokenMetadataRenderer"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155SetTokenMetadataRenderer<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zora1155Address
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof zora1155ABI,
          'setTokenMetadataRenderer'
        >['request']['abi'],
        'setTokenMetadataRenderer',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'setTokenMetadataRenderer'
      }
    : UseContractWriteConfig<typeof zora1155ABI, 'setTokenMetadataRenderer', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'setTokenMetadataRenderer'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zora1155ABI, 'setTokenMetadataRenderer', TMode>({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'setTokenMetadataRenderer',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"setTransferHook"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155SetTransferHook<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zora1155Address
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof zora1155ABI,
          'setTransferHook'
        >['request']['abi'],
        'setTransferHook',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'setTransferHook' }
    : UseContractWriteConfig<typeof zora1155ABI, 'setTransferHook', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'setTransferHook'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zora1155ABI, 'setTransferHook', TMode>({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'setTransferHook',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"setupNewToken"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155SetupNewToken<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zora1155Address
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof zora1155ABI, 'setupNewToken'>['request']['abi'],
        'setupNewToken',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'setupNewToken' }
    : UseContractWriteConfig<typeof zora1155ABI, 'setupNewToken', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'setupNewToken'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zora1155ABI, 'setupNewToken', TMode>({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'setupNewToken',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"setupNewTokenWithCreateReferral"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155SetupNewTokenWithCreateReferral<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zora1155Address
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof zora1155ABI,
          'setupNewTokenWithCreateReferral'
        >['request']['abi'],
        'setupNewTokenWithCreateReferral',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'setupNewTokenWithCreateReferral'
      }
    : UseContractWriteConfig<
        typeof zora1155ABI,
        'setupNewTokenWithCreateReferral',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'setupNewTokenWithCreateReferral'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zora1155ABI, 'setupNewTokenWithCreateReferral', TMode>({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'setupNewTokenWithCreateReferral',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"updateContractMetadata"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155UpdateContractMetadata<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zora1155Address
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof zora1155ABI,
          'updateContractMetadata'
        >['request']['abi'],
        'updateContractMetadata',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'updateContractMetadata'
      }
    : UseContractWriteConfig<typeof zora1155ABI, 'updateContractMetadata', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'updateContractMetadata'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zora1155ABI, 'updateContractMetadata', TMode>({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'updateContractMetadata',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"updateCreateReferral"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155UpdateCreateReferral<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zora1155Address
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof zora1155ABI,
          'updateCreateReferral'
        >['request']['abi'],
        'updateCreateReferral',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'updateCreateReferral' }
    : UseContractWriteConfig<typeof zora1155ABI, 'updateCreateReferral', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'updateCreateReferral'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zora1155ABI, 'updateCreateReferral', TMode>({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'updateCreateReferral',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"updateRoyaltiesForToken"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155UpdateRoyaltiesForToken<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zora1155Address
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof zora1155ABI,
          'updateRoyaltiesForToken'
        >['request']['abi'],
        'updateRoyaltiesForToken',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'updateRoyaltiesForToken'
      }
    : UseContractWriteConfig<typeof zora1155ABI, 'updateRoyaltiesForToken', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'updateRoyaltiesForToken'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zora1155ABI, 'updateRoyaltiesForToken', TMode>({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'updateRoyaltiesForToken',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"updateTokenURI"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155UpdateTokenUri<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zora1155Address
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof zora1155ABI,
          'updateTokenURI'
        >['request']['abi'],
        'updateTokenURI',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'updateTokenURI' }
    : UseContractWriteConfig<typeof zora1155ABI, 'updateTokenURI', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'updateTokenURI'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zora1155ABI, 'updateTokenURI', TMode>({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'updateTokenURI',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"upgradeTo"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155UpgradeTo<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zora1155Address
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof zora1155ABI, 'upgradeTo'>['request']['abi'],
        'upgradeTo',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'upgradeTo' }
    : UseContractWriteConfig<typeof zora1155ABI, 'upgradeTo', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'upgradeTo'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zora1155ABI, 'upgradeTo', TMode>({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'upgradeTo',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"upgradeToAndCall"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155UpgradeToAndCall<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zora1155Address
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof zora1155ABI,
          'upgradeToAndCall'
        >['request']['abi'],
        'upgradeToAndCall',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'upgradeToAndCall' }
    : UseContractWriteConfig<typeof zora1155ABI, 'upgradeToAndCall', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'upgradeToAndCall'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zora1155ABI, 'upgradeToAndCall', TMode>({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'upgradeToAndCall',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"withdraw"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155Withdraw<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zora1155Address
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof zora1155ABI, 'withdraw'>['request']['abi'],
        'withdraw',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'withdraw' }
    : UseContractWriteConfig<typeof zora1155ABI, 'withdraw', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'withdraw'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zora1155ABI, 'withdraw', TMode>({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'withdraw',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"withdrawRewards"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155WithdrawRewards<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zora1155Address
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof zora1155ABI,
          'withdrawRewards'
        >['request']['abi'],
        'withdrawRewards',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'withdrawRewards' }
    : UseContractWriteConfig<typeof zora1155ABI, 'withdrawRewards', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'withdrawRewards'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zora1155ABI, 'withdrawRewards', TMode>({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'withdrawRewards',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora1155ABI}__.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function usePrepareZora1155Write<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora1155ABI, TFunctionName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora1155ABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"addPermission"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function usePrepareZora1155AddPermission(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora1155ABI, 'addPermission'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'addPermission',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora1155ABI, 'addPermission'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"adminMint"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function usePrepareZora1155AdminMint(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora1155ABI, 'adminMint'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'adminMint',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora1155ABI, 'adminMint'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"adminMintBatch"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function usePrepareZora1155AdminMintBatch(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora1155ABI, 'adminMintBatch'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'adminMintBatch',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora1155ABI, 'adminMintBatch'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"burnBatch"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function usePrepareZora1155BurnBatch(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora1155ABI, 'burnBatch'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'burnBatch',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora1155ABI, 'burnBatch'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"callRenderer"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function usePrepareZora1155CallRenderer(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora1155ABI, 'callRenderer'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'callRenderer',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora1155ABI, 'callRenderer'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"callSale"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function usePrepareZora1155CallSale(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora1155ABI, 'callSale'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'callSale',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora1155ABI, 'callSale'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"delegateSetupNewToken"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function usePrepareZora1155DelegateSetupNewToken(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora1155ABI, 'delegateSetupNewToken'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'delegateSetupNewToken',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora1155ABI, 'delegateSetupNewToken'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"initialize"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function usePrepareZora1155Initialize(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora1155ABI, 'initialize'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'initialize',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora1155ABI, 'initialize'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"mint"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function usePrepareZora1155Mint(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora1155ABI, 'mint'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'mint',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora1155ABI, 'mint'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"mintWithRewards"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function usePrepareZora1155MintWithRewards(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora1155ABI, 'mintWithRewards'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'mintWithRewards',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora1155ABI, 'mintWithRewards'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"multicall"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function usePrepareZora1155Multicall(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora1155ABI, 'multicall'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'multicall',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora1155ABI, 'multicall'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"removePermission"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function usePrepareZora1155RemovePermission(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora1155ABI, 'removePermission'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'removePermission',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora1155ABI, 'removePermission'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"safeBatchTransferFrom"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function usePrepareZora1155SafeBatchTransferFrom(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora1155ABI, 'safeBatchTransferFrom'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'safeBatchTransferFrom',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora1155ABI, 'safeBatchTransferFrom'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"safeTransferFrom"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function usePrepareZora1155SafeTransferFrom(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora1155ABI, 'safeTransferFrom'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'safeTransferFrom',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora1155ABI, 'safeTransferFrom'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"setApprovalForAll"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function usePrepareZora1155SetApprovalForAll(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora1155ABI, 'setApprovalForAll'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'setApprovalForAll',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora1155ABI, 'setApprovalForAll'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"setFundsRecipient"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function usePrepareZora1155SetFundsRecipient(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora1155ABI, 'setFundsRecipient'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'setFundsRecipient',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora1155ABI, 'setFundsRecipient'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"setOwner"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function usePrepareZora1155SetOwner(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora1155ABI, 'setOwner'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'setOwner',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora1155ABI, 'setOwner'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"setTokenMetadataRenderer"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function usePrepareZora1155SetTokenMetadataRenderer(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora1155ABI, 'setTokenMetadataRenderer'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'setTokenMetadataRenderer',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora1155ABI, 'setTokenMetadataRenderer'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"setTransferHook"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function usePrepareZora1155SetTransferHook(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora1155ABI, 'setTransferHook'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'setTransferHook',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora1155ABI, 'setTransferHook'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"setupNewToken"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function usePrepareZora1155SetupNewToken(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora1155ABI, 'setupNewToken'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'setupNewToken',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora1155ABI, 'setupNewToken'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"setupNewTokenWithCreateReferral"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function usePrepareZora1155SetupNewTokenWithCreateReferral(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora1155ABI, 'setupNewTokenWithCreateReferral'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'setupNewTokenWithCreateReferral',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof zora1155ABI,
    'setupNewTokenWithCreateReferral'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"updateContractMetadata"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function usePrepareZora1155UpdateContractMetadata(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora1155ABI, 'updateContractMetadata'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'updateContractMetadata',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora1155ABI, 'updateContractMetadata'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"updateCreateReferral"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function usePrepareZora1155UpdateCreateReferral(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora1155ABI, 'updateCreateReferral'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'updateCreateReferral',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora1155ABI, 'updateCreateReferral'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"updateRoyaltiesForToken"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function usePrepareZora1155UpdateRoyaltiesForToken(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora1155ABI, 'updateRoyaltiesForToken'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'updateRoyaltiesForToken',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora1155ABI, 'updateRoyaltiesForToken'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"updateTokenURI"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function usePrepareZora1155UpdateTokenUri(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora1155ABI, 'updateTokenURI'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'updateTokenURI',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora1155ABI, 'updateTokenURI'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"upgradeTo"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function usePrepareZora1155UpgradeTo(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora1155ABI, 'upgradeTo'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'upgradeTo',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora1155ABI, 'upgradeTo'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"upgradeToAndCall"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function usePrepareZora1155UpgradeToAndCall(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora1155ABI, 'upgradeToAndCall'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'upgradeToAndCall',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora1155ABI, 'upgradeToAndCall'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"withdraw"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function usePrepareZora1155Withdraw(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora1155ABI, 'withdraw'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'withdraw',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora1155ABI, 'withdraw'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"withdrawRewards"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function usePrepareZora1155WithdrawRewards(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora1155ABI, 'withdrawRewards'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    functionName: 'withdrawRewards',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora1155ABI, 'withdrawRewards'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora1155ABI}__.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155Event<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof zora1155ABI, TEventName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    ...config,
  } as UseContractEventConfig<typeof zora1155ABI, TEventName>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora1155ABI}__ and `eventName` set to `"AdminChanged"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155AdminChangedEvent(
  config: Omit<
    UseContractEventConfig<typeof zora1155ABI, 'AdminChanged'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    eventName: 'AdminChanged',
    ...config,
  } as UseContractEventConfig<typeof zora1155ABI, 'AdminChanged'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora1155ABI}__ and `eventName` set to `"ApprovalForAll"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155ApprovalForAllEvent(
  config: Omit<
    UseContractEventConfig<typeof zora1155ABI, 'ApprovalForAll'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    eventName: 'ApprovalForAll',
    ...config,
  } as UseContractEventConfig<typeof zora1155ABI, 'ApprovalForAll'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora1155ABI}__ and `eventName` set to `"BeaconUpgraded"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155BeaconUpgradedEvent(
  config: Omit<
    UseContractEventConfig<typeof zora1155ABI, 'BeaconUpgraded'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    eventName: 'BeaconUpgraded',
    ...config,
  } as UseContractEventConfig<typeof zora1155ABI, 'BeaconUpgraded'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora1155ABI}__ and `eventName` set to `"ConfigUpdated"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155ConfigUpdatedEvent(
  config: Omit<
    UseContractEventConfig<typeof zora1155ABI, 'ConfigUpdated'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    eventName: 'ConfigUpdated',
    ...config,
  } as UseContractEventConfig<typeof zora1155ABI, 'ConfigUpdated'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora1155ABI}__ and `eventName` set to `"ContractMetadataUpdated"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155ContractMetadataUpdatedEvent(
  config: Omit<
    UseContractEventConfig<typeof zora1155ABI, 'ContractMetadataUpdated'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    eventName: 'ContractMetadataUpdated',
    ...config,
  } as UseContractEventConfig<typeof zora1155ABI, 'ContractMetadataUpdated'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora1155ABI}__ and `eventName` set to `"ContractRendererUpdated"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155ContractRendererUpdatedEvent(
  config: Omit<
    UseContractEventConfig<typeof zora1155ABI, 'ContractRendererUpdated'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    eventName: 'ContractRendererUpdated',
    ...config,
  } as UseContractEventConfig<typeof zora1155ABI, 'ContractRendererUpdated'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora1155ABI}__ and `eventName` set to `"CreatorAttribution"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155CreatorAttributionEvent(
  config: Omit<
    UseContractEventConfig<typeof zora1155ABI, 'CreatorAttribution'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    eventName: 'CreatorAttribution',
    ...config,
  } as UseContractEventConfig<typeof zora1155ABI, 'CreatorAttribution'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora1155ABI}__ and `eventName` set to `"Initialized"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155InitializedEvent(
  config: Omit<
    UseContractEventConfig<typeof zora1155ABI, 'Initialized'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    eventName: 'Initialized',
    ...config,
  } as UseContractEventConfig<typeof zora1155ABI, 'Initialized'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora1155ABI}__ and `eventName` set to `"OwnershipTransferred"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155OwnershipTransferredEvent(
  config: Omit<
    UseContractEventConfig<typeof zora1155ABI, 'OwnershipTransferred'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    eventName: 'OwnershipTransferred',
    ...config,
  } as UseContractEventConfig<typeof zora1155ABI, 'OwnershipTransferred'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora1155ABI}__ and `eventName` set to `"Purchased"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155PurchasedEvent(
  config: Omit<
    UseContractEventConfig<typeof zora1155ABI, 'Purchased'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    eventName: 'Purchased',
    ...config,
  } as UseContractEventConfig<typeof zora1155ABI, 'Purchased'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora1155ABI}__ and `eventName` set to `"RendererUpdated"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155RendererUpdatedEvent(
  config: Omit<
    UseContractEventConfig<typeof zora1155ABI, 'RendererUpdated'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    eventName: 'RendererUpdated',
    ...config,
  } as UseContractEventConfig<typeof zora1155ABI, 'RendererUpdated'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora1155ABI}__ and `eventName` set to `"SetupNewToken"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155SetupNewTokenEvent(
  config: Omit<
    UseContractEventConfig<typeof zora1155ABI, 'SetupNewToken'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    eventName: 'SetupNewToken',
    ...config,
  } as UseContractEventConfig<typeof zora1155ABI, 'SetupNewToken'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora1155ABI}__ and `eventName` set to `"TransferBatch"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155TransferBatchEvent(
  config: Omit<
    UseContractEventConfig<typeof zora1155ABI, 'TransferBatch'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    eventName: 'TransferBatch',
    ...config,
  } as UseContractEventConfig<typeof zora1155ABI, 'TransferBatch'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora1155ABI}__ and `eventName` set to `"TransferSingle"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155TransferSingleEvent(
  config: Omit<
    UseContractEventConfig<typeof zora1155ABI, 'TransferSingle'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    eventName: 'TransferSingle',
    ...config,
  } as UseContractEventConfig<typeof zora1155ABI, 'TransferSingle'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora1155ABI}__ and `eventName` set to `"URI"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155UriEvent(
  config: Omit<
    UseContractEventConfig<typeof zora1155ABI, 'URI'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    eventName: 'URI',
    ...config,
  } as UseContractEventConfig<typeof zora1155ABI, 'URI'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora1155ABI}__ and `eventName` set to `"UpdatedPermissions"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155UpdatedPermissionsEvent(
  config: Omit<
    UseContractEventConfig<typeof zora1155ABI, 'UpdatedPermissions'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    eventName: 'UpdatedPermissions',
    ...config,
  } as UseContractEventConfig<typeof zora1155ABI, 'UpdatedPermissions'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora1155ABI}__ and `eventName` set to `"UpdatedRoyalties"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155UpdatedRoyaltiesEvent(
  config: Omit<
    UseContractEventConfig<typeof zora1155ABI, 'UpdatedRoyalties'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    eventName: 'UpdatedRoyalties',
    ...config,
  } as UseContractEventConfig<typeof zora1155ABI, 'UpdatedRoyalties'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora1155ABI}__ and `eventName` set to `"UpdatedToken"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155UpdatedTokenEvent(
  config: Omit<
    UseContractEventConfig<typeof zora1155ABI, 'UpdatedToken'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    eventName: 'UpdatedToken',
    ...config,
  } as UseContractEventConfig<typeof zora1155ABI, 'UpdatedToken'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora1155ABI}__ and `eventName` set to `"Upgraded"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x4482c5929618b848a46e3da830a3d71085a5de07)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA)
 */
export function useZora1155UpgradedEvent(
  config: Omit<
    UseContractEventConfig<typeof zora1155ABI, 'Upgraded'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: zora1155ABI,
    address: zora1155Address[chainId as keyof typeof zora1155Address],
    eventName: 'Upgraded',
    ...config,
  } as UseContractEventConfig<typeof zora1155ABI, 'Upgraded'>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora721DropABI}__.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof zora721DropABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>,
    'abi' | 'address'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    ...config,
  } as UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"DEFAULT_ADMIN_ROLE"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropDefaultAdminRole<
  TFunctionName extends 'DEFAULT_ADMIN_ROLE',
  TSelectData = ReadContractResult<typeof zora721DropABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'DEFAULT_ADMIN_ROLE',
    ...config,
  } as UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"MINTER_ROLE"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropMinterRole<
  TFunctionName extends 'MINTER_ROLE',
  TSelectData = ReadContractResult<typeof zora721DropABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'MINTER_ROLE',
    ...config,
  } as UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"SALES_MANAGER_ROLE"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropSalesManagerRole<
  TFunctionName extends 'SALES_MANAGER_ROLE',
  TSelectData = ReadContractResult<typeof zora721DropABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'SALES_MANAGER_ROLE',
    ...config,
  } as UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"balanceOf"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropBalanceOf<
  TFunctionName extends 'balanceOf',
  TSelectData = ReadContractResult<typeof zora721DropABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'balanceOf',
    ...config,
  } as UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"computeFreeMintRewards"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropComputeFreeMintRewards<
  TFunctionName extends 'computeFreeMintRewards',
  TSelectData = ReadContractResult<typeof zora721DropABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'computeFreeMintRewards',
    ...config,
  } as UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"computePaidMintRewards"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropComputePaidMintRewards<
  TFunctionName extends 'computePaidMintRewards',
  TSelectData = ReadContractResult<typeof zora721DropABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'computePaidMintRewards',
    ...config,
  } as UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"computeTotalReward"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropComputeTotalReward<
  TFunctionName extends 'computeTotalReward',
  TSelectData = ReadContractResult<typeof zora721DropABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'computeTotalReward',
    ...config,
  } as UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"config"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropConfig<
  TFunctionName extends 'config',
  TSelectData = ReadContractResult<typeof zora721DropABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'config',
    ...config,
  } as UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"contractURI"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropContractUri<
  TFunctionName extends 'contractURI',
  TSelectData = ReadContractResult<typeof zora721DropABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'contractURI',
    ...config,
  } as UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"contractVersion"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropContractVersion<
  TFunctionName extends 'contractVersion',
  TSelectData = ReadContractResult<typeof zora721DropABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'contractVersion',
    ...config,
  } as UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"createReferral"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropCreateReferral<
  TFunctionName extends 'createReferral',
  TSelectData = ReadContractResult<typeof zora721DropABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'createReferral',
    ...config,
  } as UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"factoryUpgradeGate"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropFactoryUpgradeGate<
  TFunctionName extends 'factoryUpgradeGate',
  TSelectData = ReadContractResult<typeof zora721DropABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'factoryUpgradeGate',
    ...config,
  } as UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"getApproved"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropGetApproved<
  TFunctionName extends 'getApproved',
  TSelectData = ReadContractResult<typeof zora721DropABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'getApproved',
    ...config,
  } as UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"getRoleAdmin"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropGetRoleAdmin<
  TFunctionName extends 'getRoleAdmin',
  TSelectData = ReadContractResult<typeof zora721DropABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'getRoleAdmin',
    ...config,
  } as UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"hasRole"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropHasRole<
  TFunctionName extends 'hasRole',
  TSelectData = ReadContractResult<typeof zora721DropABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'hasRole',
    ...config,
  } as UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"isAdmin"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropIsAdmin<
  TFunctionName extends 'isAdmin',
  TSelectData = ReadContractResult<typeof zora721DropABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'isAdmin',
    ...config,
  } as UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"isApprovedForAll"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropIsApprovedForAll<
  TFunctionName extends 'isApprovedForAll',
  TSelectData = ReadContractResult<typeof zora721DropABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'isApprovedForAll',
    ...config,
  } as UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"marketFilterDAOAddress"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropMarketFilterDaoAddress<
  TFunctionName extends 'marketFilterDAOAddress',
  TSelectData = ReadContractResult<typeof zora721DropABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'marketFilterDAOAddress',
    ...config,
  } as UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"metadataRenderer"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropMetadataRenderer<
  TFunctionName extends 'metadataRenderer',
  TSelectData = ReadContractResult<typeof zora721DropABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'metadataRenderer',
    ...config,
  } as UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"mintedPerAddress"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropMintedPerAddress<
  TFunctionName extends 'mintedPerAddress',
  TSelectData = ReadContractResult<typeof zora721DropABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'mintedPerAddress',
    ...config,
  } as UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"name"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropName<
  TFunctionName extends 'name',
  TSelectData = ReadContractResult<typeof zora721DropABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'name',
    ...config,
  } as UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"owner"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropOwner<
  TFunctionName extends 'owner',
  TSelectData = ReadContractResult<typeof zora721DropABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'owner',
    ...config,
  } as UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"ownerOf"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropOwnerOf<
  TFunctionName extends 'ownerOf',
  TSelectData = ReadContractResult<typeof zora721DropABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'ownerOf',
    ...config,
  } as UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"presaleMintsByAddress"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropPresaleMintsByAddress<
  TFunctionName extends 'presaleMintsByAddress',
  TSelectData = ReadContractResult<typeof zora721DropABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'presaleMintsByAddress',
    ...config,
  } as UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"proxiableUUID"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropProxiableUuid<
  TFunctionName extends 'proxiableUUID',
  TSelectData = ReadContractResult<typeof zora721DropABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'proxiableUUID',
    ...config,
  } as UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"royaltyInfo"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropRoyaltyInfo<
  TFunctionName extends 'royaltyInfo',
  TSelectData = ReadContractResult<typeof zora721DropABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'royaltyInfo',
    ...config,
  } as UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"royaltyMintSchedule"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropRoyaltyMintSchedule<
  TFunctionName extends 'royaltyMintSchedule',
  TSelectData = ReadContractResult<typeof zora721DropABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'royaltyMintSchedule',
    ...config,
  } as UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"saleDetails"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropSaleDetails<
  TFunctionName extends 'saleDetails',
  TSelectData = ReadContractResult<typeof zora721DropABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'saleDetails',
    ...config,
  } as UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"salesConfig"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropSalesConfig<
  TFunctionName extends 'salesConfig',
  TSelectData = ReadContractResult<typeof zora721DropABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'salesConfig',
    ...config,
  } as UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"supportsInterface"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropSupportsInterface<
  TFunctionName extends 'supportsInterface',
  TSelectData = ReadContractResult<typeof zora721DropABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'supportsInterface',
    ...config,
  } as UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"symbol"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropSymbol<
  TFunctionName extends 'symbol',
  TSelectData = ReadContractResult<typeof zora721DropABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'symbol',
    ...config,
  } as UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"tokenURI"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropTokenUri<
  TFunctionName extends 'tokenURI',
  TSelectData = ReadContractResult<typeof zora721DropABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'tokenURI',
    ...config,
  } as UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"totalSupply"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropTotalSupply<
  TFunctionName extends 'totalSupply',
  TSelectData = ReadContractResult<typeof zora721DropABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'totalSupply',
    ...config,
  } as UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"zoraERC721TransferHelper"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropZoraErc721TransferHelper<
  TFunctionName extends 'zoraERC721TransferHelper',
  TSelectData = ReadContractResult<typeof zora721DropABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'zoraERC721TransferHelper',
    ...config,
  } as UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"zoraFeeForAmount"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropZoraFeeForAmount<
  TFunctionName extends 'zoraFeeForAmount',
  TSelectData = ReadContractResult<typeof zora721DropABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractRead({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'zoraFeeForAmount',
    ...config,
  } as UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora721DropABI}__.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropWrite<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zora721DropAddress
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof zora721DropABI, string>['request']['abi'],
        TFunctionName,
        TMode
      > & { address?: Address; chainId?: TChainId }
    : UseContractWriteConfig<typeof zora721DropABI, TFunctionName, TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zora721DropABI, TFunctionName, TMode>({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"adminMint"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropAdminMint<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zora721DropAddress
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof zora721DropABI, 'adminMint'>['request']['abi'],
        'adminMint',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'adminMint' }
    : UseContractWriteConfig<typeof zora721DropABI, 'adminMint', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'adminMint'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zora721DropABI, 'adminMint', TMode>({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'adminMint',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"adminMintAirdrop"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropAdminMintAirdrop<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zora721DropAddress
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof zora721DropABI,
          'adminMintAirdrop'
        >['request']['abi'],
        'adminMintAirdrop',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'adminMintAirdrop' }
    : UseContractWriteConfig<typeof zora721DropABI, 'adminMintAirdrop', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'adminMintAirdrop'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zora721DropABI, 'adminMintAirdrop', TMode>({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'adminMintAirdrop',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"approve"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropApprove<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zora721DropAddress
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof zora721DropABI, 'approve'>['request']['abi'],
        'approve',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'approve' }
    : UseContractWriteConfig<typeof zora721DropABI, 'approve', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'approve'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zora721DropABI, 'approve', TMode>({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'approve',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"burn"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropBurn<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zora721DropAddress
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof zora721DropABI, 'burn'>['request']['abi'],
        'burn',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'burn' }
    : UseContractWriteConfig<typeof zora721DropABI, 'burn', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'burn'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zora721DropABI, 'burn', TMode>({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'burn',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"callMetadataRenderer"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropCallMetadataRenderer<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zora721DropAddress
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof zora721DropABI,
          'callMetadataRenderer'
        >['request']['abi'],
        'callMetadataRenderer',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'callMetadataRenderer' }
    : UseContractWriteConfig<typeof zora721DropABI, 'callMetadataRenderer', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'callMetadataRenderer'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zora721DropABI, 'callMetadataRenderer', TMode>({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'callMetadataRenderer',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"finalizeOpenEdition"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropFinalizeOpenEdition<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zora721DropAddress
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof zora721DropABI,
          'finalizeOpenEdition'
        >['request']['abi'],
        'finalizeOpenEdition',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'finalizeOpenEdition' }
    : UseContractWriteConfig<typeof zora721DropABI, 'finalizeOpenEdition', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'finalizeOpenEdition'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zora721DropABI, 'finalizeOpenEdition', TMode>({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'finalizeOpenEdition',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"grantRole"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropGrantRole<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zora721DropAddress
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof zora721DropABI, 'grantRole'>['request']['abi'],
        'grantRole',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'grantRole' }
    : UseContractWriteConfig<typeof zora721DropABI, 'grantRole', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'grantRole'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zora721DropABI, 'grantRole', TMode>({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'grantRole',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"initialize"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropInitialize<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zora721DropAddress
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof zora721DropABI, 'initialize'>['request']['abi'],
        'initialize',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'initialize' }
    : UseContractWriteConfig<typeof zora721DropABI, 'initialize', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'initialize'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zora721DropABI, 'initialize', TMode>({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'initialize',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"manageMarketFilterDAOSubscription"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropManageMarketFilterDaoSubscription<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zora721DropAddress
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof zora721DropABI,
          'manageMarketFilterDAOSubscription'
        >['request']['abi'],
        'manageMarketFilterDAOSubscription',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'manageMarketFilterDAOSubscription'
      }
    : UseContractWriteConfig<
        typeof zora721DropABI,
        'manageMarketFilterDAOSubscription',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'manageMarketFilterDAOSubscription'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<
    typeof zora721DropABI,
    'manageMarketFilterDAOSubscription',
    TMode
  >({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'manageMarketFilterDAOSubscription',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"mintWithRewards"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropMintWithRewards<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zora721DropAddress
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof zora721DropABI,
          'mintWithRewards'
        >['request']['abi'],
        'mintWithRewards',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'mintWithRewards' }
    : UseContractWriteConfig<typeof zora721DropABI, 'mintWithRewards', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'mintWithRewards'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zora721DropABI, 'mintWithRewards', TMode>({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'mintWithRewards',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"multicall"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropMulticall<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zora721DropAddress
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof zora721DropABI, 'multicall'>['request']['abi'],
        'multicall',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'multicall' }
    : UseContractWriteConfig<typeof zora721DropABI, 'multicall', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'multicall'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zora721DropABI, 'multicall', TMode>({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'multicall',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"purchase"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropPurchase<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zora721DropAddress
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof zora721DropABI, 'purchase'>['request']['abi'],
        'purchase',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'purchase' }
    : UseContractWriteConfig<typeof zora721DropABI, 'purchase', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'purchase'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zora721DropABI, 'purchase', TMode>({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'purchase',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"purchasePresale"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropPurchasePresale<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zora721DropAddress
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof zora721DropABI,
          'purchasePresale'
        >['request']['abi'],
        'purchasePresale',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'purchasePresale' }
    : UseContractWriteConfig<typeof zora721DropABI, 'purchasePresale', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'purchasePresale'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zora721DropABI, 'purchasePresale', TMode>({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'purchasePresale',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"purchasePresaleWithComment"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropPurchasePresaleWithComment<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zora721DropAddress
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof zora721DropABI,
          'purchasePresaleWithComment'
        >['request']['abi'],
        'purchasePresaleWithComment',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'purchasePresaleWithComment'
      }
    : UseContractWriteConfig<
        typeof zora721DropABI,
        'purchasePresaleWithComment',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'purchasePresaleWithComment'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zora721DropABI, 'purchasePresaleWithComment', TMode>({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'purchasePresaleWithComment',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"purchasePresaleWithRewards"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropPurchasePresaleWithRewards<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zora721DropAddress
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof zora721DropABI,
          'purchasePresaleWithRewards'
        >['request']['abi'],
        'purchasePresaleWithRewards',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'purchasePresaleWithRewards'
      }
    : UseContractWriteConfig<
        typeof zora721DropABI,
        'purchasePresaleWithRewards',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'purchasePresaleWithRewards'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zora721DropABI, 'purchasePresaleWithRewards', TMode>({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'purchasePresaleWithRewards',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"purchaseWithComment"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropPurchaseWithComment<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zora721DropAddress
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof zora721DropABI,
          'purchaseWithComment'
        >['request']['abi'],
        'purchaseWithComment',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'purchaseWithComment' }
    : UseContractWriteConfig<typeof zora721DropABI, 'purchaseWithComment', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'purchaseWithComment'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zora721DropABI, 'purchaseWithComment', TMode>({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'purchaseWithComment',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"purchaseWithRecipient"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropPurchaseWithRecipient<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zora721DropAddress
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof zora721DropABI,
          'purchaseWithRecipient'
        >['request']['abi'],
        'purchaseWithRecipient',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'purchaseWithRecipient'
      }
    : UseContractWriteConfig<typeof zora721DropABI, 'purchaseWithRecipient', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'purchaseWithRecipient'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zora721DropABI, 'purchaseWithRecipient', TMode>({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'purchaseWithRecipient',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"renounceRole"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropRenounceRole<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zora721DropAddress
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof zora721DropABI,
          'renounceRole'
        >['request']['abi'],
        'renounceRole',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'renounceRole' }
    : UseContractWriteConfig<typeof zora721DropABI, 'renounceRole', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'renounceRole'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zora721DropABI, 'renounceRole', TMode>({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'renounceRole',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"revokeRole"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropRevokeRole<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zora721DropAddress
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof zora721DropABI, 'revokeRole'>['request']['abi'],
        'revokeRole',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'revokeRole' }
    : UseContractWriteConfig<typeof zora721DropABI, 'revokeRole', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'revokeRole'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zora721DropABI, 'revokeRole', TMode>({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'revokeRole',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"safeTransferFrom"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropSafeTransferFrom<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zora721DropAddress
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof zora721DropABI,
          'safeTransferFrom'
        >['request']['abi'],
        'safeTransferFrom',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'safeTransferFrom' }
    : UseContractWriteConfig<typeof zora721DropABI, 'safeTransferFrom', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'safeTransferFrom'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zora721DropABI, 'safeTransferFrom', TMode>({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'safeTransferFrom',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"setApprovalForAll"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropSetApprovalForAll<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zora721DropAddress
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof zora721DropABI,
          'setApprovalForAll'
        >['request']['abi'],
        'setApprovalForAll',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'setApprovalForAll' }
    : UseContractWriteConfig<typeof zora721DropABI, 'setApprovalForAll', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'setApprovalForAll'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zora721DropABI, 'setApprovalForAll', TMode>({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'setApprovalForAll',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"setFundsRecipient"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropSetFundsRecipient<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zora721DropAddress
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof zora721DropABI,
          'setFundsRecipient'
        >['request']['abi'],
        'setFundsRecipient',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'setFundsRecipient' }
    : UseContractWriteConfig<typeof zora721DropABI, 'setFundsRecipient', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'setFundsRecipient'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zora721DropABI, 'setFundsRecipient', TMode>({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'setFundsRecipient',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"setMetadataRenderer"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropSetMetadataRenderer<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zora721DropAddress
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof zora721DropABI,
          'setMetadataRenderer'
        >['request']['abi'],
        'setMetadataRenderer',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'setMetadataRenderer' }
    : UseContractWriteConfig<typeof zora721DropABI, 'setMetadataRenderer', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'setMetadataRenderer'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zora721DropABI, 'setMetadataRenderer', TMode>({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'setMetadataRenderer',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"setOwner"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropSetOwner<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zora721DropAddress
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof zora721DropABI, 'setOwner'>['request']['abi'],
        'setOwner',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'setOwner' }
    : UseContractWriteConfig<typeof zora721DropABI, 'setOwner', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'setOwner'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zora721DropABI, 'setOwner', TMode>({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'setOwner',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"setSaleConfiguration"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropSetSaleConfiguration<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zora721DropAddress
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof zora721DropABI,
          'setSaleConfiguration'
        >['request']['abi'],
        'setSaleConfiguration',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'setSaleConfiguration' }
    : UseContractWriteConfig<typeof zora721DropABI, 'setSaleConfiguration', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'setSaleConfiguration'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zora721DropABI, 'setSaleConfiguration', TMode>({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'setSaleConfiguration',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"transferFrom"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropTransferFrom<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zora721DropAddress
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof zora721DropABI,
          'transferFrom'
        >['request']['abi'],
        'transferFrom',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'transferFrom' }
    : UseContractWriteConfig<typeof zora721DropABI, 'transferFrom', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'transferFrom'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zora721DropABI, 'transferFrom', TMode>({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'transferFrom',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"updateCreateReferral"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropUpdateCreateReferral<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zora721DropAddress
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof zora721DropABI,
          'updateCreateReferral'
        >['request']['abi'],
        'updateCreateReferral',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'updateCreateReferral' }
    : UseContractWriteConfig<typeof zora721DropABI, 'updateCreateReferral', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'updateCreateReferral'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zora721DropABI, 'updateCreateReferral', TMode>({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'updateCreateReferral',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"updateMarketFilterSettings"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropUpdateMarketFilterSettings<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zora721DropAddress
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof zora721DropABI,
          'updateMarketFilterSettings'
        >['request']['abi'],
        'updateMarketFilterSettings',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'updateMarketFilterSettings'
      }
    : UseContractWriteConfig<
        typeof zora721DropABI,
        'updateMarketFilterSettings',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'updateMarketFilterSettings'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zora721DropABI, 'updateMarketFilterSettings', TMode>({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'updateMarketFilterSettings',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"updateRoyaltyMintSchedule"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropUpdateRoyaltyMintSchedule<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zora721DropAddress
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof zora721DropABI,
          'updateRoyaltyMintSchedule'
        >['request']['abi'],
        'updateRoyaltyMintSchedule',
        TMode
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'updateRoyaltyMintSchedule'
      }
    : UseContractWriteConfig<
        typeof zora721DropABI,
        'updateRoyaltyMintSchedule',
        TMode
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'updateRoyaltyMintSchedule'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zora721DropABI, 'updateRoyaltyMintSchedule', TMode>({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'updateRoyaltyMintSchedule',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"upgradeTo"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropUpgradeTo<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zora721DropAddress
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof zora721DropABI, 'upgradeTo'>['request']['abi'],
        'upgradeTo',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'upgradeTo' }
    : UseContractWriteConfig<typeof zora721DropABI, 'upgradeTo', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'upgradeTo'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zora721DropABI, 'upgradeTo', TMode>({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'upgradeTo',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"upgradeToAndCall"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropUpgradeToAndCall<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zora721DropAddress
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof zora721DropABI,
          'upgradeToAndCall'
        >['request']['abi'],
        'upgradeToAndCall',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'upgradeToAndCall' }
    : UseContractWriteConfig<typeof zora721DropABI, 'upgradeToAndCall', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'upgradeToAndCall'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zora721DropABI, 'upgradeToAndCall', TMode>({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'upgradeToAndCall',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"withdraw"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropWithdraw<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zora721DropAddress
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof zora721DropABI, 'withdraw'>['request']['abi'],
        'withdraw',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'withdraw' }
    : UseContractWriteConfig<typeof zora721DropABI, 'withdraw', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'withdraw'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zora721DropABI, 'withdraw', TMode>({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'withdraw',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"withdrawRewards"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropWithdrawRewards<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zora721DropAddress
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof zora721DropABI,
          'withdrawRewards'
        >['request']['abi'],
        'withdrawRewards',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'withdrawRewards' }
    : UseContractWriteConfig<typeof zora721DropABI, 'withdrawRewards', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'withdrawRewards'
      } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractWrite<typeof zora721DropABI, 'withdrawRewards', TMode>({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'withdrawRewards',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora721DropABI}__.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function usePrepareZora721DropWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora721DropABI, TFunctionName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora721DropABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"adminMint"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function usePrepareZora721DropAdminMint(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora721DropABI, 'adminMint'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'adminMint',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora721DropABI, 'adminMint'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"adminMintAirdrop"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function usePrepareZora721DropAdminMintAirdrop(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora721DropABI, 'adminMintAirdrop'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'adminMintAirdrop',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora721DropABI, 'adminMintAirdrop'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"approve"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function usePrepareZora721DropApprove(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora721DropABI, 'approve'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'approve',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora721DropABI, 'approve'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"burn"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function usePrepareZora721DropBurn(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora721DropABI, 'burn'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'burn',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora721DropABI, 'burn'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"callMetadataRenderer"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function usePrepareZora721DropCallMetadataRenderer(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora721DropABI, 'callMetadataRenderer'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'callMetadataRenderer',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora721DropABI, 'callMetadataRenderer'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"finalizeOpenEdition"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function usePrepareZora721DropFinalizeOpenEdition(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora721DropABI, 'finalizeOpenEdition'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'finalizeOpenEdition',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora721DropABI, 'finalizeOpenEdition'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"grantRole"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function usePrepareZora721DropGrantRole(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora721DropABI, 'grantRole'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'grantRole',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora721DropABI, 'grantRole'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"initialize"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function usePrepareZora721DropInitialize(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora721DropABI, 'initialize'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'initialize',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora721DropABI, 'initialize'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"manageMarketFilterDAOSubscription"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function usePrepareZora721DropManageMarketFilterDaoSubscription(
  config: Omit<
    UsePrepareContractWriteConfig<
      typeof zora721DropABI,
      'manageMarketFilterDAOSubscription'
    >,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'manageMarketFilterDAOSubscription',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof zora721DropABI,
    'manageMarketFilterDAOSubscription'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"mintWithRewards"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function usePrepareZora721DropMintWithRewards(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora721DropABI, 'mintWithRewards'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'mintWithRewards',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora721DropABI, 'mintWithRewards'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"multicall"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function usePrepareZora721DropMulticall(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora721DropABI, 'multicall'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'multicall',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora721DropABI, 'multicall'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"purchase"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function usePrepareZora721DropPurchase(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora721DropABI, 'purchase'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'purchase',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora721DropABI, 'purchase'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"purchasePresale"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function usePrepareZora721DropPurchasePresale(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora721DropABI, 'purchasePresale'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'purchasePresale',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora721DropABI, 'purchasePresale'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"purchasePresaleWithComment"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function usePrepareZora721DropPurchasePresaleWithComment(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora721DropABI, 'purchasePresaleWithComment'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'purchasePresaleWithComment',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora721DropABI, 'purchasePresaleWithComment'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"purchasePresaleWithRewards"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function usePrepareZora721DropPurchasePresaleWithRewards(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora721DropABI, 'purchasePresaleWithRewards'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'purchasePresaleWithRewards',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora721DropABI, 'purchasePresaleWithRewards'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"purchaseWithComment"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function usePrepareZora721DropPurchaseWithComment(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora721DropABI, 'purchaseWithComment'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'purchaseWithComment',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora721DropABI, 'purchaseWithComment'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"purchaseWithRecipient"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function usePrepareZora721DropPurchaseWithRecipient(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora721DropABI, 'purchaseWithRecipient'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'purchaseWithRecipient',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora721DropABI, 'purchaseWithRecipient'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"renounceRole"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function usePrepareZora721DropRenounceRole(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora721DropABI, 'renounceRole'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'renounceRole',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora721DropABI, 'renounceRole'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"revokeRole"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function usePrepareZora721DropRevokeRole(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora721DropABI, 'revokeRole'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'revokeRole',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora721DropABI, 'revokeRole'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"safeTransferFrom"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function usePrepareZora721DropSafeTransferFrom(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora721DropABI, 'safeTransferFrom'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'safeTransferFrom',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora721DropABI, 'safeTransferFrom'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"setApprovalForAll"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function usePrepareZora721DropSetApprovalForAll(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora721DropABI, 'setApprovalForAll'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'setApprovalForAll',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora721DropABI, 'setApprovalForAll'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"setFundsRecipient"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function usePrepareZora721DropSetFundsRecipient(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora721DropABI, 'setFundsRecipient'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'setFundsRecipient',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora721DropABI, 'setFundsRecipient'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"setMetadataRenderer"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function usePrepareZora721DropSetMetadataRenderer(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora721DropABI, 'setMetadataRenderer'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'setMetadataRenderer',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora721DropABI, 'setMetadataRenderer'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"setOwner"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function usePrepareZora721DropSetOwner(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora721DropABI, 'setOwner'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'setOwner',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora721DropABI, 'setOwner'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"setSaleConfiguration"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function usePrepareZora721DropSetSaleConfiguration(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora721DropABI, 'setSaleConfiguration'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'setSaleConfiguration',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora721DropABI, 'setSaleConfiguration'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"transferFrom"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function usePrepareZora721DropTransferFrom(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora721DropABI, 'transferFrom'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'transferFrom',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora721DropABI, 'transferFrom'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"updateCreateReferral"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function usePrepareZora721DropUpdateCreateReferral(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora721DropABI, 'updateCreateReferral'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'updateCreateReferral',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora721DropABI, 'updateCreateReferral'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"updateMarketFilterSettings"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function usePrepareZora721DropUpdateMarketFilterSettings(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora721DropABI, 'updateMarketFilterSettings'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'updateMarketFilterSettings',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora721DropABI, 'updateMarketFilterSettings'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"updateRoyaltyMintSchedule"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function usePrepareZora721DropUpdateRoyaltyMintSchedule(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora721DropABI, 'updateRoyaltyMintSchedule'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'updateRoyaltyMintSchedule',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora721DropABI, 'updateRoyaltyMintSchedule'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"upgradeTo"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function usePrepareZora721DropUpgradeTo(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora721DropABI, 'upgradeTo'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'upgradeTo',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora721DropABI, 'upgradeTo'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"upgradeToAndCall"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function usePrepareZora721DropUpgradeToAndCall(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora721DropABI, 'upgradeToAndCall'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'upgradeToAndCall',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora721DropABI, 'upgradeToAndCall'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"withdraw"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function usePrepareZora721DropWithdraw(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora721DropABI, 'withdraw'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'withdraw',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora721DropABI, 'withdraw'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"withdrawRewards"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function usePrepareZora721DropWithdrawRewards(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora721DropABI, 'withdrawRewards'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return usePrepareContractWrite({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    functionName: 'withdrawRewards',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora721DropABI, 'withdrawRewards'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora721DropABI}__.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof zora721DropABI, TEventName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    ...config,
  } as UseContractEventConfig<typeof zora721DropABI, TEventName>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora721DropABI}__ and `eventName` set to `"AdminChanged"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropAdminChangedEvent(
  config: Omit<
    UseContractEventConfig<typeof zora721DropABI, 'AdminChanged'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    eventName: 'AdminChanged',
    ...config,
  } as UseContractEventConfig<typeof zora721DropABI, 'AdminChanged'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora721DropABI}__ and `eventName` set to `"Approval"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropApprovalEvent(
  config: Omit<
    UseContractEventConfig<typeof zora721DropABI, 'Approval'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    eventName: 'Approval',
    ...config,
  } as UseContractEventConfig<typeof zora721DropABI, 'Approval'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora721DropABI}__ and `eventName` set to `"ApprovalForAll"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropApprovalForAllEvent(
  config: Omit<
    UseContractEventConfig<typeof zora721DropABI, 'ApprovalForAll'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    eventName: 'ApprovalForAll',
    ...config,
  } as UseContractEventConfig<typeof zora721DropABI, 'ApprovalForAll'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora721DropABI}__ and `eventName` set to `"BatchMetadataUpdate"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropBatchMetadataUpdateEvent(
  config: Omit<
    UseContractEventConfig<typeof zora721DropABI, 'BatchMetadataUpdate'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    eventName: 'BatchMetadataUpdate',
    ...config,
  } as UseContractEventConfig<typeof zora721DropABI, 'BatchMetadataUpdate'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora721DropABI}__ and `eventName` set to `"BeaconUpgraded"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropBeaconUpgradedEvent(
  config: Omit<
    UseContractEventConfig<typeof zora721DropABI, 'BeaconUpgraded'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    eventName: 'BeaconUpgraded',
    ...config,
  } as UseContractEventConfig<typeof zora721DropABI, 'BeaconUpgraded'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora721DropABI}__ and `eventName` set to `"FundsReceived"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropFundsReceivedEvent(
  config: Omit<
    UseContractEventConfig<typeof zora721DropABI, 'FundsReceived'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    eventName: 'FundsReceived',
    ...config,
  } as UseContractEventConfig<typeof zora721DropABI, 'FundsReceived'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora721DropABI}__ and `eventName` set to `"FundsRecipientChanged"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropFundsRecipientChangedEvent(
  config: Omit<
    UseContractEventConfig<typeof zora721DropABI, 'FundsRecipientChanged'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    eventName: 'FundsRecipientChanged',
    ...config,
  } as UseContractEventConfig<typeof zora721DropABI, 'FundsRecipientChanged'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora721DropABI}__ and `eventName` set to `"FundsWithdrawn"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropFundsWithdrawnEvent(
  config: Omit<
    UseContractEventConfig<typeof zora721DropABI, 'FundsWithdrawn'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    eventName: 'FundsWithdrawn',
    ...config,
  } as UseContractEventConfig<typeof zora721DropABI, 'FundsWithdrawn'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora721DropABI}__ and `eventName` set to `"MetadataUpdate"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropMetadataUpdateEvent(
  config: Omit<
    UseContractEventConfig<typeof zora721DropABI, 'MetadataUpdate'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    eventName: 'MetadataUpdate',
    ...config,
  } as UseContractEventConfig<typeof zora721DropABI, 'MetadataUpdate'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora721DropABI}__ and `eventName` set to `"MintComment"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropMintCommentEvent(
  config: Omit<
    UseContractEventConfig<typeof zora721DropABI, 'MintComment'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    eventName: 'MintComment',
    ...config,
  } as UseContractEventConfig<typeof zora721DropABI, 'MintComment'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora721DropABI}__ and `eventName` set to `"MintFeePayout"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropMintFeePayoutEvent(
  config: Omit<
    UseContractEventConfig<typeof zora721DropABI, 'MintFeePayout'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    eventName: 'MintFeePayout',
    ...config,
  } as UseContractEventConfig<typeof zora721DropABI, 'MintFeePayout'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora721DropABI}__ and `eventName` set to `"OpenMintFinalized"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropOpenMintFinalizedEvent(
  config: Omit<
    UseContractEventConfig<typeof zora721DropABI, 'OpenMintFinalized'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    eventName: 'OpenMintFinalized',
    ...config,
  } as UseContractEventConfig<typeof zora721DropABI, 'OpenMintFinalized'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora721DropABI}__ and `eventName` set to `"OwnerCanceled"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropOwnerCanceledEvent(
  config: Omit<
    UseContractEventConfig<typeof zora721DropABI, 'OwnerCanceled'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    eventName: 'OwnerCanceled',
    ...config,
  } as UseContractEventConfig<typeof zora721DropABI, 'OwnerCanceled'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora721DropABI}__ and `eventName` set to `"OwnerPending"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropOwnerPendingEvent(
  config: Omit<
    UseContractEventConfig<typeof zora721DropABI, 'OwnerPending'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    eventName: 'OwnerPending',
    ...config,
  } as UseContractEventConfig<typeof zora721DropABI, 'OwnerPending'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora721DropABI}__ and `eventName` set to `"OwnershipTransferred"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropOwnershipTransferredEvent(
  config: Omit<
    UseContractEventConfig<typeof zora721DropABI, 'OwnershipTransferred'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    eventName: 'OwnershipTransferred',
    ...config,
  } as UseContractEventConfig<typeof zora721DropABI, 'OwnershipTransferred'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora721DropABI}__ and `eventName` set to `"RoleAdminChanged"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropRoleAdminChangedEvent(
  config: Omit<
    UseContractEventConfig<typeof zora721DropABI, 'RoleAdminChanged'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    eventName: 'RoleAdminChanged',
    ...config,
  } as UseContractEventConfig<typeof zora721DropABI, 'RoleAdminChanged'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora721DropABI}__ and `eventName` set to `"RoleGranted"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropRoleGrantedEvent(
  config: Omit<
    UseContractEventConfig<typeof zora721DropABI, 'RoleGranted'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    eventName: 'RoleGranted',
    ...config,
  } as UseContractEventConfig<typeof zora721DropABI, 'RoleGranted'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora721DropABI}__ and `eventName` set to `"RoleRevoked"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropRoleRevokedEvent(
  config: Omit<
    UseContractEventConfig<typeof zora721DropABI, 'RoleRevoked'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    eventName: 'RoleRevoked',
    ...config,
  } as UseContractEventConfig<typeof zora721DropABI, 'RoleRevoked'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora721DropABI}__ and `eventName` set to `"Sale"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropSaleEvent(
  config: Omit<
    UseContractEventConfig<typeof zora721DropABI, 'Sale'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    eventName: 'Sale',
    ...config,
  } as UseContractEventConfig<typeof zora721DropABI, 'Sale'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora721DropABI}__ and `eventName` set to `"SalesConfigChanged"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropSalesConfigChangedEvent(
  config: Omit<
    UseContractEventConfig<typeof zora721DropABI, 'SalesConfigChanged'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    eventName: 'SalesConfigChanged',
    ...config,
  } as UseContractEventConfig<typeof zora721DropABI, 'SalesConfigChanged'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora721DropABI}__ and `eventName` set to `"Transfer"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropTransferEvent(
  config: Omit<
    UseContractEventConfig<typeof zora721DropABI, 'Transfer'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    eventName: 'Transfer',
    ...config,
  } as UseContractEventConfig<typeof zora721DropABI, 'Transfer'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora721DropABI}__ and `eventName` set to `"UpdatedMetadataRenderer"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropUpdatedMetadataRendererEvent(
  config: Omit<
    UseContractEventConfig<typeof zora721DropABI, 'UpdatedMetadataRenderer'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    eventName: 'UpdatedMetadataRenderer',
    ...config,
  } as UseContractEventConfig<typeof zora721DropABI, 'UpdatedMetadataRenderer'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora721DropABI}__ and `eventName` set to `"Upgraded"`.
 *
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xe4c17055048aEe01D0d122804816fEe5E6ac4A67)
 */
export function useZora721DropUpgradedEvent(
  config: Omit<
    UseContractEventConfig<typeof zora721DropABI, 'Upgraded'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  const { chain } = useNetwork()
  const defaultChainId = useChainId()
  const chainId = config.chainId ?? chain?.id ?? defaultChainId
  return useContractEvent({
    abi: zora721DropABI,
    address: zora721DropAddress[chainId as keyof typeof zora721DropAddress],
    eventName: 'Upgraded',
    ...config,
  } as UseContractEventConfig<typeof zora721DropABI, 'Upgraded'>)
}
