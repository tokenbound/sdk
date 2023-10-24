//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ERC6551AccountProxy_V3_
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xABF81898FEA21aAa5EE27F6fA0398a217a29bE9f)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xABF81898FEA21aAa5EE27F6fA0398a217a29bE9f)
 */
export const erc6551AccountProxyV3ABI = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [
      { name: '_guardian', internalType: 'address', type: 'address' },
      { name: '_initialImplementation', internalType: 'address', type: 'address' },
    ],
  },
  { type: 'error', inputs: [], name: 'AlreadyInitialized' },
  { type: 'error', inputs: [], name: 'InvalidImplementation' },
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
    inputs: [{ name: 'implementation', internalType: 'address', type: 'address' }],
    name: 'initialize',
    outputs: [],
  },
  { stateMutability: 'payable', type: 'receive' },
] as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xABF81898FEA21aAa5EE27F6fA0398a217a29bE9f)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xABF81898FEA21aAa5EE27F6fA0398a217a29bE9f)
 */
export const erc6551AccountProxyV3Address = {
  1: '0xABF81898FEA21aAa5EE27F6fA0398a217a29bE9f',
  5: '0xABF81898FEA21aAa5EE27F6fA0398a217a29bE9f',
} as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xABF81898FEA21aAa5EE27F6fA0398a217a29bE9f)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xABF81898FEA21aAa5EE27F6fA0398a217a29bE9f)
 */
export const erc6551AccountProxyV3Config = {
  address: erc6551AccountProxyV3Address,
  abi: erc6551AccountProxyV3ABI,
} as const

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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBf7F4beb68b960AE198a15f4f50247f4Fd20E21a)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xBf7F4beb68b960AE198a15f4f50247f4Fd20E21a)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBf7F4beb68b960AE198a15f4f50247f4Fd20E21a)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xBf7F4beb68b960AE198a15f4f50247f4Fd20E21a)
 */
export const erc6551AccountV3Address = {
  1: '0xBf7F4beb68b960AE198a15f4f50247f4Fd20E21a',
  5: '0xBf7F4beb68b960AE198a15f4f50247f4Fd20E21a',
} as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xBf7F4beb68b960AE198a15f4f50247f4Fd20E21a)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0xBf7F4beb68b960AE198a15f4f50247f4Fd20E21a)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x284be69BaC8C983a749956D7320729EB24bc75f9)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x284be69BaC8C983a749956D7320729EB24bc75f9)
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
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x284be69BaC8C983a749956D7320729EB24bc75f9)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x284be69BaC8C983a749956D7320729EB24bc75f9)
 */
export const erc6551RegistryV3Address = {
  1: '0x284be69BaC8C983a749956D7320729EB24bc75f9',
  5: '0x284be69BaC8C983a749956D7320729EB24bc75f9',
} as const

/**
 * - [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x284be69BaC8C983a749956D7320729EB24bc75f9)
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x284be69BaC8C983a749956D7320729EB24bc75f9)
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
