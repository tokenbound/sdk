import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useAccount } from "wagmi"

import { Account } from "./components"

import {
	createWalletClient,
	http,
	custom,
	parseUnits,
	getAddress,
	type WalletClient,
} from "viem"
import { baseSepolia, baseGoerli } from "viem/chains"
import { TokenboundClient } from "@tokenbound/sdk"
import { useCallback, useEffect } from "react"

declare global {
	interface Window {
		ethereum?: any // CoinbaseWalletSDK also defines window.ethereum, so we have to work around that :(
	}
}

// Origin NFT: MoonTrees #0 on Base Sepolia
const originNFT = {
	tokenContract: getAddress("0xcf7ea35b7421a8ff2ff460a939e294ac13a05342"),
	tokenId: "0",
}

// TBA: Tokenbound Account derived from MoonTrees #0 on Base Sepolia
const sendingTBA = getAddress("0x5F50CAf6244d10C32965354F8c4d84D84503D42D")
const recipientAddress = getAddress(
	"0x9FefE8a875E7a9b0574751E191a2AF205828dEA4",
)
const ethAmount = 0.005
const ethAmountWei = parseUnits(`${ethAmount}`, 18)

export function App() {
	const { isConnected, address } = useAccount()

	const walletClient: WalletClient = createWalletClient({
		chain: baseSepolia,
		account: address,
		transport: window.ethereum ? custom(window.ethereum) : http(),
	})

	const tokenboundClient = new TokenboundClient({
		walletClient,
		chainId: baseSepolia.id,
		// implementationAddress: '0x2d25602551487c3f3354dd80d76d54383a243358',
	})

	useEffect(() => {
		async function testTokenboundClass() {
			if (!tokenboundClient) return

			const tokenboundAccount = tokenboundClient.getAccount({
				tokenContract: originNFT.tokenContract,
				tokenId: originNFT.tokenId,
			})

			const preparedExecution = await tokenboundClient.prepareExecution({
				account: tokenboundAccount,
				to: recipientAddress,
				value: 0n,
				data: "",
			})

			const preparedCreateAccount = await tokenboundClient.prepareCreateAccount(
				{
					tokenContract: originNFT.tokenContract,
					tokenId: originNFT.tokenId,
				},
			)

			console.log("getAccount", tokenboundAccount)
			console.log("preparedExecution", preparedExecution)
			console.log("preparedAccount", preparedCreateAccount)

			// if (address) {
			//   walletClient?.sendTransaction(preparedCreateAccount)
			//   walletClient?.sendTransaction(preparedExecuteCall)
			// }
		}

		testTokenboundClass()
	}, [tokenboundClient])

	const createAccount = useCallback(async () => {
		if (!tokenboundClient || !address) return
		const createdAccount = await tokenboundClient.createAccount({
			tokenContract: originNFT.tokenContract,
			tokenId: originNFT.tokenId,
		})
		console.log(`new account: ${createdAccount}`)
		alert(`new account: ${createdAccount}`)
	}, [tokenboundClient, address])

	const execute = useCallback(async () => {
		if (!tokenboundClient || !address) return
		const executedCall = await tokenboundClient.execute({
			account: sendingTBA,
			to: recipientAddress,
			value: ethAmountWei,
			data: "0x",
		})
		executedCall && alert(`Executed: ${executedCall}`)
	}, [tokenboundClient, address])

	const transferETH = useCallback(async () => {
		if (!tokenboundClient || !address) return
		const executedTransfer = await tokenboundClient.transferETH({
			account: sendingTBA,
			recipientAddress,
			amount: ethAmount,
		})
		executedTransfer && alert(`Sent ${ethAmount} ETH to ${recipientAddress}`)
	}, [tokenboundClient, address])

	const crossChainTransferETH = useCallback(async () => {
		if (!tokenboundClient || !address) return

		const execution = {
			account: sendingTBA,
			to: originNFT.tokenContract,
			value: 0n,
			data: "",
			chain: baseGoerli,
		}

		const executedCallTxHash = await tokenboundClient.execute(execution)

		executedCallTxHash &&
			alert(`Sent blank tx on ${baseGoerli.name}: ${executedCallTxHash}`)
	}, [tokenboundClient, address])

	return (
		<>
			<h1>viem walletClient + ConnectKit + Vite</h1>
			<ConnectButton />
			{isConnected && <Account />}
			{address && (
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						gap: "8px",
						margin: "32px 0 0",
						maxWidth: "320px",
					}}
				>
					<button type="button" onClick={() => execute()}>
						EXECUTE
					</button>
					<button type="button" onClick={() => createAccount()}>
						CREATE ACCOUNT
					</button>
					<button type="button" onClick={() => transferETH()}>
						TRANSFER ETH
					</button>
					<button type="button" onClick={() => crossChainTransferETH()}>
						CROSS-CHAIN TRANSFER ETH
					</button>
				</div>
			)}
		</>
	)
}
