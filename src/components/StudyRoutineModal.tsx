import React from 'react';
import { StudyRoutineData } from '../types';
import { Calendar, Clock, Target, CheckCircle2, Zap, X, Heart, Sparkles } from 'lucide-react';

interface StudyRoutineModalProps {
  data: StudyRoutineData | null;
  onClose: () => void;
}

export const StudyRoutineModal: React.FC<StudyRoutineModalProps> = ({ data, onClose }) => {
  if (!data) return null;

  return (
    <div className="w-full max-w-2xl mx-auto my-2 rounded-2xl bg-zinc-950/95 border border-blue-500/40 p-4 shadow-2xl backdrop-blur-2xl text-white animate-fade-in z-30">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-500 to-cyan-600 flex items-center justify-center text-white shadow-md">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-blue-200 tracking-wide">
                {data.title || 'सन्नी का डेली स्मार्ट रूटीन'}
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-semibold uppercase rounded-full bg-blue-950/80 border border-blue-500/30 text-blue-300">
                {data.dayType === 'sunday' ? 'रविवार महा-रिवीजन' : 'Class 11 Science + Coding'}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">
              लक्ष्य: कक्षा 12 में 98.5%+ • Python + Data Science Master
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg bg-zinc-900/80 hover:bg-rose-950/80 border border-white/10 hover:border-rose-500/40 text-zinc-400 hover:text-rose-300 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Routine Slots List */}
      <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
        {data.slots.map((slot, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/80 border border-white/5 hover:border-blue-500/30 transition-all text-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-base">
                {slot.icon || '📚'}
              </div>
              <div>
                <div className="font-semibold text-zinc-100">{slot.activity}</div>
                <div className="text-[11px] text-zinc-400 flex items-center gap-1.5 mt-0.5">
                  <Clock className="w-3 h-3 text-blue-400" />
                  <span>{slot.time}</span>
                </div>
              </div>
            </div>

            <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-zinc-300 text-[10px] font-mono">
              {slot.subject}
            </span>
          </div>
        ))}
      </div>

      {/* Motivation Note */}
      <div className="mt-3 p-3 rounded-xl bg-blue-950/40 border border-blue-500/30 text-xs text-blue-200 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-blue-400 flex-shrink-0" />
        <span>{data.motivation || 'छोटा-छोटा रोज़ का अभ्यास सन्नी को टॉपर और मास्टर बनाएगा!'}</span>
      </div>

      {/* Footer */}
      <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
        <span className="text-[11px]">Personal Mentor Anaya</span>
        <div className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-200 font-bold text-xs">
          ✨ ~ Sanny
        </div>
      </div>
    </div>
  );
};
