import { ConnectKitButton } from 'connectkit'

import { useAccount, useSigner } from 'wagmi'

import { Account } from './components'

import {
  getAccount,
  prepareExecuteCall,
  TokenboundClient,
  GetAccountParams,
  executeCall,
} from '@tokenbound/sdk'

import { useEffect, useState } from 'react'

export function App() {
  const { isConnected } = useAccount()
  const { data: signer } = useSigner()

  const [tokenboundClient, setTbClient] = useState<TokenboundClient | null>()

  useEffect(() => {
    async function createTBClient() {
      if (signer) {
        const tokenboundClient = await new TokenboundClient({ signer })

        // signer?.getChainId() is async, so we wait for it to resolve
        // before we setTbClient() to ensure the client instance has a publicClient
        await tokenboundClient.initialize()

        setTbClient(tokenboundClient)
      }
    }
    createTBClient()
  }, [signer])

  useEffect(() => {
    async function testTokenboundClass() {
      if (!tokenboundClient?.isInitialized) return

      const account = await tokenboundClient.getAccount({
        tokenContract: '0xe7134a029cd2fd55f678d6809e64d0b6a0caddcb',
        tokenId: '9',
      })
      console.log('tokenBound getAccount', account)

      const encoded = await tokenboundClient.prepareExecuteCall({
        account: account,
        to: account,
        value: 0n,
        data: '',
      })
      console.log('tokenBound prepareExecuteCall', encoded)

      const preparedAccount = await tokenboundClient.prepareCreateAccount({
        tokenContract: '0xe7134a029cd2fd55f678d6809e64d0b6a0caddcb',
        tokenId: '1',
        // chainId: 5
      })
      console.log('tokenBound preparedAccount', preparedAccount)

      const createAccount = await tokenboundClient.createAccount({
        tokenContract: '0xe7134a029cd2fd55f678d6809e64d0b6a0caddcb',
        tokenId: '1',
        // chainId: 5
      })
      console.log('tokenBound createAccount', createAccount)
      // CreateAccountParams
    }

    testTokenboundClass()
  }, [tokenboundClient])

  return (
    <>
      <h1>wagmi + ConnectKit + Vite</h1>
      <ConnectKitButton />
      {isConnected && <Account />}
    </>
  )
}
