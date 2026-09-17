# Migration Guide

This release makes `@tokenbound/sdk` **viem-first** and moves all ethers v5/v6
support into a new `@tokenbound/ethers` package.

```text
before                          after
──────                          ─────
@tokenbound/sdk + viem     →    @tokenbound/sdk
@tokenbound/sdk + ethers5  →    @tokenbound/ethers
@tokenbound/sdk + ethers6  →    @tokenbound/ethers
```

`@tokenbound/sdk` no longer has ethers anywhere in its dependency graph, and no
longer imports every chain from `viem/chains`.

---

## Summary of breaking changes

| # | Change | Who is affected |
|---|--------|-----------------|
| 1 | `signer` option removed from `@tokenbound/sdk` | ethers users |
| 2 | `chain` is now **required**; the constructor `chainId` option is removed | everyone |
| 3 | Ethers message types removed from the SDK's public types | ethers users |
| 4 | `signMessage` accepts only viem's `SignableMessage` | viem users passing raw bytes |
| 5 | Cross-chain `execute` is viem-only | ethers users using cross-chain |
| 6 | Package entry points changed (`dist/index.js`, subpath exports) | deep-importers |

Everything else — method names, parameter shapes, return values — is unchanged.

---

## 1. Current `@tokenbound/sdk` + viem → new `@tokenbound/sdk`

### The class API still works

```diff
  import { TokenboundClient } from "@tokenbound/sdk"
+ import { mainnet } from "viem/chains"

  const tokenboundClient = new TokenboundClient({
    walletClient,
-   chainId: 1,
+   chain: mainnet,
  })
```

`chain` is now required. Previously the SDK mapped a bare `chainId` to a viem
`Chain` via an internal lookup table that eagerly imported **17 chains** from
`viem/chains` — that table is gone, and with it a significant chunk of every
consumer bundle. Import the chain you need and pass it in.

The constructor-level `chainId` option is gone too. It previously let you
override the chain id used for derivation independently of the client's chain;
now the chain id always comes from `chain`. Per-method `chainId` parameters are
unchanged — `getAccount({ …, chainId })` still derives an account for another
chain, and `execute({ …, chainId })` still targets a cross-chain destination:

```diff
  const tokenboundClient = new TokenboundClient({
    walletClient,
    chain: mainnet,
-   chainId: 8453,   // no longer accepted
  })

  // still supported — derive for a different chain:
  tokenboundClient.getAccount({ tokenContract, tokenId, chainId: 8453 })
```

If you only have a numeric chain id at runtime, map it yourself:

```ts
import * as chains from "viem/chains"

const chain = Object.values(chains).find((c) => c.id === myChainId)
```

### New: the viem `.extend()` API (recommended)

```ts
import { createWalletClient, custom } from "viem"
import { mainnet } from "viem/chains"
import { tokenboundActions } from "@tokenbound/sdk/viem"

const client = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum),
  account,
}).extend(tokenboundActions())

const account = client.tokenbound.getAccount({ tokenContract, tokenId })
await client.tokenbound.createAccount({ tokenContract, tokenId })
await client.tokenbound.execute({ account, to, value, data })
```

Everything is namespaced under `.tokenbound` so it can't collide with viem's own
actions or other decorators. Public clients are typed with the read-only subset
(no `execute`, `createAccount`, …); clients carrying an account get the full set.

`tokenboundActions()` optionally pins a deployment:

```ts
.extend(tokenboundActions({ version: TBVersion.V2 }))
.extend(tokenboundActions({ implementationAddress, registryAddress }))
```

### `signMessage` is stricter

`signMessage` now accepts only viem's `SignableMessage` (`string | { raw }`).
Passing a bare `Uint8Array` or `ArrayLike<number>` was already a runtime error;
it is now also a compile error.

```diff
- tokenboundClient.signMessage({ message: new Uint8Array([1, 2, 3]) })
+ tokenboundClient.signMessage({ message: { raw: new Uint8Array([1, 2, 3]) } })
```

---

## 2. Current `@tokenbound/sdk` + ethers v5 → `@tokenbound/ethers`

```bash
npm install @tokenbound/ethers
```

<details>
<summary>pnpm / yarn / bun</summary>

```bash
pnpm add @tokenbound/ethers
```

```bash
yarn add @tokenbound/ethers
```

```bash
bun add @tokenbound/ethers
```

</details>

