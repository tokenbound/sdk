import { Abi, getAddress } from 'viem'

import {
  erc6551AccountAbiV2,
  erc6551RegistryAbiV2,
  //   erc6551AccountProxyAbiV3,
  //   erc6551AccountAbiV3,
  //   erc6551RegistryAbiV3,
} from '../../abis'

import {
  erc6551AccountV3ABI,
  erc6551AccountProxyV3ABI,
  erc6551RegistryV3ABI,
} from '../../src/test/wagmi-cli-hooks/generated'

import { ContractABIPair } from '../types'

// type Standard6551Deployment = Record<'IMPLEMENTATION' | 'REGISTRY', ContractABIPair>
type Standard6551Deployment = {
  IMPLEMENTATION: ContractABIPair
  REGISTRY: ContractABIPair
  ACCOUNT_PROXY?: ContractABIPair // Make ACCOUNT_PROXY optional
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
    ADDRESS: getAddress('0xABF81898FEA21aAa5EE27F6fA0398a217a29bE9f'), // this is the proxied address for the upgradeable contract below
    ABI: erc6551AccountProxyV3ABI,
    // ABI: erc6551AccountProxyAbiV3 as Abi,
  },
  IMPLEMENTATION: {
    ADDRESS: getAddress('0xBf7F4beb68b960AE198a15f4f50247f4Fd20E21a'),
    ABI: erc6551AccountV3ABI,
    // ABI: erc6551AccountAbiV3 as Abi,
  },
  REGISTRY: {
    ADDRESS: getAddress('0x284be69BaC8C983a749956D7320729EB24bc75f9'),
    ABI: erc6551RegistryV3ABI,
    // ABI: erc6551RegistryAbiV3 as Abi,
  },
}
