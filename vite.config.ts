import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text'],
      reportsDirectory: './coverage',
    },
  },
  resolve: {
    alias: {
      '@context': `${__dirname}/src/context`,
      '@components': `${__dirname}/src/components`,
      '@services': `${__dirname}/src/services`,
      '@features': `${__dirname}/src/features`,
      '@utils': `${__dirname}/src/utils`,
    },
  },
});
