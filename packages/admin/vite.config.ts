import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://api.verlantum.cn',
        changeOrigin: true,
        rewrite(path) {
          return path.replace(/^\/api/, '');
        },
      },
    },
    allowedHosts: ['3twqdr10-1brks9o4-nfjobspi7vz6.vcc3p.mcprev.cn'],
  },
});
