import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    global: 'globalThis',
    'process.env': {}
  },
  optimizeDeps: {
    exclude: ['chart.js/auto', 'chart.js', 'chartjs-adapter-dayjs-4', 'react-chartjs-2'], 
    include: [
      '@mui/material',
      '@mui/icons-material',
      'framer-motion',
      'recharts'
    ]
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    force: true // Force dependency re-optimization
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      external: [],
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/icons-material', '@mui/system'],
          charts: ['recharts'],
        }
      }
    }
  }
})
