// This test suite is for testing SDK methods with
// viem walletClient + publicClient and Ethers 5/6.
import { foundry, zora } from 'viem/chains'
import { describe, beforeAll, afterAll, test, expect, it, vi } from 'vitest'
import { ethers, providers } from 'ethers'
import { waitFor } from './mockWallet'
import { createAnvil } from '@viem/anvil'
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
  getContract,
  encodeAbiParameters,
  parseAbiParameters,
  isAddress,
  createPublicClient,
  createTestClient,
  publicActions,
  walletActions,
  parseEther,
} from 'viem'
import { mnemonicToAccount, privateKeyToAccount } from 'viem/accounts'
import {
  ADDRESS_REGEX,
  ANVIL_ACCOUNTS,
  ANVIL_RPC_URL,
  WETH_CONTRACT_ADDRESS,
  ANVIL_MNEMONIC,
} from './constants'
import { resolvePossibleENS } from '../utils'
import {
  ethToWei,
  getPublicClient,
  getWETHBalance,
  // debugTransaction,
  getZora1155Balance,
  getZora721Balance,
} from './utils'
import { ANVIL_CONFIG, CREATE_ANVIL_OPTIONS, zora721, zora1155 } from './config'
import { wethABI } from './wagmi-cli-hooks/generated'
import { ERC_6551_DEFAULT, ERC_6551_LEGACY_V2 } from '../constants'
import { TBImplementationVersion, TBVersion } from '../types'
import { JsonRpcSigner, JsonRpcProvider } from 'ethers6'
import { erc721ABI } from 'wagmi'
import { CreateAccountParams, TokenboundClient } from '../'

const TIMEOUT = 60000 // default 10000
const ANVIL_USER_0 = getAddress(ANVIL_ACCOUNTS[0].address)
const ANVIL_USER_1 = getAddress(ANVIL_ACCOUNTS[1].address)

const anvilAccount0 = mnemonicToAccount(ANVIL_MNEMONIC)
const anvilAccount1 = mnemonicToAccount(ANVIL_MNEMONIC, { addressIndex: 1 })
const publicClient = createPublicClient({
  chain: ANVIL_CONFIG.ACTIVE_CHAIN,
  transport: http(ANVIL_RPC_URL),
})
const walletClient = createWalletClient({
  chain: ANVIL_CONFIG.ACTIVE_CHAIN,
  transport: http(ANVIL_RPC_URL),
  account: privateKeyToAccount(ANVIL_ACCOUNTS[0].privateKey),
})
const testClient = createTestClient({
  chain: ANVIL_CONFIG.ACTIVE_CHAIN,
  transport: http(ANVIL_RPC_URL),
  mode: 'anvil',
})
  .extend(publicActions)
  .extend(walletActions)

const ethers5Provider = new ethers.providers.JsonRpcProvider(ANVIL_RPC_URL)
const ethers5Signer = new ethers.Wallet(ANVIL_ACCOUNTS[0].privateKey, ethers5Provider)

const ethers6Provider = new JsonRpcProvider(ANVIL_RPC_URL)
const ethers6Signer = new JsonRpcSigner(ethers6Provider, ANVIL_USER_0)

type TestConfig = {
  label: string
  config: {
    walletClient?: WalletClient
    signer?: any
    publicClientRPCUrl?: string
    version?: TBImplementationVersion
    implementationAddress?: `0x${string}`
    registryAddress?: `0x${string}`
  }
}

