import { describe, expect, it } from 'vitest'
import { mainnet } from 'viem/chains'
import { providers } from 'ethers'
import { zora721DropABI } from './wagmi-cli-hooks/generated'
import { waitFor} from './mockWallet'
import { createAnvil, CreateAnvilOptions } from '@viem/anvil'
import {
  WalletClient,
  PublicClient,
  createWalletClient,
  http,
  getAddress,
  encodeFunctionData,
  Log,
  parseUnits,
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { 
  CreateAccountParams, 
  TokenboundClient
} from '@tokenbound/sdk'
import { ADDRESS_REGEX, ANVIL_ACCOUNTS, ANVIL_RPC_URL } from './constants'
import { getPublicClient } from './utils'
import { walletClientToEthers5Signer, walletClientToEthers6Signer } from '../utils'

const ACTIVE_CHAIN = mainnet
const TIMEOUT = 60000 // default 10000

const ANVIL_CONFIG: CreateAnvilOptions = {
  forkChainId: ACTIVE_CHAIN.id,
  forkUrl: import.meta.env.VITE_ANVIL_MAINNET_FORK_ENDPOINT,
  forkBlockNumber: import.meta.env.VITE_ANVIL_MAINNET_FORK_BLOCK_NUMBER? parseInt(import.meta.env.VITE_ANVIL_MAINNET_FORK_BLOCK_NUMBER): undefined, 
}

// Zora Webb's First Deep Field: https://zora.co/collect/eth:0x28ee638f2fcb66b4106acab7efd225aeb2bd7e8d
const ZORA_WEBB_TOKEN_PROXY_ADDRESS = getAddress('0x28ee638f2fcb66b4106acab7efd225aeb2bd7e8d')

const ZORA_WEBB_TOKEN_TBA: `0x${string}` = getAddress('0xc33f0A7FcD69Ba00b4e980463199CD38E30d0E5c')

const TOKENID_IN_EOA: string = '10010'
const TOKENID_IN_TBA: string = '10011'


describe('ComboTester', () => {

  const walletClient = createWalletClient({
    transport: http(ANVIL_RPC_URL),
    chain: ACTIVE_CHAIN,
    account: privateKeyToAccount(ANVIL_ACCOUNTS[0].privateKey),
    pollingInterval: 100,
  })

  const ethers5Signer = walletClientToEthers5Signer(walletClient)
  const ethers6Signer = walletClientToEthers6Signer(walletClient)

  runTxTests({ testName: 'Viem Tests', walletClient})

  const ENABLE_ETHERS_TESTS = false

  if(ENABLE_ETHERS_TESTS) {
    runTxTests({ testName: 'Ethers 5 Tests', signer: ethers5Signer})
    runTxTests({ testName: 'Ethers 6 Tests', signer: ethers6Signer})
  }
})


function runTxTests({
  testName,
  walletClient,
  signer
} : {
  testName: string,
  walletClient?: WalletClient,
  signer?: any
}) {
  describe(testName, () => {

    const anvil = createAnvil(
      {...ANVIL_CONFIG}
    )

    let tokenboundClient: TokenboundClient
    let publicClient: PublicClient

    let ZORA_WEBB_TOKEN: CreateAccountParams

    beforeAll(async () => {
      
      try {

        publicClient = getPublicClient({ chainId: ACTIVE_CHAIN.id })

        // Pass in the Anvil test walletClient + publicClient
        tokenboundClient = new TokenboundClient({
          chainId: ACTIVE_CHAIN.id,
          walletClient,
          signer,
          publicClient
        })

        await anvil.start()
        console.log(`\x1b[94m ${testName}-----> anvil.start() \x1b[0m`);
        
      } catch (err) {
          console.error('Error during setup:', err)
      }
      
    }, TIMEOUT)

    afterAll(async () => {
      await anvil.stop()
      console.log(`\x1b[94m ${testName} -----> anvil.stop() \x1b[0m`)
    })

    it('can mint 2 Zora 721 NFTs', async () => {

      let mintLogs: Log[] = []

      // Set up observer for mint event so we can get the tokenId
      const unwatch = publicClient.watchContractEvent({
        address: ZORA_WEBB_TOKEN_PROXY_ADDRESS,
        abi: zora721DropABI,
        eventName: 'Transfer',
        args: {  
          to: ANVIL_ACCOUNTS[0].address
        },
        onLogs: (logs) => {
          mintLogs = logs
          const mintArgs = logs[0].args
          const { tokenId } = mintArgs

          ZORA_WEBB_TOKEN = {
            tokenContract: ZORA_WEBB_TOKEN_PROXY_ADDRESS,
            tokenId: tokenId!.toString()
          }

        }
      })

      // Prepare mint transaction
      const mintPrice = BigInt(0)
      const mintQuantity = 2
      const encodedMintFunctionData = encodeFunctionData({
        abi: zora721DropABI,
        functionName: 'purchase',
        args: [BigInt(mintQuantity)]
      })
      
      const prepared721Mint = {
        to: ZORA_WEBB_TOKEN_PROXY_ADDRESS,
        value: mintPrice * BigInt(mintQuantity),
        data: encodedMintFunctionData,
      }

      let mintTxHash: `0x${string}`

      if (walletClient) {
        mintTxHash = await walletClient.sendTransaction({
          chain: ACTIVE_CHAIN,
          account: getAddress(ANVIL_ACCOUNTS[0].address),
          ...prepared721Mint
        })
      }
      else if (signer) {  
        mintTxHash = await signer.sendTransaction({
          chainId: ACTIVE_CHAIN.id,
          ...prepared721Mint
        }).then((tx: providers.TransactionResponse) => tx.hash)
      }

      await waitFor(() => {
        expect(mintLogs.length).toBe(mintQuantity)
        expect(mintTxHash).toMatch(ADDRESS_REGEX)
        expect(ZORA_WEBB_TOKEN.tokenId).toBe(TOKENID_IN_EOA)
        unwatch()
      })

    }, TIMEOUT)

    it('can transfer one of the minted NFTs to the TBA', async () => {

      const ANVIL_USER_0 = getAddress(ANVIL_ACCOUNTS[0].address)

      const transferCallData = encodeFunctionData({
        abi: zora721DropABI,
        functionName: 'safeTransferFrom',
        args: [
          ANVIL_USER_0, // from
          ZORA_WEBB_TOKEN_TBA, // to
          BigInt(TOKENID_IN_TBA), // tokenId
        ],
      })
      
      const preparedNFTTransfer = {
        to: ZORA_WEBB_TOKEN_TBA,
        value: 0n,
        data: transferCallData,
      }

      let transferHash: string

      if (walletClient) {
        transferHash = await walletClient.sendTransaction({
          chain: ACTIVE_CHAIN,
          account: walletClient.account!.address,
          ...preparedNFTTransfer
        })
      }
      else if (signer) {  
        transferHash = await signer.sendTransaction({
          chainId: ACTIVE_CHAIN.id,
          ...preparedNFTTransfer
        }).then((tx: providers.TransactionResponse) => tx.hash)
      }

      await waitFor(() => {
        expect(transferHash).toMatch(ADDRESS_REGEX)
      })
      
    }, TIMEOUT)

    it('can createAccount', async () => {
      const createdAccount = await tokenboundClient.createAccount(ZORA_WEBB_TOKEN)
      await waitFor(() => {
        expect(createdAccount).toMatch(ADDRESS_REGEX)
        expect(createdAccount).toEqual(ZORA_WEBB_TOKEN_TBA)
      })
    })

    it('can getAccount', async () => {
      const getAccount = tokenboundClient.getAccount(ZORA_WEBB_TOKEN)
      await waitFor(() => {
        expect(getAccount).toMatch(ADDRESS_REGEX)
        expect(getAccount).toEqual(ZORA_WEBB_TOKEN_TBA)
      })
    })

    it('can transfer ETH to the TBA', async () => {

      const ethAmount = 1
      const ethAmountWei = parseUnits(`${ethAmount}`, 18)
      const ANVIL_USER_0 = getAddress(ANVIL_ACCOUNTS[0].address)

      const preparedETHTransfer = {
        to: ZORA_WEBB_TOKEN_TBA,
        value: ethAmountWei,
        data: '0x',
      }

      let transferHash: `0x${string}`
      if (walletClient) {
        transferHash = await walletClient.sendTransaction({
          chain: ACTIVE_CHAIN,
          account: ANVIL_USER_0,
          ...{preparedETHTransfer}
        })
      }
      else if (signer) {  
        transferHash = await signer.sendTransaction({
          chainId: ACTIVE_CHAIN.id,
          ...preparedETHTransfer
        }).then((tx: providers.TransactionResponse) => tx.hash)
      }

      await waitFor(() => {
        expect(transferHash).toMatch(ADDRESS_REGEX)
      })
      
    })

    it('can executeCall with the TBA', async () => {

      const executedCallTxHash = await tokenboundClient.executeCall({
        account: ZORA_WEBB_TOKEN_TBA, // In viem, we get 'No Signer available'
        to: ZORA_WEBB_TOKEN_PROXY_ADDRESS,
        value: 0n,
        data: '',
      })

      await waitFor(() => {
        expect(executedCallTxHash).toMatch(ADDRESS_REGEX)
      })
    }, TIMEOUT)

    test.todo('can transferETH with the TBA', async () => {})
    test.todo('can transferNFT with the TBA', async () => {})
    test.todo('can mint an 1155', async () => {})
    test.todo('can transferNFT with an 1155', async () => {})
    test.todo('can transferERC20', async () => {})

  })
}

