import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  base: '/apps/pokedex/',
  plugins: [react()],
  server: {
    proxy: {
      '/pokedex': {
        target: 'https://api.akli.dev',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@api': '/src/api',
      '@components': '/src/components',
      '@hooks': '/src/hooks',
      '@pages': '/src/pages',
      '@models': '/src/types',
      '@utils': '/src/utils',
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
})
