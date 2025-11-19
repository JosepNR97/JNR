import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carga variables de entorno desde el archivo .env si existe
  // Fix: Cast process to any to bypass TS error when @types/node is not fully loaded
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    // CRUCIAL PARA GITHUB PAGES:
    // Establece la base a './' para que los assets se carguen relativamente.
    // Esto permite que la web funcione en subdirectorios (ej: usuario.github.io/repo/)
    base: './',
    define: {
      // Esto reemplaza process.env.API_KEY con el valor real durante el build ('npm run build')
      // para que el navegador pueda acceder a la clave.
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});
