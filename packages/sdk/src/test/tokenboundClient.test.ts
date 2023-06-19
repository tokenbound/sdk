import { test, expect } from "vitest"
import { 
    isHex,
    isAddress
} from "viem"

import {
    TokenboundClient,
  } from '../TokenboundClient'

const TOKEN_CONTRACT = `0x7a77F2cFB02546F217d39157471d5B5914DD7644`
const TOKEN_ID = "1"
const CHAIN_ID = 5

const TB_ACCOUNT = `0x5194b1c04Ed6464b3225324d6794f7d2698D8d1c`
const RECIPIENT_ADDRESS = `0x02101dfb77fde026414827fdc604ddaf224f0921`

const EXAMPLE_AMOUNT = 0n
const EXAMPLE_DATA = ""

const tokenboundClient = new TokenboundClient({ 
    // signer, 
    chainId: CHAIN_ID
 })

test("tokenboundClient.getAccount", async () => {
    const result = await tokenboundClient.getAccount({tokenContract: TOKEN_CONTRACT, tokenId: TOKEN_ID})
    expect(result).toEqual(TB_ACCOUNT)
})

test.todo("tokenboundClient.getCreationCode")

test("tokenboundClient.prepareExecuteCall", async () => {

    const preparedCall = await tokenboundClient.prepareExecuteCall({
        account: TB_ACCOUNT,
        to: RECIPIENT_ADDRESS,
        value: EXAMPLE_AMOUNT,
        data: EXAMPLE_DATA}
    )

    expect(isAddress(preparedCall.to)).toEqual(true)
    expect(typeof preparedCall.value).toEqual('bigint')
    expect(isHex(preparedCall.data)).toEqual(true)
})

test.todo("tokenboundClient.executeCall")

test("tokenboundClient.prepareCreateAccount", async () => {

    const preparedAccount = await tokenboundClient.prepareCreateAccount({
        tokenContract: TOKEN_CONTRACT,
        tokenId: TOKEN_ID,
        }
    )

    expect(isAddress(preparedAccount.to)).toEqual(true)
    expect(typeof preparedAccount.value).toEqual('bigint')
    expect(isHex(preparedAccount.data)).toEqual(true)
})
test.todo(".createAccount")