# @tokenbound/sdk

A viem-first SDK for interacting with [ERC-6551 accounts](https://eips.ethereum.org/EIPS/eip-6551).

Ethers v5 / v6 users want [`@tokenbound/ethers`](https://github.com/tokenbound/sdk/tree/main/packages/ethers), which adapts this package to an ethers `Signer`.

## Installation

```bash
npm install @tokenbound/sdk viem
```

<details>
<summary>pnpm / yarn / bun</summary>

```bash
pnpm add @tokenbound/sdk viem
```

```bash
yarn add @tokenbound/sdk viem
```

```bash
bun add @tokenbound/sdk viem
```

</details>

`viem` is a peer dependency.

## Usage

There are two equivalent APIs. Both run the same protocol code, so pick whichever fits your codebase.

### The viem client extension (recommended)

Decorates a viem client, namespacing everything under `.tokenbound`:

```ts
import { createWalletClient, custom } from "viem"
import { mainnet } from "viem/chains"
import { tokenboundActions } from "@tokenbound/sdk/viem"

const client = createWalletClient({
  chain: mainnet,
  account,
  transport: custom(window.ethereum),
}).extend(tokenboundActions())

const account = client.tokenbound.getAccount({ tokenContract, tokenId })
await client.tokenbound.createAccount({ tokenContract, tokenId })
```

A client without an account gets only the read actions; one carrying an account gets the full set.

### The TokenboundClient class

```ts
import { TokenboundClient } from "@tokenbound/sdk"
import { mainnet } from "viem/chains"

const tokenboundClient = new TokenboundClient({ walletClient, chain: mainnet })

const tokenboundAccount = tokenboundClient.getAccount({
  tokenContract: "<token_contract_address>",
  tokenId: "<token_id>",
})
```

`chain` is required — pass a viem `Chain`, not a chain id.

### Encode a call to an account

```ts
const preparedCall = await tokenboundClient.prepareExecution({
  account: "<account_address>",
  to: "<recipient_address>",
  value: 0n,
  data: "0x",
})

const hash = await walletClient.sendTransaction(preparedCall)
```

### Custom implementations

The SDK supports custom ERC-6551 implementations:

```ts
const tokenboundClient = new TokenboundClient({
  walletClient,
  chain: mainnet,
  implementationAddress: "<custom_implementation_address>",
})

// Custom implementation AND custom registry (uncommon)
const withCustomRegistry = new TokenboundClient({
  walletClient,
  chain: mainnet,
  implementationAddress: "<custom_implementation_address>",
  registryAddress: "<custom_registry_address>",
})
```

The same options are accepted by the client extension:

```ts
.extend(tokenboundActions({ implementationAddress, registryAddress }))
```

## Documentation

See the [Tokenbound docs](https://docs.tokenbound.org/sdk/installation) for complete documentation, and the [repository README](https://github.com/tokenbound/sdk#readme) for the full method reference.
