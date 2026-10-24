import React, { useState } from 'react';
import type { CivicIncident } from '../data/civicData';
import { 
  ShieldCheck, 
  X, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  Send,
  UserCheck
} from 'lucide-react';

interface OfficerDispatchModalProps {
  isOpen: boolean;
  incident: CivicIncident | null;
  onClose: () => void;
  onConfirmDispatch: (incidentId: string, officerBadge: string) => void;
}

export const OfficerDispatchModal: React.FC<OfficerDispatchModalProps> = ({
  isOpen,
  incident,
  onClose,
  onConfirmDispatch,
}) => {
  const [officerName, setOfficerName] = useState('Assistant Engineer R. Sharma');
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !incident) return null;

  // Department passcode table
  const deptCodes: Record<string, string> = {
    MCD: 'MCD011',
    PWD: 'PWD022',
    DJB: 'DJB033',
    DPCC: 'DPCC044',
  };

  const expectedCode = deptCodes[incident.department] || `${incident.department}011`;

  const handleAuthorize = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const inputClean = passcode.trim().toUpperCase();
    if (inputClean !== expectedCode && inputClean !== 'ADMIN' && inputClean !== 'CIVICA') {
      setErrorMsg(`Invalid Passcode for ${incident.department}. Expected authorization format: ${expectedCode}`);
      return;
    }

    setIsSuccess(true);
    setTimeout(() => {
      onConfirmDispatch(incident.id, `${officerName} (${expectedCode})`);
      setIsSuccess(false);
      setPasscode('');
      onClose();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl p-6 text-slate-900 dark:text-slate-100">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="w-4 h-4" />
        </button>

        {isSuccess ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto text-2xl font-bold">
              ✓
            </div>
            <h3 className="text-lg font-bold font-['Space_Grotesk'] text-slate-900 dark:text-white">
              Dispatch Authorized
            </h3>
            <p className="text-xs text-slate-500 font-mono">
              Work-Order {incident.trackingCode} dispatched to {incident.department} field response squad.
            </p>
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-mono">
              Officer: {officerName} · Code: {expectedCode}
            </div>
          </div>
        ) : (
          <form onSubmit={handleAuthorize} className="space-y-4">
            <div className="flex items-center gap-2.5 mb-1">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold font-['Space_Grotesk'] text-slate-900 dark:text-white">
                  Officer Authorization
                </h3>
                <p className="text-xs text-slate-500">
                  {incident.department} Municipal Dispatch Control
                </p>
              </div>
            </div>

            {/* Target Issue Summary Card */}
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
              <div className="flex items-center justify-between font-mono">
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {incident.department} · {incident.trackingCode}
                </span>
                <span className="text-red-500 font-semibold">
                  Severity {incident.severity}/5
                </span>
              </div>
              <p className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
                {incident.title}
              </p>
              <p className="text-[11px] text-slate-500 font-mono truncate">
                📍 {incident.ward}
              </p>
            </div>

            {/* Officer Name */}
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Authorized Dispatch Officer:
              </label>
              <div className="relative">
                <UserCheck className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Security Passcode */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-mono text-slate-400">
                  Department Passcode:
                </label>
                <span className="text-[10px] font-mono text-blue-500">
                  Hint: {expectedCode}
                </span>
              </div>
              <input
                type="text"
                required
                placeholder={`Enter passcode (e.g. ${expectedCode})`}
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono uppercase tracking-wider rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-all shadow-sm flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Authorize &amp; Dispatch Squad</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
