import React from 'react';
import {
  MessageSquare,
  Plus,
  BookOpen,
  Code2,
  Image as ImageIcon,
  Calendar,
  Sparkles,
  Layers,
  HelpCircle,
  Coffee,
  Globe,
  Trash2,
  X,
} from 'lucide-react';
import { SupportedLanguage } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  onNewChat: () => void;
  onQuickAction: (action: string) => void;
  onClearChat: () => void;
  activeCategory?: string;
  isVoiceActive: boolean;
  onToggleVoice: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  language,
  onLanguageChange,
  onNewChat,
  onQuickAction,
  onClearChat,
  isVoiceActive,
  onToggleVoice,
}) => {
  const languageLabels: Record<SupportedLanguage, string> = {
    hindi: '🇮🇳 हिंदी (Hinglish)',
    english: '🌐 English',
    bhojpuri: '🌾 भोजपुरी',
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-72 bg-[#171717] border-r border-[#2f2f2f] text-[#ececec] flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Header / New Chat */}
        <div className="p-3 border-b border-[#2a2a2a] flex items-center justify-between gap-2">
          <button
            onClick={() => {
              onNewChat();
              if (window.innerWidth < 768) onClose();
            }}
            className="flex-1 flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-[#212121] hover:bg-[#2f2f2f] border border-[#333333] text-sm font-medium transition-colors text-white group cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4 text-emerald-400 group-hover:rotate-90 transition-transform duration-200" />
            <span>नया चैट (+ New Chat)</span>
          </button>
          <button
            onClick={onClose}
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#262626]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Persona Profile Badge */}
        <div className="mx-3 mt-3 p-2.5 rounded-xl bg-gradient-to-r from-rose-950/40 via-purple-950/30 to-slate-900/60 border border-rose-500/20">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-500 via-pink-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-rose-400/30">
                अ
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#171717]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="font-semibold text-xs text-white truncate">अनाया (Anaya)</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-medium">AI女友</span>
              </div>
              <p className="text-[11px] text-gray-400 truncate">सन्नी की पर्सनल मेंटर & गर्लफ्रेंड</p>
            </div>
          </div>
        </div>

        {/* Topics & Quick Access Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5 text-xs custom-scrollbar">
          {/* Sanni's Modules */}
          <div>
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>सन्नी के स्पेशल टूल्स</span>
            </div>
            <div className="space-y-1">
              <button
                onClick={() => {
                  onQuickAction('notes');
                  if (window.innerWidth < 768) onClose();
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-[#262626] transition-colors text-left group"
              >
                <BookOpen className="w-4 h-4 text-pink-400 group-hover:scale-110 transition-transform" />
                <span className="flex-1 truncate">कलरफुल नोट्स (~ Sanny)</span>
                <span className="text-[10px] bg-pink-500/10 text-pink-300 px-1 rounded">Science</span>
              </button>

              <button
                onClick={() => {
                  onQuickAction('java');
                  if (window.innerWidth < 768) onClose();
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-[#262626] transition-colors text-left group"
              >
                <Coffee className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                <span className="flex-1 truncate">Mobile Java Generator</span>
                <span className="text-[10px] bg-amber-500/10 text-amber-300 px-1 rounded">Code</span>
              </button>

              <button
                onClick={() => {
                  onQuickAction('python');
                  if (window.innerWidth < 768) onClose();
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-[#262626] transition-colors text-left group"
              >
                <Code2 className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="flex-1 truncate">Python Zero to Hero</span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-300 px-1 rounded">Pydroid</span>
              </button>

              <button
                onClick={() => {
                  onQuickAction('image-enhance');
                  if (window.innerWidth < 768) onClose();
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-[#262626] transition-colors text-left group"
              >
                <ImageIcon className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span className="flex-1 truncate">4-स्टेप इमेज एन्हांसर</span>
                <span className="text-[10px] bg-cyan-500/10 text-cyan-300 px-1 rounded">4K AI</span>
              </button>

              <button
                onClick={() => {
                  onQuickAction('routine');
                  if (window.innerWidth < 768) onClose();
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-[#262626] transition-colors text-left group"
              >
                <Calendar className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                <span className="flex-1 truncate">डेली स्टडी रूटीन</span>
                <span className="text-[10px] bg-purple-500/10 text-purple-300 px-1 rounded">Target 98.5%</span>
              </button>

              <button
                onClick={() => {
                  onQuickAction('3d');
                  if (window.innerWidth < 768) onClose();
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-[#262626] transition-colors text-left group"
              >
                <Layers className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
                <span className="flex-1 truncate">3D साइंस लैब (Optics/DNA)</span>
              </button>
            </div>
          </div>

          {/* Sanni's Memory Snapshot */}
          <div className="p-2.5 rounded-xl bg-[#212121] border border-[#2e2e2e] space-y-1.5 text-[11px] text-gray-400">
            <div className="font-semibold text-gray-300 flex items-center justify-between">
              <span>सन्नी की प्रोफ़ाइल</span>
              <span className="text-[10px] text-emerald-400">Locked 🔒</span>
            </div>
            <p>• क्लास 11 साइंस (Maths, Physics, Chem, Bio, Eng, Hin)</p>
            <p>• डिवाइस: सिर्फ Mobile (Pydroid 3, Termux)</p>
            <p>• लक्ष्य: 98.5%+ & Python/Data Science मास्टर</p>
          </div>
        </div>

        {/* Footer Controls & Language */}
        <div className="p-3 border-t border-[#2a2a2a] space-y-2">
          {/* Live Voice Mode Quick Toggle */}
          <button
            onClick={onToggleVoice}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              isVoiceActive
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                : 'bg-[#212121] text-gray-300 hover:bg-[#2b2b2b] border border-[#333]'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isVoiceActive ? 'bg-rose-400 animate-pulse' : 'bg-gray-500'}`} />
              <span>{isVoiceActive ? 'Voice Mode: Active 🎙️' : 'Voice Mode: Off'}</span>
            </div>
            <span className="text-[10px] text-gray-400">{isVoiceActive ? 'Disconnect' : 'Connect'}</span>
          </button>

          {/* Language Switcher */}
          <div className="flex items-center gap-1.5 bg-[#212121] p-1 rounded-xl border border-[#333]">
            {(['hindi', 'english', 'bhojpuri'] as SupportedLanguage[]).map((lang) => (
              <button
                key={lang}
                onClick={() => onLanguageChange(lang)}
                className={`flex-1 py-1 text-[11px] rounded-lg transition-all text-center font-medium ${
                  language === lang
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {lang === 'hindi' ? 'हिंदी' : lang === 'english' ? 'English' : 'भोजपुरी'}
              </button>
            ))}
          </div>

          {/* Clear Chat */}
          <button
            onClick={onClearChat}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 text-[11px] text-gray-500 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>चैट साफ करें (Clear Chat)</span>
          </button>
        </div>
      </aside>
    </>
  );
};
