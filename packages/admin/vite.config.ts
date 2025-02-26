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
    proxy:{
      '/api': {
        target: 'https://e5zb324g-cn5douq5-6h93snslkbeg.vcc3p.mcprev.cn',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, '')
      }
    },
    allowedHosts: ['i2vmbvpf-xcpzus6z-mvovyemgxlr5.vcc3p.mcprev.cn']
  },
})
