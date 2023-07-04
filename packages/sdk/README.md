# @tokenbound/sdk

An SDK for interacting with [ERC-6551 accounts](https://eips.ethereum.org/EIPS/eip-6551) using viem.

# Installation

```bash
$ npm install @tokenbound/sdk
```

# Usage

### Instantiate TokenboundClient

Using viem's WalletClient:

```javascript
import { TokenboundClient } from "@tokenbound/sdk";
const tokenboundClient = new TokenboundClient({ walletClient, chainId: 1 });
```

or, with a legacy Wagmi / Ethers signer:

```javascript
import { TokenboundClient } from "@tokenbound/sdk";
const tokenboundClient = new TokenboundClient({ signer, chainId: 1 });
```

### Get account address

```javascript
import { TokenboundClient } from "@tokenbound/sdk";
const tokenboundClient = new TokenboundClient({ walletClient, chainId: 1 });

const tokenBoundAccount = tokenboundClient.getAccount({
  tokenContract: "<token_contract_address>",
  tokenId: "<token_id>",
});
```

### Encode call to account

```javascript
import { prepareExecuteCall } from "@tokenbound/sdk";

const to = "0xe7134a029cd2fd55f678d6809e64d0b6a0caddcb"; // any address
const value = 0n; // amount of ETH to send in WEI
const data = ""; // calldata

const preparedCall = await tokenboundClient.prepareExecuteCall({
  account: "<account_address>",
  to: "<recipient_address>",
  value: value,
  data: data,
});

// Execute encoded call
const hash = await walletClient.sendTransaction(preparedCall);
```

### Custom Implementations

The SDK supports custom 6551 implementations.

If you've deployed your own implementation, you can optionally pass the custom configuration when instantiating your TokenboundClient:

```javascript
import { TokenboundClient, Custom6551Implementation } from "@tokenbound/sdk";

const CUSTOM_6551_IMPLEMENTATION: Custom6551Implementation = {
  implementationAddress: "<custom_implementation_address>",
  registryAddress: "<custom_registry_address>",
};

const tokenboundClient = new TokenboundClient({
    signer: <signer>,
    chainId: <chainId>,
    customImplementation: CUSTOM_6551_IMPLEMENTATION
})
```