import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // GitHub Pages serves project sites under /<repo-name>/, not the domain
  // root — asset URLs in the build need this prefix to resolve there.
  base: '/Adeen_Obscura/',
  plugins: [react()],
})
