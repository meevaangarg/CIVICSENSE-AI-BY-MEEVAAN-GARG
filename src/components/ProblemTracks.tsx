import React, { useState } from 'react';
import type { CivicIncident } from '../data/civicData';
import { 
  AlertTriangle, 
  Clock, 
  MapPin, 
  Users, 
  ChevronRight, 
  Search,
  FileText
} from 'lucide-react';

interface ProblemTracksProps {
  incidents: CivicIncident[];
  onSelectIncident: (incident: CivicIncident) => void;
  onOpenReport: () => void;
}

export const ProblemTracks: React.FC<ProblemTracksProps> = ({
  incidents,
  onSelectIncident,
  onOpenReport,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Solid Waste', 'Road Hazard', 'Water & Drainage', 'Air Quality'];
  const departments = ['All', 'MCD', 'PWD', 'DJB', 'DPCC'];

  const filtered = incidents.filter(inc => {
    const matchesCat = selectedCategory === 'All' || inc.category === selectedCategory;
    const matchesDept = selectedDept === 'All' || inc.department === selectedDept;
    const matchesSearch = 
      inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.ward.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesDept && matchesSearch;
  });

  const getDeptColor = (dept: string) => {
    switch (dept) {
      case 'MCD': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'PWD': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'DJB': return 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20';
      case 'DPCC': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      default: return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-['Space_Grotesk']">
            Municipal Problem Tracks
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Delhi municipal grievances organized by severity and responsible authority.
          </p>
        </div>

        <button
          onClick={onOpenReport}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-all shadow-sm flex items-center justify-center gap-1.5 self-start sm:self-auto"
        >
          <span>+ Report Problem</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-3 rounded-xl shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ward or keyword (e.g. Lajpat Nagar, pothole, pipe)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Department pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-2.5 py-1 text-xs font-mono rounded-md transition-all border ${
                  selectedDept === dept
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900 dark:border-slate-100 font-semibold'
                    : 'bg-transparent text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Category tags */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100 dark:border-slate-800">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-0.5 text-xs rounded-full whitespace-nowrap transition-all border ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white border-blue-600 font-medium'
                  : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700/60'
              }`}
            >
              {cat}
            </button>
          ))}
          <span className="text-[11px] font-mono text-slate-400 ml-auto whitespace-nowrap">
            {filtered.length} found
          </span>
        </div>
      </div>

      {/* Clean Wadhwani AI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((incident) => (
          <div
            key={incident.id}
            onClick={() => onSelectIncident(incident)}
            className="group bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 hover:border-blue-500/50 rounded-xl overflow-hidden transition-all shadow-sm hover:shadow-md cursor-pointer flex flex-col justify-between"
          >
            <div>
              {/* Image Banner */}
              <div className="relative h-40 w-full overflow-hidden bg-slate-950">
                <img
                  src={incident.imageUrl}
                  alt={incident.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase backdrop-blur-md border ${getDeptColor(incident.department)}`}>
                    {incident.department}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-900/80 text-slate-200 border border-slate-700">
                    {incident.category}
                  </span>
                </div>
                <div className="absolute top-2.5 right-2.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-950/80 text-red-300 border border-red-800/80 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-red-400" />
                    SEV {incident.severity}/5
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-mono">
                  <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span className="truncate">{incident.ward}</span>
                </div>

                <h3 className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                  {incident.title}
                </h3>
              </div>
            </div>

            {/* Bottom Meta & Action */}
            <div className="px-4 py-3 bg-slate-50 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-mono">
              <span className="flex items-center gap-1 text-slate-500">
                <Users className="w-3.5 h-3.5 text-blue-500" />
                <span>{incident.citizenReportsCount} reports</span>
              </span>

              <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-sans font-medium group-hover:translate-x-0.5 transition-transform">
                <span>View Details</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full p-8 text-center bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl">
            <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">No matching incidents</h4>
            <p className="text-xs text-slate-500 mt-1">Try resetting your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};
