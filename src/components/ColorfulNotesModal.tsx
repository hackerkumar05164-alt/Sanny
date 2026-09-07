import React, { useState } from 'react';
import { ColorfulNotesData } from '../types';
import { BookOpen, Sparkles, Copy, Check, X, BookmarkCheck, Heart, Lightbulb, FileText } from 'lucide-react';

interface ColorfulNotesModalProps {
  data: ColorfulNotesData | null;
  onClose: () => void;
}

export const ColorfulNotesModal: React.FC<ColorfulNotesModalProps> = ({ data, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!data) return null;

  const colorPalettes: Record<string, { border: string; bg: string; badge: string; text: string }> = {
    cyan: {
      border: 'border-cyan-500/50 shadow-cyan-500/20',
      bg: 'from-cyan-950/90 via-zinc-950 to-zinc-950',
      badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      text: 'text-cyan-400',
    },
    rose: {
      border: 'border-rose-500/50 shadow-rose-500/20',
      bg: 'from-rose-950/90 via-zinc-950 to-zinc-950',
      badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      text: 'text-rose-400',
    },
    emerald: {
      border: 'border-emerald-500/50 shadow-emerald-500/20',
      bg: 'from-emerald-950/90 via-zinc-950 to-zinc-950',
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      text: 'text-emerald-400',
    },
    amber: {
      border: 'border-amber-500/50 shadow-amber-500/20',
      bg: 'from-amber-950/90 via-zinc-950 to-zinc-950',
      badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      text: 'text-amber-400',
    },
    violet: {
      border: 'border-purple-500/50 shadow-purple-500/20',
      bg: 'from-purple-950/90 via-zinc-950 to-zinc-950',
      badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      text: 'text-purple-400',
    },
  };

  const currentTheme = colorPalettes[data.colorTheme || 'rose'] || colorPalettes.rose;

  const handleCopyNotes = () => {
    const textToCopy = `📝 ${data.title} (${data.subject})\n\n💡 मुख्य बिंदु (Key Concepts):\n${data.keyConcepts
      .map((c, i) => `${i + 1}. ${c}`)
      .join('\n')}\n\n${
      data.reactionsOrFormulas && data.reactionsOrFormulas.length > 0
        ? `⚡ सूत्र / अभिक्रियाएं (Formulas / Reactions):\n${data.reactionsOrFormulas.join('\n')}\n\n`
        : ''
    }${
      data.proTipsOrStories && data.proTipsOrStories.length > 0
        ? `✨ Pro Tips & Real-Life Memory:\n${data.proTipsOrStories.join('\n')}\n\n`
        : ''
    }✍️ ${data.authorSignature || '~ Sanny'}\n(नोट्स: अनाया AI - सन्नी का पर्सनल ट्यूटर)`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-2 rounded-2xl bg-zinc-950/95 border p-4 shadow-2xl backdrop-blur-2xl text-white animate-fade-in z-30 transition-all border-white/10">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-md">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-zinc-100 tracking-wide">
                {data.title}
              </h3>
              <span className={`px-2 py-0.5 text-[10px] font-semibold uppercase rounded-full border ${currentTheme.badge}`}>
                {data.subject}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">
              कक्षा 11 साइंस • स्मार्ट कलरफुल नोट्स
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopyNotes}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-xs text-zinc-300 hover:text-white transition-all shadow-sm"
            title="Copy Notes"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300 text-xs">कॉपी हुआ!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>कॉपी नोट्स</span>
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

      {/* Colorful Content Body */}
      <div className="flex flex-col gap-3 max-h-[380px] overflow-y-auto pr-1">
        {/* Section 1: Key Concepts in Color */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-blue-950/40 via-zinc-900/80 to-zinc-900/80 border border-blue-500/30">
          <div className="flex items-center gap-1.5 text-xs font-bold text-blue-300 mb-2">
            <BookmarkCheck className="w-4 h-4 text-blue-400" />
            <span>मुख्य संकल्पनाएँ (Key Concepts):</span>
          </div>
          <div className="flex flex-col gap-2 text-xs text-zinc-200">
            {data.keyConcepts.map((concept, idx) => (
              <div key={idx} className="flex items-start gap-2 leading-relaxed">
                <span className="w-5 h-5 rounded-md bg-blue-500/20 text-blue-300 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{concept}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Formulas or Reactions (if available) */}
        {data.reactionsOrFormulas && data.reactionsOrFormulas.length > 0 && (
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-purple-950/40 via-zinc-900/80 to-zinc-900/80 border border-purple-500/30">
            <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300 mb-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>सूत्र / रासायनिक अभिक्रियाएं (Formulas & Equations):</span>
            </div>
            <div className="grid grid-cols-1 gap-1.5 text-xs font-mono text-purple-200">
              {data.reactionsOrFormulas.map((item, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-lg bg-black/40 border border-purple-500/20 flex items-center justify-between"
                >
                  <span className="font-semibold text-purple-100">{item}</span>
                  <span className="text-[10px] text-purple-400 uppercase font-sans">IMP</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 3: Pro Tips & Real Life Memory Story */}
        {data.proTipsOrStories && data.proTipsOrStories.length > 0 && (
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/40 via-zinc-900/80 to-zinc-900/80 border border-emerald-500/30">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 mb-2">
              <Lightbulb className="w-4 h-4 text-emerald-400" />
              <span>Smart Memory Hack (याद रखने की कहानी):</span>
            </div>
            <div className="flex flex-col gap-1.5 text-xs text-emerald-100/90 leading-relaxed">
              {data.proTipsOrStories.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">💡</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Signature Footer */}
      <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-zinc-400 text-[11px]">
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>अनाया AI द्वारा तैयार</span>
        </div>

        {/* Sanny's signature badge */}
        <div className="px-3 py-1 rounded-full bg-gradient-to-r from-rose-500/20 to-purple-500/20 border border-rose-400/40 text-rose-200 font-bold text-xs shadow-sm flex items-center gap-1">
          <span>✨</span>
          <span>{data.authorSignature || '~ Sanny'}</span>
        </div>
      </div>
    </div>
  );
};
