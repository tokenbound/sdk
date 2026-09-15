export const ANVIL_RPC_URL = "http://127.0.0.1:8545"

export const ANVIL_ACCOUNTS = [
	{
		address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
		privateKey:
			"0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
	},
	{
		address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
		privateKey:
			"0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
	},
] as const

export const ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/
export const TX_HASH_REGEX = /^0x[a-fA-F0-9]{64}$/
