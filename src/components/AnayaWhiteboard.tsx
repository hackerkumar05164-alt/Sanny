import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Sigma,
  Lightbulb,
  CheckCircle2,
  BookOpen,
  HelpCircle,
  Volume2,
  Bookmark,
  Share2,
  Sparkles,
  Atom,
  Flame,
  Languages,
  Layers,
  Check,
  Send,
  Eraser,
  PenTool,
  RotateCcw,
  Mic,
} from 'lucide-react';
import { WhiteboardData, StudySubject } from '../types';

interface AnayaWhiteboardProps {
  data: WhiteboardData | null;
  onClose?: () => void;
  onClear?: () => void;
  onAskDoubt?: (doubt: string) => void;
  onSaveToMemory?: (data: WhiteboardData) => void;
  onQuickAsk?: (questionText: string) => void;
  isEmbeddedInPhone?: boolean;
}

export const AnayaWhiteboard: React.FC<AnayaWhiteboardProps> = ({
  data,
  onClose,
  onClear,
  onAskDoubt,
  onSaveToMemory,
  onQuickAsk,
  isEmbeddedInPhone = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [selectedStep, setSelectedStep] = useState<number | null>(null);
  const [activeMarkerColor, setActiveMarkerColor] = useState<'blue' | 'black' | 'red' | 'green'>('blue');
  const [inputQuestion, setInputQuestion] = useState('');
  const [visibleStepCount, setVisibleStepCount] = useState<number>(10);

  // Progressive writing effect when new data arrives
  useEffect(() => {
    if (data?.steps) {
      setVisibleStepCount(1);
      const timer = setInterval(() => {
        setVisibleStepCount((prev) => {
          if (prev < data.steps.length) {
            return prev + 1;
          }
          clearInterval(timer);
          return prev;
        });
      }, 400);
      return () => clearInterval(timer);
    }
  }, [data?.id, data?.steps?.length]);

  const getSubjectInfo = (subject?: StudySubject) => {
    switch (subject) {
      case 'math':
        return { label: 'गणित (Mathematics)', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200', icon: Sigma };
      case 'physics':
        return { label: 'भौतिकी (Physics)', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', icon: Atom };
      case 'chemistry':
        return { label: 'रसायन विज्ञान (Chemistry)', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', icon: Flame };
      case 'spoken_english':
        return { label: 'Spoken English', color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200', icon: Languages };
      case 'english':
        return { label: 'English Grammar', color: 'text-cyan-700', bg: 'bg-cyan-50 border-cyan-200', icon: BookOpen };
      case 'hindi':
        return { label: 'हिंदी व्याकरण', color: 'text-rose-700', bg: 'bg-rose-50 border-rose-200', icon: Layers };
      default:
        return { label: 'स्मार्ट व्हाइटबोर्ड (Whiteboard)', color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200', icon: BookOpen };
    }
  };

  const subjectInfo = getSubjectInfo(data?.subject);
  const SubjectIcon = subjectInfo.icon;

  const handleCopy = () => {
    if (!data) return;
    const text = `📝 ${data.topic || 'व्हाइटबोर्ड'}\n\n❓ सवाल:\n${data.question}\n\n📐 प्रयुक्त सूत्र / नियम:\n${data.formulasOrRules || 'N/A'}\n\n🪜 हल:\n${data.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n✅ अंतिम उत्तर:\n${data.finalAnswer}\n\n💡 व्याख्या:\n${data.simpleExplanation || ''}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    if (data && onSaveToMemory) {
      onSaveToMemory(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  };

  const handleStepDoubt = (stepNum: number, stepText: string) => {
    setSelectedStep(stepNum);
    if (onAskDoubt) {
      onAskDoubt(`अनाया, मुझे स्टेप ${stepNum} ("${stepText}") समझ नहीं आया, कृपया व्हाइटबोर्ड पर इसे और आसान उदाहरण से समझाओ।`);
    }
  };

  const handleSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuestion.trim()) return;
    if (onQuickAsk) {
      onQuickAsk(inputQuestion.trim());
      setInputQuestion('');
    }
  };

  return (
    <div
      id="anaya-whiteboard-surface"
      className={`relative w-full h-full flex flex-col justify-between rounded-t-[32px] sm:rounded-t-[36px] bg-[#fbfcfe] text-slate-800 shadow-[0_-10px_35px_rgba(0,0,0,0.4)] border-t-4 border-l border-r border-[#d4d8e2] overflow-hidden transition-all select-text`}
      style={{
        backgroundImage: `
          radial-gradient(#d1d5db 0.75px, transparent 0.75px),
          linear-gradient(to bottom, #ffffff 0%, #f7f9fb 100%)
        `,
        backgroundSize: '18px 18px, 100% 100%',
      }}
    >
      {/* Top Dry-Erase Whiteboard Aluminum Frame & Status Header */}
      <div className="shrink-0 w-full px-3.5 py-2 sm:px-4 sm:py-2.5 bg-gradient-to-r from-slate-100 via-slate-50 to-slate-200 border-b border-slate-300 flex items-center justify-between shadow-xs">
        
        {/* Board Title & Subject Badge */}
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs shrink-0">
            <PenTool className="w-3.5 h-3.5" />
          </div>
          
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-xs font-bold text-slate-800 tracking-tight font-sans shrink-0">
              Whiteboard
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold border truncate ${subjectInfo.bg} ${subjectInfo.color}`}>
              {subjectInfo.label}
            </span>
          </div>
        </div>

        {/* Marker Color Tray & Quick Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Marker Colors Selector */}
          <div className="flex items-center bg-white px-1.5 py-0.5 rounded-full border border-slate-300 shadow-2xs gap-1">
            <button
              onClick={() => setActiveMarkerColor('blue')}
              className={`w-3.5 h-3.5 rounded-full bg-blue-600 transition-transform ${activeMarkerColor === 'blue' ? 'scale-125 ring-2 ring-blue-300' : 'opacity-70 hover:opacity-100'}`}
              title="Blue Marker"
            />
            <button
              onClick={() => setActiveMarkerColor('black')}
              className={`w-3.5 h-3.5 rounded-full bg-slate-900 transition-transform ${activeMarkerColor === 'black' ? 'scale-125 ring-2 ring-slate-400' : 'opacity-70 hover:opacity-100'}`}
              title="Black Marker"
            />
            <button
              onClick={() => setActiveMarkerColor('red')}
              className={`w-3.5 h-3.5 rounded-full bg-rose-600 transition-transform ${activeMarkerColor === 'red' ? 'scale-125 ring-2 ring-rose-300' : 'opacity-70 hover:opacity-100'}`}
              title="Red Marker"
            />
            <button
              onClick={() => setActiveMarkerColor('green')}
              className={`w-3.5 h-3.5 rounded-full bg-emerald-600 transition-transform ${activeMarkerColor === 'green' ? 'scale-125 ring-2 ring-emerald-300' : 'opacity-70 hover:opacity-100'}`}
              title="Green Marker"
            />
          </div>

          {/* Clear / Erase Whiteboard */}
          {onClear && (
            <button
              onClick={onClear}
              className="p-1 rounded-lg bg-white hover:bg-slate-50 text-slate-600 border border-slate-300 shadow-2xs text-[10px] font-medium flex items-center gap-1 cursor-pointer transition-colors"
              title="व्हाइटबोर्ड साफ़ करें"
            >
              <Eraser className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">साफ़ करें</span>
            </button>
          )}

          {/* Save to Memory */}
          {data && (
            <button
              onClick={handleSave}
              className="p-1 rounded-lg bg-white hover:bg-slate-50 text-slate-600 border border-slate-300 shadow-2xs text-[10px] font-medium flex items-center gap-1 cursor-pointer transition-colors"
              title="अनाया की मेमोरी में सेव करें"
            >
              {saved ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Bookmark className="w-3.5 h-3.5 text-indigo-600" />}
              <span className="hidden sm:inline">{saved ? 'Saved' : 'Save'}</span>
            </button>
          )}

          {/* Copy */}
          {data && (
            <button
              onClick={handleCopy}
              className="p-1 rounded-lg bg-white hover:bg-slate-50 text-slate-600 border border-slate-300 shadow-2xs cursor-pointer transition-colors"
              title="हल कॉपी करें"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-slate-600" />}
            </button>
          )}

          {/* Close / Hide Whiteboard */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-300 shadow-2xs cursor-pointer transition-colors"
              title="व्हाइटबोर्ड हटाएँ"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Whiteboard Writing Canvas Area (Scrollable content) */}
      <div className="flex-1 w-full p-3 sm:p-4 overflow-y-auto space-y-3 font-sans select-text">
        {data ? (
          <>
            {/* 1. TOPIC & QUESTION WRITTEN BY ANAYA (Marker Ink Style) */}
            <div className="p-3 rounded-2xl bg-white border border-blue-200/90 shadow-xs relative">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5 text-blue-700 font-bold text-xs">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                  <span className="font-mono uppercase tracking-wider">सवाल / Question</span>
                </div>
                {data.topic && (
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-800 rounded-md border border-blue-100">
                    {data.topic}
                  </span>
                )}
              </div>

              <p className="text-sm font-semibold text-slate-900 leading-snug tracking-tight font-sans">
                {data.question}
              </p>
            </div>

            {/* 2. FORMULAS / RULES / THEOREMS (Red or Purple Marker Box) */}
            {data.formulasOrRules && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-2.5 rounded-xl bg-rose-50/80 border border-rose-200 text-rose-950 flex items-start gap-2 shadow-2xs"
              >
                <Sigma className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="w-full">
                  <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block font-mono">
                    मुख्य सूत्र / नियम (Formula & Law):
                  </span>
                  <div className="text-xs font-mono font-bold text-rose-900 bg-white/90 px-2 py-1 rounded-md mt-1 border border-rose-200 overflow-x-auto">
                    {data.formulasOrRules}
                  </div>
                </div>
              </motion.div>
            )}

            {/* 3. STEP-BY-STEP HANDWRITTEN RESOLUTION ON WHITEBOARD */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 px-0.5">
                <span className="flex items-center gap-1">
                  <span>चरणबद्ध हल (Step-by-Step Solution):</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  {data.steps.length} Steps
                </span>
              </div>

              <div className="space-y-1.5">
                {data.steps.map((step, idx) => {
                  const stepNum = idx + 1;
                  const isVisible = stepNum <= visibleStepCount;
                  const isSelected = selectedStep === stepNum;

                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: isVisible ? 1 : 0.4, x: 0 }}
                      transition={{ duration: 0.25 }}
                      className={`p-2.5 rounded-xl border transition-all text-xs flex items-start justify-between gap-2 shadow-2xs ${
                        isSelected
                          ? 'bg-blue-50 border-blue-400 text-blue-950 ring-1 ring-blue-300'
                          : 'bg-white border-slate-200 text-slate-800 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-start gap-2 min-w-0">
                        <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                          {stepNum}
                        </span>
                        <span className="font-medium text-slate-800 leading-relaxed font-sans">
                          {step}
                        </span>
                      </div>

                      {/* Step Doubt Button */}
                      <button
                        onClick={() => handleStepDoubt(stepNum, step)}
                        className="shrink-0 p-1 px-1.5 rounded-md bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 border border-slate-200 text-[10px] font-medium flex items-center gap-0.5 transition-colors cursor-pointer"
                        title="इस स्टेप को आसान भाषा में समझें"
                      >
                        <HelpCircle className="w-3 h-3 text-amber-600" />
                        <span className="hidden sm:inline">डाउट?</span>
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* 4. FINAL ANSWER HIGHLIGHT (Green Box Marker) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3 rounded-2xl bg-emerald-50 border-2 border-emerald-500/80 text-emerald-950 flex items-center justify-between shadow-xs"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 block">
                    अंतिम उत्तर / Final Answer:
                  </span>
                  <span className="text-sm font-extrabold text-emerald-900 font-mono">
                    {data.finalAnswer}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-600 text-white rounded-full shadow-2xs">
                सत्यापित ✅
              </span>
            </motion.div>

            {/* 5. SIMPLE EXPLANATION & INTUITION */}
            {data.simpleExplanation && (
              <div className="p-2.5 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-950 text-xs flex items-start gap-2 shadow-2xs">
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <span className="font-bold text-amber-800 block text-[10px] uppercase font-mono mb-0.5">
                    आसान भाषा में समझ (Simple Intuition):
                  </span>
                  {data.simpleExplanation}
                </div>
              </div>
            )}

            {/* 6. DOUBT RESOLVED CALLOUT */}
            {data.doubtResolution && (
              <div className="p-2.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-950 text-xs flex items-start gap-2 shadow-2xs">
                <Volume2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5 animate-pulse" />
                <div className="leading-relaxed">
                  <span className="font-bold text-purple-800 block text-[10px] uppercase font-mono mb-0.5">
                    अनाया का नया स्पष्टीकरण:
                  </span>
                  {data.doubtResolution}
                </div>
              </div>
            )}
          </>
        ) : (
          /* EMPTY WHITEBOARD STATE (Clean board ready for writing) */
          <div className="h-full min-h-[220px] flex flex-col items-center justify-center text-center p-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center mb-2 shadow-2xs">
              <PenTool className="w-6 h-6 text-indigo-600" />
            </div>
            
            <h4 className="text-sm font-bold text-slate-800 mb-1">
              अनाया का स्मार्ट स्टडी व्हाइटबोर्ड
            </h4>
            <p className="text-xs text-slate-500 max-w-xs mb-3.5 leading-relaxed">
              माइक पर बोलकर या नीचे लिखकर कोई भी सवाल पूछें—अनाया इसी व्हाइटबोर्ड पर स्टेप-बाय-स्टेप हल करेगी और समझाएगी!
            </p>

            {/* Quick Sample Questions to Try */}
            <div className="w-full max-w-sm flex items-center justify-center gap-1.5 flex-wrap">
              <button
                onClick={() =>
                  onQuickAsk &&
                  onQuickAsk('अनाया, समानांतर श्रेणी (AP) का n-वां पद और 10 पदों का योग व्हाइटबोर्ड पर निकालो।')
                }
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-medium shadow-2xs transition-all active:scale-95 cursor-pointer"
              >
                📐 AP का n-वां पद
              </button>

              <button
                onClick={() =>
                  onQuickAsk &&
                  onQuickAsk('अनाया, न्यूटन का दूसरा नियम F=ma और 5kg द्रव्यमान पर 10N बल का त्वरण व्हाइटबोर्ड पर हल करो।')
                }
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-medium shadow-2xs transition-all active:scale-95 cursor-pointer"
              >
                ⚡ F=ma न्यूमेरिकल
              </button>

              <button
                onClick={() =>
                  onQuickAsk &&
                  onQuickAsk('अनाया, 18g H2O में मोल्स और कुल अणुओं की संख्या व्हाइटबोर्ड पर निकालो।')
                }
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-medium shadow-2xs transition-all active:scale-95 cursor-pointer"
              >
                🧪 Mole Concept
              </button>

              <button
                onClick={() =>
                  onQuickAsk &&
                  onQuickAsk('अनाया, Spoken English में Self Introduction के 5 बेहतरीन वाक्य व्हाइटबोर्ड पर सिखाओ।')
                }
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-medium shadow-2xs transition-all active:scale-95 cursor-pointer"
              >
                🎙️ Self Introduction
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Whiteboard Marker Shelf & Interactive Doubt Bar */}
      <div className="shrink-0 w-full p-2 sm:p-2.5 bg-slate-100 border-t border-slate-300 flex flex-col gap-1.5">
        {/* Doubt Button if data is active */}
        {data && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (onAskDoubt) {
                  onAskDoubt('अनाया, मुझे इस पूरे सवाल का कॉन्सेप्ट एक बार फिर से सरल भाषा और उदाहरण के साथ व्हाइटबोर्ड पर समझाओ।');
                }
              }}
              className="flex-1 py-1.5 px-3 rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-indigo-600 hover:from-rose-700 hover:to-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-98 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-300" />
              <span>मुझे समझ नहीं आया (अनाया से और आसान तरीका माँगें) 🎙️</span>
            </button>
          </div>
        )}

        {/* Quick Type & Ask Bar */}
        <form onSubmit={handleSubmitQuestion} className="w-full flex items-center gap-1.5">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              placeholder="व्हाइटबोर्ड पर कोई भी सवाल पूछें..."
              className="w-full px-3 py-1.5 text-xs bg-white text-slate-800 placeholder-slate-400 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-inner"
            />
          </div>
          <button
            type="submit"
            disabled={!inputQuestion.trim()}
            className="p-1.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-semibold flex items-center gap-1 shadow-xs transition-all cursor-pointer"
            title="पूछें"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">पूछें</span>
          </button>
        </form>
      </div>
    </div>
  );
};
