import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import VueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), VueDevTools()],
  server: {
    port: (process.env.VITE_PORT as unknown as number) || 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:' + ((process.env.WEB_PORT as unknown as number) || 8083),
        changeOrigin: true,
        rewrite: (path) => path /* path.replace(/^\/service/, '') */
      },
      '/auth': {
        target: 'http://localhost:' + ((process.env.WEB_PORT as unknown as number) || 8083),
        changeOrigin: true,
        rewrite: (path) => path /* path.replace(/^\/service/, '') */
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
