import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/parc_it/', // This must match your repo name exactly
  build: {
    outDir: 'docs', // This tells Vite to build into /docs instead of /dist
  },
  plugins: [react()],
})
