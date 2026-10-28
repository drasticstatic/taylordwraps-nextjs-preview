import * as THREE from "three";
// Wrap-progress mask shared by every wrapped material. Progress sweeps the body from rear (-x) to nose (+x);
// the unwrapped part shows primer, the edge glows. Injected into three's own PBR shaders via onBeforeCompile,
// so lighting, environment and iridescence stay three's and only the base color changes with the mask.
export interface WrapUniforms {
  uProgress: { value: number };
  uEdge: { value: number };
  uXRange: { value: THREE.Vector2 };
  uPrimer: { value: THREE.Color };
  uEdgeGlow: { value: THREE.Color };
  uFilmB: { value: THREE.Color };
  uFilmC: { value: THREE.Color };
}
export function makeWrapUniforms(xRange: [number, number]): WrapUniforms {
  return {
    uProgress: { value: 0 },
    uEdge: { value: 0.035 },
    uXRange: { value: new THREE.Vector2(xRange[0], xRange[1]) },
    uPrimer: { value: new THREE.Color("#e9e9ee") },
    uEdgeGlow: { value: new THREE.Color("#a855f7") },
    uFilmB: { value: new THREE.Color("#ec4899") },
    uFilmC: { value: new THREE.Color("#2dd4bf") },
  };
}
const PARS = /* glsl */ `
uniform float uProgress; uniform float uEdge; uniform vec2 uXRange; uniform vec3 uPrimer; uniform vec3 uEdgeGlow; uniform vec3 uFilmB; uniform vec3 uFilmC;
varying vec3 vWrapPos;
float wrapNorm(vec3 p){ return (p.x - uXRange.x) / (uXRange.y - uXRange.x); }
float wrapMask(vec3 p){
  float x = wrapNorm(p);
  float ripple = sin(p.y * 9.0 + uProgress * 6.0) * 0.012 + sin(p.z * 7.0 - uProgress * 4.0) * 0.008;
  return smoothstep(uProgress + uEdge + ripple, uProgress - uEdge + ripple, x);
}
float wrapEdge(vec3 p){
  float x = wrapNorm(p);
  float d = (x - uProgress) / (uEdge * 1.6);
  return exp(-d * d) * step(0.002, uProgress) * step(uProgress, 0.998);
}`;

/** Patch a MeshPhysicalMaterial (or Standard) so its surface obeys the wrap mask. Returns the uniforms to drive. */
export function applyWrap(material: THREE.MeshStandardMaterial, xRange: [number, number]): WrapUniforms {
  const u = makeWrapUniforms(xRange);
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, u);
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vWrapPos;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvWrapPos = position;");
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", "#include <common>\n" + PARS)
      .replace("#include <color_fragment>", "#include <color_fragment>\nfloat wrapM = wrapMask(vWrapPos);\nfloat wx = clamp(wrapNorm(vWrapPos) + vWrapPos.y * 0.12, 0.0, 1.0);\nvec3 filmCol = wx < 0.5 ? mix(diffuseColor.rgb, uFilmB, wx * 2.0) : mix(uFilmB, uFilmC, (wx - 0.5) * 2.0);\ndiffuseColor.rgb = mix(uPrimer, filmCol, wrapM);")
      .replace("#include <roughnessmap_fragment>", "#include <roughnessmap_fragment>\nroughnessFactor = mix(0.72, roughnessFactor, wrapM);")
      .replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\ntotalEmissiveRadiance += uEdgeGlow * wrapEdge(vWrapPos) * 1.6;");
    material.userData.shader = shader;
  };
  material.customProgramCacheKey = () => "wrap-v1";
  return u;
}
