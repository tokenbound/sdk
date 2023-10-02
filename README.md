# Tokenbound SDK

This repo houses the Tokenbound SDK, a front-end library for interacting with [ERC-6551 accounts](https://eips.ethereum.org/EIPS/eip-6551).

### Packages

- **[@tokenbound/sdk](https://github.com/tokenbound/sdk/tree/main/packages/sdk)** - SDK client for all projects, signing enabled via either Ethers Signer or viem WalletClient.
- **[@tokenbound/react](https://github.com/tokenbound/sdk/tree/main/packages/react)** - Low-level react hooks for interacting with token bound accounts

### Examples

- **[examples/vite-wagmi-viem](https://github.com/tokenbound/sdk/tree/main/examples/vite-wagmi-viem)** - An example app using the tokenbound SDK in a vite project with wagmi
- **[examples/vite-wagmi-ethers](https://github.com/tokenbound/sdk/tree/main/examples/vite-wagmi-ethers)** - An example app using the tokenbound SDK in a vite project with ethers v5
- **[examples/vite-wagmi-ethers6](https://github.com/tokenbound/sdk/tree/main/examples/vite-wagmi-ethers6)** - An example app using the tokenbound SDK in a vite project with ethers v6
- **[examples/vite-wagmi-ethers-rainbowkit](https://github.com/tokenbound/sdk/tree/main/examples/vite-wagmi-rainbowkit)** - An example app using the tokenbound SDK in a vite project with ethers v5

### Development

1. Clone repository and install dependencies:

```bash
# clone the repo
$ git clone <repo>
# install dependencies
$ pnpm install
# build packages
$ pnpm --filter "@tokenbound/*" build
```

NOTE: Any local changes to SDK methods in `TokenboundClient.ts` require a rebuild to be useable in the example apps in ```/example```

2. Install [Anvil](https://github.com/foundry-rs/foundry/tree/master/anvil) to run a local Ethereum node.
3. Configure environment variables. See `.env.example` for instructions
4. Run dev server: ```pnpm dev```

## Unit/integration tests

Tests are using [Vitest](https://vitest.dev), and can be performed via multiple pipelines:

- Unit tests spin up a local Anvil instance using [viem/anvil](https://www.npmjs.com/package/@viem/anvil) and transact against a local fork of mainnet.
- Integration tests are rendered with a [custom `render` function](https://testing-library.com/docs/react-testing-library/setup/#custom-render) from React Testing Library that integrates with Anvil. See usage of ```renderWithWagmiConfig``` in ```packages/sdk/src/tests```. The 

Both pipelines use [wagmi's Ethers adaptors](https://wagmi.sh/react/ethers-adapters) to convert the viem walletClient to Ethers 5 and Ethers 6 signers so the entire test suite is run against all 3 implementations.

These tests require a local Anvil node so test transactions can be run against a mainnet fork.

Thanks to [@tmm](https://github.com/tmm) for sharing [testing-wagmi](https://github.com/tmm/testing-wagmi) for reference.
### Run Tests

1. Spin up an Anvil instance and start Vitest from the SDK root:

```bash
pnpm test
```

All unit tests will be executed.

### Pre-commit Hooks

Husky has been configured to run a pre-commit hook to ensure tests pass.

## API Reference

### TokenboundClient

The TokenboundClient is instantiated with an object containing at most two parameters:
`chainId` (mandatory)
`walletClient` (optional) OR
`signer` (optional)

Use either a viem `walletClient` [(see walletClient docs)](https://viem.sh/docs/clients/wallet.html) OR an Ethers `signer` [(see signer docs)](https://docs.ethers.org/v5/api/signer/) for transactions that require a user to sign. Note that viem is an SDK dependency, so walletClient is preferable for most use cases. Use of Ethers signer is recommended only for legacy projects.
For easy reference, we've prepared [SDK code examples](https://github.com/tokenbound/sdk/tree/main/examples) for each method.

```ts copy
const tokenboundClient = new TokenboundClient({ walletClient, chainId: 1 })
```

**OR**

```ts copy
const tokenboundClient = new TokenboundClient({ signer, chainId: 1 })
```

| Parameter        |           |
| ---------------- | --------- |
| **walletClient** | optional  |
| **signer**       | optional  |
| **chainId**      | mandatory |

Then use the TokenboundClient to interact with the Tokenbound contracts and Tokenbound accounts:

```ts copy
const tokenboundClient = new TokenboundClient({ signer, chainId: 1 })

const tokenBoundAccount = tokenboundClient.getAccount({
  tokenContract: "<token_contract_address>",
  tokenId: "<token_id>",
})

console.log(tokenBoundAccount) //0x1a2...3b4cd
```

### Custom Account Implementation

It is possible to implement your own custom implementation of an [account](/contracts/account) and make the SDK point to your custom implementation instead of the default implementation.

```javascript
import { TokenboundClient } from "@tokenbound/sdk"

const tokenboundClient = new TokenboundClient({
  signer: "<signer>",
  chainId: "<chainId>",
  implementationAddress: "<custom_implementation_address>",
})

// Custom implementation AND custom registry (uncommon for most implementations)
const tokenboundClientWithCustomRegistry = new TokenboundClient({
  signer: "<signer>",
  chainId: "<chainId>",
  implementationAddress: "<custom_implementation_address>",
  registryAddress: "<custom_registry_address>",
})
```

Read more [here](/guides/custom-accounts)

---

### getAccount

**Returns** the tokenbound account address for a given token contract and token ID.

```typescript
const tokenBoundAccount = tokenboundClient.getAccount({
  tokenContract: "<token_contract_address>",
  tokenId: "<token_id>",
})

console.log(tokenBoundAccount) //0x1a2...3b4cd
```

| Parameter         | Description                        | Type   |
| ----------------- | ---------------------------------- | ------ |
| **tokenContract** | The address of the token contract. | string |
| **tokenId**       | The token ID.                      | string |

---

### prepareCreateAccount

**Returns** the prepared transaction to create a Tokenbound account for a given token contract and token ID.

```typescript
const preparedAccount = await tokenboundClient.prepareCreateAccount({
  tokenContract: "<token_contract_address>",
  tokenId: "<token_id>",
})

console.log(preparedAccount) //0x1a2...3b4cd
```

| Parameter         | Description                        | Type   |
| ----------------- | ---------------------------------- | ------ |
| **tokenContract** | The address of the token contract. | string |
| **tokenId**       | The token ID.                      | string |

---

### createAccount

**Returns** the account address of the tokenbound account created. If an account already exists, the existing account is returned.

```typescript
const account = await tokenboundClient.createAccount({
  tokenContract: "<token_contract_address>",
  tokenId: "<token_id>",
})

console.log(createAccount) //0x1a2...3b4cd
```

| Parameter         | Description                        | Type   |
| ----------------- | ---------------------------------- | ------ |
| **tokenContract** | The address of the token contract. | string |
| **tokenId**       | The token ID.                      | string |

---

### checkAccountDeployment

**Returns** a boolean indicating if a tokenbound account has been deployed at the accountAddress

```ts copy
const SAPIENZ_GOERLI_TOKEN_TBA_TOKENID_0 =
  "0x33D622b211C399912eC0feaaf1caFD01AFA53980" as `0x${string}`

const isAccountDeployed = await tokenboundClient.checkAccountDeployment({
  accountAddress: SAPIENZ_GOERLI_TOKEN_TBA_TOKENID_0,
})

console.log("IS SAPIENZ 0 DEPLOYED?", isAccountDeployed) //...
```

| Parameter          | Description                     | Type   |
| ------------------ | ------------------------------- | ------ |
| **accountAddress** | The Tokenbound account address. | string |

---

### getNFT

Extracts information about the origin NFT that is paired with the Tokenbound account.

**Returns** a Promise that resolves to a **TokenboundAccountNFT** object. The TokenboundAccountNFT object contains the following properties:

- _tokenContract_: The token contract address
- _tokenId_: The token ID
- _chainId_: The chain ID

```ts
const nft = await client.getNFT({
  accountAddress: "<account_address>",
})

const { tokenContract, tokenId, chainId } = nft

console.log({ tokenContract, tokenId, chainId })
```

| Parameter          | Description                     | Type   |
| ------------------ | ------------------------------- | ------ |
| **accountAddress** | The Tokenbound account address. | string |

---

### prepareExecuteCall

**Returns** A Promise with prepared transaction to execute a call on a Tokenbound account. Can be sent via `sendTransaction` on an Ethers signer or via WalletClient.

```typescript
const preparedCall = await tokenboundClient.prepareExecuteCall({
  account: "<account_address>",
  to: "<recipient_address>",
  value: "<wei_value>",
  data: "<data>",
})

console.log(preparedCall) //...
```

| Parameter   | Description                     | Type   |
| ----------- | ------------------------------- | ------ |
| **account** | The Tokenbound account address. | string |
| **to**      | The recipient address.          | string |
| **value**   | The value to send, in wei.      | bigint |
| **data**    | The data to send.               | string |

---

### executeCall

Performs an arbitrary contract call against any contract. This means any onchain action you can perform with your EOA wallet can be done with your NFT's Tokenbound account. You can mint or transfer NFTs, approve contracts, make and vote on DAO proposals, and much more.

**Returns** a hash of the transaction that executed a call using a Tokenbound account.

```ts copy
const executedCall = await tokenboundClient.executeCall({
  account: "<account_address>",
  to: "<recipient_address>",
  value: "<wei_value>",
  data: "<encoded_call_data>",
})

console.log(executedCall) //...
```

| Parameter           | Description                     | Type       |
| ------------------- | ------------------------------- | ---------- |
| **account**         | The Tokenbound account address. | string     |
| **to**              | The recipient address.          | string     |
| **value**           | The value to send, in wei.      | bigint     |
| **data** (optional) | The ABI-encoded call data       | 0x{string} |

Here's a more robust example, where we see how to use your TBA to mint an NFT using Zora's [ERC721Drop contract](https://etherscan.io/address/0x7c74dfe39976dc395529c14e54a597809980e01c#code) by calling the contract's `purchase` function.

```ts copy
// Webb's First Deep Field (unlimited mint drop):
// https://zora.co/collect/eth:0x28ee638f2fcb66b4106acab7efd225aeb2bd7e8d

const zora721 = {
  abi: zora721DropABI,
  proxyContractAddress: getAddress(
    "0x28ee638f2fcb66b4106acab7efd225aeb2bd7e8d"
  ),
  mintPrice: BigInt(0),
  quantity: 2,
  tbaAddress: getAddress("0xc33f0A7FcD69Ba00b4e980463199CD38E30d0E5c"),
}

const encodedMintFunctionData = encodeFunctionData({
  abi: zora721.abi,
  functionName: "purchase",
  args: [BigInt(zora721.quantity)],
})

const mintToTBATxHash = await tokenboundClient.executeCall({
  account: zora721.tbaAddress,
  to: zora721.proxyContractAddress,
  value: zora721.mintPrice * BigInt(zora721.quantity),
  data: encodedMintFunctionData,
})
```

---

### transferNFT

Transfer an NFT to a recipient from a Tokenbound account

**Returns** a Promise that resolves to the transaction hash of the transfer

```typescript
const transferNFT = await tokenboundClient.transferNFT({
  account: "<account_address>",
  tokenType: "ERC721",
  tokenContract: "<nft_contract_address>",
  tokenId: "<nft_token_id>",
  recipientAddress: "<recipient_address>",
})

console.log(transferNFT) //...
```

| Parameter            | Description                       | Type   |
| -------------------- | --------------------------------- | ------ |
| **account**          | The Tokenbound account address.   | string |
| **tokenType**        | Token type: 'ERC721' or 'ERC1155' | string |
| **tokenContract**    | The recipient address.            | string |
| **tokenId**          | The tokenId of the NFT.           | string |
| **recipientAddress** | The recipient address.            | string |

---

### deconstructBytecode

Deconstructs the bytecode of a Tokenbound account into its constituent parts.

**Returns** a Promise that resolves to a **SegmentedERC1155Bytecode** object, or null if the account is not deployed. The **SegmentedERC1155Bytecode** object contains the following properties:

- **_erc1167Header_**: ERC-1167 Header
- **_implementationAddress_**: The ERC-6551 implementation address
- **_erc1167Footer_**: ERC-1167 Footer
- **_salt_**: The salt value
- **_tokenId_**: The token ID
- **_tokenContract_**: The token contract address
- **_chainId_**: The chain ID

```ts
const segmentedBytecode = await client.deconstructBytecode({
  accountAddress: "<account_address>",
})

console.log(segmentedBytecode)
```

| Parameter          | Description                     | Type   |
| ------------------ | ------------------------------- | ------ |
| **accountAddress** | The Tokenbound account address. | string |
