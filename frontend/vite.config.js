import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Keep the app and its build output inside the frontend project.
export default defineConfig({
  plugins: [react()],
  root: fileURLToPath(new URL('./', import.meta.url)),
  build: {
    outDir: fileURLToPath(new URL('./dist/', import.meta.url)),
    emptyOutDir: true,
  },
})
