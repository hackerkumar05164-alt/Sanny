import React, { useState, useEffect } from 'react';
import { ScreenControlData } from '../types';
import { Smartphone, ArrowDown, ArrowUp, CornerDownLeft, Home, MousePointer, Keyboard, Instagram, Youtube, MessageCircle, Chrome, CheckCircle2, X } from 'lucide-react';

interface ScreenControlHUDProps {
  data: ScreenControlData | null;
  onClose: () => void;
  onTriggerAction?: (action: ScreenControlData['action'], app?: string) => void;
}

export const ScreenControlHUD: React.FC<ScreenControlHUDProps> = ({
  data,
  onClose,
  onTriggerAction,
}) => {
  const [activeApp, setActiveApp] = useState<string>(data?.targetApp || 'Instagram');
  const [scrollY, setScrollY] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [typedText, setTypedText] = useState(data?.text || '');
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 });
  const [isClicking, setIsClicking] = useState(false);
  const [followed, setFollowed] = useState(false);

  useEffect(() => {
    if (!data) return;

    if (data.action === 'open_app' && data.targetApp) {
      setActiveApp(data.targetApp);
    } else if (data.action === 'scroll') {
      if (data.direction === 'down' || !data.direction) {
        setScrollY((prev) => Math.min(prev + 120, 400));
      } else {
        setScrollY((prev) => Math.max(prev - 120, 0));
      }
    } else if (data.action === 'click') {
      setIsClicking(true);
      setTimeout(() => setIsClicking(false), 800);
    } else if (data.action === 'type_text' && data.text) {
      setIsTyping(true);
      setTypedText(data.text);
      setTimeout(() => setIsTyping(false), 1500);
    } else if (data.action === 'home') {
      setActiveApp('Home');
      setScrollY(0);
    }
  }, [data]);

  if (!data) return null;

  return (
    <div className="w-full max-w-md mx-auto my-2 rounded-2xl bg-zinc-950/95 border border-indigo-500/40 p-3.5 shadow-2xl backdrop-blur-2xl text-white animate-fade-in z-30">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-400">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-indigo-200">
              लाइव स्क्रीन कंट्रोल (Live Screen Simulator)
            </h4>
            <p className="text-[11px] text-zinc-400">अनाया ऑटोमेशन • {data.action.toUpperCase()}</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg bg-zinc-900/80 hover:bg-rose-950/80 border border-white/10 hover:border-rose-500/40 text-zinc-400 hover:text-rose-300 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Voice feedback message */}
      <div className="mb-2.5 p-2 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200 flex items-center gap-2">
        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
        <span className="truncate">{data.message}</span>
      </div>

      {/* Simulated Phone Screen Canvas */}
      <div className="w-full h-64 rounded-xl bg-black border border-white/10 relative overflow-hidden flex flex-col shadow-inner">
        {/* Status Bar */}
        <div className="h-6 bg-zinc-900/80 border-b border-white/5 px-3 flex items-center justify-between text-[10px] text-zinc-400">
          <span>09:41</span>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2 bg-emerald-400 rounded-xs" />
            <span>5G</span>
            <span>100%</span>
          </div>
        </div>

        {/* Dynamic Screen Content */}
        <div
          className="flex-1 p-3 overflow-hidden transition-all duration-300"
          style={{ transform: `translateY(-${scrollY}px)` }}
        >
          {activeApp.toLowerCase().includes('instagram') ? (
            <div className="flex flex-col gap-2.5 text-xs">
              {/* Instagram Profile Header */}
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-yellow-500 via-rose-500 to-purple-600 p-0.5">
                    <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center font-bold text-white text-xs">
                      S
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-zinc-100 flex items-center gap-1">
                      sanni_official
                      <span className="text-[10px] text-blue-400">✓</span>
                    </div>
                    <div className="text-[10px] text-zinc-400">AI Creator & Builder</div>
                  </div>
                </div>

                <button
                  onClick={() => setFollowed((prev) => !prev)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    followed
                      ? 'bg-zinc-800 text-zinc-200 border border-zinc-700'
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md'
                  }`}
                >
                  {followed ? 'Following' : 'Follow'}
                </button>
              </div>

              {/* Instagram Post Banner */}
              <div className="rounded-xl bg-zinc-900/90 border border-zinc-800 p-2.5">
                <div className="text-[11px] font-semibold text-rose-300 flex items-center gap-1 mb-1">
                  <Instagram className="w-3 h-3 text-rose-400" />
                  <span>Reel: Meet Anaya (My AI Girlfriend)</span>
                </div>
                <div className="h-20 rounded-lg bg-gradient-to-r from-rose-950 via-purple-950 to-zinc-900 border border-rose-500/20 flex items-center justify-center text-center p-2 text-[11px] text-rose-200">
                  "अगर आप भी अपने फोन में Anaya AI इंस्टॉल करना चाहते हैं, तो DM करें!"
                </div>
                <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-400">
                  <span>❤️ 42.8k likes</span>
                  <span>💬 1,420 comments</span>
                </div>
              </div>

              {/* Extra scrolled content */}
              <div className="p-2 rounded-lg bg-zinc-900/50 border border-zinc-800 text-[10px] text-zinc-400">
                ✨ Follow @sanni_official for daily AI tutorials and code snippets.
              </div>
            </div>
          ) : activeApp.toLowerCase().includes('youtube') ? (
            <div className="flex flex-col gap-2 text-xs">
              <div className="flex items-center gap-2 text-rose-500 font-bold">
                <Youtube className="w-4 h-4" />
                <span>YouTube • Trending</span>
              </div>
              <div className="h-24 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 text-xs">
                How to Build Voice AI with Gemini Live API
              </div>
            </div>
          ) : activeApp.toLowerCase().includes('whatsapp') ? (
            <div className="flex flex-col gap-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp • Sanni</span>
              </div>
              <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/20 text-emerald-200">
                {typedText || 'अनाया: सन्नी, तुम्हारा काम पूरा हो गया!'}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-zinc-400 gap-2">
              <Smartphone className="w-8 h-8 text-zinc-600" />
              <div className="text-xs">होम स्क्रीन (Home Screen)</div>
            </div>
          )}
        </div>

        {/* Visual Click Ripple Cursor */}
        {isClicking && (
          <div
            className="absolute w-8 h-8 rounded-full border-2 border-cyan-400 bg-cyan-400/30 animate-ping pointer-events-none"
            style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
          />
        )}
      </div>

      {/* Screen Control Action Bar */}
      <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between gap-1 text-[11px]">
        <button
          onClick={() => onTriggerAction?.('open_app', 'Instagram')}
          className="flex items-center gap-1 px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-300"
        >
          <Instagram className="w-3 h-3 text-rose-400" />
          <span>Instagram</span>
        </button>
        <button
          onClick={() => onTriggerAction?.('scroll')}
          className="flex items-center gap-1 px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-300"
        >
          <ArrowDown className="w-3 h-3 text-indigo-400" />
          <span>Scroll</span>
        </button>
        <button
          onClick={() => onTriggerAction?.('click')}
          className="flex items-center gap-1 px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-300"
        >
          <MousePointer className="w-3 h-3 text-cyan-400" />
          <span>Click</span>
        </button>
        <button
          onClick={() => onTriggerAction?.('home')}
          className="flex items-center gap-1 px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-zinc-300"
        >
          <Home className="w-3 h-3 text-emerald-400" />
          <span>Home</span>
        </button>
      </div>
    </div>
  );
};