const BASE_CONFIGURATION = {
  chainId: ANVIL_CONFIG.ACTIVE_CHAIN.id,
}
const ALL_CONFIGURATIONS: Array<TestConfig> = [
  {
    label: 'viem v2',
    config: {
      ...BASE_CONFIGURATION,
      publicClientRPCUrl: ANVIL_RPC_URL,
      walletClient,
      version: TBVersion.V2,
      implementationAddress: ERC_6551_LEGACY_V2.IMPLEMENTATION.ADDRESS,
      registryAddress: ERC_6551_LEGACY_V2.REGISTRY.ADDRESS,
    },
  },
  {
    label: 'ethers@5 v2',
    config: {
      ...BASE_CONFIGURATION,
      publicClientRPCUrl: ANVIL_RPC_URL,
      signer: ethers5Signer,
      version: TBVersion.V2,
      implementationAddress: ERC_6551_LEGACY_V2.IMPLEMENTATION.ADDRESS,
      registryAddress: ERC_6551_LEGACY_V2.REGISTRY.ADDRESS,
    },
  },
  {
    label: 'ethers@6 v2',
    config: {
      ...BASE_CONFIGURATION,
      signer: ethers6Signer,
      version: TBVersion.V2,
    },
  },
  {
    label: 'viem v3',
    config: {
      ...BASE_CONFIGURATION,
      walletClient,
    },
  },
  {
    label: 'ethers@5 v3',
    config: {
      ...BASE_CONFIGURATION,
      signer: ethers5Signer,
    },
  },
  {
    label: 'ethers@6 v3',
    config: {
      ...BASE_CONFIGURATION,
      signer: ethers6Signer,
    },
  },
]

const V3_CONFIGURATIONS = ALL_CONFIGURATIONS.filter((config) =>
  config.label.includes('v3')
)
const V2_CONFIGURATIONS = ALL_CONFIGURATIONS.filter((config) =>
  config.label.includes('v2')
)

// Forcibly transfer any ERC-721 token from current owner to recipient
async function commandeerERC721({ tokenContract, tokenId, recipient }) {
  const currentOwner = await testClient.readContract({
    address: tokenContract,
    abi: erc721ABI,
    functionName: 'ownerOf',
    args: [tokenId],
  })

  // fund owner wallet
  await testClient.setBalance({
    address: currentOwner,
    value: parseEther('10'),
  })

  await testClient.impersonateAccount({ address: currentOwner })
  const hash = await testClient.writeContract({
    account: currentOwner,
    address: tokenContract,
    abi: erc721ABI,
    functionName: 'safeTransferFrom',
    args: [currentOwner, recipient, tokenId],
  })
  await testClient.waitForTransactionReceipt({ hash })
  await testClient.stopImpersonatingAccount({ address: currentOwner })
}

// Pass in the Anvil test walletClient + publicClient
// const tokenboundClient = new TokenboundClient({
//   chainId: ANVIL_CONFIG.ACTIVE_CHAIN.id,
//   walletClient,
//   signer,
//   publicClient,
//   implementationAddress: isV3 ? undefined : ERC6551_DEPLOYMENT.IMPLEMENTATION.ADDRESS,
//   registryAddress: isV3 ? undefined : ERC6551_DEPLOYMENT.REGISTRY.ADDRESS,
// })

