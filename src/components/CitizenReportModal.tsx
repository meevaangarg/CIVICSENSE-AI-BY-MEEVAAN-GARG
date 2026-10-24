import React, { useState } from 'react';
import type { CivicIncident } from '../data/civicData';
import { CivicGeminiService } from '../services/geminiService';
import type { GeminiTriageResult } from '../services/geminiService';
import { 
  X, 
  Mic, 
  Sparkles, 
  ArrowRight
} from 'lucide-react';

interface CitizenReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitIncident: (newIncident: CivicIncident) => void;
}

export const CitizenReportModal: React.FC<CitizenReportModalProps> = ({
  isOpen,
  onClose,
  onSubmitIncident,
}) => {
  const [description, setDescription] = useState('');
  const [ward, setWard] = useState('Ward 142-S (Lajpat Nagar IV)');
  const [locationName, setLocationName] = useState('Near Central Market Roundabout');
  const [isRecording, setIsRecording] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80'
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [triageResult, setTriageResult] = useState<GeminiTriageResult | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const demoScenarios = [
    {
      label: 'MCD: Garbage Spill (Lajpat Nagar)',
      text: 'Bhai yahan kudedan pura sadak pe fail gaya hai, gaadiyon ka nikalna mushkil ho raha hai aur badboo itni hai ki log pareshan hain.',
      ward: 'Ward 142-S (Lajpat Nagar IV)',
      location: 'Central Market Ring Corner',
      image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80'
    },
    {
      label: 'PWD: Craters (ISBT Flyover)',
      text: 'ISBT flyover ke niche sadak par teen bade gaddhe ban gaye hain, kal raat do scooty wale gir gaye the.',
      ward: 'Ward 88-N (Kashmere Gate)',
      location: 'Under ISBT Flyover Loop',
      image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'
    },
    {
      label: 'DJB: Pipe Rupture (Hauz Khas)',
      text: 'Water supply pipeline fat gayi hai, sara peene ka paani gali mein beh raha hai aur gharon mein paani nahi aa raha.',
      ward: 'Ward 156-S (Hauz Khas Village)',
      location: 'Opposite Deer Park Gate 2',
      image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?auto=format&fit=crop&w=800&q=80'
    },
    {
      label: 'DPCC: Trash Burning (Anand Vihar)',
      text: 'Border ke paas khali plot mein kachra jalaya ja raha hai, dhuan itna zyada hai ki saans lena mushkil ho gaya hai.',
      ward: 'Ward 210-E (Anand Vihar)',
      location: 'Behind Kaushambi Transit Stop',
      image: 'https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1?auto=format&fit=crop&w=800&q=80'
    }
  ];

  const handleSelectScenario = (sc: typeof demoScenarios[0]) => {
    setDescription(sc.text);
    setWard(sc.ward);
    setLocationName(sc.location);
    setImagePreview(sc.image);
    setTriageResult(null);
  };

  const handleSimulateVoice = () => {
    setIsRecording(true);
    setTimeout(() => {
      setDescription('Bhai yahan kudedan pura sadak pe fail gaya hai aur traffic jam ho raha hai, turant saaf karwao.');
      setIsRecording(false);
    }, 1200);
  };

  const handleAnalyzeWithGemini = async () => {
    if (!description.trim()) return;
    setIsAnalyzing(true);
    try {
      const result = await CivicGeminiService.triageIncident(description, imagePreview || undefined);
      setTriageResult(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFinalSubmit = () => {
    if (!triageResult) return;
    const trackingCode = `${triageResult.department}-2026-DEL-${Math.floor(1000 + Math.random() * 9000)}`;
    const newIncident: CivicIncident = {
      id: `inc-${Date.now()}`,
      trackingCode,
      title: triageResult.title,
      category: triageResult.category,
      department: triageResult.department,
      ward: triageResult.wardRecommendation || ward,
      location: locationName,
      coordinates: [28.6139 + (Math.random() - 0.5) * 0.1, 77.2090 + (Math.random() - 0.5) * 0.1],
      severity: triageResult.severity,
      status: 'Triaged',
      citizenReportsCount: 1,
      reportedAgo: 'Just now',
      slaHours: triageResult.slaHours,
      description: triageResult.officialMemoEnglish,
      audioTranscriptHindi: description,
      audioTranscriptEnglish: triageResult.translatedFromHinglish,
      imageUrl: imagePreview || 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
      requiredEquipment: triageResult.requiredEquipment,
      estimatedCostInr: triageResult.estimatedCostInr,
      rootCauseAnalysis: triageResult.rootCauseAnalysis,
      verificationStatus: 'Pending'
    };

    onSubmitIncident(newIncident);
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl p-6 text-slate-900 dark:text-slate-100 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="w-4 h-4" />
        </button>

        {isSubmitted ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto text-xl font-bold">
              ✓
            </div>
            <h3 className="text-lg font-bold font-['Space_Grotesk'] text-slate-900 dark:text-white">
              Report Submitted
            </h3>
            <p className="text-xs text-slate-500 font-mono">
              Ticket: {triageResult?.department}-2026-DEL-CONFIRMED
            </p>
            <div className="pt-2">
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-['Space_Grotesk']">
                Report Issue
              </h3>
              <p className="text-xs text-slate-500">
                Submit an environmental or civic issue in Delhi.
              </p>
            </div>

            {/* Quick Presets */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono text-slate-400">Sample Presets:</span>
              <div className="grid grid-cols-2 gap-1.5">
                {demoScenarios.map((sc, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectScenario(sc)}
                    className="p-1.5 rounded-md text-left text-[11px] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 text-slate-700 dark:text-slate-300 truncate"
                  >
                    {sc.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Ward & Landmark */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-mono text-[11px]">Ward</label>
                <input
                  type="text"
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-mono text-[11px]">Landmark</label>
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Photo Preview */}
            <div className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Site"
                  className="w-14 h-14 object-cover rounded-md shrink-0"
                />
              )}
              <div className="text-[11px] text-slate-500">
                Photo attached for AI damage assessment and contractor verification.
              </div>
            </div>

            {/* Voice / Text */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono text-[11px]">Description (Hindi or English):</span>
                <button
                  type="button"
                  onClick={handleSimulateVoice}
                  className="text-blue-500 hover:underline flex items-center gap-1 font-mono text-[11px]"
                >
                  <Mic className="w-3 h-3" />
                  {isRecording ? 'Recording...' : 'Voice Input'}
                </button>
              </div>

              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the problem (e.g. Broken water pipe, overflowing garbage)..."
                className="w-full p-2.5 text-xs rounded-md bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Analyze Button */}
            {!triageResult && (
              <button
                onClick={handleAnalyzeWithGemini}
                disabled={isAnalyzing || !description.trim()}
                className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium text-xs shadow-sm flex items-center justify-center gap-1.5"
              >
                {isAnalyzing ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Run AI Triage</span>
                  </>
                )}
              </button>
            )}

            {/* Triage Output */}
            {triageResult && (
              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-blue-500/30 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-blue-600">
                    {triageResult.department} · {triageResult.category}
                  </span>
                  <span className="font-mono text-red-500">
                    Severity {triageResult.severity}/5
                  </span>
                </div>

                <p className="text-slate-700 dark:text-slate-300">
                  {triageResult.officialMemoEnglish}
                </p>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => setTriageResult(null)}
                    className="px-3 py-1 text-slate-500 text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleFinalSubmit}
                    className="px-4 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium flex items-center gap-1"
                  >
                    <span>Submit</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
