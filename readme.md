# Tokenbound SDK

This repo houses the tokenbound SDK, a front end library for interacting with [ERC-6551 accounts](https://eips.ethereum.org/EIPS/eip-6551).

### Packages

- **[@tokenbound/sdk]()** - SDK client for projects using viem
- **[@tokenbound/sdk-ethers]()** - SDK client for projects using ethers
- **[@tokenbound/react]()** - Low-level react hooks for interacting with token bound accounts

### Examples

- **[examples/vite-wagmi]()** - An example app using the tokenbound SDK in a vite project with wagmi

### Development

```bash
# clone the repo
$ git clone <repo>
# install dependencies
$ pnpm install
# build packages
$ pnpm run build --filter "@tokenbound/*"
```
