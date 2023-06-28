import { test, expect } from "vitest"
import { 
    isHex,
    isAddress
} from "viem"

import { TokenboundClient } from '../TokenboundClient'
import { TEST_CONFIG } from "./testConfig"

const tokenboundClient = new TokenboundClient({ 
    // signer, 
    chainId: TEST_CONFIG.CHAIN_ID
 })

test("tokenboundClient.getAccount -> customImplementation", async () => {
    const result = await tokenboundClient.getAccount({tokenContract: TEST_CONFIG.TOKEN_CONTRACT, tokenId: TEST_CONFIG.TOKEN_ID, implementationAddress: TEST_CONFIG.CUSTOM_IMPLEMENTATION_ADDRESS})
    // console.log('RESULT::::', result)
    expect(result).toEqual(TEST_CONFIG.CUSTOM_IMPLEMENTATION_TB_ACCOUNT)
})

test("tokenboundClient.getAccount -> customRegistry", async () => {
    const result = await tokenboundClient.getAccount({tokenContract: TEST_CONFIG.TOKEN_CONTRACT, tokenId: TEST_CONFIG.TOKEN_ID, registryAddress: TEST_CONFIG.CUSTOM_REGISTRY_ADDRESS})
    console.log('RESULT::::', result)
    expect(result).toEqual(TEST_CONFIG.CUSTOM_REGISTRY_TB_ACCOUNT)
})

test("tokenboundClient.getAccount -> customImplementation + customRegistry", async () => {
    const result = await tokenboundClient.getAccount({tokenContract: TEST_CONFIG.TOKEN_CONTRACT, tokenId: TEST_CONFIG.TOKEN_ID, implementationAddress: TEST_CONFIG.CUSTOM_IMPLEMENTATION_ADDRESS, registryAddress: TEST_CONFIG.CUSTOM_REGISTRY_ADDRESS})
    expect(result).toEqual(TEST_CONFIG.CUSTOM_IMPLEMENTATION_AND_REGISTRY_TB_ACCOUNT)
})

test("tokenboundClient.prepareCreateAccount -> customImplementation", async () => {

    const preparedAccount = await tokenboundClient.prepareCreateAccount({
        tokenContract: TEST_CONFIG.TOKEN_CONTRACT,
        tokenId: TEST_CONFIG.TOKEN_ID,
        implementationAddress: TEST_CONFIG.CUSTOM_IMPLEMENTATION_ADDRESS
        }
    )

    expect(isAddress(preparedAccount.to)).toEqual(true)
    expect(typeof preparedAccount.value).toEqual('bigint')
    expect(isHex(preparedAccount.data)).toEqual(true)
})
test("tokenboundClient.prepareCreateAccount -> customRegistry", async () => {

    const preparedAccount = await tokenboundClient.prepareCreateAccount({
        tokenContract: TEST_CONFIG.TOKEN_CONTRACT,
        tokenId: TEST_CONFIG.TOKEN_ID,
        registryAddress: TEST_CONFIG.CUSTOM_REGISTRY_ADDRESS
        }
    )

    expect(isAddress(preparedAccount.to)).toEqual(true)
    expect(typeof preparedAccount.value).toEqual('bigint')
    expect(isHex(preparedAccount.data)).toEqual(true)
})
test.todo(".createAccount")