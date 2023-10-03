// This test suite is for testing the SDK methods with
// viem walletClient + publicClient and with Ethers 5/6.

import { describe, expect, it } from 'vitest'
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
  // encodeAbiParameters,
  // parseAbiParameters,
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { CreateAccountParams, TokenboundClient } from '@tokenbound/sdk'
import {
  ADDRESS_REGEX,
  ANVIL_ACCOUNTS,
  ANVIL_RPC_URL,
  WETH_CONTRACT_ADDRESS,
} from './constants'
import { walletClientToEthers5Signer, walletClientToEthers6Signer } from '../utils'
import {
  ethToWei,
  getPublicClient,
  getWETHBalance,
  // debugTransaction,
  // getZora1155Balance,
  getZora721Balance,
} from './utils'
import {
  ANVIL_CONFIG,
  CREATE_ANVIL_OPTIONS,
  zora721,
  // zora1155
} from './config'
import {
  wethABI,
  // zora1155ABI
} from './wagmi-cli-hooks/generated'

const TIMEOUT = 60000 // default 10000
const ANVIL_USER_0 = getAddress(ANVIL_ACCOUNTS[0].address)
const ANVIL_USER_1 = getAddress(ANVIL_ACCOUNTS[1].address)

const walletClient = createWalletClient({
  transport: http(ANVIL_RPC_URL),
  chain: ANVIL_CONFIG.ACTIVE_CHAIN,
  account: privateKeyToAccount(ANVIL_ACCOUNTS[0].privateKey),
  pollingInterval: 100,
})

// Create Ethers 5/6 signers from the walletClient + run tests
describe('Test SDK methods - viem + Ethers', () => {
  const ethers5Signer = walletClientToEthers5Signer(walletClient)
  const ethers6Signer = walletClientToEthers6Signer(walletClient)

  runTxTests({ testName: 'Viem Tests', walletClient })

  const ENABLE_ETHERS_TESTS = true

  if (ENABLE_ETHERS_TESTS) {
    runTxTests({ testName: 'Ethers 5 Tests', signer: ethers5Signer })
    runTxTests({ testName: 'Ethers 6 Tests', signer: ethers6Signer })
  }
})

