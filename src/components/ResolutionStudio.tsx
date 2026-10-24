import React, { useState } from 'react';
import type { CivicIncident } from '../data/civicData';
import { CivicGeminiService } from '../services/geminiService';
import type { VerificationResult } from '../services/geminiService';
import { 
  CheckCircle, 
  XCircle, 
  RotateCw, 
  ShieldCheck
} from 'lucide-react';

interface ResolutionStudioProps {
  incidents: CivicIncident[];
  onResolveIncident?: (id: string) => void;
}

export const ResolutionStudio: React.FC<ResolutionStudioProps> = ({ 
  incidents,
  onResolveIncident 
}) => {
  const verifiedPreset = incidents.find(i => i.resolvedImageUrl) || incidents[0];
  
  const [selectedIncident, setSelectedIncident] = useState<CivicIncident>(verifiedPreset);
  const [isFraudTest, setIsFraudTest] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);

  const originalImage = selectedIncident.imageUrl;
  const contractorProofImage = isFraudTest
    ? '/assets/incidents/fraud_mismatch_proof.jpg'
    : (selectedIncident.resolvedImageUrl || '/assets/incidents/mcd_garbage_2.jpg');

  const handleRunVerification = async () => {
    setIsVerifying(true);
    setVerificationResult(null);
    try {
      const descriptionQuery = isFraudTest 
        ? `${selectedIncident.description} fraud_test` 
        : selectedIncident.description;
      const result = await CivicGeminiService.verifyResolution(
        descriptionQuery,
        originalImage,
        contractorProofImage
      );
      setVerificationResult(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-['Space_Grotesk']">
            Resolution Audit
          </h2>
          <p className="text-xs text-slate-500">
            Compare contractor completion photos against original site reports.
          </p>
        </div>

        {/* Demo Mode Toggle */}
        <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-lg">
          <button
            onClick={() => {
              setIsFraudTest(false);
              setVerificationResult(null);
            }}
            className={`px-3 py-1 text-xs font-mono rounded transition-all ${
              !isFraudTest
                ? 'bg-emerald-600 text-white font-medium shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Valid Case
          </button>
          <button
            onClick={() => {
              setIsFraudTest(true);
              setVerificationResult(null);
            }}
            className={`px-3 py-1 text-xs font-mono rounded transition-all ${
              isFraudTest
                ? 'bg-red-600 text-white font-medium shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Mismatch Test
          </button>
        </div>
      </div>

      {/* Target Selector */}
      <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs">
        <span className="text-slate-500 font-mono">Incident:</span>
        <select
          value={selectedIncident.id}
          onChange={(e) => {
            const found = incidents.find(i => i.id === e.target.value);
            if (found) {
              setSelectedIncident(found);
              setVerificationResult(null);
            }
          }}
          className="bg-transparent border-none text-slate-900 dark:text-slate-100 font-medium focus:outline-none cursor-pointer"
        >
          {incidents.map(inc => (
            <option key={inc.id} value={inc.id} className="dark:bg-slate-900">
              {inc.trackingCode} - {inc.title} ({inc.ward})
            </option>
          ))}
        </select>
      </div>

      {/* Before / After Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Before */}
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-semibold text-red-500">
              BEFORE: CITIZEN REPORT
            </span>
            <span className="text-slate-400">
              Severity {selectedIncident.severity}/5
            </span>
          </div>

          <div className="rounded-lg overflow-hidden h-56 border border-slate-200 dark:border-slate-800 bg-slate-950">
            <img
              src={originalImage}
              alt="Original problem site"
              className="w-full h-full object-cover"
            />
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
            {selectedIncident.description}
          </p>
        </div>

        {/* After */}
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className={`font-semibold ${isFraudTest ? 'text-red-500' : 'text-emerald-500'}`}>
              AFTER: CONTRACTOR SUBMISSION
            </span>
            <span className="text-slate-400">
              {isFraudTest ? 'Mismatch Sample' : 'Site Proof'}
            </span>
          </div>

          <div className="rounded-lg overflow-hidden h-56 border border-slate-200 dark:border-slate-800 bg-slate-950">
            <img
              src={contractorProofImage}
              alt="Contractor proof"
              className="w-full h-full object-cover"
            />
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
            Site cleared and resurfaced. Debris transported to processing station.
          </p>
        </div>
      </div>

      {/* Action Button */}
      <div className="text-center pt-2">
        <button
          onClick={handleRunVerification}
          disabled={isVerifying}
          className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium text-xs transition-all shadow-sm flex items-center justify-center gap-1.5 mx-auto"
        >
          {isVerifying ? (
            <>
              <RotateCw className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing Image Geometry...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verify Resolution</span>
            </>
          )}
        </button>
      </div>

      {/* Result Card */}
      {verificationResult && (
        <div className={`p-4 rounded-xl border text-xs animate-fade-in ${
          verificationResult.isAuthenticResolution
            ? 'bg-emerald-500/5 border-emerald-500/30'
            : 'bg-red-500/5 border-red-500/30'
        }`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              {verificationResult.isAuthenticResolution ? (
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500 shrink-0" />
              )}
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white font-['Space_Grotesk'] text-sm">
                  {verificationResult.verdict}
                </h4>
                <p className="text-[11px] text-slate-500 font-mono">
                  Confidence: {(verificationResult.confidence * 100).toFixed(0)}% · Fraud Risk: {verificationResult.fraudRisk}
                </p>
              </div>
            </div>

            <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
              verificationResult.isAuthenticResolution
                ? 'bg-emerald-600 text-white'
                : 'bg-red-600 text-white'
            }`}>
              {verificationResult.isAuthenticResolution ? 'Approved' : 'Rejected'}
            </span>
          </div>

          <div className="pt-3 space-y-3">
            <p className="text-slate-700 dark:text-slate-300">
              {verificationResult.contractorAuditNote}
            </p>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-500">
                Audit Status: {selectedIncident.status}
              </span>

              {verificationResult.isAuthenticResolution ? (
                selectedIncident.status === 'Resolved' ? (
                  <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-semibold flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Officially Resolved &amp; Archived
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (onResolveIncident) {
                        onResolveIncident(selectedIncident.id);
                        setSelectedIncident(prev => ({ ...prev, status: 'Resolved' }));
                      }
                    }}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-sm flex items-center gap-1.5 transition-all"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Approve &amp; Mark Resolved</span>
                  </button>
                )
              ) : (
                <div className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 font-mono text-xs font-medium flex items-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Claim Rejected: Penalty Notice Issued</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
