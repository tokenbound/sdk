import { resolve } from "path";
import { PluginOption, defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";
import dts from "vite-plugin-dts";

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
		dts(),
		visualizer({
			// Run 'pnpm build' to generate a stats.html file, which will automatically open
			// in your default browser. This lets us visualize bundle sizes and dependencies.
			open: true,
			template: "treemap",
			filename: "./dist/stats.html",
			gzipSize: true,
			brotliSize: true,
		}) as PluginOption,
	],
	optimizeDeps: {
		exclude: ["**/__test__/**", "**/*.test.ts", "**/*.spec.ts", "./test/**/"],
	},
});
