import React, { useCallback, useEffect } from 'react'
import {
  usePrepareContractWrite,
  useContractWrite,
  useWaitForTransaction,
  useWalletClient,
} from 'wagmi'
import { useHasMounted } from '../hooks'

import {
  zora1155ABI, // Individual implementations of the 1155 contract are proxied, so we
} from '../wagmi-cli-hooks/generated'
import { encodeAbiParameters, getAddress, parseAbiParameters, parseUnits } from 'viem'
import { TesterType, Tester } from '../types'
// import { WriteContractResult } from 'wagmi/dist/actions'
// import { WriteContractResult } from 'wagmi/actions'
import { WriteContractResult } from 'wagmi/actions'

const ethToWei = function (eth: number) {
  return parseUnits(eth.toString(), 18)
}

interface TestTxMintThenTransferProps {
  address: `0x${string}`
  tester: TesterType
}

function ZoraMintFinalizer({
  writeData,
  tester,
}: {
  writeData?: WriteContractResult
  tester: TesterType
}) {
  const { data: transactionData, error: waitError } = useWaitForTransaction({
    hash: writeData?.hash,
  })

  // if (tester !== Tester.VIEM_WALLETCLIENT) {
  if (tester === Tester.ETHERS) {
    console.log({ transactionData, waitError })
  }

  return transactionData ? (
    <span id="tb-executed-mint" data-testid="tb-executed-mint">
      {/* {minted1155} */}
      MINT!
    </span>
  ) : null
}

// function ZoraMinter({ mintFunction }: { mintFunction: () => void }) {
function ZoraMinter({ config, tester }: { config: any; tester: TesterType }) {
  const { data: mintZora1155Data, write: mintZora1155 } = useContractWrite(config)

  // Seems like mintZora1155 is not being set in the Ethers case

  if (tester === Tester.ETHERS) {
    console.log({ prepare: `PREPARE ${tester} >>>>>>>>>>`, config })
    console.log({
      write: `WRITE ${tester} >>>>>>>`,
      mintZora1155,
      mintZora1155Data,
    })
    // console.log({ transactionData, waitError })
  }

  useEffect(() => {
    console.log('MINTER SET', mintZora1155)
  }, [mintZora1155])

  const execute1155Mint = useCallback(async () => {
    // console.log('EXECUTING 1155 MINT')
    // const result = await mintZora1155()
    await mintZora1155()
    // console.log('MINT_RESULT', result)
  }, [])

  return (
    <>
      <button
        id="tb-mint-1155-button"
        data-testid="tb-mint-1155-button"
        onClick={() => execute1155Mint()}
      >
        Execute 1155 Mint
      </button>
      {/* {mintZora1155Data && ( */}
      {!!mintZora1155 && mintZora1155Data && (
        <ZoraMintFinalizer writeData={mintZora1155Data} tester={tester} />
      )}
      {/* {!!writeData && <ZoraMintFinalizer writeData={writeData} tester={tester} />} */}
    </>
  )
}

export function TestTxMintThenTransfer({ address, tester }: TestTxMintThenTransferProps) {
  const hasMounted = useHasMounted()
  const { data: walletClient } = useWalletClient({ chainId: 1 })
  // const [setPrepareConfig, PrepareConfig] = useState<PrepareWriteContractResult>()

  // Contract calls for 1155 mints

  // Stapleverse 'Pidge in Hand' drop: https://zora.co/collect/eth:0xafd7b9edc5827f7e39dcd425d8de8d4e1cb292c1/3
  const zora1155MinterAddress = getAddress('0x8A1DBE9b1CeB1d17f92Bebf10216FCFAb5C3fbA7') // IMinter1155 minter contract is FIXED_PRICE_SALE_STRATEGY from https://github.com/ourzora/zora-1155-contracts/blob/main/addresses/1.json
  // proxyContractAddress: `0x${string}` = '0xafd7b9edc5827f7e39dcd425d8de8d4e1cb292c1'
  const stapleversePidgeInHandDrop = {
    proxyContractAddress: getAddress('0xafd7b9edc5827f7e39dcd425d8de8d4e1cb292c1'), // proxy address
    tokenId: BigInt(3),
    mintFee: ethToWei(0.025), // 0.025 ETH
    quantity: BigInt(1),
  }

  const minterArguments: `0x${string}` = encodeAbiParameters(
    parseAbiParameters('address'),
    [address]
  )

  // Individual implementations of the Zora 1155 contract are proxied, so we need to call against the proxied address:
  const {
    config,
    // error
  } = usePrepareContractWrite({
    chainId: 1,
    account: address,
    abi: zora1155ABI,
    address: stapleversePidgeInHandDrop.proxyContractAddress,
    functionName: 'mint',
    walletClient,
    value: stapleversePidgeInHandDrop.mintFee,
    args: [
      zora1155MinterAddress,
      stapleversePidgeInHandDrop.tokenId,
      stapleversePidgeInHandDrop.quantity,
      minterArguments,
    ],
  })

  if (!hasMounted) return null

  return (
    <>
      {address && (
        <>
          <ZoraMinter tester={tester} config={config} />
        </>
      )}
    </>
  )
}
