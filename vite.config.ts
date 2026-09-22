import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: process.env.GITHUB_PAGES ? '/titan-agency/' : '/',
  plugins: [react(), tailwindcss()],
  server: {
    port: 5190,
    proxy: {
      '/api': 'http://localhost:4200',
    },
  },
})
