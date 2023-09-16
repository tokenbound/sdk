export const Tester = {
    ETHERS: 'ETHERS',
    ETHERS_6: 'ETHERS_6',
    VIEM_WALLETCLIENT: 'VIEM_WALLETCLIENT',
  } as const
  
export type TesterType = (typeof Tester)[keyof typeof Tester]