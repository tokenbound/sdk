// Shared test fixtures for every Tokenbound suite.
//
// PRIVATE: this package is never published (see "private": true). It exists so
// the viem suite (packages/sdk) and the ethers suites (packages/ethers) assert
// against the SAME mainnet contracts, accounts, ABIs and anvil configuration.
// Importing these rather than copying literals is what actually prevents the
// suites drifting apart — a copied constant with a comment saying "keep in
// sync" does not.

export * from "./anvil"
export * from "./fixtures"
export * from "./mints"
