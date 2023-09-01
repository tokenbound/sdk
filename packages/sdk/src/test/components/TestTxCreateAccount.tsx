import React, { useCallback, useState } from 'react'
import { TokenboundClient } from '@tokenbound/sdk'

import { useHasMounted } from '../hooks'

import { TesterType } from '../types'

interface TestTxExecuteCallProps {
  address: `0x${string}`
  tokenboundClient: TokenboundClient
  tester: TesterType
}

export function TestTxCreateAccount({
  address,
  tokenboundClient, // tester,
}: TestTxExecuteCallProps) {
  const hasMounted = useHasMounted()
  // const { data: walletClient } = useWalletClient({ chainId: 1 })

  const [tokenboundAccountAddress, setTokenboundAccountAddress] = useState<
    `0x${string}` | null
  >()

  const createAccount = useCallback(async () => {
    if (!tokenboundClient || !address) return
    const accountAddress = await tokenboundClient.createAccount({
      tokenContract: '0x4b10701bfd7bfedc47d50562b76b436fbb5bdb3b', // BJ's Lil' Noun
      tokenId: '606',
    })
    accountAddress && setTokenboundAccountAddress(accountAddress)
  }, [tokenboundClient])

  if (!hasMounted) return null

  return (
    <>
      {address && (
        <>
          {tokenboundClient && (
            <button
              id="tb-create-account-button"
              data-testid="tb-create-account-button"
              onClick={() => createAccount()}
            >
              Create Account
            </button>
          )}
          {/* OUTPUT WHEN TOKENBOUND ADDRESS HAS BEEN CREATED */}
          {tokenboundAccountAddress && (
            <span id="tb-account-created" data-testid="tb-account-created">
              {tokenboundAccountAddress}
            </span>
          )}
        </>
      )}
    </>
  )
}
