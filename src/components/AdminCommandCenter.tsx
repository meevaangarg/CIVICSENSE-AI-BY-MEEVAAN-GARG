import React, { useState } from 'react';
import type { CivicIncident } from '../data/civicData';
import { DELHI_AGENCIES } from '../data/civicData';
import { DelhiLeafletMap } from './DelhiLeafletMap';
import { 
  ShieldCheck, 
  MapPin, 
  Send, 
  Radio
} from 'lucide-react';

interface AdminCommandCenterProps {
  incidents: CivicIncident[];
  selectedIncident?: CivicIncident | null;
  onSelectIncident: (incident: CivicIncident) => void;
  onDispatchIncident: (id: string) => void;
  isDark: boolean;
}

export const AdminCommandCenter: React.FC<AdminCommandCenterProps> = ({
  incidents,
  selectedIncident: propSelectedIncident,
  onSelectIncident,
  onDispatchIncident,
  isDark,
}) => {
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('All');
  const [internalActiveId, setInternalActiveId] = useState<string | null>(incidents[0]?.id || null);

  const activeIncidentId = propSelectedIncident?.id || internalActiveId;
  const setActiveIncidentId = (id: string) => {
    setInternalActiveId(id);
    const found = incidents.find(i => i.id === id);
    if (found) onSelectIncident(found);
  };

  const filteredIncidents = incidents.filter(
    inc => selectedDeptFilter === 'All' || inc.department === selectedDeptFilter
  );

  const activeIncident = incidents.find(i => i.id === activeIncidentId) || incidents[0];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold tracking-wider uppercase bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 flex items-center gap-1.5">
              <Radio className="w-3 h-3 animate-pulse text-red-500" />
              MUNICIPAL COMMAND DESK
            </span>
            <span className="text-xs text-slate-400 font-mono">DELHI NCT DISPATCH</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-['Space_Grotesk']">
            Ward Hotspot Intelligence &amp; SLA Dispatch
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Spatial deduplication, live cluster triangulation, and automated machinery dispatch across MCD, PWD, DJB, and DPCC.
          </p>
        </div>

        {/* Agency Quick Filter Pills */}
        <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 rounded-xl shadow-sm">
          {['All', 'MCD', 'PWD', 'DJB', 'DPCC'].map(dept => (
            <button
              key={dept}
              onClick={() => setSelectedDeptFilter(dept)}
              className={`px-3 py-1 text-xs font-mono rounded-lg transition-all border ${
                selectedDeptFilter === dept
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900 dark:border-slate-100 font-semibold shadow-sm'
                  : 'bg-transparent text-slate-600 dark:text-slate-400 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Agency Status Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {DELHI_AGENCIES.map(agency => (
          <div
            key={agency.code}
            className="p-4 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/90 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="font-bold text-slate-900 dark:text-white px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  {agency.code}
                </span>
                <span className="text-emerald-500 font-medium">98.4% SLA</span>
              </div>
              <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                {agency.name}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                {agency.jurisdiction}
              </p>
            </div>

            <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-mono text-slate-500 flex justify-between">
              <span>AVG TIME: {agency.avgResolutionTime}</span>
              <span className="text-blue-500 font-semibold">{agency.activeIncidents} Active</span>
            </div>
          </div>
        ))}
      </div>

      {/* Split Console: Interactive Delhi Leaflet Map + Active Incident Work-Order */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Leaflet Map (7 Cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono uppercase tracking-wide">
                Live Delhi Leaflet Geo-Spatial Map
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-500">
              Showing {filteredIncidents.length} clusters
            </span>
          </div>

          {/* Real Leaflet Map */}
          <DelhiLeafletMap
            incidents={filteredIncidents}
            selectedIncident={activeIncident}
            onSelectIncident={(inc) => setActiveIncidentId(inc.id)}
            isDark={isDark}
          />

          {/* Spatial Deduplication Engine Info */}
          <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20 text-xs font-mono text-slate-600 dark:text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-500" />
              <span>SPATIAL CLUSTER ENGINE: 112 CITIZEN REPORTS UNIFIED</span>
            </span>
            <span className="text-emerald-500 font-semibold">+91% REDUCED QUEUE NOISE</span>
          </div>
        </div>

        {/* Right Column: Selected Incident Engineering Work-Order & Dispatch (5 Cols) */}
        {activeIncident && (
          <div className="lg:col-span-5 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-blue-600 text-white">
                  {activeIncident.department} WORK-ORDER
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {activeIncident.trackingCode}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-['Space_Grotesk']">
                {activeIncident.title}
              </h3>

              <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                <p><strong className="text-slate-700 dark:text-slate-300">Jurisdiction: </strong>{activeIncident.ward}</p>
                <p><strong className="text-slate-700 dark:text-slate-300">Location: </strong>{activeIncident.location}</p>
              </div>

              {/* Photo preview */}
              <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 h-36">
                <img
                  src={activeIncident.imageUrl}
                  alt="Incident site"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Root Cause Analysis by Gemini */}
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-1">
                <h5 className="text-[11px] font-mono uppercase text-slate-400 font-semibold">
                  Gemini Diagnosis:
                </h5>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                  {activeIncident.rootCauseAnalysis}
                </p>
              </div>

              {/* Machinery & Cost Matrix */}
              <div className="space-y-1 text-xs font-mono">
                <span className="text-slate-400 uppercase text-[10px]">Required Equipment &amp; Materials:</span>
                <div className="flex flex-wrap gap-1.5">
                  {activeIncident.requiredEquipment.map((eq, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] border border-slate-200 dark:border-slate-700"
                    >
                      {eq}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions: Dispatch Trigger & View Full Details */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500">ESTIMATED REPAIR:</span>
                <span className="text-emerald-500 font-bold">
                  ₹{activeIncident.estimatedCostInr.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => onSelectIncident(activeIncident)}
                  className="py-2.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 transition-all text-center"
                >
                  Full Investigation
                </button>
                <button
                  onClick={() => onDispatchIncident(activeIncident.id)}
                  className="py-2.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-all shadow-md flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Dispatch Squad</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
