import { useState, useEffect } from 'react';
import { INITIAL_INCIDENTS } from './data/civicData';
import type { CivicIncident } from './data/civicData';
import { EarthScene } from './components/EarthScene';
import { ProblemTracks } from './components/ProblemTracks';
import { AdminCommandCenter } from './components/AdminCommandCenter';
import { ResolutionStudio } from './components/ResolutionStudio';
import { CitizenReportModal } from './components/CitizenReportModal';
import { IncidentDetailModal } from './components/IncidentDetailModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import { 
  Globe2, 
  ListFilter, 
  LayoutDashboard, 
  ShieldCheck, 
  PlusCircle, 
  Sun, 
  Moon, 
  Key, 
  Radio
} from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'earth' | 'tracks' | 'command' | 'verify'>('earth');
  const [incidents, setIncidents] = useState<CivicIncident[]>(INITIAL_INCIDENTS);
  const [selectedIncident, setSelectedIncident] = useState<CivicIncident | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isDark, setIsDark] = useState<boolean>(() => {
    return document.documentElement.classList.contains('dark');
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('civica:theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('civica:theme', 'light');
    }
  }, [isDark]);

  const handleAddIncident = (newIncident: CivicIncident) => {
    setIncidents(prev => [newIncident, ...prev]);
    setActiveTab('tracks');
  };

  const handleDispatch = (id: string) => {
    setIncidents(prev =>
      prev.map(i => (i.id === id ? { ...i, status: 'Dispatched' as const } : i))
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#070D18] text-slate-900 dark:text-slate-100 flex flex-col justify-between font-sans selection:bg-blue-600/20 selection:text-blue-700 dark:selection:text-blue-300">
      
      {/* Top Global Status Banner */}
      <div className="bg-slate-900 text-slate-300 border-b border-slate-800 text-[11px] font-mono px-4 py-1.5 flex items-center justify-between overflow-x-auto">
        <div className="flex items-center gap-3 shrink-0">
          <span className="flex items-center gap-1.5 text-red-400">
            <Radio className="w-3 h-3 text-red-500 animate-pulse" />
            LIVE CIVIC SURVEILLANCE
          </span>
          <span className="text-slate-500">|</span>
          <span>NCT DELHI: 250 WARDS ONLINE</span>
          <span className="text-slate-500">|</span>
          <span className="text-amber-400">AQI: 348 (STAGE 3 GRAP)</span>
        </div>

        <div className="flex items-center gap-3 shrink-0 pl-4">
          <span className="text-slate-400">ROUTING STATUS:</span>
          <span className="text-emerald-400">MCD · PWD · DJB · DPCC CONNECTED</span>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#0B1120]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 px-4 lg:px-8 py-3.5 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand Logo & Title */}
          <div 
            onClick={() => setActiveTab('earth')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-[#0B1120] border border-slate-700 flex items-center justify-center p-1.5 shadow-sm group-hover:border-blue-500 transition-colors">
              <img src="/assets/logo_civica.svg" alt="CIVICA" className="w-full h-full" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg md:text-xl tracking-tight text-slate-900 dark:text-white font-['Space_Grotesk']">
                  CIVICA
                </span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  v2.0
                </span>
              </div>
              <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 hidden sm:block uppercase tracking-wider">
                Delhi Municipal Intelligence &amp; Triage
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-900/80 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono">
            <button
              onClick={() => setActiveTab('earth')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'earth'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Globe2 className="w-3.5 h-3.5" /> 3D Earth
            </button>
            <button
              onClick={() => setActiveTab('tracks')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'tracks'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" /> Problem Tracks
            </button>
            <button
              onClick={() => setActiveTab('command')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'command'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" /> Command Center
            </button>
            <button
              onClick={() => setActiveTab('verify')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'verify'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Fix Validator
            </button>
          </nav>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Snap &amp; Speak</span>
            </button>

            <button
              onClick={() => setIsApiKeyModalOpen(true)}
              title="Configure Gemini API Key"
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <Key className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsDark(!isDark)}
              title="Toggle Theme"
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden items-center justify-around pt-3 mt-3 border-t border-slate-200 dark:border-slate-800 text-xs font-mono">
          <button
            onClick={() => setActiveTab('earth')}
            className={`py-1 ${activeTab === 'earth' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500'}`}
          >
            3D Earth
          </button>
          <button
            onClick={() => setActiveTab('tracks')}
            className={`py-1 ${activeTab === 'tracks' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500'}`}
          >
            Tracks
          </button>
          <button
            onClick={() => setActiveTab('command')}
            className={`py-1 ${activeTab === 'command' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500'}`}
          >
            Command
          </button>
          <button
            onClick={() => setActiveTab('verify')}
            className={`py-1 ${activeTab === 'verify' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500'}`}
          >
            Verify
          </button>
        </div>
      </header>

      {/* Main Page Body */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6 flex-1 w-full">
        {activeTab === 'earth' && (
          <div className="space-y-6 animate-fade-in">
            <EarthScene onEnterWorkspace={() => setActiveTab('tracks')} />

            {/* Below Hero Highlights (Wadhwani AI Style Preview) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div 
                onClick={() => setActiveTab('tracks')}
                className="p-5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition-all cursor-pointer shadow-sm group"
              >
                <div className="text-[11px] font-mono text-blue-500 font-semibold mb-1">
                  01 / PROBLEM TRACKS
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-500 font-['Space_Grotesk']">
                  Municipal Incident Catalog
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Browse categorized Delhi challenges across Solid Waste, Arterial Roads, Water Main bursts, and AQI Hotspots.
                </p>
              </div>

              <div 
                onClick={() => setActiveTab('command')}
                className="p-5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition-all cursor-pointer shadow-sm group"
              >
                <div className="text-[11px] font-mono text-amber-500 font-semibold mb-1">
                  02 / SPATIAL INTELLIGENCE
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-amber-500 font-['Space_Grotesk']">
                  Ward Cluster &amp; SLA Dispatch
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Automatically consolidate duplicate complaints within 150m and route to MCD, PWD, DJB, or DPCC.
                </p>
              </div>

              <div 
                onClick={() => setActiveTab('verify')}
                className="p-5 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer shadow-sm group"
              >
                <div className="text-[11px] font-mono text-emerald-500 font-semibold mb-1">
                  03 / VISUAL AUDIT
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 font-['Space_Grotesk']">
                  Fake-Fix Anti-Fraud Buster
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                  Compare pre-repair and contractor completion photos using Gemini computer vision to prevent fraudulent payouts.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tracks' && (
          <div className="animate-fade-in">
            <ProblemTracks
              incidents={incidents}
              onSelectIncident={(inc) => setSelectedIncident(inc)}
              onOpenReport={() => setIsReportModalOpen(true)}
            />
          </div>
        )}

        {activeTab === 'command' && (
          <div className="animate-fade-in">
            <AdminCommandCenter
              incidents={incidents}
              onSelectIncident={(inc) => setSelectedIncident(inc)}
              onDispatchIncident={handleDispatch}
            />
          </div>
        )}

        {activeTab === 'verify' && (
          <div className="animate-fade-in">
            <ResolutionStudio incidents={incidents} />
          </div>
        )}
      </main>

      {/* Global Modals */}
      <CitizenReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmitIncident={handleAddIncident}
      />

      <IncidentDetailModal
        incident={selectedIncident}
        onClose={() => setSelectedIncident(null)}
        onDispatch={handleDispatch}
      />

      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#070D18] py-8 text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/assets/logo_civica.svg" alt="CIVICA" className="w-5 h-5" />
            <span className="font-bold text-slate-800 dark:text-slate-200 font-['Space_Grotesk']">
              CIVICA
            </span>
            <span>· Evidence-Based Municipal Intelligence for Delhi</span>
          </div>

          <div className="flex items-center gap-4">
            <span>Author: <strong>Meevaan Garg</strong></span>
            <span>·</span>
            <a
              href="https://github.com/TECHSCHOLAR777/CIVICSENSE-AI-BY-MEEVAAN-GARG"
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 hover:underline flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
