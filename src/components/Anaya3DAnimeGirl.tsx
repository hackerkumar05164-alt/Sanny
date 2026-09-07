import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import * as THREE from 'three';
import { ConnectionState } from '../types';

interface Anaya3DAnimeGirlProps {
  status: ConnectionState;
  inputLevel: number;
  outputLevel: number;
  onTap?: () => void;
  className?: string;
}

export const Anaya3DAnimeGirl: React.FC<Anaya3DAnimeGirlProps> = ({
  status,
  inputLevel,
  outputLevel,
  onTap,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [expression, setExpression] = useState<'happy' | 'talking' | 'listening' | 'winking' | 'excited'>('happy');

  const isSpeaking = status === 'speaking';
  const isListening = status === 'listening';
  const isConnecting = status === 'connecting';

  // Mouse / Pointer Parallax
  const pointerPos = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // State refs for Three.js animation loop without re-instantiation
  const stateRef = useRef({
    status,
    inputLevel,
    outputLevel,
    isSpeaking,
    isListening,
    isConnecting,
    blink: 0,
    isWinking: false,
    mouthOpen: 0,
    mouthShape: 0, // 0: A, 1: O, 2: E, 3: Smile
    headRotX: 0,
    headRotY: 0,
    headRotZ: 0,
    breath: 0,
    hairSway: 0,
    blushAlpha: 0.6,
  });

  useEffect(() => {
    stateRef.current.status = status;
    stateRef.current.inputLevel = inputLevel;
    stateRef.current.outputLevel = outputLevel;
    stateRef.current.isSpeaking = isSpeaking;
    stateRef.current.isListening = isListening;
    stateRef.current.isConnecting = isConnecting;
  }, [status, inputLevel, outputLevel, isSpeaking, isListening, isConnecting]);

  // Periodic Blink and Wink controller
  useEffect(() => {
    let blinkTimeout: NodeJS.Timeout;
    const triggerBlink = () => {
      stateRef.current.blink = 1.0;
      setTimeout(() => {
        stateRef.current.blink = 0.0;
      }, 150);

      const nextBlink = Math.random() * 3000 + 2500;
      blinkTimeout = setTimeout(triggerBlink, nextBlink);
    };

    blinkTimeout = setTimeout(triggerBlink, 2000);

    // Periodic wink
    const winkInterval = setInterval(() => {
      if (!stateRef.current.isSpeaking) {
        stateRef.current.isWinking = true;
        setExpression('winking');
        setTimeout(() => {
          stateRef.current.isWinking = false;
          setExpression('happy');
        }, 400);
      }
    }, 5500);

    return () => {
      clearTimeout(blinkTimeout);
      clearInterval(winkInterval);
    };
  }, []);

  // Three.js 3D Anime Scene Setup & Rendering Loop
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const width = container.clientWidth || 240;
    const height = container.clientHeight || 240;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 0, 4.8);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 2. 3D Lighting Setup (Anime Toon Glow & Rim Light)
    const ambientLight = new THREE.AmbientLight(0xffe4ed, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xff6699, 1.8);
    keyLight.position.set(2, 3, 4);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xa855f7, 1.2);
    fillLight.position.set(-2, -1, 3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xfef08a, 1.5);
    rimLight.position.set(0, 3, -3);
    scene.add(rimLight);

    // 3. 3D Hierarchical Anime Model Construction
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Head Base Group (for tilting & nodding)
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.1, 0);
    rootGroup.add(headGroup);

    // Skin Material (Porcelain Anime Glow)
    const skinMaterial = new THREE.MeshToonMaterial({
      color: 0xffe8ed,
    });

    // Face / Head Shape
    const faceGeo = new THREE.SphereGeometry(0.9, 32, 32);
    // Taper into an anime jaw
    const pos = faceGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const x = pos.getX(i);
      const z = pos.getZ(i);
      if (y < 0) {
        pos.setX(i, x * (1 + y * 0.35));
        pos.setZ(i, z * (1 + y * 0.25));
      }
    }
    faceGeo.computeVertexNormals();
    const faceMesh = new THREE.Mesh(faceGeo, skinMaterial);
    faceMesh.scale.set(1.0, 1.05, 0.95);
    headGroup.add(faceMesh);

    // Neck & Cute Top Collar
    const neckGeo = new THREE.CylinderGeometry(0.25, 0.32, 0.6, 24);
    const neckMesh = new THREE.Mesh(neckGeo, skinMaterial);
    neckMesh.position.set(0, -0.9, 0);
    headGroup.add(neckMesh);

    // Choker with glowing gem
    const chokerGeo = new THREE.TorusGeometry(0.28, 0.04, 16, 32);
    const chokerMat = new THREE.MeshStandardMaterial({ color: 0x1f0b24, roughness: 0.3 });
    const chokerMesh = new THREE.Mesh(chokerGeo, chokerMat);
    chokerMesh.rotation.x = Math.PI / 2;
    chokerMesh.position.set(0, -0.95, 0);
    headGroup.add(chokerMesh);

    const heartGemGeo = new THREE.OctahedronGeometry(0.08, 0);
    const heartGemMat = new THREE.MeshStandardMaterial({
      color: 0xff2d67,
      emissive: 0xff2d67,
      emissiveIntensity: 0.8,
      roughness: 0.1,
    });
    const heartGem = new THREE.Mesh(heartGemGeo, heartGemMat);
    heartGem.position.set(0, -0.95, 0.32);
    headGroup.add(heartGem);

    // Shoulders
    const shoulderGeo = new THREE.CylinderGeometry(0.85, 1.1, 0.5, 32, 1, false, 0, Math.PI);
    const shoulderMat = new THREE.MeshStandardMaterial({ color: 0x240e32, roughness: 0.4 });
    const shoulderMesh = new THREE.Mesh(shoulderGeo, shoulderMat);
    shoulderMesh.position.set(0, -1.25, 0);
    rootGroup.add(shoulderMesh);

    // 4. Sparkling Anime Eyes
    const createEye = (isRight: boolean) => {
      const eyeGroup = new THREE.Group();
      const xOffset = isRight ? 0.33 : -0.33;
      eyeGroup.position.set(xOffset, 0.08, 0.78);

      // Eye White (Sclera)
      const scleraGeo = new THREE.PlaneGeometry(0.32, 0.38);
      const scleraMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const sclera = new THREE.Mesh(scleraGeo, scleraMat);
      eyeGroup.add(sclera);

      // Iris & Pupil (Deep anime magenta with vibrant gradient)
      const irisGeo = new THREE.PlaneGeometry(0.24, 0.32);
      const canvasIris = document.createElement('canvas');
      canvasIris.width = 128;
      canvasIris.height = 128;
      const ctx = canvasIris.getContext('2d');
      if (ctx) {
        const grad = ctx.createRadialGradient(64, 50, 5, 64, 64, 60);
        grad.addColorStop(0, '#ff3b77');
        grad.addColorStop(0.5, '#b80c49');
        grad.addColorStop(1, '#2c0018');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(64, 64, 58, 62, 0, 0, Math.PI * 2);
        ctx.fill();

        // Pupil
        ctx.fillStyle = '#10000a';
        ctx.beginPath();
        ctx.ellipse(64, 64, 22, 28, 0, 0, Math.PI * 2);
        ctx.fill();

        // High gloss sparkles
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(46, 44, 14, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(80, 80, 8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffb3cc';
        ctx.beginPath();
        ctx.arc(52, 88, 6, 0, Math.PI * 2);
        ctx.fill();
      }
      const irisTex = new THREE.CanvasTexture(canvasIris);
      const irisMat = new THREE.MeshBasicMaterial({ map: irisTex, transparent: true });
      const iris = new THREE.Mesh(irisGeo, irisMat);
      iris.position.z = 0.01;
      eyeGroup.add(iris);

      // Eyelashes & Eyelid (for blinking)
      const lashGeo = new THREE.PlaneGeometry(0.36, 0.12);
      const lashMat = new THREE.MeshBasicMaterial({ color: 0x240217, transparent: true });
      const lash = new THREE.Mesh(lashGeo, lashMat);
      lash.position.set(0, 0.18, 0.02);
      eyeGroup.add(lash);

      // Eyelid mesh for closing
      const lidGeo = new THREE.PlaneGeometry(0.36, 0.42);
      const lidMat = new THREE.MeshToonMaterial({ color: 0xffd3e0 });
      const lid = new THREE.Mesh(lidGeo, lidMat);
      lid.position.set(0, 0.22, 0.03);
      lid.scale.y = 0; // open by default
      eyeGroup.add(lid);

      // Eyebrows
      const browGeo = new THREE.PlaneGeometry(0.3, 0.05);
      const browMat = new THREE.MeshBasicMaterial({ color: 0x8a0f44 });
      const brow = new THREE.Mesh(browGeo, browMat);
      brow.position.set(isRight ? 0.02 : -0.02, 0.32, 0.01);
      brow.rotation.z = isRight ? -0.1 : 0.1;
      eyeGroup.add(brow);

      headGroup.add(eyeGroup);
      return { eyeGroup, iris, lid, brow };
    };

    const leftEye = createEye(false);
    const rightEye = createEye(true);

    // 5. Anime Cheeks Blush & Nose
    const blushGeo = new THREE.PlaneGeometry(0.28, 0.14);
    const blushCanvas = document.createElement('canvas');
    blushCanvas.width = 64;
    blushCanvas.height = 32;
    const bCtx = blushCanvas.getContext('2d');
    if (bCtx) {
      const bGrad = bCtx.createRadialGradient(32, 16, 2, 32, 16, 28);
      bGrad.addColorStop(0, 'rgba(255, 60, 110, 0.85)');
      bGrad.addColorStop(1, 'rgba(255, 60, 110, 0)');
      bCtx.fillStyle = bGrad;
      bCtx.fillRect(0, 0, 64, 32);
    }
    const blushTex = new THREE.CanvasTexture(blushCanvas);
    const blushMat = new THREE.MeshBasicMaterial({ map: blushTex, transparent: true, opacity: 0.7 });

    const leftBlush = new THREE.Mesh(blushGeo, blushMat);
    leftBlush.position.set(-0.4, -0.15, 0.76);
    headGroup.add(leftBlush);

    const rightBlush = new THREE.Mesh(blushGeo, blushMat);
    rightBlush.position.set(0.4, -0.15, 0.76);
    headGroup.add(rightBlush);

    // Cute tiny nose
    const noseGeo = new THREE.ConeGeometry(0.035, 0.06, 16);
    const noseMat = new THREE.MeshToonMaterial({ color: 0xf49db6 });
    const nose = new THREE.Mesh(noseGeo, noseMat);
    nose.rotation.x = Math.PI / 4;
    nose.position.set(0, -0.08, 0.88);
    headGroup.add(nose);

    // 6. Reactive 3D Lip-Syncing Anime Mouth
    const mouthGroup = new THREE.Group();
    mouthGroup.position.set(0, -0.32, 0.82);
    headGroup.add(mouthGroup);

    // Outer Mouth / Lip Cavity
    const mouthShapeGeo = new THREE.PlaneGeometry(0.24, 0.2);
    const mouthCavityCanvas = document.createElement('canvas');
    mouthCavityCanvas.width = 128;
    mouthCavityCanvas.height = 128;
    const mCtx = mouthCavityCanvas.getContext('2d');
    const updateMouthTexture = (openness: number, shape: number) => {
      if (!mCtx) return;
      mCtx.clearRect(0, 0, 128, 128);

      if (openness < 0.08) {
        // Closed / Gentle Cat Smile
        mCtx.strokeStyle = '#c4194c';
        mCtx.lineWidth = 6;
        mCtx.lineCap = 'round';
        mCtx.beginPath();
        mCtx.arc(64, 45, 24, 0.2 * Math.PI, 0.8 * Math.PI, false);
        mCtx.stroke();
      } else {
        // Dynamic Open Mouth for Talking / Laughing
        mCtx.fillStyle = '#8f0d36';
        mCtx.strokeStyle = '#610522';
        mCtx.lineWidth = 4;
        mCtx.beginPath();

        const h = Math.min(50, 15 + openness * 45);
        const w = 32 + (shape === 1 ? -6 : 10);

        mCtx.moveTo(64 - w, 40);
        mCtx.quadraticCurveTo(64, 34, 64 + w, 40);
        mCtx.quadraticCurveTo(64 + w * 0.9, 40 + h, 64, 40 + h);
        mCtx.quadraticCurveTo(64 - w * 0.9, 40 + h, 64 - w, 40);
        mCtx.closePath();
        mCtx.fill();
        mCtx.stroke();

        // Upper White Teeth
        mCtx.fillStyle = '#ffffff';
        mCtx.beginPath();
        mCtx.rect(64 - w * 0.65, 39, w * 1.3, 10);
        mCtx.fill();

        // Pink Tongue
        mCtx.fillStyle = '#ff7096';
        mCtx.beginPath();
        mCtx.ellipse(64, 35 + h * 0.85, w * 0.55, h * 0.35, 0, 0, Math.PI * 2);
        mCtx.fill();
      }
      mouthTexture.needsUpdate = true;
    };

    const mouthTexture = new THREE.CanvasTexture(mouthCavityCanvas);
    const mouthMat = new THREE.MeshBasicMaterial({ map: mouthTexture, transparent: true });
    const mouthMesh = new THREE.Mesh(mouthShapeGeo, mouthMat);
    mouthGroup.add(mouthMesh);
    updateMouthTexture(0, 0);

    // 7. Anime Hair with Rich 3D Shaders & Specular Strands
    const hairMat = new THREE.MeshStandardMaterial({
      color: 0xba114e,
      roughness: 0.35,
      metalness: 0.15,
      emissive: 0x4a0020,
      emissiveIntensity: 0.25,
    });

    const hairBackGeo = new THREE.SphereGeometry(1.02, 32, 24);
    const hairBackMesh = new THREE.Mesh(hairBackGeo, hairMat);
    hairBackMesh.position.set(0, 0.05, -0.15);
    headGroup.add(hairBackMesh);

    // Twin side long anime hair tails with dynamic physics sway
    const sideHairGroupLeft = new THREE.Group();
    sideHairGroupLeft.position.set(-0.75, 0.2, 0.1);
    headGroup.add(sideHairGroupLeft);

    const sideHairGroupRight = new THREE.Group();
    sideHairGroupRight.position.set(0.75, 0.2, 0.1);
    headGroup.add(sideHairGroupRight);

    const createHairStrand = () => {
      const strandGeo = new THREE.ConeGeometry(0.22, 1.4, 16);
      strandGeo.translate(0, -0.7, 0);
      return new THREE.Mesh(strandGeo, hairMat);
    };

    const leftStrand = createHairStrand();
    leftStrand.rotation.z = 0.15;
    sideHairGroupLeft.add(leftStrand);

    const rightStrand = createHairStrand();
    rightStrand.rotation.z = -0.15;
    sideHairGroupRight.add(rightStrand);

    // Front Bangs
    const bangsGroup = new THREE.Group();
    bangsGroup.position.set(0, 0.45, 0.72);
    headGroup.add(bangsGroup);

    for (let i = -3; i <= 3; i++) {
      const bang = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.55, 12), hairMat);
      bang.position.set(i * 0.18, 0, 0);
      bang.rotation.z = -i * 0.08;
      bang.rotation.x = 0.2;
      bangsGroup.add(bang);
    }

    // Cute Golden Star Hairclip
    const clipGeo = new THREE.OctahedronGeometry(0.1, 0);
    const clipMat = new THREE.MeshStandardMaterial({
      color: 0xfde047,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.6,
      roughness: 0.2,
    });
    const clipMesh = new THREE.Mesh(clipGeo, clipMat);
    clipMesh.position.set(0.55, 0.55, 0.75);
    clipMesh.scale.set(1.2, 1.2, 0.4);
    headGroup.add(clipMesh);

    // 8. Glowing 3D Particle Halo Orbit
    const particleCount = 28;
    const particlesGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds: number[] = [];

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 1.6 + Math.sin(i * 3) * 0.2;
      particlePositions[i * 3] = Math.cos(angle) * radius;
      particlePositions[i * 3 + 1] = Math.sin(angle) * 0.35 + (Math.random() - 0.5) * 0.3;
      particlePositions[i * 3 + 2] = Math.sin(angle) * radius;
      particleSpeeds.push(0.015 + Math.random() * 0.02);
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xff66a3,
      size: 0.08,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particlesGeo, particleMat);
    rootGroup.add(particleSystem);

    // Mouse Move Parallax Handler
    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      pointerPos.current.targetX = px * 1.5;
      pointerPos.current.targetY = py * 1.2;
    };

    window.addEventListener('mousemove', handlePointerMove);

    // 9. ANIMATION LOOP (60FPS Render Engine)
    let animationFrameId: number;
    let clock = new THREE.Clock();
    let mouthTimer = 0;
    let currentMouthShape = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();
      const state = stateRef.current;

      // Pointer Smooth Lerp
      pointerPos.current.x += (pointerPos.current.targetX - pointerPos.current.x) * 0.08;
      pointerPos.current.y += (pointerPos.current.targetY - pointerPos.current.y) * 0.08;

      // --- 3D Head Rotation & Physics ---
      let targetRotX = -pointerPos.current.y * 0.3;
      let targetRotY = pointerPos.current.x * 0.4;
      let targetRotZ = -pointerPos.current.x * 0.1;

      if (state.isSpeaking) {
        // Speaking lively bobbing
        targetRotX += Math.sin(time * 8) * (0.04 + state.outputLevel * 0.1);
        targetRotY += Math.cos(time * 5) * 0.08;
        targetRotZ += Math.sin(time * 6) * 0.05;
      } else if (state.isListening) {
        // Inquisitive listening head tilt
        targetRotZ += 0.12;
        targetRotX += 0.05 + Math.sin(time * 3) * 0.02;
        targetRotY += Math.sin(time * 2) * 0.04;
      } else {
        // Natural idling gentle breathing
        targetRotX += Math.sin(time * 1.5) * 0.02;
        targetRotY += Math.cos(time * 1.2) * 0.03;
      }

      headGroup.rotation.x += (targetRotX - headGroup.rotation.x) * 0.12;
      headGroup.rotation.y += (targetRotY - headGroup.rotation.y) * 0.12;
      headGroup.rotation.z += (targetRotZ - headGroup.rotation.z) * 0.12;

      // Hair Physics Swaying
      const sway = Math.sin(time * 4) * (state.isSpeaking ? 0.2 : 0.08) + headGroup.rotation.y * 0.5;
      sideHairGroupLeft.rotation.z = 0.15 + sway * 0.4;
      sideHairGroupRight.rotation.z = -0.15 + sway * 0.4;
      sideHairGroupLeft.rotation.x = Math.cos(time * 3) * 0.1;
      sideHairGroupRight.rotation.x = Math.cos(time * 3) * 0.1;

      // --- Lip Sync Calculation & Morphing ---
      let targetMouthOpen = 0;
      if (state.isSpeaking) {
        targetMouthOpen = Math.min(1.0, Math.max(0.15, state.outputLevel * 2.8 + Math.sin(time * 14) * 0.3));
        mouthTimer += delta;
        if (mouthTimer > 0.12) {
          mouthTimer = 0;
          currentMouthShape = Math.floor(Math.random() * 4);
        }
      } else if (state.isListening && state.inputLevel > 0.1) {
        targetMouthOpen = 0.15; // slightly attentive parted lips
      } else {
        targetMouthOpen = 0;
      }

      state.mouthOpen += (targetMouthOpen - state.mouthOpen) * 0.3;
      updateMouthTexture(state.mouthOpen, currentMouthShape);

      // --- Eye Tracking & Blinking / Winking ---
      // Iris parallax
      const irisOffsetX = pointerPos.current.x * 0.03;
      const irisOffsetY = -pointerPos.current.y * 0.03;
      leftEye.iris.position.x = irisOffsetX;
      leftEye.iris.position.y = irisOffsetY;
      rightEye.iris.position.x = irisOffsetX;
      rightEye.iris.position.y = irisOffsetY;

      // Blinking scale
      const blinkVal = state.blink;
      leftEye.lid.scale.y = blinkVal;

      if (state.isWinking) {
        rightEye.lid.scale.y = 1.0; // close right eye for cute wink
      } else {
        rightEye.lid.scale.y = blinkVal;
      }

      // Eyebrow reactivity
      if (state.isSpeaking) {
        leftEye.brow.position.y = 0.34 + Math.sin(time * 6) * 0.03;
        rightEye.brow.position.y = 0.34 + Math.sin(time * 6) * 0.03;
      } else if (state.isListening) {
        leftEye.brow.position.y = 0.35;
        rightEye.brow.position.y = 0.37; // one raised eyebrow
      } else {
        leftEye.brow.position.y = 0.32;
        rightEye.brow.position.y = 0.32;
      }

      // --- Particles Orbiting Rotation ---
      particleSystem.rotation.y = time * 0.4;
      particleSystem.rotation.x = Math.sin(time * 0.3) * 0.2;

      // Glow Intensity
      heartGemMat.emissiveIntensity = state.isSpeaking ? 1.2 : 0.6 + Math.sin(time * 3) * 0.3;
      keyLight.intensity = 1.6 + (state.isSpeaking ? state.outputLevel * 1.5 : 0);

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 240;
      const h = container.clientHeight || 240;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="anaya-3d-anime-girl-container"
      onClick={onTap}
      className={`relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center cursor-pointer select-none ${className}`}
    >
      {/* 3D WebGL Canvas */}
      <canvas ref={canvasRef} className="w-full h-full object-contain relative z-10 pointer-events-auto" />

      {/* Atmospheric Aura & Heart Reactions */}
      <motion.div
        animate={{
          scale: isSpeaking ? [1, 1.15, 1] : isListening ? [1, 1.06, 1] : [1, 1.02, 1],
          opacity: isSpeaking ? [0.7, 0.95, 0.7] : [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: isSpeaking ? 1.0 : 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute inset-0 rounded-full bg-gradient-to-tr from-pink-600/30 via-rose-500/20 to-amber-400/20 blur-xl pointer-events-none -z-10"
      />
    </div>
  );
};
