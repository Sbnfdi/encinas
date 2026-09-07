import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { FC } from 'react';

interface ThreeCanvasProps {
  scrollProgress: number; // 0.0 to 1.0
  reducedMotion?: boolean;
}

export const ThreeCanvas: FC<ThreeCanvasProps> = ({ scrollProgress, reducedMotion = false }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(scrollProgress);

  useEffect(() => {
    progressRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // SCENE SETUP
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070707, 0.012);

    const camera = new THREE.PerspectiveCamera(
      48,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 18, 55);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // LIGHTING
    const ambientLight = new THREE.AmbientLight(0x1a1816, 1.8);
    scene.add(ambientLight);

    const goldDirectional = new THREE.DirectionalLight(0xc5a880, 2.4);
    goldDirectional.position.set(20, 40, 30);
    scene.add(goldDirectional);

    const blueHorizonLight = new THREE.DirectionalLight(0x3a4f66, 1.2);
    blueHorizonLight.position.set(-25, 20, -20);
    scene.add(blueHorizonLight);

    // WATER / GROUND MIRROR PLANE (Arabian Gulf Reflective Surface)
    const groundGeo = new THREE.PlaneGeometry(300, 300, 32, 32);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x050505,
      roughness: 0.18,
      metalness: 0.85,
    });
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = -2;
    scene.add(groundMesh);

    // ARCHITECTURAL TOWERS (Dubai Iconic High-Rise Clusters)
    const buildingGroup = new THREE.Group();
    scene.add(buildingGroup);

    const towerMaterials = [
      new THREE.MeshStandardMaterial({
        color: 0x0d0d0e,
        roughness: 0.25,
        metalness: 0.9,
      }),
      new THREE.MeshStandardMaterial({
        color: 0x141210,
        roughness: 0.35,
        metalness: 0.75,
      }),
      new THREE.MeshStandardMaterial({
        color: 0x1a1714,
        roughness: 0.2,
        metalness: 0.95,
      }),
    ];

    const edgesMat = new THREE.LineBasicMaterial({
      color: 0xc5a880,
      transparent: true,
      opacity: 0.38,
    });

    // Generate distinctive architectural profiles (towers, terraces, spires)
    const buildingConfigs = [
      // Central iconic spire
      { x: 0, z: -15, w: 5, h: 42, d: 5, shape: 'spire' },
      { x: -9, z: -8, w: 6, h: 32, d: 7, shape: 'twist' },
      { x: 10, z: -10, w: 7, h: 36, d: 6, shape: 'box' },
      { x: -18, z: -18, w: 8, h: 26, d: 8, shape: 'box' },
      { x: 17, z: -16, w: 9, h: 28, d: 7, shape: 'terrace' },
      { x: -4, z: -2, w: 4, h: 18, d: 4, shape: 'box' },
      { x: 6, z: 2, w: 5, h: 16, d: 5, shape: 'box' },
      { x: -14, z: 5, w: 5, h: 14, d: 5, shape: 'box' },
      { x: 14, z: 8, w: 6, h: 12, d: 6, shape: 'terrace' },
      // Distant skyline
      { x: -28, z: -35, w: 8, h: 45, d: 8, shape: 'box' },
      { x: 26, z: -32, w: 7, h: 40, d: 7, shape: 'box' },
      { x: -2, z: -40, w: 10, h: 52, d: 10, shape: 'spire' },
    ];

    buildingConfigs.forEach((cfg, idx) => {
      const geo = new THREE.BoxGeometry(cfg.w, cfg.h, cfg.d);
      const mat = towerMaterials[idx % towerMaterials.length];
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(cfg.x, cfg.h / 2 - 2, cfg.z);
      buildingGroup.add(mesh);

      // Gold edge wireframes for architectural blueprint elegance
      const wireGeo = new THREE.EdgesGeometry(geo);
      const wireframe = new THREE.LineSegments(wireGeo, edgesMat);
      wireframe.position.copy(mesh.position);
      buildingGroup.add(wireframe);

      // Add architectural horizontal light bands on select levels
      if (cfg.h > 20) {
        const bandGeo = new THREE.BoxGeometry(cfg.w * 1.02, 0.4, cfg.d * 1.02);
        const bandMat = new THREE.MeshBasicMaterial({
          color: 0xdfc29b,
          transparent: true,
          opacity: 0.65,
        });
        const band1 = new THREE.Mesh(bandGeo, bandMat);
        band1.position.set(cfg.x, cfg.h * 0.7 - 2, cfg.z);
        buildingGroup.add(band1);

        const band2 = new THREE.Mesh(bandGeo, bandMat);
        band2.position.set(cfg.x, cfg.h * 0.9 - 2, cfg.z);
        buildingGroup.add(band2);
      }
    });

    // FLOATING GOLDEN ATMOSPHERIC MOTES (Dubai Desert Gold Dust)
    const particleCount = 220;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 80;
      positions[i + 1] = Math.random() * 45;
      positions[i + 2] = (Math.random() - 0.5) * 80;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xc5a880,
      size: 0.35,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // SMOOTH CAMERA SPLINE OR INTERPOLATION STATE
    let currentCamX = 0;
    let currentCamY = 18;
    let currentCamZ = 55;
    let currentLookY = 12;

    let reqId = 0;
    const startTime = performance.now();

    const animate = () => {
      reqId = requestAnimationFrame(animate);

      const elapsedTime = (performance.now() - startTime) * 0.001;
      const p = progressRef.current; // 0 to 1

      // Subtle particle float
      particleSystem.rotation.y = elapsedTime * 0.025;

      // TARGET CAMERA COORDINATES BASED ON SCROLL TIMELINE
      // 0% -> Wide skyline overview
      // 25% -> Descend & approach DAMAC Islands / waterfront residences
      // 50% -> Transition into residential canyon & community
      // 75% -> Sweeping view of architectural horizon
      // 100% -> High-altitude sovereign advisory focus
      let targetCamX = Math.sin(p * Math.PI * 1.5) * 16;
      let targetCamY = 18 - p * 7 + Math.sin(p * Math.PI) * 4;
      let targetCamZ = 55 - p * 38;
      let targetLookY = 12 - p * 4;

      if (reducedMotion) {
        targetCamX = 0;
        targetCamY = 16;
        targetCamZ = 45;
        targetLookY = 10;
      }

      // Smooth lerping
      currentCamX += (targetCamX - currentCamX) * 0.055;
      currentCamY += (targetCamY - currentCamY) * 0.055;
      currentCamZ += (targetCamZ - currentCamZ) * 0.055;
      currentLookY += (targetLookY - currentLookY) * 0.055;

      camera.position.set(currentCamX, currentCamY, currentCamZ);
      camera.lookAt(0, currentLookY, 0);

      // Subtle lighting oscillation
      goldDirectional.intensity = 2.2 + Math.sin(elapsedTime * 0.8) * 0.3;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [reducedMotion]);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.88,
      }}
      aria-hidden="true"
    />
  );
};
