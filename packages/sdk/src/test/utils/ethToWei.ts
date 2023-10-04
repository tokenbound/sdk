import { parseUnits } from 'viem'

export function ethToWei(eth: number) {
  return parseUnits(eth.toString(), 18)
}
