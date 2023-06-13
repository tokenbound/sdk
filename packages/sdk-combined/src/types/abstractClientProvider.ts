
// Abstract Types: Partial mapping of the viem publicClient and Ethers provider interfaces,
// allows us to reliably determine which implementation should be used based on the parameter passed to the function.
export type AbstractViemClient = Partial<{
  simulateContract: (address: any, abi: any, functionName: string, args: any, account: any) => Promise<any>
  getChainId: () => Promise<number>
  getEnsResolver: (args: {
    blockNumber?: bigint | undefined;
    blockTag?: any;
    name: string;
    universalResolverAddress?: `0x${string}` | undefined;
}) => Promise<`0x${string}`>
}>

export type AbstractEthersProvider = Partial<{
  getBlockWithTransactions: (blockHashOrBlockTag: string | number) => Promise<any>
  getNetwork: () => Promise<any>
}>

export type AbstractClientOrProvider = AbstractViemClient | AbstractEthersProvider