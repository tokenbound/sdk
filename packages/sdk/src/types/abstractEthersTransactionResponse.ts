// We check for the existence of the hash as loose verification that a response is
// an Ethers TransactionResponse without first importing the Ethers package.
// This type assures that there is at least some degree of type safety on the Ethers implementation of the TokenboundClient.

export type AbstractEthersTransactionResponse = {
  hash: string
} & Record<string, any>
