import { ConnectKitButton } from 'connectkit'
import { useAccount } from 'wagmi'
import { TokenboundClient } from '@tokenbound/sdk'

import { Account } from './components'
import { parseUnits, getAddress } from 'viem'
import { useCallback, useEffect } from 'react'
import { useEthersSigner } from './hooks'

// Origin NFT: MoonTrees #0 on Base Sepolia
const originNFT = {
  tokenContract: getAddress('0xcf7ea35b7421a8ff2ff460a939e294ac13a05342'),
  tokenId: '0',
}

// TBA: Tokenbound Account derived from MoonTrees #0 on Base Sepolia
const sendingTBA = '0x5F50CAf6244d10C32965354F8c4d84D84503D42D'
const recipientAddress = getAddress('0x9FefE8a875E7a9b0574751E191a2AF205828dEA4')
const ethAmount = 0.005
const ethAmountWei = parseUnits(`${ethAmount}`, 18)

export function App() {
  const { isConnected, address } = useAccount()
  const signer = useEthersSigner({ chainId: 5 })
  // or useSigner() from legacy wagmi versions: const { data: signer } = useSigner()

  const tokenboundClient = new TokenboundClient({
    signer,
    chainId: 5,
  })

  useEffect(() => {
    console.log('signer', signer)
    async function testTokenboundClass() {
      if (!tokenboundClient) return

      const tokenboundAccount = tokenboundClient.getAccount({
        tokenContract: originNFT.tokenContract,
        tokenId: originNFT.tokenId,
      })

      const preparedExecution = await tokenboundClient.prepareExecution({
        account: tokenboundAccount,
        to: recipientAddress,
        value: 0n,
        data: '',
      })

      const preparedCreateAccount = await tokenboundClient.prepareCreateAccount({
        tokenContract: originNFT.tokenContract,
        tokenId: originNFT.tokenId,
      })

      console.log('getAccount', tokenboundAccount)
      console.log('preparedExecuteCall', preparedExecution)
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
        tokenContract: originNFT.tokenContract,
        tokenId: originNFT.tokenId,
    })
    console.log(`new account: ${createdAccount}`)
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
