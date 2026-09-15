# @tokenbound/ethers

Ethers v5 / v6 compatibility layer for the [Tokenbound](https://tokenbound.org) ERC-6551 SDK.

`@tokenbound/sdk` is viem-first. This package adapts it to idiomatic ethers
`Signer` objects, so ethers apps keep working without pulling ethers into the
dependency graph of viem consumers.

```text
@tokenbound/ethers
        ↓
   @tokenbound/sdk
```

All ERC-6551 protocol logic (address derivation, calldata encoding, bytecode
deconstruction) is reused from `@tokenbound/sdk` — nothing is reimplemented here.

## Installation

```bash
npm install @tokenbound/ethers ethers
```

`ethers` and `viem` are peer dependencies. Both ethers v5 and v6 are supported;
the version in use is detected automatically.

## Usage

The API mirrors `@tokenbound/sdk`'s `TokenboundClient`, so migrating from
`@tokenbound/sdk` means changing the import and passing a `chain`:

```ts
import { TokenboundClient } from "@tokenbound/ethers"
import { mainnet } from "viem/chains"

const tokenboundClient = new TokenboundClient({
  signer,        // an ethers v5 or v6 Signer
  chain: mainnet,
})

const account = tokenboundClient.getAccount({
  tokenContract: "0x…",
  tokenId: "1",
})

const { txHash } = await tokenboundClient.createAccount({
  tokenContract: "0x…",
  tokenId: "1",
})

await tokenboundClient.transferETH({
  account,
  recipientAddress: "0x…",
  amount: 0.1,
})
```

### Supported methods

`getAccount`, `prepareCreateAccount`, `createAccount`, `prepareExecution`,
`execute`, `prepareExecuteCall` / `executeCall` (legacy V2), `isValidSigner`,
`checkAccountDeployment`, `deconstructBytecode`, `getNFT`, `transferNFT`,
`transferETH`, `transferERC20`, `signMessage`.

### Legacy V2 deployments

Pin the legacy ERC-6551 V2 deployment with `version`, or point at a custom
deployment with `implementationAddress` / `registryAddress`:

```ts
import { TokenboundClient } from "@tokenbound/ethers"
import { TBVersion } from "@tokenbound/sdk"

const tokenboundClient = new TokenboundClient({
  signer,
  chain: mainnet,
  version: TBVersion.V2,
})
```

On a V2 deployment, `prepareExecution()`/`execute()` fall back to the legacy
`prepareExecuteCall()`/`executeCall()` encoding, and `isValidSigner()` throws —
matching `@tokenbound/sdk`. Both ERC-6551 V2 and V3 are tested against ethers v5
and v6.

### Version detection

```ts
tokenboundClient.getEthersVersion() // 5 | 6
```

Detection happens once, at construction. Message normalization differs between
majors (v6 rejects `ArrayLike<number>`, v5 accepts it) and is handled internally.

## Limitations

- **Cross-chain execution** is not supported through the ethers adapter. Use
  `@tokenbound/sdk` with a viem client for cross-chain calls.
- `chain` is required — passing only `chainId` is no longer supported, because
  mapping a chain id to a `Chain` forced every viem chain into consumer bundles.

See [MIGRATION.md](../../MIGRATION.md) for full migration notes.
