import { defineConfig } from '@wagmi/cli'
import { etherscan, react } from '@wagmi/cli/plugins'
import { mainnet } from 'viem/chains'

export default defineConfig({ out: 'src/test/wagmi-cli-hooks/generated.ts',
    contracts: [],
    plugins: [
        etherscan({
            apiKey: '6RMAZFTCW43SGRY935CIEQ58D3ZP7S5BQX', // Tokenbound SDK, user bjfutureprimitive
            chainId: mainnet.id,

            contracts: [
                {
                    name: 'Zora1155_',
                    address: {
                        // [1]: '0xd2b35974aedd3286629971ba956e9c4873a85e08',
                        [1]: '0xD0561AEF1D5cd30a1779f01B41B3436027177d9A',
                        // Sapienz drop: 0xafd7b9edc5827f7e39dcd425d8de8d4e1cb292c1 //  https://zora.co/collect/eth:0xafd7b9edc5827f7e39dcd425d8de8d4e1cb292c1/3
                    },
                },
                {
                    name: 'Zora721Drop_',
                    address: {
                      [1]: '0x7c74dfe39976dc395529c14e54a597809980e01c',
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
    ]
})