```diff
- import { TokenboundClient } from "@tokenbound/sdk"
+ import { TokenboundClient } from "@tokenbound/ethers"
+ import { mainnet } from "viem/chains"

  const tokenboundClient = new TokenboundClient({
    signer,
-   chainId: 1,
+   chain: mainnet,
  })
```

That is the whole migration. Method names, parameters and return values are
unchanged, and ethers v5 `Signer` objects are accepted exactly as before.

---

## 3. Current `@tokenbound/sdk` + ethers v6 → `@tokenbound/ethers`

Identical to the v5 migration — the same import change and the same `chain`
requirement. The package detects which ethers major version your signer comes
from and adapts automatically:

```ts
tokenboundClient.getEthersVersion() // 5 | 6
```

You do **not** need to migrate from ethers v5 to v6. Both are supported and
tested independently.

---

## 4. Removed from `@tokenbound/sdk`'s public API

These moved to `@tokenbound/ethers` or were deleted:

| Removed | Replacement |
|---------|-------------|
| `TokenboundClientOptions.signer` | `@tokenbound/ethers`'s `TokenboundClient` |
| `AbstractEthersSigner` | internal to `@tokenbound/ethers` |
| `AbstractEthersTransactionResponse` | internal to `@tokenbound/ethers` |
| `EthersSignableMessage` | `EthersSignableMessage` from `@tokenbound/ethers` |
| `Ethers5SignableMessage` / `Ethers6SignableMessage` | same, from `@tokenbound/ethers` |
| `UniversalSignableMessage` | viem's `SignableMessage` |
| `isEthers5SignableMessage` / `isEthers6SignableMessage` | internal to `@tokenbound/ethers` |
| `normalizeMessage` | internal to `@tokenbound/ethers` |
| `chainIdToChain` | pass a viem `Chain` directly |
| `TokenboundClientOptions.chainId` | pass `chain`; use per-method `chainId` for cross-chain |

## 4b. `@tokenbound/ethers` reads use your signer's Provider

`publicClient` and `publicClientRPCUrl` are no longer accepted by
`@tokenbound/ethers`. Reads now go through the Provider the signer is already
connected to, which removes a second RPC stack from ethers consumers' bundles
(~169 kB → ~32 kB gzipped).

```diff
  const tokenboundClient = new TokenboundClient({
    signer,
    chain: mainnet,
-   publicClient,          // no longer accepted
  })
```

Your signer must be connected to a Provider. `new Wallet(pk)` can sign but not
read; use `new Wallet(pk, provider)` or `signer.connect(provider)`. Read calls
on an unconnected signer throw a clear error.

`@tokenbound/sdk` is unaffected — it still takes `publicClient`/`publicClientRPCUrl`.

## 5. Cross-chain execution

Cross-chain `execute` requires a viem public client for LayerZero fee quoting
and is therefore **viem-only**. Calling it through `@tokenbound/ethers` throws a
clear error. Same-chain execution is unaffected.

---

## 6. New entry points

```text
@tokenbound/sdk            the TokenboundClient class + protocol utilities
@tokenbound/sdk/viem       tokenboundActions() and the standalone viem actions
@tokenbound/sdk/protocol   library-independent encoding/derivation only
@tokenbound/ethers         ethers v5/v6 TokenboundClient
```

`@tokenbound/sdk/protocol` has no client dependency at all — it operates purely
on `Address`, `Hex`, `bigint`, chain ids and ABIs, and is what both the viem core
and `@tokenbound/ethers` build on. Use it if you only need deterministic address
derivation or calldata encoding:

```ts
import { getAccountAddress, resolveDeployment } from "@tokenbound/sdk/protocol"

const account = getAccountAddress(
  { tokenContract, tokenId, chainId: 1 },
  resolveDeployment({}),
)
```

Built output filenames changed (`dist/tokenbound-sdk.js` → `dist/index.js`).
This only matters if you were deep-importing build artifacts rather than using
the package entry points.

---

## Bundle size

Dropping the eager `viem/chains` import, relocating the ERC-6551 ABIs out of the
test tree, and splitting entry points cut the published bundle substantially:

| | before | after |
|---|--------|-------|
| main bundle | 251.7 kB | 15.9 kB |
| main bundle (gzip) | 74.5 kB | 3.8 kB |
| published tarball | 226.2 kB | 80.0 kB |
| unpacked | 1.2 MB | 496 kB |

The old build also shipped a 668 kB `stats.html` bundle-analysis artifact inside
`dist/`. Analysis is now opt-in (`ANALYZE=true pnpm build`) and writes outside
the published directory.
