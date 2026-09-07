import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  BookOpen,
  Bookmark,
  Trash2,
  Search,
  Sparkles,
  Calendar,
  Layers,
  ChevronRight,
  Calculator,
  CheckCircle,
} from 'lucide-react';
import { StudyMemoryItem, WhiteboardData } from '../types';

interface StudyMemoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMemoryItem?: (item: StudyMemoryItem) => void;
  memories: StudyMemoryItem[];
  onClearMemories?: () => void;
}

export const StudyMemoryDrawer: React.FC<StudyMemoryDrawerProps> = ({
  isOpen,
  onClose,
  onSelectMemoryItem,
  memories,
  onClearMemories,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  if (!isOpen) return null;

  const filteredMemories = memories.filter((item) => {
    const matchesSearch =
      item.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.question && item.question.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSubject = selectedSubject === 'all' || item.subject.toLowerCase() === selectedSubject.toLowerCase();

    return matchesSearch && matchesSubject;
  });

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex justify-end"
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          className="w-full max-w-md h-full bg-[#130b1c] border-l border-pink-500/30 flex flex-col justify-between shadow-2xl text-white p-4 sm:p-5 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3.5 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-pink-600 to-purple-600 flex items-center justify-center text-white shadow-md">
                <Bookmark className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                  <span>अनाया की स्टडी मेमोरी</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                </h3>
                <p className="text-xs text-pink-300/80">
                  {memories.length} सेव किए गए सवाल व टॉपिक
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors border border-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search and Filters */}
          <div className="space-y-2 mb-3">
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="सर्च करें (Math, Physics, Chemistry, English...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-pink-500/50"
              />
            </div>

            {/* Subject Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {['all', 'math', 'physics', 'chemistry', 'spoken_english', 'hindi'].map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubject(sub)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-medium uppercase tracking-wider transition whitespace-nowrap ${
                    selectedSubject === sub
                      ? 'bg-pink-600 text-white shadow-sm'
                      : 'bg-white/5 text-zinc-400 hover:bg-white/10'
                  }`}
                >
                  {sub === 'all' ? 'All' : sub.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Memory List */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-2.5">
            {filteredMemories.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-white/10 rounded-2xl">
                <BookOpen className="w-8 h-8 text-pink-400/40 mb-2" />
                <p className="text-xs text-zinc-400 font-medium">
                  अभी तक कोई टॉपिक मेमोरी में सेव नहीं हुआ है।
                </p>
                <p className="text-[10px] text-zinc-500 mt-1">
                  "Study Mode On" बोलें या कोई सवाल पूछें, अनाया सब कुछ याद रखेगी!
                </p>
              </div>
            ) : (
              filteredMemories.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectMemoryItem && onSelectMemoryItem(item)}
                  className="p-3 rounded-2xl bg-[#1d132b]/80 hover:bg-[#251838] border border-white/10 hover:border-pink-500/40 transition-all cursor-pointer group shadow-sm"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-pink-500/20 text-pink-300 border border-pink-500/30">
                      {item.subject}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1">
                      <Calendar className="w-2.5 h-2.5" />
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white group-hover:text-pink-300 transition-colors line-clamp-1 mb-1">
                    {item.topic}
                  </h4>

                  {item.question && (
                    <p className="text-[11px] text-zinc-300 line-clamp-2 italic mb-1.5 bg-black/30 p-1.5 rounded-lg border border-white/5">
                      "{item.question}"
                    </p>
                  )}

                  <p className="text-[11px] text-zinc-400 line-clamp-2">
                    {item.summary}
                  </p>

                  {item.keyPoints && item.keyPoints.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-white/5 flex flex-wrap gap-1">
                      {item.keyPoints.slice(0, 2).map((kp, idx) => (
                        <span
                          key={idx}
                          className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-zinc-300 line-clamp-1"
                        >
                          • {kp}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Bottom Action */}
          {memories.length > 0 && (
            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={onClearMemories}
                className="text-[11px] text-rose-400/80 hover:text-rose-300 flex items-center gap-1 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>मेमोरी साफ़ करें</span>
              </button>

              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-xs font-semibold text-white transition shadow-md"
              >
                वापस जाएँ
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
