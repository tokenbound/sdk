import { AbstractClientOrProvider } from "../types";

// Typeguard to verify whether clientOrProvider is a viem client
export function isViemClient(clientOrProvider: AbstractClientOrProvider): boolean {
  return clientOrProvider && 'simulateContract' in clientOrProvider && typeof clientOrProvider.simulateContract === 'function'
}