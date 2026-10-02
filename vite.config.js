import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

// Resolve from this file so deployment working-directory changes cannot move
// the frontend root or the output expected by Vercel.
export default defineConfig({
  root: fileURLToPath(new URL('./frontend/', import.meta.url)),
  build: {
    outDir: fileURLToPath(new URL('./dist/', import.meta.url)),
    emptyOutDir: true,
  },
})
