import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Big libraries in their own long-cached chunks, so app updates don't re-download them
        manualChunks: {
          three: ['three'],
          geo: ['d3-geo', '@turf/union'],
          react: ['react', 'react-dom'],
          supabase: ['@supabase/supabase-js'],
        },
      },
    },
    chunkSizeWarningLimit: 900,
  },
})
