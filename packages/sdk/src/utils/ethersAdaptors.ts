import { providers } from 'ethers'
import { BrowserProvider, JsonRpcSigner } from 'ethers6'
import { WalletClient } from 'viem'
// Ethers.js Adapters for Wagmi Wallet Client
// https://wagmi.sh/react/ethers-adapters

export function walletClientToEthers5Signer(walletClient: WalletClient) {
  const { account, chain, transport } = walletClient
  const network = {
    chainId: chain!.id,
    name: chain!.name,
    ensAddress: chain!.contracts?.ensRegistry?.address,
  }
  const provider = new providers.Web3Provider(transport, network)
  const signer = provider.getSigner(account!.address)
  return signer
}

export function walletClientToEthers6Signer(walletClient: WalletClient) {
  const { account, chain, transport } = walletClient
  const network = {
    chainId: chain!.id,
    name: chain!.name,
    ensAddress: chain!.contracts?.ensRegistry?.address,
  }
  const provider = new BrowserProvider(transport, network)
  const signer = new JsonRpcSigner(provider, account!.address)
  return signer
}