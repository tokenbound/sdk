
// To determine whether the var is an Ethers BigNumber without first importing the Ethers package,
// we check for the existence of the _isBigNumber property on the object
// This AbstractBigNumber type assures that there is at least some degree of type safety on the Ethers implementation of the TokenboundClient.

export type AbstractBigNumber = {
    readonly _isBigNumber: boolean;
} & Record<string, any>