import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { dampValue, stepWeightedDamping } from '../lib/portfolioData';

export type SceneVisualMode = 'ORBITAL' | 'WIREFRAME' | 'COSMIC';

interface HeroScene3DProps {
  visualMode?: SceneVisualMode;
  reducedMotion: boolean;
}

// Weighted damping constants for smooth, heavy inertial follow
const POINTER_DAMPING_LAMBDA = 3.4;
const GROUP_ROTATION_DAMPING = 5.2;
const GROUP_ROTATION_STIFFNESS = 16.5;
const CAMERA_PARALLAX_DAMPING = 4.6;
const CAMERA_PARALLAX_STIFFNESS = 11.0;

// Pre-allocated scratch objects to guarantee zero GC allocations in the render loop
const _dummy = new THREE.Object3D();
const _color = new THREE.Color();
const _pos = new THREE.Vector3();
const _vel = new THREE.Vector3();
const _lookTarget = new THREE.Vector3();
const _cameraLookTarget = new THREE.Vector3();
const _pointerWorld = new THREE.Vector3();
const _toPointer = new THREE.Vector3();
const _swirlDir = new THREE.Vector3();
const _upAxis = new THREE.Vector3(0, 1, 0);

/**
 * Generates procedural cratered rocky textures (albedo + bump) for the central planet and moons.
 */
function createCrateredPlanetTextures(): {
  albedoMap: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
} {
  const size = 512;
  const albedoCanvas = document.createElement('canvas');
  albedoCanvas.width = size;
  albedoCanvas.height = size;
  const aCtx = albedoCanvas.getContext('2d');

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bCtx = bumpCanvas.getContext('2d');

  if (aCtx && bCtx) {
    // Base rocky regolith gradient (mint-tinted left to deep purple-slate right)
    const grad = aCtx.createLinearGradient(0, 0, size, size);
    grad.addColorStop(0, '#4f6e62');
    grad.addColorStop(0.45, '#2b243d');
    grad.addColorStop(1, '#1a1128');
    aCtx.fillStyle = grad;
    aCtx.fillRect(0, 0, size, size);

    bCtx.fillStyle = '#808080';
    bCtx.fillRect(0, 0, size, size);

    // Deterministic pseudo-random generator for rich crater distribution
    let seed = 1337;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    // Large dark maria basins
    for (let i = 0; i < 18; i++) {
      const x = rand() * size;
      const y = rand() * size;
      const r = 28 + rand() * 65;
      const basinGrad = aCtx.createRadialGradient(x, y, r * 0.1, x, y, r);
      basinGrad.addColorStop(0, 'rgba(18, 12, 28, 0.55)');
      basinGrad.addColorStop(1, 'rgba(18, 12, 28, 0)');
      aCtx.fillStyle = basinGrad;
      aCtx.beginPath();
      aCtx.arc(x, y, r, 0, Math.PI * 2);
      aCtx.fill();
    }

    // Multi-scale impact craters with bright ejecta rims and depressed bowls
    for (let i = 0; i < 160; i++) {
      const x = rand() * size;
      const y = rand() * size;
      const r = 4 + Math.pow(rand(), 2.2) * 34;

      // Bump map: bright rim, dark crater floor
      const bGrad = bCtx.createRadialGradient(x, y, r * 0.15, x, y, r);
      bGrad.addColorStop(0, '#262626');
      bGrad.addColorStop(0.72, '#3a3a3a');
      bGrad.addColorStop(0.88, '#dedede');
      bGrad.addColorStop(1, '#808080');
      bCtx.fillStyle = bGrad;
      bCtx.beginPath();
      bCtx.arc(x, y, r, 0, Math.PI * 2);
      bCtx.fill();

      // Albedo crater shadow & highlight rim
      const aGrad = aCtx.createRadialGradient(
        x - r * 0.18,
        y - r * 0.18,
        r * 0.1,
        x,
        y,
        r,
      );
      aGrad.addColorStop(0, 'rgba(10, 8, 18, 0.65)');
      aGrad.addColorStop(0.76, 'rgba(22, 18, 34, 0.35)');
      aGrad.addColorStop(0.9, 'rgba(185, 255, 203, 0.18)');
      aGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      aCtx.fillStyle = aGrad;
      aCtx.beginPath();
      aCtx.arc(x, y, r, 0, Math.PI * 2);
      aCtx.fill();
    }
  }

  const albedoMap = new THREE.CanvasTexture(albedoCanvas);
  albedoMap.colorSpace = THREE.SRGBColorSpace;
  albedoMap.wrapS = THREE.RepeatWrapping;
  albedoMap.wrapT = THREE.ClampToEdgeWrapping;

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.ClampToEdgeWrapping;

  return { albedoMap, bumpMap };
}

/**
 * Generates a concentric multi-banded planetary ring texture with purple, lavender, and mint-green bands.
 */
