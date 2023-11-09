import { Abi, getAddress } from 'viem'

import { erc6551AccountAbiV2, erc6551RegistryAbiV2 } from '../../abis'

import {
  erc6551AccountV3ABI,
  erc6551AccountProxyV3ABI,
  erc6551RegistryV3ABI,
} from '../../src/test/wagmi-cli-hooks/generated'

import { ContractABIPair } from '../types'

type Standard6551Deployment = {
  IMPLEMENTATION: ContractABIPair
  REGISTRY: ContractABIPair
  ACCOUNT_PROXY?: ContractABIPair
}

export const ERC_6551_LEGACY_V2: Standard6551Deployment = {
  IMPLEMENTATION: {
    ADDRESS: getAddress('0x2d25602551487c3f3354dd80d76d54383a243358'),
    ABI: erc6551AccountAbiV2 as Abi,
  },
  REGISTRY: {
    ADDRESS: getAddress('0x02101dfB77FDE026414827Fdc604ddAF224F0921'),
    ABI: erc6551RegistryAbiV2 as Abi,
  },
}

export const ERC_6551_DEFAULT: Standard6551Deployment = {
  ACCOUNT_PROXY: {
    ADDRESS: getAddress('0x55266d75D1a14E4572138116aF39863Ed6596E7F'), // Proxy for the upgradeable implementation, initialization lives here
    ABI: erc6551AccountProxyV3ABI,
  },
  IMPLEMENTATION: {
    ADDRESS: getAddress('0x41C8f39463A868d3A88af00cd0fe7102F30E44eC'), // Upgradeable
    ABI: erc6551AccountV3ABI,
  },
  REGISTRY: {
    ADDRESS: getAddress('0x000000006551c19487814612e58FE06813775758'),
    ABI: erc6551RegistryV3ABI,
  },
}
