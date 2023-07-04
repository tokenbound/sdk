import { getAddress } from "viem"

export const TEST_CONFIG = {
    TOKEN_CONTRACT: `0x7a77F2cFB02546F217d39157471d5B5914DD7644` as `0x${string}`,
    TOKEN_ID: "1",
    CHAIN_ID: 5,

    EXAMPLE_AMOUNT: 0n,
    EXAMPLE_DATA: "",
    
    TB_ACCOUNT: `0x5194b1c04Ed6464b3225324d6794f7d2698D8d1c` as `0x${string}`,
    RECIPIENT_ADDRESS: `0x02101dfb77fde026414827fdc604ddaf224f0921` as `0x${string}`,
    
    // Account address responses based on custom implementation / registry addresses
    CUSTOM_IMPLEMENTATION_ADDRESS: getAddress('0x276870d7908A8EE6828C71c5F461fE0C5FA9360e'),
    CUSTOM_REGISTRY_ADDRESS: getAddress('0x37F9F4215324541c77B0ad04F8E035c6fe6226eb'),
    CUSTOM_IMPLEMENTATION_TB_ACCOUNT: "0x4908e0E6EEe76E2975b85aD763d184FE16fEd2B8" as `0x${string}`,

    // Account address responses based on overridden custom implementation / registry addresses
    CUSTOM_IMPLEMENTATION_ADDRESS_OVERRIDE: getAddress('0x9FefE8a875E7a9b0574751E191a2AF205828dEA4'),
    CUSTOM_REGISTRY_ADDRESS_OVERRIDE: getAddress('0x9FefE8a875E7a9b0574751E191a2AF205828dEA4'),
    CUSTOM_IMPLEMENTATION_OVERRIDDEN_TB_ACCOUNT: "0xCCb6B16CA62e3d2Bb6559384fFaEE03224a12Be4" as `0x${string}`

}