function createPlanetaryRingTexture(): THREE.CanvasTexture {
  const width = 512;
  const height = 64;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    const grad = ctx.createLinearGradient(0, 0, width, 0);
    grad.addColorStop(0.0, 'rgba(90, 50, 160, 0.0)');
    grad.addColorStop(0.07, 'rgba(139, 92, 246, 0.45)');
    grad.addColorStop(0.14, 'rgba(185, 255, 203, 0.65)');
    grad.addColorStop(0.19, 'rgba(25, 15, 45, 0.12)');
    grad.addColorStop(0.26, 'rgba(167, 139, 250, 0.85)');
    grad.addColorStop(0.36, 'rgba(124, 58, 237, 0.55)');
    grad.addColorStop(0.44, 'rgba(15, 10, 28, 0.08)');
    grad.addColorStop(0.52, 'rgba(216, 180, 254, 0.92)');
    grad.addColorStop(0.62, 'rgba(185, 255, 203, 0.72)');
    grad.addColorStop(0.71, 'rgba(109, 40, 217, 0.68)');
    grad.addColorStop(0.78, 'rgba(20, 12, 35, 0.15)');
    grad.addColorStop(0.86, 'rgba(196, 181, 253, 0.78)');
    grad.addColorStop(0.94, 'rgba(139, 92, 246, 0.35)');
    grad.addColorStop(1.0, 'rgba(90, 50, 160, 0.0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Fine concentric ring divisions
    for (let x = 24; x < width - 24; x += 6) {
      const alpha = ((x * 19) % 10) / 28;
      ctx.fillStyle =
        x % 18 === 0
          ? `rgba(5, 5, 8, ${alpha * 1.6})`
          : `rgba(255, 255, 255, ${alpha * 0.55})`;
      ctx.fillRect(x, 0, 2, height);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * Builds an articulated 3D orbital spacecraft satellite (cylindrical bus, dish antenna, twin solar wings).
 */
function createSatelliteGroup(): {
  group: THREE.Group;
  dispose: () => void;
} {
  const group = new THREE.Group();
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];

  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0xd4d4dc,
    metalness: 0.82,
    roughness: 0.28,
  });
  const darkTrimMat = new THREE.MeshStandardMaterial({
    color: 0x231d33,
    metalness: 0.7,
    roughness: 0.35,
  });
  const solarMat = new THREE.MeshStandardMaterial({
    color: 0x1e1b38,
    emissive: new THREE.Color(0x5b3fd6),
    emissiveIntensity: 0.28,
    metalness: 0.9,
    roughness: 0.18,
  });
  const frameMat = new THREE.MeshBasicMaterial({
    color: 0xb9ffcb,
    wireframe: true,
    transparent: true,
    opacity: 0.38,
  });
  materials.push(bodyMat, darkTrimMat, solarMat, frameMat);

  // Main cylindrical satellite bus
  const busGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.56, 12);
  busGeo.rotateZ(Math.PI * 0.5);
  geometries.push(busGeo);
  const busMesh = new THREE.Mesh(busGeo, bodyMat);
  group.add(busMesh);

  // Collar bands
  const collarGeo = new THREE.CylinderGeometry(0.205, 0.205, 0.12, 12);
  collarGeo.rotateZ(Math.PI * 0.5);
  geometries.push(collarGeo);
  const collarMesh = new THREE.Mesh(collarGeo, darkTrimMat);
  group.add(collarMesh);

  // Forward parabolic communication dish + receiver stalk
  const dishGeo = new THREE.SphereGeometry(
    0.26,
    16,
    12,
    0,
    Math.PI * 2,
    0,
    Math.PI * 0.42,
  );
  dishGeo.rotateX(-Math.PI * 0.5);
  geometries.push(dishGeo);
  const dishMesh = new THREE.Mesh(dishGeo, bodyMat);
  dishMesh.position.set(0, 0.16, 0.24);
  dishMesh.rotation.x = -0.35;
  group.add(dishMesh);

  const stalkGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.26, 8);
  geometries.push(stalkGeo);
  const stalkMesh = new THREE.Mesh(stalkGeo, darkTrimMat);
  stalkMesh.position.set(0, 0.28, 0.34);
  stalkMesh.rotation.x = 0.45;
  group.add(stalkMesh);

  // Twin solar array wings with cell grid overlay
  const wingGeo = new THREE.BoxGeometry(0.95, 0.32, 0.024);
  geometries.push(wingGeo);

  const leftWing = new THREE.Mesh(wingGeo, solarMat);
  leftWing.position.set(-0.68, 0, 0);
  group.add(leftWing);

  const leftGrid = new THREE.Mesh(wingGeo, frameMat);
  leftGrid.position.copy(leftWing.position);
  leftGrid.scale.setScalar(1.01);
  group.add(leftGrid);

  const rightWing = new THREE.Mesh(wingGeo, solarMat);
  rightWing.position.set(0.68, 0, 0);
  group.add(rightWing);

  const rightGrid = new THREE.Mesh(wingGeo, frameMat);
  rightGrid.position.copy(rightWing.position);
  rightGrid.scale.setScalar(1.01);
  group.add(rightGrid);

  return {
    group,
    dispose: () => {
      for (const g of geometries) g.dispose();
      for (const m of materials) m.dispose();
    },
  };
}

