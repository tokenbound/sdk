import { createAnvil } from '@viem/anvil'
import {
  createPublicClient,
  createTestClient,
  createWalletClient,
  http,
  isAddress,
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { foundry } from 'viem/chains'
import { afterAll, afterEach, beforeAll, expect, test } from 'vitest'
import { ANVIL_CONFIG, CREATE_ANVIL_OPTIONS, zora721 } from './config'
import { ANVIL_ACCOUNTS, ANVIL_RPC_URL } from './constants'
import { ERC_6551_LEGACY_V2 } from '../constants'

import { TokenboundClient } from '../TokenboundClient'

import { ENABLED_TESTS } from './TestAll.test'
import { TBVersion } from '..'

const anvil = createAnvil({ ...CREATE_ANVIL_OPTIONS })
const testClient = createTestClient({
  chain: foundry,
  mode: 'anvil',
  transport: http(),
})
const walletClient = createWalletClient({
  transport: http(ANVIL_RPC_URL),
  chain: ANVIL_CONFIG.ACTIVE_CHAIN,
  account: privateKeyToAccount(ANVIL_ACCOUNTS[0].privateKey),
})

const publicClient = createPublicClient({
  transport: http(ANVIL_RPC_URL),
  chain: foundry,
  pollingInterval: 100,
})

beforeAll(async () => {
  await anvil.start()
})

afterAll(async () => {
  await anvil.stop()
})

afterEach(async () => {
  await testClient.reset()
})

test.each(ENABLED_TESTS)(
  'Can deploy with custom chainId $testName',
  async ({ walletClient, signer, version }) => {
    const tokenboundClient = new TokenboundClient({
      chainId: ANVIL_CONFIG.ACTIVE_CHAIN.id,
      walletClient,
      signer,
      publicClient,
      implementationAddress:
        version === TBVersion.V2 ? ERC_6551_LEGACY_V2.IMPLEMENTATION.ADDRESS : undefined,
      registryAddress:
        version === TBVersion.V2 ? ERC_6551_LEGACY_V2.REGISTRY.ADDRESS : undefined,
    })
    const { account, txHash } = await tokenboundClient.createAccount({
      tokenContract: zora721.proxyContractAddress,
      tokenId: '1',
      chainId: ANVIL_CONFIG.ACTIVE_CHAIN.id + 1,
    })
    console.log('CREATED ACCT WITH CUSTOM CHAIN ID', account)

    const createdAccountTxReceipt = await publicClient.waitForTransactionReceipt({
      hash: txHash,
    })

    console.log(createdAccountTxReceipt)

    expect(isAddress(account)).toBe(true)
    expect(createdAccountTxReceipt.status).toBe('success')

    console.log(account)

    const bytecode = await publicClient.getBytecode({ address: account })
    console.log(bytecode)

    const accountData = await tokenboundClient.deconstructBytecode({
      accountAddress: account,
    })

    console.log(accountData)

    expect(accountData?.chainId).toEqual(ANVIL_CONFIG.ACTIVE_CHAIN.id + 1)
  }
)
