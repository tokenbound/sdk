import { defineConfig } from "tsdown"

// Emits ESM (.js) and CJS (.cjs), each with its own bundled declarations
// (.d.ts / .d.cts). ethers, viem and the core SDK are all consumer-supplied
// (peer dependencies or dependencies), so they stay external.
export default defineConfig({
	entry: { index: "src/index.ts" },
	format: ["esm", "cjs"],
	platform: "neutral",
	dts: true,
})
