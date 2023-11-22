// To determine whether the provider is an Ethers provider without first importing the Ethers package,
// we check for the existence of the _isProvider property on the provider object.

export type AbstractEthersProvider = {
  readonly _isProvider: boolean
} & Record<string, any>
