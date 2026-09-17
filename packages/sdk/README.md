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

`tokenboundActions()` is a standard viem decorator. Pass it to `.extend()` and every
Tokenbound method appears under a single `.tokenbound` namespace — so it can never
collide with viem's own actions, or with other decorators you're already using.

```ts
import { createWalletClient, custom } from "viem"
import { mainnet } from "viem/chains"
import { tokenboundActions } from "@tokenbound/sdk/viem"

const client = createWalletClient({
  chain: mainnet,
  account: "0x...",
  transport: custom(window.ethereum),
}).extend(tokenboundActions())
```

Everything hangs off `client.tokenbound`, and the underlying viem client is untouched —
you keep using it exactly as before:

```ts
// viem's own actions — still right there
const addresses = await client.getAddresses()

// Tokenbound's, namespaced
const account = client.tokenbound.getAccount({
  tokenContract: "0x...",
  tokenId: "1",
})
```

#### Reading

Read methods work on any client, including a `PublicClient` with no account.
`getAccount` is pure derivation — it does no network call and returns the address
whether or not the account has been deployed yet:

```ts
const account = client.tokenbound.getAccount({ tokenContract, tokenId })

// Has this particular account been deployed?
const isDeployed = await client.tokenbound.checkAccountDeployment({
  accountAddress: account,
})

// Which NFT controls it?
const { tokenContract, tokenId, chainId } = await client.tokenbound.getNFT({
  accountAddress: account,
})

// Is ERC-6551 itself available on this chain?
const status = await client.tokenbound.checkProtocolDeployment()
if (!status.isFullyDeployed) {
  console.log(`Deploy the missing contracts at ${status.deployerUrl}`)
}
```

`checkProtocolDeployment` reports the registry and the account implementation separately,
because a chain can have one without the other. Gnosis is a live example — the ERC-6551
registry is deployed there, but the Tokenbound account implementation is not:

| Contract | Address on Gnosis | |
| --- | --- | --- |
| Registry | [`0x0000…5758`](https://gnosisscan.io/address/0x000000006551c19487814612e58FE06813775758) | deployed (`ERC6551Registry`) |
| Account implementation | [`0x5526…6E7F`](https://gnosisscan.io/address/0x55266d75D1a14E4572138116aF39863Ed6596E7F) | no bytecode |

So on Gnosis you get `{ registry: true, implementation: false, isFullyDeployed: false }`
along with a `deployerUrl` — enough to tell a user precisely what is missing, rather than
just that something is.

#### Writing

Write methods need a client that can sign:

```ts
const { account, txHash } = await client.tokenbound.createAccount({
  tokenContract,
  tokenId,
})

await client.tokenbound.transferETH({
  account,
  recipientAddress: "0x...",
  amount: 0.01,
})

await client.tokenbound.transferNFT({
  account,
  tokenType: "ERC721",
  tokenContract: "0x...",
  tokenId: "1",
  recipientAddress: "vitalik.eth", // ENS names are resolved for you
})

await client.tokenbound.execute({
  account,
  to: "0x...",
  value: 0n,
  data: "0x",
})
```

#### The read/write split is enforced by types

A client carrying an account gets the full surface. A client without one — a
`PublicClient` — is typed with the read-only subset, so reaching for a write method
is a compile-time error rather than a runtime failure:

```ts
const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
}).extend(tokenboundActions())

publicClient.tokenbound.getAccount({ tokenContract, tokenId }) // ✅
publicClient.tokenbound.createAccount({ tokenContract, tokenId })
// ❌ Property 'createAccount' does not exist on type 'TokenboundPublicActions'
```

#### Available methods

| Any client | Requires an account |
| --- | --- |
| `getAccount` | `createAccount` |
| `prepareCreateAccount` | `execute` |
| `prepareExecution` | `transferNFT` |
| `checkAccountDeployment` | `transferETH` |
| `checkProtocolDeployment` | `transferERC20` |
| `deconstructBytecode` | `signMessage` |
| `getNFT` | |
| `isValidSigner` | |

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
