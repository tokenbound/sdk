import { resolve } from "node:path"
import { defineConfig, type PluginOption } from "vite"
import dts from "vite-plugin-dts"

// Bundle analysis is opt-in: `ANALYZE=true pnpm build`.
// Output is written outside dist/ so it can never be published.
const analyzePlugins = async (): Promise<PluginOption[]> => {
	if (!process.env.ANALYZE) return []
	const { visualizer } = await import("rollup-plugin-visualizer")
	return [
		visualizer({
			open: true,
			template: "treemap",
			filename: "./analysis/stats.html",
			gzipSize: true,
			brotliSize: true,
		}) as PluginOption,
	]
}

// https://vitejs.dev/config/
export default defineConfig(async () => ({
	build: {
		lib: {
			entry: {
				index: resolve(__dirname, "src/index.ts"),
				viem: resolve(__dirname, "src/viem/index.ts"),
				protocol: resolve(__dirname, "src/protocol/index.ts"),
			},
			name: "tokenbound-sdk",
			formats: ["es", "cjs"],
		},
		sourcemap: true,
		rollupOptions: {
			// Externalize deps that shouldn't be bundled into the library.
			external: [
				"viem",
				"viem/ens",
				"viem/chains",
				"viem/actions",
				"viem/accounts",
				"@layerzerolabs/lz-v2-utilities",
			],
			output: {
				globals: {
					viem: "viem",
				},
			},
		},
	},
	plugins: [
		dts({
			// Tests must never produce declarations in dist.
			exclude: [
				"src/test/**",
				"src/tests/**",
				"src/**/*.test.ts",
				"src/**/*.spec.ts",
				"src/**/*.testDISABLED.ts",
			],
		}),
		...(await analyzePlugins()),
	],
	optimizeDeps: {
		exclude: ["**/__test__/**", "**/*.test.ts", "**/*.spec.ts", "./test/**/"],
	},
}))
