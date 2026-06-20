import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // Exclude the Ref folder from dependency scanning
  optimizeDeps: {
    exclude: [],
    entries: ['index.html'],
  },
  server: {
    fs: {
      allow: ['.'],
      deny: ['Ref'],
    },
  },
})
