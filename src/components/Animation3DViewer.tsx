import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Animation3DData } from '../types';
import { Box, Eye, RotateCw, ZoomIn, ZoomOut, Copy, Check, X, Sparkles, Sliders, Layers } from 'lucide-react';

interface Animation3DViewerProps {
  data: Animation3DData | null;
  onClose: () => void;
  onAngleChange?: (angle: number) => void;
}

export const Animation3DViewer: React.FC<Animation3DViewerProps> = ({
  data,
  onClose,
  onAngleChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [currentAngle, setCurrentAngle] = useState(data?.angle || 45);
  const [isRotating, setIsRotating] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    if (data?.angle !== undefined) {
      setCurrentAngle(data.angle);
    }
  }, [data?.angle]);

  useEffect(() => {
    if (!containerRef.current || !data) return;

    const container = containerRef.current;
    const width = container.clientWidth || 600;
    const height = 340;

    // 1. Setup Scene, Camera, Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0a0a12);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 5, 12);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xf43f5e, 2, 50);
    pointLight1.position.set(5, 8, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x06b6d4, 2, 50);
    pointLight2.position.set(-5, -5, -5);
    scene.add(pointLight2);

    // Grid Floor
    const gridHelper = new THREE.GridHelper(20, 20, 0x3b82f6, 0x1e293b);
    gridHelper.position.y = -2.5;
    scene.add(gridHelper);

    // Main 3D Object Group
    const group = new THREE.Group();
    groupRef.current = group;
    scene.add(group);

    // Build specific 3D model archetype
    const buildModel = () => {
      // Clear previous children
      while (group.children.length > 0) {
        group.remove(group.children[0]);
      }

      const modelType = data.modelType || 'optics';

      if (modelType === 'optics') {
        // --- 3D Optics: Light Reflection & Refraction ---
        // Mirror / Glass Surface
        const mirrorGeo = new THREE.BoxGeometry(8, 0.4, 4);
        const mirrorMat = new THREE.MeshStandardMaterial({
          color: 0x38bdf8,
          metalness: 0.9,
          roughness: 0.1,
          transparent: true,
          opacity: 0.85,
        });
        const mirror = new THREE.Mesh(mirrorGeo, mirrorMat);
        mirror.position.set(0, 0, 0);
        group.add(mirror);

        // Normal Line (dashed perpendicular)
        const normalGeo = new THREE.CylinderGeometry(0.03, 0.03, 5, 16);
        const normalMat = new THREE.MeshBasicMaterial({ color: 0x94a3b8 });
        const normal = new THREE.Mesh(normalGeo, normalMat);
        normal.position.set(0, 0, 0);
        group.add(normal);

        // Calculate Ray angles
        const rad = (currentAngle * Math.PI) / 180;
        const rayLength = 4.5;

        // Incident Ray (Bright Red/Pink)
        const incidentGeo = new THREE.CylinderGeometry(0.08, 0.08, rayLength, 16);
        const incidentMat = new THREE.MeshStandardMaterial({
          color: 0xff0055,
          emissive: 0xff0055,
          emissiveIntensity: 0.8,
        });
        const incidentRay = new THREE.Mesh(incidentGeo, incidentMat);
        incidentRay.position.set(-Math.sin(rad) * (rayLength / 2), Math.cos(rad) * (rayLength / 2), 0);
        incidentRay.rotation.z = rad;
        group.add(incidentRay);

        // Reflected Ray (Emerald Green)
        const reflectedGeo = new THREE.CylinderGeometry(0.08, 0.08, rayLength, 16);
        const reflectedMat = new THREE.MeshStandardMaterial({
          color: 0x10b981,
          emissive: 0x10b981,
          emissiveIntensity: 0.8,
        });
        const reflectedRay = new THREE.Mesh(reflectedGeo, reflectedMat);
        reflectedRay.position.set(Math.sin(rad) * (rayLength / 2), Math.cos(rad) * (rayLength / 2), 0);
        reflectedRay.rotation.z = -rad;
        group.add(reflectedRay);

        // Refracted Ray (Cyan beneath mirror)
        const refrRad = Math.asin(Math.sin(rad) / (data.lightRefractionIndex || 1.5));
        const refractedGeo = new THREE.CylinderGeometry(0.07, 0.07, rayLength * 0.7, 16);
        const refractedMat = new THREE.MeshStandardMaterial({
          color: 0x06b6d4,
          emissive: 0x06b6d4,
          emissiveIntensity: 0.7,
        });
        const refractedRay = new THREE.Mesh(refractedGeo, refractedMat);
        refractedRay.position.set(Math.sin(refrRad) * (rayLength * 0.35), -Math.cos(refrRad) * (rayLength * 0.35), 0);
        refractedRay.rotation.z = Math.PI - refrRad;
        group.add(refractedRay);

        // Angle Arc Indicator
        const arcGeo = new THREE.RingGeometry(1.2, 1.25, 32, 1, Math.PI / 2 - rad, rad);
        const arcMat = new THREE.MeshBasicMaterial({ color: 0xfacc15, side: THREE.DoubleSide });
        const arcMesh = new THREE.Mesh(arcGeo, arcMat);
        group.add(arcMesh);

      } else if (modelType === 'dna') {
        // --- 3D DNA Double Helix ---
        const r = 1.8;
        const numPairs = 24;
        const pitch = 0.35;

        for (let i = -numPairs / 2; i < numPairs / 2; i++) {
          const t = i * 0.45;
          const y = i * pitch;
          const x1 = Math.cos(t) * r;
          const z1 = Math.sin(t) * r;
          const x2 = Math.cos(t + Math.PI) * r;
          const z2 = Math.sin(t + Math.PI) * r;

          // Strand 1 node
          const nodeGeo = new THREE.SphereGeometry(0.2, 16, 16);
          const nodeMat1 = new THREE.MeshStandardMaterial({ color: 0xf43f5e, emissive: 0x9f1239 });
          const n1 = new THREE.Mesh(nodeGeo, nodeMat1);
          n1.position.set(x1, y, z1);
          group.add(n1);

          // Strand 2 node
          const nodeMat2 = new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x0e7490 });
          const n2 = new THREE.Mesh(nodeGeo, nodeMat2);
          n2.position.set(x2, y, z2);
          group.add(n2);

          // Base Pair rungs
          const rungDist = Math.sqrt((x2 - x1) ** 2 + (z2 - z1) ** 2);
          const rungGeo = new THREE.CylinderGeometry(0.06, 0.06, rungDist, 8);
          const rungColor = i % 2 === 0 ? 0xfacc15 : 0xa855f7;
          const rungMat = new THREE.MeshStandardMaterial({ color: rungColor, roughness: 0.3 });
          const rung = new THREE.Mesh(rungGeo, rungMat);
          rung.position.set((x1 + x2) / 2, y, (z1 + z2) / 2);
          rung.rotation.z = Math.PI / 2;
          rung.rotation.y = -t;
          group.add(rung);
        }

      } else if (modelType === 'atom') {
        // --- 3D Bohr Atom Model ---
        // Nucleus (Protons & Neutrons clump)
        const nucleusGroup = new THREE.Group();
        for (let i = 0; i < 14; i++) {
          const sphereGeo = new THREE.SphereGeometry(0.35, 16, 16);
          const sphereMat = new THREE.MeshStandardMaterial({
            color: i % 2 === 0 ? 0xef4444 : 0x3b82f6,
            emissive: i % 2 === 0 ? 0x991b1b : 0x1d4ed8,
          });
          const p = new THREE.Mesh(sphereGeo, sphereMat);
          p.position.set(
            (Math.random() - 0.5) * 0.9,
            (Math.random() - 0.5) * 0.9,
            (Math.random() - 0.5) * 0.9
          );
          nucleusGroup.add(p);
        }
        group.add(nucleusGroup);

        // Electron Orbital Rings
        const rings = [
          { radius: 2.2, color: 0xa855f7, rotX: Math.PI / 4, rotY: 0 },
          { radius: 3.2, color: 0x06b6d4, rotX: -Math.PI / 4, rotY: Math.PI / 3 },
          { radius: 4.2, color: 0x10b981, rotX: 0, rotY: Math.PI / 2 },
        ];

        rings.forEach((ring) => {
          const ringGeo = new THREE.TorusGeometry(ring.radius, 0.03, 16, 100);
          const ringMat = new THREE.MeshBasicMaterial({ color: ring.color, transparent: true, opacity: 0.7 });
          const ringMesh = new THREE.Mesh(ringGeo, ringMat);
          ringMesh.rotation.set(ring.rotX, ring.rotY, 0);
          group.add(ringMesh);

          // Electron particle
          const eleGeo = new THREE.SphereGeometry(0.18, 16, 16);
          const eleMat = new THREE.MeshStandardMaterial({
            color: 0xfacc15,
            emissive: 0xfacc15,
            emissiveIntensity: 1,
          });
          const electron = new THREE.Mesh(eleGeo, eleMat);
          electron.position.set(ring.radius, 0, 0);
          ringMesh.add(electron);
        });

      } else if (modelType === 'solar') {
        // --- 3D Solar Planetary Orbit ---
        // Sun
        const sunGeo = new THREE.SphereGeometry(1.2, 32, 32);
        const sunMat = new THREE.MeshStandardMaterial({
          color: 0xf59e0b,
          emissive: 0xf59e0b,
          emissiveIntensity: 1.2,
        });
        const sun = new THREE.Mesh(sunGeo, sunMat);
        group.add(sun);

        const planets = [
          { dist: 2.3, size: 0.3, color: 0x38bdf8, speed: 1 },
          { dist: 3.5, size: 0.45, color: 0x10b981, speed: 0.7 },
          { dist: 4.8, size: 0.35, color: 0xf43f5e, speed: 0.5 },
        ];

        planets.forEach((p) => {
          const orbitGeo = new THREE.RingGeometry(p.dist - 0.02, p.dist + 0.02, 64);
          const orbitMat = new THREE.MeshBasicMaterial({ color: 0x475569, side: THREE.DoubleSide });
          const orbit = new THREE.Mesh(orbitGeo, orbitMat);
          orbit.rotation.x = Math.PI / 2;
          group.add(orbit);

          const plGeo = new THREE.SphereGeometry(p.size, 16, 16);
          const plMat = new THREE.MeshStandardMaterial({ color: p.color });
          const pl = new THREE.Mesh(plGeo, plMat);
          pl.position.set(p.dist, 0, 0);
          group.add(pl);
        });

      } else {
        // --- 3D Geometry / Vector ---
        const geom = new THREE.IcosahedronGeometry(2, 1);
        const mat = new THREE.MeshStandardMaterial({
          color: 0xec4899,
          wireframe: true,
          emissive: 0x831843,
        });
        const mesh = new THREE.Mesh(geom, mat);
        group.add(mesh);

        const innerGeom = new THREE.OctahedronGeometry(1.2, 0);
        const innerMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.2 });
        const innerMesh = new THREE.Mesh(innerGeom, innerMat);
        group.add(innerMesh);
      }
    };

    buildModel();

    // 3. Animation Loop
    let angleVal = 0;
    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);

      if (groupRef.current && isRotating) {
        if (data.modelType === 'dna' || data.modelType === 'atom') {
          groupRef.current.rotation.y += 0.012;
        } else if (data.modelType === 'solar') {
          groupRef.current.rotation.y += 0.008;
        } else if (data.modelType === 'geometry') {
          groupRef.current.rotation.x += 0.008;
          groupRef.current.rotation.y += 0.012;
        } else {
          // Subtle wobble for optics
          angleVal += 0.005;
          groupRef.current.rotation.y = Math.sin(angleVal) * 0.2;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth || 600;
      camera.aspect = w / height;
      camera.updateProjectionMatrix();
      renderer.setSize(w, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      renderer.dispose();
    };
  }, [data, currentAngle, isRotating]);

  // Handle angle slider
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAngle = Number(e.target.value);
    setCurrentAngle(newAngle);
    if (onAngleChange) onAngleChange(newAngle);
  };

  const handleCopyPrompt = () => {
    if (data?.promptToCopy) {
      navigator.clipboard.writeText(data.promptToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!data) return null;

  return (
    <div className="w-full max-w-2xl mx-auto my-2 rounded-2xl bg-zinc-950/95 border border-cyan-500/40 p-4 shadow-2xl backdrop-blur-2xl text-white animate-fade-in z-30">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
            <Box className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-cyan-200 tracking-wide">
                {data.title}
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-semibold uppercase rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300">
                3D Teacher • {data.subject}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              अनाया 3D एनिमेशन टीचर • Three.js WebGL
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsRotating((prev) => !prev)}
            className={`p-1.5 rounded-lg border transition-all ${
              isRotating
                ? 'bg-cyan-500/20 border-cyan-400/40 text-cyan-300'
                : 'bg-zinc-800 border-zinc-700 text-zinc-400'
            }`}
            title="Toggle 3D Rotation"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-900/80 hover:bg-rose-950/80 border border-white/10 hover:border-rose-500/40 text-zinc-400 hover:text-rose-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas Stage */}
      <div
        ref={containerRef}
        className="w-full h-[320px] rounded-xl overflow-hidden bg-black/60 border border-cyan-500/20 relative shadow-inner flex items-center justify-center"
      >
        {/* Angle Badge Overlay */}
        {data.modelType === 'optics' && (
          <div className="absolute top-3 left-3 px-3 py-1 rounded-lg bg-zinc-900/90 border border-cyan-500/30 text-xs text-cyan-300 font-mono shadow-md backdrop-blur-md">
            आपतन कोण (Angle θ): <span className="font-bold text-yellow-400">{currentAngle}°</span>
          </div>
        )}
      </div>

      {/* Interactive Controls Bar (if optics or geometry) */}
      <div className="mt-3 p-3 rounded-xl bg-zinc-900/80 border border-white/5 flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-zinc-300 font-medium">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>कोण मॉडिफायर (3D Angle Control): <strong>{currentAngle}°</strong></span>
          </div>
          <span className="text-[11px] text-zinc-400 italic">
            "कोण बदलो" बोलकर भी बदलें
          </span>
        </div>

        <input
          type="range"
          min="15"
          max="75"
          value={currentAngle}
          onChange={handleSliderChange}
          className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
        />
      </div>

      {/* Spoken Explanation text */}
      <div className="mt-3 p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs text-cyan-100 leading-relaxed">
        <div className="flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-cyan-200">अनाया का 3D स्पष्टीकरण:</p>
            <p className="text-zinc-300 mt-1">{data.explanation}</p>
          </div>
        </div>
      </div>

      {/* Copy 3D Prompt Box */}
      <div className="mt-3 flex items-center justify-between gap-3 p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-zinc-400">
        <div className="truncate flex-1">
          <span className="text-cyan-400 font-semibold">3D Prompt: </span>
          <span className="text-zinc-300">{data.promptToCopy}</span>
        </div>
        <button
          onClick={handleCopyPrompt}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-200 text-xs font-sans transition-all flex-shrink-0"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-300">कॉपी हुआ!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>प्रॉम्प्ट कॉपी करें</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