describe('TokenboundClient', async () => {
  // const isV2 = version === TBVersion.V2
  // const isV3 = isV2 === false
  // const viemOnlyIt = walletClient ? it : it.skip // Skip tests that are non-functional in Ethers
  // const v3OnlyIt = isV3 ? it : it.skip
  // Set up Anvil instance + clients
  const anvil = createAnvil({ ...CREATE_ANVIL_OPTIONS })

  const TEST_ERC721 = {
    tokenContract: zora721.proxyContractAddress,
    tokenId: '1',
  }
  // const CUSTOM_SALT = 6551
  // let NFT_IN_EOA: CreateAccountParams
  // let TOKENID_IN_EOA: string
  // let TOKENID1_IN_TBA: string
  // let TOKENID2_IN_TBA: string
  // let ZORA721_TBA_ADDRESS: `0x${string}`
  // let ZORA721_TBA_ADDRESS_CUSTOM_SALT: `0x${string}`

  // const ERC6551_DEPLOYMENT = isV2 ? ERC_6551_LEGACY_V2 : ERC_6551_DEFAULT

  // Spin up a fresh anvil instance each time we run the test suite against a different signer
  beforeAll(async () => {
    try {
      if (anvil.status !== 'listening') {
        await anvil.start()
      }
    } catch (err) {
      console.error('Error during setup:', err)
    }
  }, TIMEOUT)

  afterAll(async () => {
    await anvil.stop()
  })

  beforeEach(async () => {
    await testClient.reset()
  })

  test.each(ALL_CONFIGURATIONS)('can get the SDK version $label', ({ config }) => {
    const tokenboundClient = new TokenboundClient(config)
    const sdkVersion: string = tokenboundClient.getSDKVersion()
    expect(sdkVersion).toBeDefined()
  })

  test.each(ALL_CONFIGURATIONS)('can create account $label', async ({ config }) => {
    const tokenboundClient = new TokenboundClient(config)
    const { account, txHash } = await tokenboundClient.createAccount(TEST_ERC721)

    const createdAccountTxReceipt = await publicClient.waitForTransactionReceipt({
      hash: txHash,
    })

    expect(isAddress(account)).toEqual(true)
    expect(createdAccountTxReceipt.status).toBe('success')

    const bytecode = await publicClient.getBytecode({ address: account })

    expect(bytecode?.length).toBeGreaterThan(0)
  })

  test.each(ALL_CONFIGURATIONS)(
    'can create account with custom salt $label',
    async ({ config }) => {
      const tokenboundClient = new TokenboundClient(config)
      const { account, txHash } = await tokenboundClient.createAccount({
        ...TEST_ERC721,
        salt: 6551,
      })
      console.log('CREATED ACCT WITH CUSTOM SALT', account)

      const createdAccountTxReceipt = await publicClient.waitForTransactionReceipt({
        hash: txHash,
      })

      expect(isAddress(account)).toEqual(true)
      expect(createdAccountTxReceipt.status).toBe('success')

      const bytecode = await publicClient.getBytecode({ address: account })

      expect(bytecode?.length).toBeGreaterThan(0)
    }
  )

  test.each(ALL_CONFIGURATIONS)(
    'can compute account address $label',
    async ({ config }) => {
      const tokenboundClient = new TokenboundClient(config)
      const computedAccount = tokenboundClient.getAccount(TEST_ERC721)
      const { account, txHash } = await tokenboundClient.createAccount(TEST_ERC721)

      await publicClient.waitForTransactionReceipt({ hash: txHash })

      expect(isAddress(computedAccount)).toEqual(true)
      expect(computedAccount).toEqual(account)
    }
  )

  test.each(ALL_CONFIGURATIONS)(
    'can compute account address with custom salt $label',
    async ({ config }) => {
      const tokenboundClient = new TokenboundClient(config)
      const accountData = {
        ...TEST_ERC721,
        salt: 6551,
      }
      const computedAccountWithoutSalt = tokenboundClient.getAccount(TEST_ERC721)
      const computedAccount = tokenboundClient.getAccount(accountData)
      const { account, txHash } = await tokenboundClient.createAccount(accountData)

      await publicClient.waitForTransactionReceipt({ hash: txHash })

      expect(isAddress(computedAccount)).toEqual(true)
      expect(computedAccount).toEqual(account)
      expect(computedAccountWithoutSalt).not.toEqual(computedAccount)
    }
  )

  test.each(ALL_CONFIGURATIONS)(
    'can check account deployment status $label',
    async ({ config }) => {
      const tokenboundClient = new TokenboundClient(config)
      const computedAccount = tokenboundClient.getAccount(TEST_ERC721)

      let isAccountDeployed = await tokenboundClient.checkAccountDeployment({
        accountAddress: computedAccount,
      })

      expect(isAccountDeployed).toEqual(false)

      const { txHash } = await tokenboundClient.createAccount(TEST_ERC721)

      await publicClient.waitForTransactionReceipt({ hash: txHash })

      isAccountDeployed = await tokenboundClient.checkAccountDeployment({
        accountAddress: computedAccount,
      })

      expect(isAccountDeployed).toEqual(true)
    }
  )

  // Execute a basic call with no value with the TBA to see if it works
  test.each(ALL_CONFIGURATIONS)(
    `can execute empty operation using account $label`,
    async ({ config }) => {
      const tokenboundClient = new TokenboundClient(config)
      await commandeerERC721({
        ...TEST_ERC721,
        recipient: ANVIL_USER_0,
      })
      const { account, txHash } = await tokenboundClient.createAccount(TEST_ERC721)
      await publicClient.waitForTransactionReceipt({ hash: txHash })

      const execution = {
        account: account,
        to: zora721.proxyContractAddress,
        value: 0n,
        data: '',
      }

      const hash = await tokenboundClient.execute(execution)

      const transactionReceipt = await publicClient.getTransactionReceipt({
        hash,
      })

      expect(transactionReceipt.status).toBe('success')
    },
    TIMEOUT
  )

  test.each(V2_CONFIGURATIONS)(
    `can call executeCall $label`,
    async ({ config }) => {
      const tokenboundClient = new TokenboundClient(config)
      await commandeerERC721({
        ...TEST_ERC721,
        recipient: ANVIL_USER_0,
      })
      const { account, txHash } = await tokenboundClient.createAccount(TEST_ERC721)
      await publicClient.waitForTransactionReceipt({ hash: txHash })

      const execution = {
        account: account,
        to: zora721.proxyContractAddress,
        value: 0n,
        data: '',
      }

      const hash = await tokenboundClient.executeCall(execution)

      const transactionReceipt = await publicClient.getTransactionReceipt({
        hash,
      })

      expect(transactionReceipt.status).toBe('success')
    },
    TIMEOUT
  )

  test.each(ALL_CONFIGURATIONS)(
    'can transferETH with the TBA $label',
    async ({ config }) => {
      const tokenboundClient = new TokenboundClient(config)
      const EXPECTED_BALANCE_BEFORE = parseEther('1')
      const EXPECTED_BALANCE_AFTER = parseEther('0.75')

      await commandeerERC721({
        ...TEST_ERC721,
        recipient: ANVIL_USER_0,
      })
      const { account, txHash } = await tokenboundClient.createAccount(TEST_ERC721)
      await publicClient.waitForTransactionReceipt({ hash: txHash })

      await testClient.setBalance({
        address: account,
        value: EXPECTED_BALANCE_BEFORE,
      })

      const ethTransferHash = await tokenboundClient.transferETH({
        account: account,
        amount: 0.25,
        recipientAddress: ANVIL_USER_1,
      })

      await publicClient.waitForTransactionReceipt({
        hash: ethTransferHash,
      })

      const balanceAfter = await publicClient.getBalance({
        address: account,
      })

      console.log(
        'BEFORE: ',
        formatEther(EXPECTED_BALANCE_BEFORE),
        'AFTER: ',
        formatEther(balanceAfter)
      )

      expect(balanceAfter).toBe(EXPECTED_BALANCE_AFTER)
    },
    TIMEOUT
  )

  test.each(ALL_CONFIGURATIONS)(
    'can transferETH to an ENS with the TBA $label',
    async ({ config }) => {
      const tokenboundClient = new TokenboundClient(config)
      const EXPECTED_BALANCE_BEFORE = parseEther('1')
      const EXPECTED_BALANCE_AFTER = parseEther('0.75')

      await commandeerERC721({
        ...TEST_ERC721,
        recipient: ANVIL_USER_0,
      })
      const { account, txHash } = await tokenboundClient.createAccount(TEST_ERC721)
      await publicClient.waitForTransactionReceipt({ hash: txHash })

      await testClient.setBalance({
        address: account,
        value: EXPECTED_BALANCE_BEFORE,
      })

      const ethTransferHash = await tokenboundClient.transferETH({
        account: account,
        amount: 0.25,
        recipientAddress: 'jeebay.eth',
      })

      await publicClient.waitForTransactionReceipt({
        hash: ethTransferHash,
      })

      const balanceAfter = await publicClient.getBalance({
        address: account,
      })

      console.log(
        'BEFORE: ',
        formatEther(EXPECTED_BALANCE_BEFORE),
        'AFTER: ',
        formatEther(balanceAfter)
      )

      expect(balanceAfter).toBe(EXPECTED_BALANCE_AFTER)
    },
    TIMEOUT
  )

  test.each(ALL_CONFIGURATIONS)(
    'will not allow transferNFT 721 with an amount other than 1 $label',
    async ({ config }) => {
      vi.spyOn(console, 'error')
      const tokenboundClient = new TokenboundClient(config)

      await commandeerERC721({
        ...TEST_ERC721,
        recipient: ANVIL_USER_0,
      })
      const { account, txHash } = await tokenboundClient.createAccount(TEST_ERC721)
      await publicClient.waitForTransactionReceipt({ hash: txHash })

      await expect(() =>
        tokenboundClient.transferNFT({
          account: account,
          tokenType: 'ERC721',
          tokenContract: zora721.proxyContractAddress,
          tokenId: TEST_ERC721.tokenId,
          recipientAddress: ANVIL_USER_1,
          amount: 2,
        })
      ).rejects.toThrowError()
    },
    TIMEOUT
  )

  test.each(ALL_CONFIGURATIONS)(
    'can transferNFT a 721 with the TBA $label',
    async ({ config }) => {
      const tokenboundClient = new TokenboundClient(config)

      await commandeerERC721({
        ...TEST_ERC721,
        recipient: ANVIL_USER_0,
      })
      const { account, txHash } = await tokenboundClient.createAccount(TEST_ERC721)
      await publicClient.waitForTransactionReceipt({ hash: txHash })

      const TOKEN_IN_TBA = {
        tokenContract: zora721.proxyContractAddress,
        tokenId: 2,
      }
      await commandeerERC721({
        ...TOKEN_IN_TBA,
        recipient: ANVIL_USER_0,
      })

      const transferNFTHash = await tokenboundClient.transferNFT({
        account: account,
        tokenType: 'ERC721',
        tokenContract: zora721.proxyContractAddress,
        tokenId: '2',
        recipientAddress: ANVIL_USER_1,
      })

      await publicClient.waitForTransactionReceipt({ hash: transferNFTHash })

      const TBANFTBalance = await getZora721Balance({
        publicClient,
        walletAddress: ANVIL_USER_1,
      })
      const anvilAccount1NFTBalance = await getZora721Balance({
        publicClient,
        walletAddress: ANVIL_USER_1,
      })

      expect(TBANFTBalance).toBe(0n)
      expect(anvilAccount1NFTBalance).toBe(1n)
    },
    TIMEOUT
  )

  //   it('can transferNFT to an ENS with the TBA', async () => {
  //     const transferNFTHash = await tokenboundClient.transferNFT({
  //       account: ZORA721_TBA_ADDRESS,
  //       tokenType: 'ERC721',
  //       tokenContract: zora721.proxyContractAddress,
  //       tokenId: TOKENID2_IN_TBA,
  //       recipientAddress: 'jeebay.eth',
  //     })

  //     const addr = await resolvePossibleENS(publicClient, 'jeebay.eth')

  //     const anvilAccount1NFTBalance = await getZora721Balance({
  //       publicClient,
  //       walletAddress: addr,
  //     })

  //     await waitFor(() => {
  //       expect(transferNFTHash).toMatch(ADDRESS_REGEX)
  //       expect(anvilAccount1NFTBalance).toBe(1n)
  //     })
  //   })

  //   it('can mint 3 Zora 721 NFTs with the TBA', async () => {
  //     const encodedMintFunctionData = encodeFunctionData({
  //       abi: zora721.abi,
  //       functionName: 'purchase',
  //       args: [BigInt(zora721.quantity)],
  //     })

  //     const execution = {
  //       account: ZORA721_TBA_ADDRESS,
  //       to: zora721.proxyContractAddress,
  //       value: zora721.mintPrice * BigInt(zora721.quantity),
  //       data: encodedMintFunctionData,
  //     }

  //     const mintToTBATxHash = isV3
  //       ? await tokenboundClient.execute(execution)
  //       : await tokenboundClient.executeCall(execution)

  //     const zoraBalanceInTBA = await getZora721Balance({
  //       publicClient,
  //       walletAddress: ZORA721_TBA_ADDRESS,
  //     })

  //     console.log('721s MINTED TO TBA: ', zoraBalanceInTBA.toString())

  //     await waitFor(() => {
  //       expect(mintToTBATxHash).toMatch(ADDRESS_REGEX)
  //       expect(NFT_IN_EOA.tokenId).toBe(TOKENID_IN_EOA)
  //       expect(zoraBalanceInTBA).toBe(3n)
  //     })
  //   })

  //   it('can mint an 1155 with the TBA', async () => {
  //     const mintingAccount: `0x${string}` = ZORA721_TBA_ADDRESS

  //     const minterArguments: `0x${string}` = encodeAbiParameters(
  //       parseAbiParameters('address'),
  //       [mintingAccount]
  //     )

  //     const data = encodeFunctionData({
  //       abi: zora1155.abi,
  //       functionName: 'mint',
  //       args: [
  //         zora1155.fixedPriceSalesStrategy, // IMinter1155
  //         zora1155.tokenId, // uint256
  //         zora1155.quantity, // uint256
  //         minterArguments, // bytes
  //       ],
  //     })

  //     const execution = {
  //       account: mintingAccount,
  //       to: zora1155.proxyContractAddress,
  //       value: zora1155.mintFee * zora1155.quantity,
  //       data,
  //     }

  //     const mint1155TxHash = isV3
  //       ? await tokenboundClient.execute(execution)
  //       : await tokenboundClient.executeCall(execution)

  //     const zora1155BalanceInTBA = await getZora1155Balance({
  //       publicClient,
  //       walletAddress: mintingAccount,
  //     })

  //     console.log('1155 Balance', zora1155BalanceInTBA)

  //     await waitFor(() => {
  //       expect(mint1155TxHash).toMatch(ADDRESS_REGEX)
  //       expect(zora1155BalanceInTBA).toBe(5n)
  //     })
  //   })

  //   it('can transferNFT an 1155 with the TBA', async () => {
  //     const transferAmount = 2

  //     const transferNFTHash = await tokenboundClient.transferNFT({
  //       account: ZORA721_TBA_ADDRESS,
  //       tokenType: 'ERC1155',
  //       tokenContract: zora1155.proxyContractAddress,
  //       tokenId: zora1155.tokenId.toString(),
  //       recipientAddress: ANVIL_USER_1,
  //       amount: transferAmount,
  //     })

  //     const anvilAccount1_1155Balance = await getZora1155Balance({
  //       publicClient,
  //       walletAddress: ANVIL_USER_1,
  //     })

  //     console.log('1155 Balance', anvilAccount1_1155Balance)

  //     await waitFor(() => {
  //       expect(transferNFTHash).toMatch(ADDRESS_REGEX)
  //       expect(anvilAccount1_1155Balance).toBe(BigInt(transferAmount))
  //     })
  //   })

  //   v3OnlyIt('can verify if a wallet isValidSigner for an owned NFT', async () => {
  //     console.log('ZORA721_TBA_ADDRESS in isValidSigner', ZORA721_TBA_ADDRESS)
  //     const isValidSigner = await tokenboundClient.isValidSigner({
  //       account: ZORA721_TBA_ADDRESS,
  //     })

  //     console.log('isValidSigner?', isValidSigner)

  //     await waitFor(() => {
  //       expect(isValidSigner).toBe(true)
  //     })
  //   })

  //   // Test signing in viem only.
  //   // Ethers 5/6 don't appear to support signing messages via personal_sign with this testing configuration.
  //   viemOnlyIt('can sign a message', async () => {
  //     const signedMessageHash = await tokenboundClient.signMessage({
  //       message: 'Sign me',
  //     })

  //     console.log('SIGNED MESSAGE: ', signedMessageHash)

  //     await waitFor(() => {
  //       expect(signedMessageHash).toMatch(ADDRESS_REGEX)
  //     })
  //   })

  //   // Test signing hex message in viem only.
  //   viemOnlyIt('can sign a hexified message', async () => {
  //     const hexSignedMessageHash = await tokenboundClient.signMessage({
  //       message: { raw: '0x68656c6c6f20776f726c64' },
  //     })

  //     console.log('HEX SIGNED MESSAGE: ', hexSignedMessageHash)

  //     await waitFor(() => {
  //       expect(hexSignedMessageHash).toMatch(ADDRESS_REGEX)
  //     })
  //   })

  //   // Test signing Uint8Array message as raw in viem only.
  //   viemOnlyIt('can sign a Uint8Array message as raw', async () => {
  //     const uint8ArrayMessage: Uint8Array = new Uint8Array([72, 101, 108, 108, 111]) // "Hello" in ASCII

  //     const rawUint8Hash = await tokenboundClient.signMessage({
  //       message: { raw: uint8ArrayMessage },
  //     })

  //     await waitFor(() => {
  //       expect(rawUint8Hash).toMatch(ADDRESS_REGEX)
  //     })
  //   })

  //   // Test signing ArrayLike message in viem only.
  //   viemOnlyIt(
  //     'throws when viem incorrectly receives an ArrayLike message for signing',
  //     async () => {
  //       vi.spyOn(console, 'error')
  //       const arrayMessage: ArrayLike<number> = [72, 101, 108, 108, 111] // "Hello" in ASCII

  //       await expect(() =>
  //         tokenboundClient.signMessage({
  //           message: arrayMessage,
  //         })
  //       ).rejects.toThrowError()
  //     }
  //   )

  //   // Test signing Uint8Array message in viem only.
  //   viemOnlyIt(
  //     'throws when viem incorrectly receives an Uint8Array message for signing',
  //     async () => {
  //       const uint8ArrayMessage: Uint8Array = new Uint8Array([72, 101, 108, 108, 111]) // "Hello" in ASCII

  //       await expect(() =>
  //         tokenboundClient.signMessage({
  //           message: uint8ArrayMessage,
  //         })
  //       ).rejects.toThrowError()
  //     }
  //   )

  //   it('can transferERC20 with the TBA', async () => {
  //     const depositEthValue = 0.2
  //     const depositWeiValue = ethToWei(depositEthValue)
  //     const transferEthValue = 0.1
  //     const transferWeiValue = ethToWei(transferEthValue)
  //     let wethDepositHash: `0x${string}`
  //     let wethTransferHash: `0x${string}`

  //     const tbaWETHInitial = await getWETHBalance({
  //       publicClient,
  //       walletAddress: ZORA721_TBA_ADDRESS,
  //     })

  //     // Prepare encoded WETH transfer to TBA
  //     const wethTransferCallData = encodeFunctionData({
  //       abi: wethABI,
  //       functionName: 'transfer',
  //       args: [ZORA721_TBA_ADDRESS, depositWeiValue],
  //     })

  //     if (walletClient) {
  //       const wethContract = getContract({
  //         address: WETH_CONTRACT_ADDRESS,
  //         abi: wethABI,
  //         walletClient,
  //       })

  //       // Convert ETH to WETH in ANVIL_USER_0 wallet
  //       wethDepositHash = await wethContract.write.deposit({
  //         account: ANVIL_USER_0,
  //         chain: ANVIL_CONFIG.ACTIVE_CHAIN,
  //         value: depositWeiValue,
  //       })

  //       // Transfer WETH from ANVIL_USER_0 to TBA
  //       wethTransferHash = await walletClient.sendTransaction({
  //         account: walletClient.account!,
  //         chain: ANVIL_CONFIG.ACTIVE_CHAIN,
  //         to: WETH_CONTRACT_ADDRESS,
  //         value: 0n,
  //         data: wethTransferCallData,
  //       })
  //     } else if (signer) {
  //       // Convert ETH to WETH in ANVIL_USER_0 wallet
  //       wethDepositHash = await signer
  //         .sendTransaction({
  //           to: WETH_CONTRACT_ADDRESS,
  //           value: depositWeiValue,
  //         })
  //         .then((tx: providers.TransactionResponse) => tx.hash)

  //       // Transfer WETH from ANVIL_USER_0 to TBA
  //       wethTransferHash = await signer
  //         .sendTransaction({
  //           to: WETH_CONTRACT_ADDRESS,
  //           value: BigInt(0),
  //           data: wethTransferCallData,
  //         })
  //         .then((tx: providers.TransactionResponse) => tx.hash)
  //     }

  //     const tbaWETHReceived = await getWETHBalance({
  //       publicClient,
  //       walletAddress: ZORA721_TBA_ADDRESS,
  //     })

  //     // Transfer WETH from TBA to ANVIL_USER_1
  //     const transferredERC20Hash = await tokenboundClient.transferERC20({
  //       account: ZORA721_TBA_ADDRESS,
  //       amount: transferEthValue,
  //       recipientAddress: ANVIL_USER_1,
  //       erc20tokenAddress: WETH_CONTRACT_ADDRESS,
  //       erc20tokenDecimals: 18,
  //     })

  //     // Transfer WETH from TBA to jeebay.eth
  //     const ensTransferredERC20Hash = await tokenboundClient.transferERC20({
  //       account: ZORA721_TBA_ADDRESS,
  //       amount: transferEthValue,
  //       recipientAddress: 'jeebay.eth',
  //       erc20tokenAddress: WETH_CONTRACT_ADDRESS,
  //       erc20tokenDecimals: 18,
  //     })

  //     const tbaWETHFinal = await getWETHBalance({
  //       publicClient,
  //       walletAddress: ZORA721_TBA_ADDRESS,
  //     })

  //     const anvilUser1WETHBalance = await getWETHBalance({
  //       publicClient,
  //       walletAddress: ANVIL_USER_1,
  //     })

  //     const ensWETHBalance = await getWETHBalance({
  //       publicClient,
  //       walletAddress: 'jeebay.eth',
  //     })

  //     console.log(
  //       'TBA WETH INITIAL: ',
  //       formatEther(tbaWETHInitial),
  //       'TBA RECEIVED: ',
  //       formatEther(tbaWETHReceived),
  //       'AFTER: ',
  //       formatEther(tbaWETHFinal),
  //       'ANVIL USER 1 BALANCE: ',
  //       formatEther(anvilUser1WETHBalance),
  //       'ENS BALANCE: ',
  //       formatEther(ensWETHBalance)
  //     )

  //     await waitFor(() => {
  //       expect(wethDepositHash).toMatch(ADDRESS_REGEX)
  //       expect(wethTransferHash).toMatch(ADDRESS_REGEX)
  //       expect(transferredERC20Hash).toMatch(ADDRESS_REGEX)
  //       expect(ensTransferredERC20Hash).toMatch(ADDRESS_REGEX)
  //       expect(tbaWETHReceived).toBe(depositWeiValue)
  //       expect(anvilUser1WETHBalance).toBe(transferWeiValue)
  //       expect(ensWETHBalance).toBe(transferWeiValue)
  //     })
  //   })
  // })

  // describe('Custom client configurations', () => {
  //   it('can use a custom publicClient RPC URL', async () => {
  //     const customPublicClientRPCUrl = 'https://cloudflare-eth.com'
  //     const tokenboundClient = new TokenboundClient({
  //       chainId: 1,
  //       walletClient,
  //       publicClientRPCUrl: customPublicClientRPCUrl,
  //     })

  //     await waitFor(() => {
  //       expect(tokenboundClient.publicClient?.transport?.url).toBe(customPublicClientRPCUrl)
  //     })
  //   })
  //   it('can use a custom chain as parameter', async () => {
  //     const ZORA_CHAIN_ID = 7777777

  //     const tokenboundClient = new TokenboundClient({
  //       walletClient,
  //       chain: zora,
  //     })

  //     await waitFor(() => {
  //       expect(tokenboundClient.publicClient?.chain?.id).toBe(ZORA_CHAIN_ID)
  //     })
  //   })
})
