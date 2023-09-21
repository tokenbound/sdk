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
  formatEther,
  encodeAbiParameters,
  parseAbiParameters,
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
  // gasLimit: 1000000000000,
  // disableBlockGasLimit: true,
  // blockBaseFeePerGas: 300000000,
  forkUrl: import.meta.env.VITE_ANVIL_MAINNET_FORK_ENDPOINT,
  forkBlockNumber: import.meta.env.VITE_ANVIL_MAINNET_FORK_BLOCK_NUMBER? parseInt(import.meta.env.VITE_ANVIL_MAINNET_FORK_BLOCK_NUMBER): undefined, 
}

const ANVIL_USER_0 = getAddress(ANVIL_ACCOUNTS[0].address)
const ANVIL_USER_1 = getAddress(ANVIL_ACCOUNTS[1].address)

// const ANVIL_COMMAND = {
//   // SET_ADDRESS_BYTECODE: 'cast rpc anvil_setCode 0x4e59b44847b379578588920ca78fbf26c0b4956c 0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe03601600081602082378035828234f58015156039578182fd5b8082525050506014600cf3',
//   SET_ADDRESS_BYTECODE: `cast rpc anvil_setCode ${ANVIL_ACCOUNTS[0].address} 0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe03601600081602082378035828234f58015156039578182fd5b8082525050506014600cf3`,
//   DEPLOY_REGISTRY: 'forge script --fork-url http://127.0.0.1:8545 6551contracts/script/DeployRegistry.s.sol --broadcast',
//   DEPLOY_ACCOUNT_IMPLEMENTATION: `forge create 6551contracts/src/examples/simple/SimpleERC6551Account.sol:SimpleERC6551Account --rpc-url=$RPC_URL --private-key=$PRIVATE_KEY`
// }

// Zora Webb's First Deep Field: https://zora.co/collect/eth:0x28ee638f2fcb66b4106acab7efd225aeb2bd7e8d
const ZORA_WEBB_TOKEN_PROXY_ADDRESS = getAddress('0x28ee638f2fcb66b4106acab7efd225aeb2bd7e8d')

const ZORA_WEBB_TOKEN_TBA: `0x${string}` = getAddress('0xc33f0A7FcD69Ba00b4e980463199CD38E30d0E5c')

const TOKENID_IN_EOA: string = '10010'
const TOKENID_IN_TBA: string = '10011'

