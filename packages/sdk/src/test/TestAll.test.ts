import { 
  //assert,
  beforeEach, describe, expect, it } from 'vitest'
import { 
  foundry, 
  mainnet
 } from 'viem/chains'

import { waitFor} from './mockWallet'
import { createAnvil, CreateAnvilOptions, 
  // getVersion as getAnvilVersion, startProxy, createProxy, createPool
} from '@viem/anvil'
import { WalletClient, PublicClient,
   createWalletClient, http, getAddress, Chain,
  formatEther
 } from 'viem'
import { TokenboundClient } from '@tokenbound/sdk'
import { ADDRESS_REGEX, ANVIL_ACCOUNTS, ANVIL_RPC_URL } from './constants'
import { 
  getPublicClient, 
  shellCommand } from './utils'

const ENABLED_CHAINS: Record<string, Chain> = {
  foundry: foundry,
  mainnet: mainnet
};

const ACTIVE_CHAIN = ENABLED_CHAINS.foundry

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



const LIL_NOUN_606 = {
  tokenContract: getAddress('0x4b10701bfd7bfedc47d50562b76b436fbb5bdb3b'),
  tokenId: '606',
  
   
}

const LIL_NOUN_606_COMPUTED_TBA: `0x${string}` = ACTIVE_CHAIN === mainnet
? getAddress('0xe0EC35bEfd398ad34C13033416C4c424a89718cf')
: getAddress('0xBDC93d631F6207887B48337ea412ceC938D0a972')


// @BJ TODO: figure out how to deal with viem + ethers + generate mnemonic wallets
describe('ComboTester', () => {
  runTxTestsWithSigner('BASE TEST')
  // runTxTestsWithSigner('<EthersSignerTester />', EthersSignerTester)
  // runTxTestsWithSigner('<Ethers6SignerTester />', Ethers6SignerTester)
  // runTxTestsWithSigner('<WalletClientTester />', WalletClientTester)
})

// const TEST_TIMEOUT = 30000 // default 10000
const TEST_TIMEOUT = 120000 // default 10000
// const TEST_TIMEOUT = 240000 // default 10000



function runTxTestsWithSigner(
  signerName: string,
  // signerOrWalletClient
) {
  describe(signerName, () => {

    let publicClient: PublicClient
    let walletClient: WalletClient
    let tokenboundClient: TokenboundClient

    const anvil = createAnvil(
      {...ANVIL_CONFIG}
    )

    //@BJ TODO: change vitest environment: 'jsdom' to 'node' ?

    // beforeAll(async () => { // Runs before the first test
    beforeEach(async () => { // Runs before each test
      
      try {
        publicClient = getPublicClient({ chainId: ACTIVE_CHAIN.id })

        walletClient = createWalletClient({
          transport: http(ANVIL_RPC_URL),
          chain: ACTIVE_CHAIN,
          account: getAddress(ANVIL_ACCOUNTS[0].address),
          key: ANVIL_ACCOUNTS[0].privateKey,
          pollingInterval: 100,
      }) //or getMockWalletClient()

        await anvil.start()
        console.log('\x1b[94m -----> anvil.start() \x1b[0m');
        
        // Deploy the ERC-6551 registry
        await shellCommand(ANVIL_COMMAND.SET_ADDRESS_BYTECODE).then(console.log)
        await shellCommand(ANVIL_COMMAND.DEPLOY_REGISTRY).then(console.log)

        // Deploy the ERC-6551 account implementation
        await shellCommand(ANVIL_COMMAND.DEPLOY_ACCOUNT_IMPLEMENTATION).then(console.log)


        // How to:
        
        // deploy the ERC-6551 registry (v0.2.0 tag) --> OK
        // deploy the foundry create2 contract // pre-installed in anvil if not forking, otherwise no
        // deploy the Tokenbound account implementation (v0.2.0) --> no output, no error?
        
        // Above 3 have a deployment guide in the docs


        // Then: 
        // deploy the Mock ERC-721 token contract
        // deploy the Mock ERC-20 token contract
        // deploy the Mock ERC-1155 token contract

        tokenboundClient = new TokenboundClient({ walletClient, chainId: ACTIVE_CHAIN.id })

        // console.log('TOKENBOUND CLIENT:', tokenboundClient)

      } catch (err) {
          console.error('Error during setup:', err);
      }
      
    }, TEST_TIMEOUT)

    afterEach(async () => {
      await anvil.stop()
      console.log('\x1b[94m -----> anvil.stop() \x1b[0m');
    })

    it('can createAccount', async () => {
      const createdAccount = await tokenboundClient.createAccount(LIL_NOUN_606)
      await waitFor(() => {
        expect(createdAccount).toMatch(ADDRESS_REGEX)
        expect(createdAccount).toEqual(LIL_NOUN_606_COMPUTED_TBA)
      })
    })

    it('can getAccount', async () => {
      const getAccount = tokenboundClient.getAccount(LIL_NOUN_606)
      await waitFor(() => {
        expect(getAccount).toMatch(ADDRESS_REGEX)
        expect(getAccount).toEqual(LIL_NOUN_606_COMPUTED_TBA)
      })
    })

    it('can executeCall', async () => {
      const executedCallTxHash = await tokenboundClient.executeCall({
        account: ANVIL_ACCOUNTS[0].address, // @BJ TODO: This needs to be the TOKENBOUND account address
        to: ANVIL_ACCOUNTS[0].address,
        value: 0n,
        data: '0x',
      })

      await waitFor(() => {
        expect(executedCallTxHash).toMatch(ADDRESS_REGEX)
      })
    })

    // it('can transferETH', async () => {

    //   const balanceBeforeTransfer = await publicClient.getBalance({ 
    //     address: ANVIL_ACCOUNTS[0].address,
    //   })

    //   // console.log('BALANCE BEFORE TRANSFER: ', balanceBeforeTransfer)
    //   console.log('BALANCE BEFORE TRANSFER IN ETH: ', formatEther(balanceBeforeTransfer))
    //   const ethTransferHash = await tokenboundClient.transferETH({
    //     account: ANVIL_ACCOUNTS[0].address,
    //     amount: 1,
    //     recipientAddress: ANVIL_ACCOUNTS[1].address
    //   })

    //   console.log('ETH TRANSFER HASH: ', ethTransferHash)
    //   const balanceAfterTransfer = await publicClient.getBalance({ 
    //     address: ANVIL_ACCOUNTS[0].address,
    //   })

    //   // console.log('BALANCE AFTER TRANSFER: ', balanceAfterTransfer)
    //   console.log('BALANCE AFTER TRANSFER IN ETH: ', formatEther(balanceAfterTransfer))

    //   await waitFor(() => {
    //       expect(ethTransferHash).toMatch(ADDRESS_REGEX)
    //       // expect(true).toBe(true)
    //   })
    // })

    test.todo('can transferNFT', async () => {})
    test.todo('can transferERC20', async () => {})

  })
}
