import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/PARC_IT/',
  build: {
    outDir: 'docs',
  },
  plugins: [react()],
})
