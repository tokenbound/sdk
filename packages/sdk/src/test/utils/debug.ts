import { PublicClient } from 'viem'

/**
 * Emits console output related to the given transaction hash for debugging purposes.
 * 
 * @param publicClient - The viem public client instance.
 * @param hash - The transaction hash to debug.
 * @returns void
 */
export async function debugTransaction({publicClient, hash}:{publicClient: PublicClient, hash: `0x${string}`}) {

    console.log('DEBUGGING TRANSACTION: ', hash)
    const transactionReceipt = await publicClient.getTransactionReceipt({ 
      hash
    })
    console.log('transactionReceipt', transactionReceipt)
    
    const transaction = await publicClient.getTransaction({
        hash
    })
    console.log('transaction', transaction)
  }