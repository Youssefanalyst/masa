import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/masa/',
  plugins: [react()],
  server: {
    // Fix for SPA routing - redirect all requests to index.html
    historyApiFallback: true,
  },
  preview: {
    // Same fix for preview mode
    historyApiFallback: true,
  }
})
