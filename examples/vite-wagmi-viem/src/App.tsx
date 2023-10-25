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
} from 'viem'
import { goerli } from 'viem/chains'
import { TokenboundClient } from '@tokenbound/sdk'

import { useCallback, useEffect, useState } from 'react'

declare global {
  interface Window {
    ethereum?: WindowProvider
  }
}

// const sendingTBA = '0x33D622b211C399912eC0feaaf1caFD01AFA53980'
// const recipientAddress = getAddress('0x5ed25DCC8490809215cd0632492467BEbc60B8d5')
// const ethAmount = 0.1
// const ethAmountWei = parseUnits(`${ethAmount}`, 18)

const sendingTBA = '0x047A2F5c8C97948675786e9a1A12EB172CF802a1'
const recipientAddress = getAddress('0x9FefE8a875E7a9b0574751E191a2AF205828dEA4')
const ethAmount = 0.05
const ethAmountWei = parseUnits(`${ethAmount}`, 18)

export function App() {
  const { isConnected, address } = useAccount()

  // dynamically set id
  const walletClient: WalletClient = createWalletClient({
    chain: goerli,
    account: '0xF897f6250Ea36e3D9b87Bc9728d6e6Bf3136B079',
    // account: address,
    // transport: http(
    //   'https://eth-goerli.g.alchemy.com/v2/RXZHK0clT0erlVPHN9Ilp2VXoug8Qj1_'
    // ),
    transport: window.ethereum ? custom(window.ethereum) : http(),
  })

  console.log({ address, walletClient })

  // dynamically set id
  const tokenboundClient = new TokenboundClient({ walletClient, chainId: goerli.id })

  const [toAddress, setToAddress] = useState('')
  const [amount, setAmount] = useState('')
  const [contract, setContract] = useState('')
  const [tokenId, setTokenId] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [txHash, setTxHash] = useState('')
  const [nftHash, setNftHash] = useState('')
  const [nftLoading, setNftLoading] = useState(false)

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setLoading(true)
      if (!address) return
      if (amount === '') return
      if (Number(amount) > 0.001) return

      const response = await tokenboundClient.transferETH({
        account: address,
        recipientAddress: toAddress as `0x${string}`,
        amount: Number(amount),
      })

      if (response) {
        setLoading(false)
        setTxHash(response)
      }

      console.log(response)
      if (loading) setLoading(false)
    },
    [walletClient, address, toAddress, amount]
  )

  const handleNftTransfer = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setLoading(true)
      if (!address) return
      if (tokenId === '') return
      if (contract === '') return

      const response = await tokenboundClient.transferNFT({
        account: address,
        tokenType: 'ERC721',
        tokenContract: contract,
        tokenId,
        amount: 1,
        recipientAddress: toAddress,
      })

      if (response) {
        setNftLoading(false)
        setNftHash(response)
      }

      console.log(response)
      if (nftLoading) setNftLoading(false)
    },
    [walletClient, address, toAddress, amount]
  )

  // useEffect(() => {
  //   async function testTokenboundClass() {
  //     if (!tokenboundClient) return

  //     const tokenboundAccount = tokenboundClient.getAccount({
  //       tokenContract: '0xe7134a029cd2fd55f678d6809e64d0b6a0caddcb',
  //       tokenId: '9',
  //     })

  //     const preparedExecuteCall = await tokenboundClient.prepareExecuteCall({
  //       account: tokenboundAccount,
  //       to: recipientAddress,
  //       value: 0n,
  //       data: '',
  //     })

  //     const preparedCreateAccount = await tokenboundClient.prepareCreateAccount({
  //       tokenContract: '0xe7134a029cd2fd55f678d6809e64d0b6a0caddcb',
  //       tokenId: '1',
  //     })

  //     console.log('getAccount', tokenboundAccount)
  //     console.log('preparedExecuteCall', preparedExecuteCall)
  //     console.log('preparedAccount', preparedCreateAccount)

  //     // if (address) {
  //     //   walletClient?.sendTransaction(preparedCreateAccount)
  //     //   walletClient?.sendTransaction(preparedExecuteCall)
  //     // }
  //   }

  //   testTokenboundClass()
  // }, [])

  // const createAccount = useCallback(async () => {
  //   if (!tokenboundClient || !address) return
  //   const createdAccount = await tokenboundClient.createAccount({
  //     tokenContract: '0xe7134a029cd2fd55f678d6809e64d0b6a0caddcb',
  //     tokenId: '1',
  //   })
  //   alert(`new account: ${createdAccount}`)
  // }, [tokenboundClient])

  // const executeCall = useCallback(async () => {
  //   if (!tokenboundClient || !address) return
  //   const executedCall = await tokenboundClient.executeCall({
  //     account: sendingTBA,
  //     to: recipientAddress,
  //     value: ethAmountWei,
  //     data: '0x',
  //   })
  //   executedCall && alert(`Sent ${ethAmount} ETH to ${recipientAddress}`)
  // }, [tokenboundClient])

  // now we need to make some tx happen

  return (
    <>
      <h1>viem walletClient + ConnectKit + Vite</h1>
      <ConnectKitButton />
      {isConnected && <Account />}
      {address && (
        <div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              margin: '32px 0 50px',
              maxWidth: '320px',
            }}
          >
            {/* <button onClick={() => executeCall()}>EXECUTE CALL</button>
          <button onClick={() => createAccount()}>CREATE ACCOUNT</button> */}
            <h2>Send ETH</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="to">To:</label>
                <input
                  type="text"
                  id="to"
                  value={toAddress}
                  onChange={(event) => setToAddress(event.target.value)}
                />
              </div>
              <div>
                <label htmlFor="amount">Amount of ETH:</label>
                <input
                  type="text"
                  id="amount"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                />
              </div>
              <button type="submit">{loading ? 'Loading...' : 'Send'}</button>
              {txHash && <div>{txHash}</div>}
            </form>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              margin: '32px 0 0',
              maxWidth: '320px',
            }}
          >
            {/* <button onClick={() => executeCall()}>EXECUTE CALL</button>
          <button onClick={() => createAccount()}>CREATE ACCOUNT</button> */}
            <h2>Send NFT</h2>
            <form onSubmit={handleNftTransfer}>
              <div>
                <label htmlFor="to">To:</label>
                <input
                  type="text"
                  id="to"
                  value={toAddress}
                  onChange={(event) => setToAddress(event.target.value)}
                />
              </div>
              <div>
                <label htmlFor="contractAddress">Contract:</label>
                <input
                  type="text"
                  id="contractAddress"
                  value={contract}
                  onChange={(event) => setContract(event.target.value)}
                />
              </div>
              <div>
                <label htmlFor="tokenId">TokenId:</label>
                <input
                  type="text"
                  id="tokenId"
                  value={tokenId}
                  onChange={(event) => setTokenId(event.target.value)}
                />
              </div>
              <button type="submit">{nftLoading ? 'Loading...' : 'Send'}</button>
              {nftHash && <div>{nftHash}</div>}
            </form>
          </div>
        </div>
      )}
    </>
  )
}
