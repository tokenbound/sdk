import { tokenboundActions } from "@tokenbound/sdk/viem"
import { useCallback, useEffect, useMemo, useState } from "react"

import {
	createPublicClient,
	createWalletClient,
	custom,
	formatEther,
	getAddress,
	http,
	isAddress,
	parseAbi,
	parseUnits,
} from "viem"
import { useAccount } from "wagmi"
import { Account, ConnectWallet } from "./components"
import { SUPPORTED_CHAINS } from "./main"

declare global {
	interface Window {
		ethereum?: any // CoinbaseWalletSDK also defines window.ethereum, so we have to work around that :(
	}
}

const erc721Abi = parseAbi(["function ownerOf(uint256) view returns (address)"])

/** 0x1234…cdef — enough to compare against a wallet without repeating it in full. */
const shortAddress = (value: string) =>
	`${value.slice(0, 6)}…${value.slice(-4)}`

export function App() {
	const { isConnected, address } = useAccount()

	const [chainId, setChainId] = useState<number>(SUPPORTED_CHAINS[0].id)
	const [tokenContract, setTokenContract] = useState("")
	const [tokenId, setTokenId] = useState("")
	const [executeTo, setExecuteTo] = useState("")
	const [transferTo, setTransferTo] = useState("")
	const [ethAmount, setEthAmount] = useState("0.005")

	const chain = useMemo(
		() => SUPPORTED_CHAINS.find((c) => c.id === chainId) ?? SUPPORTED_CHAINS[0],
		[chainId],
	)

	// The modern viem-first API: extend a viem client and call through
	// `client.tokenbound.*`. The extension reuses the same protocol logic as the
	// standalone functions, and preserves viem's type inference.
	const tokenboundClient = useMemo(
		() =>
			createWalletClient({
				chain,
				account: address,
				transport: window.ethereum ? custom(window.ethereum) : http(),
			}).extend(tokenboundActions()),
		[chain, address],
	)

	const publicClient = useMemo(
		() => createPublicClient({ chain, transport: http() }),
		[chain],
	)

	const nftIsValid = isAddress(tokenContract) && tokenId.trim() !== ""

	// getAccount() is pure derivation: no network call, and it returns an address
	// whether or not the account has been deployed yet.
	const tokenboundAccount = useMemo(() => {
		if (!nftIsValid) return undefined
		try {
			return tokenboundClient.tokenbound.getAccount({
				tokenContract: getAddress(tokenContract),
				tokenId,
			})
		} catch {
			return undefined
		}
	}, [tokenboundClient, tokenContract, tokenId, nftIsValid])

	const [nftOwner, setNftOwner] = useState<string>()
	const [isDeployed, setIsDeployed] = useState<boolean>()
	const [tbaBalance, setTbaBalance] = useState<bigint>()
	const [status, setStatus] = useState<string>()

	// Deployment status comes from the SDK's own checkAccountDeployment, and the
	// balance decides whether the account has anything to send. Both gate the
	// action sections below, so they are resolved before anything is clickable.
	useEffect(() => {
		let cancelled = false
		setNftOwner(undefined)
		setIsDeployed(undefined)
		setTbaBalance(undefined)
		if (!nftIsValid || !tokenboundAccount) return
		;(async () => {
			const [owner, deployed, balance] = await Promise.all([
				publicClient
					.readContract({
						address: getAddress(tokenContract),
						abi: erc721Abi,
						functionName: "ownerOf",
						args: [BigInt(tokenId)],
					})
					.catch(() => undefined),
				tokenboundClient.tokenbound
					.checkAccountDeployment({ accountAddress: tokenboundAccount })
					.catch(() => false),
				publicClient.getBalance({ address: tokenboundAccount }).catch(() => 0n),
			])
			if (cancelled) return
			setNftOwner(owner)
			setIsDeployed(deployed)
			setTbaBalance(balance)
		})()
		return () => {
			cancelled = true
		}
	}, [
		publicClient,
		tokenboundClient,
		tokenContract,
		tokenId,
		tokenboundAccount,
		nftIsValid,
	])

	const isOwner =
		!!nftOwner && !!address && nftOwner.toLowerCase() === address.toLowerCase()

	const run = useCallback(
		async (label: string, fn: () => Promise<string | undefined>) => {
			try {
				setStatus(`${label}…`)
				const hash = await fn()
				setStatus(hash ? `${label}: ${hash}` : `${label}: done`)
			} catch (error) {
				setStatus(
					`${label} failed: ${
						error instanceof Error ? error.message.split("\n")[0] : error
					}`,
				)
			}
		},
		[],
	)

	const createAccount = useCallback(
		() =>
			run("Create account", async () => {
				const created = await tokenboundClient.tokenbound.createAccount({
					tokenContract: getAddress(tokenContract),
					tokenId,
				})
				return created.txHash
			}),
		[run, tokenboundClient, tokenContract, tokenId],
	)

	const execute = useCallback(
		() =>
			run("Execute", async () => {
				if (!tokenboundAccount) return
				return await tokenboundClient.tokenbound.execute({
					account: tokenboundAccount,
					to: getAddress(executeTo || address || tokenContract),
					value: parseUnits(ethAmount || "0", 18),
					data: "0x",
				})
			}),
		[
			run,
			tokenboundClient,
			tokenboundAccount,
			executeTo,
			address,
			tokenContract,
			ethAmount,
		],
	)

	const transferETH = useCallback(
		() =>
			run("Transfer ETH", async () => {
				if (!tokenboundAccount) return
				return await tokenboundClient.tokenbound.transferETH({
					account: tokenboundAccount,
					recipientAddress: getAddress(transferTo || address || tokenContract),
					amount: Number(ethAmount || "0"),
				})
			}),
		[
			run,
			tokenboundClient,
			tokenboundAccount,
			transferTo,
			address,
			tokenContract,
			ethAmount,
		],
	)

	// Cross-chain execution: the destination chain is whichever entry in the
	// picker is not the one the client is on, so it stays valid when the chain
	// selection changes.
	const crossChainDestination = useMemo(
		() => SUPPORTED_CHAINS.find((c) => c.id !== chainId) ?? SUPPORTED_CHAINS[0],
		[chainId],
	)

	const crossChainTransferETH = useCallback(
		() =>
			run(`Cross-chain execute on ${crossChainDestination.name}`, async () => {
				if (!tokenboundAccount) return
				return await tokenboundClient.tokenbound.execute({
					account: tokenboundAccount,
					to: getAddress(executeTo || address || tokenContract),
					value: 0n,
					data: "0x",
					chainId: crossChainDestination.id,
				})
			}),
		[
			run,
			tokenboundClient,
			tokenboundAccount,
			executeTo,
			address,
			tokenContract,
			crossChainDestination,
		],
	)

	// Each action has its own precondition, so each section is enabled
	// independently rather than behind one catch-all check.
	const canCreate = nftIsValid && !!address
	const canExecute = isOwner && isDeployed === true
	const canTransfer = canExecute && !!tbaBalance && tbaBalance > 0n

	const step = {
		border: "1px solid #e5e7eb",
		borderRadius: "8px",
		padding: "16px",
	}
	const stepTitle = { margin: "0 0 4px", fontSize: "15px" }
	const hint = { margin: "0 0 12px", fontSize: "13px", color: "#4b5563" }
	const note = { display: "block", marginTop: "6px", color: "#6b7280" }
	const field = {
		display: "flex",
		flexDirection: "column" as const,
		gap: "4px",
		fontFamily: "Arial, Helvetica, sans-serif",
		marginBlock: "0.5rem",
	}
	const mono = {
		fontFamily: "monospace",
		fontSize: "13px",
		wordBreak: "break-all" as const,
	}

	return (
		<>
			<h1>viem .extend(tokenboundActions()) + wagmi 3 + Vite</h1>
			<ConnectWallet />
			{isConnected && <Account />}

			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: "24px",
					maxWidth: "560px",
					margin: "24px 0",
				}}
			>
				<section style={step}>
					<h3 style={stepTitle}>1 · Pick a chain and an NFT you own</h3>
					<p style={hint}>
						A tokenbound account belongs to an NFT. Its address is derived from
						the chain, contract and token id — no network call needed.
					</p>
					<label style={field}>
						Chain
						<select
							value={chainId}
							onChange={(e) => setChainId(Number(e.target.value))}
						>
							{SUPPORTED_CHAINS.map((c) => (
								<option key={c.id} value={c.id}>
									{c.name}
									{c.testnet ? " (testnet)" : " — real funds"}
								</option>
							))}
						</select>
					</label>
					<label style={field}>
						NFT contract
						<input
							value={tokenContract}
							onChange={(e) => setTokenContract(e.target.value)}
							placeholder="0x…"
						/>
					</label>
					<label style={field}>
						Token ID
						<input
							value={tokenId}
							onChange={(e) => setTokenId(e.target.value)}
							placeholder="0"
						/>
					</label>

					{nftIsValid && tokenboundAccount && (
						<div style={{ ...mono, marginTop: "12px" }}>
							<div>
								<strong>Derived account:</strong> {tokenboundAccount}
							</div>
							<div>
								<strong>NFT owner:</strong>{" "}
								{nftOwner
									? isOwner
										? "✅ you"
										: `${shortAddress(nftOwner)} — not you`
									: "looking up…"}
							</div>
							{isDeployed !== undefined && (
								<div>
									<strong>Status:</strong>{" "}
									{isDeployed
										? `deployed · ${formatEther(tbaBalance ?? 0n)} ETH`
										: "not deployed yet"}
								</div>
							)}
						</div>
					)}
				</section>

				{address && (
					<>
						<section style={step}>
							<h3 style={stepTitle}>2 · Create the account</h3>
							<p style={hint}>
								Deploys the account on-chain. Permissionless — anyone can deploy
								an account for any NFT.
							</p>
							<button
								type="button"
								onClick={createAccount}
								disabled={!canCreate || isDeployed === true}
							>
								CREATE ACCOUNT
							</button>
							<small style={note}>
								{!nftIsValid
									? "Fill in the contract and token id above."
									: isDeployed === true
										? "Already deployed — nothing to do."
										: "Ready to deploy."}
							</small>
						</section>

						<section style={step}>
							<h3 style={stepTitle}>3 · Execute a call from the account</h3>
							<p style={hint}>
								Sends a call as the account. Only the NFT holder can authorize
								it, and the account must exist first.
							</p>
							<label style={field}>
								Send to (defaults to your address)
								<input
									value={executeTo}
									onChange={(e) => setExecuteTo(e.target.value)}
									placeholder={address ?? "0x…"}
								/>
							</label>
							<div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
								<button type="button" onClick={execute} disabled={!canExecute}>
									EXECUTE
								</button>
								<button
									type="button"
									onClick={crossChainTransferETH}
									disabled={!canExecute}
								>
									CROSS-CHAIN → {crossChainDestination.name}
								</button>
							</div>
							<small style={note}>
								{isDeployed !== true
									? "Create the account first."
									: !isOwner
										? "Only the NFT holder can execute."
										: "Ready."}
							</small>
						</section>

						<section style={step}>
							<h3 style={stepTitle}>4 · Transfer ETH out of the account</h3>
							<p style={hint}>
								The ETH comes from the tokenbound account, not your wallet — so
								the account needs a balance first.
							</p>
							<label style={field}>
								Amount (ETH)
								<input
									value={ethAmount}
									onChange={(e) => setEthAmount(e.target.value)}
									placeholder="0.005"
								/>
							</label>
							<label style={field}>
								Recipient (defaults to your address)
								<input
									value={transferTo}
									onChange={(e) => setTransferTo(e.target.value)}
									placeholder={address ?? "0x…"}
								/>
							</label>
							<button
								type="button"
								onClick={transferETH}
								disabled={!canTransfer}
								style={{ marginTop: "8px" }}
							>
								TRANSFER ETH
							</button>
							<small style={note}>
								{!canExecute
									? "Needs a deployed account you hold the NFT for."
									: !tbaBalance || tbaBalance === 0n
										? `The account has no ETH. Send some to ${tokenboundAccount ?? "it"} first.`
										: `Account holds ${formatEther(tbaBalance)} ETH.`}
							</small>
						</section>
					</>
				)}
			</div>

			{status && <p style={{ maxWidth: "520px", ...mono }}>{status}</p>}
		</>
	)
}
