import { useAccount, useEnsName } from "wagmi"

/**
 * The connect button already shows the connected address, so this only adds
 * what it does not: the ENS name, when one resolves.
 */
export function Account() {
	const { address } = useAccount()
	const { data: ensName } = useEnsName({ address })

	if (!ensName) return null

	return <div>{ensName}</div>
}
