import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Which deploy an error report came from (Vercel sets the commit SHA at build time)
  define: {
    __APP_VERSION__: JSON.stringify((process.env.VERCEL_GIT_COMMIT_SHA || 'local').slice(0, 7)),
  },
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
