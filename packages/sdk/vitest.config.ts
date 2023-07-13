import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
    environment: 'jsdom',
    exclude: [
      '**/.{idea,git,cache,output,temp}/**',
      '**/cypress/**',
      '**/dist/**',
      '**/node_modules/**',
      './test/pages/**',
    ],
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
})
