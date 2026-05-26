import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    watch: {
      usePolling: true, // Requerido para garantizar Hot Reloading (HMR) dentro de volúmenes de Docker en Windows
    }
  }
})
