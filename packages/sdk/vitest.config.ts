/// <reference types="vite/client" />
import { defineConfig } from "vitest/config"

export default defineConfig({
	test: {
		coverage: {
			reporter: ["text", "json", "html"],
			// Coverage output must never land inside published artifacts.
			reportsDirectory: "./coverage",
		},
		environment: "node",
		// TestAll.test.ts drives a real Anvil fork on a fixed port. Running it in
		// parallel with the other files contends for that node, so serialize.
		fileParallelism: false,
		sequence: { concurrent: false },
		exclude: [
			"**/.{idea,git,cache,output,temp}/**",
			"**/cypress/**",
			"**/dist/**",
			"**/node_modules/**",
			"**/6551contracts/**",
			"./test/pages/**",
		],
		// Type-level assertions (expectTypeOf) are only enforced when this is on.
		typecheck: {
			enabled: true,
			include: ["src/test/**/*.test-d.ts"],
			tsconfig: "./tsconfig.test.json",
		},
		globals: true,
	},
})
