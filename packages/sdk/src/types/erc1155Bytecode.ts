// Segmented ERC6551 bytecode

export type SegmentedERC6551Bytecode = {
    erc1167Header: string,                          // 10 bytes         
    implementationAddress: `0x${string}`,           // 20 bytes
    erc1167Footer: string,                          // 15 bytes
    salt: number,                                   // 32 bytes
    tokenId: string,                                // 32 bytes
    tokenContract: `0x${string}`,                   // 32 bytes
    chainId: number,                                // 32 bytes
  }