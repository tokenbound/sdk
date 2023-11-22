import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { TokenboundClient } from '@tokenbound/sdk'

import { Account } from './components'

import { parseUnits, getAddress } from 'viem'
import { useCallback, useEffect } from 'react'
import { useEthersSigner } from './hooks'

// const sendingTBA = '0x047A2F5c8C97948675786e9a1A12EB172CF802a1'  // Sapienz #5 on Goerli w/ V2 contract: https://tokenbound.org/assets/goerli/0x26c55c8d83d657b2fc1df497f0c991e3612bc6b2/5
const sendingTBA = '0xa2221cc0f5012D60d0bF91B840A4Ef990D44Ae39' // Sapienz #5 on Goerli w/ V3 contract
const recipientAddress = getAddress('0x9FefE8a875E7a9b0574751E191a2AF205828dEA4')
const ethAmount = 0.005
const ethAmountWei = parseUnits(`${ethAmount}`, 18)

const TOKEN_CONTRACT = `0x26c55c8d83d657b2fc1df497f0c991e3612bc6b2`
const TOKEN_ID = '5'

export function App() {
  const { isConnected, address } = useAccount()
  const signer = useEthersSigner({ chainId: 5 })
  // or useSigner() from legacy wagmi versions: const { data: signer } = useSigner()

  const tokenboundClient = new TokenboundClient({ signer, chainId: 5 })

  useEffect(() => {
    async function testTokenboundClass() {
      const account = await tokenboundClient.getAccount({
        tokenContract: '0xe7134a029cd2fd55f678d6809e64d0b6a0caddcb',
        tokenId: '9',
      })

      const preparedExecution = await tokenboundClient.prepareExecution({
        account: account,
        to: account,
        value: 0n,
        data: '',
      })

      const preparedAccount = await tokenboundClient.prepareCreateAccount({
        tokenContract: '0xe7134a029cd2fd55f678d6809e64d0b6a0caddcb',
        tokenId: '1',
      })

      console.log('getAccount', account)
      console.log('preparedExecution', preparedExecution)
      console.log('preparedAccount', preparedAccount)

      // if (signer) {
      // signer?.sendTransaction(preparedAccount)
      // signer?.sendTransaction(preparedExecuteCall)
      // }
    }

    testTokenboundClass()
  }, [tokenboundClient])

  const createAccount = useCallback(async () => {
    if (!tokenboundClient || !address) return
    const { account, txHash } = await tokenboundClient.createAccount({
      tokenContract: TOKEN_CONTRACT,
      tokenId: TOKEN_ID,
    })
    console.log(`new account: ${account}`)
    alert(`new account: ${account}`)
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
      <h1>Ethers 5 Signer + RainbowKit + Vite</h1>
      <ConnectButton />
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
          <button onClick={() => execute()}>EXECUTE CALL</button>
          <button onClick={() => createAccount()}>CREATE ACCOUNT</button>
          <button onClick={() => transferETH()}>TRANSFER ETH</button>
        </div>
      )}
    </>
  )
}
