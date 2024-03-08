/// <reference types="vite/client" />
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
    // environment: 'jsdom',
    environment: 'node',
    exclude: [
      '**/.{idea,git,cache,output,temp}/**',
      '**/cypress/**',
      '**/dist/**',
      '**/node_modules/**',
      '**/6551contracts/**',
      './test/pages/**',
    ],
    globals: true,
    setupFiles: './src/test/config/setup.ts',
  },
})
