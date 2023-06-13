import { AbstractBigNumber, AbstractClientOrProvider, AbstractEthersProvider, AbstractViemClient, Bytes } from './types'
import { isAbstractBigNumber, isBigInt, isEthersClient, isViemClient } from './utils'

type EthersDependencies = {
  ethersGetAccount: (tokenContract: string, tokenId: string, client: AbstractEthersProvider & any) => Promise<`0x${string}`>
  ethersPrepareExecuteCall: (account: string, to: string, value: AbstractBigNumber, data: string) => Promise<{
    to: string
    value: AbstractBigNumber
    data: string
  }>
}

async function loadEthersImplementation(): Promise<EthersDependencies> {
  const { getAccount, prepareExecuteCall } = await import('./implementations/ethers')
  return {
    ethersGetAccount: getAccount,
    ethersPrepareExecuteCall: prepareExecuteCall,
  }
}

type ViemDependencies = {
  viemGetAccount: (tokenContract: string, tokenId: string, client: AbstractViemClient & any) => Promise<`0x${string}`>
  viemPrepareExecuteCall: (account: string, to: string, value: bigint, data: string) => Promise<{
    to: `0x${string}`
    value: bigint
    data: `0x${string}`
  }>
}

async function loadViemImplementation(): Promise<ViemDependencies> {
   const { getAccount, prepareExecuteCall } = await import('./implementations/viem')
   return {
    viemGetAccount: getAccount,
    viemPrepareExecuteCall: prepareExecuteCall,
  }
}

export async function getAccount(
  tokenContract: string,
  tokenId: string,
  clientOrProvider: AbstractClientOrProvider
): Promise<`0x${string}`> {

  try {
    if (isViemClient(clientOrProvider)) {
      const { viemGetAccount } = await loadViemImplementation()
      return await viemGetAccount(tokenContract, tokenId, clientOrProvider)
    }

    if (isEthersClient(clientOrProvider)) {
      const { ethersGetAccount } = await loadEthersImplementation()
      return await ethersGetAccount(tokenContract, tokenId, clientOrProvider)
    } 

    throw new Error('Unsupported client or provider')
    
  } catch (error) {
    throw new Error('Unsupported client or provider')
  }
}



export async function prepareExecuteCall(
  account: string,
  to: string,
  value: AbstractBigNumber | Bytes | bigint | string | number,
  // value: BigNumber | Bytes | bigint | string | number,
  // value: bigint,
  // value: bigint, // Can be bigint or BigNumberish: BigNumber | Bytes | bigint | string | number;
  data: string
): Promise<{
  to: string;
  value: bigint;
  data: string;
  // to: `0x${string}`;
  // value: bigint;
  // data: `0x${string}`;
}> {
  
  try {
    if (isBigInt(value)) {
      const { viemPrepareExecuteCall } = await loadViemImplementation()
      return await viemPrepareExecuteCall(account, to, value as unknown as bigint, data)
    }

    if(isAbstractBigNumber(value)) {
      const { ethersPrepareExecuteCall } = await loadEthersImplementation()
      return await ethersPrepareExecuteCall(account, to, value, data)
    }

    throw new Error('Unsupported client or provider')
    
  } catch (error) {
    throw new Error('Unsupported client or provider')
  }
}

// VIEM
// getAccount()
// createAccount()
// prepareExecuteCall()
// executeCall()


// ETHERS
// getAccount()
// computeAccount() **
// getCreationCode() **
// createAccount()
// prepareExecuteCall()
// executeCall()