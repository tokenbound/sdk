// This test suite is for testing SDK methods with
// viem walletClient + publicClient and Ethers 5/6.

import { zora } from 'viem/chains'
import { describe, beforeAll, afterAll, test, expect, it, vi } from 'vitest'
import { providers } from 'ethers'
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
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { CreateAccountParams, TokenboundClient } from '@tokenbound/sdk'
import {
  ADDRESS_REGEX,
  ANVIL_ACCOUNTS,
  ANVIL_RPC_URL,
  WETH_CONTRACT_ADDRESS,
} from './constants'
import {
  entryPointAddress,
  resolvePossibleENS,
  walletClientToEthers5Signer,
  walletClientToEthers6Signer,
} from '../utils'
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
import * as fs from 'fs'
import * as path from 'path'
import { exec } from 'child_process'
import util from 'util'
import { spawn } from 'child_process'

const TIMEOUT = 60000 // default 10000
const ANVIL_USER_0 = getAddress(ANVIL_ACCOUNTS[0].address)
const ANVIL_USER_1 = getAddress(ANVIL_ACCOUNTS[1].address)

const BUNDLER = getAddress(ANVIL_ACCOUNTS[3].address)
const BUNDLER_KEY = ANVIL_ACCOUNTS[3].privateKey
const BUNDLER_URL = 'http://0.0.0.0:14337'

const walletClient = createWalletClient({
  transport: http(ANVIL_RPC_URL),
  chain: ANVIL_CONFIG.ACTIVE_CHAIN,
  account: privateKeyToAccount(ANVIL_ACCOUNTS[0].privateKey),
  pollingInterval: 100,
})

function writeConfigToFile(jsonData: any) {
  const outputPath = path.join(__dirname, 'bundler', 'config.json')
  try {
    fs.unlinkSync(outputPath)
  } catch (err) {
    console.log('No config file found.')
  }
  const data = JSON.stringify(jsonData, null, 2) // Convert the config object to a JSON string, indented with 2 spaces
  console.log('Writing config file to: ', outputPath)
  fs.writeFileSync(outputPath, data, 'utf-8')
}

// Create Ethers 5/6 signers from the walletClient + run tests
describe('Test SDK methods - viem + Ethers', async () => {
  const bundlerConfig = {
    networks: {
      mainnet: {
        entryPoints: ['0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789'],
        relayer: BUNDLER_KEY,
        beneficiary: BUNDLER,
        rpcEndpoint: ANVIL_RPC_URL,
        minInclusionDenominator: 10,
        throttlingSlack: 10,
        banSlack: 10,
        gasPriceMarkup: 0,
        enforceGasPriceThreshold: 0,
      },
    },
  }

  writeConfigToFile(bundlerConfig)

  const ethers5Signer = walletClientToEthers5Signer(walletClient)
  const ethers6Signer = walletClientToEthers6Signer(walletClient)

  runTxTests({ testName: 'Viem Tests', walletClient })

  const ENABLE_ETHERS_TESTS = true

  if (ENABLE_ETHERS_TESTS) {
    runTxTests({
      testName: 'Ethers 5 Tests',
      signer: ethers5Signer,
      testingMode: { walletClient, rpcUrl: ANVIL_RPC_URL },
    })
    runTxTests({
      testName: 'Ethers 6 Tests',
      signer: ethers6Signer,
      testingMode: { walletClient, rpcUrl: ANVIL_RPC_URL },
    })
  }
})

/**
 *
 * @param balance number: the balance you want to subtract from in Eth
 * @param subtractedAmount number: the eth you want to subtract
 * @returns bigint: the balance in wei
 */
function subtractFromBalanceToWei(balance: number, subtractedAmount: number) {
  return parseUnits(String(balance - subtractedAmount), 18)
}

