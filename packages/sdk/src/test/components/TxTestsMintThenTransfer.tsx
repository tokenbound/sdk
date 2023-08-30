import React, { useCallback, useState } from 'react'
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi'
import { useHasMounted } from '../hooks'

import {
  zora1155ABI, // Individual implementations of the 1155 contract are proxied, so we
} from '../wagmi-cli-hooks/generated'
import { encodeAbiParameters, getAddress, parseAbiParameters, parseUnits } from 'viem'
import { TesterType } from '../types'

const ethToWei = function (eth: number) {
  return parseUnits(eth.toString(), 18)
}

interface TxTestsMintThenTransferProps {
  address: `0x${string}`
  tester: TesterType
}

export function TxTestsMintThenTransfer({
  address,
  tester,
}: TxTestsMintThenTransferProps) {
  const hasMounted = useHasMounted()
  // const [setPrepareConfig, PrepareConfig] = useState<PrepareWriteContractResult>()

  // Contract calls for 1155 mints

  // Stapleverse Sapienz drop: https://zora.co/collect/eth:0xafd7b9edc5827f7e39dcd425d8de8d4e1cb292c1/3
  const stapleverseSapienzDrop = {
    zora1155MinterAddress: getAddress('0x8A1DBE9b1CeB1d17f92Bebf10216FCFAb5C3fbA7'), // IMinter1155 minter contract is FIXED_PRICE_SALE_STRATEGY from https://github.com/ourzora/zora-1155-contracts/blob/main/addresses/1.json
    tokenContract: '0xafd7b9edc5827f7e39dcd425d8de8d4e1cb292c1',
    tokenId: BigInt(3),
    mintFee: ethToWei(0.025), // 0.025 ETH
    quantity: BigInt(1),
  }

  const proxyAddress: `0x${string}` = '0xafd7b9edc5827f7e39dcd425d8de8d4e1cb292c1'
  const minterArguments: `0x${string}` = encodeAbiParameters(
    parseAbiParameters('address'),
    [address]
  )

  // Individual implementations of the Zora 1155 contract are proxied, so we need to call against the proxied address:
  // const prepare = usePrepareContractWrite({
  const { config, error } = usePrepareContractWrite({
    chainId: 1,
    account: address,
    abi: zora1155ABI,
    address: proxyAddress,
    functionName: 'mint',
    value: stapleverseSapienzDrop.mintFee,
    args: [
      stapleverseSapienzDrop.zora1155MinterAddress,
      stapleverseSapienzDrop.tokenId,
      stapleverseSapienzDrop.quantity,
      minterArguments,
    ],
  })

  console.log(`PREPARE ${tester} >>>>>>>>>>`, config, `ERROR?: ${error}`)

  const { data: mintZora1155Data, write: mintZora1155 } = useContractWrite(config)

  const { data: transactionData, error: waitError } = useWaitForTransaction({
    hash: mintZora1155Data?.hash,
  })

  // console.log(
  //   `WRITE ${tester} >>>>>>>`,
  //   'mintZora1155:',
  //   mintZora1155,
  //   'typeof mintZora1155:',
  //   typeof mintZora1155,
  //   'mintZora1155Data:',
  //   mintZora1155Data
  // )
  console.log({
    // `WRITE ${tester} >>>>>>>`,
    mintZora1155,
    // 'typeof mintZora1155',typeof mintZora1155,
    mintZora1155Data,
  })

  console.log({ transactionData, waitError })
  // console.log('transactionData: ', transactionData, `waitError:`, waitError)

  const execute1155Mint = useCallback(async () => {
    // console.log(
    //   'executing MINT >>>>>>>',
    //   // address,
    //   mintZora1155,
    //   mintZora1155Data,
    //   config
    // )

    console.log('typeof mintZora1155:', typeof mintZora1155)
    console.log('typeof mintZora1155Data:', typeof mintZora1155Data)

    if (!address || !mintZora1155) return
    console.log('PRE-EXECUTION >>>>>>>>>>')
    // const executedMint =
    await mintZora1155()
    console.log('POST-EXECUTION >>>>>>>>>>')

    // console.log('executedMint >>>>>>>>>>', executedMint)
    // executedMint.isSuccess
    // executedMint &&
    // setMinted1155(executedMint)
  }, [address, mintZora1155])

  if (!hasMounted) return null

  return (
    <>
      {address && (
        <>
          {!!mintZora1155 && (
            <button
              id="tb-mint-1155-button"
              data-testid="tb-mint-1155-button"
              onClick={() => execute1155Mint()}
            >
              Execute 1155 Mint
            </button>
          )}
          {/* OUTPUT WHEN MINT HAS BEEN SUCCESSFULLY EXECUTED */}
          {transactionData && (
            <span id="tb-executed-mint" data-testid="tb-executed-mint">
              {/* {minted1155} */}
              MINT!
            </span>
          )}
        </>
      )}
    </>
  )
}
