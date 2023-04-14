# @tokenbound/sdk-ethers

An SDK for interacting with [ERC-6551 accounts](https://eips.ethereum.org/EIPS/eip-6551) using ethers.

# Installation

```bash
$ npm install @tokenbound/sdk
```

# Usage

### Get account address

```javascript
import { getAccount } from "@tokenbound/sdk-ethers";
const accountAddress = await getAccount(
  "0xe7134a029cd2fd55f678d6809e64d0b6a0caddcb", // ERC-721 token contract
  "9", // ERC-721 tokenId
  provider // ethers provider
);
```

### Encode call to account

```javascript
import { prepareExecuteCall } from "@tokenbound/sdk-ethers";

const to = "0xe7134a029cd2fd55f678d6809e64d0b6a0caddcb"; // any address
const value = 0; // amount of ETH to send
const data = "0x"; // calldata

const transactionData = await prepareExecuteCall(
  accountAddress,
  to,
  value,
  data
);

// Execute encoded call
const { hash } = await signer.sendTransaction(transactionData);
```
