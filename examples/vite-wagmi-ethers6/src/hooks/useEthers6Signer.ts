import * as React from 'react'
import { useWalletClient } from 'wagmi'
import type { WalletClient } from 'viem'
import { BrowserProvider, JsonRpcSigner } from 'ethers'
 
// Ethers.js Adapters for Wagmi Wallet Client
// https://wagmi.sh/react/ethers-adapters

export function walletClientToSigner(walletClient: WalletClient) {
  const { account, chain, transport } = walletClient
  if (!chain) throw new Error('Wallet client has no chain')
  if (!account) throw new Error('Wallet client has no account')
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  const provider = new BrowserProvider(transport, network)
  const signer = new JsonRpcSigner(provider, account.address)
  return signer
}
 
/** Hook to convert a viem Wallet Client to an ethers.js Signer. */
export function useEthers6Signer({ chainId }: { chainId?: number } = {}) {
  const { data: walletClient } = useWalletClient({ chainId })
  return React.useMemo(
    () => (walletClient ? walletClientToSigner(walletClient) : undefined),
    [walletClient],
  )
}