// This test suite is for testing SDK methods with
// viem walletClient + publicClient and Ethers 5/6.

import { zora } from 'viem/chains'
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
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import {
  ADDRESS_REGEX,
  ANVIL_ACCOUNTS,
  ANVIL_RPC_URL,
  WETH_CONTRACT_ADDRESS,
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
import { Call3, TBImplementationVersion, TBVersion } from '../types'
import { JsonRpcSigner, JsonRpcProvider } from 'ethers6'
import { erc20Abi } from 'viem'
import { CreateAccountParams, TokenboundClient } from '@tokenbound/sdk'

export const pool = Number(process.env.VITEST_POOL_ID ?? 1)

const TIMEOUT = 60000 // default 10000
const ANVIL_USER_0 = getAddress(ANVIL_ACCOUNTS[0].address)
const ANVIL_USER_1 = getAddress(ANVIL_ACCOUNTS[1].address)

const walletClient = createWalletClient({
  transport: http(ANVIL_RPC_URL),
  chain: ANVIL_CONFIG.ACTIVE_CHAIN,
  account: privateKeyToAccount(ANVIL_ACCOUNTS[0].privateKey),
})

const ethers5Provider = new ethers.providers.JsonRpcProvider(ANVIL_RPC_URL)
const ethers5Signer = new ethers.Wallet(ANVIL_ACCOUNTS[0].privateKey, ethers5Provider)

const ethers6Provider = new JsonRpcProvider(ANVIL_RPC_URL)
const ethers6Signer = new JsonRpcSigner(ethers6Provider, ANVIL_USER_0)

type TestConfig = {
  testName: string
  walletClient?: WalletClient
  signer?: any
  version?: TBImplementationVersion
}

export const ENABLED_TESTS: Array<TestConfig> = [
  {
    testName: 'viem v2',
    walletClient,
    version: TBVersion.V2,
  },
  {
    testName: 'ethers@5 v2',
    signer: ethers5Signer,
    version: TBVersion.V2,
  },
  {
    testName: 'ethers@6 v2',
    signer: ethers6Signer,
    version: TBVersion.V2,
  },
  {
    testName: 'viem v3',
    walletClient,
  },
  {
    testName: 'ethers@5 v3',
    signer: ethers5Signer,
  },
  {
    testName: 'ethers@6 v3',
    signer: ethers6Signer,
  },
]

describe.each(ENABLED_TESTS)(
  '$testName',
  ({ testName, walletClient, signer, version }) => {
    const isV2 = version === TBVersion.V2
    const isV3 = isV2 === false
    const viemOnlyIt = walletClient ? it : it.skip // Skip tests that are non-functional in Ethers
    const v3OnlyIt = isV3 ? it : it.skip
    // Set up Anvil instance + clients
    const anvil = createAnvil({ ...CREATE_ANVIL_OPTIONS })
    const CUSTOM_SALT = 6551
    let tokenboundClient: TokenboundClient
    let publicClient: PublicClient
    let NFT_IN_EOA: CreateAccountParams
    let NFT_FOR_MULTICALL_CREATE: CreateAccountParams
    let TOKENID_IN_EOA: string
    let TOKENID_FOR_MULTICALL_CREATE: string
    let TOKENID1_IN_TBA: string
    let TOKENID2_IN_TBA: string
    let ZORA721_TBA_ADDRESS: `0x${string}`
    let ZORA721_TBA_ADDRESS_CUSTOM_SALT: `0x${string}`
    let ZORA721_TBA_ADDRESS_MULTICALL: `0x${string}`

    const ERC6551_DEPLOYMENT = isV2 ? ERC_6551_LEGACY_V2 : ERC_6551_DEFAULT

    // Spin up a fresh anvil instance each time we run the test suite against a different signer
    beforeAll(async () => {
      try {
        publicClient = getPublicClient({ chainId: ANVIL_CONFIG.ACTIVE_CHAIN.id })

        // Pass in the Anvil test walletClient + publicClient
        tokenboundClient = new TokenboundClient({
          chainId: ANVIL_CONFIG.ACTIVE_CHAIN.id,
          walletClient,
          signer,
          publicClient,
          implementationAddress: isV3
            ? undefined
            : ERC6551_DEPLOYMENT.IMPLEMENTATION.ADDRESS,
          registryAddress: isV3 ? undefined : ERC6551_DEPLOYMENT.REGISTRY.ADDRESS,
        })

        await anvil.start()
        console.log(`START → \x1b[94m ${testName} \x1b[0m`)
      } catch (err) {
        console.error('Error during setup:', err)
      }
    }, TIMEOUT)

    afterAll(async () => {
      await anvil.stop()
      console.log(`END → \x1b[94m ${testName} \x1b[0m`)
    })

    it('can get the SDK version', () => {
      const sdkVersion: string = tokenboundClient.getSDKVersion()
      expect(sdkVersion).toBeDefined()
    })

    // To test the SDK methods, we need to mint some NFTs into the Anvil wallet
    // so that we can transfer them to the TBA and test the TBA methods.
    it(
      'can mint 2 Zora 721 NFTs into Anvil wallet #0',
      async () => {
        let mintLogs: Log[] = []

        // Set up observer for mint event so we can get the tokenId
        const unwatch = publicClient.watchContractEvent({
          address: zora721.proxyContractAddress,
          abi: zora721.abi,
          eventName: 'Transfer',
          args: {
            to: ANVIL_USER_0,
          },
          onLogs: (logs) => {
            mintLogs = logs
            const { tokenId: eoaTokenId } = logs[0].args
            const { tokenId: tbaToken1Id } = logs[1].args
            const { tokenId: tbaToken2Id } = logs[2].args
            const { tokenId: multicallTokenId } = logs[3].args

            if (eoaTokenId && tbaToken1Id && tbaToken2Id && multicallTokenId) {
              TOKENID_IN_EOA = eoaTokenId.toString()
              TOKENID_FOR_MULTICALL_CREATE = multicallTokenId.toString()
              TOKENID1_IN_TBA = tbaToken1Id.toString()
              TOKENID2_IN_TBA = tbaToken2Id.toString()

              NFT_IN_EOA = {
                tokenContract: zora721.proxyContractAddress,
                tokenId: TOKENID_IN_EOA,
              }
              NFT_FOR_MULTICALL_CREATE = {
                tokenContract: zora721.proxyContractAddress,
                tokenId: TOKENID_FOR_MULTICALL_CREATE,
              }
            }
          },
        })

        // Prepare mint transaction
        const encodedMintFunctionData = encodeFunctionData({
          abi: zora721.abi,
          functionName: 'purchase',
          args: [BigInt(zora721.quantity)],
        })

        const prepared721Mint = {
          to: zora721.proxyContractAddress,
          value: zora721.mintPrice * BigInt(zora721.quantity),
          data: encodedMintFunctionData,
        }

        let mintTxHash: `0x${string}`

        if (walletClient) {
          mintTxHash = await walletClient.sendTransaction({
            chain: ANVIL_CONFIG.ACTIVE_CHAIN,
            account: ANVIL_USER_0,
            ...prepared721Mint,
          })
        } else if (signer) {
          mintTxHash = await signer
            .sendTransaction({
              chainId: ANVIL_CONFIG.ACTIVE_CHAIN.id,
              ...prepared721Mint,
            })
            .then((tx: providers.TransactionResponse) => tx.hash)
        }

        const zoraBalanceInAnvilWallet = await getZora721Balance({
          publicClient,
          walletAddress: ANVIL_USER_0,
        })

        await waitFor(() => {
          expect(mintLogs.length).toBe(zora721.quantity)
          expect(mintTxHash).toMatch(ADDRESS_REGEX)
          expect(NFT_IN_EOA.tokenId).toBe(TOKENID_IN_EOA)
          expect(NFT_FOR_MULTICALL_CREATE.tokenId).toBe(TOKENID_FOR_MULTICALL_CREATE)
          expect(zoraBalanceInAnvilWallet).toBe(4n)
          unwatch()
        })
      },
      TIMEOUT
    )

    // We create the account using an NFT in the EOA wallet so we can test the EOA methods and use the TBA address for tests
    it(
      'can createAccount',
      async () => {
        const { account, txHash } = await tokenboundClient.createAccount(NFT_IN_EOA)
        console.log('CREATED ACCT', account)

        const createdAccountTxReceipt = await publicClient.waitForTransactionReceipt({
          hash: txHash,
        })

        ZORA721_TBA_ADDRESS = account
        await waitFor(() => {
          expect(account).toMatch(ADDRESS_REGEX)
          expect(createdAccountTxReceipt.status).toBe('success')
        })
      },
      TIMEOUT
    )

    it(
      'can createAccount with a custom salt',
      async () => {
        const { account, txHash } = await tokenboundClient.createAccount({
          ...NFT_IN_EOA,
          salt: CUSTOM_SALT,
        })
        console.log('CREATED ACCT WITH CUSTOM SALT', account)

        const createdAccountTxReceipt = await publicClient.waitForTransactionReceipt({
          hash: txHash,
        })

        ZORA721_TBA_ADDRESS_CUSTOM_SALT = account
        await waitFor(() => {
          expect(account).toMatch(ADDRESS_REGEX)
          expect(createdAccountTxReceipt.status).toBe('success')
        })
      },
      TIMEOUT
    )

    it(
      'can createAccount with a custom chainId',
      async () => {
        const HARDHAT_CHAIN_ID = 31337

        const { account, txHash } = await tokenboundClient.createAccount({
          ...NFT_IN_EOA,
          chainId: HARDHAT_CHAIN_ID,
        })
        console.log('CREATED ACCT WITH CUSTOM CHAIN ID', account)

        const createdAccountTxReceipt = await publicClient.waitForTransactionReceipt({
          hash: txHash,
        })

        const bytecode = await tokenboundClient.deconstructBytecode({
          accountAddress: account,
        })

        if (!bytecode) return false

        const { chainId } = bytecode

        console.log('CHAINID OF CREATED ACCT', chainId)

        expect(isAddress(account)).toEqual(true)
        expect(createdAccountTxReceipt.status).toBe('success')
        expect(chainId).toBe(HARDHAT_CHAIN_ID)
      },
      TIMEOUT
    )

    v3OnlyIt(
      'can createAccount and append multicall transaction(s) that use the deployed TBA',
      async () => {
        const multicallTBAAddress = tokenboundClient.getAccount(NFT_FOR_MULTICALL_CREATE)

        // Perform a simple ERC20 balanceOf call to test the appended multicall transaction
        const encodedBalanceOfFunctionData = encodeFunctionData({
          abi: erc20Abi,
          functionName: 'balanceOf',
          args: [multicallTBAAddress],
        })

        const preparedBalanceOfByTBA = await tokenboundClient.prepareExecution({
          account: multicallTBAAddress,
          to: WETH_CONTRACT_ADDRESS,
          value: 0n,
          data: encodedBalanceOfFunctionData,
        })

        const appendedCall: Call3 = {
          target: multicallTBAAddress, // Execute with TBA
          allowFailure: false,
          callData: preparedBalanceOfByTBA.data,
        }

        const { account, txHash } = await tokenboundClient.createAccount({
          ...NFT_FOR_MULTICALL_CREATE,
          appendedCalls: [appendedCall],
        })
        console.log('CREATED ACCT WITH MULTICALL', account)

        const createdAccountTxReceipt = await publicClient.waitForTransactionReceipt({
          hash: txHash,
        })

        ZORA721_TBA_ADDRESS_MULTICALL = account
        await waitFor(() => {
          expect(account).toMatch(ADDRESS_REGEX)
          expect(createdAccountTxReceipt.status).toBe('success')
        })
      },
      TIMEOUT
    )

    it('can checkAccountDeployment for the created account', async () => {
      const isAccountDeployed = await tokenboundClient.checkAccountDeployment({
        accountAddress: ZORA721_TBA_ADDRESS,
      })

      console.log(`isAccountDeployed ${testName}`, isAccountDeployed)

      expect(isAccountDeployed).toEqual(true)
    })

    it('can getAccount', async () => {
      const getAccount = tokenboundClient.getAccount(NFT_IN_EOA)
      await waitFor(() => {
        expect(getAccount).toMatch(ADDRESS_REGEX)
        expect(getAccount).toEqual(ZORA721_TBA_ADDRESS)
      })
    })

    it('can getAccount with a custom salt', async () => {
      const getAccount = tokenboundClient.getAccount({ ...NFT_IN_EOA, salt: CUSTOM_SALT })
      await waitFor(() => {
        expect(getAccount).toMatch(ADDRESS_REGEX)
        expect(getAccount).toEqual(ZORA721_TBA_ADDRESS_CUSTOM_SALT)
      })
    })

    // We transfer an NFT to the TBA so that we can test the TBA methods.
    it(
      'can transfer one of the minted NFTs to the TBA',
      async () => {
        console.log('SAFE_TRANSFER', ZORA721_TBA_ADDRESS, 'tokenId', TOKENID1_IN_TBA)

        const transferCallData = encodeFunctionData({
          abi: zora721.abi,
          functionName: 'safeTransferFrom',
          args: [
            ANVIL_USER_0, // from
            ZORA721_TBA_ADDRESS, // to
            BigInt(TOKENID1_IN_TBA), // tokenId
          ],
        })

        const preparedNFTTransfer = {
          to: zora721.proxyContractAddress,
          value: 0n,
          data: transferCallData,
        }

        let transferHash: `0x${string}`

        if (walletClient) {
          transferHash = await walletClient.sendTransaction({
            chain: ANVIL_CONFIG.ACTIVE_CHAIN,
            account: walletClient.account!.address,
            ...preparedNFTTransfer,
          })
        } else {
          const tx = await signer.sendTransaction({
            chainId: ANVIL_CONFIG.ACTIVE_CHAIN.id,
            ...preparedNFTTransfer,
          })

          transferHash = tx.hash
        }

        const transactionReceipt = await publicClient.waitForTransactionReceipt({
          hash: transferHash,
        })

        const tbaNFTBalance = await getZora721Balance({
          publicClient,
          walletAddress: ZORA721_TBA_ADDRESS,
        })
        console.log('# of NFTs in TBA: ', tbaNFTBalance.toString())

        await waitFor(() => {
          expect(transferHash).toMatch(ADDRESS_REGEX)
          expect(transactionReceipt.status).toBe('success')
          expect(tbaNFTBalance).toBe(1n)
        })
      },
      TIMEOUT
    )

    it(
      'can transfer another minted NFT to the TBA',
      async () => {
        const transferCallData = encodeFunctionData({
          abi: zora721.abi,
          functionName: 'safeTransferFrom',
          args: [
            ANVIL_USER_0, // from
            ZORA721_TBA_ADDRESS, // to
            BigInt(TOKENID2_IN_TBA), // tokenId
          ],
        })

        const preparedNFTTransfer = {
          to: zora721.proxyContractAddress,
          value: 0n,
          data: transferCallData,
        }

        let transferHash: `0x${string}`

        if (walletClient) {
          transferHash = await walletClient.sendTransaction({
            chain: ANVIL_CONFIG.ACTIVE_CHAIN,
            account: walletClient.account!.address,
            ...preparedNFTTransfer,
          })
        } else {
          const tx = await signer.sendTransaction({
            chainId: ANVIL_CONFIG.ACTIVE_CHAIN.id,
            ...preparedNFTTransfer,
          })
          transferHash = tx.hash
        }

        const transactionReceipt = await publicClient.waitForTransactionReceipt({
          hash: transferHash,
        })

        const tbaNFTBalance = await getZora721Balance({
          publicClient,
          walletAddress: ZORA721_TBA_ADDRESS,
        })
        console.log('# of NFTs in TBA: ', tbaNFTBalance.toString())

        await waitFor(() => {
          expect(transferHash).toMatch(ADDRESS_REGEX)
          expect(transactionReceipt.status).toBe('success')
          expect(tbaNFTBalance).toBe(2n)
        })
      },
      TIMEOUT
    )

    // To perform transactions using the SDK, we need to transfer some ETH into the TBA.
    it(
      'can transfer ETH to the TBA',
      async () => {
        const ethAmount = 1
        const ethAmountWei = parseUnits(`${ethAmount}`, 18)

        const preparedETHTransfer = {
          to: ZORA721_TBA_ADDRESS,
          value: ethAmountWei,
          // data is optional if nil
        }

        let transferHash: `0x${string}`
        if (walletClient) {
          transferHash = await walletClient.sendTransaction({
            chain: ANVIL_CONFIG.ACTIVE_CHAIN,
            account: walletClient.account!.address,
            ...preparedETHTransfer,
          })
        } else {
          transferHash = await signer
            .sendTransaction({
              chainId: ANVIL_CONFIG.ACTIVE_CHAIN.id,
              ...preparedETHTransfer,
            })
            .then((tx: providers.TransactionResponse) => tx.hash)
        }

        const balanceAfter = await publicClient.getBalance({
          address: ZORA721_TBA_ADDRESS,
        })

        await waitFor(() => {
          expect(transferHash).toMatch(ADDRESS_REGEX)
          expect(balanceAfter).toBe(ethAmountWei)
        })
      },
      TIMEOUT
    )

    // Execute a basic call with no value with the TBA to see if it works.
    it(
      isV2 ? `can executeCall with the TBA` : `can execute with the TBA`,
      async () => {
        const execution = {
          account: ZORA721_TBA_ADDRESS,
          to: zora721.proxyContractAddress,
          value: 0n,
          data: '',
        }

        const executedCallTxHash = isV3
          ? await tokenboundClient.execute(execution)
          : await tokenboundClient.executeCall(execution)

        const transactionReceipt = await publicClient.getTransactionReceipt({
          hash: executedCallTxHash,
        })

        await waitFor(() => {
          expect(executedCallTxHash).toMatch(ADDRESS_REGEX)
          expect(transactionReceipt.status).toBe('success')
        })
      },
      TIMEOUT
    )

    it(
      `can fall back to executeCall from execute for V2`,
      async () => {
        const execution = {
          account: ZORA721_TBA_ADDRESS,
          to: zora721.proxyContractAddress,
          value: 0n,
          data: '',
        }

        const executedCallTxHash = await tokenboundClient.execute(execution)

        const transactionReceipt = await publicClient.getTransactionReceipt({
          hash: executedCallTxHash,
        })

        await waitFor(() => {
          expect(executedCallTxHash).toMatch(ADDRESS_REGEX)
          expect(transactionReceipt.status).toBe('success')
        })
      },
      TIMEOUT
    )

    // The other methods in the SDK implement executeCall,
    // so they provide further reinforcement that executeCall works.
    it('can transferETH with the TBA', async () => {
      const EXPECTED_BALANCE_BEFORE = parseUnits('1', 18)
      const EXPECTED_BALANCE_AFTER = parseUnits('0.75', 18)

      const balanceBefore = await publicClient.getBalance({
        address: ZORA721_TBA_ADDRESS,
      })
      const ethTransferHash = await tokenboundClient.transferETH({
        account: ZORA721_TBA_ADDRESS,
        amount: 0.25,
        recipientAddress: ANVIL_USER_1,
      })

      const transactionReceipt = await publicClient.getTransactionReceipt({
        hash: ethTransferHash,
      })

      const balanceAfter = await publicClient.getBalance({
        address: ZORA721_TBA_ADDRESS,
      })

      console.log(
        'BEFORE: ',
        formatEther(balanceBefore),
        'AFTER: ',
        formatEther(balanceAfter)
      )

      await waitFor(() => {
        expect(ethTransferHash).toMatch(ADDRESS_REGEX)
        expect(balanceBefore).toBe(EXPECTED_BALANCE_BEFORE)
        expect(balanceAfter).toBe(EXPECTED_BALANCE_AFTER)
      })
    })

    it('can transferETH to an ENS with the TBA', async () => {
      const EXPECTED_BALANCE_BEFORE = parseUnits('0.75', 18)
      const EXPECTED_BALANCE_AFTER = parseUnits('0.5', 18)

      const balanceBefore = await publicClient.getBalance({
        address: ZORA721_TBA_ADDRESS,
      })
      const ethTransferHash = await tokenboundClient.transferETH({
        account: ZORA721_TBA_ADDRESS,
        amount: 0.25,
        recipientAddress: 'jeebay.eth',
      })
      const balanceAfter = await publicClient.getBalance({
        address: ZORA721_TBA_ADDRESS,
      })

      console.log(
        'BEFORE: ',
        formatEther(balanceBefore),
        'AFTER: ',
        formatEther(balanceAfter)
      )

      await waitFor(() => {
        expect(ethTransferHash).toMatch(ADDRESS_REGEX)
        expect(balanceBefore).toBe(EXPECTED_BALANCE_BEFORE)
        expect(balanceAfter).toBe(EXPECTED_BALANCE_AFTER)
      })
    })

    it('will not allow transferNFT 721 with an amount other than 1', async () => {
      vi.spyOn(console, 'error')

      await expect(() =>
        tokenboundClient.transferNFT({
          account: ZORA721_TBA_ADDRESS,
          tokenType: 'ERC721',
          tokenContract: zora721.proxyContractAddress,
          tokenId: TOKENID1_IN_TBA,
          recipientAddress: ANVIL_USER_1,
          amount: 2,
        })
      ).rejects.toThrowError()
    })

    it('can transferNFT a 721 with the TBA', async () => {
      const transferNFTHash = await tokenboundClient.transferNFT({
        account: ZORA721_TBA_ADDRESS,
        tokenType: 'ERC721',
        tokenContract: zora721.proxyContractAddress,
        tokenId: TOKENID1_IN_TBA,
        recipientAddress: ANVIL_USER_1,
      })

      const anvilAccount1NFTBalance = await getZora721Balance({
        publicClient,
        walletAddress: ANVIL_USER_1,
      })

      await waitFor(() => {
        expect(transferNFTHash).toMatch(ADDRESS_REGEX)
        expect(anvilAccount1NFTBalance).toBe(1n)
      })
    })

    it('can transferNFT to an ENS with the TBA', async () => {
      const transferNFTHash = await tokenboundClient.transferNFT({
        account: ZORA721_TBA_ADDRESS,
        tokenType: 'ERC721',
        tokenContract: zora721.proxyContractAddress,
        tokenId: TOKENID2_IN_TBA,
        recipientAddress: 'jeebay.eth',
      })

      const addr = await resolvePossibleENS(publicClient, 'jeebay.eth')

      const anvilAccount1NFTBalance = await getZora721Balance({
        publicClient,
        walletAddress: addr,
      })

      await waitFor(() => {
        expect(transferNFTHash).toMatch(ADDRESS_REGEX)
        expect(anvilAccount1NFTBalance).toBe(1n)
      })
    })

    it('can mint 4 Zora 721 NFTs with the TBA', async () => {
      const encodedMintFunctionData = encodeFunctionData({
        abi: zora721.abi,
        functionName: 'purchase',
        args: [BigInt(zora721.quantity)],
      })

      const execution = {
        account: ZORA721_TBA_ADDRESS,
        to: zora721.proxyContractAddress,
        value: zora721.mintPrice * BigInt(zora721.quantity),
        data: encodedMintFunctionData,
      }

      const mintToTBATxHash = isV3
        ? await tokenboundClient.execute(execution)
        : await tokenboundClient.executeCall(execution)

      const zoraBalanceInTBA = await getZora721Balance({
        publicClient,
        walletAddress: ZORA721_TBA_ADDRESS,
      })

      console.log('721s MINTED TO TBA: ', zoraBalanceInTBA.toString())

      await waitFor(() => {
        expect(mintToTBATxHash).toMatch(ADDRESS_REGEX)
        expect(NFT_IN_EOA.tokenId).toBe(TOKENID_IN_EOA)
        expect(zoraBalanceInTBA).toBe(4n)
      })
    })

    it('can mint an 1155 with the TBA', async () => {
      const mintingAccount: `0x${string}` = ZORA721_TBA_ADDRESS

      const minterArguments: `0x${string}` = encodeAbiParameters(
        parseAbiParameters('address'),
        [mintingAccount]
      )

      const data = encodeFunctionData({
        abi: zora1155.abi,
        functionName: 'mint',
        args: [
          zora1155.fixedPriceSalesStrategy, // IMinter1155
          zora1155.tokenId, // uint256
          zora1155.quantity, // uint256
          minterArguments, // bytes
        ],
      })

      const execution = {
        account: mintingAccount,
        to: zora1155.proxyContractAddress,
        value: zora1155.mintFee * zora1155.quantity,
        data,
      }

      const mint1155TxHash = isV3
        ? await tokenboundClient.execute(execution)
        : await tokenboundClient.executeCall(execution)

      const zora1155BalanceInTBA = await getZora1155Balance({
        publicClient,
        walletAddress: mintingAccount,
      })

      console.log('1155 Balance', zora1155BalanceInTBA)

      await waitFor(() => {
        expect(mint1155TxHash).toMatch(ADDRESS_REGEX)
        expect(zora1155BalanceInTBA).toBe(5n)
      })
    })

    it('can transferNFT an 1155 with the TBA', async () => {
      const transferAmount = 2

      const transferNFTHash = await tokenboundClient.transferNFT({
        account: ZORA721_TBA_ADDRESS,
        tokenType: 'ERC1155',
        tokenContract: zora1155.proxyContractAddress,
        tokenId: zora1155.tokenId.toString(),
        recipientAddress: ANVIL_USER_1,
        amount: transferAmount,
      })

      const anvilAccount1_1155Balance = await getZora1155Balance({
        publicClient,
        walletAddress: ANVIL_USER_1,
      })

      console.log('1155 Balance', anvilAccount1_1155Balance)

      await waitFor(() => {
        expect(transferNFTHash).toMatch(ADDRESS_REGEX)
        expect(anvilAccount1_1155Balance).toBe(BigInt(transferAmount))
      })
    })

    v3OnlyIt('can verify if a wallet isValidSigner for an owned NFT', async () => {
      console.log('ZORA721_TBA_ADDRESS in isValidSigner', ZORA721_TBA_ADDRESS)
      const isValidSigner = await tokenboundClient.isValidSigner({
        account: ZORA721_TBA_ADDRESS,
      })

      console.log('isValidSigner?', isValidSigner)

      await waitFor(() => {
        expect(isValidSigner).toBe(true)
      })
    })

    // Test signing in viem only.
    // Ethers 5/6 don't appear to support signing messages via personal_sign with this testing configuration.
    viemOnlyIt('can sign a message', async () => {
      const signedMessageHash = await tokenboundClient.signMessage({
        message: 'Sign me',
      })

      console.log('SIGNED MESSAGE: ', signedMessageHash)

      await waitFor(() => {
        expect(signedMessageHash).toMatch(ADDRESS_REGEX)
      })
    })

    // Test signing hex message in viem only.
    viemOnlyIt('can sign a hexified message', async () => {
      const hexSignedMessageHash = await tokenboundClient.signMessage({
        message: { raw: '0x68656c6c6f20776f726c64' },
      })

      console.log('HEX SIGNED MESSAGE: ', hexSignedMessageHash)

      await waitFor(() => {
        expect(hexSignedMessageHash).toMatch(ADDRESS_REGEX)
      })
    })

    // Test signing Uint8Array message as raw in viem only.
    viemOnlyIt('can sign a Uint8Array message as raw', async () => {
      const uint8ArrayMessage: Uint8Array = new Uint8Array([72, 101, 108, 108, 111]) // "Hello" in ASCII

      const rawUint8Hash = await tokenboundClient.signMessage({
        message: { raw: uint8ArrayMessage },
      })

      await waitFor(() => {
        expect(rawUint8Hash).toMatch(ADDRESS_REGEX)
      })
    })

    // Test signing ArrayLike message in viem only.
    viemOnlyIt(
      'throws when viem incorrectly receives an ArrayLike message for signing',
      async () => {
        vi.spyOn(console, 'error')
        const arrayMessage: ArrayLike<number> = [72, 101, 108, 108, 111] // "Hello" in ASCII

        await expect(() =>
          tokenboundClient.signMessage({
            message: arrayMessage,
          })
        ).rejects.toThrowError()
      }
    )

    // Test signing Uint8Array message in viem only.
    viemOnlyIt(
      'throws when viem incorrectly receives an Uint8Array message for signing',
      async () => {
        const uint8ArrayMessage: Uint8Array = new Uint8Array([72, 101, 108, 108, 111]) // "Hello" in ASCII

        await expect(() =>
          tokenboundClient.signMessage({
            message: uint8ArrayMessage,
          })
        ).rejects.toThrowError()
      }
    )

    it('can transferERC20 with the TBA', async () => {
      const depositEthValue = 0.2
      const depositWeiValue = ethToWei(depositEthValue)
      const transferEthValue = 0.1
      const transferWeiValue = ethToWei(transferEthValue)
      let wethDepositHash: `0x${string}`
      let wethTransferHash: `0x${string}`

      const tbaWETHInitial = await getWETHBalance({
        publicClient,
        walletAddress: ZORA721_TBA_ADDRESS,
      })

      // Prepare encoded WETH transfer to TBA
      const wethTransferCallData = encodeFunctionData({
        abi: wethABI,
        functionName: 'transfer',
        args: [ZORA721_TBA_ADDRESS, depositWeiValue],
      })

      if (walletClient) {
        const wethContract = getContract({
          address: WETH_CONTRACT_ADDRESS,
          abi: wethABI,
          client: {
            wallet: walletClient,
          },
        })

        // Convert ETH to WETH in ANVIL_USER_0 wallet
        wethDepositHash = await wethContract.write.deposit({
          account: ANVIL_USER_0,
          chain: ANVIL_CONFIG.ACTIVE_CHAIN,
          value: depositWeiValue,
        })

        // Transfer WETH from ANVIL_USER_0 to TBA
        wethTransferHash = await walletClient.sendTransaction({
          account: walletClient.account!,
          chain: ANVIL_CONFIG.ACTIVE_CHAIN,
          to: WETH_CONTRACT_ADDRESS,
          value: 0n,
          data: wethTransferCallData,
        })
      } else if (signer) {
        // Convert ETH to WETH in ANVIL_USER_0 wallet
        wethDepositHash = await signer
          .sendTransaction({
            to: WETH_CONTRACT_ADDRESS,
            value: depositWeiValue,
          })
          .then((tx: providers.TransactionResponse) => tx.hash)

        // Transfer WETH from ANVIL_USER_0 to TBA
        wethTransferHash = await signer
          .sendTransaction({
            to: WETH_CONTRACT_ADDRESS,
            value: BigInt(0),
            data: wethTransferCallData,
          })
          .then((tx: providers.TransactionResponse) => tx.hash)
      }

      const tbaWETHReceived = await getWETHBalance({
        publicClient,
        walletAddress: ZORA721_TBA_ADDRESS,
      })

      // Transfer WETH from TBA to ANVIL_USER_1
      const transferredERC20Hash = await tokenboundClient.transferERC20({
        account: ZORA721_TBA_ADDRESS,
        amount: transferEthValue,
        recipientAddress: ANVIL_USER_1,
        erc20tokenAddress: WETH_CONTRACT_ADDRESS,
        erc20tokenDecimals: 18,
      })

      // Transfer WETH from TBA to jeebay.eth
      const ensTransferredERC20Hash = await tokenboundClient.transferERC20({
        account: ZORA721_TBA_ADDRESS,
        amount: transferEthValue,
        recipientAddress: 'jeebay.eth',
        erc20tokenAddress: WETH_CONTRACT_ADDRESS,
        erc20tokenDecimals: 18,
      })

      const tbaWETHFinal = await getWETHBalance({
        publicClient,
        walletAddress: ZORA721_TBA_ADDRESS,
      })

      const anvilUser1WETHBalance = await getWETHBalance({
        publicClient,
        walletAddress: ANVIL_USER_1,
      })

      const ensWETHBalance = await getWETHBalance({
        publicClient,
        walletAddress: 'jeebay.eth',
      })

      console.log(
        'TBA WETH INITIAL: ',
        formatEther(tbaWETHInitial),
        'TBA RECEIVED: ',
        formatEther(tbaWETHReceived),
        'AFTER: ',
        formatEther(tbaWETHFinal),
        'ANVIL USER 1 BALANCE: ',
        formatEther(anvilUser1WETHBalance),
        'ENS BALANCE: ',
        formatEther(ensWETHBalance)
      )

      await waitFor(() => {
        expect(wethDepositHash).toMatch(ADDRESS_REGEX)
        expect(wethTransferHash).toMatch(ADDRESS_REGEX)
        expect(transferredERC20Hash).toMatch(ADDRESS_REGEX)
        expect(ensTransferredERC20Hash).toMatch(ADDRESS_REGEX)
        expect(tbaWETHReceived).toBe(depositWeiValue)
        expect(anvilUser1WETHBalance).toBe(transferWeiValue)
        expect(ensWETHBalance).toBe(transferWeiValue)
      })
    })
  }
)

describe('Custom client configurations', () => {
  it('can use a custom publicClient RPC URL', async () => {
    const customPublicClientRPCUrl = 'https://cloudflare-eth.com'
    const tokenboundClient = new TokenboundClient({
      chainId: 1,
      walletClient,
      publicClientRPCUrl: customPublicClientRPCUrl,
    })

    await waitFor(() => {
      expect(tokenboundClient.publicClient?.transport?.url).toBe(customPublicClientRPCUrl)
    })
  })
  it('can use a custom chain as parameter', async () => {
    const ZORA_CHAIN_ID = 7777777

    const tokenboundClient = new TokenboundClient({
      walletClient,
      chain: zora,
    })

    await waitFor(() => {
      expect(tokenboundClient.publicClient?.chain?.id).toBe(ZORA_CHAIN_ID)
    })
  })
})
