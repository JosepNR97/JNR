import react from '@vitejs/plugin-react';
import {
  configDefaults,
  defineConfig,
} from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    css: true,
    globals: true,
    pool: 'vmThreads',
    maxWorkers: 2,
    exclude: [
      ...configDefaults.exclude,
      'e2e/**',
    ],
  },
});