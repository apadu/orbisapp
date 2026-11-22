"""
Pre-renders the "Name all mountain ranges" globe (MountainGlobe):
  public/data/relief/base-4k.jpg, base-2k.jpg — the whole map: sea, parchment land, faint borders,
      shaded relief and a light altitude tint (plate carrée, 4096×2048 / 2048×1024)
  public/data/relief/ranges.png — 2048×1024, 8-bit: pixel value = range index (0 = none). Each range
      is the high ground inside its Natural Earth region polygon, so it follows the real mountains.
  src/data/mountainRelief.js — index and label position of every range

  python3 scripts/build-relief.py --elev=elev_bump_4k.jpg --regions=ne_10m_geography_regions_polys.geojson
  elev_bump_4k.jpg: NASA Blue Marble topography (public domain), e.g. from github.com/turban/webgl-earth
  needs: pip install pillow numpy
"""
import json, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

args = dict(a[2:].split('=', 1) for a in sys.argv[1:] if a.startswith('--'))
ELEV = args.get('elev', 'elev_bump_4k.jpg')
REGIONS = args.get('regions', 'ne_10m_geography_regions_polys.geojson')
W, H = 4096, 2048
SEA_LEVEL = 24          # the elevation image's value at sea level

# Game range → Natural Earth region names (several pieces for the long ones). Order = index.
RANGES = [
  ('Himalayas', ['HIMALAYAS']), ('Karakoram', ['KARAKORAM RA.']), ('Hindu Kush', ['HINDU KUSH']),
  ('Kunlun Mountains', ['KUNLUN MOUNTAINS']), ('Tian Shan', ['TIAN SHAN']), ('Altai Mountains', ['ALTAY MOUNTAINS']),
  ('Zagros Mountains', ['ZAGROS MOUNTAINS']), ('Alborz Mountains', ['ELBURZ MTS.']), ('Caucasus Mountains', ['CAUCASUS MTS.']),
  ('Ural Mountains', ['URAL MOUNTAINS']), ('Western Ghats', ['WESTERN GHATS', 'Southern Ghats']), ('Taurus Mountains', ['Taurus Mts.']),
  ('Pontic Mountains', ['PONTIC MOUNTAINS']), ('Verkhoyansk Range', ['VERKHOYANSK RANGE']), ('Chersky Range', ['CHERSKIY RANGE']),
  ('Stanovoy Range', ['STANOVOY RANGE']),
  ('Alps', ['ALPS']), ('Pyrenees', ['PYRENEES']), ('Carpathians', ['CARPATHIAN MOUNTAINS', 'Transylvanian Alps', 'Tatra Mts.']),
  ('Apennines', ['APPENNINI', 'Calabria']), ('Scandinavian Mountains', ['KJØLEN MOUNTAINS', 'Hardanger-vidda']),
  ('Scottish Highlands', ['Grampian Mts.']), ('Dinaric Alps', ['Dinaric Alps']), ('Balkan Mountains', ['Balkan Mts.']),
  ('Andes', ['ANDES', 'CORD. CENTRAL', 'CORD. OCCIDENTAL', 'CORDILLERA  REAL', 'CORDILLERA OCCIDENTAL', 'CORDILLERA ORIENTAL', 'Cord. de Mérida']),
  ('Rocky Mountains', ['ROCKY MOUNTAINS', 'Front Range', 'Wasatch Range', 'Bitterroot Range', 'Salmon River Mts.']),
  ('Appalachians', ['APPALACHIAN MTS.', 'Blue Ridge']), ('Sierra Nevada', ['SIERRA NEVADA']), ('Cascade Range', ['CASCADE RANGE']),
  ('Brooks Range', ['BROOKS RANGE']), ('Sierra Madre', ['SIERRA MADRE OCCIDENTAL', 'SIERRA MADRE ORIENTAL', 'Sierra Madre del Sur']),
  ('Coast Mountains', ['COAST MOUNTAINS']),
  ('Atlas Mountains', ['ATLAS MOUNTAINS', 'HAUT ATLAS', 'Moyen Atlas', 'Anti Atlas', 'ATLAS SAHARIEN', 'Atlas Tellien']),
  ('Drakensberg', ['DRAKENSBERG']), ('Ethiopian Highlands', ['ETHIOPIAN HIGHLANDS']), ('Ruwenzori Mountains', ['Ruwenzori Range']),
  ('Tibesti Mountains', ['TIBESTI MTS.']), ('Ahaggar Mountains', ['AHAGGAR MTS.']),
  ('Great Dividing Range', ['GREAT DIVIDING RANGE', 'Australian Alps']), ('Southern Alps', ['SOUTHERN ALPS']),
]

