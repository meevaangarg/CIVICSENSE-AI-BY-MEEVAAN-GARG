import React, { useState } from 'react';
import type { CivicIncident } from '../data/civicData';
import { DelhiLeafletMap } from './DelhiLeafletMap';
import { Send, MapPin } from 'lucide-react';

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
    <div className="space-y-4">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-['Space_Grotesk']">
            Incident Map
          </h2>
          <p className="text-xs text-slate-500">
            Delhi municipal grievances and cluster routing
          </p>
        </div>

        {/* Agency Filter */}
        <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-lg">
          {['All', 'MCD', 'PWD', 'DJB', 'DPCC'].map(dept => (
            <button
              key={dept}
              onClick={() => setSelectedDeptFilter(dept)}
              className={`px-2.5 py-1 text-xs font-mono rounded transition-all ${
                selectedDeptFilter === dept
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Main Console: Leaflet Map + Selected Issue Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Leaflet Map (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-sm">
          <DelhiLeafletMap
            incidents={filteredIncidents}
            selectedIncident={activeIncident}
            onSelectIncident={(inc) => setActiveIncidentId(inc.id)}
            isDark={isDark}
          />
        </div>

        {/* Selected Incident Panel (4 cols) */}
        {activeIncident && (
          <div className="lg:col-span-4 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-blue-600 text-white">
                  {activeIncident.department}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {activeIncident.trackingCode}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white font-['Space_Grotesk'] leading-snug">
                {activeIncident.title}
              </h3>

              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span className="truncate">{activeIncident.ward}</span>
              </div>

              {/* Photo */}
              <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 h-40">
                <img
                  src={activeIncident.imageUrl}
                  alt="Incident site"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                {activeIncident.description}
              </p>

              {/* Required Equipment */}
              <div className="space-y-1 text-xs font-mono">
                <span className="text-slate-400 text-[10px] uppercase">Equipment:</span>
                <div className="flex flex-wrap gap-1">
                  {activeIncident.requiredEquipment.map((eq, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] border border-slate-200 dark:border-slate-700"
                    >
                      {eq}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-500">Est. Cost:</span>
                <span className="text-emerald-500 font-bold">
                  ₹{activeIncident.estimatedCostInr.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onSelectIncident(activeIncident)}
                  className="py-2 px-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 text-center"
                >
                  Details
                </button>
                <button
                  onClick={() => onDispatchIncident(activeIncident.id)}
                  className="py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Dispatch</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
