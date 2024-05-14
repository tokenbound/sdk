# @tokenbound/sdk

## 0.5.4

### Patch Changes

- transition to viem 2

## 0.5.2

### Patch Changes

- fix version misalignment with NPM

## 0.5.1

### Patch Changes

- Add Base Sepolia chain, revise tests to eliminate goerli dep

## 0.5.0

### Minor Changes

- 62968c4: Integrate V3 registry and account implementation into SDK

### Patch Changes

- 269d9ef: handle multicall for createAccount in prepareCreateAccount
- ad90b31: enable additional calls via multicall in createAccount
- b9f64b9: Introduce new testing rubric, ensure walletClient account matches hoisted account
- d7aba50: Revised testing pipeline, add signMessage, transferERC20, transferETH methods
- 0b59d05: Fix "Chain with id N not found" issue
- 1e3822b: return created account address from createAccount
- fcf538e: Added cross-chain support to helper methods
- b7d2ed7: fix for prepareExecuteCall value targeting EOA vs. TBA
- ac30562: add transferNFT method
- b228840: Add tests for SDK transactions
- d155d74: Added support for LayerZero cross chain transactions
- e0b5ea5: allow 1155 transfers using transferNFT to set amount, add 1155 tests
- c8d718a: Ensure init when TBClient is instantiated with default implementationAddress
- 991890f: Remove unused hooks + update Git workflow
- bbb9398: minor docs changes + rebuild
- 539b120: add ENS resolution to transfer methods
- 765b4d2: Add deconstructBytecode and getNFT methods
- 907b3b0: Eliminate non-deployed chains from build

## 0.3.2

### Patch Changes

- 37a5f93: export d.ts
- 3df57e7: set ethers executeCall and createAccount return types to hash

## 0.3.1

### Patch Changes

- a6f4b75: Enable custom account implementations
- 4429984: bug fix for Ethers executeCall and add RainbowKit example

## 0.3.0

### Minor Changes

- Combined viem and ethers packages into a single package

## 0.2.0

### Minor Changes

- Added initialization call to createAccount

## 0.1.2

### Patch Changes

- Fixed contract address issue

## 0.1.1

### Patch Changes

- Fixed build issues

## 0.1.0

### Minor Changes

- Updated to beta contract addresses

## 0.0.1

### Patch Changes

- Initial changeset config
