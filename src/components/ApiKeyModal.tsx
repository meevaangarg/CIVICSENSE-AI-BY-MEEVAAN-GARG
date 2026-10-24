import React, { useState } from 'react';
import { CivicGeminiService } from '../services/geminiService';
import { Key, X, CheckCircle, ExternalLink, ShieldCheck } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const [keyInput, setKeyInput] = useState('');
  const [saved, setSaved] = useState(false);
  const isConfigured = CivicGeminiService.hasApiKey();

  if (!isOpen) return null;

  const handleSave = () => {
    if (keyInput.trim()) {
      CivicGeminiService.setApiKey(keyInput);
    }
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  const handleClear = () => {
    CivicGeminiService.setApiKey('');
    setKeyInput('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl p-6 text-slate-900 dark:text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20">
            <Key className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold font-['Space_Grotesk'] text-slate-900 dark:text-white">
              Gemini API Key
            </h3>
            <p className="text-xs text-slate-500">Multimodal AI Engine Settings</p>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="mb-4 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono">
          <span className="text-slate-500">Status:</span>
          {isConfigured ? (
            <span className="flex items-center gap-1.5 text-emerald-500 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Connected &amp; Active
            </span>
          ) : (
            <span className="text-slate-400">
              Demo Simulation Mode
            </span>
          )}
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">
              Custom Key (Optional):
            </label>
            <input
              type="password"
              placeholder="Paste new Gemini API key..."
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              className="w-full px-3 py-1.5 text-xs font-mono rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
              Stored privately in browser
            </span>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 hover:underline flex items-center gap-0.5"
            >
              Get Free Key <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="pt-2 flex items-center justify-between">
            {CivicGeminiService.isCustomKeySet() ? (
              <button
                onClick={handleClear}
                className="text-xs text-red-500 hover:underline"
              >
                Clear Custom Key
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-all shadow-sm flex items-center gap-1"
              >
                {saved ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Saved</span>
                  </>
                ) : (
                  <span>Save</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
