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

test("tokenboundClient.getAccount", async () => {
    const result = await tokenboundClient.getAccount({tokenContract: TEST_CONFIG.TOKEN_CONTRACT, tokenId: TEST_CONFIG.TOKEN_ID})
    expect(result).toEqual(TEST_CONFIG.TB_ACCOUNT)
})

test.todo("tokenboundClient.getCreationCode")

test("tokenboundClient.prepareExecuteCall", async () => {

    const preparedCall = await tokenboundClient.prepareExecuteCall({
        account: TEST_CONFIG.TB_ACCOUNT,
        to: TEST_CONFIG.RECIPIENT_ADDRESS,
        value: TEST_CONFIG.EXAMPLE_AMOUNT,
        data: TEST_CONFIG.EXAMPLE_DATA
    })

    expect(isAddress(preparedCall.to)).toEqual(true)
    expect(typeof preparedCall.value).toEqual('bigint')
    expect(isHex(preparedCall.data)).toEqual(true)
})

test.todo("tokenboundClient.executeCall")

test("tokenboundClient.prepareCreateAccount", async () => {

    const preparedAccount = await tokenboundClient.prepareCreateAccount({
        tokenContract: TEST_CONFIG.TOKEN_CONTRACT,
        tokenId: TEST_CONFIG.TOKEN_ID,
        }
    )

    expect(isAddress(preparedAccount.to)).toEqual(true)
    expect(typeof preparedAccount.value).toEqual('bigint')
    expect(isHex(preparedAccount.data)).toEqual(true)
})

test.todo(".createAccount")