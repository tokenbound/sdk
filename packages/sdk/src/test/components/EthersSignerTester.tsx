import React from 'react'
import { TokenboundClient } from '@tokenbound/sdk'
import { foundry } from 'viem/chains'
import { TxTests } from './TxTests'
// import { ethers } from 'ethers'

import { useEthersSigner } from '../hooks/useEthersSigner'

// const provider = new ethers.providers.JsonRpcProvider(
//   process.env.ANVIL_MAINNET_FORK_ENDPOINT
// )
// const signer = provider.getSigner()

export function EthersSignerTester() {
  const signer = useEthersSigner({ chainId: foundry.id })
  const tokenboundClient = signer
    ? new TokenboundClient({ signer, chainId: foundry.id })
    : undefined
  return <TxTests tokenboundClient={tokenboundClient} />
}
