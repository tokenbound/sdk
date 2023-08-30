import React, { useCallback, useState } from 'react'
import {
  useAccount,
  useConnect,
  useDisconnect,
  // usePrepareContractWrite,
  // useContractWrite,
  // useWaitForTransaction,
} from 'wagmi'
import { TokenboundClient } from '@tokenbound/sdk'
import { useHasMounted } from '../hooks'

// import {
//   // usePrepareZora1155Mint,
//   // useZora1155Mint,
//   zora1155ABI, // Individual implementations of the 1155 contract are proxied, so we
// } from '../wagmi-cli-hooks/generated'
// import { encodeAbiParameters, getAddress, parseAbiParameters, parseUnits } from 'viem'
import { TestTxMintThenTransfer } from './TestTxMintThenTransfer'
import { TesterType } from '../types'
import { TestTxExecuteCall } from './TestTxExecuteCall'
import { TestTxCreateAccount } from './TestTxCreateAccount'

export function TxTests({
  tokenboundClient,
  tester,
}: {
  tokenboundClient?: TokenboundClient
  tester: TesterType
}) {
  const { address, connector, isConnected } = useAccount()
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect()
  const { disconnect } = useDisconnect()
  const isReady = !!address && !!tokenboundClient
  const hasMounted = useHasMounted()

  if (!hasMounted) return null

  return (
    <div>
      <div>
        {isConnected && (
          <>
            <div>{address}</div>
            <button
              id="disconnect-button"
              data-testid="disconnect-button"
              onClick={() => disconnect()}
            >
              Disconnect from {connector?.name}
            </button>

            {isReady && (
              <>
                <TestTxCreateAccount
                  tokenboundClient={tokenboundClient}
                  address={address}
                  tester={tester}
                />
                <TestTxExecuteCall
                  tokenboundClient={tokenboundClient}
                  address={address}
                  tester={tester}
                />
                <TestTxMintThenTransfer address={address} tester={tester} />
              </>
            )}
          </>
        )}

        {connectors
          .filter((x) => x.ready && x.id !== connector?.id)
          .map((x) => (
            <button
              id="connect-button"
              data-testid="connect-button"
              key={x.id}
              onClick={() => connect({ connector: x })}
            >
              {isLoading && x.id === pendingConnector?.id && 'Connecting to '}
              {x.name}
            </button>
          ))}
      </div>

      {error && <div role="alert">{error.message}</div>}
    </div>
  )
}
