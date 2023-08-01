import React from 'react'
import { useWalletClient } from 'wagmi'
import { TokenboundClient } from '@tokenbound/sdk'
import { foundry } from 'viem/chains'
import { TxTests } from './TxTests'

export function WalletClientTester() {
  const { data: walletClient } = useWalletClient({ chainId: foundry.id })
  const tokenboundClient = walletClient
    ? new TokenboundClient({ walletClient, chainId: foundry.id })
    : undefined

  return <TxTests tokenboundClient={tokenboundClient} />
}
