import { test, expect } from "vitest"
import { 
    isHex,
    isAddress
} from "viem"

import { Custom6551Implementation, TokenboundClient } from '../TokenboundClient'
import { TEST_CONFIG } from "./testConfig"

// A custom 6551 implementation, deployed to Sepolia testnet
const CUSTOM_6551_IMPLEMENTATION: Custom6551Implementation = {
    implementationAddress: TEST_CONFIG.CUSTOM_IMPLEMENTATION_ADDRESS,
    registryAddress: TEST_CONFIG.CUSTOM_REGISTRY_ADDRESS
}

const tokenboundClient = new TokenboundClient({ 
    // signer, 
    chainId: TEST_CONFIG.CHAIN_ID,
    customImplementation: CUSTOM_6551_IMPLEMENTATION
})

test("tokenboundClient.getAccount → customImplementation", () => {
    const result = tokenboundClient.getAccount({
        tokenContract: TEST_CONFIG.TOKEN_CONTRACT,
        tokenId: TEST_CONFIG.TOKEN_ID,
    })
    expect(result).toEqual(TEST_CONFIG.CUSTOM_IMPLEMENTATION_TB_ACCOUNT)
})

test("tokenboundClient.getAccount → override customImplementation", () => {
    const result = tokenboundClient.getAccount({
        tokenContract: TEST_CONFIG.TOKEN_CONTRACT,
        tokenId: TEST_CONFIG.TOKEN_ID,
        implementationAddress: TEST_CONFIG.CUSTOM_IMPLEMENTATION_ADDRESS_OVERRIDE,
        registryAddress: TEST_CONFIG.CUSTOM_REGISTRY_ADDRESS_OVERRIDE
    })
    expect(result).toEqual(TEST_CONFIG.CUSTOM_IMPLEMENTATION_OVERRIDDEN_TB_ACCOUNT)
})

test("tokenboundClient.prepareCreateAccount → customImplementation", async () => {

    const preparedAccount = await tokenboundClient.prepareCreateAccount({
        tokenContract: TEST_CONFIG.TOKEN_CONTRACT,
        tokenId: TEST_CONFIG.TOKEN_ID
        }
    )

    expect(isAddress(preparedAccount.to)).toEqual(true)
    expect(typeof preparedAccount.value).toEqual('bigint')
    expect(isHex(preparedAccount.data)).toEqual(true)
})
test("tokenboundClient.prepareCreateAccount → customRegistry", async () => {

    const preparedAccount = await tokenboundClient.prepareCreateAccount({
        tokenContract: TEST_CONFIG.TOKEN_CONTRACT,
        tokenId: TEST_CONFIG.TOKEN_ID
        }
    )

    expect(isAddress(preparedAccount.to)).toEqual(true)
    expect(typeof preparedAccount.value).toEqual('bigint')
    expect(isHex(preparedAccount.data)).toEqual(true)
})
test.todo(".createAccount")