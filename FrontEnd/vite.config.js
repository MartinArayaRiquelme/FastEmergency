import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    // Aquí aceptamos tu link .dev y el de localtunnel
    allowedHosts: ['.loca.lt', '.ngrok-free.dev'], 
  }
}
)