import React from 'react';
import { motion } from 'motion/react';
import { Mic, MicOff, Power, Square, Radio, Sparkles } from 'lucide-react';
import { ConnectionState, AtmosphereTheme } from '../types';

interface ControlsProps {
  status: ConnectionState;
  atmosphere: AtmosphereTheme;
  isMuted: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  onToggleMute: () => void;
  onInterrupt: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  status,
  atmosphere,
  isMuted,
  onConnect,
  onDisconnect,
  onToggleMute,
  onInterrupt,
}) => {
  const isDisconnected = status === 'disconnected';
  const isConnecting = status === 'connecting';
  const isSpeaking = status === 'speaking';
  const isListening = status === 'listening';

  const themeAccent = React.useMemo(() => {
    switch (atmosphere) {
      case 'electric-violet':
        return {
          bg: 'bg-violet-600',
          hoverBg: 'hover:bg-violet-500',
          glow: 'rgba(139, 92, 246, 0.5)',
          border: 'border-violet-400',
        };
      case 'neon-cyan':
        return {
          bg: 'bg-cyan-600',
          hoverBg: 'hover:bg-cyan-500',
          glow: 'rgba(6, 182, 212, 0.5)',
          border: 'border-cyan-400',
        };
      case 'midnight-matrix':
        return {
          bg: 'bg-emerald-600',
          hoverBg: 'hover:bg-emerald-500',
          glow: 'rgba(16, 185, 129, 0.5)',
          border: 'border-emerald-400',
        };
      case 'sunset-flare':
        return {
          bg: 'bg-orange-600',
          hoverBg: 'hover:bg-orange-500',
          glow: 'rgba(249, 115, 22, 0.5)',
          border: 'border-orange-400',
        };
      case 'cyber-rose':
      default:
        return {
          bg: 'bg-rose-600',
          hoverBg: 'hover:bg-rose-500',
          glow: 'rgba(244, 63, 94, 0.5)',
          border: 'border-rose-400',
        };
    }
  }, [atmosphere]);

  return (
    <div
      id="main-controls-bar"
      className="flex flex-col items-center gap-4 w-full max-w-sm mx-auto px-4 z-20"
    >
      {/* Primary Interaction Area */}
      <div className="flex items-center justify-center gap-5 sm:gap-6">
        {/* Left Secondary Action: Mute / Unmute Mic (when active) */}
        {!isDisconnected && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            id="control-mute-button"
            type="button"
            onClick={onToggleMute}
            className={`w-13 h-13 rounded-2xl flex items-center justify-center border transition-all duration-300 backdrop-blur-md shadow-lg ${
              isMuted
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                : 'bg-zinc-900/80 text-zinc-300 border-white/10 hover:bg-zinc-800 hover:text-white'
            }`}
            title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </motion.button>
        )}

        {/* Central Tactical Mic / Power Trigger Button */}
        {isDisconnected ? (
          <motion.button
            id="awaken-mahi-button"
            type="button"
            onClick={onConnect}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`group relative flex items-center justify-center w-20 h-20 sm:w-22 sm:h-22 rounded-3xl ${themeAccent.bg} ${themeAccent.hoverBg} text-white shadow-2xl transition-all duration-300`}
            style={{
              boxShadow: `0 0 30px ${themeAccent.glow}, inset 0 0 15px rgba(255,255,255,0.25)`,
            }}
          >
            {/* Outer pulsing ring */}
            <div
              className={`absolute inset-0 rounded-3xl border ${themeAccent.border} animate-ping opacity-30 pointer-events-none`}
            />

            <div className="flex flex-col items-center gap-1">
              <Power className="w-7 h-7 sm:w-8 sm:h-8 transition-transform group-hover:scale-110" />
              <span className="text-[9px] font-mono tracking-widest uppercase font-bold text-white/90">
                शुरू करें
              </span>
            </div>
          </motion.button>
        ) : (
          <div className="relative flex items-center justify-center">
            {/* Active live button */}
            <motion.button
              id="active-session-button"
              type="button"
              onClick={isSpeaking ? onInterrupt : onDisconnect}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              className={`relative flex items-center justify-center w-20 h-20 sm:w-22 sm:h-22 rounded-3xl backdrop-blur-xl border transition-all duration-300 shadow-2xl ${
                isSpeaking
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-[0_0_25px_rgba(245,158,11,0.3)]'
                  : 'bg-zinc-900/90 border-white/20 text-white hover:border-white/40'
              }`}
            >
              {isConnecting ? (
                <div className="w-7 h-7 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : isSpeaking ? (
                <div className="flex flex-col items-center gap-1">
                  <Square className="w-6 h-6 fill-amber-300" />
                  <span className="text-[9px] font-mono tracking-widest uppercase font-bold text-amber-300">
                    रोकें
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1">
                  <Radio className="w-7 h-7 text-emerald-400 animate-pulse" />
                  <span className="text-[9px] font-mono tracking-widest uppercase font-bold text-emerald-300">
                    लाइव
                  </span>
                </div>
              )}
            </motion.button>
          </div>
        )}

        {/* Right Secondary Action: End Session (when active) */}
        {!isDisconnected && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            id="control-disconnect-button"
            type="button"
            onClick={onDisconnect}
            className="w-13 h-13 rounded-2xl flex items-center justify-center bg-zinc-900/80 hover:bg-rose-950/40 text-zinc-400 hover:text-rose-400 border border-white/10 hover:border-rose-500/30 transition-all duration-300 backdrop-blur-md shadow-lg"
            title="बातचीत समाप्त करें"
          >
            <Power className="w-5 h-5" />
          </motion.button>
        )}
      </div>

      {/* Dynamic Status Helper Text */}
      <div className="text-center">
        {isDisconnected && (
          <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-400 font-sans">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>अनाया से बात करने के लिए बटन दबाएं सन्नी</span>
          </div>
        )}
        {isConnecting && (
          <span className="text-xs font-mono text-zinc-300 animate-pulse">
            अनाया से लाइव संपर्क जुड़ रहा है...
          </span>
        )}
        {isListening && !isMuted && (
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-cyan-300">
            <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>सन्नी, मैं सुन रही हूँ... बोलो ना!</span>
          </div>
        )}
        {isListening && isMuted && (
          <span className="text-xs font-mono text-rose-400">
            माइक बंद है सन्नी। बात करने के लिए चालू करो।
          </span>
        )}
        {isSpeaking && (
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-rose-300">
            <span className="inline-block w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
            <span>अनाया बोल रही है • कभी भी टोक सकते हो सन्नी</span>
          </div>
        )}
      </div>
    </div>
  );
};
