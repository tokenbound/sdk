import { describe, expect, it } from 'vitest'
import { 
  // foundry, 
  mainnet
} from 'viem/chains'
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
  formatEther,
  // createTestClient,
  // walletActions,
  // publicActions,
  // formatEther,
  // createTestClient,
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { 
  CreateAccountParams, 
  TokenboundClient
} from '@tokenbound/sdk'
import { ADDRESS_REGEX, ANVIL_ACCOUNTS, ANVIL_RPC_URL } from './constants'
import { getPublicClient, 
  // shellCommand
 } from './utils'
import { walletClientToEthers5Signer, walletClientToEthers6Signer } from '../utils'
import { erc6551AccountAbi } from '../functions'

const ACTIVE_CHAIN = mainnet
const TIMEOUT = 60000 // default 10000

const ANVIL_CONFIG: CreateAnvilOptions = {
  forkChainId: ACTIVE_CHAIN.id,
  forkUrl: import.meta.env.VITE_ANVIL_MAINNET_FORK_ENDPOINT,
  forkBlockNumber: import.meta.env.VITE_ANVIL_MAINNET_FORK_BLOCK_NUMBER? parseInt(import.meta.env.VITE_ANVIL_MAINNET_FORK_BLOCK_NUMBER): undefined, 
}

