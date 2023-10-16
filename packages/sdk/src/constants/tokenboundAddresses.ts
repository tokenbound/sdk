import { Abi, getAddress } from 'viem'

import {
  erc6551AccountAbiV2,
  erc6551RegistryAbiV2,
  erc6551AccountAbiV3,
  erc6551RegistryAbiV3,
} from '../../abis'

// import {
//   erc6551AccountV2ABI,
//   erc6551RegistryV2ABI,
//   erc6551AccountV3ABI,
//   erc6551RegistryV3ABI,
// } from '../../src/test/wagmi-cli-hooks/generated'

import { ContractABIPair } from '../types'
export const erc6551AccountImplementationAddressV3 = getAddress('TBD')

type Standard6551Deployment = Record<'IMPLEMENTATION' | 'REGISTRY', ContractABIPair>

export const ERC_6551_LEGACY_V2: Standard6551Deployment = {
  IMPLEMENTATION: {
    ADDRESS: getAddress('0x2d25602551487c3f3354dd80d76d54383a243358'),
    ABI: erc6551AccountAbiV2 as Abi,
    // ABI: erc6551AccountV2ABI,
  },
  REGISTRY: {
    ADDRESS: getAddress('0x02101dfB77FDE026414827Fdc604ddAF224F0921'),
    ABI: erc6551RegistryAbiV2 as Abi,
    // ABI: erc6551RegistryV2ABI,
  },
}

export const ERC_6551_DEFAULT: Standard6551Deployment = {
  IMPLEMENTATION: {
    ADDRESS: getAddress('0x9FFDEb36540e1a12b1F27751508715174122C090'),
    ABI: erc6551AccountAbiV3 as Abi,
    // ABI: erc6551AccountV3ABI,
  },
  REGISTRY: {
    ADDRESS: getAddress('0x002c0c13181038780F552f0eC1B72e8C720147E6'),
    ABI: erc6551RegistryAbiV3 as Abi,
    // ABI: erc6551RegistryV3ABI,
  },
}
