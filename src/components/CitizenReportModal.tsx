import React, { useState, useEffect, useRef } from 'react';
import type { CivicIncident } from '../data/civicData';
import { CivicGeminiService } from '../services/geminiService';
import type { GeminiTriageResult } from '../services/geminiService';
import { 
  X, 
  Mic, 
  Sparkles, 
  ArrowRight,
  Camera,
  Upload,
  MapPin,
  CheckCircle,
  RotateCw,
  StopCircle
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
  const [coords, setCoords] = useState<[number, number]>([28.6139, 77.2090]);
  const [geoAddress, setGeoAddress] = useState('Central Delhi (Auto-detected)');
  const [isLocating, setIsLocating] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [triageResult, setTriageResult] = useState<GeminiTriageResult | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-fetch Geolocation on open
  useEffect(() => {
    if (!isOpen) return;

    if ('geolocation' in navigator) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = Number(position.coords.latitude.toFixed(4));
          const lon = Number(position.coords.longitude.toFixed(4));
          setCoords([lat, lon]);
          setGeoAddress(`${lat}° N, ${lon}° E (GPS Verified)`);
          setIsLocating(false);
        },
        (err) => {
          console.warn('Geolocation fallback to Central Delhi:', err.message);
          setCoords([28.6139, 77.2090]);
          setGeoAddress('28.6139° N, 77.2090° E (Delhi NCT)');
          setIsLocating(false);
        },
        { timeout: 5000, enableHighAccuracy: true }
      );
    }
  }, [isOpen]);

  // Clean up media streams when modal closes
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Live Camera Activation
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err) {
      console.warn('Camera access error, fallback to file input:', err);
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }
  };

  // Capture photo from live camera with Geotag watermark
  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    // Add Geotag stamp on the canvas
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, canvas.height - 40, canvas.width, 40);
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px monospace';
    ctx.fillText(`CIVICA GPS: ${coords[0]}° N, ${coords[1]}° E · ${new Date().toLocaleTimeString()}`, 15, canvas.height - 15);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setImagePreview(dataUrl);
    stopCamera();
  };

  // Upload photo from Gallery
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Speech Recognition (Hindi / Hinglish / English)
  const toggleSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Browser doesn't support Web Speech API, simulate natural transcription
      setIsRecording(true);
      setTimeout(() => {
        setDescription('Yahan road par bada gaddha bana hua hai aur traffic slow ho raha hai.');
        setIsRecording(false);
      }, 1500);
      return;
    }

    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'hi-IN'; // Accepts Hindi and Hinglish
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setDescription(prev => (prev ? `${prev} ${transcript}` : transcript));
        setIsRecording(false);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsRecording(false);
    }
  };

  // Run AI Triage
  const handleAnalyzeWithGemini = async () => {
    if (!description.trim() && !imagePreview) return;
    setIsAnalyzing(true);
    try {
      const result = await CivicGeminiService.triageIncident(
        description || 'Civic infrastructure obstruction',
        imagePreview || undefined
      );
      setTriageResult(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Submit Incident
  const handleFinalSubmit = () => {
    if (!triageResult) return;
    const trackingCode = `${triageResult.department}-2026-DEL-${Math.floor(1000 + Math.random() * 9000)}`;
    const newIncident: CivicIncident = {
      id: `inc-${Date.now()}`,
      trackingCode,
      title: triageResult.title,
      category: triageResult.category,
      department: triageResult.department,
      ward: triageResult.wardRecommendation || 'Delhi Central Zone',
      location: geoAddress,
      coordinates: coords,
      severity: triageResult.severity,
      status: 'Triaged',
      citizenReportsCount: 1,
      reportedAgo: 'Just now',
      slaHours: triageResult.slaHours,
      description: description || triageResult.officialMemoEnglish,
      audioTranscriptHindi: description,
      audioTranscriptEnglish: triageResult.translatedFromHinglish || triageResult.officialMemoEnglish,
      imageUrl: imagePreview || '/assets/incidents/pwd_delhi_pothole_crater.jpg',
      requiredEquipment: triageResult.requiredEquipment,
      estimatedCostInr: triageResult.estimatedCostInr,
      rootCauseAnalysis: triageResult.rootCauseAnalysis,
      verificationStatus: 'Pending'
    };

    onSubmitIncident(newIncident);
    setIsSubmitted(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl p-5 md:p-6 text-slate-900 dark:text-slate-100 max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={() => {
            stopCamera();
            onClose();
          }}
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
              Incident Registered
            </h3>
            <p className="text-xs text-slate-500 font-mono">
              Tracking ID: {triageResult?.department}-2026-DEL-CONFIRMED
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xs mx-auto">
              Your geotagged report has been routed to {triageResult?.department} and added to the live municipal map.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setTriageResult(null);
                  setDescription('');
                  setImagePreview(null);
                  onClose();
                }}
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
                Report Civic Problem
              </h3>
              <p className="text-xs text-slate-500">
                Snap or upload a photo with auto-geotag, speak or type the issue.
              </p>
            </div>

            {/* Auto GPS Location Badge */}
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
                <span className="truncate">{geoAddress}</span>
              </div>
              {isLocating && (
                <RotateCw className="w-3.5 h-3.5 text-blue-500 animate-spin shrink-0" />
              )}
            </div>

            {/* Photo Capture & Gallery Upload Options */}
            <div className="space-y-2">
              <label className="block text-xs font-mono text-slate-400 uppercase">
                Site Photo (Geotagged Evidence)
              </label>

              {/* Hidden File Input for Gallery */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              {/* Live Camera View (when active) */}
              {isCameraActive ? (
                <div className="relative rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center border border-slate-700">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  <div className="absolute bottom-3 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium text-xs shadow-lg flex items-center gap-1.5"
                    >
                      <Camera className="w-4 h-4" />
                      <span>Capture Photo</span>
                    </button>
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="px-3 py-2 rounded-lg bg-slate-800 text-white text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : imagePreview ? (
                /* Captured / Uploaded Image Preview */
                <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 aspect-video bg-slate-950">
                  <img src={imagePreview} alt="Incident site" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImagePreview(null)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-red-600 text-xs transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/75 text-[10px] font-mono text-slate-300">
                    📍 {coords[0]}° N, {coords[1]}° E
                  </div>
                </div>
              ) : (
                /* Capture Options: Camera OR Gallery */
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={startCamera}
                    className="p-3.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 bg-slate-50 dark:bg-slate-950/60 flex flex-col items-center justify-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    <Camera className="w-5 h-5 text-blue-500" />
                    <span className="font-medium">Take Photo</span>
                    <span className="text-[10px] font-mono text-slate-400">Camera</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 bg-slate-50 dark:bg-slate-950/60 flex flex-col items-center justify-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    <Upload className="w-5 h-5 text-emerald-500" />
                    <span className="font-medium">Upload from Gallery</span>
                    <span className="text-[10px] font-mono text-slate-400">Photos / Files</span>
                  </button>
                </div>
              )}
            </div>

            {/* Voice Recording / Description */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="text-slate-400 font-mono text-[11px] uppercase">
                  Describe the Problem:
                </label>
                <button
                  type="button"
                  onClick={toggleSpeechRecognition}
                  className={`flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-md transition-all ${
                    isRecording
                      ? 'bg-red-600 text-white animate-pulse font-bold'
                      : 'bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20'
                  }`}
                >
                  {isRecording ? <StopCircle className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  <span>{isRecording ? 'Listening...' : 'Voice Record'}</span>
                </button>
              </div>

              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Speak in Hindi/English or type (e.g. 'Road par bada gaddha hai', 'Sewage overflow near school')..."
                className="w-full p-2.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Run Triage Trigger */}
            {!triageResult && (
              <button
                type="button"
                onClick={handleAnalyzeWithGemini}
                disabled={isAnalyzing || (!description.trim() && !imagePreview)}
                className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all"
              >
                {isAnalyzing ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing Image &amp; Department Routing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Run AI Triage</span>
                  </>
                )}
              </button>
            )}

            {/* Triage Output Card */}
            {triageResult && (
              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-blue-500/30 space-y-2 text-xs animate-fade-in">
                <div className="flex items-center justify-between font-mono">
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {triageResult.department} · {triageResult.category}
                  </span>
                  <span className="text-red-500 font-semibold">
                    Severity {triageResult.severity}/5
                  </span>
                </div>

                <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                  {triageResult.officialMemoEnglish}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setTriageResult(null)}
                    className="text-slate-500 hover:text-slate-700 text-xs"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    className="px-4 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium flex items-center gap-1.5 shadow-sm"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Confirm &amp; Submit</span>
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
