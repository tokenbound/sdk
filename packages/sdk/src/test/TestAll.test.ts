import { describe, expect, it } from 'vitest'
import { mainnet } from 'viem/chains'
import { providers } from 'ethers'
import { zora1155ABI, zora721DropABI } from './wagmi-cli-hooks/generated'
import { waitFor } from './mockWallet'
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
  // encodeAbiParameters,
  // parseAbiParameters,
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { CreateAccountParams, TokenboundClient } from '@tokenbound/sdk'
import { ADDRESS_REGEX, ANVIL_ACCOUNTS, ANVIL_RPC_URL } from './constants'
import { walletClientToEthers5Signer, walletClientToEthers6Signer } from '../utils'
import {
  // debugTransaction,
  getPublicClient,
} from './utils'

const ACTIVE_CHAIN = mainnet
const TIMEOUT = 60000 // default 10000

const ANVIL_CONFIG: CreateAnvilOptions = {
  forkChainId: ACTIVE_CHAIN.id,
  forkUrl: import.meta.env.VITE_ANVIL_MAINNET_FORK_ENDPOINT,
  forkBlockNumber: import.meta.env.VITE_ANVIL_MAINNET_FORK_BLOCK_NUMBER
    ? parseInt(import.meta.env.VITE_ANVIL_MAINNET_FORK_BLOCK_NUMBER)
    : undefined,
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
const zora721 = {
  proxyContractAddress: getAddress('0x28ee638f2fcb66b4106acab7efd225aeb2bd7e8d'),
  mintPrice: BigInt(0),
  quantity: 2,
  tbaAddress: getAddress('0xc33f0A7FcD69Ba00b4e980463199CD38E30d0E5c'),
}

// https://zora.co/collect/eth:0x373075bab7d668ed2473d8233ebdebcf49eb758e/1
// const zora1155 = {
//   minterAddress: getAddress('0x8A1DBE9b1CeB1d17f92Bebf10216FCFAb5C3fbA7'), // IMinter1155 minter contract is FIXED_PRICE_SALE_STRATEGY from https://github.com/ourzora/zora-1155-contracts/blob/main/addresses/1.json
//   proxyContractAddress: getAddress('0x373075bab7d668ed2473d8233ebdebcf49eb758e'), // proxied Zora 1155 contract
//   tokenId: BigInt(1),
//   mintFee: ethToWei(0.000777), // 0.000777 ETH
//   quantity: BigInt(5),
// }
// https://zora.co/collect/eth:0xa5358a17f943f9fb20d1f8dcf5ed9a9770bb0698/1
const zora1155 = {
  minterAddress: getAddress('0x8A1DBE9b1CeB1d17f92Bebf10216FCFAb5C3fbA7'), // IMinter1155 minter contract is FIXED_PRICE_SALE_STRATEGY from https://github.com/ourzora/zora-1155-contracts/blob/main/addresses/1.json
  proxyContractAddress: getAddress('0xa5358a17f943f9fb20d1f8dcf5ed9a9770bb0698'), // proxied Zora 1155 contract
  tokenId: BigInt(1),
  mintFee: ethToWei(0.000777), // 0.000777 ETH
  quantity: BigInt(5),
}

const TOKENID_IN_EOA: string = '10010'
const TOKENID_IN_TBA: string = '10011'

function ethToWei(eth: number) {
  return parseUnits(eth.toString(), 18)
}

async function getZora721Balance({
  publicClient,
  walletAddress,
}: {
  publicClient: PublicClient
  walletAddress: `0x${string}`
}) {
  return await publicClient.readContract({
    address: zora721.proxyContractAddress,
    abi: zora721DropABI,
    functionName: 'balanceOf',
    args: [walletAddress],
  })
}

// async function getZora1155Balance({
//   publicClient,
//   walletAddress,
// }: {
//   publicClient: PublicClient
//   walletAddress: `0x${string}`
// }) {
//   return await publicClient.readContract({
//     address: zora1155.proxyContractAddress,
//     abi: zora1155ABI,
//     functionName: 'balanceOf',
//     args: [walletAddress, zora1155.tokenId],
//   })
// }

describe('ComboTester', () => {
  const walletClient = createWalletClient({
    transport: http(ANVIL_RPC_URL),
    chain: ACTIVE_CHAIN,
    account: privateKeyToAccount(ANVIL_ACCOUNTS[0].privateKey),
    pollingInterval: 100,
  })

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
  describe(testName, () => {
    const anvil = createAnvil({ ...ANVIL_CONFIG })

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
          publicClient,
        })

        await anvil.start()
        console.log(`START \x1b[94m ${testName} \x1b[0m`)
      } catch (err) {
        console.error('Error during setup:', err)
      }
    }, TIMEOUT)

    afterAll(async () => {
      await anvil.stop()
      console.log(`END \x1b[94m ${testName} \x1b[0m`)
    })

    it(
      'can mint 2 Zora 721 NFTs into Anvil wallet #0',
      async () => {
        let mintLogs: Log[] = []

        // Set up observer for mint event so we can get the tokenId
        const unwatch = publicClient.watchContractEvent({
          address: zora721.proxyContractAddress,
          abi: zora721DropABI,
          eventName: 'Transfer',
          args: {
            to: ANVIL_USER_0,
          },
          onLogs: (logs) => {
            mintLogs = logs
            const mintArgs = logs[0].args
            const { tokenId } = mintArgs

            ZORA_WEBB_TOKEN = {
              tokenContract: zora721.proxyContractAddress,
              tokenId: tokenId!.toString(),
            }
          },
        })

        // Prepare mint transaction
        // const mintPrice = BigInt(0)
        // const mintQuantity = 2
        const encodedMintFunctionData = encodeFunctionData({
          abi: zora721DropABI,
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
            chain: ACTIVE_CHAIN,
            account: ANVIL_USER_0,
            ...prepared721Mint,
          })
        } else if (signer) {
          mintTxHash = await signer
            .sendTransaction({
              chainId: ACTIVE_CHAIN.id,
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
          expect(ZORA_WEBB_TOKEN.tokenId).toBe(TOKENID_IN_EOA)
          expect(zoraBalanceInAnvilWallet).toBe(2n)
          unwatch()
        })
      },
      TIMEOUT
    )

    it(
      'can transfer one of the minted NFTs to the TBA',
      async () => {
        const transferCallData = encodeFunctionData({
          abi: zora721DropABI,
          functionName: 'safeTransferFrom',
          args: [
            ANVIL_USER_0, // from
            zora721.tbaAddress, // to
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
            chain: ACTIVE_CHAIN,
            account: walletClient.account!.address,
            ...preparedNFTTransfer,
          })
        } else {
          transferHash = await signer
            .sendTransaction({
              chainId: ACTIVE_CHAIN.id,
              ...preparedNFTTransfer,
            })
            .then((tx: providers.TransactionResponse) => tx.hash)
        }

        const transactionReceipt = await publicClient.getTransactionReceipt({
          hash: transferHash,
        })

        const tbaNFTBalance = await getZora721Balance({
          publicClient,
          walletAddress: zora721.tbaAddress,
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

    it('can createAccount', async () => {
      const createdAccount = await tokenboundClient.createAccount(ZORA_WEBB_TOKEN)
      await waitFor(() => {
        expect(createdAccount).toMatch(ADDRESS_REGEX)
        expect(createdAccount).toEqual(zora721.tbaAddress)
      })
    })

    it('can getAccount', async () => {
      const getAccount = tokenboundClient.getAccount(ZORA_WEBB_TOKEN)
      await waitFor(() => {
        expect(getAccount).toMatch(ADDRESS_REGEX)
        expect(getAccount).toEqual(zora721.tbaAddress)
      })
    })

    it(
      'can transfer ETH to the TBA',
      async () => {
        const ethAmount = 1
        const ethAmountWei = parseUnits(`${ethAmount}`, 18)

        const preparedETHTransfer = {
          to: zora721.tbaAddress,
          value: ethAmountWei,
          // data is optional if nil
        }

        let transferHash: `0x${string}`
        if (walletClient) {
          transferHash = await walletClient.sendTransaction({
            chain: ACTIVE_CHAIN,
            account: walletClient.account!.address,
            ...preparedETHTransfer,
          })
        } else {
          transferHash = await signer
            .sendTransaction({
              chainId: ACTIVE_CHAIN.id,
              ...preparedETHTransfer,
            })
            .then((tx: providers.TransactionResponse) => tx.hash)
        }

        const balanceAfter = await publicClient.getBalance({
          address: zora721.tbaAddress,
        })

        await waitFor(() => {
          expect(transferHash).toMatch(ADDRESS_REGEX)
          expect(balanceAfter).toBe(ethAmountWei)
        })
      },
      TIMEOUT
    )

    it(
      'can executeCall with the TBA',
      async () => {
        const executedCallTxHash = await tokenboundClient.executeCall({
          account: zora721.tbaAddress,
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

    it('can transferETH with the TBA', async () => {
      const EXPECTED_BALANCE_BEFORE = parseUnits('1', 18)
      const EXPECTED_BALANCE_AFTER = parseUnits('0.5', 18)

      const balanceBefore = await publicClient.getBalance({
        address: zora721.tbaAddress,
      })
      const ethTransferHash = await tokenboundClient.transferETH({
        account: zora721.tbaAddress,
        amount: 0.5,
        recipientAddress: ANVIL_USER_1,
      })
      const balanceAfter = await publicClient.getBalance({
        address: zora721.tbaAddress,
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
        account: zora721.tbaAddress,
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
        abi: zora721DropABI,
        functionName: 'purchase',
        args: [BigInt(zora721.quantity)],
      })

      const mintToTBATxHash = await tokenboundClient.executeCall({
        account: zora721.tbaAddress,
        to: zora721.proxyContractAddress,
        value: zora721.mintPrice * BigInt(zora721.quantity),
        data: encodedMintFunctionData,
      })

      const zoraBalanceInTBA = await getZora721Balance({
        publicClient,
        walletAddress: zora721.tbaAddress,
      })

      console.log('721s MINTED TO TBA: ', zoraBalanceInTBA.toString())

      await waitFor(() => {
        expect(mintToTBATxHash).toMatch(ADDRESS_REGEX)
        expect(ZORA_WEBB_TOKEN.tokenId).toBe(TOKENID_IN_EOA)
        expect(zoraBalanceInTBA).toBe(2n)
      })
    })

    // it('can mint an 1155 with the TBA', async () => {
    //   const mintAddress: `0x${string}` = zora721.tbaAddress
    //   // const mintAddress: `0x${string}` = ANVIL_USER_0

    //   const minterArguments: `0x${string}` = encodeAbiParameters(
    //     parseAbiParameters('address'),
    //     [mintAddress]
    //   )

    //   const mint1155TxHash = await tokenboundClient.executeCall({
    //     account: mintAddress,
    //     to: zora1155.proxyContractAddress,
    //     value: zora1155.mintFee * zora1155.quantity,
    //     data: encodeFunctionData({
    //       abi: zora1155ABI,
    //       functionName: 'mint',
    //       args: [
    //         zora1155.minterAddress,
    //         zora1155.tokenId,
    //         zora1155.quantity,
    //         minterArguments,
    //       ],
    //     }),
    //   })

    //   await debugTransaction({ publicClient, hash: mint1155TxHash })

    //   const zora1155BalanceInTBA = await getZora1155Balance({
    //     publicClient,
    //     walletAddress: mintAddress,
    //   })

    //   console.log('1155 Balance', zora1155BalanceInTBA)

    //   await waitFor(() => {
    //     expect(mint1155TxHash).toMatch(ADDRESS_REGEX)
    //     expect(zora1155BalanceInTBA).toBe(5n)
    //     expect(true).toBe(true)
    //   })
    // })

    // it('can sign a message', async () => {
    //   const signedMessageHash = await tokenboundClient.signMessage({
    //     message: 'Sign me',
    //   })

    //   console.log('SIGNED MESSAGE: ', signedMessageHash)

    //   await waitFor(() => {
    //     expect(signedMessageHash).toMatch(ADDRESS_REGEX)
    //   })
    // })

    test.todo('can transferNFT with an 1155', async () => {})
    test.todo('can transferERC20', async () => {})
    test.todo('can sign a message', async () => {})
  })
}
