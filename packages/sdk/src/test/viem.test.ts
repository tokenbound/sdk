import { goerli } from 'viem/chains'
import { isHex, createPublicClient, http, isAddress } from 'viem'
import { describe, test, expect, it, vi } from 'vitest'

import {
  computeAccount,
  getAccount,
  prepareCreateAccount,
  prepareExecuteCall,
} from '../index'

import { TEST_CONFIG, TEST_RESULTS } from './config'
import { ERC_6551_LEGACY_V2 } from '../constants'

describe('Test SDK read methods across standard implementations', () => {
  runTests({
    testName: 'v2',
    expectedTestResults: TEST_RESULTS.V2,
    implementationAddress: ERC_6551_LEGACY_V2.IMPLEMENTATION.ADDRESS,
    registryAddress: ERC_6551_LEGACY_V2.REGISTRY.ADDRESS,
  })
  // runTests({ testName: 'v3', expectedTestResults: TEST_RESULTS.V3 })
})

function runTests({
  testName,
  expectedTestResults,
  implementationAddress,
  registryAddress,
}: {
  testName: string
  expectedTestResults: Object
  implementationAddress?: `0x${string}`
  registryAddress?: `0x${string}`
}) {
  test(`.getAccount ${testName}`, async () => {
    const publicClient = createPublicClient({
      chain: goerli,
      transport: http(),
    })

    const result = await getAccount(
      TEST_CONFIG.TOKEN_CONTRACT,
      TEST_CONFIG.TOKEN_ID,
      publicClient,
      implementationAddress,
      registryAddress
    )
    // expect(result).toEqual(TEST_CONFIG.TB_ACCOUNT)
    expect(result).toEqual(expectedTestResults['TB_ACCOUNT'])
  })

  test(`computeAccount ${testName}`, async () => {
    const result = computeAccount(
      TEST_CONFIG.TOKEN_CONTRACT,
      TEST_CONFIG.TOKEN_ID,
      TEST_CONFIG.CHAIN_ID,
      implementationAddress,
      registryAddress
    )
    // expect(result).toEqual(TEST_CONFIG.TB_ACCOUNT)
    expect(result).toEqual(expectedTestResults['TB_ACCOUNT'])
  })

  test.todo(`.getCreationCode ${testName}`)

  test(`.prepareExecuteCall ${testName}`, async () => {
    const preparedCall = await prepareExecuteCall(
      // TEST_CONFIG.TB_ACCOUNT,
      expectedTestResults['TB_ACCOUNT'],
      TEST_CONFIG.RECIPIENT_ADDRESS,
      TEST_CONFIG.EXAMPLE_AMOUNT,
      TEST_CONFIG.EXAMPLE_DATA
    )

    expect(isAddress(preparedCall.to)).toEqual(true)
    expect(typeof preparedCall.value).toEqual('bigint')
    expect(isHex(preparedCall.data)).toEqual(true)
  })

  test(`.prepareCreateAccount ${testName}`, async () => {
    const preparedAccount = await prepareCreateAccount(
      TEST_CONFIG.TOKEN_CONTRACT,
      TEST_CONFIG.TOKEN_ID,
      TEST_CONFIG.CHAIN_ID,
      implementationAddress,
      registryAddress
    )

    expect(isAddress(preparedAccount.to)).toEqual(true)
    expect(typeof preparedAccount.value).toEqual('bigint')
    expect(isHex(preparedAccount.data)).toEqual(true)
  })
}
