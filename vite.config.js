import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/tle': {
        target: 'https://celestrak.org',
        changeOrigin: true,
        rewrite: (path) => '/NORAD/elements/gp.php?CATNR=25544&FORMAT=TLE'
      }
    }
  }
})