import React, { useCallback, useState } from 'react'
import { TokenboundClient } from '@tokenbound/sdk'

import { useHasMounted } from '../hooks'
import { TesterType } from '../types'

interface TestTxExecuteCallProps {
  address: `0x${string}`
  tokenboundClient: TokenboundClient
  tester: TesterType
}

export function TestTxExecuteCall({
  address,
  tokenboundClient, // tester,
}: TestTxExecuteCallProps) {
  const hasMounted = useHasMounted()

  const [executedCallAddress, setExecutedCallAddress] = useState<`0x${string}` | null>()

  const executeCall = useCallback(async () => {
    if (!tokenboundClient || !address) return
    const executedCall = await tokenboundClient.executeCall({
      account: address,
      to: address,
      value: 0n,
      data: '0x',
    })
    executedCall && setExecutedCallAddress(executedCall)
  }, [tokenboundClient])

  if (!hasMounted) return null

  return (
    <>
      {address && (
        <>
          {tokenboundClient && (
            <button
              id="tb-execute-call-button"
              data-testid="tb-execute-call-button"
              onClick={() => executeCall()}
            >
              Execute Call
            </button>
          )}
          {/* OUTPUT WHEN CALL HAS BEEN SUCCESSFULLY EXECUTED BY TOKENBOUND ACCOUNT */}
          {executedCallAddress && (
            <span id="tb-executed-call" data-testid="tb-executed-call">
              {executedCallAddress}
            </span>
          )}
        </>
      )}
    </>
  )
}
