import { AbstractEthersSigner } from '../types'

type EthersImplementation = {
    ethersExecuteCall: (account: string, to: string, value: bigint, data: string, signer: AbstractEthersSigner & any) => Promise<any>
    ethersCreateAccount: (tokenContract: string, tokenId: string, signer: AbstractEthersSigner & any ) => Promise<`0x${string}`>
  }
  
  export async function loadEthersImplementation(): Promise<EthersImplementation> {
    const { executeCall, createAccount } = await import('../functions/ethers')
    return {
      ethersExecuteCall: executeCall,
      ethersCreateAccount: createAccount,
    }
  }
  