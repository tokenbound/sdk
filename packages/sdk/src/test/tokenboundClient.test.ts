import { describe, test, expect } from 'vitest'
import { isHex, isAddress } from 'viem'
import { TokenboundClient } from '../TokenboundClient'
import { TEST_CONFIG, TEST_RESULTS } from './config'
import { ERC_6551_LEGACY_V2 } from '../constants'
import { TBVersion } from '../types'

const TIMEOUT = 60000 // default 10000

describe.each([
  {
    testName: 'v2',
    expectedTestResults: TEST_RESULTS.V2,
    implementationAddress: ERC_6551_LEGACY_V2.IMPLEMENTATION.ADDRESS,
    registryAddress: ERC_6551_LEGACY_V2.REGISTRY.ADDRESS,
  },
  { testName: 'v3', expectedTestResults: TEST_RESULTS.V3 },
])(
  'Test SDK write methods across standard implementations $testName',
  ({ testName, expectedTestResults, implementationAddress, registryAddress }) => {
    const tokenboundClient = new TokenboundClient({
      chainId: TEST_CONFIG.CHAIN_ID,
      version: testName === 'v2' ? TBVersion.V2 : TBVersion.V3,
      implementationAddress,
      registryAddress,
    })

    test(`tokenboundClient.getAccount ${testName}`, () => {
      const result = tokenboundClient.getAccount({
        tokenContract: TEST_CONFIG.TOKEN_CONTRACT,
        tokenId: TEST_CONFIG.TOKEN_ID,
      })
      expect(result).toEqual(expectedTestResults['TB_ACCOUNT'])
    })

    test.todo('tokenboundClient.getCreationCode')

    if (testName === 'v2') {
      test(`tokenboundClient.prepareExecuteCall ${testName}`, async () => {
        const preparedCall = await tokenboundClient.prepareExecuteCall({
          account: TEST_CONFIG.TB_ACCOUNT,
          to: TEST_CONFIG.RECIPIENT_ADDRESS,
          value: 0n,
          data: TEST_CONFIG.EXAMPLE_DATA,
        })

        expect(isAddress(preparedCall.to)).toEqual(true)
        expect(typeof preparedCall.value).toEqual('bigint')
        expect(isHex(preparedCall.data)).toEqual(true)
      })
    }
    if (testName === 'v3') {
      test(`tokenboundClient.prepareExecution ${testName}`, async () => {
        const preparedCall = await tokenboundClient.prepareExecution({
          account: TEST_CONFIG.TB_ACCOUNT,
          to: TEST_CONFIG.RECIPIENT_ADDRESS,
          value: 0n,
          data: TEST_CONFIG.EXAMPLE_DATA,
        })

        expect(isAddress(preparedCall.to)).toEqual(true)
        expect(typeof preparedCall.value).toEqual('bigint')
        expect(isHex(preparedCall.data)).toEqual(true)
      })
    }

    test.todo('tokenboundClient.executeCall')

    test(`tokenboundClient.prepareCreateAccount ${testName}`, async () => {
      const preparedAccount = await tokenboundClient.prepareCreateAccount({
        tokenContract: TEST_CONFIG.TOKEN_CONTRACT,
        tokenId: TEST_CONFIG.TOKEN_ID,
      })

      if (!preparedAccount.to) return false

      expect(isAddress(preparedAccount.to)).toEqual(true)
      expect(typeof preparedAccount.value).toEqual('bigint')
      expect(isHex(preparedAccount.data)).toEqual(true)
    })

    test(
      `tokenboundClient.checkAccountDeployment ${testName}`,
      async () => {
        const isSapienz0Deployed = await tokenboundClient.checkAccountDeployment({
          accountAddress: TEST_CONFIG.SAPIENZ_GOERLI_TOKEN_TBA_TOKENID_0,
        })
        const isSapienz1Deployed = await tokenboundClient.checkAccountDeployment({
          accountAddress: TEST_CONFIG.SAPIENZ_GOERLI_TOKEN_TBA_TOKENID_1,
        })

        expect(isSapienz0Deployed).toEqual(true)
        expect(isSapienz1Deployed).toEqual(false)
      },
      TIMEOUT
    )

    test(`tokenboundClient.deconstructBytecode ${testName}`, async () => {
      const bytecode = await tokenboundClient.deconstructBytecode({
        accountAddress: TEST_CONFIG.SAPIENZ_GOERLI_TOKEN_TBA_TOKENID_0,
      })

      if (!bytecode) throw new Error('Bytecode is undefined')

      const {
        chainId,
        implementationAddress,
        tokenContract,
        tokenId,
        salt,
        erc1167Header,
        erc1167Footer,
      } = bytecode

      expect(chainId).toEqual(TEST_CONFIG.CHAIN_ID)
      expect(erc1167Header).toEqual(TEST_CONFIG.ERC1167_HEADER)
      expect(implementationAddress).toEqual(ERC_6551_LEGACY_V2.IMPLEMENTATION.ADDRESS)
      expect(erc1167Footer).toEqual(TEST_CONFIG.ERC1167_FOOTER)
      expect(tokenContract).toEqual(TEST_CONFIG.SAPIENZ_GOERLI_CONTRACT)
      expect(tokenId).toEqual('0')
      expect(salt).toEqual(0)
    })

    test(
      `tokenboundClient.getNFT ${testName}`,
      async () => {
        const nft = await tokenboundClient.getNFT({
          accountAddress: TEST_CONFIG.SAPIENZ_GOERLI_TOKEN_TBA_TOKENID_0,
        })

        if (!nft) throw new Error('Bytecode is undefined')

        const { chainId, tokenContract, tokenId } = nft

        expect(chainId).toEqual(TEST_CONFIG.CHAIN_ID)
        expect(tokenContract).toEqual(TEST_CONFIG.SAPIENZ_GOERLI_CONTRACT)
        expect(tokenId).toEqual('0')
      },
      TIMEOUT
    )
  }
)
