import { useState } from 'react';
import type { CivicIncident } from '../data/civicData';
import { DELHI_AGENCIES } from '../data/civicData';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  MapPin, 
  Send, 
  Clock, 
  BarChart3, 
  Building2, 
  Wrench,
  Radio
} from 'lucide-react';

interface AdminCommandCenterProps {
  incidents: CivicIncident[];
  onSelectIncident: (incident: CivicIncident) => void;
  onDispatchIncident: (id: string) => void;
}

export const AdminCommandCenter: React.FC<AdminCommandCenterProps> = ({
  incidents,
  onSelectIncident,
  onDispatchIncident,
}) => {
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('All');
  const [clusterRadius, setClusterRadius] = useState<number>(150); // meters
  const [activeIncidentId, setActiveIncidentId] = useState<string | null>(incidents[0]?.id || null);

  const filteredIncidents = incidents.filter(
    inc => selectedDeptFilter === 'All' || inc.department === selectedDeptFilter
  );

  const activeIncident = incidents.find(i => i.id === activeIncidentId) || incidents[0];

  return (
    <div className="space-y-6">
      {/* Top Title Banner */}
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
            Ward Hotspot Intelligence & SLA Dispatch
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

      {/* Main Split Console: Interactive Delhi Spatial Map + Active Incident Work-Order */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Delhi Spatial Cluster Map (7 Cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white font-mono uppercase tracking-wide">
                Delhi NCT Geo-Spatial Incident Cluster Map
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
              <span>Cluster Radius:</span>
              <span className="text-blue-600 dark:text-blue-400 font-semibold">{clusterRadius}m</span>
            </div>
          </div>

          {/* Interactive Vector Map of Delhi NCT */}
          <div className="relative w-full h-[380px] bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center p-4">
            
            {/* Background Delhi boundary contour simulation */}
            <svg viewBox="0 0 600 450" className="w-full h-full opacity-60">
              <defs>
                <pattern id="gridPattern" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(56, 189, 248, 0.08)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="600" height="450" fill="url(#gridPattern)" />

              {/* Yamuna River Curve */}
              <path
                d="M 320 0 Q 340 100 370 180 T 410 320 T 430 450"
                fill="none"
                stroke="#0284c7"
                strokeWidth="4"
                opacity="0.5"
              />
              <text x="380" y="240" fill="#38bdf8" fontSize="10" fontFamily="'JetBrains Mono', monospace" opacity="0.6">
                YAMUNA RIVER
              </text>

              {/* Delhi Boundary outline polygon */}
              <polygon
                points="180,40 340,30 420,90 480,180 520,300 460,420 320,410 210,380 120,290 110,160 180,40"
                fill="rgba(30, 41, 59, 0.4)"
                stroke="#334155"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />

              {/* Major Roads representation (Ring Road & Outer Ring Road) */}
              <ellipse cx="300" cy="230" rx="140" ry="110" fill="none" stroke="#475569" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.7" />
              <ellipse cx="300" cy="230" rx="90" ry="70" fill="none" stroke="#475569" strokeWidth="1" opacity="0.5" />

              {/* Plot the active incidents on the map */}
              {filteredIncidents.map((inc, idx) => {
                // Map coordinates roughly into the 600x450 canvas
                // Delhi Lat ~ 28.5 to 28.7, Lon ~ 77.1 to 77.3
                const mapX = 150 + ((inc.coordinates[1] - 77.12) / 0.22) * 320;
                const mapY = 400 - ((inc.coordinates[0] - 28.52) / 0.18) * 320;
                const isSelected = activeIncident?.id === inc.id;

                let markerColor = '#f59e0b';
                if (inc.department === 'MCD') markerColor = '#f59e0b';
                if (inc.department === 'PWD') markerColor = '#3b82f6';
                if (inc.department === 'DJB') markerColor = '#06b6d4';
                if (inc.department === 'DPCC') markerColor = '#10b981';

                return (
                  <g
                    key={inc.id}
                    onClick={() => setActiveIncidentId(inc.id)}
                    className="cursor-pointer transition-all hover:scale-110"
                  >
                    {/* Pulsing ring if selected */}
                    {isSelected && (
                      <circle
                        cx={mapX}
                        cy={mapY}
                        r="24"
                        fill="none"
                        stroke={markerColor}
                        strokeWidth="1.5"
                        opacity="0.8"
                        strokeDasharray="4 2"
                      />
                    )}
                    {/* Cluster radius field */}
                    <circle
                      cx={mapX}
                      cy={mapY}
                      r="16"
                      fill={markerColor}
                      fillOpacity="0.2"
                      stroke={markerColor}
                      strokeWidth="1"
                    />
                    {/* Center point */}
                    <circle cx={mapX} cy={mapY} r="6" fill={markerColor} />
                    <text
                      x={mapX}
                      y={mapY - 12}
                      textAnchor="middle"
                      fill="#f8fafc"
                      fontSize="9"
                      fontFamily="'JetBrains Mono', monospace"
                      fontWeight="600"
                    >
                      {inc.department} ({inc.citizenReportsCount})
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Bottom Overlay Legend */}
            <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-sm border border-slate-800 px-3 py-1.5 rounded-lg text-[10px] font-mono text-slate-400 flex items-center gap-3">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> MCD</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> PWD</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-500" /> DJB</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> DPCC</span>
            </div>
          </div>

          {/* Spatial Deduplication Engine Info */}
          <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20 text-xs font-mono text-slate-600 dark:text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-500" />
              <span>SPATIAL CLUSTER ENGINE: 112 RAW CALLS CONSOLIDATED INTO 5 MASTER INCIDENTS</span>
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
                  Gemini Root Cause & Infrastructure Diagnosis:
                </h5>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                  {activeIncident.rootCauseAnalysis}
                </p>
              </div>

              {/* Machinery & Cost Matrix */}
              <div className="space-y-1 text-xs font-mono">
                <span className="text-slate-400 uppercase text-[10px]">Required Equipment & Materials:</span>
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
