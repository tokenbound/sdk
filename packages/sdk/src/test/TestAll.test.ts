import { 
  //assert,
  // beforeEach,
  describe, expect, it } from 'vitest'
import { 
  // foundry, 
  mainnet
 } from 'viem/chains'

 import { zora721DropABI } from './wagmi-cli-hooks/generated'

import { waitFor} from './mockWallet'
import { createAnvil, CreateAnvilOptions, 
  // getVersion as getAnvilVersion, startProxy, createProxy, createPool
} from '@viem/anvil'
import { WalletClient, PublicClient,
   createWalletClient, http, getAddress,
  formatEther,
  // createTestClient,
  // Account,
  encodeFunctionData,
  // getContract,
  Log,
  // Abi,
  parseUnits
 } from 'viem'
import { CreateAccountParams, 
  // erc6551AccountAbi,
   TokenboundClient } from '@tokenbound/sdk'
import { ADDRESS_REGEX, ANVIL_ACCOUNTS, ANVIL_RPC_URL } from './constants'
import { 
  getPublicClient, 
  shellCommand } from './utils'
import { erc721Abi } from '../../abis'

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
const zoraWebbERC721ProxyAddress = getAddress('0x28ee638f2fcb66b4106acab7efd225aeb2bd7e8d')
const ZORA_WEBB_TOKEN_TBA: `0x${string}` = getAddress('0xc33f0A7FcD69Ba00b4e980463199CD38E30d0E5c')
const ZORA_WEBB_TOKEN_SUPPLY: string = '10010'
const ZORA_WEBB_TOKEN_SUPPLY_IN_TBA: string = '10011'

// @BJ TODO: figure out how to deal with viem + ethers + generate mnemonic wallets
describe('ComboTester', () => {
  runTxTestsWithSigner('BASE TEST')
})


