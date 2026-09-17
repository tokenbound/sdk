import { ConnectButton } from "@rainbow-me/rainbowkit"
import { tokenboundActions } from "@tokenbound/sdk/viem"
import { useCallback, useEffect } from "react"

import { createWalletClient, custom, getAddress, http, parseUnits } from "viem"
import { baseGoerli, baseSepolia } from "viem/chains"
import { useAccount } from "wagmi"
import { Account } from "./components"

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

	// The modern viem-first API: extend a viem client and call through
	// `client.tokenbound.*`. The extension reuses the same protocol logic as the
	// standalone functions, and preserves viem's type inference.
	const tokenboundClient = createWalletClient({
		chain: baseSepolia,
		account: address,
		transport: window.ethereum ? custom(window.ethereum) : http(),
	}).extend(tokenboundActions())

	useEffect(() => {
		async function testTokenboundClass() {
			if (!tokenboundClient) return

			const tokenboundAccount = tokenboundClient.tokenbound.getAccount({
				tokenContract: originNFT.tokenContract,
				tokenId: originNFT.tokenId,
			})

			const preparedExecution =
				await tokenboundClient.tokenbound.prepareExecution({
					account: tokenboundAccount,
					to: recipientAddress,
					value: 0n,
					data: "0x",
				})

			const preparedCreateAccount =
				await tokenboundClient.tokenbound.prepareCreateAccount({
					tokenContract: originNFT.tokenContract,
					tokenId: originNFT.tokenId,
				})

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
		const createdAccount = await tokenboundClient.tokenbound.createAccount({
			tokenContract: originNFT.tokenContract,
			tokenId: originNFT.tokenId,
		})
		console.log(`new account: ${createdAccount}`)
		alert(`new account: ${createdAccount}`)
	}, [tokenboundClient, address])

	const execute = useCallback(async () => {
		if (!tokenboundClient || !address) return
		const executedCall = await tokenboundClient.tokenbound.execute({
			account: sendingTBA,
			to: recipientAddress,
			value: ethAmountWei,
			data: "0x",
		})
		executedCall && alert(`Executed: ${executedCall}`)
	}, [tokenboundClient, address])

	const transferETH = useCallback(async () => {
		if (!tokenboundClient || !address) return
		const executedTransfer = await tokenboundClient.tokenbound.transferETH({
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
			data: "0x" as const,
			chainId: baseGoerli.id,
		}

		const executedCallTxHash =
			await tokenboundClient.tokenbound.execute(execution)

		executedCallTxHash &&
			alert(`Sent blank tx on ${baseGoerli.name}: ${executedCallTxHash}`)
	}, [tokenboundClient, address])

	return (
		<>
			<h1>viem .extend(tokenboundActions()) + RainbowKit + Vite</h1>
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
