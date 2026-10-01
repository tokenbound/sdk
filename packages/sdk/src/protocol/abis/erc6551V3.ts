// ERC-6551 V3 protocol ABIs.
// Relocated out of src/test/wagmi-cli-hooks/generated.ts so that production code
// never imports from the test tree (which also carries Zora/WETH test fixtures).

export const erc6551AccountProxyV3ABI = [
	{
		stateMutability: "nonpayable",
		type: "constructor",
		inputs: [
			{ name: "_guardian", internalType: "address", type: "address" },
			{
				name: "_initialImplementation",
				internalType: "address",
				type: "address",
			},
		],
	},
	{ type: "error", inputs: [], name: "AlreadyInitialized" },
	{ type: "error", inputs: [], name: "InvalidImplementation" },
	{
		type: "event",
		anonymous: false,
		inputs: [
			{
				name: "previousAdmin",
				internalType: "address",
				type: "address",
				indexed: false,
			},
			{
				name: "newAdmin",
				internalType: "address",
				type: "address",
				indexed: false,
			},
		],
		name: "AdminChanged",
	},
	{
		type: "event",
		anonymous: false,
		inputs: [
			{
				name: "beacon",
				internalType: "address",
				type: "address",
				indexed: true,
			},
		],
		name: "BeaconUpgraded",
	},
	{
		type: "event",
		anonymous: false,
		inputs: [
			{
				name: "implementation",
				internalType: "address",
				type: "address",
				indexed: true,
			},
		],
		name: "Upgraded",
	},
	{ stateMutability: "payable", type: "fallback" },
	{
		stateMutability: "nonpayable",
		type: "function",
		inputs: [
			{ name: "implementation", internalType: "address", type: "address" },
		],
		name: "initialize",
		outputs: [],
	},
	{ stateMutability: "payable", type: "receive" },
] as const

