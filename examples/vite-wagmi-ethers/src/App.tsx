import { ConnectKitButton } from 'connectkit'
import { useAccount } from 'wagmi'
import { TokenboundClient } from '@tokenbound/sdk'

import { sepolia } from 'viem/chains'

import { Account } from './components'
import { parseUnits, getAddress } from 'viem'
import { useCallback, useEffect } from 'react'
import { useEthersSigner } from './hooks'
import { ethers } from 'ethers'

import { Eip1193Bridge } from '@ethersproject/experimental'

// const sendingTBA = '0x047A2F5c8C97948675786e9a1A12EB172CF802a1'  // Sapienz #5 on Goerli w/ V2 contract: https://tokenbound.org/assets/goerli/0x26c55c8d83d657b2fc1df497f0c991e3612bc6b2/5
const sendingTBA = '0xa2221cc0f5012D60d0bF91B840A4Ef990D44Ae39' // Sapienz #5 on Goerli w/ V3 contract
const recipientAddress = getAddress('0x9FefE8a875E7a9b0574751E191a2AF205828dEA4')
const ethAmount = 0.005
const ethAmountWei = parseUnits(`${ethAmount}`, 18)

// This account has been deployed on sepolia:
// const TOKEN_CONTRACT = `0x26c55c8d83d657b2fc1df497f0c991e3612bc6b2`
// const TOKEN_ID = '5'

const TOKEN_CONTRACT = `0x26c55c8d83d657b2fc1df497f0c991e3612bc6b2`
const TOKEN_ID = '1'

// @ BJ: new network for use in creating new provider
const network = {
  chainId: sepolia.id,
  name: sepolia.name,
  ensAddress: sepolia.contracts?.ensRegistry?.address,
}
// const provider = new providers.Web3Provider(transport, network)

const sepoliaNetwork = ethers.providers.getNetwork(sepolia.id)

const sepoliaProvider = ethers.getDefaultProvider(sepoliaNetwork)

// ethers.providers.JsonRpcProvider('')

// SMkQiSpoj4za3-0hO0eP78i3b0OrBT4k

export function App() {
  const { isConnected, address } = useAccount()
  const signer = useEthersSigner({ chainId: 5 })
  // or useSigner() from legacy wagmi versions: const { data: signer } = useSigner()
  const eip1193Bridge = new Eip1193Bridge(
    signer as ethers.providers.JsonRpcSigner,
    signer?.provider
  )
  const tokenboundClient = new TokenboundClient({
    signer,
    chainId: 5,
    eip1193Bridge,
  })

  // useEffect(() => {
  //   console.log('signer', signer)
  //   async function testTokenboundClass() {
  //     if (!tokenboundClient) return

  //     const tokenboundAccount = tokenboundClient.getAccount({
  //       tokenContract: TOKEN_CONTRACT,
  //       tokenId: TOKEN_ID,
  //     })

  //     const preparedExecution = await tokenboundClient.prepareExecution({
  //       account: tokenboundAccount,
  //       to: recipientAddress,
  //       value: 0n,
  //       data: '',
  //     })

  //     const preparedCreateAccount = await tokenboundClient.prepareCreateAccount({
  //       tokenContract: TOKEN_CONTRACT,
  //       tokenId: TOKEN_ID,
  //     })

  //     console.log('getAccount', tokenboundAccount)
  //     console.log('preparedExecuteCall', preparedExecution)
  //     console.log('preparedAccount', preparedCreateAccount)

  //     // if (address) {
  //     //   walletClient?.sendTransaction(preparedCreateAccount)
  //     //   walletClient?.sendTransaction(preparedExecuteCall)
  //     // }
  //   }

  //   testTokenboundClass()
  // }, [])

  const createAccount = useCallback(async () => {
    if (!tokenboundClient || !address) return
    const { account, txHash } = await tokenboundClient.createAccount({
      //
      tokenContract: TOKEN_CONTRACT,
      tokenId: TOKEN_ID,
      chain: sepolia,
      // provider: sepoliaProvider,
    })
    console.log(`new account: ${account}`)
    console.log('txHash', txHash)
    alert(`new account on sepolia: ${account}`)
  }, [tokenboundClient])

  const execute = useCallback(async () => {
    if (!tokenboundClient || !address) return
    const executedCall = await tokenboundClient.execute({
      account: sendingTBA,
      to: recipientAddress,
      value: ethAmountWei,
      data: '0x',
    })
    executedCall && alert(`Executed: ${executedCall}`)
  }, [tokenboundClient])

  const transferETH = useCallback(async () => {
    if (!tokenboundClient || !address) return
    const executedTransfer = await tokenboundClient.transferETH({
      account: sendingTBA,
      recipientAddress,
      amount: ethAmount,
    })
    executedTransfer && alert(`Sent ${ethAmount} ETH to ${recipientAddress}`)
  }, [tokenboundClient])

  return (
    <>
      <h1>Ethers 5 Signer + ConnectKit + Vite</h1>
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
          <button onClick={() => execute()}>EXECUTE</button>
          <button onClick={() => createAccount()}>CREATE ACCOUNT</button>
          <button onClick={() => transferETH()}>TRANSFER ETH</button>
        </div>
      )}
    </>
  )
}
