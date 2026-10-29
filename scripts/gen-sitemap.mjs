// Writes public/sitemap.xml with every game / quiz page.
// Usage: SITE_URL=https://yourdomain.com npm run sitemap
import { readFile, writeFile } from 'node:fs/promises'

// Read the game list straight from gameCatalog.js (plain-text parse, so this script
// doesn't need the app's build setup): lines like  'name-all': { …, cat: 'nameall' … }
const src = await readFile(new URL('../src/utils/gameCatalog.js', import.meta.url), 'utf8')
const GAME_CATALOG = {}
for (const m of src.matchAll(/^\s*'?([a-z0-9-]+)'?\s*:\s*\{[^}]*cat:\s*'(\w+)'/gm)) GAME_CATALOG[m[1]] = { cat: m[2] }

const SITE = (process.env.SITE_URL ?? 'https://orbisapp.vercel.app').replace(/\/$/, '')
const QUIZ_CATS = new Set(['quiz'])
const paths = ['/', '/quiz', '/daily', '/privacy', '/terms', '/credits']
for (const [id, g] of Object.entries(GAME_CATALOG)) {
  if (id === 'daily-quiz') continue
  paths.push(QUIZ_CATS.has(g.cat) ? `/quiz/${id}` : `/play/${id}`)
}
paths.push('/play/learn')
const today = new Date().toISOString().slice(0, 10)
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map(p => `  <url><loc>${SITE}${p}</loc><lastmod>${today}</lastmod><changefreq>${p === '/' || p === '/daily' ? 'daily' : 'weekly'}</changefreq><priority>${p === '/' ? '1.0' : '0.6'}</priority></url>`).join('\n')}
</urlset>
`
await writeFile(new URL('../public/sitemap.xml', import.meta.url), xml)
console.log(`sitemap.xml: ${paths.length} pages for ${SITE}`)
