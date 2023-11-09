import { test, expect } from 'vitest'
import { isHex, isAddress } from 'viem'

import { TokenboundClient } from '../TokenboundClient'
import { TEST_CONFIG } from './config'
import { ERC_6551_LEGACY_V2 } from '../constants'

const tokenboundClient = new TokenboundClient({
  // signer, // no signer, only performing writes
  chainId: TEST_CONFIG.CHAIN_ID,
  implementationAddress: TEST_CONFIG.CUSTOM_IMPLEMENTATION_ADDRESS,
  registryAddress: ERC_6551_LEGACY_V2.REGISTRY.ADDRESS,
  // version: 'V2',
})

test('tokenboundClient.getAccount → customImplementation', () => {
  const result = tokenboundClient.getAccount({
    tokenContract: TEST_CONFIG.TOKEN_CONTRACT,
    tokenId: TEST_CONFIG.TOKEN_ID,
  })
  expect(result).toEqual(TEST_CONFIG.CUSTOM_IMPLEMENTATION_TB_ACCOUNT)
})

test('tokenboundClient.prepareCreateAccount → customImplementation', async () => {
  const preparedAccount = await tokenboundClient.prepareCreateAccount({
    tokenContract: TEST_CONFIG.TOKEN_CONTRACT,
    tokenId: TEST_CONFIG.TOKEN_ID,
  })

  expect(isAddress(preparedAccount.to)).toEqual(true)
  expect(typeof preparedAccount.value).toEqual('bigint')
  expect(isHex(preparedAccount.data)).toEqual(true)
})
