import { useState, useEffect } from 'react';
import { INITIAL_INCIDENTS } from './data/civicData';
import type { CivicIncident } from './data/civicData';
import { ProblemTracks } from './components/ProblemTracks';
import { AdminCommandCenter } from './components/AdminCommandCenter';
import { ResolutionStudio } from './components/ResolutionStudio';
import { CitizenReportModal } from './components/CitizenReportModal';
import { IncidentDetailModal } from './components/IncidentDetailModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import { 
  ListFilter, 
  Map, 
  ShieldCheck, 
  Plus, 
  Sun, 
  Moon, 
  Key
} from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'command' | 'tracks' | 'verify'>('command');
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
    <div className="min-h-screen bg-[#F4F7FC] dark:bg-[#070D18] text-slate-900 dark:text-slate-100 flex flex-col justify-between font-sans selection:bg-blue-600/20 selection:text-blue-700 dark:selection:text-blue-300">
      
      {/* Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0B1120]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 lg:px-8 py-3 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo */}
          <div 
            onClick={() => setActiveTab('command')}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-[#0B1120] border border-slate-700 flex items-center justify-center p-1">
              <img src="/assets/logo_civica.svg" alt="CIVICA" className="w-full h-full" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white font-['Space_Grotesk']">
                CIVICA
              </span>
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                Delhi
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('command')}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                activeTab === 'command'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-medium shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Map</span>
            </button>
            <button
              onClick={() => setActiveTab('tracks')}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                activeTab === 'tracks'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-medium shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>Issues</span>
            </button>
            <button
              onClick={() => setActiveTab('verify')}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                activeTab === 'verify'
                  ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-medium shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Audit</span>
            </button>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-sm transition-all flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Report</span>
            </button>

            <button
              onClick={() => setIsApiKeyModalOpen(true)}
              title="API Key"
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700"
            >
              <Key className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsDark(!isDark)}
              title="Toggle Theme"
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-700"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6 flex-1 w-full">
        {activeTab === 'command' && (
          <AdminCommandCenter
            incidents={incidents}
            selectedIncident={selectedIncident}
            onSelectIncident={(inc) => setSelectedIncident(inc)}
            onDispatchIncident={handleDispatch}
            isDark={isDark}
          />
        )}

        {activeTab === 'tracks' && (
          <ProblemTracks
            incidents={incidents}
            onSelectIncident={(inc) => setSelectedIncident(inc)}
            onOpenReport={() => setIsReportModalOpen(true)}
          />
        )}

        {activeTab === 'verify' && (
          <ResolutionStudio incidents={incidents} />
        )}
      </main>

      {/* Modals */}
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
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070D18] py-4 text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200 font-['Space_Grotesk']">
              CIVICA
            </span>
            <span>· Delhi Civic Solutions</span>
          </div>

          <div className="flex items-center gap-3">
            <span>Meevaan Garg</span>
            <span>·</span>
            <a
              href="https://github.com/TECHSCHOLAR777/CIVICSENSE-AI-BY-MEEVAAN-GARG"
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 hover:underline"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
