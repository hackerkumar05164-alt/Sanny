import React, { useState } from 'react';
import { JavaCodeData } from '../types';
import { Coffee, Copy, Check, X, Terminal, Smartphone, Play, HelpCircle, Code2 } from 'lucide-react';

interface JavaCodeModalProps {
  data: JavaCodeData | null;
  onClose: () => void;
}

export const JavaCodeModal: React.FC<JavaCodeModalProps> = ({ data, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'pseudo' | 'explanation'>('code');

  if (!data) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(data.javaCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-2 rounded-2xl bg-zinc-950/95 border border-amber-500/40 p-4 shadow-2xl backdrop-blur-2xl text-white animate-fade-in z-30">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-md">
            <Coffee className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-amber-200 tracking-wide">
                {data.title}
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-semibold uppercase rounded-full bg-amber-950/80 border border-amber-500/30 text-amber-300">
                Java (Mobile-Friendly)
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">
              सन्नी का मोबाइल कोडिंग जनरेटर • Termux / Jvdroid Ready
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 text-xs font-medium transition-all shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">कोड कॉपी हुआ!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Code</span>
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

      {/* Tabs */}
      <div className="flex items-center gap-1.5 mb-3 p-1 rounded-xl bg-zinc-900 border border-white/5 text-xs">
        <button
          onClick={() => setActiveTab('code')}
          className={`flex-1 py-1.5 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'code'
              ? 'bg-amber-500/20 text-amber-200 border border-amber-400/40 font-bold'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Java Code</span>
        </button>

        <button
          onClick={() => setActiveTab('pseudo')}
          className={`flex-1 py-1.5 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'pseudo'
              ? 'bg-amber-500/20 text-amber-200 border border-amber-400/40 font-bold'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Pseudo-Code</span>
        </button>

        <button
          onClick={() => setActiveTab('explanation')}
          className={`flex-1 py-1.5 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'explanation'
              ? 'bg-amber-500/20 text-amber-200 border border-amber-400/40 font-bold'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Hinglish Explanation</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="max-h-[320px] overflow-y-auto">
        {activeTab === 'code' && (
          <div className="flex flex-col gap-2.5">
            <div className="relative rounded-xl bg-black/80 border border-zinc-800 p-3.5 font-mono text-xs text-amber-100 overflow-x-auto leading-relaxed shadow-inner">
              <pre>{data.javaCode}</pre>
            </div>

            {/* Mobile Run Guide badge */}
            <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-white/5 flex items-center gap-2 text-xs text-zinc-300">
              <Smartphone className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>
                <strong>Mobile Run Tip:</strong> {data.mobileRunTip || 'Pydroid 3, Termux (`javac File.java && java File`), या Jvdroid में सीधे पेस्ट करके चलाएं।'}
              </span>
            </div>
          </div>
        )}

        {activeTab === 'pseudo' && (
          <div className="p-3.5 rounded-xl bg-black/60 border border-zinc-800 font-mono text-xs text-zinc-300 leading-relaxed">
            <div className="text-[11px] font-bold text-amber-400 mb-2 uppercase tracking-wide">
              // Step-by-Step Logic Outline
            </div>
            <pre className="whitespace-pre-wrap">{data.pseudoCode}</pre>
          </div>
        )}

        {activeTab === 'explanation' && (
          <div className="flex flex-col gap-3">
            <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-white/10 text-xs text-zinc-200 leading-relaxed">
              <div className="font-bold text-amber-300 mb-1.5">अनाया का Hinglish विवरण:</div>
              <p className="whitespace-pre-wrap">{data.explanationHinglish}</p>
            </div>

            {data.sampleInputOutput && (
              <div className="p-3 rounded-xl bg-black/60 border border-zinc-800 font-mono text-xs text-emerald-300">
                <div className="text-[11px] text-zinc-400 font-sans font-bold mb-1">
                  Example Test Run (Input/Output):
                </div>
                <pre className="whitespace-pre-wrap text-emerald-200">{data.sampleInputOutput}</pre>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
        <span className="text-[11px]">Mobile Java Generator • Anaya AI</span>
        <div className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-200 font-bold text-xs">
          ✨ {data.authorSignature || '~ Sanny'}
        </div>
      </div>
    </div>
  );
};
