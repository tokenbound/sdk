import { test, expect } from "vitest"
import { 
    isHex,
    isAddress
} from "viem"

import { TokenboundClient } from '../TokenboundClient'
import { TEST_CONFIG } from "./config"
import { erc6551AccountImplementationAddressV1 } from "../constants"

const tokenboundClient = new TokenboundClient({ 
    chainId: TEST_CONFIG.CHAIN_ID
 })

test("tokenboundClient.getAccount", () => {
    const result = tokenboundClient.getAccount({
        tokenContract: TEST_CONFIG.TOKEN_CONTRACT,
        tokenId: TEST_CONFIG.TOKEN_ID
    })
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

test("tokenboundClient.isAccountDeployed", async () => {

    const isSapienz0Deployed = await tokenboundClient.isAccountDeployed({
        accountAddress: TEST_CONFIG.SAPIENZ_GOERLI_TOKEN_TBA_TOKENID_0,
    })
    const isSapienz1Deployed = await tokenboundClient.isAccountDeployed({
        accountAddress: TEST_CONFIG.SAPIENZ_GOERLI_TOKEN_TBA_TOKENID_1,
    })

    expect(isSapienz0Deployed).toEqual(true)
    expect(isSapienz1Deployed).toEqual(false)
})

test("tokenboundClient.deconstructBytecode", async () => {

    const bytecode = await tokenboundClient.deconstructBytecode({
        accountAddress: TEST_CONFIG.SAPIENZ_GOERLI_TOKEN_TBA_TOKENID_0,
    })

    if(!bytecode) throw new Error("Bytecode is undefined")
    
    const {
        chainId,
        implementationAddress,
        tokenContract,
        tokenId,
        salt,
        erc1167Header,
        erc1167Footer
    } = bytecode

    expect(chainId).toEqual(TEST_CONFIG.CHAIN_ID)
    expect(erc1167Header).toEqual(TEST_CONFIG.ERC1167_HEADER)
    expect(implementationAddress).toEqual(erc6551AccountImplementationAddressV1)
    expect(erc1167Footer).toEqual(TEST_CONFIG.ERC1167_FOOTER)
    expect(tokenContract).toEqual(TEST_CONFIG.SAPIENZ_GOERLI_CONTRACT)
    expect(tokenId).toEqual('0')
    expect(salt).toEqual(0)

})

test("tokenboundClient.getNFT", async () => {

    const nft = await tokenboundClient.getNFT({
        accountAddress: TEST_CONFIG.SAPIENZ_GOERLI_TOKEN_TBA_TOKENID_0,
    })

    if(!nft) throw new Error("Bytecode is undefined")
    
    const {
        chainId,
        tokenContract,
        tokenId,
    } = nft

    expect(chainId).toEqual(TEST_CONFIG.CHAIN_ID)
    expect(tokenContract).toEqual(TEST_CONFIG.SAPIENZ_GOERLI_CONTRACT)
    expect(tokenId).toEqual('0')
    
})