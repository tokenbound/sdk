/// <reference types="vite/client" />
import { defineConfig } from "vitest/config"

export default defineConfig({
	test: {
		environment: "node",
		globals: true,
		// ethers signers cache pending nonces per provider instance. Run test
		// files sequentially AND in isolated forks, so state from one file's
		// signers can never leak into another's.
		fileParallelism: false,
		sequence: { concurrent: false },

		exclude: ["**/node_modules/**", "**/dist/**"],
	},
})
