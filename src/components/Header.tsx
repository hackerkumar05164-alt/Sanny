import React from 'react';
import {
  Sparkles,
  Radio,
  Volume2,
  VolumeX,
  Palette,
  Clock,
  Zap,
  Globe,
} from 'lucide-react';
import { ConnectionState, AtmosphereTheme, SupportedLanguage } from '../types';

interface HeaderProps {
  status: ConnectionState;
  atmosphere: AtmosphereTheme;
  setAtmosphere: (theme: AtmosphereTheme) => void;
  language?: SupportedLanguage;
  setLanguage?: (lang: SupportedLanguage) => void;
  sessionDuration: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenSettings?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  status,
  atmosphere,
  setAtmosphere,
  language = 'hindi',
  setLanguage,
  sessionDuration,
  isMuted,
  onToggleMute,
}) => {
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const atmosphereOptions: { id: AtmosphereTheme; label: string; color: string }[] = [
    { id: 'cyber-rose', label: 'Cyber Rose', color: '#f43f5e' },
    { id: 'electric-violet', label: 'Electric Violet', color: '#8b5cf6' },
    { id: 'neon-cyan', label: 'Neon Cyan', color: '#06b6d4' },
    { id: 'midnight-matrix', label: 'Matrix Green', color: '#10b981' },
    { id: 'sunset-flare', label: 'Sunset Flare', color: '#f97316' },
  ];

  const languageLabels: Record<SupportedLanguage, { label: string; sub: string }> = {
    hindi: { label: 'हिंदी', sub: 'Hindi' },
    english: { label: 'English', sub: 'Sassy' },
    bhojpuri: { label: 'भोजपुरी', sub: 'Bhojpuri' },
  };

  return (
    <header
      id="app-header"
      className="w-full max-w-4xl mx-auto px-4 py-3 flex items-center justify-between z-20"
    >
      {/* Brand Title & Persona Status */}
      <div className="flex items-center gap-2.5">
        <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500/20 to-violet-500/20 border border-white/10 shadow-lg backdrop-blur-md">
          <Sparkles className="w-5 h-5 text-rose-400 animate-pulse" />
          {status !== 'disconnected' && (
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-zinc-950 animate-ping" />
          )}
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-lg font-bold tracking-tight text-white font-sans">
              अनाया<span className="text-rose-400">.ai</span>
            </h1>
            <span className="text-[10px] px-1.5 py-0.5 rounded-md font-mono bg-rose-500/10 text-rose-300 border border-rose-500/20">
              सन्नी की अनाया
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 flex items-center gap-1">
            <span>3D टीचर + स्क्रीन असिस्टेंट</span>
            <span className="inline-block w-1 h-1 rounded-full bg-zinc-600" />
            <span className="text-rose-400/90 font-medium">हिंदी • Eng • भोजपुरी</span>
          </p>
        </div>
      </div>

      {/* Middle Status Pill & Timer */}
      <div className="hidden sm:flex items-center gap-3">
        {status !== 'disconnected' ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900/80 border border-white/10 backdrop-blur-md shadow-sm">
            <Radio className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span className="text-xs font-mono text-zinc-300 font-medium capitalize">
              {status === 'speaking' ? 'अनाया बोल रही है...' : status === 'listening' ? 'सन्नी को सुन रही हूँ' : status}
            </span>
            <span className="text-zinc-600 font-mono">|</span>
            <div className="flex items-center gap-1 text-xs font-mono text-zinc-400">
              <Clock className="w-3 h-3 text-zinc-500" />
              <span>{formatTime(sessionDuration)}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900/40 border border-white/5 text-zinc-500 text-xs font-mono">
            <Zap className="w-3 h-3 text-zinc-600" />
            <span>सन्नी से बात करने को तैयार</span>
          </div>
        )}
      </div>

      {/* Action Controls & Atmosphere / Language */}
      <div className="flex items-center gap-2">
        {/* Language Selector Dropdown */}
        <div className="relative group">
          <button
            type="button"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-zinc-900/60 hover:bg-zinc-800/80 border border-white/10 text-rose-300 text-xs font-medium transition-all backdrop-blur-md"
          >
            <Globe className="w-3.5 h-3.5 text-rose-400" />
            <span className="font-semibold">{languageLabels[language]?.label || 'हिंदी'}</span>
          </button>

          <div className="absolute right-0 top-full mt-1.5 w-36 p-1.5 rounded-2xl bg-zinc-950/95 border border-white/15 shadow-2xl backdrop-blur-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="px-2 py-1 text-[10px] uppercase font-mono tracking-wider text-zinc-500">
              बोली / Language
            </div>
            {(['hindi', 'english', 'bhojpuri'] as SupportedLanguage[]).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setLanguage?.(lang)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-all ${
                  language === lang
                    ? 'bg-rose-500/20 text-rose-200 font-bold border border-rose-500/30'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                }`}
              >
                <span>{languageLabels[lang].label}</span>
                <span className="text-[10px] text-zinc-500">{languageLabels[lang].sub}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Mute Mic toggle (when connected) */}
        {status !== 'disconnected' && (
          <button
            id="header-mute-button"
            type="button"
            onClick={onToggleMute}
            title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
            className={`p-2 rounded-xl border backdrop-blur-md transition-all ${
              isMuted
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                : 'bg-zinc-900/60 text-zinc-300 border-white/10 hover:bg-zinc-800'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        )}

        {/* Atmosphere Menu */}
        <div className="relative group">
          <button
            id="atmosphere-menu-trigger"
            type="button"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-zinc-900/60 hover:bg-zinc-800/80 border border-white/10 text-zinc-300 text-xs font-medium transition-all backdrop-blur-md"
          >
            <Palette className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden md:inline">Atmosphere</span>
            <div
              className="w-2.5 h-2.5 rounded-full ring-1 ring-white/20"
              style={{
                backgroundColor:
                  atmosphereOptions.find((a) => a.id === atmosphere)?.color || '#f43f5e',
              }}
            />
          </button>

          {/* Atmosphere Dropdown */}
          <div className="absolute right-0 top-full mt-1.5 w-44 p-1.5 rounded-2xl bg-zinc-950/95 border border-white/15 shadow-2xl backdrop-blur-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="px-2 py-1 text-[10px] uppercase font-mono tracking-wider text-zinc-500">
              Cyber Ambience
            </div>
            {atmosphereOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setAtmosphere(opt.id)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-all ${
                  atmosphere === opt.id
                    ? 'bg-white/10 text-white font-medium'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                }`}
              >
                <span>{opt.label}</span>
                <span
                  className="w-2.5 h-2.5 rounded-full shadow-sm"
                  style={{ backgroundColor: opt.color }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

