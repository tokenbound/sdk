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
    // createAccount,
    prepareExecuteCall,
    // executeCall
} from "../index";

const TOKEN_CONTRACT = `0x7a77F2cFB02546F217d39157471d5B5914DD7644`
const TOKEN_ID = "1"
const CHAIN_ID = 5

const TB_ACCOUNT = `0x5194b1c04Ed6464b3225324d6794f7d2698D8d1c`
const RECIPIENT_ADDRESS = `0x02101dfb77fde026414827fdc604ddaf224f0921`

const EXAMPLE_AMOUNT = 0n
const EXAMPLE_DATA = ""


test(".getAccount", async () => {
    const publicClient = createPublicClient({ 
        chain: goerli,
        transport: http()
      })

    const result = await getAccount(TOKEN_CONTRACT, TOKEN_ID, publicClient)
    expect(result).toEqual(TB_ACCOUNT)
})

test(".computeAccount", async () => {
    const result = computeAccount(TOKEN_CONTRACT, TOKEN_ID, CHAIN_ID)
    expect(result).toEqual(TB_ACCOUNT)
})

test.todo(".getCreationCode")

test(".prepareExecuteCall", async () => {

    const preparedCall = await prepareExecuteCall(
        TB_ACCOUNT,
        RECIPIENT_ADDRESS,
        EXAMPLE_AMOUNT,
        EXAMPLE_DATA
    )

    expect(isAddress(preparedCall.to)).toEqual(true)
    expect(typeof preparedCall.value).toEqual('bigint')
    expect(isHex(preparedCall.data)).toEqual(true)
})

test.todo(".executeCall")

test(".prepareCreateAccount", async () => {

    const preparedAccount = await prepareCreateAccount(
        TOKEN_CONTRACT,
        TOKEN_ID,
        CHAIN_ID
    )

    expect(isAddress(preparedAccount.to)).toEqual(true)
    expect(typeof preparedAccount.value).toEqual('bigint')
    expect(isHex(preparedAccount.data)).toEqual(true)
})
test.todo(".createAccount")