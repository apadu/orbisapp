import * as THREE from 'three'

/**
 * Shared look for every globe: correct colour space for the painted texture,
 * a glossy ocean, and a real atmosphere (limb haze + outer glow) instead of a
 * flat translucent shell that washed all colours out.
 */

/** Call right after `new THREE.CanvasTexture(canvas)` — canvas colours are sRGB. */
// Phones get a texture half as wide and tall (a quarter of the pixels) and no mipmaps:
// redrawing and re-uploading the full 4096 px texture after every answer froze the globe there.
export const SMALL_SCREEN = typeof window !== 'undefined' && !!window.matchMedia?.('(max-width: 700px), (pointer: coarse)').matches
export const TEX_SCALE = SMALL_SCREEN ? 0.5 : 1

export function prepareTexture(texture) {
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

export function globeMaterial(texture) {
  return new THREE.MeshPhongMaterial({
    map: texture,
    specular: new THREE.Color(0x3a4a66),
    shininess: 28,
  })
}

const vertex = /* glsl */`
  varying vec3 vNormal;
  varying vec3 vPos;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vPos = mv.xyz;
    gl_Position = projectionMatrix * mv;
  }
`

/** Adds limb haze (on the globe's edge) and a soft outer glow. */
export function addAtmosphere(scene, color = '#8FB8DE') {
  const glowColor = { value: new THREE.Color(color) }

  // 1. Haze hugging the limb — transparent in the middle, bright at the rim
  const haze = new THREE.ShaderMaterial({
    uniforms: { glowColor },
    vertexShader: vertex,
    fragmentShader: /* glsl */`
      uniform vec3 glowColor;
      varying vec3 vNormal;
      varying vec3 vPos;
      void main() {
        float facing = dot(vNormal, normalize(-vPos));
        float rim = pow(1.0 - clamp(facing, 0.0, 1.0), 3.0);
        gl_FragColor = vec4(glowColor, rim * 0.6);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })
  scene.add(new THREE.Mesh(new THREE.SphereGeometry(1.004, 72, 72), haze))

  // 2. Outer glow — rendered on the back faces of a larger shell, fading outwards
  const glow = new THREE.ShaderMaterial({
    uniforms: { glowColor },
    vertexShader: vertex,
    fragmentShader: /* glsl */`
      uniform vec3 glowColor;
      varying vec3 vNormal;
      varying vec3 vPos;
      void main() {
        float facing = abs(dot(vNormal, normalize(-vPos)));
        float i = pow(facing, 2.2) * 0.95;
        gl_FragColor = vec4(glowColor, i);
      }
    `,
    side: THREE.BackSide,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })
  scene.add(new THREE.Mesh(new THREE.SphereGeometry(1.12, 72, 72), glow))
}

// ── Canvas palette helpers ─────────────────────────────────────────────────

/** Ocean: deep at the poles, brighter tropical blue at the equator. */
export function oceanGradient(ctx, H) {
  const g = ctx.createLinearGradient(0, 0, 0, H)
  g.addColorStop(0.00, '#132C4A')
  g.addColorStop(0.22, '#1A3B60')
  g.addColorStop(0.50, '#22507E')
  g.addColorStop(0.78, '#1A3B60')
  g.addColorStop(1.00, '#132C4A')
  return g
}

/** Light turquoise "shallow water" ring around coastlines. */
export const SHALLOW_OUTER = 'rgba(120, 165, 210, 0.30)'
export const SHALLOW_INNER = 'rgba(160, 195, 225, 0.38)'

/**
 * One uniform land green for every country — a deeper forest tone, so guessed
 * countries (neon #5BD18B) and other highlights stand out clearly.
 */
export const LAND_COLOR = '#BFA06A'
export function landColor() {
  return LAND_COLOR
}

/** Standard lights for the globes (brighter ambient — the texture is now in proper sRGB). */
export function addLights(scene) {
  scene.add(new THREE.AmbientLight(0xffffff, 0.95))
  const sun = new THREE.DirectionalLight(0xfff2dc, 1.05)
  sun.position.set(5, 3, 5)
  scene.add(sun)
  const fill = new THREE.DirectionalLight(0x6699ff, 0.35)
  fill.position.set(-5, -2, -3)
  scene.add(fill)
}
