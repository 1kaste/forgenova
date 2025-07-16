import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // This is for dev environment, to proxy websocket requests to the backend server
    proxy: {
       '/socket.io': {
        target: 'ws://localhost:3001',
        ws: true
      }
    }
  }
})
