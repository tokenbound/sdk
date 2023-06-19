import { ConnectKitButton } from 'connectkit'
import { useAccount, useSigner } from 'wagmi'
import { TokenboundClient } from '@tokenbound/sdk'

import { Account } from './components'

import { useEffect, useMemo } from 'react'

export function App() {
  const { isConnected } = useAccount()
  const { data: signer } = useSigner()

  const tokenboundClient = new TokenboundClient({ signer, chainId: 5 })

  useEffect(() => {
    async function testTokenboundClass() {
      const account = await tokenboundClient.getAccount({
        tokenContract: '0xe7134a029cd2fd55f678d6809e64d0b6a0caddcb',
        tokenId: '9',
      })

      const preparedExecuteCall = await tokenboundClient.prepareExecuteCall({
        account: account,
        to: account,
        value: 0n,
        data: '',
      })

      const preparedAccount = await tokenboundClient.prepareCreateAccount({
        tokenContract: '0xe7134a029cd2fd55f678d6809e64d0b6a0caddcb',
        tokenId: '1',
      })

      useMemo(() => {
        console.log('tokenBound getAccount', account)
        console.log('tokenBound prepareExecuteCall', preparedExecuteCall)
        console.log('tokenBound preparedAccount', preparedAccount)
      }, [account, preparedExecuteCall, preparedAccount])

      // if (signer) {
      // signer?.sendTransaction(preparedAccount)
      // signer?.sendTransaction(preparedExecuteCall)
      //   const createAccount = await tokenboundClient.createAccount({
      //     tokenContract: '0xe7134a029cd2fd55f678d6809e64d0b6a0caddcb',
      //     tokenId: '1',
      //   })
      //   console.log('tokenBound createAccount', createAccount)
      // }
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
