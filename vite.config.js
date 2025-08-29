import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
  ],
  server: {
    host: true, // allows external access (not just localhost)
    allowedHosts: ['app-dash.dawamuschicthub.info','app-api.dawamuschicthub.info'], // allow your custom domain
    port: 5173, // optional: ensures it runs on expected port
  },
})
