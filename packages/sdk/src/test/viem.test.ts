import { test, expect } from "vitest"
import { goerli } from 'viem/chains'
import { 
    isHex,
    createPublicClient,
    http,
    isAddress
} from "viem"

import {
    computeAccount,
    getAccount,
    prepareCreateAccount,
    prepareExecuteCall,

} from "../index";

import { TEST_CONFIG } from "./testConfig"

test(".getAccount", async () => {
    const publicClient = createPublicClient({ 
        chain: goerli,
        transport: http()
      })

    const result = await getAccount(TEST_CONFIG.TOKEN_CONTRACT, TEST_CONFIG.TOKEN_ID, publicClient)
    expect(result).toEqual(TEST_CONFIG.TB_ACCOUNT)
})

test(".computeAccount", async () => {
    const result = computeAccount(TEST_CONFIG.TOKEN_CONTRACT, TEST_CONFIG.TOKEN_ID, TEST_CONFIG.CHAIN_ID)
    expect(result).toEqual(TEST_CONFIG.TB_ACCOUNT)
})

test.todo(".getCreationCode")

test(".prepareExecuteCall", async () => {

    const preparedCall = await prepareExecuteCall(
        TEST_CONFIG.TB_ACCOUNT,
        TEST_CONFIG.RECIPIENT_ADDRESS,
        TEST_CONFIG.EXAMPLE_AMOUNT,
        TEST_CONFIG.EXAMPLE_DATA
    )

    expect(isAddress(preparedCall.to)).toEqual(true)
    expect(isHex(preparedCall.data)).toEqual(true)
})

test.todo(".executeCall")

test(".prepareCreateAccount", async () => {

    const preparedAccount = await prepareCreateAccount(
        TEST_CONFIG.TOKEN_CONTRACT,
        TEST_CONFIG.TOKEN_ID,
        TEST_CONFIG.CHAIN_ID
    )

    expect(isAddress(preparedAccount.to)).toEqual(true)
    expect(isHex(preparedAccount.data)).toEqual(true)
})
test.todo(".createAccount")
