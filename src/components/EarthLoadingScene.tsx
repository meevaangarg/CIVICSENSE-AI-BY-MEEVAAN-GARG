import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { createEarthCanvasTexture } from '../utils/earthTexture';
import { Compass, ShieldCheck, ArrowRight, X } from 'lucide-react';

interface EarthLoadingSceneProps {
  onEnter: () => void;
  canDismiss?: boolean;
}

export const EarthLoadingScene: React.FC<EarthLoadingSceneProps> = ({ onEnter, canDismiss = true }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(15);
  const [statusText, setStatusText] = useState('CALIBRATING ORBITAL TELEMETRY...');

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setProgress(48);
      setStatusText('SYNCHRONIZING DELHI NCT WARD BOUNDARIES...');
    }, 700);

    const timer2 = setTimeout(() => {
      setProgress(86);
      setStatusText('CONNECTING MCD, PWD, DJB, DPCC MUNICIPAL GRIDS...');
    }, 1400);

    const timer3 = setTimeout(() => {
      setProgress(100);
      setStatusText('CIVIC INTELLIGENCE ONLINE');
    }, 2100);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      40,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 3, 24);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    const earthGroup = new THREE.Group();
    scene.add(earthGroup);

    const earthRadius = 7.0;
    const geometry = new THREE.SphereGeometry(earthRadius, 64, 64);
    const canvas = createEarthCanvasTexture();
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;

    const material = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.6,
      metalness: 0.3,
      emissive: new THREE.Color(0x06152d),
      emissiveIntensity: 0.4,
    });
    const earthMesh = new THREE.Mesh(geometry, material);
    earthGroup.add(earthMesh);

    // Subtle atmospheric rim shader
    const atmosphereGeometry = new THREE.SphereGeometry(earthRadius * 1.12, 64, 64);
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
          float intensity = pow(0.68 - dot(vNormal, vec3(0, 0, 1.0)), 2.4);
          gl_FragColor = vec4(0.24, 0.65, 0.98, 1.0) * intensity * 0.7;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    earthGroup.add(atmosphereMesh);

    // Initial position facing India
    earthGroup.rotation.y = -2.1;
    earthGroup.rotation.x = 0.3;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.2);
    sunLight.position.set(15, 12, 18);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.4);
    rimLight.position.set(-18, -6, -12);
    scene.add(rimLight);

    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      earthGroup.rotation.y += 0.0022;
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
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#070D18] flex flex-col justify-between p-6 md:p-12 text-slate-100 animate-fade-in">
      
      {/* Background 3D Earth Canvas */}
      <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center p-1.5">
            <img src="/assets/logo_civica.svg" alt="CIVICA" className="w-full h-full" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-['Space_Grotesk'] tracking-tight">
              CIVICA
            </h1>
            <p className="text-[10px] font-mono text-slate-400">DELHI MUNICIPAL INTELLIGENCE</p>
          </div>
        </div>

        {canDismiss && (
          <button
            onClick={onEnter}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Center Cinematic Calibration Hub */}
      <div className="relative z-10 max-w-lg mx-auto w-full text-center space-y-4 my-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-blue-950/80 border border-blue-800/80 text-blue-300">
          <Compass className="w-3.5 h-3.5 text-blue-400 animate-spin" />
          <span>FOCAL POINT: 28.6139° N, 77.2090° E (DELHI)</span>
        </div>

        <h2 className="text-3xl md:text-5xl font-bold font-['Space_Grotesk'] tracking-tight text-white leading-tight">
          Evidence-Based <br />
          <span className="text-blue-400">Municipal Action</span>
        </h2>

        <p className="text-xs md:text-sm text-slate-300 font-sans max-w-md mx-auto leading-relaxed">
          Transforming citizen reports into structured civic intelligence and automated municipal work-orders for Delhi.
        </p>

        {/* Progress Bar & Status */}
        <div className="pt-4 space-y-2 max-w-sm mx-auto">
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-mono text-slate-400">
            <span>{statusText}</span>
            <span>{progress}%</span>
          </div>
        </div>

        {/* Enter Button */}
        <div className="pt-4">
          <button
            onClick={onEnter}
            className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all shadow-xl shadow-blue-900/40 inline-flex items-center gap-2 group"
          >
            <span>Launch Workspace</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Bottom Telemetry Row */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-slate-400 border-t border-slate-800/80 pt-4">
        <div>
          <span>COVERAGE: </span>
          <span className="text-slate-200">MCD · PWD · DJB · DPCC (250 WARDS)</span>
        </div>
        <div className="flex items-center gap-4">
          <span>AIR QUALITY: <strong className="text-amber-400">AQI 348</strong></span>
          <span>·</span>
          <span>SATELLITE SYNC: <strong className="text-emerald-400">ACTIVE</strong></span>
        </div>
      </div>
    </div>
  );
};
