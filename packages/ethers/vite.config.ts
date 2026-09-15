import { resolve } from "node:path"
import { defineConfig } from "vite"
import dts from "vite-plugin-dts"

export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, "src/index.ts"),
			name: "tokenbound-ethers",
			fileName: "tokenbound-ethers",
		},
		sourcemap: true,
		rollupOptions: {
			// ethers, viem and the core SDK are all consumer-supplied.
			external: ["viem", "viem/ens", "ethers", "@tokenbound/sdk"],
			output: {
				globals: {
					viem: "viem",
					ethers: "ethers",
					"@tokenbound/sdk": "tokenboundSDK",
				},
			},
		},
	},
	plugins: [
		dts({
			// Never emit declarations for tests.
			exclude: ["src/test/**", "src/**/*.test.ts", "src/**/*.spec.ts"],
		}),
	],
})
