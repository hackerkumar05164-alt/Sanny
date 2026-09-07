import React, { useState } from 'react';
import { ImagePromptData } from '../types';
import { Image, Copy, Check, X, Sparkles, Palette, Wand2 } from 'lucide-react';

interface ImagePromptModalProps {
  data: ImagePromptData | null;
  onClose: () => void;
}

export const ImagePromptModal: React.FC<ImagePromptModalProps> = ({ data, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!data) return null;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(data.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-2 rounded-2xl bg-zinc-950/95 border border-purple-500/40 p-4 shadow-2xl backdrop-blur-2xl text-white animate-fade-in z-30">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-purple-200 tracking-wide">
                {data.topic} - AI Image Prompt
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-semibold uppercase rounded-full bg-purple-950/80 border border-purple-500/30 text-purple-300">
                16:9 4K Poster
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Midjourney / DALL-E / Imagen 3 प्रॉम्प्ट जनरेटर
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopyPrompt}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/40 text-purple-200 text-xs font-medium transition-all shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">प्रॉम्प्ट कॉपी हुआ!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Prompt</span>
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

      {/* Main Prompt Box */}
      <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto">
        <div className="p-4 rounded-xl bg-gradient-to-tr from-purple-950/50 via-indigo-950/40 to-black border border-purple-500/30 text-xs text-purple-100 font-mono leading-relaxed shadow-inner">
          <div className="flex items-center gap-2 text-purple-300 font-sans font-bold text-[11px] mb-2 border-b border-purple-500/20 pb-1">
            <Wand2 className="w-3.5 h-3.5 text-purple-400" />
            <span>Master AI Prompt (Ready to Paste):</span>
          </div>
          <p className="whitespace-pre-wrap selection:bg-purple-500 selection:text-white">
            {data.prompt}
          </p>
        </div>

        {/* Feature badges */}
        <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
          <div className="p-2 rounded-lg bg-zinc-900/80 border border-white/5 text-zinc-300">
            <span className="text-purple-400 block font-bold">Aspect Ratio</span>
            <span>{data.aspectRatio || '16:9'}</span>
          </div>
          <div className="p-2 rounded-lg bg-zinc-900/80 border border-white/5 text-zinc-300">
            <span className="text-indigo-400 block font-bold">Watermark Text</span>
            <span>'Sanny' (Corner)</span>
          </div>
          <div className="p-2 rounded-lg bg-zinc-900/80 border border-white/5 text-zinc-300">
            <span className="text-rose-400 block font-bold">Recommended</span>
            <span>{data.suggestedAI || 'DALL-E 3 / Midjourney'}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
        <span className="text-[11px]">Designed for Sanny's AI Art & Posters</span>
        <div className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-200 font-bold text-xs">
          ✨ {data.authorSignature || '~ Sanny'}
        </div>
      </div>
    </div>
  );
};
