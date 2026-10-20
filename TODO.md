# TODO

Open work and open questions for the viem-first SDK (`@tokenbound/sdk`) and the
new `@tokenbound/ethers` package. Delete items as they land.

## Before the next release

- **Remove `@layerzerolabs/lz-v2-utilities`.** The SDK uses it for one value:
  `Options.newOptions().addExecutorLzReceiveOption(200000, 0).toHex()` in
  `packages/sdk/src/protocol/functions/crossChain.ts`. That value never changes:
  `0x00030100110100000000000000000000000000030d40`. The package pulls about 30
  `@ethersproject/*` packages into every SDK install. Replace the call with the
  constant.
- **Make the CI "no ethers" check catch `@ethersproject`.** It only searches for
  `ethers@`, which is why it missed the item above.
- **Add a license.** No package has a `license` field and the repo has no
  LICENSE file, so no published version has ever had one. The root
  `package.json` says `ISC`, which looks like an `npm init` default rather than
  a decision.
- **Update `.changeset/viem-first-sdk.md`.** It becomes the release notes and is
  now out of date:
  - It says the SDK has no ethers in its dependency graph. That's false until
    the LayerZero item above lands.
  - It gives the tarball as "~80 kB". It is now 52.9 kB.
  - It doesn't say viem is now a peer dependency. That's breaking: users must
    install viem themselves.
  - It doesn't mention the separate CommonJS types or the tsdown build. The
    ethers build output is now `dist/index.{js,cjs}`.
- **Give CI a Base RPC endpoint.** The end-to-end delivery tests fork Base:
  `crossChainDelivery.test.ts` in the SDK, and `TestCrossChainDelivery.test.ts`
  in ethers, once per ethers version. That's three Base forks per CI run, and
  CI only passes `VITE_ANVIL_MAINNET_FORK_ENDPOINT`, so all three use the
  public `https://mainnet.base.org`. Add a `VITE_ANVIL_BASE_FORK_ENDPOINT`
  secret before it gets rate-limited.

## Open questions

- **Executor gas is hardcoded at 200,000.** Every cross-chain call asks
  LayerZero for 200k gas on the destination. A plain ETH transfer uses about
  122k. Heavier calls (a swap, a mint) would run out of gas on the destination
  after the origin fee is already paid. Should `gasLimit` be a parameter, with
  200k as the default?
- **What to prove about cross-chain delivery.** The end-to-end tests simulate
  LayerZero's relay, so it can't catch a missing or broken DVN configuration on
  a route. One option: read each route's ULN config from the forks and assert
  that DVNs are set.
- **ESM-only.** Dropping CJS would remove the `.d.cts` output and the risk of
  loading two copies of the SDK in one app. Node 22's `require(esm)` makes this
  more reasonable, but it's still breaking for CJS users on older Node.
- **viem peer range.** The range is `^2.57.7` only because that's the one
  version we've tested. npm 7+ fails the install on a peer conflict, so users on
  older viem 2.x are blocked. Test an older version (say 2.21) and widen the
  range if it passes.
- **Release process.**
  - Releases are a manual GitHub release, with no changesets action.
  - `@tokenbound/ethers` depends on `@tokenbound/sdk` through `workspace:^`.
    Under 0.x that becomes `^0.5.x`, so a breaking SDK release that doesn't
    also release ethers leaves ethers users stuck. Consider changesets
    `fixed`/`linked` groups, and a `beta` pre-release channel for this
    refactor.
- **npm trusted publishing.** Releases now get provenance, but publishing still
  uses the long-lived `NPM_ACCESS_TOKEN`. Trusted publishing (OIDC) removes the
  token. It needs npm 11.5+ in CI and a one-time setup on npmjs.com.

## Later

- **Convert the V2 JSON ABIs to `as const` TypeScript.** They are
  `ERC6551RegistryV2.json` and `IERC6551AccountV2.json`. This gives typed ABIs,
  removes tsdown's CommonJS-declaration warning, and stops tsdown pretty-printing
  them (about 6 kB of the tarball).
- **Remove the `as unknown as` casts in the viem actions.** Constraining the
  generic as `client extends Client` removes them.
- **Upgrade tooling.** vitest 1 → 3+ (with vite 6+), husky 8 → 9, and
  `@vitest/coverage-v8` to match.
- **Run `publint` in CI** next to `validate-package-contents.mjs`.
  `@arethetypeswrong/cli` (0.17 and 0.18) currently crashes on these tarballs.
- **Typecheck the example apps in CI**, so a breaking SDK change shows up there.
- **Add an `engines` field** to the published packages, e.g. `node >=18`. Node
  22 is only needed for the tests and doesn't belong there.
- **Report the viem receipt-polling stall upstream.** The fork tests poll
  `getTransactionReceipt`, because `waitForTransactionReceipt` stalls against
  anvil.