function runTxTests({
  testName,
  walletClient,
  signer,
}: {
  testName: string
  walletClient?: WalletClient
  signer?: any
}) {
  // Skip tests that are non-functional in Ethers
  const testInViemOnly = walletClient ? it : it.skip

  describe(testName, () => {
    // Set up Anvil instance + clients
    const anvil = createAnvil({ ...CREATE_ANVIL_OPTIONS })
    let tokenboundClient: TokenboundClient
    let publicClient: PublicClient
    let NFT_IN_EOA: CreateAccountParams
    let TOKENID_IN_EOA: string
    let TOKENID_IN_TBA: string
    let ZORA721_TBA_ADDRESS: `0x${string}`

    // Spin up a fresh anvil instance each time we run the test suite against a different signer
    beforeAll(async () => {
      try {
        publicClient = getPublicClient({ chainId: ANVIL_CONFIG.ACTIVE_CHAIN.id })

        // Pass in the Anvil test walletClient + publicClient
        tokenboundClient = new TokenboundClient({
          chainId: ANVIL_CONFIG.ACTIVE_CHAIN.id,
          walletClient,
          signer,
          publicClient: signer ? undefined : publicClient, // No publicClient if using Ethers
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
            const { tokenId: tbaTokenId } = logs[1].args

            if (eoaTokenId && tbaTokenId) {
              TOKENID_IN_EOA = eoaTokenId.toString()
              TOKENID_IN_TBA = tbaTokenId.toString()

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
          expect(zoraBalanceInAnvilWallet).toBe(2n)
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
            BigInt(TOKENID_IN_TBA), // tokenId
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
      },
      TIMEOUT
    )

    // The other methods in the SDK implement executeCall,
    // so they provide further reinforcement that executeCall works.
    it('can transferETH with the TBA', async () => {
      const EXPECTED_BALANCE_BEFORE = parseUnits('1', 18)
      const EXPECTED_BALANCE_AFTER = parseUnits('0.5', 18)

      const balanceBefore = await publicClient.getBalance({
        address: ZORA721_TBA_ADDRESS,
      })
      const ethTransferHash = await tokenboundClient.transferETH({
        account: ZORA721_TBA_ADDRESS,
        amount: 0.5,
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

      await waitFor(() => {
        expect(ethTransferHash).toMatch(ADDRESS_REGEX)
        expect(balanceBefore).toBe(EXPECTED_BALANCE_BEFORE)
        expect(balanceAfter).toBe(EXPECTED_BALANCE_AFTER)
      })
    })

    it('can transferNFT with the TBA', async () => {
      const transferNFTHash = await tokenboundClient.transferNFT({
        account: ZORA721_TBA_ADDRESS,
        tokenType: 'ERC721',
        tokenContract: zora721.proxyContractAddress,
        tokenId: TOKENID_IN_TBA,
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

    it('can mint 2 Zora 721 NFTs with the TBA', async () => {
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

      console.log('721s MINTED TO TBA: ', zoraBalanceInTBA.toString())

      await waitFor(() => {
        expect(mintToTBATxHash).toMatch(ADDRESS_REGEX)
        expect(NFT_IN_EOA.tokenId).toBe(TOKENID_IN_EOA)
        expect(zoraBalanceInTBA).toBe(2n)
      })
    })

    // it('can mint an 1155 with the TBA', async () => {
    //   const mintingAccount: `0x${string}` = ZORA721_TBA_ADDRESS
    //   // const mintAddress: `0x${string}` = ANVIL_USER_0

    //   const minterArguments: `0x${string}` = encodeAbiParameters(
    //     parseAbiParameters('address'),
    //     [mintingAccount]
    //   )

    //   const mint1155TxHash = await tokenboundClient.executeCall({
    //     account: mintingAccount,
    //     to: zora1155.proxyContractAddress,
    //     value: zora1155.mintFee * zora1155.quantity,
    //     data: encodeFunctionData({
    //       abi: zora1155ABI,
    //       functionName: 'mint',
    //       args: [
    //         zora1155.fixedPriceSalesStrategy,
    //         zora1155.tokenId,
    //         zora1155.quantity,
    //         minterArguments,
    //       ],
    //     }),
    //   })

    //   await debugTransaction({ publicClient, hash: mint1155TxHash })

    //   const zora1155BalanceInTBA = await getZora1155Balance({
    //     publicClient,
    //     walletAddress: mintingAccount,
    //   })

    //   console.log('1155 Balance', zora1155BalanceInTBA)

    //   await waitFor(() => {
    //     expect(mint1155TxHash).toMatch(ADDRESS_REGEX)
    //     expect(zora1155BalanceInTBA).toBe(5n)
    //     expect(true).toBe(true)
    //   })
    // })

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

    it('can transferERC20 with the TBA', async () => {
      const depositEthValue = 0.25
      const depositWeiValue = ethToWei(depositEthValue)
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
        amount: depositEthValue,
        recipientAddress: ANVIL_USER_1,
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

      console.log(
        'TBA WETH INITIAL: ',
        formatEther(tbaWETHInitial),
        'TBA RECEIVED: ',
        formatEther(tbaWETHReceived),
        'AFTER: ',
        formatEther(tbaWETHFinal),
        'ANVIL USER 1 BALANCE: ',
        formatEther(anvilUser1WETHBalance)
      )

      await waitFor(() => {
        expect(wethDepositHash).toMatch(ADDRESS_REGEX)
        expect(wethTransferHash).toMatch(ADDRESS_REGEX)
        expect(transferredERC20Hash).toMatch(ADDRESS_REGEX)
        expect(tbaWETHReceived).toBe(depositWeiValue)
        expect(anvilUser1WETHBalance).toBe(depositWeiValue)
      })
    })

    test.todo('can transferNFT with an 1155', async () => {})
    test.todo('can transfer with ENS', async () => {})
    test.todo('can sign a message', async () => {})
  })
}

describe('Custom publicClient RPC URL', () => {
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
})
