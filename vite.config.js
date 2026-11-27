import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// main.jsx loads the language dictionary first and only then imports ./boot (the app), so
// the browser would fetch them one after the other. Preloading boot's chunks from index.html
// lets both downloads run at the same time (modulepreload fetches, it doesn't run anything).
function preloadBoot() {
  return {
    name: 'preload-boot',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        const bundle = ctx.bundle
        if (!bundle) return html
        const boot = Object.values(bundle).find(c => c.type === 'chunk' && c.moduleIds?.some(id => id.endsWith('/src/boot.jsx')))
        if (!boot) return html
        const js = new Set(), css = new Set()
        const walk = (name) => {
          const c = bundle[name]
          if (!c || c.isEntry || js.has(name)) return   // the entry is already in the page
          js.add(name)
          c.viteMetadata?.importedCss?.forEach(f => css.add(f))
          c.imports.forEach(walk)
        }
        walk(boot.fileName)
        return [
          ...[...css].map(f => ({ tag: 'link', attrs: { rel: 'preload', as: 'style', href: '/' + f }, injectTo: 'head' })),
          ...[...js].map(f => ({ tag: 'link', attrs: { rel: 'modulepreload', crossorigin: '', href: '/' + f }, injectTo: 'head' })),
        ]
      },
    },
  }
}

export default defineConfig({
  plugins: [react(), preloadBoot()],
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
          geo: ['d3-geo', 'topojson-client'],
          react: ['react', 'react-dom'],
          supabase: ['@supabase/supabase-js'],
        },
      },
    },
    chunkSizeWarningLimit: 900,
  },
})
