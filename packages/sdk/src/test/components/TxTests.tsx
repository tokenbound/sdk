import React from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { TokenboundClient } from '@tokenbound/sdk'
import { useHasMounted } from '../hooks'
import { TesterType } from '../types'
import { TestTxExecuteCall, TestTxCreateAccount } from './'

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
