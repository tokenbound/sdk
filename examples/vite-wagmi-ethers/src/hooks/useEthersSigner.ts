import { providers } from "ethers"
import * as React from "react"
import type { WalletClient } from "viem"
import { useWalletClient } from "wagmi"

// Ethers.js Adapters for Wagmi Wallet Client
// https://wagmi.sh/react/ethers-adapters

export function walletClientToSigner(walletClient: WalletClient) {
	const { account, chain, transport } = walletClient
	if (!chain) throw new Error("Wallet client has no chain")
	if (!account) throw new Error("Wallet client has no account")
	const network = {
		chainId: chain.id,
		name: chain.name,
		ensAddress: chain.contracts?.ensRegistry?.address,
	}
	const provider = new providers.Web3Provider(transport, network)
	const signer = provider.getSigner(account.address)
	return signer
}

/** Hook to convert a viem Wallet Client to an ethers.js Signer. */
export function useEthersSigner({ chainId }: { chainId?: number } = {}) {
	const { data: walletClient } = useWalletClient({ chainId })
	return React.useMemo(
		() => (walletClient ? walletClientToSigner(walletClient) : undefined),
		[walletClient],
	)
}