export const erc6551AccountV3ABI = [
	{
		stateMutability: "nonpayable",
		type: "constructor",
		inputs: [
			{ name: "entryPoint_", internalType: "address", type: "address" },
			{ name: "multicallForwarder", internalType: "address", type: "address" },
			{ name: "erc6551Registry", internalType: "address", type: "address" },
			{ name: "guardian", internalType: "address", type: "address" },
		],
	},
	{ type: "error", inputs: [], name: "AccountLocked" },
	{ type: "error", inputs: [], name: "ContractCreationFailed" },
	{ type: "error", inputs: [], name: "ExceedsMaxLockTime" },
	{ type: "error", inputs: [], name: "InvalidAccountProof" },
	{ type: "error", inputs: [], name: "InvalidERC6551Registry" },
	{ type: "error", inputs: [], name: "InvalidEntryPoint" },
	{ type: "error", inputs: [], name: "InvalidImplementation" },
	{ type: "error", inputs: [], name: "InvalidInput" },
	{ type: "error", inputs: [], name: "InvalidMulticallForwarder" },
	{ type: "error", inputs: [], name: "InvalidOperation" },
	{ type: "error", inputs: [], name: "NotAuthorized" },
	{ type: "error", inputs: [], name: "OwnershipCycle" },
	{
		type: "event",
		anonymous: false,
		inputs: [
			{
				name: "previousAdmin",
				internalType: "address",
				type: "address",
				indexed: false,
			},
			{
				name: "newAdmin",
				internalType: "address",
				type: "address",
				indexed: false,
			},
		],
		name: "AdminChanged",
	},
	{
		type: "event",
		anonymous: false,
		inputs: [
			{
				name: "beacon",
				internalType: "address",
				type: "address",
				indexed: true,
			},
		],
		name: "BeaconUpgraded",
	},
	{
		type: "event",
		anonymous: false,
		inputs: [
			{
				name: "lockedUntil",
				internalType: "uint256",
				type: "uint256",
				indexed: false,
			},
		],
		name: "LockUpdated",
	},
	{
		type: "event",
		anonymous: false,
		inputs: [
			{
				name: "owner",
				internalType: "address",
				type: "address",
				indexed: false,
			},
			{
				name: "selector",
				internalType: "bytes4",
				type: "bytes4",
				indexed: false,
			},
			{
				name: "implementation",
				internalType: "address",
				type: "address",
				indexed: false,
			},
		],
		name: "OverrideUpdated",
	},
	{
		type: "event",
		anonymous: false,
		inputs: [
			{
				name: "owner",
				internalType: "address",
				type: "address",
				indexed: false,
			},
			{
				name: "caller",
				internalType: "address",
				type: "address",
				indexed: false,
			},
			{
				name: "hasPermission",
				internalType: "bool",
				type: "bool",
				indexed: false,
			},
		],
		name: "PermissionUpdated",
	},
	{
		type: "event",
		anonymous: false,
		inputs: [
			{
				name: "implementation",
				internalType: "address",
				type: "address",
				indexed: true,
			},
		],
		name: "Upgraded",
	},
	{ stateMutability: "payable", type: "fallback" },
	{
		stateMutability: "view",
		type: "function",
		inputs: [],
		name: "entryPoint",
		outputs: [
			{ name: "", internalType: "contract IEntryPoint", type: "address" },
		],
	},
	{
		stateMutability: "view",
		type: "function",
		inputs: [],
		name: "erc6551Registry",
		outputs: [{ name: "", internalType: "address", type: "address" }],
	},
	{
		stateMutability: "payable",
		type: "function",
		inputs: [
			{ name: "to", internalType: "address", type: "address" },
			{ name: "value", internalType: "uint256", type: "uint256" },
			{ name: "data", internalType: "bytes", type: "bytes" },
			{ name: "operation", internalType: "uint8", type: "uint8" },
		],
		name: "execute",
		outputs: [{ name: "", internalType: "bytes", type: "bytes" }],
	},
	{
		stateMutability: "payable",
		type: "function",
		inputs: [
			{
				name: "operations",
				internalType: "struct BatchExecutor.Operation[]",
				type: "tuple[]",
				components: [
					{ name: "to", internalType: "address", type: "address" },
					{ name: "value", internalType: "uint256", type: "uint256" },
					{ name: "data", internalType: "bytes", type: "bytes" },
					{ name: "operation", internalType: "uint8", type: "uint8" },
				],
			},
		],
		name: "executeBatch",
		outputs: [{ name: "", internalType: "bytes[]", type: "bytes[]" }],
	},
	{
		stateMutability: "payable",
		type: "function",
		inputs: [
			{ name: "to", internalType: "address", type: "address" },
			{ name: "value", internalType: "uint256", type: "uint256" },
			{ name: "data", internalType: "bytes", type: "bytes" },
			{ name: "operation", internalType: "uint8", type: "uint8" },
			{
				name: "proof",
				internalType: "struct NestedAccountExecutor.ERC6551AccountInfo[]",
				type: "tuple[]",
				components: [
					{ name: "salt", internalType: "bytes32", type: "bytes32" },
					{ name: "tokenContract", internalType: "address", type: "address" },
					{ name: "tokenId", internalType: "uint256", type: "uint256" },
				],
			},
		],
		name: "executeNested",
		outputs: [{ name: "", internalType: "bytes", type: "bytes" }],
	},
	{
		stateMutability: "nonpayable",
		type: "function",
		inputs: [
			{ name: "to", internalType: "address", type: "address" },
			{ name: "value", internalType: "uint256", type: "uint256" },
			{ name: "data", internalType: "bytes", type: "bytes" },
		],
		name: "extcall",
		outputs: [{ name: "result", internalType: "bytes", type: "bytes" }],
	},
	{
		stateMutability: "nonpayable",
		type: "function",
		inputs: [
			{ name: "value", internalType: "uint256", type: "uint256" },
			{ name: "bytecode", internalType: "bytes", type: "bytes" },
		],
		name: "extcreate",
		outputs: [{ name: "", internalType: "address", type: "address" }],
	},
	{
		stateMutability: "nonpayable",
		type: "function",
		inputs: [
			{ name: "value", internalType: "uint256", type: "uint256" },
			{ name: "salt", internalType: "bytes32", type: "bytes32" },
			{ name: "bytecode", internalType: "bytes", type: "bytes" },
		],
		name: "extcreate2",
		outputs: [{ name: "", internalType: "address", type: "address" }],
	},
	{
		stateMutability: "view",
		type: "function",
		inputs: [{ name: "slot", internalType: "bytes32", type: "bytes32" }],
		name: "extsload",
		outputs: [{ name: "value", internalType: "bytes32", type: "bytes32" }],
	},
	{
		stateMutability: "view",
		type: "function",
		inputs: [],
		name: "getNonce",
		outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
	},
	{
		stateMutability: "view",
		type: "function",
		inputs: [],
		name: "isLocked",
		outputs: [{ name: "", internalType: "bool", type: "bool" }],
	},
	{
		stateMutability: "view",
		type: "function",
		inputs: [{ name: "forwarder", internalType: "address", type: "address" }],
		name: "isTrustedForwarder",
		outputs: [{ name: "", internalType: "bool", type: "bool" }],
	},
	{
		stateMutability: "view",
		type: "function",
		inputs: [
			{ name: "hash", internalType: "bytes32", type: "bytes32" },
			{ name: "signature", internalType: "bytes", type: "bytes" },
		],
		name: "isValidSignature",
		outputs: [{ name: "magicValue", internalType: "bytes4", type: "bytes4" }],
	},
	{
		stateMutability: "view",
		type: "function",
		inputs: [
			{ name: "signer", internalType: "address", type: "address" },
			{ name: "data", internalType: "bytes", type: "bytes" },
		],
		name: "isValidSigner",
		outputs: [{ name: "magicValue", internalType: "bytes4", type: "bytes4" }],
	},
	{
		stateMutability: "nonpayable",
		type: "function",
		inputs: [
			{ name: "_lockedUntil", internalType: "uint256", type: "uint256" },
		],
		name: "lock",
		outputs: [],
	},
	{
		stateMutability: "view",
		type: "function",
		inputs: [],
		name: "lockedUntil",
		outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
	},
	{
		stateMutability: "nonpayable",
		type: "function",
		inputs: [
			{ name: "", internalType: "address", type: "address" },
			{ name: "", internalType: "address", type: "address" },
			{ name: "", internalType: "uint256[]", type: "uint256[]" },
			{ name: "", internalType: "uint256[]", type: "uint256[]" },
			{ name: "", internalType: "bytes", type: "bytes" },
		],
		name: "onERC1155BatchReceived",
		outputs: [{ name: "", internalType: "bytes4", type: "bytes4" }],
	},
	{
		stateMutability: "nonpayable",
		type: "function",
		inputs: [
			{ name: "", internalType: "address", type: "address" },
			{ name: "", internalType: "address", type: "address" },
			{ name: "", internalType: "uint256", type: "uint256" },
			{ name: "", internalType: "uint256", type: "uint256" },
			{ name: "", internalType: "bytes", type: "bytes" },
		],
		name: "onERC1155Received",
		outputs: [{ name: "", internalType: "bytes4", type: "bytes4" }],
	},
	{
		stateMutability: "nonpayable",
		type: "function",
		inputs: [
			{ name: "", internalType: "address", type: "address" },
			{ name: "", internalType: "address", type: "address" },
			{ name: "tokenId", internalType: "uint256", type: "uint256" },
			{ name: "", internalType: "bytes", type: "bytes" },
		],
		name: "onERC721Received",
		outputs: [{ name: "", internalType: "bytes4", type: "bytes4" }],
	},
	{
		stateMutability: "view",
		type: "function",
		inputs: [
			{ name: "", internalType: "address", type: "address" },
			{ name: "", internalType: "bytes4", type: "bytes4" },
		],
		name: "overrides",
		outputs: [{ name: "", internalType: "address", type: "address" }],
	},
	{
		stateMutability: "view",
		type: "function",
		inputs: [],
		name: "owner",
		outputs: [{ name: "", internalType: "address", type: "address" }],
	},
	{
		stateMutability: "view",
		type: "function",
		inputs: [
			{ name: "", internalType: "address", type: "address" },
			{ name: "", internalType: "address", type: "address" },
		],
		name: "permissions",
		outputs: [{ name: "", internalType: "bool", type: "bool" }],
	},
	{
		stateMutability: "view",
		type: "function",
		inputs: [],
		name: "proxiableUUID",
		outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
	},
	{
		stateMutability: "nonpayable",
		type: "function",
		inputs: [
			{ name: "selectors", internalType: "bytes4[]", type: "bytes4[]" },
			{ name: "implementations", internalType: "address[]", type: "address[]" },
		],
		name: "setOverrides",
		outputs: [],
	},
	{
		stateMutability: "nonpayable",
		type: "function",
		inputs: [
			{ name: "callers", internalType: "address[]", type: "address[]" },
			{ name: "_permissions", internalType: "bool[]", type: "bool[]" },
		],
		name: "setPermissions",
		outputs: [],
	},
	{
		stateMutability: "view",
		type: "function",
		inputs: [],
		name: "state",
		outputs: [{ name: "", internalType: "uint256", type: "uint256" }],
	},
	{
		stateMutability: "view",
		type: "function",
		inputs: [{ name: "interfaceId", internalType: "bytes4", type: "bytes4" }],
		name: "supportsInterface",
		outputs: [{ name: "", internalType: "bool", type: "bool" }],
	},
	{
		stateMutability: "view",
		type: "function",
		inputs: [],
		name: "token",
		outputs: [
			{ name: "chainId", internalType: "uint256", type: "uint256" },
			{ name: "tokenContract", internalType: "address", type: "address" },
			{ name: "tokenId", internalType: "uint256", type: "uint256" },
		],
	},
	{
		stateMutability: "nonpayable",
		type: "function",
		inputs: [
			{ name: "newImplementation", internalType: "address", type: "address" },
		],
		name: "upgradeTo",
		outputs: [],
	},
	{
		stateMutability: "payable",
		type: "function",
		inputs: [
			{ name: "newImplementation", internalType: "address", type: "address" },
			{ name: "data", internalType: "bytes", type: "bytes" },
		],
		name: "upgradeToAndCall",
		outputs: [],
	},
	{
		stateMutability: "nonpayable",
		type: "function",
		inputs: [
			{
				name: "userOp",
				internalType: "struct UserOperation",
				type: "tuple",
				components: [
					{ name: "sender", internalType: "address", type: "address" },
					{ name: "nonce", internalType: "uint256", type: "uint256" },
					{ name: "initCode", internalType: "bytes", type: "bytes" },
					{ name: "callData", internalType: "bytes", type: "bytes" },
					{ name: "callGasLimit", internalType: "uint256", type: "uint256" },
					{
						name: "verificationGasLimit",
						internalType: "uint256",
						type: "uint256",
					},
					{
						name: "preVerificationGas",
						internalType: "uint256",
						type: "uint256",
					},
					{ name: "maxFeePerGas", internalType: "uint256", type: "uint256" },
					{
						name: "maxPriorityFeePerGas",
						internalType: "uint256",
						type: "uint256",
					},
					{ name: "paymasterAndData", internalType: "bytes", type: "bytes" },
					{ name: "signature", internalType: "bytes", type: "bytes" },
				],
			},
			{ name: "userOpHash", internalType: "bytes32", type: "bytes32" },
			{ name: "missingAccountFunds", internalType: "uint256", type: "uint256" },
		],
		name: "validateUserOp",
		outputs: [
			{ name: "validationData", internalType: "uint256", type: "uint256" },
		],
	},
	{ stateMutability: "payable", type: "receive" },
] as const

