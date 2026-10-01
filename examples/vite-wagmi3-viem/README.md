# vite-wagmi3-viem

`@tokenbound/sdk` with viem's `.extend(tokenboundActions())` API, on **wagmi 3**.

The difference from [`vite-wagmi-viem`](../vite-wagmi-viem) is the wallet
connection layer, not the SDK: this app uses wagmi's own `useConnect` hook with
an explicit connector list instead of a connect-modal library. RainbowKit and
ConnectKit currently cap at wagmi 2, so dropping them is what allows wagmi 3
here.

The SDK only needs a connected account, so either approach works.

## Setup

```bash
pnpm install
cp .env.example .env   # optional: add a WalletConnect project id
pnpm dev
```

`VITE_WALLETCONNECT_PROJECT_ID` is optional — without it the app still runs,
just without mobile-wallet support. Get one at https://cloud.reown.com.
