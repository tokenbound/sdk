import type { SignableMessage } from "viem"

export function isViemSignableMessage(
	message: unknown,
): message is SignableMessage {
	return (
		typeof message === "string" ||
		(typeof message === "object" && message !== null && "raw" in message)
	)
}
