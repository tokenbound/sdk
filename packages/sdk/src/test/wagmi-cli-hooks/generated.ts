import {
  useContractRead,
  UseContractReadConfig,
  useContractWrite,
  Address,
  UseContractWriteConfig,
  usePrepareContractWrite,
  UsePrepareContractWriteConfig,
  useContractEvent,
  UseContractEventConfig,
} from 'wagmi'
import {
  ReadContractResult,
  WriteContractMode,
  PrepareWriteContractResult,
} from 'wagmi/actions'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Zora1155_
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
 */
export const zora1155ABI = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [
      { name: '_mintFeeAmount', internalType: 'uint256', type: 'uint256' },
      { name: '_mintFeeRecipient', internalType: 'address', type: 'address' },
    ],
  },
  {
    type: 'error',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'user', internalType: 'address', type: 'address' },
    ],
    name: 'Burn_NotOwnerOrApproved',
  },
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
    inputs: [
      { name: 'mintFeeRecipient', internalType: 'address', type: 'address' },
      { name: 'mintFee', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'CannotSendMintFee',
  },
  { type: 'error', inputs: [], name: 'CannotSetMintFeeToZeroAddress' },
  {
    type: 'error',
    inputs: [{ name: 'proposedAddress', internalType: 'address', type: 'address' }],
    name: 'Config_TransferHookNotSupported',
  },
  {
    type: 'error',
    inputs: [
      { name: 'recipient', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ETHWithdrawFailed',
  },
  {
    type: 'error',
    inputs: [
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'contractValue', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'FundsWithdrawInsolvent',
  },
  { type: 'error', inputs: [], name: 'InvalidMintSchedule' },
  {
    type: 'error',
    inputs: [{ name: 'mintFeeBPS', internalType: 'uint256', type: 'uint256' }],
    name: 'MintFeeCannotBeMoreThanZeroPointOneETH',
  },
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
  { type: 'error', inputs: [], name: 'NotAllowedContractBaseIDUpdate' },
  {
    type: 'error',
    inputs: [{ name: 'renderer', internalType: 'address', type: 'address' }],
    name: 'RendererNotValid',
  },
  {
    type: 'error',
    inputs: [{ name: 'reason', internalType: 'bytes', type: 'bytes' }],
    name: 'Renderer_CallFailed',
  },
  { type: 'error', inputs: [], name: 'Renderer_NotValidRendererContract' },
  { type: 'error', inputs: [], name: 'Sale_CallFailed' },
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
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
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
    name: 'customRenderers',
    outputs: [{ name: '', internalType: 'contract IRenderer1155', type: 'address' }],
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
    inputs: [
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'user', internalType: 'address', type: 'address' },
    ],
    name: 'getPermissions',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
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
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
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
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'mintFee',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'mintFeeRecipient',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
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
      { name: 'setupData', internalType: 'bytes', type: 'bytes' },
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
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'totalSupply', internalType: 'uint256', type: 'uint256' },
      { name: 'mintAmount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'supplyRoyaltyInfo',
    outputs: [
      { name: 'receiver', internalType: 'address', type: 'address' },
      { name: 'royaltyAmount', internalType: 'uint256', type: 'uint256' },
    ],
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
] as const

/**
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
 */
export const zora1155Address = {
  1: '0xD0561AEF1D5cd30a1779f01B41B3436027177d9A',
} as const

/**
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
 */
export const zora1155Config = { address: zora1155Address, abi: zora1155ABI } as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Zora721Drop_
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 */
export const zora721DropABI = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [
      {
        name: '_zoraFeeManager',
        internalType: 'contract IZoraFeeManager',
        type: 'address',
      },
      { name: '_zoraERC721TransferHelper', internalType: 'address', type: 'address' },
      {
        name: '_factoryUpgradeGate',
        internalType: 'contract IFactoryUpgradeGate',
        type: 'address',
      },
      { name: '_marketFilterDAOAddress', internalType: 'address', type: 'address' },
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
  { type: 'error', inputs: [], name: 'MarketFilterDAOAddressNotSupportedForChain' },
  { type: 'error', inputs: [], name: 'MintToZeroAddress' },
  { type: 'error', inputs: [], name: 'MintZeroQuantity' },
  { type: 'error', inputs: [], name: 'Mint_SoldOut' },
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
      {
        name: '_salesConfig',
        internalType: 'struct IERC721Drop.SalesConfiguration',
        type: 'tuple',
        components: [
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
        name: '_metadataRenderer',
        internalType: 'contract IMetadataRenderer',
        type: 'address',
      },
      { name: '_metadataRendererInit', internalType: 'bytes', type: 'bytes' },
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
    name: 'metadataRenderer',
    outputs: [{ name: '', internalType: 'contract IMetadataRenderer', type: 'address' }],
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
    inputs: [{ name: 'args', internalType: 'bytes', type: 'bytes' }],
    name: 'updateMarketFilterSettings',
    outputs: [{ name: '', internalType: 'bytes', type: 'bytes' }],
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
    inputs: [{ name: 'amount', internalType: 'uint256', type: 'uint256' }],
    name: 'zoraFeeForAmount',
    outputs: [
      { name: '', internalType: 'address payable', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'zoraFeeManager',
    outputs: [{ name: '', internalType: 'contract IZoraFeeManager', type: 'address' }],
  },
  { stateMutability: 'payable', type: 'receive' },
] as const

/**
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 */
export const zora721DropAddress = {
  1: '0x7C74dfe39976dc395529c14e54a597809980e01C',
} as const

/**
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 */
export const zora721DropConfig = {
  address: zora721DropAddress,
  abi: zora721DropABI,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
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
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[1],
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"CONTRACT_BASE_ID"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
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
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'CONTRACT_BASE_ID',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"PERMISSION_BIT_ADMIN"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
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
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'PERMISSION_BIT_ADMIN',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"PERMISSION_BIT_FUNDS_MANAGER"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
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
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'PERMISSION_BIT_FUNDS_MANAGER',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"PERMISSION_BIT_METADATA"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
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
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'PERMISSION_BIT_METADATA',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"PERMISSION_BIT_MINTER"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
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
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'PERMISSION_BIT_MINTER',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"PERMISSION_BIT_SALES"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
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
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'PERMISSION_BIT_SALES',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"assumeLastTokenIdMatches"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
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
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'assumeLastTokenIdMatches',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"balanceOf"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
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
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'balanceOf',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"balanceOfBatch"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
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
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'balanceOfBatch',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"contractURI"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
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
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'contractURI',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"contractVersion"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
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
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'contractVersion',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"customRenderers"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
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
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'customRenderers',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"getCustomRenderer"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
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
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'getCustomRenderer',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"getPermissions"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
 */
export function useZora1155GetPermissions<
  TFunctionName extends 'getPermissions',
  TSelectData = ReadContractResult<typeof zora1155ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'getPermissions',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"getRoyalties"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
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
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'getRoyalties',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"getTokenInfo"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
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
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'getTokenInfo',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"isAdminOrRole"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
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
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'isAdminOrRole',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"isApprovedForAll"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
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
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'isApprovedForAll',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"metadataRendererContract"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
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
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'metadataRendererContract',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"mintFee"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
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
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'mintFee',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"mintFeeRecipient"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
 */
export function useZora1155MintFeeRecipient<
  TFunctionName extends 'mintFeeRecipient',
  TSelectData = ReadContractResult<typeof zora1155ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'mintFeeRecipient',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"name"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
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
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'name',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"nextTokenId"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
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
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'nextTokenId',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"owner"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
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
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'owner',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"permissions"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
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
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'permissions',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"proxiableUUID"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
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
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'proxiableUUID',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"royalties"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
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
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'royalties',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"royaltyInfo"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
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
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'royaltyInfo',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"supplyRoyaltyInfo"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
 */
export function useZora1155SupplyRoyaltyInfo<
  TFunctionName extends 'supplyRoyaltyInfo',
  TSelectData = ReadContractResult<typeof zora1155ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'supplyRoyaltyInfo',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"supportsInterface"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
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
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'supportsInterface',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"symbol"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
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
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'symbol',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"uri"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
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
  return useContractRead({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'uri',
    ...config,
  } as UseContractReadConfig<typeof zora1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora1155ABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
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
  return useContractWrite<typeof zora1155ABI, TFunctionName, TMode>({
    abi: zora1155ABI,
    address: zora1155Address[1],
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"addPermission"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
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
  return useContractWrite<typeof zora1155ABI, 'addPermission', TMode>({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'addPermission',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"adminMint"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
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
  return useContractWrite<typeof zora1155ABI, 'adminMint', TMode>({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'adminMint',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"adminMintBatch"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
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
  return useContractWrite<typeof zora1155ABI, 'adminMintBatch', TMode>({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'adminMintBatch',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"burnBatch"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
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
  return useContractWrite<typeof zora1155ABI, 'burnBatch', TMode>({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'burnBatch',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"callRenderer"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
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
  return useContractWrite<typeof zora1155ABI, 'callRenderer', TMode>({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'callRenderer',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"callSale"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
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
  return useContractWrite<typeof zora1155ABI, 'callSale', TMode>({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'callSale',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"initialize"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
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
  return useContractWrite<typeof zora1155ABI, 'initialize', TMode>({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'initialize',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"mint"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
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
  return useContractWrite<typeof zora1155ABI, 'mint', TMode>({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'mint',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"multicall"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
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
  return useContractWrite<typeof zora1155ABI, 'multicall', TMode>({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'multicall',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"removePermission"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
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
  return useContractWrite<typeof zora1155ABI, 'removePermission', TMode>({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'removePermission',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"safeBatchTransferFrom"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
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
  return useContractWrite<typeof zora1155ABI, 'safeBatchTransferFrom', TMode>({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'safeBatchTransferFrom',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"safeTransferFrom"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
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
  return useContractWrite<typeof zora1155ABI, 'safeTransferFrom', TMode>({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'safeTransferFrom',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"setApprovalForAll"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
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
  return useContractWrite<typeof zora1155ABI, 'setApprovalForAll', TMode>({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'setApprovalForAll',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"setFundsRecipient"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
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
  return useContractWrite<typeof zora1155ABI, 'setFundsRecipient', TMode>({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'setFundsRecipient',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"setOwner"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
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
  return useContractWrite<typeof zora1155ABI, 'setOwner', TMode>({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'setOwner',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"setTokenMetadataRenderer"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
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
  return useContractWrite<typeof zora1155ABI, 'setTokenMetadataRenderer', TMode>({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'setTokenMetadataRenderer',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"setTransferHook"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
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
  return useContractWrite<typeof zora1155ABI, 'setTransferHook', TMode>({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'setTransferHook',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"setupNewToken"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
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
  return useContractWrite<typeof zora1155ABI, 'setupNewToken', TMode>({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'setupNewToken',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"updateContractMetadata"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
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
  return useContractWrite<typeof zora1155ABI, 'updateContractMetadata', TMode>({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'updateContractMetadata',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"updateRoyaltiesForToken"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
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
  return useContractWrite<typeof zora1155ABI, 'updateRoyaltiesForToken', TMode>({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'updateRoyaltiesForToken',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"updateTokenURI"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
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
  return useContractWrite<typeof zora1155ABI, 'updateTokenURI', TMode>({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'updateTokenURI',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"upgradeTo"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
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
  return useContractWrite<typeof zora1155ABI, 'upgradeTo', TMode>({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'upgradeTo',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"upgradeToAndCall"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
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
  return useContractWrite<typeof zora1155ABI, 'upgradeToAndCall', TMode>({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'upgradeToAndCall',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"withdraw"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
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
  return useContractWrite<typeof zora1155ABI, 'withdraw', TMode>({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'withdraw',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora1155ABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
 */
export function usePrepareZora1155Write<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora1155ABI, TFunctionName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  return usePrepareContractWrite({
    abi: zora1155ABI,
    address: zora1155Address[1],
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora1155ABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"addPermission"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
 */
export function usePrepareZora1155AddPermission(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora1155ABI, 'addPermission'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  return usePrepareContractWrite({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'addPermission',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora1155ABI, 'addPermission'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"adminMint"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
 */
export function usePrepareZora1155AdminMint(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora1155ABI, 'adminMint'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  return usePrepareContractWrite({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'adminMint',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora1155ABI, 'adminMint'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"adminMintBatch"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
 */
export function usePrepareZora1155AdminMintBatch(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora1155ABI, 'adminMintBatch'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  return usePrepareContractWrite({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'adminMintBatch',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora1155ABI, 'adminMintBatch'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"burnBatch"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
 */
export function usePrepareZora1155BurnBatch(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora1155ABI, 'burnBatch'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  return usePrepareContractWrite({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'burnBatch',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora1155ABI, 'burnBatch'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"callRenderer"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
 */
export function usePrepareZora1155CallRenderer(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora1155ABI, 'callRenderer'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  return usePrepareContractWrite({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'callRenderer',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora1155ABI, 'callRenderer'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"callSale"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
 */
export function usePrepareZora1155CallSale(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora1155ABI, 'callSale'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  return usePrepareContractWrite({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'callSale',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora1155ABI, 'callSale'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"initialize"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
 */
export function usePrepareZora1155Initialize(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora1155ABI, 'initialize'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  return usePrepareContractWrite({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'initialize',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora1155ABI, 'initialize'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"mint"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
 */
export function usePrepareZora1155Mint(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora1155ABI, 'mint'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  return usePrepareContractWrite({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'mint',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora1155ABI, 'mint'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"multicall"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
 */
export function usePrepareZora1155Multicall(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora1155ABI, 'multicall'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  return usePrepareContractWrite({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'multicall',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora1155ABI, 'multicall'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"removePermission"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
 */
export function usePrepareZora1155RemovePermission(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora1155ABI, 'removePermission'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  return usePrepareContractWrite({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'removePermission',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora1155ABI, 'removePermission'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"safeBatchTransferFrom"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
 */
export function usePrepareZora1155SafeBatchTransferFrom(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora1155ABI, 'safeBatchTransferFrom'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  return usePrepareContractWrite({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'safeBatchTransferFrom',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora1155ABI, 'safeBatchTransferFrom'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"safeTransferFrom"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
 */
export function usePrepareZora1155SafeTransferFrom(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora1155ABI, 'safeTransferFrom'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  return usePrepareContractWrite({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'safeTransferFrom',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora1155ABI, 'safeTransferFrom'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"setApprovalForAll"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
 */
export function usePrepareZora1155SetApprovalForAll(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora1155ABI, 'setApprovalForAll'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  return usePrepareContractWrite({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'setApprovalForAll',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora1155ABI, 'setApprovalForAll'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"setFundsRecipient"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
 */
export function usePrepareZora1155SetFundsRecipient(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora1155ABI, 'setFundsRecipient'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  return usePrepareContractWrite({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'setFundsRecipient',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora1155ABI, 'setFundsRecipient'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"setOwner"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
 */
export function usePrepareZora1155SetOwner(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora1155ABI, 'setOwner'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  return usePrepareContractWrite({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'setOwner',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora1155ABI, 'setOwner'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"setTokenMetadataRenderer"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
 */
export function usePrepareZora1155SetTokenMetadataRenderer(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora1155ABI, 'setTokenMetadataRenderer'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  return usePrepareContractWrite({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'setTokenMetadataRenderer',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora1155ABI, 'setTokenMetadataRenderer'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"setTransferHook"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
 */
export function usePrepareZora1155SetTransferHook(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora1155ABI, 'setTransferHook'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  return usePrepareContractWrite({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'setTransferHook',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora1155ABI, 'setTransferHook'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"setupNewToken"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
 */
export function usePrepareZora1155SetupNewToken(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora1155ABI, 'setupNewToken'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  return usePrepareContractWrite({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'setupNewToken',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora1155ABI, 'setupNewToken'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"updateContractMetadata"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
 */
export function usePrepareZora1155UpdateContractMetadata(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora1155ABI, 'updateContractMetadata'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  return usePrepareContractWrite({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'updateContractMetadata',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora1155ABI, 'updateContractMetadata'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"updateRoyaltiesForToken"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
 */
export function usePrepareZora1155UpdateRoyaltiesForToken(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora1155ABI, 'updateRoyaltiesForToken'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  return usePrepareContractWrite({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'updateRoyaltiesForToken',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora1155ABI, 'updateRoyaltiesForToken'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"updateTokenURI"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
 */
export function usePrepareZora1155UpdateTokenUri(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora1155ABI, 'updateTokenURI'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  return usePrepareContractWrite({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'updateTokenURI',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora1155ABI, 'updateTokenURI'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"upgradeTo"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
 */
export function usePrepareZora1155UpgradeTo(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora1155ABI, 'upgradeTo'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  return usePrepareContractWrite({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'upgradeTo',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora1155ABI, 'upgradeTo'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"upgradeToAndCall"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
 */
export function usePrepareZora1155UpgradeToAndCall(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora1155ABI, 'upgradeToAndCall'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  return usePrepareContractWrite({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'upgradeToAndCall',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora1155ABI, 'upgradeToAndCall'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora1155ABI}__ and `functionName` set to `"withdraw"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
 */
export function usePrepareZora1155Withdraw(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora1155ABI, 'withdraw'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  return usePrepareContractWrite({
    abi: zora1155ABI,
    address: zora1155Address[1],
    functionName: 'withdraw',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora1155ABI, 'withdraw'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora1155ABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
 */
export function useZora1155Event<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof zora1155ABI, TEventName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  return useContractEvent({
    abi: zora1155ABI,
    address: zora1155Address[1],
    ...config,
  } as UseContractEventConfig<typeof zora1155ABI, TEventName>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora1155ABI}__ and `eventName` set to `"AdminChanged"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
 */
export function useZora1155AdminChangedEvent(
  config: Omit<
    UseContractEventConfig<typeof zora1155ABI, 'AdminChanged'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  return useContractEvent({
    abi: zora1155ABI,
    address: zora1155Address[1],
    eventName: 'AdminChanged',
    ...config,
  } as UseContractEventConfig<typeof zora1155ABI, 'AdminChanged'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora1155ABI}__ and `eventName` set to `"ApprovalForAll"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
 */
export function useZora1155ApprovalForAllEvent(
  config: Omit<
    UseContractEventConfig<typeof zora1155ABI, 'ApprovalForAll'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  return useContractEvent({
    abi: zora1155ABI,
    address: zora1155Address[1],
    eventName: 'ApprovalForAll',
    ...config,
  } as UseContractEventConfig<typeof zora1155ABI, 'ApprovalForAll'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora1155ABI}__ and `eventName` set to `"BeaconUpgraded"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
 */
export function useZora1155BeaconUpgradedEvent(
  config: Omit<
    UseContractEventConfig<typeof zora1155ABI, 'BeaconUpgraded'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  return useContractEvent({
    abi: zora1155ABI,
    address: zora1155Address[1],
    eventName: 'BeaconUpgraded',
    ...config,
  } as UseContractEventConfig<typeof zora1155ABI, 'BeaconUpgraded'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora1155ABI}__ and `eventName` set to `"ConfigUpdated"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
 */
export function useZora1155ConfigUpdatedEvent(
  config: Omit<
    UseContractEventConfig<typeof zora1155ABI, 'ConfigUpdated'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  return useContractEvent({
    abi: zora1155ABI,
    address: zora1155Address[1],
    eventName: 'ConfigUpdated',
    ...config,
  } as UseContractEventConfig<typeof zora1155ABI, 'ConfigUpdated'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora1155ABI}__ and `eventName` set to `"ContractMetadataUpdated"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
 */
export function useZora1155ContractMetadataUpdatedEvent(
  config: Omit<
    UseContractEventConfig<typeof zora1155ABI, 'ContractMetadataUpdated'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  return useContractEvent({
    abi: zora1155ABI,
    address: zora1155Address[1],
    eventName: 'ContractMetadataUpdated',
    ...config,
  } as UseContractEventConfig<typeof zora1155ABI, 'ContractMetadataUpdated'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora1155ABI}__ and `eventName` set to `"ContractRendererUpdated"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
 */
export function useZora1155ContractRendererUpdatedEvent(
  config: Omit<
    UseContractEventConfig<typeof zora1155ABI, 'ContractRendererUpdated'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  return useContractEvent({
    abi: zora1155ABI,
    address: zora1155Address[1],
    eventName: 'ContractRendererUpdated',
    ...config,
  } as UseContractEventConfig<typeof zora1155ABI, 'ContractRendererUpdated'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora1155ABI}__ and `eventName` set to `"Initialized"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
 */
export function useZora1155InitializedEvent(
  config: Omit<
    UseContractEventConfig<typeof zora1155ABI, 'Initialized'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  return useContractEvent({
    abi: zora1155ABI,
    address: zora1155Address[1],
    eventName: 'Initialized',
    ...config,
  } as UseContractEventConfig<typeof zora1155ABI, 'Initialized'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora1155ABI}__ and `eventName` set to `"OwnershipTransferred"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
 */
export function useZora1155OwnershipTransferredEvent(
  config: Omit<
    UseContractEventConfig<typeof zora1155ABI, 'OwnershipTransferred'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  return useContractEvent({
    abi: zora1155ABI,
    address: zora1155Address[1],
    eventName: 'OwnershipTransferred',
    ...config,
  } as UseContractEventConfig<typeof zora1155ABI, 'OwnershipTransferred'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora1155ABI}__ and `eventName` set to `"Purchased"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
 */
export function useZora1155PurchasedEvent(
  config: Omit<
    UseContractEventConfig<typeof zora1155ABI, 'Purchased'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  return useContractEvent({
    abi: zora1155ABI,
    address: zora1155Address[1],
    eventName: 'Purchased',
    ...config,
  } as UseContractEventConfig<typeof zora1155ABI, 'Purchased'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora1155ABI}__ and `eventName` set to `"RendererUpdated"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
 */
export function useZora1155RendererUpdatedEvent(
  config: Omit<
    UseContractEventConfig<typeof zora1155ABI, 'RendererUpdated'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  return useContractEvent({
    abi: zora1155ABI,
    address: zora1155Address[1],
    eventName: 'RendererUpdated',
    ...config,
  } as UseContractEventConfig<typeof zora1155ABI, 'RendererUpdated'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora1155ABI}__ and `eventName` set to `"SetupNewToken"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
 */
export function useZora1155SetupNewTokenEvent(
  config: Omit<
    UseContractEventConfig<typeof zora1155ABI, 'SetupNewToken'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  return useContractEvent({
    abi: zora1155ABI,
    address: zora1155Address[1],
    eventName: 'SetupNewToken',
    ...config,
  } as UseContractEventConfig<typeof zora1155ABI, 'SetupNewToken'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora1155ABI}__ and `eventName` set to `"TransferBatch"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
 */
export function useZora1155TransferBatchEvent(
  config: Omit<
    UseContractEventConfig<typeof zora1155ABI, 'TransferBatch'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  return useContractEvent({
    abi: zora1155ABI,
    address: zora1155Address[1],
    eventName: 'TransferBatch',
    ...config,
  } as UseContractEventConfig<typeof zora1155ABI, 'TransferBatch'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora1155ABI}__ and `eventName` set to `"TransferSingle"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
 */
export function useZora1155TransferSingleEvent(
  config: Omit<
    UseContractEventConfig<typeof zora1155ABI, 'TransferSingle'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  return useContractEvent({
    abi: zora1155ABI,
    address: zora1155Address[1],
    eventName: 'TransferSingle',
    ...config,
  } as UseContractEventConfig<typeof zora1155ABI, 'TransferSingle'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora1155ABI}__ and `eventName` set to `"URI"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
 */
export function useZora1155UriEvent(
  config: Omit<
    UseContractEventConfig<typeof zora1155ABI, 'URI'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  return useContractEvent({
    abi: zora1155ABI,
    address: zora1155Address[1],
    eventName: 'URI',
    ...config,
  } as UseContractEventConfig<typeof zora1155ABI, 'URI'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora1155ABI}__ and `eventName` set to `"UpdatedPermissions"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
 */
export function useZora1155UpdatedPermissionsEvent(
  config: Omit<
    UseContractEventConfig<typeof zora1155ABI, 'UpdatedPermissions'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  return useContractEvent({
    abi: zora1155ABI,
    address: zora1155Address[1],
    eventName: 'UpdatedPermissions',
    ...config,
  } as UseContractEventConfig<typeof zora1155ABI, 'UpdatedPermissions'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora1155ABI}__ and `eventName` set to `"UpdatedRoyalties"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
 */
export function useZora1155UpdatedRoyaltiesEvent(
  config: Omit<
    UseContractEventConfig<typeof zora1155ABI, 'UpdatedRoyalties'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  return useContractEvent({
    abi: zora1155ABI,
    address: zora1155Address[1],
    eventName: 'UpdatedRoyalties',
    ...config,
  } as UseContractEventConfig<typeof zora1155ABI, 'UpdatedRoyalties'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora1155ABI}__ and `eventName` set to `"UpdatedToken"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
 */
export function useZora1155UpdatedTokenEvent(
  config: Omit<
    UseContractEventConfig<typeof zora1155ABI, 'UpdatedToken'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  return useContractEvent({
    abi: zora1155ABI,
    address: zora1155Address[1],
    eventName: 'UpdatedToken',
    ...config,
  } as UseContractEventConfig<typeof zora1155ABI, 'UpdatedToken'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora1155ABI}__ and `eventName` set to `"Upgraded"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0xD0561AEF1D5cd30a1779f01B41B3436027177d9A)
 */
export function useZora1155UpgradedEvent(
  config: Omit<
    UseContractEventConfig<typeof zora1155ABI, 'Upgraded'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora1155Address } = {} as any
) {
  return useContractEvent({
    abi: zora1155ABI,
    address: zora1155Address[1],
    eventName: 'Upgraded',
    ...config,
  } as UseContractEventConfig<typeof zora1155ABI, 'Upgraded'>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora721DropABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
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
  return useContractRead({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    ...config,
  } as UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"DEFAULT_ADMIN_ROLE"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
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
  return useContractRead({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'DEFAULT_ADMIN_ROLE',
    ...config,
  } as UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"MINTER_ROLE"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
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
  return useContractRead({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'MINTER_ROLE',
    ...config,
  } as UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"SALES_MANAGER_ROLE"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
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
  return useContractRead({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'SALES_MANAGER_ROLE',
    ...config,
  } as UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"balanceOf"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
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
  return useContractRead({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'balanceOf',
    ...config,
  } as UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"config"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
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
  return useContractRead({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'config',
    ...config,
  } as UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"contractURI"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
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
  return useContractRead({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'contractURI',
    ...config,
  } as UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"contractVersion"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
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
  return useContractRead({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'contractVersion',
    ...config,
  } as UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"getApproved"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
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
  return useContractRead({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'getApproved',
    ...config,
  } as UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"getRoleAdmin"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
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
  return useContractRead({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'getRoleAdmin',
    ...config,
  } as UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"hasRole"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
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
  return useContractRead({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'hasRole',
    ...config,
  } as UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"isAdmin"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
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
  return useContractRead({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'isAdmin',
    ...config,
  } as UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"isApprovedForAll"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
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
  return useContractRead({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'isApprovedForAll',
    ...config,
  } as UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"metadataRenderer"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
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
  return useContractRead({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'metadataRenderer',
    ...config,
  } as UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"mintedPerAddress"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
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
  return useContractRead({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'mintedPerAddress',
    ...config,
  } as UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"name"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
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
  return useContractRead({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'name',
    ...config,
  } as UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"owner"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
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
  return useContractRead({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'owner',
    ...config,
  } as UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"ownerOf"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
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
  return useContractRead({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'ownerOf',
    ...config,
  } as UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"presaleMintsByAddress"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
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
  return useContractRead({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'presaleMintsByAddress',
    ...config,
  } as UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"proxiableUUID"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
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
  return useContractRead({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'proxiableUUID',
    ...config,
  } as UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"royaltyInfo"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
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
  return useContractRead({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'royaltyInfo',
    ...config,
  } as UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"saleDetails"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
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
  return useContractRead({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'saleDetails',
    ...config,
  } as UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"salesConfig"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
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
  return useContractRead({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'salesConfig',
    ...config,
  } as UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"supportsInterface"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
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
  return useContractRead({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'supportsInterface',
    ...config,
  } as UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"symbol"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
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
  return useContractRead({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'symbol',
    ...config,
  } as UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"tokenURI"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
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
  return useContractRead({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'tokenURI',
    ...config,
  } as UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"totalSupply"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
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
  return useContractRead({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'totalSupply',
    ...config,
  } as UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"zoraFeeManager"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 */
export function useZora721DropZoraFeeManager<
  TFunctionName extends 'zoraFeeManager',
  TSelectData = ReadContractResult<typeof zora721DropABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  return useContractRead({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'zoraFeeManager',
    ...config,
  } as UseContractReadConfig<typeof zora721DropABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora721DropABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
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
  return useContractWrite<typeof zora721DropABI, TFunctionName, TMode>({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"adminMint"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
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
  return useContractWrite<typeof zora721DropABI, 'adminMint', TMode>({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'adminMint',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"adminMintAirdrop"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
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
  return useContractWrite<typeof zora721DropABI, 'adminMintAirdrop', TMode>({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'adminMintAirdrop',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"approve"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
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
  return useContractWrite<typeof zora721DropABI, 'approve', TMode>({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'approve',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"burn"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
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
  return useContractWrite<typeof zora721DropABI, 'burn', TMode>({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'burn',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"finalizeOpenEdition"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
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
  return useContractWrite<typeof zora721DropABI, 'finalizeOpenEdition', TMode>({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'finalizeOpenEdition',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"grantRole"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
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
  return useContractWrite<typeof zora721DropABI, 'grantRole', TMode>({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'grantRole',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"initialize"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
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
  return useContractWrite<typeof zora721DropABI, 'initialize', TMode>({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'initialize',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"manageMarketFilterDAOSubscription"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
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
  return useContractWrite<
    typeof zora721DropABI,
    'manageMarketFilterDAOSubscription',
    TMode
  >({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'manageMarketFilterDAOSubscription',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"purchase"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
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
  return useContractWrite<typeof zora721DropABI, 'purchase', TMode>({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'purchase',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"purchasePresale"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
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
  return useContractWrite<typeof zora721DropABI, 'purchasePresale', TMode>({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'purchasePresale',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"renounceRole"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
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
  return useContractWrite<typeof zora721DropABI, 'renounceRole', TMode>({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'renounceRole',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"revokeRole"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
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
  return useContractWrite<typeof zora721DropABI, 'revokeRole', TMode>({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'revokeRole',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"safeTransferFrom"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
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
  return useContractWrite<typeof zora721DropABI, 'safeTransferFrom', TMode>({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'safeTransferFrom',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"setApprovalForAll"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
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
  return useContractWrite<typeof zora721DropABI, 'setApprovalForAll', TMode>({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'setApprovalForAll',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"setFundsRecipient"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
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
  return useContractWrite<typeof zora721DropABI, 'setFundsRecipient', TMode>({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'setFundsRecipient',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"setMetadataRenderer"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
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
  return useContractWrite<typeof zora721DropABI, 'setMetadataRenderer', TMode>({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'setMetadataRenderer',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"setOwner"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
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
  return useContractWrite<typeof zora721DropABI, 'setOwner', TMode>({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'setOwner',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"setSaleConfiguration"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
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
  return useContractWrite<typeof zora721DropABI, 'setSaleConfiguration', TMode>({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'setSaleConfiguration',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"transferFrom"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
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
  return useContractWrite<typeof zora721DropABI, 'transferFrom', TMode>({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'transferFrom',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"updateMarketFilterSettings"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
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
  return useContractWrite<typeof zora721DropABI, 'updateMarketFilterSettings', TMode>({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'updateMarketFilterSettings',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"upgradeTo"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
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
  return useContractWrite<typeof zora721DropABI, 'upgradeTo', TMode>({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'upgradeTo',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"upgradeToAndCall"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
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
  return useContractWrite<typeof zora721DropABI, 'upgradeToAndCall', TMode>({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'upgradeToAndCall',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"withdraw"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
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
  return useContractWrite<typeof zora721DropABI, 'withdraw', TMode>({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'withdraw',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"zoraFeeForAmount"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 */
export function useZora721DropZoraFeeForAmount<
  TMode extends WriteContractMode = undefined,
  TChainId extends number = keyof typeof zora721DropAddress
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof zora721DropABI,
          'zoraFeeForAmount'
        >['request']['abi'],
        'zoraFeeForAmount',
        TMode
      > & { address?: Address; chainId?: TChainId; functionName?: 'zoraFeeForAmount' }
    : UseContractWriteConfig<typeof zora721DropABI, 'zoraFeeForAmount', TMode> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'zoraFeeForAmount'
      } = {} as any
) {
  return useContractWrite<typeof zora721DropABI, 'zoraFeeForAmount', TMode>({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'zoraFeeForAmount',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora721DropABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 */
export function usePrepareZora721DropWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora721DropABI, TFunctionName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  return usePrepareContractWrite({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora721DropABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"adminMint"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 */
export function usePrepareZora721DropAdminMint(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora721DropABI, 'adminMint'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  return usePrepareContractWrite({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'adminMint',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora721DropABI, 'adminMint'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"adminMintAirdrop"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 */
export function usePrepareZora721DropAdminMintAirdrop(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora721DropABI, 'adminMintAirdrop'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  return usePrepareContractWrite({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'adminMintAirdrop',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora721DropABI, 'adminMintAirdrop'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"approve"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 */
export function usePrepareZora721DropApprove(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora721DropABI, 'approve'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  return usePrepareContractWrite({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'approve',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora721DropABI, 'approve'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"burn"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 */
export function usePrepareZora721DropBurn(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora721DropABI, 'burn'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  return usePrepareContractWrite({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'burn',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora721DropABI, 'burn'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"finalizeOpenEdition"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 */
export function usePrepareZora721DropFinalizeOpenEdition(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora721DropABI, 'finalizeOpenEdition'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  return usePrepareContractWrite({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'finalizeOpenEdition',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora721DropABI, 'finalizeOpenEdition'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"grantRole"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 */
export function usePrepareZora721DropGrantRole(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora721DropABI, 'grantRole'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  return usePrepareContractWrite({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'grantRole',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora721DropABI, 'grantRole'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"initialize"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 */
export function usePrepareZora721DropInitialize(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora721DropABI, 'initialize'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  return usePrepareContractWrite({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'initialize',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora721DropABI, 'initialize'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"manageMarketFilterDAOSubscription"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
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
  return usePrepareContractWrite({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'manageMarketFilterDAOSubscription',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof zora721DropABI,
    'manageMarketFilterDAOSubscription'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"purchase"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 */
export function usePrepareZora721DropPurchase(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora721DropABI, 'purchase'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  return usePrepareContractWrite({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'purchase',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora721DropABI, 'purchase'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"purchasePresale"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 */
export function usePrepareZora721DropPurchasePresale(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora721DropABI, 'purchasePresale'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  return usePrepareContractWrite({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'purchasePresale',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora721DropABI, 'purchasePresale'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"renounceRole"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 */
export function usePrepareZora721DropRenounceRole(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora721DropABI, 'renounceRole'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  return usePrepareContractWrite({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'renounceRole',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora721DropABI, 'renounceRole'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"revokeRole"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 */
export function usePrepareZora721DropRevokeRole(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora721DropABI, 'revokeRole'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  return usePrepareContractWrite({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'revokeRole',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora721DropABI, 'revokeRole'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"safeTransferFrom"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 */
export function usePrepareZora721DropSafeTransferFrom(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora721DropABI, 'safeTransferFrom'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  return usePrepareContractWrite({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'safeTransferFrom',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora721DropABI, 'safeTransferFrom'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"setApprovalForAll"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 */
export function usePrepareZora721DropSetApprovalForAll(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora721DropABI, 'setApprovalForAll'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  return usePrepareContractWrite({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'setApprovalForAll',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora721DropABI, 'setApprovalForAll'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"setFundsRecipient"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 */
export function usePrepareZora721DropSetFundsRecipient(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora721DropABI, 'setFundsRecipient'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  return usePrepareContractWrite({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'setFundsRecipient',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora721DropABI, 'setFundsRecipient'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"setMetadataRenderer"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 */
export function usePrepareZora721DropSetMetadataRenderer(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora721DropABI, 'setMetadataRenderer'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  return usePrepareContractWrite({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'setMetadataRenderer',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora721DropABI, 'setMetadataRenderer'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"setOwner"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 */
export function usePrepareZora721DropSetOwner(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora721DropABI, 'setOwner'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  return usePrepareContractWrite({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'setOwner',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora721DropABI, 'setOwner'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"setSaleConfiguration"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 */
export function usePrepareZora721DropSetSaleConfiguration(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora721DropABI, 'setSaleConfiguration'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  return usePrepareContractWrite({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'setSaleConfiguration',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora721DropABI, 'setSaleConfiguration'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"transferFrom"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 */
export function usePrepareZora721DropTransferFrom(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora721DropABI, 'transferFrom'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  return usePrepareContractWrite({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'transferFrom',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora721DropABI, 'transferFrom'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"updateMarketFilterSettings"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 */
export function usePrepareZora721DropUpdateMarketFilterSettings(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora721DropABI, 'updateMarketFilterSettings'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  return usePrepareContractWrite({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'updateMarketFilterSettings',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora721DropABI, 'updateMarketFilterSettings'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"upgradeTo"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 */
export function usePrepareZora721DropUpgradeTo(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora721DropABI, 'upgradeTo'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  return usePrepareContractWrite({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'upgradeTo',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora721DropABI, 'upgradeTo'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"upgradeToAndCall"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 */
export function usePrepareZora721DropUpgradeToAndCall(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora721DropABI, 'upgradeToAndCall'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  return usePrepareContractWrite({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'upgradeToAndCall',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora721DropABI, 'upgradeToAndCall'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"withdraw"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 */
export function usePrepareZora721DropWithdraw(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora721DropABI, 'withdraw'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  return usePrepareContractWrite({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'withdraw',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora721DropABI, 'withdraw'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zora721DropABI}__ and `functionName` set to `"zoraFeeForAmount"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 */
export function usePrepareZora721DropZoraFeeForAmount(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zora721DropABI, 'zoraFeeForAmount'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  return usePrepareContractWrite({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    functionName: 'zoraFeeForAmount',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zora721DropABI, 'zoraFeeForAmount'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora721DropABI}__.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 */
export function useZora721DropEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof zora721DropABI, TEventName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  return useContractEvent({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    ...config,
  } as UseContractEventConfig<typeof zora721DropABI, TEventName>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora721DropABI}__ and `eventName` set to `"AdminChanged"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 */
export function useZora721DropAdminChangedEvent(
  config: Omit<
    UseContractEventConfig<typeof zora721DropABI, 'AdminChanged'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  return useContractEvent({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    eventName: 'AdminChanged',
    ...config,
  } as UseContractEventConfig<typeof zora721DropABI, 'AdminChanged'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora721DropABI}__ and `eventName` set to `"Approval"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 */
export function useZora721DropApprovalEvent(
  config: Omit<
    UseContractEventConfig<typeof zora721DropABI, 'Approval'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  return useContractEvent({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    eventName: 'Approval',
    ...config,
  } as UseContractEventConfig<typeof zora721DropABI, 'Approval'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora721DropABI}__ and `eventName` set to `"ApprovalForAll"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 */
export function useZora721DropApprovalForAllEvent(
  config: Omit<
    UseContractEventConfig<typeof zora721DropABI, 'ApprovalForAll'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  return useContractEvent({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    eventName: 'ApprovalForAll',
    ...config,
  } as UseContractEventConfig<typeof zora721DropABI, 'ApprovalForAll'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora721DropABI}__ and `eventName` set to `"BeaconUpgraded"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 */
export function useZora721DropBeaconUpgradedEvent(
  config: Omit<
    UseContractEventConfig<typeof zora721DropABI, 'BeaconUpgraded'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  return useContractEvent({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    eventName: 'BeaconUpgraded',
    ...config,
  } as UseContractEventConfig<typeof zora721DropABI, 'BeaconUpgraded'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora721DropABI}__ and `eventName` set to `"FundsReceived"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 */
export function useZora721DropFundsReceivedEvent(
  config: Omit<
    UseContractEventConfig<typeof zora721DropABI, 'FundsReceived'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  return useContractEvent({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    eventName: 'FundsReceived',
    ...config,
  } as UseContractEventConfig<typeof zora721DropABI, 'FundsReceived'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora721DropABI}__ and `eventName` set to `"FundsRecipientChanged"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 */
export function useZora721DropFundsRecipientChangedEvent(
  config: Omit<
    UseContractEventConfig<typeof zora721DropABI, 'FundsRecipientChanged'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  return useContractEvent({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    eventName: 'FundsRecipientChanged',
    ...config,
  } as UseContractEventConfig<typeof zora721DropABI, 'FundsRecipientChanged'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora721DropABI}__ and `eventName` set to `"FundsWithdrawn"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 */
export function useZora721DropFundsWithdrawnEvent(
  config: Omit<
    UseContractEventConfig<typeof zora721DropABI, 'FundsWithdrawn'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  return useContractEvent({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    eventName: 'FundsWithdrawn',
    ...config,
  } as UseContractEventConfig<typeof zora721DropABI, 'FundsWithdrawn'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora721DropABI}__ and `eventName` set to `"OpenMintFinalized"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 */
export function useZora721DropOpenMintFinalizedEvent(
  config: Omit<
    UseContractEventConfig<typeof zora721DropABI, 'OpenMintFinalized'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  return useContractEvent({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    eventName: 'OpenMintFinalized',
    ...config,
  } as UseContractEventConfig<typeof zora721DropABI, 'OpenMintFinalized'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora721DropABI}__ and `eventName` set to `"OwnerCanceled"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 */
export function useZora721DropOwnerCanceledEvent(
  config: Omit<
    UseContractEventConfig<typeof zora721DropABI, 'OwnerCanceled'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  return useContractEvent({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    eventName: 'OwnerCanceled',
    ...config,
  } as UseContractEventConfig<typeof zora721DropABI, 'OwnerCanceled'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora721DropABI}__ and `eventName` set to `"OwnerPending"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 */
export function useZora721DropOwnerPendingEvent(
  config: Omit<
    UseContractEventConfig<typeof zora721DropABI, 'OwnerPending'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  return useContractEvent({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    eventName: 'OwnerPending',
    ...config,
  } as UseContractEventConfig<typeof zora721DropABI, 'OwnerPending'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora721DropABI}__ and `eventName` set to `"OwnershipTransferred"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 */
export function useZora721DropOwnershipTransferredEvent(
  config: Omit<
    UseContractEventConfig<typeof zora721DropABI, 'OwnershipTransferred'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  return useContractEvent({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    eventName: 'OwnershipTransferred',
    ...config,
  } as UseContractEventConfig<typeof zora721DropABI, 'OwnershipTransferred'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora721DropABI}__ and `eventName` set to `"RoleAdminChanged"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 */
export function useZora721DropRoleAdminChangedEvent(
  config: Omit<
    UseContractEventConfig<typeof zora721DropABI, 'RoleAdminChanged'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  return useContractEvent({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    eventName: 'RoleAdminChanged',
    ...config,
  } as UseContractEventConfig<typeof zora721DropABI, 'RoleAdminChanged'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora721DropABI}__ and `eventName` set to `"RoleGranted"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 */
export function useZora721DropRoleGrantedEvent(
  config: Omit<
    UseContractEventConfig<typeof zora721DropABI, 'RoleGranted'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  return useContractEvent({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    eventName: 'RoleGranted',
    ...config,
  } as UseContractEventConfig<typeof zora721DropABI, 'RoleGranted'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora721DropABI}__ and `eventName` set to `"RoleRevoked"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 */
export function useZora721DropRoleRevokedEvent(
  config: Omit<
    UseContractEventConfig<typeof zora721DropABI, 'RoleRevoked'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  return useContractEvent({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    eventName: 'RoleRevoked',
    ...config,
  } as UseContractEventConfig<typeof zora721DropABI, 'RoleRevoked'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora721DropABI}__ and `eventName` set to `"Sale"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 */
export function useZora721DropSaleEvent(
  config: Omit<
    UseContractEventConfig<typeof zora721DropABI, 'Sale'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  return useContractEvent({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    eventName: 'Sale',
    ...config,
  } as UseContractEventConfig<typeof zora721DropABI, 'Sale'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora721DropABI}__ and `eventName` set to `"SalesConfigChanged"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 */
export function useZora721DropSalesConfigChangedEvent(
  config: Omit<
    UseContractEventConfig<typeof zora721DropABI, 'SalesConfigChanged'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  return useContractEvent({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    eventName: 'SalesConfigChanged',
    ...config,
  } as UseContractEventConfig<typeof zora721DropABI, 'SalesConfigChanged'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora721DropABI}__ and `eventName` set to `"Transfer"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 */
export function useZora721DropTransferEvent(
  config: Omit<
    UseContractEventConfig<typeof zora721DropABI, 'Transfer'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  return useContractEvent({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    eventName: 'Transfer',
    ...config,
  } as UseContractEventConfig<typeof zora721DropABI, 'Transfer'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora721DropABI}__ and `eventName` set to `"UpdatedMetadataRenderer"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 */
export function useZora721DropUpdatedMetadataRendererEvent(
  config: Omit<
    UseContractEventConfig<typeof zora721DropABI, 'UpdatedMetadataRenderer'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  return useContractEvent({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    eventName: 'UpdatedMetadataRenderer',
    ...config,
  } as UseContractEventConfig<typeof zora721DropABI, 'UpdatedMetadataRenderer'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link zora721DropABI}__ and `eventName` set to `"Upgraded"`.
 *
 * [__View Contract on Ethereum Etherscan__](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c)
 */
export function useZora721DropUpgradedEvent(
  config: Omit<
    UseContractEventConfig<typeof zora721DropABI, 'Upgraded'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof zora721DropAddress } = {} as any
) {
  return useContractEvent({
    abi: zora721DropABI,
    address: zora721DropAddress[1],
    eventName: 'Upgraded',
    ...config,
  } as UseContractEventConfig<typeof zora721DropABI, 'Upgraded'>)
}
