import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { ConnectionState, AtmosphereTheme } from '../types';

interface MahiOrbProps {
  status: ConnectionState;
  atmosphere: AtmosphereTheme;
  inputLevel: number;
  outputLevel: number;
  frequencies: Uint8Array;
}

export const MahiOrb: React.FC<MahiOrbProps> = ({
  status,
  atmosphere,
  inputLevel,
  outputLevel,
  frequencies,
}) => {
  // Theme gradients & glow colors
  const themeColors = useMemo(() => {
    switch (atmosphere) {
      case 'electric-violet':
        return {
          primary: '#8b5cf6',
          secondary: '#6366f1',
          accent: '#c084fc',
          glow: 'rgba(139, 92, 246, 0.4)',
          glowRgb: '139, 92, 246',
        };
      case 'neon-cyan':
        return {
          primary: '#06b6d4',
          secondary: '#14b8a6',
          accent: '#67e8f9',
          glow: 'rgba(6, 182, 212, 0.4)',
          glowRgb: '6, 182, 212',
        };
      case 'midnight-matrix':
        return {
          primary: '#10b981',
          secondary: '#059669',
          accent: '#6ee7b7',
          glow: 'rgba(16, 185, 129, 0.4)',
          glowRgb: '16, 185, 129',
        };
      case 'sunset-flare':
        return {
          primary: '#f97316',
          secondary: '#ec4899',
          accent: '#fbbf24',
          glow: 'rgba(249, 115, 22, 0.4)',
          glowRgb: '249, 115, 22',
        };
      case 'cyber-rose':
      default:
        return {
          primary: '#f43f5e',
          secondary: '#d946ef',
          accent: '#fb7185',
          glow: 'rgba(244, 63, 94, 0.4)',
          glowRgb: '244, 63, 94',
        };
    }
  }, [atmosphere]);

  // Derive dynamic scale and reactive properties
  const isSpeaking = status === 'speaking';
  const isListening = status === 'listening';
  const isConnecting = status === 'connecting';
  const isDisconnected = status === 'disconnected';

  // Dynamic reaction scale
  const reactiveScale = useMemo(() => {
    if (isDisconnected) return 1.0;
    if (isConnecting) return 1.05;
    if (isSpeaking) {
      return 1.0 + Math.min(0.45, outputLevel * 0.9);
    }
    if (isListening) {
      return 1.0 + Math.min(0.25, inputLevel * 0.6);
    }
    return 1.0;
  }, [isDisconnected, isConnecting, isSpeaking, isListening, outputLevel, inputLevel]);

  // Frequency slice for reactive ripples
  const activeFreqSample = useMemo(() => {
    if (frequencies.length < 8) return [0, 0, 0, 0, 0, 0, 0, 0];
    return [
      frequencies[2] / 255,
      frequencies[6] / 255,
      frequencies[12] / 255,
      frequencies[18] / 255,
      frequencies[24] / 255,
      frequencies[30] / 255,
    ];
  }, [frequencies]);

  return (
    <div
      id="mahi-orb-container"
      className="relative flex items-center justify-center w-72 h-72 sm:w-88 sm:h-88 select-none"
    >
      {/* Outer ambient glow field */}
      <div
        className="absolute inset-0 rounded-full transition-all duration-700 pointer-events-none blur-3xl opacity-60"
        style={{
          background: `radial-gradient(circle, ${themeColors.primary} 0%, ${themeColors.secondary} 40%, transparent 70%)`,
          transform: `scale(${reactiveScale * 1.3})`,
        }}
      />

      {/* Rotating outer orbital ring 1 */}
      <motion.div
        animate={{
          rotate: 360,
          scale: isSpeaking ? [1, 1.08, 1] : 1,
        }}
        transition={{
          rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
          scale: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full border border-dashed pointer-events-none"
        style={{
          borderColor: `rgba(${themeColors.glowRgb}, 0.25)`,
        }}
      >
        {/* Orbital satellite dot */}
        <div
          className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full shadow-lg"
          style={{
            backgroundColor: themeColors.accent,
            boxShadow: `0 0 12px ${themeColors.accent}`,
          }}
        />
      </motion.div>

      {/* Counter-rotating orbital ring 2 */}
      <motion.div
        animate={{
          rotate: -360,
        }}
        transition={{
          rotate: { duration: 28, repeat: Infinity, ease: 'linear' },
        }}
        className="absolute w-52 h-52 sm:w-68 sm:h-68 rounded-full border pointer-events-none"
        style={{
          borderColor: `rgba(${themeColors.glowRgb}, 0.18)`,
        }}
      >
        <div
          className="absolute -bottom-1 left-1/3 w-2 h-2 rounded-full"
          style={{
            backgroundColor: themeColors.secondary,
            boxShadow: `0 0 8px ${themeColors.secondary}`,
          }}
        />
      </motion.div>

      {/* Audio Reactive Pulse Rings (shown when speaking or listening) */}
      {(isSpeaking || isListening) && (
        <>
          <motion.div
            animate={{
              scale: [1, 1.4 + (isSpeaking ? outputLevel * 0.8 : inputLevel * 0.4)],
              opacity: [0.6, 0],
            }}
            transition={{
              duration: isSpeaking ? 0.9 : 1.4,
              repeat: Infinity,
              ease: 'easeOut',
            }}
            className="absolute w-44 h-44 sm:w-56 sm:h-56 rounded-full border-2 pointer-events-none"
            style={{
              borderColor: isSpeaking ? themeColors.primary : '#38bdf8',
            }}
          />
          <motion.div
            animate={{
              scale: [1, 1.7 + (isSpeaking ? outputLevel : inputLevel * 0.5)],
              opacity: [0.4, 0],
            }}
            transition={{
              duration: isSpeaking ? 1.2 : 1.8,
              repeat: Infinity,
              ease: 'easeOut',
              delay: 0.3,
            }}
            className="absolute w-44 h-44 sm:w-56 sm:h-56 rounded-full border pointer-events-none"
            style={{
              borderColor: isSpeaking ? themeColors.secondary : '#818cf8',
            }}
          />
        </>
      )}

      {/* Core Glowing Orb */}
      <motion.div
        animate={{
          scale: reactiveScale,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 18,
        }}
        className="relative flex items-center justify-center w-36 h-36 sm:w-48 sm:h-48 rounded-full shadow-2xl overflow-hidden backdrop-blur-sm"
        style={{
          background: `radial-gradient(circle at 35% 35%, ${themeColors.accent} 0%, ${themeColors.primary} 45%, #09090b 90%)`,
          boxShadow: `0 0 45px ${themeColors.glow}, inset 0 0 25px rgba(255,255,255,0.3)`,
        }}
      >
        {/* Futuristic Internal Shimmer / Wave effect */}
        <motion.div
          animate={{
            rotate: isSpeaking ? 360 : 0,
            scale: isSpeaking ? [1, 1.15, 0.95, 1] : [1, 1.05, 1],
          }}
          transition={{
            rotate: { duration: 6, repeat: Infinity, ease: 'linear' },
            scale: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
          }}
          className="absolute inset-2 rounded-full opacity-70"
          style={{
            background: `conic-gradient(from 0deg, transparent 0deg, ${themeColors.secondary} 120deg, transparent 180deg, ${themeColors.accent} 300deg, transparent 360deg)`,
          }}
        />

        {/* Dynamic Inner Neural Core */}
        <div
          className="relative z-10 flex flex-col items-center justify-center w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-zinc-950/80 border border-white/15 backdrop-blur-md shadow-inner"
        >
          {/* Status icon or state animation */}
          {isDisconnected && (
            <div className="flex flex-col items-center gap-1 text-zinc-400">
              <span className="text-xl sm:text-2xl font-bold tracking-wider text-rose-300">अनाया</span>
              <span className="text-[9px] uppercase font-mono tracking-widest text-zinc-400">सन्नी के इंतज़ार में</span>
            </div>
          )}

          {isConnecting && (
            <div className="flex flex-col items-center gap-1.5 text-zinc-200">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                className="w-6 h-6 border-2 border-t-transparent rounded-full"
                style={{ borderColor: `${themeColors.primary} transparent transparent transparent` }}
              />
              <span className="text-[10px] font-mono tracking-wider text-zinc-300">कनेक्ट हो रही हूँ...</span>
            </div>
          )}

          {isListening && (
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1 h-6">
                {[0.4, 0.9, 0.6, 1.0, 0.5].map((h, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      height: [
                        '6px',
                        `${Math.max(6, (h + inputLevel * 1.5) * 24)}px`,
                        '6px',
                      ],
                    }}
                    transition={{
                      duration: 0.5 + i * 0.1,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="w-1 rounded-full bg-cyan-400 shadow-sm"
                    style={{
                      boxShadow: '0 0 6px #22d3ee',
                    }}
                  />
                ))}
              </div>
              <span className="text-[10px] font-mono font-medium tracking-widest text-cyan-300">
                सन्नी, बोलो ना...
              </span>
            </div>
          )}

          {isSpeaking && (
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1 h-7">
                {activeFreqSample.map((val, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      height: [
                        '8px',
                        `${Math.max(8, (val + outputLevel * 1.8) * 28)}px`,
                        '8px',
                      ],
                    }}
                    transition={{
                      duration: 0.35 + (i % 3) * 0.1,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="w-1.5 rounded-full"
                    style={{
                      backgroundColor: themeColors.accent,
                      boxShadow: `0 0 8px ${themeColors.primary}`,
                    }}
                  />
                ))}
              </div>
              <span
                className="text-[10px] font-mono font-bold tracking-widest uppercase"
                style={{ color: themeColors.accent }}
              >
                अनाया बोल रही है
              </span>
            </div>
          )}

          {status === 'interrupted' && (
            <div className="flex flex-col items-center gap-1 text-amber-400">
              <span className="text-xs font-mono font-bold">हाँ सन्नी...</span>
            </div>
          )}

          {status === 'executing_tool' && (
            <div className="flex flex-col items-center gap-1 text-emerald-400">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.6, repeat: Infinity }}
                className="w-3 h-3 rounded-full bg-emerald-400 shadow-lg"
              />
              <span className="text-[9px] font-mono font-semibold tracking-wider">सन्नी के लिए...</span>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
