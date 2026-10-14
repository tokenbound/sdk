import { useAccount, useConnect, useDisconnect } from "wagmi"

/**
 * A minimal connect UI built on wagmi's own hooks.
 *
 * Deliberately not RainbowKit/ConnectKit: the SDK only needs a connected
 * account, however you obtain it. See examples/vite-wagmi-viem for the same app
 * using RainbowKit instead.
 */
export function ConnectWallet() {
	const { address, isConnected } = useAccount()
	const { connectors, connect, isPending } = useConnect()
	const { disconnect } = useDisconnect()

	if (isConnected) {
		return (
			<button type="button" onClick={() => disconnect()}>
				Disconnect {address?.slice(0, 6)}…{address?.slice(-4)}
			</button>
		)
	}

	return (
		<div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
			{connectors.map((connector) => (
				<button
					key={connector.uid}
					type="button"
					disabled={isPending}
					onClick={() => connect({ connector })}
				>
					{connector.name}
				</button>
			))}
		</div>
	)
}
