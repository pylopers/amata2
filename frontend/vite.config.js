import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {port:5173},
  build: {
    target:['es2015', 'safari12'],
    sourcemap: true,
    rollupOptions: {
      external: ['swiper'],
    }
  }
})