export const HeroScene3D: React.FC<HeroScene3DProps> = ({
  visualMode = 'ORBITAL',
  reducedMotion,
}) => {
  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const modeRef = useRef<SceneVisualMode>(visualMode);
  const reducedMotionRef = useRef<boolean>(reducedMotion);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);

  useEffect(() => {
    modeRef.current = visualMode;
  }, [visualMode]);

  useEffect(() => {
    reducedMotionRef.current = reducedMotion;
  }, [reducedMotion]);

  useEffect(() => {
    const container = canvasMountRef.current;
    if (!container) return;

    let isSoftwareGl = false;
    try {
      const probeCanvas = document.createElement('canvas');
      const gl =
        probeCanvas.getContext('webgl2') ||
        probeCanvas.getContext('webgl') ||
        probeCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
        return;
      }
      const glCtx = gl as WebGLRenderingContext;
      const ext = glCtx.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : glCtx.RENDERER;
      const gpu = String(glCtx.getParameter(param));
      glCtx.getExtension('WEBGL_lose_context')?.loseContext();
      isSoftwareGl = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    } catch {
      setWebglSupported(false);
      return;
    }

    const isTouchOrMobile = () =>
      window.innerWidth < 768 ||
      (typeof window.matchMedia === 'function' &&
        window.matchMedia('(pointer: coarse)').matches);

    const width = Math.max(240, container.clientWidth || window.innerWidth);
    const height = Math.max(240, container.clientHeight || window.innerHeight);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 120);
    camera.position.set(0, 0.25, 11.2);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl && !isTouchOrMobile(),
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglSupported(false);
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    const maxDpr =
      isSoftwareGl || isTouchOrMobile()
        ? 1
        : Math.min(window.devicePixelRatio || 1, 1.75);
    renderer.setPixelRatio(maxDpr);
    renderer.setSize(width, height);
    renderer.setClearColor(0x050505, 0);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // =========================================================================
    // DRAMATIC COSMIC LIGHTING (Mint-Green Left Key + Deep Violet Right Rim)
    // =========================================================================
    const ambientLight = new THREE.AmbientLight(0x1e1633, 1.15);
    scene.add(ambientLight);

    // Mint-green cosmic fire illumination from upper-left/behind
    const mintKeyLight = new THREE.DirectionalLight(0xb9ffcb, 3.4);
    mintKeyLight.position.set(-6.5, 4.2, 4.5);
    scene.add(mintKeyLight);

    // Rich violet illumination from right
    const purpleFillLight = new THREE.DirectionalLight(0x9333ea, 2.9);
    purpleFillLight.position.set(6.8, -1.5, 5.2);
    scene.add(purpleFillLight);

    // Intense green backlight behind the central planet
    const horizonRimLight = new THREE.PointLight(0x86efac, 6.5, 22, 1.5);
    horizonRimLight.position.set(0, -1.8, -2.5);
    scene.add(horizonRimLight);

    // =========================================================================
    // 1. REAL-TIME GLSL SHADER: STYLIZED COSMIC GREEN FLAME TONGUES & PURPLE CLOUDS
    // =========================================================================
    const backdropGeo = new THREE.PlaneGeometry(32, 16, 1, 1);
    const backdropUniforms = {
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uScrollBoost: { value: 0 },
      uAspect: { value: width / height },
    };

    const backdropMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: backdropUniforms,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;
        uniform float uTime;
        uniform vec2 uPointer;
        uniform float uScrollBoost;
        uniform float uAspect;

        float hash(vec2 p) {
          p = fract(p * vec2(123.34, 456.21));
          p += dot(p, p + 45.32);
          return fract(p.x * p.y);
        }

        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(
            mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
            mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
            u.y
          );
        }

        float fbm(vec2 p) {
          float v = 0.0;
          float a = 0.5;
          mat2 rot = mat2(0.8, -0.6, 0.6, 0.8);
          for (int i = 0; i < 5; i++) {
            v += a * noise(p);
            p = rot * p * 2.08;
            a *= 0.5;
          }
          return v;
        }

        void main() {
          vec2 uv = vUv;
          float t = uTime * (0.65 + uScrollBoost * 0.25);

          // Subtle weighted pointer parallax
          vec2 pUv = uv + uPointer * 0.022;
          float xCentered = (pUv.x - 0.5) * 2.0;
          float absX = abs(xCentered);

          // -------------------------------------------------------------------
          // A. STYLIZED RISING MINT-GREEN FLAME TONGUES (Behind Planet)
          // -------------------------------------------------------------------
          float domeEnvelope = max(0.0, 1.0 - pow(absX * 0.86, 1.55));

          // Lateral S-wave curl as flames rise
          float curlOffset = sin(pUv.y * 9.5 - t * 2.1 + pUv.x * 5.0) * 0.055 * (0.4 + pUv.y);
          vec2 flameUv = vec2((pUv.x + curlOffset) * 8.5, pUv.y * 4.5 - t * 1.35);

          float f1 = fbm(flameUv);
          float f2 = fbm(flameUv * 1.85 + vec2(4.2, -t * 0.9));
          // Ridged flame spikes for crisp, stylized fire licks
          float flameSpikes = pow(clamp(1.0 - abs(f1 * 2.0 - 1.0), 0.0, 1.0), 1.65) * 0.28 + f2 * 0.24;

          float targetFlameHeight = domeEnvelope * 0.44 + flameSpikes * domeEnvelope + uScrollBoost * 0.035;
          float flameMask = smoothstep(targetFlameHeight + 0.022, targetFlameHeight - 0.035, pUv.y);
          float innerFlameGlow = smoothstep(targetFlameHeight - 0.02, 0.0, pUv.y);

          vec3 mintCore = vec3(0.84, 1.0, 0.89);
          vec3 mintBody = vec3(0.66, 0.95, 0.78);
          vec3 mintTip  = vec3(0.32, 0.68, 0.52);
          vec3 flameColor = mix(mintTip, mintBody, flameMask);
          flameColor = mix(flameColor, mintCore, innerFlameGlow * 0.82);

          // -------------------------------------------------------------------
          // B. BILLOWING PURPLE NEBULA CLOUDS (Framing Left & Right Corners)
          // -------------------------------------------------------------------
          // Multi-lobe cloud silhouette rising up the left and right edges
          float sideRamp = smoothstep(0.24, 0.98, absX);
          float lobeWave =
            sin(pUv.x * 16.0 + t * 0.4) * 0.055 +
            cos(pUv.x * 29.0 - t * 0.3) * 0.04;
          float cloudTurb = fbm(vec2(pUv.x * 6.0, pUv.y * 4.6 - t * 0.25));

          float cloudTargetHeight = sideRamp * (0.58 + 0.16 * pow(absX, 1.35)) + lobeWave + (cloudTurb - 0.5) * 0.16;
          float cloudMask = smoothstep(
            cloudTargetHeight + 0.035,
            cloudTargetHeight - 0.055,
            pUv.y
          ) * smoothstep(0.20, 0.50, absX);

          // Volumetric inner cloud puff shading (deep indigo base to glowing lavender rim)
          float cloudRim = smoothstep(cloudTargetHeight - 0.14, cloudTargetHeight - 0.01, pUv.y);
          float internalPuffs = smoothstep(0.32, 0.76, cloudTurb);

          vec3 purpleShadow = vec3(0.18, 0.06, 0.38);
          vec3 purpleBody   = vec3(0.45, 0.19, 0.86);
          vec3 purpleHighlight = vec3(0.76, 0.60, 0.98);

          vec3 cloudColor = mix(purpleShadow, purpleBody, internalPuffs * 0.85 + 0.15);
          cloudColor = mix(cloudColor, purpleHighlight, cloudRim * 0.62);

          // Composite: Purple clouds sit in front of the outer edges of the green flames
          float combinedAlpha = clamp(flameMask * 0.96 + cloudMask * 0.98, 0.0, 1.0);
          vec3 combinedColor = mix(flameColor * flameMask, cloudColor, cloudMask);

          // Fade cleanly before the top of the plane so upper sky stays pure #050505
          float topFade = smoothstep(0.92, 0.68, uv.y);
          combinedAlpha *= topFade;

          gl_FragColor = vec4(combinedColor, combinedAlpha);
        }
      `,
    });

    const backdropMesh = new THREE.Mesh(backdropGeo, backdropMat);
    backdropMesh.position.set(0, 0.15, -3.2);
    scene.add(backdropMesh);

    // =========================================================================
    // 2. ROOT PLANETARY SYSTEM GROUP (Weighted Mouse Damping + Scroll Reactivity)
    // =========================================================================
    const rootGroup = new THREE.Group();
    rootGroup.position.set(0, -2.15, 0);
    scene.add(rootGroup);

    const { albedoMap, bumpMap } = createCrateredPlanetTextures();
    const ringMap = createPlanetaryRingTexture();

    // Central Cratered Planet
    const planetRadius = 2.35;
    const planetSegments = isTouchOrMobile() ? 48 : 72;
    const planetGeo = new THREE.SphereGeometry(
      planetRadius,
      planetSegments,
      planetSegments,
    );
    const planetMat = new THREE.MeshStandardMaterial({
      map: albedoMap,
      bumpMap: bumpMap,
      bumpScale: 0.09,
      roughness: 0.76,
      metalness: 0.16,
    });
    const centralPlanet = new THREE.Mesh(planetGeo, planetMat);
    centralPlanet.rotation.z = 0.16;
    rootGroup.add(centralPlanet);

    // Soft FrontSide Fresnel Atmosphere Glow on the Central Planet (no hard white ring)
    const haloGeo = new THREE.SphereGeometry(planetRadius * 1.008, 48, 48);
    const haloMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.FrontSide,
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vViewPosition = -mvPosition.xyz;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        precision mediump float;
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        void main() {
          vec3 normal = normalize(vNormal);
          vec3 viewDir = normalize(vViewPosition);
          float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.2);
          vec3 mintCol = vec3(0.72, 1.0, 0.80);
          vec3 violetCol = vec3(0.58, 0.32, 0.96);
          float sideMix = clamp((-normal.x + normal.y) * 0.5 + 0.5, 0.0, 1.0);
          vec3 col = mix(violetCol, mintCol, sideMix);
          gl_FragColor = vec4(col, fresnel * 0.58);
        }
      `,
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    rootGroup.add(haloMesh);

    // =========================================================================
    // 3. MULTI-BANDED PLANETARY RINGS (Radial UV-mapped RingGeometry)
    // =========================================================================
    const ringInner = 2.85;
    const ringOuter = 6.2;
    const ringGeo = new THREE.RingGeometry(
      ringInner,
      ringOuter,
      isTouchOrMobile() ? 72 : 128,
      1,
    );
    const ringPos = ringGeo.attributes.position;
    const ringUv = ringGeo.attributes.uv;
    for (let i = 0; i < ringPos.count; i++) {
      const vx = ringPos.getX(i);
      const vy = ringPos.getY(i);
      const r = Math.sqrt(vx * vx + vy * vy);
      const u = (r - ringInner) / (ringOuter - ringInner);
      ringUv.setXY(i, u, 0.5);
    }

    const ringMat = new THREE.MeshBasicMaterial({
      map: ringMap,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.94,
      depthWrite: false,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI * 0.43;
    ringMesh.rotation.y = -0.15;
    rootGroup.add(ringMesh);

    // =========================================================================
    // 4. ORBITING CRATERED MOONS (Upper-Right, Lower-Left, and Inner Moons)
    // =========================================================================
    const moonGeo = new THREE.SphereGeometry(1, 32, 32);
    const moonMat = new THREE.MeshStandardMaterial({
      map: albedoMap,
      bumpMap: bumpMap,
      bumpScale: 0.05,
      roughness: 0.82,
      metalness: 0.12,
    });

    interface MoonItem {
      mesh: THREE.Mesh;
      basePos: THREE.Vector3;
      bobSpeed: number;
      bobAmp: number;
      rotSpeed: number;
      phase: number;
    }

    const moonSpecs = [
      // Prominent upper-right cratered moon inside the green flame glow
      { pos: new THREE.Vector3(2.45, 2.55, -0.7), scale: 0.54, bobSpeed: 1.1, bobAmp: 0.11, rotSpeed: 0.35, phase: 0.4 },
      // Lower-left moon directly below the left satellite
      { pos: new THREE.Vector3(-3.35, 0.78, 0.9), scale: 0.45, bobSpeed: 0.95, bobAmp: 0.09, rotSpeed: -0.28, phase: 1.7 },
      // Mid-upper small moon near center-right
      { pos: new THREE.Vector3(1.12, 2.22, -1.1), scale: 0.19, bobSpeed: 1.45, bobAmp: 0.07, rotSpeed: 0.5, phase: 2.8 },
      // Mid-left small moon
      { pos: new THREE.Vector3(-2.15, 1.48, -0.8), scale: 0.15, bobSpeed: 1.3, bobAmp: 0.06, rotSpeed: 0.42, phase: 4.1 },
    ];

    const moons: MoonItem[] = moonSpecs.map((spec) => {
      const m = new THREE.Mesh(moonGeo, moonMat);
      m.position.copy(spec.pos);
      m.scale.setScalar(spec.scale);
      rootGroup.add(m);
      return {
        mesh: m,
        basePos: spec.pos.clone(),
        bobSpeed: spec.bobSpeed,
        bobAmp: spec.bobAmp,
        rotSpeed: spec.rotSpeed,
        phase: spec.phase,
      };
    });

    // =========================================================================
    // 5. TWO ARTICULATED 3D SATELLITES (Left & Right Orbital Flanks)
    // =========================================================================
    const satLeft = createSatelliteGroup();
    satLeft.group.position.set(-3.45, 1.48, 1.15);
    satLeft.group.scale.setScalar(0.64);
    satLeft.group.rotation.set(0.28, 0.42, -0.48);
    rootGroup.add(satLeft.group);

    const satRight = createSatelliteGroup();
    satRight.group.position.set(4.15, 0.38, 1.35);
    satRight.group.scale.setScalar(0.58);
    satRight.group.rotation.set(-0.22, -0.55, 0.52);
    rootGroup.add(satRight.group);

    // =========================================================================
    // 6. FLUID COSMIC STREAM PARTICLES & STARFIELD (Scroll + Mouse Reactive)
    // =========================================================================
    const fluidCount = isTouchOrMobile() ? 80 : 210;
    const fluidGeo = new THREE.CapsuleGeometry(0.014, 0.068, 4, 8);
    fluidGeo.rotateX(Math.PI * 0.5);

    const fluidMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.85,
    });
    const fluidInstanced = new THREE.InstancedMesh(fluidGeo, fluidMat, fluidCount);

    const fluidState = new Float32Array(fluidCount * 8);
    const palette = [0xb9ffcb, 0xa855f7, 0xf5f5f5];

    for (let i = 0; i < fluidCount; i++) {
      const idx = i * 8;
      const band = i % 3;
      const theta = (i / fluidCount) * Math.PI * 2 + band * ((Math.PI * 2) / 3);
      const baseRadius = 3.25 + (((i * 29) % 100) / 100) * 2.85;
      const speed = 0.28 + ((i * 17) % 38) / 100;
      const phase = ((i * 37) % 100) / 15.9;

      const initX = Math.cos(theta) * baseRadius;
      const initZ = Math.sin(theta) * baseRadius * 0.55;
      const initY = 0.8 + Math.sin(theta * 2 + phase) * 0.95;

      fluidState[idx + 0] = theta;
      fluidState[idx + 1] = baseRadius;
      fluidState[idx + 2] = band;
      fluidState[idx + 3] = speed;
      fluidState[idx + 4] = phase;
      fluidState[idx + 5] = initX;
      fluidState[idx + 6] = initY;
      fluidState[idx + 7] = initZ;

      _dummy.position.set(initX, initY, initZ);
      _dummy.updateMatrix();
      fluidInstanced.setMatrixAt(i, _dummy.matrix);

      _color.setHex(palette[band]);
      fluidInstanced.setColorAt(i, _color);
    }

    fluidInstanced.instanceMatrix.needsUpdate = true;
    if (fluidInstanced.instanceColor) {
      fluidInstanced.instanceColor.needsUpdate = true;
    }
    fluidInstanced.computeBoundingSphere();
    rootGroup.add(fluidInstanced);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // =========================================================================
    // SCROLL VELOCITY, WEIGHTED ROTATION INERTIA & CAMERA PARALLAX TRACKING
    // =========================================================================
    const pointerTarget = { x: 0, y: 0 };
    const pointerCurrent = { x: 0, y: 0 };
    const pointerPrev = { x: 0, y: 0 };
    const pointerVelocity = { x: 0, y: 0 };

    const groupRotVel = { x: 0, y: 0, z: 0 };
    const camPosVel = { x: 0, y: 0 };
    const camLookCurrent = { x: 0, y: 0 };

    let lastScrollY = window.scrollY || 0;
    let rawScrollVelocity = 0;
    let smoothedScrollVelocity = 0;
    let pulseImpulse = 0;

    const handlePointerMove = (e: PointerEvent) => {
      if (isTouchOrMobile()) return;
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = -(e.clientY / window.innerHeight - 0.5) * 2;
      pointerTarget.x = nx;
      pointerTarget.y = ny;
    };

    const handlePointerLeave = () => {
      pointerTarget.x = 0;
      pointerTarget.y = 0;
    };

    const handleScroll = () => {
      const currentY = window.scrollY || 0;
      const deltaY = currentY - lastScrollY;
      lastScrollY = currentY;
      rawScrollVelocity = Math.max(
        -3.5,
        Math.min(3.5, rawScrollVelocity + deltaY * 0.032),
      );
    };

    const handleWheel = (e: WheelEvent) => {
      rawScrollVelocity = Math.max(
        -3.5,
        Math.min(3.5, rawScrollVelocity + e.deltaY * 0.015),
      );
    };

    const handlePointerDown = () => {
      pulseImpulse = 1.2;
    };

    const updateSize = () => {
      if (!container) return;
      const w = Math.max(240, container.clientWidth);
      const h = Math.max(240, container.clientHeight);
      const aspect = w / h;
      camera.aspect = aspect;
      backdropUniforms.uAspect.value = aspect;

      // Adapt camera distance and planetary horizon height on narrow mobile screens
      if (aspect < 0.85) {
        camera.position.z = 13.0;
        rootGroup.position.y = -2.35;
        rootGroup.scale.setScalar(0.84);
      } else if (aspect < 1.2) {
        camera.position.z = 11.8;
        rootGroup.position.y = -2.25;
        rootGroup.scale.setScalar(0.92);
      } else {
        camera.position.z = 10.8;
        rootGroup.position.y = -2.15;
        rootGroup.scale.setScalar(1.0);
      }

      // Dynamically size backdropMesh so it spans the full camera frustum width edge-to-edge
      const distToBackdrop = camera.position.z - backdropMesh.position.z;
      const vFovRad = (camera.fov * Math.PI) / 180;
      const frustumHeight = 2 * Math.tan(vFovRad / 2) * distToBackdrop;
      const frustumWidth = frustumHeight * aspect;
      backdropMesh.scale.set(
        (frustumWidth * 1.12) / 32,
        (frustumHeight * 1.15) / 16,
        1,
      );

      camera.updateProjectionMatrix();
      renderer.setPixelRatio(
        isSoftwareGl || isTouchOrMobile()
          ? 1
          : Math.min(window.devicePixelRatio || 1, 1.75),
      );
      renderer.setSize(w, h);
    };

    updateSize();

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });
    resizeObserver.observe(container);

    let frameId = 0;
    let isDisposed = false;

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
    };

    renderer.domElement.addEventListener('webglcontextlost', handleContextLost, false);
    container.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('resize', updateSize);

    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl || typeof gl.fenceSync !== 'function') {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (isDisposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (isDisposed) return;
      const dt = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();
      const isReduced = reducedMotionRef.current;

      rawScrollVelocity = dampValue(rawScrollVelocity, 0, 5.5, dt);
      smoothedScrollVelocity = dampValue(
        smoothedScrollVelocity,
        rawScrollVelocity,
        8.0,
        dt,
      );
      pulseImpulse = dampValue(pulseImpulse, 0, 3.2, dt);

      const absScrollSpeed = Math.abs(smoothedScrollVelocity);

      if (!isTouchOrMobile()) {
        pointerPrev.x = pointerCurrent.x;
        pointerPrev.y = pointerCurrent.y;
        pointerCurrent.x = dampValue(
          pointerCurrent.x,
          pointerTarget.x,
          POINTER_DAMPING_LAMBDA,
          dt,
        );
        pointerCurrent.y = dampValue(
          pointerCurrent.y,
          pointerTarget.y,
          POINTER_DAMPING_LAMBDA,
          dt,
        );

        const invDt = dt > 0.0001 ? 1 / dt : 60;
        pointerVelocity.x = dampValue(
          pointerVelocity.x,
          (pointerCurrent.x - pointerPrev.x) * invDt * 0.35,
          6.5,
          dt,
        );
        pointerVelocity.y = dampValue(
          pointerVelocity.y,
          (pointerCurrent.y - pointerPrev.y) * invDt * 0.35,
          6.5,
          dt,
        );
      } else {
        pointerCurrent.x = 0;
        pointerCurrent.y = 0;
        pointerVelocity.x = 0;
        pointerVelocity.y = 0;
      }

      const mouseSpeed = Math.sqrt(
        pointerVelocity.x * pointerVelocity.x + pointerVelocity.y * pointerVelocity.y,
      );

      // Update GLSL Cosmic Flame & Nebula uniforms
      backdropUniforms.uTime.value = elapsed;
      backdropUniforms.uPointer.value.set(pointerCurrent.x, pointerCurrent.y);
      backdropUniforms.uScrollBoost.value = absScrollSpeed + pulseImpulse * 0.6;

      // Project normalized pointer into 3D scene coordinates for local fluid wake interaction
      _pointerWorld.set(pointerCurrent.x * 4.5, pointerCurrent.y * 2.8 + 1.5, 1.5);

      // Weighted spring-damped planetary group rotation with rotational inertia
      const targetRotY = pointerTarget.x * 0.28 + smoothedScrollVelocity * 0.08;
      const targetRotX = -pointerTarget.y * 0.16 + smoothedScrollVelocity * 0.05;
      const targetRotZ = -pointerVelocity.x * 0.06 - pointerCurrent.x * 0.04;

      const dampedRotY = stepWeightedDamping(
        rootGroup.rotation.y,
        targetRotY,
        groupRotVel.y,
        GROUP_ROTATION_DAMPING,
        GROUP_ROTATION_STIFFNESS,
        dt,
      );
      rootGroup.rotation.y = dampedRotY.value;
      groupRotVel.y = dampedRotY.velocity;

      const dampedRotX = stepWeightedDamping(
        rootGroup.rotation.x,
        targetRotX,
        groupRotVel.x,
        GROUP_ROTATION_DAMPING,
        GROUP_ROTATION_STIFFNESS,
        dt,
      );
      rootGroup.rotation.x = dampedRotX.value;
      groupRotVel.x = dampedRotX.velocity;

      const dampedRotZ = stepWeightedDamping(
        rootGroup.rotation.z,
        targetRotZ,
        groupRotVel.z,
        GROUP_ROTATION_DAMPING * 1.15,
        GROUP_ROTATION_STIFFNESS * 0.85,
        dt,
      );
      rootGroup.rotation.z = dampedRotZ.value;
      groupRotVel.z = dampedRotZ.velocity;

      // Weighted camera orbital parallax & damped focal target
      const targetCamX = -pointerTarget.x * 0.38;
      const targetCamY = 0.25 - pointerTarget.y * 0.22;

      const dampedCamX = stepWeightedDamping(
        camera.position.x,
        targetCamX,
        camPosVel.x,
        CAMERA_PARALLAX_DAMPING,
        CAMERA_PARALLAX_STIFFNESS,
        dt,
      );
      camera.position.x = dampedCamX.value;
      camPosVel.x = dampedCamX.velocity;

      const dampedCamY = stepWeightedDamping(
        camera.position.y,
        targetCamY,
        camPosVel.y,
        CAMERA_PARALLAX_DAMPING,
        CAMERA_PARALLAX_STIFFNESS,
        dt,
      );
      camera.position.y = dampedCamY.value;
      camPosVel.y = dampedCamY.velocity;

      camLookCurrent.x = dampValue(camLookCurrent.x, pointerCurrent.x * 0.2, 3.2, dt);
      camLookCurrent.y = dampValue(camLookCurrent.y, pointerCurrent.y * 0.14, 3.2, dt);
      _cameraLookTarget.set(camLookCurrent.x, camLookCurrent.y, 0);
      camera.lookAt(_cameraLookTarget);

      if (!isReduced) {
        const kineticEnergy =
          1 + absScrollSpeed * 1.55 + mouseSpeed * 0.4 + pulseImpulse * 1.6;

        // 1. Central cratered planet axial rotation & rings spin
        centralPlanet.rotation.y += dt * 0.11 * kineticEnergy;
        ringMesh.rotation.z -= dt * 0.18 * kineticEnergy;

        // 2. Orbiting Moons gentle levitation and axial spin
        for (let m = 0; m < moons.length; m++) {
          const item = moons[m];
          item.mesh.rotation.y += dt * item.rotSpeed * kineticEnergy;
          item.mesh.position.y =
            item.basePos.y +
            Math.sin(elapsed * item.bobSpeed + item.phase) * item.bobAmp;
          item.mesh.position.x =
            item.basePos.x +
            Math.cos(elapsed * (item.bobSpeed * 0.7) + item.phase) *
              (item.bobAmp * 0.6);
        }

        // 3. Left & Right 3D Satellites orbital bobbing & attitude banking
        satLeft.group.position.y = 1.48 + Math.sin(elapsed * 1.35) * 0.12;
        satLeft.group.rotation.z =
          -0.48 + Math.sin(elapsed * 0.9) * 0.08 - pointerCurrent.x * 0.12;
        satLeft.group.rotation.y = 0.42 + Math.cos(elapsed * 0.75) * 0.1;

        satRight.group.position.y = 0.25 + Math.cos(elapsed * 1.25 + 1.2) * 0.11;
        satRight.group.rotation.z =
          0.52 + Math.sin(elapsed * 0.85 + 0.8) * 0.08 - pointerCurrent.x * 0.12;
        satRight.group.rotation.y = -0.55 + Math.sin(elapsed * 0.7) * 0.1;

        // 4. Update Dynamic Fluid Curl-Stream Particles
        const flowMultiplier =
          1 + absScrollSpeed * 2.2 + mouseSpeed * 0.5 + pulseImpulse * 1.8;

        for (let i = 0; i < fluidCount; i++) {
          const idx = i * 8;
          const baseRadius = fluidState[idx + 1];
          const band = fluidState[idx + 2];
          const angularSpeed = fluidState[idx + 3];
          const phase = fluidState[idx + 4];

          const theta =
            fluidState[idx + 0] +
            dt * angularSpeed * flowMultiplier +
            smoothedScrollVelocity * dt * 0.55;
          fluidState[idx + 0] = theta;

          const bandTilt = (band - 1) * 0.22;
          const r =
            baseRadius + Math.sin(theta * 3.0 - elapsed * 1.5 + phase) * 0.22;

          const rawX = Math.cos(theta) * r;
          const rawZ = Math.sin(theta) * r * 0.55;
          const curlY =
            0.55 +
            Math.sin(theta * 2.0 + elapsed * 1.1 + phase) * 0.52 +
            rawX * bandTilt +
            smoothedScrollVelocity * Math.cos(theta + phase) * 0.22;

          _pos.set(rawX, curlY, rawZ);
          _toPointer.subVectors(_pos, _pointerWorld);
          const distSq = _toPointer.lengthSq();
          if (distSq < 4.0 && !isTouchOrMobile()) {
            const influence = Math.max(0, 1 - Math.sqrt(distSq) / 2.0);
            _swirlDir.crossVectors(_toPointer, _upAxis).normalize();
            _pos.addScaledVector(_swirlDir, influence * (0.42 + mouseSpeed * 0.25));
            _pos.x += pointerVelocity.x * influence * 0.25;
            _pos.y += pointerVelocity.y * influence * 0.25;
          }

          const prevX = fluidState[idx + 5];
          const prevY = fluidState[idx + 6];
          const prevZ = fluidState[idx + 7];

          const curX = dampValue(prevX, _pos.x, 10.5, dt);
          const curY = dampValue(prevY, _pos.y, 10.5, dt);
          const curZ = dampValue(prevZ, _pos.z, 10.5, dt);

          fluidState[idx + 5] = curX;
          fluidState[idx + 6] = curY;
          fluidState[idx + 7] = curZ;

          _vel.set(curX - prevX, curY - prevY, curZ - prevZ);
          const frameSpeed = _vel.length() / Math.max(dt, 0.004);

          _dummy.position.set(curX, curY, curZ);

          if (_vel.lengthSq() > 0.000001) {
            _lookTarget.set(curX + _vel.x, curY + _vel.y, curZ + _vel.z);
            _dummy.lookAt(_lookTarget);
          }

          const thickness = 0.65 + 0.25 * Math.sin(elapsed * 2.4 + phase);
          const streakStretch = Math.min(
            3.5,
            0.85 + frameSpeed * 0.5 + absScrollSpeed * 0.8 + mouseSpeed * 0.3,
          );
          _dummy.scale.set(thickness, thickness, streakStretch);
          _dummy.updateMatrix();
          fluidInstanced.setMatrixAt(i, _dummy.matrix);
        }
        fluidInstanced.instanceMatrix.needsUpdate = true;
      }

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    return () => {
      isDisposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      container.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', updateSize);

      backdropGeo.dispose();
      backdropMat.dispose();
      planetGeo.dispose();
      planetMat.dispose();
      haloGeo.dispose();
      haloMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      moonGeo.dispose();
      moonMat.dispose();
      satLeft.dispose();
      satRight.dispose();
      fluidGeo.dispose();
      fluidMat.dispose();
      albedoMap.dispose();
      bumpMap.dispose();
      ringMap.dispose();
      renderer.dispose();
    };
  }, []);

  if (!webglSupported) {
    return (
      <div
        data-testid="hero-3d-fallback"
        className="w-full h-full flex items-center justify-center p-4"
      >
        <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full border border-white/12 flex items-center justify-center relative">
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border border-[#B9FFCB]/30" />
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#8B5CF6]/15 border border-[#8B5CF6]/40" />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={canvasMountRef}
      data-testid="hero-3d-canvas"
      data-damping-mode="weighted-inertial"
      aria-label="Interactive 3D cosmic horizon with cratered planet, rings, satellites, and rising green nebula flames"
      className="w-full h-full min-w-0 max-w-full relative overflow-hidden cursor-grab active:cursor-grabbing"
    />
  );
};
