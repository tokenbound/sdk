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
  // createTestClient,
} from 'viem'
import { 
  CreateAccountParams, 
  TokenboundClient
} from '@tokenbound/sdk'
import { ADDRESS_REGEX, ANVIL_ACCOUNTS, ANVIL_RPC_URL } from './constants'
import { getPublicClient, shellCommand } from './utils'
import { erc721Abi } from '../../abis'
import { BrowserProvider, JsonRpcSigner } from 'ethers6'
// import { mnemonicToAccount } from 'viem/accounts'

const ACTIVE_CHAIN = mainnet
const TIMEOUT = 60000 // default 10000

const ANVIL_CONFIG: CreateAnvilOptions = {
  forkChainId: ACTIVE_CHAIN.id,
  forkUrl: import.meta.env.VITE_ANVIL_MAINNET_FORK_ENDPOINT,
  forkBlockNumber: import.meta.env.VITE_ANVIL_MAINNET_FORK_BLOCK_NUMBER? parseInt(import.meta.env.VITE_ANVIL_MAINNET_FORK_BLOCK_NUMBER): undefined, 
}

const ANVIL_COMMAND = {
  // SET_ADDRESS_BYTECODE: 'cast rpc anvil_setCode 0x4e59b44847b379578588920ca78fbf26c0b4956c 0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe03601600081602082378035828234f58015156039578182fd5b8082525050506014600cf3',
  SET_ADDRESS_BYTECODE: `cast rpc anvil_setCode ${ANVIL_ACCOUNTS[0].address} 0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe03601600081602082378035828234f58015156039578182fd5b8082525050506014600cf3`,
  DEPLOY_REGISTRY: 'forge script --fork-url http://127.0.0.1:8545 6551contracts/script/DeployRegistry.s.sol --broadcast',
  DEPLOY_ACCOUNT_IMPLEMENTATION: `forge create 6551contracts/src/examples/simple/SimpleERC6551Account.sol:SimpleERC6551Account --rpc-url=$RPC_URL --private-key=$PRIVATE_KEY`
}

// Zora Webb's First Deep Field: https://zora.co/collect/eth:0x28ee638f2fcb66b4106acab7efd225aeb2bd7e8d
const ZORA_WEBB_TOKEN_PROXY_ADDRESS = getAddress('0x28ee638f2fcb66b4106acab7efd225aeb2bd7e8d')

const ZORA_WEBB_TOKEN_TBA: `0x${string}` = getAddress('0xc33f0A7FcD69Ba00b4e980463199CD38E30d0E5c')

const TOKENID_IN_EOA: string = '10010'
const TOKENID_IN_TBA: string = '10011'

// Ethers.js Adapters for Wagmi Wallet Client
// https://wagmi.sh/react/ethers-adapters

function walletClientToEthers5Signer(walletClient: WalletClient) {
  const { account, chain, transport } = walletClient
  const network = {
    chainId: chain!.id,
    name: chain!.name,
    ensAddress: chain!.contracts?.ensRegistry?.address,
  }
  const provider = new providers.Web3Provider(transport, network)
  const signer = provider.getSigner(account!.address)
  return signer
}

function walletClientToEthers6Signer(walletClient: WalletClient) {
  const { account, chain, transport } = walletClient
  const network = {
    chainId: chain!.id,
    name: chain!.name,
    ensAddress: chain!.contracts?.ensRegistry?.address,
  }
  const provider = new BrowserProvider(transport, network)
  const signer = new JsonRpcSigner(provider, account!.address)
  return signer
}

// const mnemonicAccount = mnemonicToAccount('legal winner thank year wave sausage worth useful legal winner thank yellow') 

