import { ConnectKitButton } from 'connectkit'
import { useAccount } from 'wagmi'
import { TokenboundClient } from '@tokenbound/sdk'

import { Account } from './components'

import { useCallback, useEffect } from 'react'
import { useEthers6Signer } from './hooks'

export function App() {
  const { isConnected, address } = useAccount()

  const signer = useEthers6Signer({ chainId: 5 })
  // or useSigner() from legacy wagmi versions: const { data: signer } = useSigner()

  console.log('SIGNER', signer)
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

      console.log('getAccount', account)
      console.log('prepareExecuteCall', preparedExecuteCall)
      console.log('preparedAccount', preparedAccount)

      // if (signer) {
      //   signer?.sendTransaction(preparedAccount)
      //   signer?.sendTransaction(preparedExecuteCall)
      // }
    }

    testTokenboundClass()
  }, [tokenboundClient])

  const createAccount = useCallback(async () => {
    if (!tokenboundClient || !address) return
    const createdAccount = await tokenboundClient.createAccount({
      tokenContract: '0xe7134a029cd2fd55f678d6809e64d0b6a0caddcb',
      tokenId: '1',
    })
    alert(`new account: ${createdAccount}`)
  }, [tokenboundClient])
  const transferNFT = useCallback(async () => {
    if (!tokenboundClient || !address) return

    const bjGoerliSapienz = tokenboundClient.getAccount({
      // BJ's Goerli Sapienz
      tokenContract: '0x26c55c8d83d657b2fc1df497f0c991e3612bc6b2',
      tokenId: '5',
    })

    // console.log('goerli sapienz tbaccount', bjGoerliSapienz)

    const transferredNFTHash = await tokenboundClient.transferNFT({
      account: bjGoerliSapienz,
      tokenType: 'ERC721',
      tokenContract: '0xbbabef539cad957f1ecc9ee56f38588e24b3dcf3',
      tokenId: '0',
      recipientAddress: '0x9FefE8a875E7a9b0574751E191a2AF205828dEA4', // BJ's main wallet
    })
    alert(`transferred: ${transferredNFTHash}`)
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
      <h1>Ethers 6 Signer + ConnectKit + Vite</h1>
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
          <button onClick={() => transferNFT()}>TRANSFER NFT</button>
        </div>
      )}
    </>
  )
}
