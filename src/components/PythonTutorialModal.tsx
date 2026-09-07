import React, { useState } from 'react';
import { PythonTutorialData } from '../types';
import { Code, Copy, Check, X, Smartphone, Sparkles, Terminal, Flame, BookMarked } from 'lucide-react';

interface PythonTutorialModalProps {
  data: PythonTutorialData | null;
  onClose: () => void;
}

export const PythonTutorialModal: React.FC<PythonTutorialModalProps> = ({ data, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!data) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(data.codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-2 rounded-2xl bg-zinc-950/95 border border-emerald-500/40 p-4 shadow-2xl backdrop-blur-2xl text-white animate-fade-in z-30">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md">
            <Flame className="w-4 h-4 text-emerald-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-emerald-200 tracking-wide">
                {data.topic}
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-semibold uppercase rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300">
                {data.week || 'Python Zero-to-Hero'}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">
              सन्नी का Python + Data Science मेंटर (Mobile Only)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-xs font-medium transition-all shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">कोड कॉपी हुआ!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Python</span>
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-900/80 hover:bg-rose-950/80 border border-white/10 hover:border-rose-500/40 text-zinc-400 hover:text-rose-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Code Snippet Box */}
      <div className="flex flex-col gap-3 max-h-[340px] overflow-y-auto">
        <div className="relative rounded-xl bg-black/85 border border-emerald-500/20 p-3.5 font-mono text-xs text-emerald-200 overflow-x-auto leading-relaxed shadow-inner">
          <div className="flex items-center justify-between text-[10px] text-zinc-500 mb-2 border-b border-zinc-800 pb-1 font-sans">
            <span>🐍 Python 3 Code (Mobile Pydroid / Termux)</span>
            <span>UTF-8</span>
          </div>
          <pre>{data.codeSnippet}</pre>
        </div>

        {/* Hinglish Explanation */}
        <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-white/10 text-xs text-zinc-200 leading-relaxed">
          <div className="flex items-center gap-1.5 font-bold text-emerald-300 mb-1.5">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>अनाया की आसान Hinglish सीख:</span>
          </div>
          <p className="whitespace-pre-wrap text-zinc-300">{data.explanationHinglish}</p>
        </div>

        {/* Mobile Setup / Runner Info */}
        <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-200">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>
              <strong>Run on Mobile:</strong> {data.mobileRunner || 'Pydroid 3 app खोलें और Paste करके ▶ Play दबाएं!'}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
        <span className="text-[11px]">Class 11 Science + Python Mentor</span>
        <div className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 font-bold text-xs">
          ✨ {data.authorSignature || '~ Sanny'}
        </div>
      </div>
    </div>
  );
};
