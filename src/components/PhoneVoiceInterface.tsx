import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Heart,
  Square,
  Music2,
  Instagram,
  Flame,
  Crown,
  Smile,
  Video,
  FileText,
  MessageSquare,
} from 'lucide-react';
import { ConnectionState, SupportedLanguage, AtmosphereTheme, MoodVibe } from '../types';
import { Anaya3DAnimeGirl } from './Anaya3DAnimeGirl';
import { AnayaRealPhotoAvatar } from './AnayaPhotoAvatar';

interface PhoneVoiceInterfaceProps {
  status: ConnectionState;
  inputLevel: number;
  outputLevel: number;
  lastTranscript?: string;
  language: SupportedLanguage;
  atmosphere: AtmosphereTheme;
  moodVibe: MoodVibe;
  onToggleVoice: () => void;
  onInterrupt: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onStartVideoCall: () => void;
  onOpenChatPdf: () => void;
  onTriggerBossAction: (
    action: 'attitude_shayari' | 'love_shayari' | 'sing_song' | 'boss_swag' | 'sassy_compliment'
  ) => void;
}

export const PhoneVoiceInterface: React.FC<PhoneVoiceInterfaceProps> = ({
  status,
  inputLevel,
  outputLevel,
  lastTranscript,
  atmosphere,
  onToggleVoice,
  onInterrupt,
  isMuted,
  onToggleMute,
  onStartVideoCall,
  onOpenChatPdf,
  onTriggerBossAction,
}) => {
  const [decorToast, setDecorToast] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState('10:29');
  const [avatarMode, setAvatarMode] = useState<'photo' | '3d'>('photo');

  const isSpeaking = status === 'speaking';
  const isListening = status === 'listening';
  const isConnecting = status === 'connecting';
  const isVoiceActive = isSpeaking || isListening || isConnecting;

  // Real phone clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      setCurrentTime(`${formattedHours}:${formattedMinutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleActionClick = (
    action: 'attitude_shayari' | 'love_shayari' | 'sing_song' | 'boss_swag' | 'sassy_compliment',
    title: string
  ) => {
    if (!isVoiceActive) {
      onToggleVoice();
    }
    onTriggerBossAction(action);
    setDecorToast(`"${title} शुरू हो रही है, मेरे बॉस! 💖"`);
    setTimeout(() => {
      setDecorToast(null);
    }, 3000);
  };

  const soundWaveDots = 18;

  return (
    <div
      id="anaya-phone-screen-container"
      className="relative w-full h-full min-h-screen flex items-center justify-center p-2 sm:p-4 overflow-y-auto select-none bg-[#07020d]"
    >
      {/* Background Ambient Aura */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0e0318] via-[#140624] to-[#06010a] -z-10" />
      <div
        className="absolute w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none -top-20 left-1/3 transition-colors duration-700 bg-rose-600/15"
      />
      <div
        className="absolute w-[500px] h-[500px] rounded-full blur-[150px] pointer-events-none -bottom-20 right-1/3 transition-colors duration-700 bg-amber-500/10"
      />

      {/* Main Layout Container */}
      <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center py-2 sm:py-4">
        
        {/* THE IPHONE PRO FRAME CHASSIS */}
        <div
          id="iphone-phone-frame"
          className="relative w-full max-w-[420px] h-[850px] max-h-[96vh] rounded-[48px] p-3 sm:p-3.5 bg-gradient-to-b from-[#341d3e] via-[#1f0e2b] to-[#12071a] shadow-[0_25px_90px_rgba(0,0,0,0.9),0_0_70px_rgba(244,63,94,0.3)] border-[3.5px] border-[#59336d] flex flex-col items-center justify-between transition-all duration-300 ring-1 ring-amber-400/20 shrink-0 overflow-hidden"
        >
          {/* iPhone Inner Bezel Screen */}
          <div className="relative w-full h-full rounded-[38px] bg-gradient-to-b from-[#180729] via-[#1a082e] to-[#0d0317] overflow-hidden flex flex-col justify-between border border-white/10 shadow-inner">
            
            {/* Top Section */}
            <div className="w-full flex flex-col items-center justify-start p-3 sm:p-3.5 z-20">
              
              {/* Dynamic Island / Top Status Bar */}
              <div className="w-full flex items-center justify-between pt-0.5 px-1">
                <span className="text-xs font-semibold text-amber-200/90 tracking-tight font-mono">{currentTime}</span>
                
                {/* Dynamic Island Pill */}
                <div className="h-6 px-3.5 rounded-full bg-black/90 flex items-center justify-center gap-1.5 border border-amber-400/30 shadow-md">
                  <Crown className="w-3 h-3 text-amber-400 fill-amber-400 animate-pulse" />
                  <span className="text-[10px] text-amber-200 font-bold tracking-wide">
                    Boss's Anaya
                  </span>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isSpeaking
                        ? 'bg-rose-400 animate-ping'
                        : isListening
                        ? 'bg-emerald-400 animate-pulse'
                        : 'bg-amber-400'
                    }`}
                  />
                </div>

                {/* Battery & Signal */}
                <div className="flex items-center gap-1.5 text-white/80 text-[10px]">
                  <span className="font-mono font-medium text-amber-300">5G</span>
                  <div className="w-4 h-2.5 rounded-xs border border-white/70 p-0.5 flex items-center">
                    <div className="w-full h-full bg-emerald-400 rounded-2xs" />
                  </div>
                </div>
              </div>

              {/* Boss & Anaya Header Banner */}
              <div className="w-full mt-2.5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-rose-950/60 via-purple-950/70 to-amber-950/60 border border-amber-400/20 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-1.5">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold bg-gradient-to-r from-amber-200 via-rose-300 to-pink-200 bg-clip-text text-transparent">
                    सिर्फ बॉस का राज़ 👑
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-pink-300 font-medium">
                  <span>Attitude & Love</span>
                  <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
                </div>
              </div>

              {/* 3 Call & Interaction Modes: Voice / Video Call / Chat & PDF */}
              <div className="w-full mt-2 grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-black/60 border border-amber-500/30 shadow-md">
                <button
                  id="phone-mode-voice-tab"
                  className="py-1.5 px-2 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white text-[10px] font-bold flex items-center justify-center gap-1 shadow-sm"
                >
                  <Mic className="w-3 h-3 text-white" />
                  <span>वॉइस कॉल</span>
                </button>
                <button
                  id="phone-mode-video-tab"
                  onClick={onStartVideoCall}
                  className="py-1.5 px-2 rounded-xl bg-zinc-900/80 hover:bg-rose-950/70 text-zinc-300 hover:text-rose-200 text-[10px] font-semibold flex items-center justify-center gap-1 border border-zinc-800 transition-colors cursor-pointer"
                >
                  <Video className="w-3 h-3 text-rose-400" />
                  <span>वीडियो कॉल</span>
                </button>
                <button
                  id="phone-mode-chat-pdf-tab"
                  onClick={onOpenChatPdf}
                  className="py-1.5 px-2 rounded-xl bg-zinc-900/80 hover:bg-amber-950/70 text-zinc-300 hover:text-amber-200 text-[10px] font-semibold flex items-center justify-center gap-1 border border-zinc-800 transition-colors cursor-pointer"
                >
                  <FileText className="w-3 h-3 text-amber-400" />
                  <span>चैट & PDF</span>
                </button>
              </div>

              {/* Top Floating Mini Actions */}
              <div className="w-full flex items-center justify-between mt-2 px-1">
                {/* Left: Sassy Slogan */}
                <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-950/50 border border-rose-500/30 text-rose-200 text-[10px] font-semibold">
                  <Flame className="w-3 h-3 text-amber-400" />
                  <span>फुल ईगो & प्यार</span>
                </div>

                {/* Center: Anaya Title */}
                <div className="flex items-center gap-1">
                  <span
                    className="text-xl font-bold tracking-wide"
                    style={{
                      fontFamily: '"Caveat", "Dancing Script", cursive, sans-serif',
                      color: '#ff4f81',
                    }}
                  >
                    Anaya
                  </span>
                  <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400 animate-pulse" />
                </div>

                {/* Right: Avatar switch */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setAvatarMode(avatarMode === 'photo' ? '3d' : 'photo')}
                    className="p-1 px-2 rounded-full bg-amber-950/50 hover:bg-amber-900/60 border border-amber-500/30 text-amber-300 text-[10px] font-semibold flex items-center gap-1 cursor-pointer shadow-xs"
                    title="Avatar Style"
                  >
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>{avatarMode === 'photo' ? 'Photo' : '3D'}</span>
                  </button>
                </div>
              </div>

              {/* CENTRAL CIRCULAR AVATAR */}
              <div className="relative flex items-center justify-center my-3 z-10 transition-all scale-95 sm:scale-100">
                {avatarMode === 'photo' ? (
                  <AnayaRealPhotoAvatar
                    status={status}
                    inputLevel={inputLevel}
                    outputLevel={outputLevel}
                    onTap={onToggleVoice}
                  />
                ) : (
                  <Anaya3DAnimeGirl
                    status={status}
                    inputLevel={inputLevel}
                    outputLevel={outputLevel}
                    onTap={onToggleVoice}
                  />
                )}
              </div>

              {/* Sound Wave Equalizer Dots & Voice status subtitle */}
              <div className="w-full flex flex-col items-center space-y-1.5">
                <div className="flex items-center justify-center gap-1 h-3.5 w-full px-4">
                  {Array.from({ length: soundWaveDots }).map((_, i) => {
                    const centerDist = Math.abs(i - soundWaveDots / 2) / (soundWaveDots / 2);
                    const heightMultiplier = 1 - centerDist * 0.5;
                    const dynamicSize = isSpeaking
                      ? Math.max(3, Math.min(8, (outputLevel * 18 + 3) * heightMultiplier * ((i % 3) * 0.4 + 0.7)))
                      : isListening
                      ? Math.max(2.5, Math.min(6, (inputLevel * 12 + 2.5) * heightMultiplier * ((i % 2) * 0.5 + 0.6)))
                      : 3;

                    return (
                      <motion.div
                        key={i}
                        animate={{
                          scale: dynamicSize / 3,
                        }}
                        transition={{
                          duration: 0.12,
                          ease: 'easeInOut',
                        }}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          background:
                            i < soundWaveDots / 2 ? '#f43f5e' : '#fbbf24',
                          boxShadow: isSpeaking
                            ? '0 0 6px rgba(244,63,94,0.8)'
                            : 'none',
                        }}
                      />
                    );
                  })}
                </div>

                {/* Subtitle Line */}
                <div className="text-center px-3 py-1 rounded-xl bg-black/40 border border-white/5 w-full max-w-[320px]">
                  <p className="text-[11px] text-pink-100 font-medium line-clamp-2">
                    {lastTranscript ||
                      (isSpeaking
                        ? 'अनाया: हुक्म सुन रही हूँ मेरे बॉस...'
                        : isListening
                        ? 'बोलिए बॉस, आपकी अनाया सुन रही है...'
                        : 'सिर्फ अपने बॉस का हुक्म मानती हूँ! 😎💖')}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Controls Section */}
            <div className="w-full flex flex-col justify-end p-3 sm:p-4 z-10 space-y-3">
              
              {/* Quick Romantic & Attitude Chips for Boss */}
              <div className="w-full px-1">
                <div className="flex items-center justify-center gap-1.5 flex-wrap">
                  <button
                    onClick={() => handleActionClick('boss_swag', '👑 बॉस का स्वैग')}
                    className="px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-600/40 to-yellow-600/40 hover:from-amber-600/60 border border-amber-400/40 text-amber-200 text-[10px] font-bold flex items-center gap-1 shadow-xs transition-all active:scale-95 cursor-pointer"
                  >
                    <Crown className="w-3 h-3 text-amber-300" />
                    <span>👑 बॉस का स्वैग</span>
                  </button>

                  <button
                    onClick={() => handleActionClick('attitude_shayari', '🔥 Attitude शायरी')}
                    className="px-2.5 py-1 rounded-full bg-gradient-to-r from-red-600/40 to-rose-600/40 hover:from-red-600/60 border border-red-400/40 text-red-200 text-[10px] font-bold flex items-center gap-1 shadow-xs transition-all active:scale-95 cursor-pointer"
                  >
                    <Flame className="w-3 h-3 text-red-400" />
                    <span>🔥 Attitude शायरी</span>
                  </button>

                  <button
                    onClick={() => handleActionClick('love_shayari', '💖 Love शायरी')}
                    className="px-2.5 py-1 rounded-full bg-gradient-to-r from-rose-600/40 to-pink-600/40 hover:from-rose-600/60 border border-rose-400/40 text-rose-200 text-[10px] font-bold flex items-center gap-1 shadow-xs transition-all active:scale-95 cursor-pointer"
                  >
                    <Heart className="w-3 h-3 text-rose-300 fill-rose-300" />
                    <span>💖 Love शायरी</span>
                  </button>

                  <button
                    onClick={() => handleActionClick('sing_song', '🎵 गाना गाओ')}
                    className="px-2.5 py-1 rounded-full bg-gradient-to-r from-pink-600/40 to-purple-600/40 hover:from-pink-600/60 border border-pink-400/40 text-pink-200 text-[10px] font-bold flex items-center gap-1 shadow-xs transition-all active:scale-95 cursor-pointer"
                  >
                    <Music2 className="w-3 h-3 text-pink-300" />
                    <span>🎵 रोमांटिक गाना</span>
                  </button>

                  <button
                    onClick={() => handleActionClick('sassy_compliment', '✨ नखरे & तारीफ')}
                    className="px-2.5 py-1 rounded-full bg-gradient-to-r from-purple-600/40 to-indigo-600/40 hover:from-purple-600/60 border border-purple-400/40 text-purple-200 text-[10px] font-bold flex items-center gap-1 shadow-xs transition-all active:scale-95 cursor-pointer"
                  >
                    <Smile className="w-3 h-3 text-purple-300" />
                    <span>✨ नखरे & तारीफ</span>
                  </button>
                </div>
              </div>

              {/* Bottom Mic & Action Bar */}
              <div className="w-full flex items-center justify-between px-2 py-1 z-10">
                {/* Direct Video Call Button */}
                <button
                  id="bottom-video-call-quick-button"
                  onClick={onStartVideoCall}
                  className="flex flex-col items-center gap-1 p-2 rounded-2xl bg-white/5 hover:bg-rose-950/60 border border-white/10 hover:border-rose-500/50 text-white/70 hover:text-white transition-all cursor-pointer group"
                  title="लाइव वीडियो कॉल शुरू करें"
                >
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500/20 to-pink-600/20 border border-rose-500/30 flex items-center justify-center group-hover:border-rose-500/60">
                    <Video className="w-5 h-5 text-rose-300 group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="text-[9px] font-medium text-rose-300">वीडियो</span>
                </button>

                {/* Instagram Reels Audio Button */}
                <a
                  href="https://www.instagram.com/reels/audio/697461047427900/"
                  target="_blank"
                  rel="noreferrer"
                  className="flex flex-col items-center gap-1 p-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all cursor-pointer group"
                  title="Instagram Reel Audio"
                >
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-yellow-500/20 via-pink-500/20 to-purple-600/20 border border-pink-500/30 flex items-center justify-center group-hover:border-pink-500/60">
                    <Instagram className="w-5 h-5 text-pink-300 group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="text-[9px] font-medium text-pink-300">Reels</span>
                </a>

                {/* Glowing Mic Button */}
                <button
                  onClick={onToggleVoice}
                  className={`relative p-1 rounded-full transition-all duration-300 transform active:scale-95 cursor-pointer ${
                    isVoiceActive
                      ? 'bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 shadow-[0_0_40px_rgba(244,63,94,0.9)]'
                      : 'bg-gradient-to-tr from-rose-900/60 to-purple-900/60 border border-rose-500/50 hover:border-rose-400 shadow-lg'
                  }`}
                >
                  <div
                    className={`w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center ${
                      isSpeaking
                        ? 'bg-rose-600 text-white animate-pulse'
                        : isListening
                        ? 'bg-gradient-to-b from-pink-600 to-purple-700 text-white'
                        : 'bg-[#1e0e2d] text-rose-300'
                    }`}
                  >
                    {isVoiceActive ? (
                      <Mic className="w-6 h-6 animate-bounce" />
                    ) : (
                      <MicOff className="w-5 h-5 text-zinc-400" />
                    )}
                  </div>
                </button>

                {/* Stop / Mute button */}
                <button
                  onClick={isSpeaking ? onInterrupt : onToggleMute}
                  className="flex flex-col items-center gap-1 p-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all cursor-pointer group"
                  title={isSpeaking ? 'Stop' : isMuted ? 'Unmute' : 'Mute'}
                >
                  <div className="w-10 h-10 rounded-2xl bg-[#20132e] border border-white/10 flex items-center justify-center group-hover:border-rose-500/40">
                    {isSpeaking ? (
                      <Square className="w-4 h-4 text-rose-400 fill-rose-400" />
                    ) : isMuted ? (
                      <VolumeX className="w-4 h-4 text-amber-400" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-zinc-300 group-hover:text-rose-300" />
                    )}
                  </div>
                  <span className="text-[9px] font-medium text-zinc-400 group-hover:text-zinc-200">
                    {isSpeaking ? 'Stop' : isMuted ? 'Unmute' : 'Mute'}
                  </span>
                </button>

                {/* Direct PDF & Chat Button */}
                <button
                  id="bottom-chat-pdf-quick-button"
                  onClick={onOpenChatPdf}
                  className="flex flex-col items-center gap-1 p-2 rounded-2xl bg-white/5 hover:bg-amber-950/60 border border-white/10 hover:border-amber-500/50 text-white/70 hover:text-white transition-all cursor-pointer group"
                  title="PDF अपलोड करें और English Words निकालें"
                >
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-yellow-600/20 border border-amber-500/30 flex items-center justify-center group-hover:border-amber-500/60">
                    <FileText className="w-5 h-5 text-amber-300 group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="text-[9px] font-medium text-amber-300">PDF चैट</span>
                </button>
              </div>
            </div>

            {/* iPhone Home Indicator Bar */}
            <div className="w-28 h-1 bg-white/30 rounded-full mx-auto my-1 shrink-0" />
          </div>
        </div>
      </div>

      {/* Floating Visual Decoration Toast Message */}
      <AnimatePresence>
        {decorToast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed bottom-20 z-50 px-4 py-2.5 rounded-2xl bg-black/90 text-amber-200 border border-amber-500/40 shadow-2xl backdrop-blur-md text-xs font-medium max-w-sm text-center flex items-center gap-2"
          >
            <Crown className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
            <span>{decorToast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
