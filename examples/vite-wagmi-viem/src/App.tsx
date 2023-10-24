import { ConnectKitButton } from 'connectkit'
import { useAccount, WindowProvider } from 'wagmi'

import { Account } from './components'

import {
  createWalletClient,
  http,
  custom,
  WalletClient,
  parseUnits,
  getAddress,
  numberToHex,
  numberToBytes,
  stringToBytes,
  encodeAbiParameters,
  parseAbiParameters,
  stringToHex,
} from 'viem'
import { goerli } from 'viem/chains'
import { TokenboundClient } from '@tokenbound/sdk'

import { useCallback, useEffect } from 'react'

declare global {
  interface Window {
    ethereum?: WindowProvider
  }
}

// const sendingTBA = '0x33D622b211C399912eC0feaaf1caFD01AFA53980'
// const recipientAddress = getAddress('0x5ed25DCC8490809215cd0632492467BEbc60B8d5')
// const ethAmount = 0.1
// const ethAmountWei = parseUnits(`${ethAmount}`, 18)

// const sendingTBA = '0x047A2F5c8C97948675786e9a1A12EB172CF802a1'  // Sapienz #5 on Goerli w/ V2 contract: https://tokenbound.org/assets/goerli/0x26c55c8d83d657b2fc1df497f0c991e3612bc6b2/5
const sendingTBA = '0xa2221cc0f5012D60d0bF91B840A4Ef990D44Ae39' // Sapienz #5 on Goerli w/ V3 contract // It's deployed
const recipientAddress = getAddress('0x9FefE8a875E7a9b0574751E191a2AF205828dEA4')
const ethAmount = 0.005
const ethAmountWei = parseUnits(`${ethAmount}`, 18)

const TOKEN_CONTRACT = `0x26c55c8d83d657b2fc1df497f0c991e3612bc6b2`
const TOKEN_ID = '5'

export function App() {
  const { isConnected, address } = useAccount()

  const walletClient: WalletClient = createWalletClient({
    chain: goerli,
    account: address,
    transport: window.ethereum ? custom(window.ethereum) : http(),
  })

  const tokenboundClient = new TokenboundClient({
    walletClient,
    chainId: goerli.id,
    // implementationAddress: '0x2d25602551487c3f3354dd80d76d54383a243358',
  })

  useEffect(() => {
    async function testTokenboundClass() {
      if (!tokenboundClient) return

      // const isV3Supported = await tokenboundClient.isV3Supported()
      // alert(`isV3Supported: ${isV3Supported}`)

      const tokenboundAccount = tokenboundClient.getAccount({
        tokenContract: TOKEN_CONTRACT,
        tokenId: TOKEN_ID,
        // tokenContract: '0xe7134a029cd2fd55f678d6809e64d0b6a0caddcb',
        // tokenId: '9',
      })

      // const preparedExecuteCall = await tokenboundClient.prepareExecuteCall({
      //   account: tokenboundAccount,
      //   to: recipientAddress,
      //   value: 0n,
      //   data: '',
      // })

      const preparedCreateAccount = await tokenboundClient.prepareCreateAccount({
        // tokenContract: '0xe7134a029cd2fd55f678d6809e64d0b6a0caddcb',
        // tokenId: '1',
        tokenContract: TOKEN_CONTRACT,
        tokenId: TOKEN_ID,
      })

      // console.log(`isV3Supported: ${isV3Supported}`)
      console.log('getAccount', tokenboundAccount)
      // console.log('preparedExecuteCall', preparedExecuteCall)
      console.log('preparedAccount', preparedCreateAccount)

      const isDeployed = await tokenboundClient.checkAccountDeployment({
        accountAddress: tokenboundAccount,
      })
      console.log('isDeployed', isDeployed)

      const isValid = await tokenboundClient.isValidSigner({
        account: tokenboundAccount,
        // data: '0x',
        // data: numberToHex(0, { size: 32 }),
        //data: numberToBytes(0, { size: 32 }), // This fails with TypeError: x.replace is not a function
        // data: numberToBytes(0),
        // data: stringToBytes('0'),
        // data: stringToBytes('0', { size: 32 }),
        // data: stringToHex('0', { size: 32 }),
        // data: '0x0000000000000000000000000000000000000000000000000000000000000000',
        // data: encodeAbiParameters(parseAbiParameters(['bytes32']), [
        //   // numberToHex(0, { size: 32 }),
        //   // stringToHex('0', { size: 32 }),
        // ]),
      })

      console.log('isValidSigner?', isValid)
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
      // tokenContract: '0xe7134a029cd2fd55f678d6809e64d0b6a0caddcb',
      // tokenId: '1',
      tokenContract: TOKEN_CONTRACT,
      tokenId: TOKEN_ID,
    })
    console.log(`new account: ${createdAccount}`) // 0xba0292aBcCAF72D8904D6cD01E67D00D6E702275
    alert(`new account: ${createdAccount}`)
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
      amount: ethAmount, // BEFORE: 0.3994 AFTER: 0.8024
    })
    executedTransfer && alert(`Sent ${ethAmount} ETH to ${recipientAddress}`)
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
          <button onClick={() => execute()}>EXECUTE</button>
          <button onClick={() => createAccount()}>CREATE ACCOUNT</button>
          <button onClick={() => transferETH()}>TRANSFER ETH</button>
        </div>
      )}
    </>
  )
}