export const erc6551RegistryV3ABI = [
	{ type: "error", inputs: [], name: "AccountCreationFailed" },
	{
		type: "event",
		anonymous: false,
		inputs: [
			{
				name: "account",
				internalType: "address",
				type: "address",
				indexed: false,
			},
			{
				name: "implementation",
				internalType: "address",
				type: "address",
				indexed: true,
			},
			{
				name: "salt",
				internalType: "bytes32",
				type: "bytes32",
				indexed: false,
			},
			{
				name: "chainId",
				internalType: "uint256",
				type: "uint256",
				indexed: false,
			},
			{
				name: "tokenContract",
				internalType: "address",
				type: "address",
				indexed: true,
			},
			{
				name: "tokenId",
				internalType: "uint256",
				type: "uint256",
				indexed: true,
			},
		],
		name: "ERC6551AccountCreated",
	},
	{
		stateMutability: "view",
		type: "function",
		inputs: [
			{ name: "implementation", internalType: "address", type: "address" },
			{ name: "salt", internalType: "bytes32", type: "bytes32" },
			{ name: "chainId", internalType: "uint256", type: "uint256" },
			{ name: "tokenContract", internalType: "address", type: "address" },
			{ name: "tokenId", internalType: "uint256", type: "uint256" },
		],
		name: "account",
		outputs: [{ name: "", internalType: "address", type: "address" }],
	},
	{
		stateMutability: "nonpayable",
		type: "function",
		inputs: [
			{ name: "implementation", internalType: "address", type: "address" },
			{ name: "salt", internalType: "bytes32", type: "bytes32" },
			{ name: "chainId", internalType: "uint256", type: "uint256" },
			{ name: "tokenContract", internalType: "address", type: "address" },
			{ name: "tokenId", internalType: "uint256", type: "uint256" },
		],
		name: "createAccount",
		outputs: [{ name: "", internalType: "address", type: "address" }],
	},
] as const
