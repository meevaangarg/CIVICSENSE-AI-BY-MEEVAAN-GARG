import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { createEarthCanvasTexture } from '../utils/earthTexture';
import { Compass, Eye, ShieldAlert, Sparkles, Activity, Layers } from 'lucide-react';

interface EarthSceneProps {
  onEnterWorkspace: () => void;
}

export const EarthScene: React.FC<EarthSceneProps> = ({ onEnterWorkspace }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState(true);
  const isRotatingRef = useRef(true);
  const controlsRef = useRef<{
    focusDelhi: () => void;
    resetView: () => void;
  } | null>(null);

  useEffect(() => {
    isRotatingRef.current = isRotating;
  }, [isRotating]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 5, 26);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Group for earth and markers
    const earthGroup = new THREE.Group();
    scene.add(earthGroup);

    // Earth Sphere Geometry & Canvas Texture
    const earthRadius = 7.5;
    const geometry = new THREE.SphereGeometry(earthRadius, 64, 64);
    const canvas = createEarthCanvasTexture();
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;

    const material = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.65,
      metalness: 0.25,
      emissive: new THREE.Color(0x051224),
      emissiveIntensity: 0.35,
    });
    const earthMesh = new THREE.Mesh(geometry, material);
    earthGroup.add(earthMesh);

    // Atmospheric Glow Halo
    const atmosphereGeometry = new THREE.SphereGeometry(earthRadius * 1.15, 64, 64);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.65 - dot(vNormal, vec3(0, 0, 1.0)), 2.2);
          gl_FragColor = vec4(0.22, 0.65, 0.98, 1.0) * intensity * 0.75;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    earthGroup.add(atmosphereMesh);

    // Delhi Pin Calculations (Lat 28.6139° N, Lon 77.2090° E)
    const lat = 28.6139;
    const lon = 77.2090;
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);

    const delhiX = -(earthRadius * Math.sin(phi) * Math.cos(theta));
    const delhiY = earthRadius * Math.cos(phi);
    const delhiZ = earthRadius * Math.sin(phi) * Math.sin(theta);

    // Delhi Pin Marker Group
    const pinGroup = new THREE.Group();
    pinGroup.position.set(delhiX, delhiY, delhiZ);

    // Orient marker outward from Earth center
    const normal = new THREE.Vector3(delhiX, delhiY, delhiZ).normalize();
    pinGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);

    // Beacon Stem
    const stemGeom = new THREE.CylinderGeometry(0.04, 0.04, 1.4, 16);
    const stemMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const stemMesh = new THREE.Mesh(stemGeom, stemMat);
    stemMesh.position.y = 0.7;
    pinGroup.add(stemMesh);

    // Glowing Node Top
    const nodeGeom = new THREE.SphereGeometry(0.22, 16, 16);
    const nodeMat = new THREE.MeshBasicMaterial({ color: 0xff3b30 });
    const nodeMesh = new THREE.Mesh(nodeGeom, nodeMat);
    nodeMesh.position.y = 1.4;
    pinGroup.add(nodeMesh);

    // Pulsing Ring at surface
    const ringGeom = new THREE.RingGeometry(0.3, 0.5, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xef4444,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
    });
    const ringMesh = new THREE.Mesh(ringGeom, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = 0.05;
    pinGroup.add(ringMesh);

    earthGroup.add(pinGroup);

    // Initial orientation: Rotate Earth so Indian Subcontinent faces viewer
    earthGroup.rotation.y = -2.1;
    earthGroup.rotation.x = 0.35;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight.position.set(15, 10, 20);
    scene.add(dirLight);

    const backRimLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    backRimLight.position.set(-20, -5, -15);
    scene.add(backRimLight);

    // Drag to Rotate interaction
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      earthGroup.rotation.y += deltaX * 0.005;
      earthGroup.rotation.x += deltaY * 0.005;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Control callbacks
    controlsRef.current = {
      focusDelhi: () => {
        earthGroup.rotation.set(0.35, -2.1, 0);
        camera.position.set(0, 4, 22);
      },
      resetView: () => {
        earthGroup.rotation.set(0.2, 0, 0);
        camera.position.set(0, 5, 26);
      },
    };

    // Animation Loop
    let animationId: number;
    let ringScale = 1;
    let ringGrowing = true;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      if (isRotatingRef.current && !isDragging) {
        earthGroup.rotation.y += 0.0018;
      }

      // Animate pulsing ring
      if (ringGrowing) {
        ringScale += 0.015;
        if (ringScale > 1.8) ringGrowing = false;
      } else {
        ringScale -= 0.015;
        if (ringScale < 0.9) ringGrowing = true;
      }
      ringMesh.scale.set(ringScale, ringScale, 1);
      ringMat.opacity = Math.max(0.1, 1 - (ringScale - 0.9) / 0.9);

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
      cancelAnimationFrame(animationId);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[640px] md:h-[720px] lg:h-[780px] bg-[#070D18] overflow-hidden rounded-2xl border border-slate-800 shadow-2xl flex flex-col justify-between">
      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="absolute inset-0 cursor-grab active:cursor-grabbing z-0" />

      {/* Top Telemetry HUD Overlay */}
      <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 pointer-events-none">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-red-950/80 text-red-400 border border-red-800/80">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping mr-2" />
              LIVE TELEMETRY
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-slate-800/90 text-slate-300 border border-slate-700">
              NATIONAL CAPITAL TERRITORY (DELHI)
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white font-['Space_Grotesk']">
            CIVICA <span className="text-blue-500 font-light">GLOBAL PERSPECTIVE</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-xl mt-1">
            28.6139° N, 77.2090° E · 250 Municipal Wards under automated surveillance and evidence triage.
          </p>
        </div>

        {/* Real-time Status Card */}
        <div className="bg-slate-900/85 backdrop-blur-md border border-slate-700/80 p-4 rounded-xl text-xs font-mono space-y-2 pointer-events-auto shadow-xl">
          <div className="flex items-center justify-between gap-6 text-slate-300">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Compass className="w-3.5 h-3.5 text-blue-400" /> DELHI PIN
            </span>
            <span className="text-slate-100 font-semibold">28.6139° N, 77.2090° E</span>
          </div>
          <div className="flex items-center justify-between gap-6 text-slate-300">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Activity className="w-3.5 h-3.5 text-amber-400" /> AIR QUALITY (AQI)
            </span>
            <span className="text-amber-400 font-semibold">348 (VERY POOR)</span>
          </div>
          <div className="flex items-center justify-between gap-6 text-slate-300">
            <span className="flex items-center gap-1.5 text-slate-400">
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" /> ACTIVE CLUSTERS
            </span>
            <span className="text-red-400 font-semibold">18 HOTSPOTS</span>
          </div>
          <div className="pt-1 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between">
            <span>MCD · PWD · DJB · DPCC</span>
            <span className="text-emerald-400">ONLINE</span>
          </div>
        </div>
      </div>

      {/* Bottom Floating Control Bar */}
      <div className="relative z-10 p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 pointer-events-none">
        {/* Interaction hints & camera control buttons */}
        <div className="flex flex-wrap items-center gap-2 pointer-events-auto">
          <button
            onClick={() => controlsRef.current?.focusDelhi()}
            className="px-3.5 py-2 text-xs font-medium rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-lg flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" /> Focus Delhi Pin
          </button>
          <button
            onClick={() => setIsRotating(!isRotating)}
            className="px-3.5 py-2 text-xs font-medium rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5 text-blue-400" />
            {isRotating ? 'Pause Rotation' : 'Auto Rotate'}
          </button>
          <button
            onClick={() => controlsRef.current?.resetView()}
            className="px-3.5 py-2 text-xs font-medium rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
          >
            Reset Camera
          </button>
          <span className="text-[11px] text-slate-400 ml-2 hidden lg:inline">
            Drag with mouse to rotate globe · Scroll to zoom
          </span>
        </div>

        {/* Action Button to Enter Civic Redressal Workspace */}
        <div className="pointer-events-auto">
          <button
            onClick={onEnterWorkspace}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-medium text-sm transition-all shadow-xl shadow-blue-900/30 flex items-center gap-2 group"
          >
            <span>Open Civic Intelligence Workspace</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};
