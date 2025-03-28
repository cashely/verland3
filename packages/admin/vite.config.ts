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
    allowedHosts: [],
  },
});