// const ANVIL_COMMAND = {
//   // SET_ADDRESS_BYTECODE: 'cast rpc anvil_setCode 0x4e59b44847b379578588920ca78fbf26c0b4956c 0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe03601600081602082378035828234f58015156039578182fd5b8082525050506014600cf3',
//   SET_ADDRESS_BYTECODE: `cast rpc anvil_setCode ${ANVIL_ACCOUNTS[0].address} 0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe03601600081602082378035828234f58015156039578182fd5b8082525050506014600cf3`,
//   DEPLOY_REGISTRY: 'forge script --fork-url http://127.0.0.1:8545 6551contracts/script/DeployRegistry.s.sol --broadcast',
//   DEPLOY_ACCOUNT_IMPLEMENTATION: `forge create 6551contracts/src/examples/simple/SimpleERC6551Account.sol:SimpleERC6551Account --rpc-url=$RPC_URL --private-key=$PRIVATE_KEY`
// }
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
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
        // tokenboundClient = new TokenboundClient({ walletClient, signer, chainId: ACTIVE_CHAIN.id })

        // Pass in the Anvil test walletClient + publicClient
        tokenboundClient = new TokenboundClient({
          chainId: ACTIVE_CHAIN.id,
          walletClient,
          signer,
          publicClient
        })

          // console.log('tokenboundClient', tokenboundClient)

        await anvil.start()
        console.log(`\x1b[94m ${testName}-----> anvil.start() \x1b[0m`);
        
        // Deploy the ERC-6551 registry (WORKS!)
        // await shellCommand(ANVIL_COMMAND.SET_ADDRESS_BYTECODE).then(console.log)
        // await shellCommand(ANVIL_COMMAND.DEPLOY_REGISTRY).then(console.log)

        // Deploy the ERC-6551 account implementation (HRRRM?)
        // await shellCommand(ANVIL_COMMAND.DEPLOY_ACCOUNT_IMPLEMENTATION).then(console.log)

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

      let transferLogs: Log[] = []
      
      // // Set up observer for FundsReceived event so we can get the balance
      // const unwatch = publicClient.watchContractEvent({
      //   address: ZORA_WEBB_TOKEN_PROXY_ADDRESS,
      //   abi: zora721DropABI,
      //   // eventName: 'Transfer',
      //   eventName: 'FundsReceived',
      //   args: {  
      //     // to: ZORA_WEBB_TOKEN_TBA,
      //     // source: ANVIL_USER_0
      //     source: ZORA_WEBB_TOKEN_TBA
      //   },
      //   onLogs: async (logs) => {
      //     transferLogs = logs
      //     // const transferArgs = logs[0].args
      //     // const { tokenId } = transferArgs

      //     console.log('TRANSFER LOGS: ', transferLogs)

      //     const tbaBalance = await publicClient.getBalance({ 
      //       address: ZORA_WEBB_TOKEN_TBA,
      //     })

      //     console.log('ACTUAL TBA BALANCE: ', formatEther(tbaBalance))

      //     // ZORA_WEBB_TOKEN = {
      //     //   tokenContract: ZORA_WEBB_TOKEN_PROXY_ADDRESS,
      //     //   tokenId: tokenId!.toString()
      //     // }

      //   }
      // })


      let transferHash: `0x${string}`
      if (walletClient) {
        transferHash = await walletClient.sendTransaction({
          chain: ACTIVE_CHAIN,
          // account: walletClient.account!.address,
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



      // Set up observer for FundsReceived event so we can get the balance
      const unwatch = publicClient.watchContractEvent({
        // address: ZORA_WEBB_TOKEN_PROXY_ADDRESS,
        address: ZORA_WEBB_TOKEN_TBA,
        // abi: zora721DropABI,
        abi: erc6551AccountAbi,
        // eventName: 'Transfer',
        // eventName: 'FundsReceived',
        eventName: 'TransactionExecuted',
        args: {  
          to: ZORA_WEBB_TOKEN_TBA,
          source: ANVIL_USER_0
          // source: ZORA_WEBB_TOKEN_TBA
        },
        onLogs: async (logs) => {
          transferLogs = logs
          // const transferArgs = logs[0].args
          // const { tokenId } = transferArgs

          console.log('TRANSFER LOGS: ', transferLogs)

          const tbaBalance = await publicClient.getBalance({ 
            address: ZORA_WEBB_TOKEN_TBA,
          })

          console.log('ACTUAL TBA BALANCE: ', formatEther(tbaBalance))

          // ZORA_WEBB_TOKEN = {
          //   tokenContract: ZORA_WEBB_TOKEN_PROXY_ADDRESS,
          //   tokenId: tokenId!.toString()
          // }

        }
      })

      // anvil.logs.forEach((log, idx) => {
      //   console.log(`LOG ${idx}`, log)
      // })

      // console.log('LOGS: ',anvil.logs)

      // await delay(4800)

      const eoaBalance = await publicClient.getBalance({ 
        address: ANVIL_USER_0,
      })

      const tbaBalance = await publicClient.getBalance({ 
        address: ZORA_WEBB_TOKEN_TBA,
      })

      // const EXPECTED_TBA_BALANCE_AFTER = parseUnits('1', 18)
      // const EXPECTED_EOA_BALANCE_AFTER = parseUnits('1', 18)
      

      // if(tbaBalance && eoaBalance) {
        console.log('EOA BALANCE: ', formatEther(eoaBalance))
        console.log('TBA BALANCE: ', formatEther(tbaBalance))
      // }
      await waitFor(() => {

        // expect(tbaBalance).toBe(EXPECTED_TBA_BALANCE_AFTER)
        expect(transferHash).toMatch(ADDRESS_REGEX)
        unwatch()
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

    // it('can transferETH with the TBA', async () => {

    //   const EXPECTED_BALANCE_BEFORE = parseUnits('1', 18)
    //   const EXPECTED_BALANCE_AFTER = parseUnits('0.5', 18)

    //   const balanceBefore = await publicClient.getBalance({ 
    //     address: ZORA_WEBB_TOKEN_TBA,
    //   })
    //   const ethTransferHash = await tokenboundClient.transferETH({
    //     account: ZORA_WEBB_TOKEN_TBA, // 0xc33f0A7FcD69Ba00b4e980463199CD38E30d0E5c
    //     amount: 0.5,
    //     recipientAddress: ANVIL_ACCOUNTS[1].address // 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
    //   })
    //   const balanceAfter = await publicClient.getBalance({ 
    //     address: ZORA_WEBB_TOKEN_TBA,
    //   })

    //   console.log('BEFORE: ', formatEther(balanceBefore), 'AFTER: ', formatEther(balanceAfter))

    //   await waitFor(() => {
    //     expect(ethTransferHash).toMatch(ADDRESS_REGEX)
    //     expect(balanceBefore).toBe(EXPECTED_BALANCE_BEFORE)
    //     expect(balanceAfter).toBe(EXPECTED_BALANCE_AFTER)
    //   })
    // })

    // it('can transferNFT with the TBA', async () => {
    //   const transferNFTHash = await tokenboundClient.transferNFT({
    //     account: ZORA_WEBB_TOKEN_TBA,
    //     tokenType: 'ERC721',
    //     tokenContract: ZORA_WEBB_TOKEN_PROXY_ADDRESS,
    //     tokenId: TOKENID_IN_TBA,
    //     recipientAddress: ANVIL_ACCOUNTS[1].address,
    //   })

    //   await waitFor(() => {
    //     expect(transferNFTHash).toMatch(ADDRESS_REGEX)
    //   })
    // })
    
    test.todo('can mint an 1155', async () => {})
    test.todo('can transferNFT with an 1155', async () => {})
    test.todo('can transferERC20', async () => {})

  })
}

