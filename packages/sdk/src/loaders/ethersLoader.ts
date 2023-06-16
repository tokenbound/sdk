import { BigNumber } from 'ethers'
import { AbstractEthersSigner } from '../types'

type EthersImplementation = {
    ethersExecuteCall: (account: string, to: string, value: bigint, data: string, signer: AbstractEthersSigner & any) => Promise<any>
    ethersPrepareCreateAccount: (tokenContract: `0x${string}`, tokenId: string, chainId: number) => Promise<{
        to: `0x${string}`
        value: BigNumber
        data: string
      }>
    ethersCreateAccount: (tokenContract: string, tokenId: string, signer: AbstractEthersSigner & any ) => Promise<`0x${string}`>
  }
  
  export async function loadEthersImplementation(): Promise<EthersImplementation> {
    const { executeCall, createAccount, prepareCreateAccount } = await import('../functions/ethers')
    return {
      ethersExecuteCall: executeCall,
      ethersPrepareCreateAccount: prepareCreateAccount,
      ethersCreateAccount: createAccount,
    }
  }
  