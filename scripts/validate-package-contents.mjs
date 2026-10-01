#!/usr/bin/env node
// Validates what each publishable package would actually ship to npm.
//
// Runs `npm pack --dry-run --json` per package and asserts that nothing
// development-only is included. Also prints packed/unpacked sizes so
// regressions are visible in CI logs.

import { execFileSync } from "node:child_process"
import { readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..")

const PACKAGES = ["packages/sdk", "packages/ethers"]

/** Patterns that must never appear in a published tarball. */
const FORBIDDEN = [
	{ label: "bundle analysis output", re: /stats\.html$|\/analysis\// },
	{ label: "test files", re: /(^|\/)(test|tests|__tests__)\//i },
	{ label: "test/spec modules", re: /\.(test|spec|test-d)\.[cm]?[jt]sx?$/ },
	{ label: "coverage output", re: /(^|\/)coverage\// },
	{ label: "example apps", re: /(^|\/)examples?\// },
	{ label: "env files", re: /(^|\/)\.env/ },
	{ label: "source maps of tests", re: /\.(test|spec)\.[cm]?[jt]s\.map$/ },
	{
		label: "tsconfig/build config",
		re: /(^|\/)(tsconfig.*\.json|vite\.config\.[jt]s|vitest\.config\.[jt]s|wagmi\.config\.[jt]s|biome\.json)$/,
	},
	{ label: "wagmi codegen output", re: /wagmi-cli-hooks/ },
	{ label: "raw TypeScript sources", re: /\.tsx?$/, allow: /\.d\.ts$/ },
	{ label: "editor/OS cruft", re: /(^|\/)(\.DS_Store|\.vscode|\.idea)(\/|$)/ },
]

let failed = false
const summary = []

for (const pkgDir of PACKAGES) {
	const cwd = resolve(ROOT, pkgDir)
	const pkgName = JSON.parse(
		readFileSync(resolve(cwd, "package.json"), "utf8"),
	).name

	const raw = execFileSync("npm", ["pack", "--dry-run", "--json"], {
		cwd,
		encoding: "utf8",
		stdio: ["ignore", "pipe", "pipe"],
	})

	const [result] = JSON.parse(raw)
	const files = result.files.map((f) => f.path)

	const violations = []
	for (const { label, re, allow } of FORBIDDEN) {
		for (const file of files) {
			if (allow?.test(file)) continue
			if (re.test(file)) violations.push(`${label}: ${file}`)
		}
	}

	// Every package must ship its metadata and a readme.
	if (!files.includes("package.json")) violations.push("missing package.json")
	if (!files.some((f) => /^readme(\.md)?$/i.test(f))) {
		violations.push("missing README")
	}

	const packedKB = (result.size / 1000).toFixed(1)
	const unpackedKB = (result.unpackedSize / 1000).toFixed(1)

	summary.push({
		pkgName,
		files: files.length,
		packedKB,
		unpackedKB,
	})

	if (violations.length) {
		failed = true
		console.error(`\n✗ ${pkgName} would publish disallowed files:`)
		for (const v of violations) console.error(`    ${v}`)
	} else {
		console.log(`✓ ${pkgName}: ${files.length} files, ${packedKB} kB packed`)
	}
}

console.log("\nPackage size report")
console.table(summary)

if (failed) {
	console.error("\nPackage content validation failed.")
	process.exit(1)
}

console.log("\nAll packages validated.")
