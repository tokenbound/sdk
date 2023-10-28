type bundlerChains = {
  [chainId: number]: boolean
}

export const bundlerChains: bundlerChains = {
  1: true, //mainnet
  5: true, //goerli
  80001: true, //mumbai
  137: true, //polygon
  10: true, //optimism
  420: true, //op goerli
  8453: true, //base
  84531: true, //base goerli
  59140: true, //linea goerli
  59144: true, //linea
}
