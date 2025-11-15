import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // Use relative paths in development, absolute in production
  const base = mode === 'development' ? '/' : '/'
  
  return {
    base,
    plugins: [react()],
    server: {
      // Fix for SPA routing - redirect all requests to index.html
      historyApiFallback: true,
    },
    preview: {
      // Same fix for preview mode
      historyApiFallback: true,
    },
    build: {
      // Ensure assets are built with correct paths
      assetsDir: 'assets',
      rollupOptions: {
        output: {
          // Ensure consistent asset paths
          assetFileNames: 'assets/[name]-[hash][extname]',
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
        },
      },
    },
  }
})
