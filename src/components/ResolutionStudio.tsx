import { useState } from 'react';
import type { CivicIncident } from '../data/civicData';
import { CivicGeminiService } from '../services/geminiService';
import type { VerificationResult } from '../services/geminiService';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Sparkles, 
  ShieldCheck, 
  RotateCw, 
  ArrowRight,
  Eye,
  FileCheck
} from 'lucide-react';

interface ResolutionStudioProps {
  incidents: CivicIncident[];
}

export const ResolutionStudio: React.FC<ResolutionStudioProps> = ({ incidents }) => {
  const verifiedPreset = incidents.find(i => i.resolvedImageUrl) || incidents[0];
  
  const [selectedIncident, setSelectedIncident] = useState<CivicIncident>(verifiedPreset);
  const [isFraudTest, setIsFraudTest] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);

  // Photos
  const originalImage = selectedIncident.imageUrl;
  // If fraud test is toggled, use an unrelated clean living room image to demonstrate fraud detection!
  const contractorProofImage = isFraudTest
    ? 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
    : (selectedIncident.resolvedImageUrl || 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80');

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
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold tracking-wider uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              ANTI-CORRUPTION &amp; VERIFICATION STUDIO
            </span>
            <span className="text-xs text-slate-400 font-mono">FAKE-FIX BUSTER</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-['Space_Grotesk']">
            Automated Visual Resolution Audit
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Detect fraudulent contractor billings and fake ticket closures. Gemini Vision validates spatial geometry, background landmarks, and true site clearance.
          </p>
        </div>

        {/* Demo Mode Toggle (Authentic vs Fraud Test) */}
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 rounded-xl">
          <span className="text-xs font-mono text-slate-400 pl-2">Exhibition Test:</span>
          <button
            onClick={() => {
              setIsFraudTest(false);
              setVerificationResult(null);
            }}
            className={`px-3 py-1 text-xs font-mono rounded-lg transition-all ${
              !isFraudTest
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Authentic Fix Demo
          </button>
          <button
            onClick={() => {
              setIsFraudTest(true);
              setVerificationResult(null);
            }}
            className={`px-3 py-1 text-xs font-mono rounded-lg transition-all ${
              isFraudTest
                ? 'bg-red-600 text-white font-semibold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Fraudulent Proof Demo
          </button>
        </div>
      </div>

      {/* Incident Selection Dropdown */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs font-mono">
        <span className="text-slate-400 uppercase">Select Target Incident:</span>
        <select
          value={selectedIncident.id}
          onChange={(e) => {
            const found = incidents.find(i => i.id === e.target.value);
            if (found) {
              setSelectedIncident(found);
              setVerificationResult(null);
            }
          }}
          className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-lg text-slate-900 dark:text-slate-100 font-sans focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {incidents.map(inc => (
            <option key={inc.id} value={inc.id}>
              {inc.trackingCode} - {inc.title} ({inc.ward})
            </option>
          ))}
        </select>
      </div>

      {/* Side-by-Side Visual Inspection Studio */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left: Original Citizen Complaint Photo */}
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono font-medium bg-red-500/10 text-red-500 border border-red-500/20">
              BEFORE: ORIGINAL CITIZEN COMPLAINT
            </span>
            <span className="text-xs font-mono text-slate-400">
              Severity: {selectedIncident.severity}/5
            </span>
          </div>

          <div className="relative rounded-xl overflow-hidden h-64 border border-slate-200 dark:border-slate-800 bg-slate-950">
            <img
              src={originalImage}
              alt="Original problem site"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded bg-slate-900/80 backdrop-blur-md text-[10px] font-mono text-slate-300 border border-slate-700">
              {selectedIncident.ward} · Lat: {selectedIncident.coordinates[0]}
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 font-sans">
            <strong className="text-slate-800 dark:text-slate-200">Incident Description: </strong>
            {selectedIncident.description}
          </p>
        </div>

        {/* Right: Contractor Resolution Submission */}
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono font-medium border ${
              isFraudTest 
                ? 'bg-red-500/10 text-red-500 border-red-500/20' 
                : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
            }`}>
              AFTER: CONTRACTOR COMPLETION SUBMISSION
            </span>
            <span className="text-xs font-mono text-slate-400">
              {isFraudTest ? 'TESTING UNRELATED IMAGE' : 'MUNICIPAL REPAIR FILE'}
            </span>
          </div>

          <div className="relative rounded-xl overflow-hidden h-64 border border-slate-200 dark:border-slate-800 bg-slate-950">
            <img
              src={contractorProofImage}
              alt="Contractor proof submission"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded bg-slate-900/80 backdrop-blur-md text-[10px] font-mono text-slate-300 border border-slate-700">
              Timestamp: 2 Hours Ago · Contractor ID: #DEL-908
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 font-sans">
            <strong className="text-slate-800 dark:text-slate-200">Contractor Note: </strong>
            Site clearance completed using mechanical JCB loader; debris transferred to designated disposal zone.
          </p>
        </div>
      </div>

      {/* Verification Trigger Bar */}
      <div className="text-center pt-2">
        <button
          onClick={handleRunVerification}
          disabled={isVerifying}
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 disabled:opacity-50 text-white font-medium text-sm transition-all shadow-lg flex items-center justify-center gap-2 mx-auto"
        >
          {isVerifying ? (
            <>
              <RotateCw className="w-4 h-4 animate-spin" />
              <span>Analyzing Spatial Geometry &amp; Textures with Gemini Vision...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>Execute Automated Visual Audit &amp; Fix Verification</span>
            </>
          )}
        </button>
      </div>

      {/* Verification Result Breakdown Card */}
      {verificationResult && (
        <div className={`p-6 rounded-2xl border transition-all animate-fade-in ${
          verificationResult.isAuthenticResolution
            ? 'bg-emerald-500/5 border-emerald-500/30'
            : 'bg-red-500/5 border-red-500/30'
        }`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              {verificationResult.isAuthenticResolution ? (
                <CheckCircle className="w-8 h-8 text-emerald-500 shrink-0" />
              ) : (
                <XCircle className="w-8 h-8 text-red-500 shrink-0" />
              )}
              <div>
                <h3 className="text-xl font-bold font-['Space_Grotesk'] text-slate-900 dark:text-white">
                  Audit Verdict: {verificationResult.verdict}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  CONFIDENCE: {(verificationResult.confidence * 100).toFixed(0)}% · FRAUD RISK: {verificationResult.fraudRisk}
                </p>
              </div>
            </div>

            <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase ${
              verificationResult.isAuthenticResolution
                ? 'bg-emerald-500 text-white'
                : 'bg-red-500 text-white'
            }`}>
              {verificationResult.isAuthenticResolution ? 'PAYMENT APPROVED' : 'PAYMENT BLOCKED & FLAGGED'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 text-xs">
            <div>
              <h5 className="font-mono text-slate-400 uppercase font-semibold mb-2">
                Detected Visual Markers &amp; Delta:
              </h5>
              <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
                {verificationResult.detectedChanges.map((change, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold">•</span>
                    <span>{change}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="font-mono text-slate-400 uppercase font-semibold mb-2">
                Executive Engineer Audit Note:
              </h5>
              <p className="p-3 rounded-lg bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-sans leading-relaxed">
                {verificationResult.contractorAuditNote}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
