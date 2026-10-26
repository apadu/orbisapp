/**
 * External map data the app needs. Each file is served from /data/<file> if it
 * exists (run `npm run fetch-maps` once to download them into public/data),
 * otherwise the app falls back to the original remote URL.
 */
export const DATA_SOURCES = {
  countries: {
    file: 'ne_50m_admin_0_countries.geojson',
    url: 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson',
  },
  marine: {
    file: 'ne_50m_geography_marine_polys.geojson',
    url: 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_geography_marine_polys.geojson',
  },
  history1920: {
    file: 'world_1920.geojson',
    url: 'https://cdn.jsdelivr.net/gh/aourednik/historical-basemaps@master/geojson/world_1920.geojson',
  },
}
