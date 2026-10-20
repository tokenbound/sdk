import { defineConfig, type UserConfig } from "tsdown"

// Bundle analysis is opt-in: `ANALYZE=true pnpm build`.
// Output is written outside dist/ so it can never be published.
const analyzePlugins = async (): Promise<UserConfig["plugins"]> => {
	if (!process.env.ANALYZE) return []
	const { visualizer } = await import("rollup-plugin-visualizer")
	return [
		visualizer({
			open: true,
			template: "treemap",
			filename: "./analysis/stats.html",
			gzipSize: true,
			brotliSize: true,
		}),
	]
}

// Emits ESM (.js) and CJS (.cjs), each with its own bundled declarations
// (.d.ts / .d.cts), so `import` and `require` consumers both get types that
// match the code they load. Dependencies and peer dependencies (viem, the
// LayerZero utilities) stay external.
export default defineConfig(async () => ({
	entry: {
		index: "src/index.ts",
		viem: "src/viem/index.ts",
		protocol: "src/protocol/index.ts",
	},
	format: ["esm", "cjs"],
	platform: "neutral",
	dts: true,
	plugins: await analyzePlugins(),
}))
