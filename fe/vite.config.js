import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },

      '/ws-smarthome': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        ws: true,
      },

      // Camera ESP32-S3: 192.168.1.116:81
      '/camera-s3': {
        target: 'http://192.168.1.116:81',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/camera-s3/, ''),
      },

      // Camera ESP32-CAM AI Thinker: 192.168.1.120:81
      '/camera-thinker': {
        target: 'http://192.168.1.120:81',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/camera-thinker/, ''),
      },
    },
  },
})