// To determine whether the signer is an Ethers signer without first importing the Ethers package,
// we check for the existence of the _isSigner property on the signer object.
// This type assures that there is at least some degree of type safety on the Ethers implementation of the TokenboundClient.

export type AbstractEthersSigner = {
  readonly _isSigner: boolean
} & Record<string, any>
