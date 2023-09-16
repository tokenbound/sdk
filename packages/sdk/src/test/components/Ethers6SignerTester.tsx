import React from 'react'
import { TokenboundClient } from '@tokenbound/sdk'
import { foundry } from 'viem/chains'
import { TxTests } from './TxTests'

import { useEthers6Signer } from '../hooks/useEthers6Signer'

export function Ethers6SignerTester() {
  const signer = useEthers6Signer({ chainId: foundry.id })
  const tokenboundClient = signer
    ? new TokenboundClient({ signer, chainId: foundry.id })
    : undefined

  return <TxTests tokenboundClient={tokenboundClient} tester="ETHERS_6" />
}
