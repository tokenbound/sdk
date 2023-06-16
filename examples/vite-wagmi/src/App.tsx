import { ConnectKitButton } from 'connectkit'
import {
  useAccount,
  // useProvider, useSigner
} from 'wagmi'

import { Account } from './components'

import { createPublicClient, createWalletClient, http } from 'viem'
import { goerli } from 'viem/chains'
import {
  getAccount,
  prepareExecuteCall,
  TokenboundClient,
  GetAccountParams,
  executeCall,
} from '@tokenbound/sdk'

// import {
//   erc6551AccountImplementationAddress,
//   getAccount as getAccountEthers,
//   prepareExecuteCall as prepareExecuteCallEthers,
// } from "@tokenbound/sdk-ethers";

import { useEffect } from 'react'

const client = createPublicClient({
  chain: goerli,
  transport: http(),
})

const walletClient = createWalletClient({
  chain: goerli,
  // transport: custom(window.ethereum),
  transport: http(),
})

const tbClient = new TokenboundClient({ walletClient })
// const [address] = await walletClient.getAddresses()

// console.log(tbClient)

export function App() {
  const { isConnected } = useAccount()
  // const provider = useProvider();
  // const { data: signer, isError, isLoading } = useSigner();

  useEffect(() => {
    async function testStandaloneViemSdk() {
      const [address] = await walletClient.getAddresses()
      console.log('address', address)

      const account = await getAccount(
        '0xe7134a029cd2fd55f678d6809e64d0b6a0caddcb',
        '9',
        client
      )

      console.log('viem getAccount', account)

      const encoded = await prepareExecuteCall(account, account, 0n, '')
      console.log('viem prepareExecuteCall', encoded)

      // const call = await executeCall(
      //   account, // from account,
      //   account, // to,
      //   0n, // value,
      //   '', // data
      //   walletClient // client
      // )
    }

    testStandaloneViemSdk()
  }, [])

  useEffect(() => {
    async function testTokenboundClass() {
      const account = await tbClient.getAccount({
        tokenContract: '0xe7134a029cd2fd55f678d6809e64d0b6a0caddcb',
        tokenId: '9',
      })

      console.log('tokenBound getAccount', account)

      const encoded = await tbClient.prepareExecuteCall({
        account: account,
        to: account,
        value: 0n,
        data: '',
      })
      console.log('tokenBound prepareExecuteCall', encoded)
    }

    testTokenboundClass()
  }, [])

  // useEffect(() => {
  //   async function testEthersSdk() {
  //     const account = await getAccount(
  //       "0xe7134a029cd2fd55f678d6809e64d0b6a0caddcb",
  //       "9",
  //       provider
  //     );

  //     console.log("ETHERS", account);

  //     // const encoded = await prepareExecuteCallEthers(account, account, 0, "0x");

  //     // console.log(encoded);
  //   }

  //   testEthersSdk();
  // }, []);

  return (
    <>
      <h1>wagmi + ConnectKit + Vite</h1>
      <ConnectKitButton />
      {isConnected && <Account />}
    </>
  )
}