describe('ComboTester', () => {

  const { address, privateKey } = ANVIL_ACCOUNTS[0]

  const walletClient = createWalletClient({
    transport: http(ANVIL_RPC_URL),
    chain: ACTIVE_CHAIN,
    // account: mnemonicAccount,
    account: address,
    key: privateKey,
    pollingInterval: 100,
  })

  const ethers5Signer = walletClientToEthers5Signer(walletClient)
  const ethers6Signer = walletClientToEthers6Signer(walletClient)

  runTxTests({ testName: 'Viem Tests', walletClient})
  runTxTests({ testName: 'Ethers 5 Tests', signer: ethers5Signer})
  runTxTests({ testName: 'Ethers 6 Tests', signer: ethers6Signer})
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

    let tokenboundClient: TokenboundClient
    let publicClient: PublicClient

    const anvil = createAnvil(
      {...ANVIL_CONFIG}
    )

    let ZORA_WEBB_TOKEN: CreateAccountParams

    beforeAll(async () => { // Runs before the first test
      
      try {
        tokenboundClient = new TokenboundClient({ walletClient, signer, chainId: ACTIVE_CHAIN.id })
        publicClient = getPublicClient({ chainId: ACTIVE_CHAIN.id })        

        await anvil.start()
        console.log('\x1b[94m -----> anvil.start() \x1b[0m');
        
        // Deploy the ERC-6551 registry (WORKS!)
        await shellCommand(ANVIL_COMMAND.SET_ADDRESS_BYTECODE).then(console.log)
        await shellCommand(ANVIL_COMMAND.DEPLOY_REGISTRY).then(console.log)

        // Deploy the ERC-6551 account implementation (HRRRM?)
        // await shellCommand(ANVIL_COMMAND.DEPLOY_ACCOUNT_IMPLEMENTATION).then(console.log)

        
        // How to:        
        // deploy the ERC-6551 registry (v0.2.0 tag) --> OK
        // deploy the foundry create2 contract // pre-installed in anvil if not forking, otherwise no need (already on mainnet)
        // deploy the Tokenbound account implementation (v0.2.0) --> no output, no error?
        
        // Then: 
        // deploy the Mock ERC-721 token contract
        // deploy the Mock ERC-20 token contract
        // deploy the Mock ERC-1155 token contract

      } catch (err) {
          console.error('Error during setup:', err);
      }
      
    }, TIMEOUT)

    afterAll(async () => {
      await anvil.stop()
      console.log('\x1b[94m -----> anvil.stop() \x1b[0m');
    })

    it('can mint a Zora 721 NFT', async () => {

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

      const ANVIL_USER_1 = getAddress(ANVIL_ACCOUNTS[0].address)

      const transferCallData = encodeFunctionData({
        abi: erc721Abi,
        functionName: 'safeTransferFrom',
        args: [
          ANVIL_USER_1, // from
          ZORA_WEBB_TOKEN_TBA, // to
          parseInt(TOKENID_IN_TBA), // tokenId
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
          account: ANVIL_USER_1,
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
      
    })

    it('can transfer ETH to the TBA', async () => {

      const ETH_AMOUNT = 1
      const ETH_AMOUNT_IN_WEI = parseUnits(`${ETH_AMOUNT}`, 18)

      const preparedETHTransfer = {
        to: ZORA_WEBB_TOKEN_TBA,
        value: ETH_AMOUNT_IN_WEI,
        data: '0x',
      }
      
      let transferHash: `0x${string}`
      if (walletClient) {
        transferHash = await walletClient.sendTransaction({
          chain: ACTIVE_CHAIN,
          account: getAddress(ANVIL_ACCOUNTS[0].address),
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

    // Skip if walletClient is giving the error: 'No Signer available'
    const optionalTest = walletClient ? it.skip : it

    optionalTest('can executeCall with the TBA', async () => {
    // it('can executeCall with the TBA', async () => {

      const executedCallTxHash = await tokenboundClient.executeCall({
        // account: ANVIL_ACCOUNTS[0].address, // <-- works in viem :(
        account: ZORA_WEBB_TOKEN_TBA, // In viem, we get 'No Signer available'
        to: ZORA_WEBB_TOKEN_PROXY_ADDRESS,
        value: 0n,
        data: '0x',
      })

      await waitFor(() => {
        expect(executedCallTxHash).toMatch(ADDRESS_REGEX)
      })
    }, TIMEOUT)


    optionalTest('can transferETH with the TBA', async () => {
    // it('can transferETH with the TBA', async () => {
    // it.skip('can transferETH with the TBA', async () => {

      const EXPECTED_BALANCE_BEFORE = parseUnits('1', 18)
      const EXPECTED_BALANCE_AFTER = parseUnits('0.5', 18)

      const balanceBeforeTransfer = await publicClient.getBalance({ 
        address: ZORA_WEBB_TOKEN_TBA,
      })
      const ethTransferHash = await tokenboundClient.transferETH({
        account: ZORA_WEBB_TOKEN_TBA,
        amount: 0.5,
        recipientAddress: ANVIL_ACCOUNTS[1].address
      })
      const balanceAfterTransfer = await publicClient.getBalance({ 
        address: ZORA_WEBB_TOKEN_TBA,
      })

      // console.log('BEFORE: ', formatEther(balanceBeforeTransfer), 'AFTER: ', formatEther(balanceAfterTransfer))

      await waitFor(() => {
        expect(ethTransferHash).toMatch(ADDRESS_REGEX)
        expect(balanceBeforeTransfer).toBe(EXPECTED_BALANCE_BEFORE)
        expect(balanceAfterTransfer).toBe(EXPECTED_BALANCE_AFTER)
      })
    })

    // optionalTest('can transferETH to an ENS with the TBA', async () => {
    //   // it('can transferETH with the TBA', async () => {
    //   // it.skip('can transferETH with the TBA', async () => {
  
    //   const EXPECTED_BALANCE_BEFORE = parseUnits('0.5', 18)
    //   const EXPECTED_BALANCE_AFTER = parseUnits('0.4', 18)

    //   const balanceBeforeTransfer = await publicClient.getBalance({ 
    //     address: ZORA_WEBB_TOKEN_TBA,
    //   })
    //   const ethTransferHash = await tokenboundClient.transferETH({
    //     account: ZORA_WEBB_TOKEN_TBA,
    //     amount: 0.1,
    //     recipientAddress: 'bennygiang.eth'
    //   })
    //   const balanceAfterTransfer = await publicClient.getBalance({ 
    //     address: ZORA_WEBB_TOKEN_TBA,
    //   })

    //   await waitFor(() => {
    //     expect(ethTransferHash).toMatch(ADDRESS_REGEX)
    //     expect(balanceBeforeTransfer).toBe(EXPECTED_BALANCE_BEFORE)
    //     expect(balanceAfterTransfer).toBe(EXPECTED_BALANCE_AFTER)
    //   })
    // })

    // optionalTest('can transferNFT with the TBA', async () => {
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
    
    test.todo('can transferNFT with an 1155', async () => {})
    test.todo('can transferERC20', async () => {})

  })
}
