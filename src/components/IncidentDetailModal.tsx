import type { CivicIncident } from '../data/civicData';
import { 
  X, 
  MapPin, 
  Calendar, 
  AlertTriangle, 
  Wrench, 
  Clock, 
  Share2, 
  CheckCircle2, 
  ShieldCheck, 
  Volume2, 
  IndianRupee,
  Printer
} from 'lucide-react';

interface IncidentDetailModalProps {
  incident: CivicIncident | null;
  onClose: () => void;
  onDispatch: (id: string) => void;
}

export const IncidentDetailModal: React.FC<IncidentDetailModalProps> = ({
  incident,
  onClose,
  onDispatch,
}) => {
  if (!incident) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 md:p-8 my-8 text-slate-900 dark:text-slate-100 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Metadata */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-blue-600 text-white">
              {incident.department} JURISDICTION
            </span>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
              {incident.trackingCode}
            </span>
            <span className="px-2.5 py-0.5 rounded text-xs font-mono font-medium bg-red-500/10 text-red-500 border border-red-500/20">
              SEVERITY {incident.severity}/5
            </span>
            <span className="text-xs font-mono text-slate-400 ml-auto">
              Status: <strong className="text-emerald-500 uppercase">{incident.status}</strong>
            </span>
          </div>

          <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-slate-900 dark:text-white leading-snug">
            {incident.title}
          </h2>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-blue-500" />
              {incident.ward} · {incident.location}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              Reported {incident.reportedAgo} · SLA: {incident.slaHours}h
            </span>
          </div>

          {/* Photo Preview */}
          <div className="rounded-xl overflow-hidden h-72 border border-slate-200 dark:border-slate-800 bg-slate-950">
            <img
              src={incident.imageUrl}
              alt={incident.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Hinglish Voice Transcript (if available) */}
          {incident.audioTranscriptHindi && (
            <div className="p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/20 space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 font-mono text-blue-600 dark:text-blue-400 font-semibold">
                <Volume2 className="w-4 h-4" />
                <span>CITIZEN AUDIO TRANSCRIPT (HINGLISH/HINDI):</span>
              </div>
              <p className="text-slate-800 dark:text-slate-200 italic font-sans">
                "{incident.audioTranscriptHindi}"
              </p>
              {incident.audioTranscriptEnglish && (
                <p className="text-slate-500 dark:text-slate-400 text-[11px] pt-1 border-t border-blue-500/10">
                  <strong>English Translation: </strong>"{incident.audioTranscriptEnglish}"
                </p>
              )}
            </div>
          )}

          {/* Description & Work Order Memo */}
          <div>
            <h4 className="text-xs font-mono uppercase text-slate-400 font-semibold mb-1">
              Municipal Work Order Dispatch Memo:
            </h4>
            <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
              {incident.description}
            </p>
          </div>

          {/* Root Cause Analysis by Gemini */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <h4 className="text-xs font-mono uppercase text-slate-900 dark:text-slate-100 font-bold">
                Gemini Root Cause & Infrastructure Analysis:
              </h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
              {incident.rootCauseAnalysis}
            </p>
          </div>

          {/* Machinery, Labor, and Budget Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-xs font-mono">
            <div>
              <span className="text-slate-400 uppercase text-[10px] block mb-1">
                Prescribed Machinery & Equipment:
              </span>
              <ul className="space-y-1 text-slate-800 dark:text-slate-200">
                {incident.requiredEquipment.map((eq, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <Wrench className="w-3 h-3 text-blue-500" />
                    <span>{eq}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <div>
                <span className="text-slate-400 uppercase text-[10px] block">
                  Estimated Municipal Budget:
                </span>
                <span className="text-lg font-bold text-emerald-500">
                  ₹{incident.estimatedCostInr.toLocaleString('en-IN')}
                </span>
              </div>
              <div>
                <span className="text-slate-400 uppercase text-[10px] block">
                  Citizen Endorsements:
                </span>
                <span className="text-slate-700 dark:text-slate-300 font-semibold">
                  {incident.citizenReportsCount} Verified Reports Across 150m Radius
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                Close Window
              </button>
              <button
                onClick={() => window.print()}
                className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-colors"
                title="Print official municipal field memo"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Work-Order</span>
              </button>
            </div>

            {incident.status === 'Dispatched' ? (
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-mono font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Squad Dispatched to Field</span>
              </div>
            ) : incident.status === 'Resolved' ? (
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20 text-xs font-mono font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Incident Officially Resolved</span>
              </div>
            ) : (
              <button
                onClick={() => {
                  onDispatch(incident.id);
                  onClose();
                }}
                className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-all shadow-md flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Dispatch Action to {incident.department}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
