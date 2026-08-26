import { copyFileSync, existsSync } from "node:fs"
import { resolve } from "node:path"
import { type PluginOption, defineConfig } from "vite"
import { visualizer } from "rollup-plugin-visualizer"
import dts from "vite-plugin-dts"

// The bundled declaration file is self-contained, so CJS consumers can use the
// same types. Copy it to .d.cts so the "require" condition resolves a CommonJS
// declaration file instead of an ESM one (package.json has "type": "module").
function emitCjsTypes(): PluginOption {
	return {
		name: "emit-cjs-types",
		apply: "build",
		closeBundle() {
			const dts = resolve(__dirname, "dist/src/index.d.ts")
			if (existsSync(dts)) {
				copyFileSync(dts, resolve(__dirname, "dist/src/index.d.cts"))
			}
		},
	}
}

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		lib: {
			// Could also be a dictionary or array of multiple entry points
			entry: resolve(__dirname, "src/index.ts"),
			name: "tokenbound-sdk",
			// the proper extensions will be added
			fileName: "tokenbound-sdk",
		},
		rollupOptions: {
			// make sure to externalize deps that shouldn't be bundled
			// into your library
			external: ["viem"],
			output: {
				// Provide global variables to use in the UMD build
				// for externalized deps
				globals: {
					viem: "viem",
				},
			},
		},
	},
	plugins: [
		dts({
			// Roll declarations into a single self-contained entry so nothing
			// references paths outside dist/ (e.g. ../abis), which are not published.
			bundleTypes: true,
		}),
		visualizer({
			// Run 'pnpm build' to generate a stats.html file, which will automatically open
			// in your default browser. This lets us visualize bundle sizes and dependencies.
			open: true,
			template: "treemap",
			filename: "./dist/stats.html",
			gzipSize: true,
			brotliSize: true,
		}) as PluginOption,
		emitCjsTypes(),
	],
	optimizeDeps: {
		exclude: ["**/__test__/**", "**/*.test.ts", "**/*.spec.ts", "./test/**/"],
	},
})
