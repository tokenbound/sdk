---
"@tokenbound/sdk": major
"@tokenbound/ethers": minor
---

Make `@tokenbound/sdk` viem-first and move ethers v5/v6 support into a new
`@tokenbound/ethers` package.

**`@tokenbound/sdk`**

- Removed the `signer` option and all ethers-specific types, utilities and
  runtime branches. The SDK no longer has ethers anywhere in its dependency
  graph.
- Added an idiomatic viem client decorator: `.extend(tokenboundActions())`
  exposes the API under `client.tokenbound.*`, with write actions typed only for
  clients that carry an account.
- Extracted a library-independent protocol layer (`@tokenbound/sdk/protocol`)
  that operates on `Address`/`Hex`/`bigint`/chain ids/ABIs, shared by the viem
  core and `@tokenbound/ethers`.
- **Breaking:** `chain` is now required; passing only `chainId` is no longer
  supported. The internal `chainIdToChain` lookup eagerly imported 17 chains
  from `viem/chains` into every consumer bundle.
- **Breaking:** the constructor `chainId` option is removed; the chain id now
  always comes from `chain`. Per-method `chainId` params (cross-chain execution,
  deriving an account for another chain) are unchanged.
- **Breaking:** `signMessage` accepts only viem's `SignableMessage`.
- Added `./viem` and `./protocol` subpath exports and `"sideEffects": false`.
- Relocated the ERC-6551 ABIs out of the test tree, so generated test fixtures
  (Zora, WETH) no longer end up in the published bundle.
- Bundle: 251.7 kB → 15.9 kB (74.5 kB → 3.8 kB gzipped). Published tarball:
  226.2 kB → ~80 kB. Bundle analysis is now opt-in (`ANALYZE=true pnpm build`)
  and no longer writes a 668 kB `stats.html` into `dist/`.

**`@tokenbound/ethers`** (new)

- Ethers v5 and v6 compatibility, detected automatically at construction.
- Same public API as the SDK's `TokenboundClient`, so ethers users migrate by
  changing the import and passing a `chain`.
- Reuses all ERC-6551 protocol logic from `@tokenbound/sdk`; no duplication.

**Examples**

- Updated the viem example to the `.extend(tokenboundActions())` API, and
  repointed the ethers examples at `@tokenbound/ethers`.
- Bumped the examples to Vite 5. Vite 4 bundles esbuild 0.18, which cannot parse
  the import attributes (`with { type: "json" }`) used by `@base-org/account` via
  wagmi's connectors, so `vite dev` failed to start.

**Packaging / tooling**

- Added `description`, `keywords`, `repository`, `homepage` and `bugs` to both
  packages — none were previously set, so npm had no linked source or issues.
- Dropped unused React/testing-library devDependencies from `@tokenbound/sdk`
  (no React components or DOM tests remain) and removed the dead jest-dom test
  setup file.
- Switched `moduleResolution` from the deprecated `Node` (node10, removed in
  TypeScript 7) to `Bundler`, which also resolves the package `exports` map.

See `MIGRATION.md` for full migration notes.