function runTxTestsWithSigner(
  signerName: string,
  // signerOrWalletClient
) {
  describe(signerName, () => {

    const anvil = createAnvil(
      {...ANVIL_CONFIG}
    )

    let publicClient: PublicClient
    let walletClient: WalletClient
    let tokenboundClient: TokenboundClient
    // let zoraWebbERC721TokenId: string

    let ZORA_WEBB_TOKEN: CreateAccountParams
    // let ZORA_WEBB_TOKEN_IN_TBA: CreateAccountParams

    //@BJ TODO: change vitest environment: 'jsdom' to 'node' ?

    beforeAll(async () => { // Runs before the first test
      
      try {
        publicClient = getPublicClient({ chainId: ACTIVE_CHAIN.id })

        // @BJ TODO: use mnemonic account
        // const mnemonicAccount = mnemonicToAccount('legal winner thank year wave sausage worth useful legal winner thank yellow') 

        walletClient = createWalletClient({
          transport: http(ANVIL_RPC_URL),
          chain: ACTIVE_CHAIN,
          // account: mnemonicAccount,
          account: getAddress(ANVIL_ACCOUNTS[0].address),
          key: ANVIL_ACCOUNTS[0].privateKey,
          pollingInterval: 100,
        }) //or getMockWalletClient()
        
        tokenboundClient = new TokenboundClient({ walletClient, chainId: ACTIVE_CHAIN.id })
        // console.log(tokenboundClient)

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

      const unwatch = publicClient.watchContractEvent({
        address: zoraWebbERC721ProxyAddress,
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
            tokenContract: zoraWebbERC721ProxyAddress,
            tokenId: tokenId!.toString()
          }

        }
      })


      // Mint a Zora 721 NFT
      const mintPrice = BigInt(0)
      const mintQuantity = 2
      const encodedMintFunctionData = encodeFunctionData({
        abi: zora721DropABI,
        functionName: 'purchase',
        args: [BigInt(mintQuantity)]
      })
      
      const prepared721Mint = {
        to: zoraWebbERC721ProxyAddress,
        value: mintPrice * BigInt(mintQuantity),
        data: encodedMintFunctionData,
      }

      const mintTxHash = await walletClient.sendTransaction({
        chain: ACTIVE_CHAIN,
        account: getAddress(ANVIL_ACCOUNTS[0].address),
        ...prepared721Mint
      })

      await waitFor(() => {
        expect(mintLogs.length).toBe(mintQuantity)
        expect(mintTxHash).toMatch(ADDRESS_REGEX)
        expect(ZORA_WEBB_TOKEN.tokenId).toBe(ZORA_WEBB_TOKEN_SUPPLY)
        unwatch()
      })

    }, TIMEOUT)

    it('can transfer one of the minted NFTs to the TBA', async () => {

      const transferCallData = encodeFunctionData({
        abi: erc721Abi,
        functionName: 'safeTransferFrom',
        args: [
          ANVIL_ACCOUNTS[0].address,
          ZORA_WEBB_TOKEN_TBA,
          parseInt(ZORA_WEBB_TOKEN_SUPPLY_IN_TBA),
        ],
      })

      const transferHash = await walletClient.sendTransaction({
        chain: ACTIVE_CHAIN,
        account: getAddress(ANVIL_ACCOUNTS[0].address),
        to: ZORA_WEBB_TOKEN_TBA,
        value: 0n,
        data: transferCallData,
      })

      await waitFor(() => {
        expect(transferHash).toMatch(ADDRESS_REGEX)
      })
      
    })

    it('can transfer ETH to the TBA', async () => {

      const ETH_AMOUNT = 1
      const ETH_AMOUNT_IN_WEI = parseUnits(`${ETH_AMOUNT}`, 18)
      
      const transferHash = await walletClient.sendTransaction({
        chain: ACTIVE_CHAIN,
        account: getAddress(ANVIL_ACCOUNTS[0].address),
        to: ZORA_WEBB_TOKEN_TBA,
        value: ETH_AMOUNT_IN_WEI,
        data: '0x',
      })

      // TODO: get Balance of ZORA_WEBB_TOKEN_TBA

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

    it('can executeCall', async () => {
      const executedCallTxHash = await tokenboundClient.executeCall({
        account: ANVIL_ACCOUNTS[0].address, // @BJ TODO: This needs to be the TOKENBOUND account address
        // account: ZORA_WEBB_TOKEN_10009_TBA,
        to: ANVIL_ACCOUNTS[1].address,
        value: 0n,
        data: '0x',
      })

      await waitFor(() => {
        expect(executedCallTxHash).toMatch(ADDRESS_REGEX)
      })
    })

    // it('can transferETH with the TBA', async () => {

    //   const balanceBeforeTransfer = await publicClient.getBalance({ 
    //     address: ZORA_WEBB_TOKEN_TBA,
    //   })
    //   const ethTransferHash = await tokenboundClient.transferETH({
    //     account: ZORA_WEBB_TOKEN_TBA,
    //     amount: 0.5,
    //     recipientAddress: ANVIL_ACCOUNTS[1].address
    //   })
    //   const balanceAfterTransfer = await publicClient.getBalance({ 
    //     address: ZORA_WEBB_TOKEN_TBA,
    //   })

    //   console.log('BALANCE BEFORE TRANSFER IN ETH: ', formatEther(balanceBeforeTransfer))
    //   console.log('ETH TRANSFER HASH: ', ethTransferHash)
    //   console.log('BALANCE AFTER TRANSFER IN ETH: ', formatEther(balanceAfterTransfer))

    //   await waitFor(() => {
    //       expect(ethTransferHash).toMatch(ADDRESS_REGEX)
    //       expect(balanceBeforeTransfer).toBe(1)
    //       expect(balanceAfterTransfer).toBe(0.5)
    //   })
    // })

    // it('can transferNFT with the TBA', async () => {
    //   const transferNFTHash = await tokenboundClient.transferNFT({
    //     // account: ANVIL_ACCOUNTS[0].address, // @BJ TODO: This needs to be the TOKENBOUND account address
    //     account: ZORA_WEBB_TOKEN_TBA, // @BJ TODO: This needs to be the TOKENBOUND account address
    //     tokenType: 'ERC721',
    //     tokenContract: ZORA_WEBB_TOKEN.tokenContract,
    //     // tokenId: ZORA_WEBB_TOKEN.tokenId,
    //     tokenId: ZORA_WEBB_TOKEN_SUPPLY_IN_TBA,
    //     recipientAddress: ANVIL_ACCOUNTS[1].address,
    //     // recipientAddress: ZORA_WEBB_TOKEN_TBA,
    //   })

    //   await waitFor(() => {
    //     expect(transferNFTHash).toMatch(ADDRESS_REGEX)
    //   })
    // })
    
    // test.todo('can transferNFT', async () => {})
    test.todo('can transferERC20', async () => {})

  })
}
