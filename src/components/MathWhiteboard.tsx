import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileSpreadsheet,
  CheckCircle2,
  Sparkles,
  X,
  Sigma,
  Lightbulb,
  Maximize2,
  BookOpen,
  Calculator,
} from 'lucide-react';

export interface MathNotepadData {
  question: string;
  topic?: string;
  formulasUsed?: string;
  steps: string[];
  finalAnswer: string;
  simpleExplanation?: string;
  timestamp: number;
}

interface MathWhiteboardProps {
  data: MathNotepadData | null;
  onClose: () => void;
}

export const MathWhiteboard: React.FC<MathWhiteboardProps> = ({ data, onClose }) => {
  if (!data) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="w-full max-w-2xl mx-auto px-4 z-40 my-2"
      >
        <div className="relative rounded-3xl bg-zinc-900/95 border border-rose-500/30 p-5 sm:p-6 shadow-2xl backdrop-blur-2xl overflow-hidden shadow-rose-950/40">
          
          {/* Subtle Cyber Grid Lines inside Notepad */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(to right, #f43f5e 1px, transparent 1px), linear-gradient(to bottom, #f43f5e 1px, transparent 1px)`,
              backgroundSize: '24px 24px',
            }}
          />

          {/* Header Bar */}
          <div className="relative flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-500/30 to-amber-500/20 border border-rose-500/30 flex items-center justify-center text-rose-300 shadow-md">
                <Calculator className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white tracking-tight">
                    अनाया का डिजिटल व्हाइटबोर्ड
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    {data.topic || 'गणित हल'}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  सन्नी का सवाल • स्टेप-बाय-स्टेप लाइव हल
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition-colors border border-white/5"
              title="नोटपैड बंद करें"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Question Box */}
          <div className="relative mb-4 p-3.5 rounded-2xl bg-zinc-950/80 border border-white/10 shadow-inner">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 mb-1">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>सन्नी का सवाल (Question):</span>
            </div>
            <p className="text-sm text-zinc-100 font-medium leading-relaxed">
              "{data.question}"
            </p>
          </div>

          {/* Formula Used */}
          {data.formulasUsed && (
            <div className="relative mb-4 p-3 rounded-2xl bg-rose-950/30 border border-rose-500/20 flex items-start gap-2.5">
              <Sigma className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-mono text-rose-300 font-semibold block">
                  प्रयुक्त सूत्र (Formula Applied):
                </span>
                <code className="text-xs font-mono text-rose-100 bg-rose-900/40 px-2 py-0.5 rounded mt-1 inline-block border border-rose-500/30">
                  {data.formulasUsed}
                </code>
              </div>
            </div>
          )}

          {/* Step-by-Step Calculation */}
          <div className="relative mb-4">
            <span className="text-[11px] font-mono text-zinc-400 block mb-2 font-semibold">
              स्टेप-बाय-स्टेप हल (Step-by-Step Calculation):
            </span>
            <div className="space-y-2">
              {data.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 text-xs text-zinc-200 bg-zinc-950/60 p-2.5 rounded-xl border border-white/5 font-sans"
                >
                  <span className="w-5 h-5 rounded-full bg-zinc-800 text-rose-300 font-mono text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5 border border-rose-500/20">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Final Answer Banner */}
          <div className="relative mb-3 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/50 to-emerald-900/30 border border-emerald-500/40 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-mono font-bold text-emerald-300">
                अंतिम सटीक उत्तर (Final Answer):
              </span>
            </div>
            <span className="text-base sm:text-lg font-bold font-mono text-emerald-200 px-3 py-1 bg-emerald-950/80 rounded-xl border border-emerald-500/50 shadow-inner">
              {data.finalAnswer}
            </span>
          </div>

          {/* Real-life Intuitive Explanation */}
          {data.simpleExplanation && (
            <div className="relative p-3 rounded-2xl bg-amber-950/20 border border-amber-500/20 flex items-start gap-2 text-xs text-amber-200/90">
              <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed italic">
                <strong className="not-italic text-amber-300">आसान भाषा में:</strong> {data.simpleExplanation}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
