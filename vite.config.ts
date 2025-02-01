
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    allowedHosts: ['14f15de0-238e-4ae1-a18c-9b8f629b5d6a-00-bpqt3ob2hp4o.picard.replit.dev']
  }
})
