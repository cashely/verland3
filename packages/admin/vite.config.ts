import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite(path) {
          return path.replace(/^\/api/, '')
        }
      }
    },
    allowedHosts: ['api.verlantum.cn', '3f6rvhz7-frciwj1f-n4tuj2bcxotv.vcc3p.mcprev.cn']
  },
})
