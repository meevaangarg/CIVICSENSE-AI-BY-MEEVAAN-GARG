import React, { useState, useEffect } from 'react';

interface CivicPreloaderProps {
  onComplete: () => void;
}

export const CivicPreloader: React.FC<CivicPreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(12);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const steps = [
    'Connecting NCT Delhi Municipal Geo-Mesh (28.6139° N, 77.2090° E)...',
    'Syncing MCD · PWD · DJB · DPCC Dispatch Operations...',
    'Calibrating Multi-Modal Triage & Geotag Verification Engines...',
    'Ingesting 16 High-Density Municipal Hotspots Across 250 Wards...',
    'Municipal Intelligence Platform Operational · System Ready'
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setProgress(38);
      setCurrentStepIndex(1);
    }, 350);

    const timer2 = setTimeout(() => {
      setProgress(68);
      setCurrentStepIndex(2);
    }, 750);

    const timer3 = setTimeout(() => {
      setProgress(90);
      setCurrentStepIndex(3);
    }, 1150);

    const timer4 = setTimeout(() => {
      setProgress(100);
      setCurrentStepIndex(4);
    }, 1500);

    const timer5 = setTimeout(() => {
      setIsFadingOut(true);
    }, 1850);

    const timer6 = setTimeout(() => {
      onComplete();
    }, 2400);

    // Allow user to bypass immediately with Escape or Space
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        setIsFadingOut(true);
        setTimeout(onComplete, 300);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      clearTimeout(timer6);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onComplete]);

  const handleSkip = () => {
    setIsFadingOut(true);
    setTimeout(onComplete, 300);
  };

  return (
    <div 
      onClick={handleSkip}
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#070D18] text-white select-none transition-opacity duration-500 cursor-pointer overflow-hidden ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Translucent Real-World Civic Infrastructure Backdrop */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img 
          src="/assets/delhi_road_preloader.jpg" 
          alt="Ground Reality Civic Infrastructure" 
          className="w-full h-full object-cover opacity-35 scale-105 filter brightness-95 contrast-110" 
        />
        {/* Soft Dark Overlays for High Legibility and Translucent Depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#070D18]/80 via-[#070D18]/60 to-[#070D18]/85" />
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />
        {/* Radial vignette for focus */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(7,13,24,0.8)_100%)]" />
      </div>

      <div className="relative z-10 w-full max-w-md px-6 flex flex-col items-center space-y-6">
        
        {/* Emblem & Pulse Ring */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-28 h-28 rounded-full border border-blue-500/20 animate-ping opacity-30" />
          <div className="absolute w-24 h-24 rounded-full border border-slate-700/60" />
          <div className="relative w-16 h-16 rounded-2xl bg-[#0B1120]/90 backdrop-blur-md border border-slate-700/80 shadow-2xl p-2.5 flex items-center justify-center">
            <img 
              src="/assets/logo_civica.svg" 
              alt="CIVICA Emblem" 
              className="w-full h-full object-contain" 
            />
          </div>
        </div>

        {/* Title & Organization Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-mono uppercase tracking-wider text-blue-400 mb-1 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>NCT of Delhi Municipal Grid</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight font-['Space_Grotesk'] text-white drop-shadow-md">
            CIVICA
          </h1>
          <p className="text-xs text-slate-400 font-sans tracking-wide">
            Evidence-Based Civic Intelligence &amp; Municipal Dispatch
          </p>
        </div>

        {/* Telemetry Log Stream */}
        <div className="w-full bg-[#0B1120]/85 backdrop-blur-md border border-slate-800/90 rounded-xl p-3.5 space-y-2 text-[11px] font-mono shadow-2xl">
          <div className="flex items-center justify-between text-slate-500 border-b border-slate-800/80 pb-1.5 text-[10px]">
            <span>NODE: DEL-HQ-01</span>
            <span className="text-emerald-400 font-semibold">{progress}%</span>
          </div>

          <div className="h-6 flex items-center text-slate-300">
            <span className="text-blue-400 mr-2 font-bold">&gt;</span>
            <span className="truncate">{steps[currentStepIndex]}</span>
          </div>

          {/* Minimalist High-Precision Micro-Bar */}
          <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 via-sky-500 to-emerald-400 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Bottom Hint */}
        <div className="text-[10px] font-mono text-slate-400/80 tracking-wider flex items-center gap-2">
          <span>Click anywhere or press ESC to skip</span>
        </div>

      </div>
    </div>
  );
};
