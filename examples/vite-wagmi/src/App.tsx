import { ConnectKitButton } from 'connectkit'
import { useAccount } from 'wagmi'

import { Account } from './components'

import { createWalletClient, http, custom, WalletClient } from 'viem'
import { goerli } from 'viem/chains'
import { TokenboundClient } from '@tokenbound/sdk'

import { useCallback, useEffect } from 'react'
import { WindowProvider } from 'wagmi'

declare global {
  interface Window {
    ethereum?: WindowProvider
  }
}

export function App() {
  const { isConnected, address } = useAccount()

  const walletClient: WalletClient = createWalletClient({
    chain: goerli,
    account: address,
    transport: window.ethereum ? custom(window.ethereum) : http(),
  })
  // const [account] = await walletClient.getAddresses()

  const tokenboundClient = new TokenboundClient({ walletClient, chainId: 5 })

  useEffect(() => {
    async function testTokenboundClass() {
      if (!tokenboundClient) return

      const tokenboundAccount = tokenboundClient.getAccount({
        tokenContract: '0xe7134a029cd2fd55f678d6809e64d0b6a0caddcb',
        tokenId: '9',
      })

      const preparedExecuteCall = await tokenboundClient.prepareExecuteCall({
        account: tokenboundAccount,
        to: tokenboundAccount,
        value: 0n,
        data: '',
      })

      const preparedCreateAccount = await tokenboundClient.prepareCreateAccount({
        tokenContract: '0xe7134a029cd2fd55f678d6809e64d0b6a0caddcb',
        tokenId: '1',
      })

      console.log('getAccount', tokenboundAccount)
      console.log('preparedExecuteCall', preparedExecuteCall)
      console.log('preparedAccount', preparedCreateAccount)

      if (address) {
        // walletClient?.sendTransaction({
        //   account: address,
        //   ...preparedCreateAccount,
        //   data: preparedCreateAccount.data as `0x${string}`, // override type
        // })
        // walletClient?.sendTransaction({
        //   account: address,
        //   ...preparedExecuteCall,
        //   data: preparedExecuteCall.data as `0x${string}`,
        // })
        // console.log(executedCall)
      }
    }

    testTokenboundClass()
  }, [])

  const createAccount = useCallback(async () => {
    if (!tokenboundClient || !address) return
    const createAccount = await tokenboundClient.createAccount({
      tokenContract: '0xe7134a029cd2fd55f678d6809e64d0b6a0caddcb',
      tokenId: '1',
    })
  }, [])

  const executeCall = useCallback(async () => {
    if (!tokenboundClient || !address) return
    const executedCall = await tokenboundClient.executeCall({
      account: address, // from account,
      to: address, // to,
      value: 0n, // value,
      data: '', // data
    })
  }, [])

  return (
    <>
      <h1>wagmi + ConnectKit + Vite</h1>
      <ConnectKitButton />
      {isConnected && <Account />}
      <button onClick={() => executeCall()}>EXECUTE CALL</button>
      <button onClick={() => createAccount()}>CREATE ACCOUNT</button>
    </>
  )
}
