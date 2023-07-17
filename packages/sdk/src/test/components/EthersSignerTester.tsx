import React from 'react'
import { TokenboundClient } from '@tokenbound/sdk'
import { foundry } from 'viem/chains'
import { TxTests } from './TxTests'

import { useEthersSigner } from '../hooks/useEthersSigner'

export function EthersSignerTester() {
  const signer = useEthersSigner({ chainId: foundry.id })
  const tokenboundClient = signer
    ? new TokenboundClient({ signer, chainId: foundry.id })
    : undefined

  return <TxTests tokenboundClient={tokenboundClient} />
}
