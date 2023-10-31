type bundlerChains = {
  [chainId: number]: boolean
}

export const bundlerChains: bundlerChains = {
  1: true, //mainnet
  5: true, //goerli
  80001: false, //mumbai
  137: false, //polygon
  10: false, //optimism
  420: false, //op goerli
  8453: false, //base
  84531: false, //base goerli
  59140: false, //linea goerli
  59144: false, //linea
}
