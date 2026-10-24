import { useState } from 'react';
import type { CivicIncident } from '../data/civicData';
import { CivicGeminiService } from '../services/geminiService';
import type { GeminiTriageResult } from '../services/geminiService';
import { 
  X, 
  Upload, 
  Mic, 
  Sparkles, 
  AlertCircle, 
  CheckCircle, 
  ArrowRight, 
  Wrench, 
  IndianRupee, 
  MapPin, 
  Clock,
  Volume2
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

  // Preset quick scenarios for exhibition demonstrations
  const scenarios = [
    {
      label: 'MCD: Garbage Spill (Lajpat Nagar)',
      text: 'Bhai yahan kudedan pura sadak pe fail gaya hai, gaadiyon ka nikalna mushkil ho raha hai aur badboo itni hai ki log pareshan hain.',
      ward: 'Ward 142-S (Lajpat Nagar IV)',
      location: 'Central Market Ring Corner',
      image: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80'
    },
    {
      label: 'PWD: Deep Craters (ISBT Flyover)',
      text: 'ISBT flyover ke niche sadak par teen bade gaddhe ban gaye hain, kal raat do scooty wale gir gaye the.',
      ward: 'Ward 88-N (Kashmere Gate)',
      location: 'Under ISBT Flyover Loop',
      image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'
    },
    {
      label: 'DJB: Water Main Burst (Hauz Khas)',
      text: 'Water supply pipeline fat gayi hai, sara peene ka paani gali mein beh raha hai aur gharon mein paani nahi aa raha.',
      ward: 'Ward 156-S (Hauz Khas Village)',
      location: 'Opposite Deer Park Gate 2',
      image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?auto=format&fit=crop&w=800&q=80'
    },
    {
      label: 'DPCC: Open Toxic Burning (Anand Vihar)',
      text: 'Border ke paas khali plot mein kachra jalaya ja raha hai, dhuan itna zyada hai ki saans lena mushkil ho gaya hai.',
      ward: 'Ward 210-E (Anand Vihar)',
      location: 'Behind Kaushambi Transit Stop',
      image: 'https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1?auto=format&fit=crop&w=800&q=80'
    }
  ];

  const handleSelectScenario = (sc: typeof scenarios[0]) => {
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
    }, 1500);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 md:p-8 my-8 text-slate-900 dark:text-slate-100 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          /* Success Screen with Karma Reward */
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto text-3xl">
              ✓
            </div>
            <h3 className="text-2xl font-bold font-['Space_Grotesk'] text-slate-900 dark:text-white">
              Civic Incident Triaged & Dispatched
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              Your report has been analyzed by Gemini, assigned tracking code{' '}
              <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">
                {triageResult?.department}-2026-DEL-CONFIRMED
              </span>
              , and queued in the municipal dispatch stream.
            </p>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-mono font-medium">
              <Sparkles className="w-4 h-4" /> +50 CIVIC KARMA POINTS CREDITED TO YOUR CITIZEN ID
            </div>

            <div className="pt-4">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all shadow-md"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        ) : (
          /* Reporting Form */
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  SNAP & SPEAK
                </span>
                <span className="text-xs text-slate-400 font-mono">GEMINI MULTIMODAL REDRESSAL</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-['Space_Grotesk']">
                Report a Civic Problem
              </h2>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mt-1">
                Speak or type in Hindi, Hinglish, or English. Gemini automatically classifies the issue, detects severity, and routes it to MCD, PWD, DJB, or DPCC.
              </p>
            </div>

            {/* Exhibition Preset Scenario Chips */}
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5 uppercase">
                Demo Presets for Exhibition Testing:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {scenarios.map((sc, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectScenario(sc)}
                    className="p-2 rounded-lg text-left text-xs bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all truncate font-medium text-slate-700 dark:text-slate-300"
                  >
                    {sc.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Location & Ward Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">
                  Delhi Ward
                </label>
                <input
                  type="text"
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">
                  Specific Landmark / Street
                </label>
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Photo Preview & Upload Box */}
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1 uppercase">
                Visual Evidence (Site Photo)
              </label>
              <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-dashed border-slate-200 dark:border-slate-800">
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded-lg border border-slate-300 dark:border-slate-700 shrink-0"
                  />
                )}
                <div className="text-xs text-slate-500 space-y-1">
                  <p className="text-slate-700 dark:text-slate-300 font-medium">
                    Evidence photo attached
                  </p>
                  <p className="text-[11px]">
                    Gemini Vision assesses physical debris, damage dimensions, and contractor resolution verification.
                  </p>
                </div>
              </div>
            </div>

            {/* Description & Speech input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-mono text-slate-400 uppercase">
                  Citizen Voice Note or Text Description (Hinglish Supported)
                </label>
                <button
                  type="button"
                  onClick={handleSimulateVoice}
                  className={`flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded transition-all ${
                    isRecording
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20'
                  }`}
                >
                  <Mic className="w-3 h-3" />
                  {isRecording ? 'Listening in Hindi...' : 'Record Voice'}
                </button>
              </div>

              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Jaise: 'Bhai yahan kudedan pura sadak pe fail gaya hai aur traffic ruk raha hai...'"
                className="w-full p-3 text-xs md:text-sm rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Triage Trigger Button */}
            {!triageResult && (
              <button
                onClick={handleAnalyzeWithGemini}
                disabled={isAnalyzing || !description.trim()}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium text-xs md:text-sm transition-all shadow-md flex items-center justify-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    <span>Gemini Multimodal Processing & Ward Routing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Run Gemini AI Triage</span>
                  </>
                )}
              </button>
            )}

            {/* Triage Result Breakdown Display */}
            {triageResult && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-blue-500/30 space-y-3 animate-fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-blue-600 text-white">
                      {triageResult.department}
                    </span>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {triageResult.category}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-red-500 font-semibold">
                    SEVERITY {triageResult.severity}/5 ({triageResult.hazardLevel})
                  </span>
                </div>

                {triageResult.translatedFromHinglish && (
                  <div className="text-xs bg-blue-500/5 p-2 rounded border border-blue-500/10">
                    <span className="font-mono text-blue-500 font-medium">Translated Intent: </span>
                    <span className="text-slate-700 dark:text-slate-300">
                      "{triageResult.translatedFromHinglish}"
                    </span>
                  </div>
                )}

                <div>
                  <h4 className="text-xs font-mono text-slate-400 uppercase">
                    Official Municipal Work Order Memo:
                  </h4>
                  <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed font-sans">
                    {triageResult.officialMemoEnglish}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] font-mono">
                  <div>
                    <span className="text-slate-400">EQUIPMENT: </span>
                    <span className="text-slate-800 dark:text-slate-200">
                      {triageResult.requiredEquipment.slice(0, 2).join(', ')}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400">EST. BUDGET: </span>
                    <span className="text-emerald-500 font-semibold">
                      ₹{triageResult.estimatedCostInr.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    onClick={() => setTriageResult(null)}
                    className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  >
                    Edit Input
                  </button>
                  <button
                    onClick={handleFinalSubmit}
                    className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-md flex items-center gap-1.5"
                  >
                    <span>Confirm & Dispatch Ticket</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
