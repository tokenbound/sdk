import { AbstractClientOrProvider } from "../types";

// Typeguard to verify whether clientOrProvider is an Ethers provider
export function isEthersClient(clientOrProvider: AbstractClientOrProvider): boolean {
  return clientOrProvider && 'getBlockWithTransactions' in clientOrProvider && typeof clientOrProvider.getBlockWithTransactions === 'function'
}