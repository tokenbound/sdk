import { ConnectKitButton } from 'connectkit'
import { useAccount, WindowProvider } from 'wagmi'

import { Account } from './components'

import { createWalletClient, http, custom, WalletClient, getAddress } from 'viem'
import { goerli } from 'viem/chains'
import { TokenboundClient } from '@tokenbound/sdk'

import { useCallback, useEffect, useState } from 'react'

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

  const tokenboundClient = new TokenboundClient({ walletClient, chainId: goerli.id })

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

  // const transferNFT = useCallback(async () => {
  //   if (!tokenboundClient || !address) return

  //   const bjGoerliSapienz = tokenboundClient.getAccount({
  //     // BJ's Goerli Sapienz
  //     tokenContract: '0x26c55c8d83d657b2fc1df497f0c991e3612bc6b2',
  //     tokenId: '5',
  //   })

  //   console.log('goerli sapienz tbaccount', bjGoerliSapienz)

  //   const transferredNFTHash = await tokenboundClient.transferNFT({
  //     account: bjGoerliSapienz,
  //     tokenType: 'ERC721',
  //     tokenContract: '0xbbabef539cad957f1ecc9ee56f38588e24b3dcf3',
  //     tokenId: '0',
  //     recipientAddress: '0x9FefE8a875E7a9b0574751E191a2AF205828dEA4', // BJ's main wallet
  //   })
  //   // const createdAccount = await tokenboundClient.createAccount({
  //   //   tokenContract: '0xe7134a029cd2fd55f678d6809e64d0b6a0caddcb',
  //   //   tokenId: '1',
  //   // })
  //   alert(`transferred: ${transferredNFTHash}`)
  // }, [tokenboundClient])

  // const transferETH = useCallback(async () => {
  //   if (!tokenboundClient || !address) return

  //   const bjGoerliSapienz = tokenboundClient.getAccount({
  //     tokenContract: '0x26c55c8d83d657b2fc1df497f0c991e3612bc6b2',
  //     tokenId: '5',
  //   })

  //   console.log('goerli sapienz tbaccount', bjGoerliSapienz)

  //   const transferredETHHash = await tokenboundClient.transferETH({
  //     account: bjGoerliSapienz,
  //     amount: 0.01,
  //     recipientAddress: '0x9FefE8a875E7a9b0574751E191a2AF205828dEA4', // BJ's main wallet
  //   })

  //   alert(`transferred: ${transferredETHHash}`)
  // }, [tokenboundClient])
  const transferERC20 = useCallback(async () => {
    if (!tokenboundClient || !address) return

    const bjGoerliSapienz = tokenboundClient.getAccount({
      tokenContract: '0x26c55c8d83d657b2fc1df497f0c991e3612bc6b2',
      tokenId: '5',
    })

    console.log('goerli sapienz tbaccount', bjGoerliSapienz)

    const DRUBLES_ERC20 = {
      tokenAddress: getAddress('0x1faae4d3181284fdec56d48e20298682152d139f'),
      decimals: 18,
    }

    const transferredERC20Hash = await tokenboundClient.transferERC20({
      account: bjGoerliSapienz,
      amount: 10,
      recipientAddress: '0x33D622b211C399912eC0feaaf1caFD01AFA53980', // BJ's account under assets/goerli/0x26c55c8d83d657b2fc1df497f0c991e3612bc6b2/0
      erc20tokenAddress: DRUBLES_ERC20.tokenAddress,
      erc20tokenDecimals: DRUBLES_ERC20.decimals,
    })

    alert(`transferred: ${transferredERC20Hash}`)
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
          {/* <button onClick={() => transferNFT()}>Transfer NFT</button> */}
          <button onClick={() => transferERC20()}>TRANSFER ERC20</button>
          {/* <button onClick={() => transferETH()}>TRANSFER ETH</button> */}
        </div>
      )}
    </>
  )
}