async function getZora721Balance({publicClient, walletAddress}:{publicClient: PublicClient, walletAddress: `0x${string}`}) {
  return await publicClient.readContract({
    address: ZORA_WEBB_TOKEN_PROXY_ADDRESS,
    abi: zora721DropABI,
    functionName: 'balanceOf',
    args: [walletAddress]
  })
}

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
        console.log(`\x1b[94m ${testName}-----> anvil.start() \x1b[0m`)
        
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
          to: ANVIL_USER_0
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
          account: ANVIL_USER_0,
          ...prepared721Mint
        })
      }
      else if (signer) {  
        mintTxHash = await signer.sendTransaction({
          chainId: ACTIVE_CHAIN.id,
          ...prepared721Mint
        }).then((tx: providers.TransactionResponse) => tx.hash)
      }

      const zoraBalanceInAnvilWallet = await getZora721Balance({publicClient, walletAddress: ANVIL_USER_0})

      await waitFor(() => {
        expect(mintLogs.length).toBe(mintQuantity)
        expect(mintTxHash).toMatch(ADDRESS_REGEX)
        expect(ZORA_WEBB_TOKEN.tokenId).toBe(TOKENID_IN_EOA)
        expect(zoraBalanceInAnvilWallet).toBe(2n)
        unwatch()
      })

    }, TIMEOUT)

    it('can transfer one of the minted NFTs to the TBA', async () => {

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
        to: ZORA_WEBB_TOKEN_PROXY_ADDRESS,
        value: 0n,
        data: transferCallData,
      }

      let transferHash: `0x${string}`

      if (walletClient) {
        transferHash = await walletClient.sendTransaction({
          chain: ACTIVE_CHAIN,
          account: walletClient.account!.address,
          ...preparedNFTTransfer
        })
      }
      else {  
        transferHash = await signer.sendTransaction({
          chainId: ACTIVE_CHAIN.id,
          ...preparedNFTTransfer
        }).then((tx: providers.TransactionResponse) => tx.hash)
      }

      const transactionReceipt = await publicClient.getTransactionReceipt({ 
        hash: transferHash
      })

      const tbaNFTBalance = await getZora721Balance({publicClient, walletAddress: ZORA_WEBB_TOKEN_TBA})
      console.log('# of NFTs in TBA: ', tbaNFTBalance)
      
      await waitFor(() => {
        expect(transferHash).toMatch(ADDRESS_REGEX)
        expect(transactionReceipt.status).toBe('success')
        expect(tbaNFTBalance).toBe(1n)
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

      const preparedETHTransfer = {
        to: ZORA_WEBB_TOKEN_TBA,
        value: ethAmountWei,
        // data is optional if nil
      }

      let transferHash: `0x${string}`
      if (walletClient) {
        transferHash = await walletClient.sendTransaction({
          chain: ACTIVE_CHAIN,
          account: walletClient.account!.address,
          ...preparedETHTransfer
        })
      } else {  
        transferHash = await signer.sendTransaction({
          chainId: ACTIVE_CHAIN.id,
          ...preparedETHTransfer
        }).then((tx: providers.TransactionResponse) => tx.hash)
      }

      const balanceAfter = await publicClient.getBalance({ 
        address: ZORA_WEBB_TOKEN_TBA,
      })

      await waitFor(() => {
        expect(transferHash).toMatch(ADDRESS_REGEX)
        expect(balanceAfter).toBe(ethAmountWei)
      })
      
    }, TIMEOUT)

    it('can executeCall with the TBA', async () => {

      const executedCallTxHash = await tokenboundClient.executeCall({
        account: ZORA_WEBB_TOKEN_TBA,
        to: ZORA_WEBB_TOKEN_PROXY_ADDRESS,
        value: 0n,
        data: '',
      })

      const transactionReceipt = await publicClient.getTransactionReceipt({ 
        hash: executedCallTxHash
      })

      await waitFor(() => {
        expect(executedCallTxHash).toMatch(ADDRESS_REGEX)
        expect(transactionReceipt.status).toMatch('success')
      })
    }, TIMEOUT)

    it('can transferETH with the TBA', async () => {

      const EXPECTED_BALANCE_BEFORE = parseUnits('1', 18)
      const EXPECTED_BALANCE_AFTER = parseUnits('0.5', 18)

      const balanceBefore = await publicClient.getBalance({ 
        address: ZORA_WEBB_TOKEN_TBA,
      })
      const ethTransferHash = await tokenboundClient.transferETH({
        account: ZORA_WEBB_TOKEN_TBA,
        amount: 0.5,
        recipientAddress: ANVIL_USER_1
      })
      const balanceAfter = await publicClient.getBalance({ 
        address: ZORA_WEBB_TOKEN_TBA,
      })

      console.log('BEFORE: ', formatEther(balanceBefore), 'AFTER: ', formatEther(balanceAfter))

      await waitFor(() => {
        expect(ethTransferHash).toMatch(ADDRESS_REGEX)
        expect(balanceBefore).toBe(EXPECTED_BALANCE_BEFORE)
        expect(balanceAfter).toBe(EXPECTED_BALANCE_AFTER)
      })
    })

    it('can transferNFT with the TBA', async () => {
      const transferNFTHash = await tokenboundClient.transferNFT({
        account: ZORA_WEBB_TOKEN_TBA,
        tokenType: 'ERC721',
        tokenContract: ZORA_WEBB_TOKEN_PROXY_ADDRESS,
        tokenId: TOKENID_IN_TBA,
        recipientAddress: ANVIL_USER_1,
      })

      const anvilAccount1NFTBalance = await getZora721Balance({publicClient, walletAddress: ANVIL_USER_1})

      await waitFor(() => {
        expect(transferNFTHash).toMatch(ADDRESS_REGEX)
        expect(anvilAccount1NFTBalance).toBe(1n)
      })
    })

    // it('can mint an 1155', async () => {

    //   const ethToWei = function (eth: number) {
    //     return parseUnits(eth.toString(), 18)
    //   }

    //   // Stapleverse 'Pidge in Hand' drop: https://zora.co/collect/eth:0xafd7b9edc5827f7e39dcd425d8de8d4e1cb292c1/3
    //   const zora1155MinterAddress = getAddress('0x8A1DBE9b1CeB1d17f92Bebf10216FCFAb5C3fbA7') // IMinter1155 minter contract is FIXED_PRICE_SALE_STRATEGY from https://github.com/ourzora/zora-1155-contracts/blob/main/addresses/1.json
    //   // proxyContractAddress: `0x${string}` = '0xafd7b9edc5827f7e39dcd425d8de8d4e1cb292c1'
    //   const stapleversePidgeInHandDrop = {
    //     proxyContractAddress: getAddress('0xafd7b9edc5827f7e39dcd425d8de8d4e1cb292c1'), // proxy address
    //     tokenId: BigInt(3),
    //     mintFee: ethToWei(0.025), // 0.025 ETH
    //     quantity: BigInt(1),
    //   }

    //   const minterArguments: `0x${string}` = encodeAbiParameters(
    //     parseAbiParameters('address'),
    //     [address]
    //   )

    //   // const {
    //   //   config,
    //   //   // error
    //   //   } = usePrepareContractWrite({
    //   //   chainId: 1,
    //   //   account: address,
    //   //   abi: zora1155ABI,
    //   //   address: stapleversePidgeInHandDrop.proxyContractAddress,
    //   //   functionName: 'mint',
    //   //   walletClient,
    //   //   value: stapleversePidgeInHandDrop.mintFee,
    //   //   args: [
    //   //     zora1155MinterAddress,
    //   //     stapleversePidgeInHandDrop.tokenId,
    //   //     stapleversePidgeInHandDrop.quantity,
    //   //     minterArguments,
    //   //   ],
    //   //   })


    // })

    
    test.todo('can transferNFT with an 1155', async () => {})
    test.todo('can transferERC20', async () => {})

  })
}

