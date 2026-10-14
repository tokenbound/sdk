export const LZ_TESTNET_EXECUTOR = "0xEF7B07Db21d449C50b00De4563FfFe4C9dd33f1f"
export const LZ_MAINNET_EXECUTOR = "0x0F220412Bf22E05EBcC5070D60fd7136A08aF22C"

export const LZ_MAINNET_EXECUTORS: { [originChainId: number]: `0x${string}` } =
	{
		// ethereum
		1: LZ_MAINNET_EXECUTOR,
		// polygon
		137: LZ_MAINNET_EXECUTOR,
		// optimism
		10: LZ_MAINNET_EXECUTOR,
		// base
		8453: LZ_MAINNET_EXECUTOR,
		// linea
		59144: LZ_MAINNET_EXECUTOR,
		// arbitrum
		42161: LZ_MAINNET_EXECUTOR,
	}

export const LZ_TESTNET_EXECUTORS: { [originChainId: number]: `0x${string}` } =
	{
		// sepolia
		11155111: LZ_TESTNET_EXECUTOR,
		// mumbai
		80001: LZ_TESTNET_EXECUTOR,
		// op sepolia
		11155420: LZ_TESTNET_EXECUTOR,
		// base sepolia
		84532: LZ_TESTNET_EXECUTOR,
		// linea testnet
		59140: LZ_TESTNET_EXECUTOR,
		// arbitrum sepolia
		421614: LZ_TESTNET_EXECUTOR,
	}

export const LZ_EXECUTORS: { [originChainId: number]: `0x${string}` } = {
	...LZ_TESTNET_EXECUTORS,
	...LZ_MAINNET_EXECUTORS,
}

export const LZ_MAINNET_EIDS: { [chainId: number]: number } = {
	// ethereum
	1: 30101,
	// polygon
	137: 30109,
	// optimism
	10: 30111,
	// base
	8453: 30184,
	// linea
	59144: 30183,
	// arbitrum
	42161: 30110,
}

export const LZ_TESTNET_EIDS: { [chainId: number]: number } = {
	// sepolia
	11155111: 40161,
	// mumbai
	80001: 40109,
	// op sepolia
	11155420: 40232,
	// base sepolia
	84532: 40245,
	// linea testnet
	59140: 40157,
	// arbitrum sepolia
	421614: 40231,
}

export const LZ_EIDS: { [chainId: number]: number } = {
	...LZ_TESTNET_EIDS,
	...LZ_MAINNET_EIDS,
}