function runTxTests({
  testName,
  walletClient,
  signer,
  testingMode,
}: {
  testName: string
  walletClient?: WalletClient
  signer?: any
  testingMode?: { walletClient: WalletClient; rpcUrl: string }
}) {
  // Skip tests that are non-functional in Ethers
  let tbaBalanceTracker: bigint
  const testInViemOnly = walletClient ? it : it.skip

  describe(testName, () => {
    // Set up Anvil instance + clients
    const anvil = createAnvil({
      ...CREATE_ANVIL_OPTIONS,
      startTimeout: ANVIL_CONFIG.TIMEOUT,
      stopTimeout: ANVIL_CONFIG.TIMEOUT,
    })
    let tokenboundClient: TokenboundClient
    let publicClient: PublicClient
    let NFT_IN_EOA: CreateAccountParams
    let TOKENID_IN_EOA: string
    let TOKENID1_IN_TBA: string
    let TOKENID2_IN_TBA: string
    let ZORA721_TBA_ADDRESS: `0x${string}`

    let serverProcess: any

    beforeAll(async () => {
      try {
        publicClient = getPublicClient({ chainId: ANVIL_CONFIG.ACTIVE_CHAIN.id })

        tokenboundClient = new TokenboundClient({
          chainId: ANVIL_CONFIG.ACTIVE_CHAIN.id,
          walletClient,
          signer,
          publicClient: signer ? undefined : publicClient,
          testingMode,
        })
        ;(tokenboundClient as any).bundlerUrl = BUNDLER_URL

        await anvil.start()

        const commandDirectory = path.resolve(__dirname, './bundler')
        console.log('running command to start node server')

        serverProcess = spawn(
          'node',
          [
            '--experimental-specifier-resolution=node',
            './packages/cli/bin/skandha.js',
            'standalone',
            '--unsafeMode',
          ],
          { cwd: commandDirectory, env: { ...process.env, BENCHMARK: 'false' } }
        )

        // uncomment for debugging output
        // serverProcess.stdout.on('data', (data) => {
        //   console.log(`Server stdout: ${data}`)
        // })

        // serverProcess.stderr.on('data', (data) => {
        //   console.error(`Server stderr: ${data}`)
        // })

        console.log('waiting 10s for server to startup....')
        await new Promise((resolve) => setTimeout(resolve, 10000))
        console.log(`START → \x1b[94m ${testName} \x1b[0m`)
      } catch (err) {
        console.error('Error during setup:', err)
      }
    }, TIMEOUT + TIMEOUT)

    afterAll(async () => {
      if (serverProcess) {
        serverProcess.kill()
        console.log('Successfully killed process on port 14337.')
      }
      await anvil.stop()

      console.log(`END → \x1b[94m ${testName} \x1b[0m`)
    }, TIMEOUT + TIMEOUT)

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

            if (eoaTokenId && tbaToken1Id && tbaToken2Id) {
              TOKENID_IN_EOA = eoaTokenId.toString()
              TOKENID1_IN_TBA = tbaToken1Id.toString()
              TOKENID2_IN_TBA = tbaToken2Id.toString()

              NFT_IN_EOA = {
                tokenContract: zora721.proxyContractAddress,
                tokenId: TOKENID_IN_EOA,
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
          expect(zoraBalanceInAnvilWallet).toBe(3n)
          unwatch()
        })
      },
      TIMEOUT
    )

    // We create the account using an NFT in the EOA wallet so we can test the EOA methods and use the TBA address for tests
    it('can createAccount', async () => {
      const createdAccount = await tokenboundClient.createAccount(NFT_IN_EOA)
      ZORA721_TBA_ADDRESS = createdAccount
      await waitFor(() => {
        expect(createdAccount).toMatch(ADDRESS_REGEX)
      })
    })

    it('can getAccount', async () => {
      const getAccount = tokenboundClient.getAccount(NFT_IN_EOA)
      await waitFor(() => {
        expect(getAccount).toMatch(ADDRESS_REGEX)
        expect(getAccount).toEqual(ZORA721_TBA_ADDRESS)
      })
    })

    // We transfer an NFT to the TBA so that we can test the TBA methods.
    it(
      'can transfer one of the minted NFTs to the TBA',
      async () => {
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
          transferHash = await signer
            .sendTransaction({
              chainId: ANVIL_CONFIG.ACTIVE_CHAIN.id,
              ...preparedNFTTransfer,
            })
            .then((tx: providers.TransactionResponse) => tx.hash)
        }

        const transactionReceipt = await publicClient.getTransactionReceipt({
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
          transferHash = await signer
            .sendTransaction({
              chainId: ANVIL_CONFIG.ACTIVE_CHAIN.id,
              ...preparedNFTTransfer,
            })
            .then((tx: providers.TransactionResponse) => tx.hash)
        }

        const transactionReceipt = await publicClient.getTransactionReceipt({
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
      'can executeCall with the TBA',
      async () => {
        const executedCallTxHash = await tokenboundClient.executeCall({
          account: ZORA721_TBA_ADDRESS,
          to: zora721.proxyContractAddress,
          value: 0n,
          data: '',
        })

        const transactionReceipt = await publicClient.getTransactionReceipt({
          hash: executedCallTxHash,
        })

        await waitFor(() => {
          expect(executedCallTxHash).toMatch(ADDRESS_REGEX)
          expect(transactionReceipt.status).toMatch('success')
        })

        const balance = await publicClient.getBalance({
          address: ZORA721_TBA_ADDRESS,
        })

        tbaBalanceTracker = balance
      },
      TIMEOUT
    )

    // The other methods in the SDK implement executeCall,
    // so they provide further reinforcement that executeCall works.
    it(
      'can transferETH with the TBA',
      async () => {
        const EXPECTED_BALANCE_BEFORE = tbaBalanceTracker
        const balanceInEth = +formatEther(tbaBalanceTracker)
        const EXPECTED_BALANCE_AFTER = subtractFromBalanceToWei(balanceInEth, 0.25)

        const balanceBefore = await publicClient.getBalance({
          address: ZORA721_TBA_ADDRESS,
        })
        const ethTransferHash = await tokenboundClient.transferETH({
          account: ZORA721_TBA_ADDRESS,
          amount: 0.25,
          recipientAddress: ANVIL_USER_1,
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

        // prettier-ignore
        await waitFor(() => {
          expect(ethTransferHash).toMatch(ADDRESS_REGEX)
          expect(balanceBefore).toEqual(EXPECTED_BALANCE_BEFORE)
          expect(balanceAfter).toBeGreaterThanOrEqual(EXPECTED_BALANCE_AFTER - parseUnits('0.0025', 18))
          expect(balanceAfter).toBeLessThanOrEqual(EXPECTED_BALANCE_AFTER + parseUnits('0.0025', 18))
        })

        tbaBalanceTracker = balanceAfter
      },
      { timeout: TIMEOUT }
    )

    it(
      'can transferETH to an ENS with the TBA',
      async () => {
        // we need to increase the margin for error here as there is a new expected balance for before and after
        const EXPECTED_BALANCE_BEFORE = tbaBalanceTracker
        // prettier-ignore
        const balanceInEth = +formatEther(tbaBalanceTracker)
        const EXPECTED_BALANCE_AFTER = subtractFromBalanceToWei(balanceInEth, 0.25)

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

        // prettier-ignore
        await waitFor(() => {
          expect(ethTransferHash).toMatch(ADDRESS_REGEX)
          expect(balanceBefore).toEqual(EXPECTED_BALANCE_BEFORE)
          expect(balanceAfter).toBeGreaterThanOrEqual(EXPECTED_BALANCE_AFTER - parseUnits('0.0025', 18))
          expect(balanceAfter).toBeLessThanOrEqual(EXPECTED_BALANCE_AFTER + parseUnits('0.0025', 18))
        })

        tbaBalanceTracker = balanceAfter
      },
      { timeout: TIMEOUT }
    )

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

    it(
      'can transferNFT a 721 with the TBA',
      async () => {
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
      },
      { timeout: TIMEOUT }
    )

    it(
      'can transferNFT to an ENS with the TBA',
      async () => {
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
      },
      { timeout: TIMEOUT }
    )

    it(
      'can mint 3 Zora 721 NFTs with the TBA',
      async () => {
        const encodedMintFunctionData = encodeFunctionData({
          abi: zora721.abi,
          functionName: 'purchase',
          args: [BigInt(zora721.quantity)],
        })

        const mintToTBATxHash = await tokenboundClient.executeCall({
          account: ZORA721_TBA_ADDRESS,
          to: zora721.proxyContractAddress,
          value: zora721.mintPrice * BigInt(zora721.quantity),
          data: encodedMintFunctionData,
        })

        const zoraBalanceInTBA = await getZora721Balance({
          publicClient,
          walletAddress: ZORA721_TBA_ADDRESS,
        })

        await waitFor(() => {
          expect(mintToTBATxHash).toMatch(ADDRESS_REGEX)
          expect(NFT_IN_EOA.tokenId).toBe(TOKENID_IN_EOA)
          expect(zoraBalanceInTBA).toBe(3n)
        })
      },
      { timeout: TIMEOUT }
    )

    it(
      'can mint an 1155 with the TBA',
      async () => {
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

        const mint1155TxHash = await tokenboundClient.executeCall({
          account: mintingAccount,
          to: zora1155.proxyContractAddress,
          value: zora1155.mintFee * zora1155.quantity,
          data,
        })

        const zora1155BalanceInTBA = await getZora1155Balance({
          publicClient,
          walletAddress: mintingAccount,
        })

        console.log('1155 Balance', zora1155BalanceInTBA)

        await waitFor(() => {
          expect(mint1155TxHash).toMatch(ADDRESS_REGEX)
          expect(zora1155BalanceInTBA).toBe(5n)
        })
      },
      { timeout: TIMEOUT }
    )

    it(
      'can transferNFT an 1155 with the TBA',
      async () => {
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
      },
      { timeout: TIMEOUT }
    )

    // Test signing in viem only.
    // Ethers 5/6 don't appear to support signing messages via personal_sign with this testing configuration.
    testInViemOnly('can sign a message', async () => {
      const signedMessageHash = await tokenboundClient.signMessage({
        message: 'Sign me',
      })

      console.log('SIGNED MESSAGE: ', signedMessageHash)

      await waitFor(() => {
        expect(signedMessageHash).toMatch(ADDRESS_REGEX)
      })
    })

    // Test signing hex message in viem only.
    testInViemOnly('can sign a hexified message', async () => {
      const hexSignedMessageHash = await tokenboundClient.signMessage({
        message: { raw: '0x68656c6c6f20776f726c64' },
      })

      console.log('HEX SIGNED MESSAGE: ', hexSignedMessageHash)

      await waitFor(() => {
        expect(hexSignedMessageHash).toMatch(ADDRESS_REGEX)
      })
    })

    // Test signing Uint8Array message as raw in viem only.
    testInViemOnly('can sign a Uint8Array message as raw', async () => {
      const uint8ArrayMessage: Uint8Array = new Uint8Array([72, 101, 108, 108, 111]) // "Hello" in ASCII

      const rawUint8Hash = await tokenboundClient.signMessage({
        message: { raw: uint8ArrayMessage },
      })

      await waitFor(() => {
        expect(rawUint8Hash).toMatch(ADDRESS_REGEX)
      })
    })

    // Test signing ArrayLike message in viem only.
    testInViemOnly(
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
    testInViemOnly(
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

    it(
      'can transferERC20 with the TBA',
      async () => {
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
            walletClient,
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
      },
      { timeout: TIMEOUT }
    )
  })
}

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
