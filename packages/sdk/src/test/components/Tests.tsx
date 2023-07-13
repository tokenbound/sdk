import React, { useCallback, useState } from 'react'
import { useAccount, useNetwork, useConnect, useDisconnect, useWalletClient } from 'wagmi'
import { TokenboundClient } from '@tokenbound/sdk'
import { useHasMounted } from '../hooks'

// import { foundry } from 'viem/chains'

export function Tests({ tokenboundClient }: { tokenboundClient: TokenboundClient }) {
  const { address, connector, isConnected } = useAccount()
  // const { chain } = useNetwork()
  // const { data: walletClient } = useWalletClient({ chainId: foundry?.id })
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect()
  const { disconnect } = useDisconnect()

  const [tokenboundAccountAddress, setTokenboundAccountAddress] = useState<
    `0x${string}` | null
  >(null)
  const [executedCallAddress, setExecutedCallAddress] = useState<`0x${string}` | null>(
    null
  )
  const hasMounted = useHasMounted()

  const createAccount = useCallback(async () => {
    if (!tokenboundClient || !address) return
    const accountAddress = await tokenboundClient.createAccount({
      tokenContract: '0x4b10701bfd7bfedc47d50562b76b436fbb5bdb3b', // BJ's Lil' Noun
      tokenId: '606',
    })
    accountAddress && setTokenboundAccountAddress(accountAddress)
  }, [tokenboundClient])

  const executeCall = useCallback(async () => {
    if (!tokenboundClient || !address) return
    const executedCallAddress = await tokenboundClient.executeCall({
      account: address,
      to: address,
      value: 0n,
      data: '0x',
    })
    executedCallAddress && setExecutedCallAddress(executedCallAddress)
  }, [tokenboundClient])

  if (!hasMounted) return null

  // console.log('setTokenboundAccountAddress', tokenboundAccountAddress)

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

            {tokenboundClient && (
              <>
                <button
                  id="tb-create-account-button"
                  data-testid="tb-create-account-button"
                  onClick={() => createAccount()}
                >
                  Create Account
                </button>
                <button
                  id="tb-execute-call-button"
                  data-testid="tb-execute-call-button"
                  onClick={() => executeCall()}
                >
                  Execute Call
                </button>
              </>
            )}

            {/* OUTPUT WHEN TOKENBOUND ADDRESS HAS BEEN CREATED */}
            {tokenboundAccountAddress && (
              <span id="tb-account-created" data-testid="tb-account-created">
                {tokenboundAccountAddress}
              </span>
            )}

            {/* OUTPUT WHEN CALL HAS BEEN SUCCESSFULLY EXECUTED BY TOKENBOUND ACCOUNT */}
            {executedCallAddress && (
              <span id="tb-executed-call" data-testid="tb-executed-call">
                {executedCallAddress}
              </span>
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
