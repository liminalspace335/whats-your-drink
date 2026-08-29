import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/whats-your-drink/',
  plugins: [react()],
  server: {
    allowedHosts: ['.trycloudflare.com'],
  },
})
