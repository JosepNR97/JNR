import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // CRUCIAL PARA GITHUB PAGES:
  // Establece la base a './' para que los assets se carguen relativamente.
  base: './',
});
