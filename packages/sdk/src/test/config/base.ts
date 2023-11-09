import { getAddress } from 'viem'

export const TEST_CONFIG = {
  TOKEN_CONTRACT: <`0x${string}`>`0x7a77F2cFB02546F217d39157471d5B5914DD7644`,
  TOKEN_ID: <string>'1',
  CHAIN_ID: <number>5,

  EXAMPLE_AMOUNT: 0n,
  EXAMPLE_DATA: '',

  SAPIENZ_GOERLI_CONTRACT: <`0x${string}`>(
    getAddress(`0x26c55c8D83d657b2FC1dF497f0C991e3612bc6B2`)
  ),

  TB_ACCOUNT: <`0x${string}`>`0x5194b1c04Ed6464b3225324d6794f7d2698D8d1c`,

  RECIPIENT_ADDRESS: <`0x${string}`>`0x02101dfb77fde026414827fdc604ddaf224f0921`,

  // Account address responses based on custom implementation / registry addresses
  CUSTOM_IMPLEMENTATION_ADDRESS: <`0x${string}`>(
    getAddress('0x276870d7908A8EE6828C71c5F461fE0C5FA9360e')
  ),
  CUSTOM_REGISTRY_ADDRESS: <`0x${string}`>(
    getAddress('0x37F9F4215324541c77B0ad04F8E035c6fe6226eb')
  ),
  CUSTOM_IMPLEMENTATION_TB_ACCOUNT: <`0x${string}`>(
    '0x4908e0E6EEe76E2975b85aD763d184FE16fEd2B8'
  ),

  // Account address responses based on overridden custom implementation / registry addresses
  CUSTOM_IMPLEMENTATION_ADDRESS_OVERRIDE: <`0x${string}`>(
    getAddress('0x9FefE8a875E7a9b0574751E191a2AF205828dEA4')
  ),
  CUSTOM_REGISTRY_ADDRESS_OVERRIDE: <`0x${string}`>(
    getAddress('0x9FefE8a875E7a9b0574751E191a2AF205828dEA4')
  ),
  CUSTOM_IMPLEMENTATION_OVERRIDDEN_TB_ACCOUNT: <`0x${string}`>(
    '0x00f964768A74d61B968514013e1Fb2bf35cC3836'
  ),

  // Account addresses for Sapienz NFTs on Goerli testnet
  SAPIENZ_GOERLI_TOKEN_TBA_TOKENID_0: <`0x${string}`>(
    '0x33D622b211C399912eC0feaaf1caFD01AFA53980'
  ),
  SAPIENZ_GOERLI_TOKEN_TBA_TOKENID_1: <`0x${string}`>(
    '0xBEa4715752F2434cFE64209C26CD33B64D0cD138'
  ),

  ERC1167_HEADER: <string>'363d3d373d3d3d363d73',
  ERC1167_FOOTER: <string>'5af43d82803e903d91602b57fd5bf3',
}

export const TEST_RESULTS = {
  V2: {
    TB_ACCOUNT: <`0x${string}`>`0x5194b1c04Ed6464b3225324d6794f7d2698D8d1c`,
  },
  V3: {
    // TB_ACCOUNT: <`0x${string}`>`0xba0292aBcCAF72D8904D6cD01E67D00D6E702275`,
    TB_ACCOUNT: <`0x${string}`>`0x017fEC0610DC9a83FB810a0c7fc7BA16dDB613e1`, // ACTUAL: 0x017fEC0610DC9a83FB810a0c7fc7BA16dDB613e1
  },
}
