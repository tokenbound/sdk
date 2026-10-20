/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_ALCHEMY_API_KEY?: string
	/** WalletConnect project id from https://cloud.reown.com. Optional. */
	readonly VITE_WALLETCONNECT_PROJECT_ID?: string
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}
