import * as THREE from 'three'

/**
 * Shared look for every globe: correct colour space for the painted texture,
 * a glossy ocean, and a real atmosphere (limb haze + outer glow) instead of a
 * flat translucent shell that washed all colours out.
 */

/** Call right after `new THREE.CanvasTexture(canvas)` — canvas colours are sRGB. */
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
export function addAtmosphere(scene, color = '#5fb0ff') {
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
  g.addColorStop(0.00, '#0b3a86')
  g.addColorStop(0.22, '#0f57c4')
  g.addColorStop(0.50, '#1a78ec')
  g.addColorStop(0.78, '#0f57c4')
  g.addColorStop(1.00, '#0b3a86')
  return g
}

/** Light turquoise "shallow water" ring around coastlines. */
export const SHALLOW_OUTER = 'rgba(80, 185, 255, 0.35)'
export const SHALLOW_INNER = 'rgba(130, 220, 255, 0.45)'

function hash(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) }
  return ((h >>> 0) % 1000) / 1000
}

/** Rich green with a slight per-country tone shift so neighbours read apart. */
export function landColor(name) {
  const t = hash(name)
  const hue = 128 + t * 22          // 128–150: yellow-green → emerald
  const light = 41 + ((t * 7) % 1) * 9
  return `hsl(${hue.toFixed(1)}, 62%, ${light.toFixed(1)}%)`
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
