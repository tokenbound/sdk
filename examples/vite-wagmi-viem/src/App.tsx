import { ConnectKitButton } from 'connectkit'
import { useAccount, WindowProvider } from 'wagmi'

import { Account } from './components'

import { createWalletClient, http, custom, WalletClient } from 'viem'
import { goerli } from 'viem/chains'
import { NFTMetadata, TokenboundClient } from '@tokenbound/sdk'

import { useCallback, useEffect } from 'react'

declare global {
  interface Window {
    ethereum?: WindowProvider
  }
}

const GOERLI_MOONBIRDS = '0xe7134a029cd2fd55f678d6809e64d0b6a0caddcb'

export function App() {
  const { isConnected, address } = useAccount()

  const walletClient: WalletClient = createWalletClient({
    chain: goerli,
    account: address,
    transport: window.ethereum ? custom(window.ethereum) : http(),
  })

  const tokenboundClient = new TokenboundClient({ walletClient, chainId: goerli.id })

  useEffect(() => {
    async function testTokenboundClass() {
      if (!tokenboundClient) return

      const tokenboundAccount = tokenboundClient.getAccount({
        tokenContract: GOERLI_MOONBIRDS,
        tokenId: '9',
      })

      const preparedExecuteCall = await tokenboundClient.prepareExecuteCall({
        account: tokenboundAccount,
        to: tokenboundAccount,
        value: 0n,
        data: '',
      })

      const preparedCreateAccount = await tokenboundClient.prepareCreateAccount({
        tokenContract: GOERLI_MOONBIRDS,
        tokenId: '1',
      })

      // const nftMetadata = await tokenboundClient.getNFTMetadata({
      //   tokenContract: GOERLI_MOONBIRDS,
      //   tokenId: '1',
      //   tokenType: 'ERC721',
      // })
      const nftMetadata: NFTMetadata = await tokenboundClient.getNFTMetadata({
        tokenContract: '0x906446624f4a0a33bc64f7b72cc0d12d1454e663',
        tokenId: '1',
        tokenType: 'ERC1155',
      })

      console.log('nftMetadata', nftMetadata)

      console.log('getAccount', tokenboundAccount)
      console.log('preparedExecuteCall', preparedExecuteCall)
      console.log('preparedAccount', preparedCreateAccount)

      // if (address) {
      //   walletClient?.sendTransaction(preparedCreateAccount)
      //   walletClient?.sendTransaction(preparedExecuteCall)
      // }
    }

    testTokenboundClass()
  }, [])

  const createAccount = useCallback(async () => {
    if (!tokenboundClient || !address) return
    const createdAccount = await tokenboundClient.createAccount({
      tokenContract: '0xe7134a029cd2fd55f678d6809e64d0b6a0caddcb',
      tokenId: '1',
    })
    alert(`new account: ${createdAccount}`)
  }, [tokenboundClient])

  const executeCall = useCallback(async () => {
    if (!tokenboundClient || !address) return
    const executedCall = await tokenboundClient.executeCall({
      account: address,
      to: address,
      value: 0n,
      data: '0x',
    })
  }, [tokenboundClient])

  return (
    <>
      <h1>viem walletClient + ConnectKit + Vite</h1>
      <ConnectKitButton />
      {isConnected && <Account />}
      {address && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            margin: '32px 0 0',
            maxWidth: '320px',
          }}
        >
          <button onClick={() => executeCall()}>EXECUTE CALL</button>
          <button onClick={() => createAccount()}>CREATE ACCOUNT</button>
        </div>
      )}
    </>
  )
}