def xy(c): return ((c[0] + 180) / 360 * W, (90 - c[1]) / 180 * H)
def rings(g): return [g['coordinates']] if g['type'] == 'Polygon' else g['coordinates']
def raster(geoms, fill=255):
    im = Image.new('L', (W, H), 0); d = ImageDraw.Draw(im)
    for g in geoms:
        for p in rings(g):
            d.polygon([xy(c) for c in p[0]], fill=fill)
            for hole in p[1:]: d.polygon([xy(c) for c in hole], fill=0)
    return im

raw = Image.open(ELEV).convert('L')
assert raw.size == (W, H), raw.size
elev = np.asarray(raw.filter(ImageFilter.GaussianBlur(1.6))).astype(np.float32)

# ── Shaded relief (light from the north-west) ───────────────────────────────
z = (elev - SEA_LEVEL).clip(0)
gy, gx = np.gradient(z)
az, alt = np.radians(315), np.radians(40)
slope = np.arctan(np.hypot(gx, gy) * 0.3)
aspect = np.arctan2(-gy, gx)
hs = (np.sin(alt) * np.cos(slope) + np.cos(alt) * np.sin(slope) * np.cos(az - aspect)) / np.sin(alt)
mult = np.where(hs < 1, 0.58 + 0.42 * hs.clip(0), 1 + (hs.clip(1, 1.4) - 1) * 0.3)

# ── Base map ────────────────────────────────────────────────────────────────
countries = json.load(open('public/data/ne_50m_admin_0_countries.geojson'))['features']
land = np.asarray(raster([f['geometry'] for f in countries])) > 0
img = np.empty((H, W, 3), np.float32); img[:] = (0x86, 0xa9, 0xb8)          # sea
img[land] = (0xe9, 0xdc, 0xb9)                                               # parchment
img[land] *= mult[land][:, None]
tint = (np.clip((elev - 40) / 160, 0, 1) * 0.35)[..., None]                  # higher → browner
img = np.where(land[..., None], img * (1 - tint) + np.array((150, 110, 70)) * tint, img)
base = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8))
d = ImageDraw.Draw(base, 'RGBA')
for f in countries:
    for p in rings(f['geometry']):
        d.line([xy(c) for c in p[0]], fill=(110, 80, 45, 70), width=1)
base.save('public/data/relief/base-4k.jpg', quality=80, optimize=True, progressive=True)
base.resize((W // 2, H // 2), Image.LANCZOS).save('public/data/relief/base-2k.jpg', quality=82, optimize=True, progressive=True)

# ── Ranges: the upper half of the ground inside each region polygon ────────
regions = {}
for f in json.load(open(REGIONS))['features']:
    p = f['properties']
    if p.get('FEATURECLA') == 'Range/mtn': regions.setdefault(p['NAME'], []).append(f['geometry'])
idx = np.zeros((H, W), np.uint8)
labels = []
for i, (name, parts) in enumerate(RANGES, start=1):
    geoms = [g for n in parts for g in regions[n]]
    area = np.asarray(raster(geoms).filter(ImageFilter.MaxFilter(9))) > 0      # NE polygons are rough: grow them a bit
    lo = max(np.percentile(elev[area], 45), 30)
    sel = Image.fromarray(((area & (elev >= lo)) * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.MinFilter(3))
    sel = (np.asarray(sel) > 0) & area & (idx == 0)
    idx[sel] = i
    ys, xs = np.nonzero(sel)
    # label: the range's pixel nearest to its centre of mass
    cx, cy = xs.mean(), ys.mean()
    k = np.argmin((xs - cx) ** 2 + (ys - cy) ** 2)
    labels.append((name, i, round(xs[k] / W * 360 - 180, 2), round(90 - ys[k] / H * 180, 2)))
Image.fromarray(idx[::2, ::2]).save('public/data/relief/ranges.png', optimize=True)

with open('src/data/mountainRelief.js', 'w') as out:
    out.write('// Generated by scripts/build-relief.py — the pixel value of each range in public/data/relief/ranges.png\n')
    out.write('// and where its label goes. Do not edit by hand.\n')
    out.write('export const RANGE_INDEX = {\n')
    for name, i, lon, lat in labels: out.write(f"  {json.dumps(name)}: {{ i: {i}, lon: {lon}, lat: {lat} }},\n")
    out.write('}\n')
print('done', len(labels), 'ranges')
