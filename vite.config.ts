import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { generateLocalizedPages } from './scripts/generate-localized-html.ts';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig(() => {
  generateLocalizedPages(projectRoot);

  return {
    plugins: [tailwindcss(), react()],
    base: './',
    build: {
      rollupOptions: {
        input: {
          root: fileURLToPath(new URL('./index.html', import.meta.url)),
          ca: fileURLToPath(new URL('./ca/index.html', import.meta.url)),
          es: fileURLToPath(new URL('./es/index.html', import.meta.url)),
          en: fileURLToPath(new URL('./en/index.html', import.meta.url)),
        },
      },
    },
  };
});
