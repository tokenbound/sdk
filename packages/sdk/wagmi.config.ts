import { defineConfig } from '@wagmi/cli'
import { etherscan } from '@wagmi/cli/plugins'
import { mainnet, goerli, sepolia } from 'viem/chains'
import { ERC_6551_DEFAULT, ERC_6551_LEGACY_V2 } from './src/constants'

export default defineConfig({
  out: 'src/test/wagmi-cli-hooks/generated.ts',
  contracts: [],
  plugins: [
    etherscan({
      apiKey: '6RMAZFTCW43SGRY935CIEQ58D3ZP7S5BQX', // Tokenbound SDK, user bjfutureprimitive
      // chainId: mainnet.id,
      // chainId: goerli.id,
      chainId: sepolia.id,

      contracts: [
        {
          name: 'ERC6551Account_V2_',
          address: {
            [mainnet.id]: ERC_6551_LEGACY_V2.IMPLEMENTATION.ADDRESS,
            // [goerli.id]: ERC_6551_LEGACY_V2.IMPLEMENTATION.ADDRESS,
            [sepolia.id]: ERC_6551_LEGACY_V2.IMPLEMENTATION.ADDRESS,
          },
        },
        {
          name: 'ERC6551Registry_V2_',
          address: {
            [mainnet.id]: ERC_6551_LEGACY_V2.REGISTRY.ADDRESS,
            // [goerli.id]: ERC_6551_LEGACY_V2.REGISTRY.ADDRESS,
            [sepolia.id]: ERC_6551_LEGACY_V2.REGISTRY.ADDRESS,
          },
        },
        {
          name: 'ERC6551Account_V3_',
          address: {
            [mainnet.id]: ERC_6551_DEFAULT.IMPLEMENTATION.ADDRESS,
            // [goerli.id]: ERC_6551_DEFAULT.IMPLEMENTATION.ADDRESS,
            [sepolia.id]: ERC_6551_DEFAULT.IMPLEMENTATION.ADDRESS,
          },
        },
        {
          name: 'ERC6551AccountProxy_V3_',
          address: {
            [mainnet.id]: ERC_6551_DEFAULT.ACCOUNT_PROXY?.ADDRESS!,
            // [goerli.id]: ERC_6551_DEFAULT.ACCOUNT_PROXY?.ADDRESS!,
            [sepolia.id]: ERC_6551_DEFAULT.ACCOUNT_PROXY?.ADDRESS!,
          },
        },
        {
          name: 'ERC6551Registry_V3_',
          address: {
            [mainnet.id]: ERC_6551_DEFAULT.REGISTRY.ADDRESS,
            // [goerli.id]: ERC_6551_DEFAULT.REGISTRY.ADDRESS,
            [sepolia.id]: ERC_6551_DEFAULT.REGISTRY.ADDRESS,
          },
        },
        {
          name: 'Zora1155_', // https://github.com/ourzora/zora-protocol/blob/003efca081ddc0da8753aec707706cd0efff3e7e/packages/protocol-deployments/src/addresses.ts#L134
          address: {
            [mainnet.id]: '0x4482c5929618b848a46e3da830a3d71085a5de07', // ZoraCreator1155Impl
            // [goerli.id]: '0x455c9D3188A3Cd94aCDE8E5Ec90cA92FC10805EA', // ZoraCreator1155Impl
            [sepolia.id]: '0x437A762fc2a8f898Aa7a2575Be21c41753DC4797', // ZoraCreator1155Impl
          },
        },
        {
          name: 'Zora721Drop_',
          address: {
            [mainnet.id]: '0x7c74dfe39976dc395529c14e54a597809980e01c',
            // [goerli.id]: '0xe4c17055048aEe01D0d122804816fEe5E6ac4A67',
            [sepolia.id]: '0x78b524931e9d847c40BcBf225c25e154a7B05fDA',
          },
        },
        {
          name: 'WETH_',
          address: {
            [mainnet.id]: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
            // [goerli.id]: '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6',
            [sepolia.id]: '0xfff9976782d46cc05630d1f6ebab18b2324d6b14', // https://sepolia.etherscan.io/address/0xfff9976782d46cc05630d1f6ebab18b2324d6b14
          },
        },
      ],
    }),
    // react({
    // useContract: false,
    // useContractEvent: false,
    // useContractItemEvent: false,
    // useContractRead: false,
    // useContractFunctionWrite: true,
    // usePrepareContractFunctionWrite: true,
    // useContractFunctionRead: false,
    // useContractWrite: false,
    // usePrepareContractWrite: false,
    // }),
  ],
})
