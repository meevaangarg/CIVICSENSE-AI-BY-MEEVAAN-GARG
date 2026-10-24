import { useState } from 'react';
import type { CivicIncident } from '../data/civicData';
import { 
  AlertTriangle, 
  Clock, 
  MapPin, 
  Users, 
  Wrench, 
  ChevronRight, 
  Filter, 
  CheckCircle2, 
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

  const getDeptBadgeClass = (dept: string) => {
    switch (dept) {
      case 'MCD': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'PWD': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'DJB': return 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20';
      case 'DPCC': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      default: return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20';
    }
  };

  const getSeverityBadge = (sev: number) => {
    if (sev >= 5) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono font-medium bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
          <AlertTriangle className="w-3 h-3" /> SEVERITY {sev}/5 (CRITICAL)
        </span>
      );
    }
    if (sev >= 4) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          <Clock className="w-3 h-3" /> SEVERITY {sev}/5 (HIGH)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-mono font-medium bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20">
        SEVERITY {sev}/5
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header and Quick Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold tracking-wider uppercase bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              MUNICIPAL PROBLEM TRACKS
            </span>
            <span className="text-xs text-slate-400 font-mono">DELHI NCT</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-['Space_Grotesk']">
            Active Civic Incidents & Challenges
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Real-time municipal incidents triaged, geographically deduplicated, and matched with Delhi civic departments.
          </p>
        </div>

        <button
          onClick={onOpenReport}
          className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs md:text-sm transition-all shadow-md flex items-center justify-center gap-2"
        >
          <span>+ Report New Incident</span>
        </button>
      </div>

      {/* Filter Toolbar matching Wadhwani AI aesthetic */}
      <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by ward, locality, or keyword (e.g. Lajpat Nagar, pothole, pipe)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs md:text-sm rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Department Quick Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
            <span className="text-xs text-slate-400 flex items-center gap-1 font-mono uppercase mr-1">
              <Filter className="w-3 h-3" /> Dept:
            </span>
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-2.5 py-1 text-xs rounded-md font-mono transition-all border ${
                  selectedDept === dept
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900 dark:border-slate-100 font-semibold'
                    : 'bg-transparent text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <span className="text-xs text-slate-400 font-mono uppercase mr-1 whitespace-nowrap">
            Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 text-xs rounded-full whitespace-nowrap transition-all border ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white border-blue-600 font-medium'
                  : 'bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
          <span className="text-xs text-slate-400 ml-auto font-mono whitespace-nowrap">
            Showing {filtered.length} of {incidents.length}
          </span>
        </div>
      </div>

      {/* Incident Cards Grid (Wadhwani AI Inspired Clean Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((incident) => (
          <div
            key={incident.id}
            onClick={() => onSelectIncident(incident)}
            className="group bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/90 hover:border-blue-500/50 dark:hover:border-blue-500/50 rounded-xl p-5 transition-all shadow-sm hover:shadow-md cursor-pointer flex flex-col justify-between"
          >
            <div>
              {/* Top Meta Bar */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold border ${getDeptBadgeClass(incident.department)}`}>
                    {incident.department}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    {incident.trackingCode}
                  </span>
                </div>
                {getSeverityBadge(incident.severity)}
              </div>

              {/* Title & Location */}
              <h3 className="text-base md:text-lg font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors font-['Space_Grotesk'] leading-snug">
                {incident.title}
              </h3>

              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-medium text-slate-700 dark:text-slate-300">{incident.ward}</span>
                <span>·</span>
                <span className="truncate">{incident.location}</span>
              </div>

              {/* Description Snippet */}
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2.5 line-clamp-2 leading-relaxed">
                {incident.description}
              </p>

              {/* Equipment Requirements Chip */}
              <div className="mt-3.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/70 text-[11px] font-mono flex items-start gap-1.5 text-slate-600 dark:text-slate-400">
                <Wrench className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                <div className="truncate">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Specs: </span>
                  {incident.requiredEquipment.join(' · ')}
                </div>
              </div>
            </div>

            {/* Bottom Footer Info */}
            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-500">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                  <Users className="w-3.5 h-3.5 text-blue-500" />
                  <strong className="text-slate-800 dark:text-slate-200">{incident.citizenReportsCount}</strong> reports
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  SLA: {incident.slaHours}h
                </span>
              </div>

              <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-sans font-medium group-hover:translate-x-0.5 transition-transform">
                <span>View Action Plan</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full p-12 text-center bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl">
            <FileText className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200">No matching civic incidents</h4>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your category, department, or keyword search filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};
