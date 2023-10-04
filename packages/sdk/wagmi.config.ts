import { defineConfig } from '@wagmi/cli'
import { etherscan, react } from '@wagmi/cli/plugins'
import { mainnet } from 'viem/chains'

export default defineConfig({
  out: 'src/test/wagmi-cli-hooks/generated.ts',
  contracts: [],
  plugins: [
    etherscan({
      apiKey: '6RMAZFTCW43SGRY935CIEQ58D3ZP7S5BQX', // Tokenbound SDK, user bjfutureprimitive
      chainId: mainnet.id,

      contracts: [
        {
          name: 'Zora1155_',
          address: {
            [1]: '0x4482c5929618b848a46e3da830a3d71085a5de07', // ZoraCreator1155Impl
          },
        },
        {
          name: 'Zora721Drop_',
          address: {
            [1]: '0x7c74dfe39976dc395529c14e54a597809980e01c',
          },
        },
        {
          name: 'WETH_',
          address: {
            [1]: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
          },
        },
      ],
    }),
    react({
      // useContract: false,
      // useContractEvent: false,
      // useContractItemEvent: false,
      // useContractRead: false,
      // useContractFunctionWrite: true,
      // usePrepareContractFunctionWrite: true,
      // useContractFunctionRead: false,
      // useContractWrite: false,
      // usePrepareContractWrite: false,
    }),
  ],
})
