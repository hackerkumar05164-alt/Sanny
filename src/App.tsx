import React, { useState, useEffect } from 'react';
import { useLiveAssistant } from './hooks/useLiveAssistant';
import { PhoneVoiceInterface } from './components/PhoneVoiceInterface';
import { VideoCallInterface } from './components/VideoCallInterface';
import { BossChatPdfView } from './components/BossChatPdfView';
import { BossPhotoEditStudio } from './components/BossPhotoEditStudio';
import { Crown, Video, Mic, FileText, Camera } from 'lucide-react';

export type AppViewMode = 'voice_call' | 'video_call' | 'chat_pdf' | 'photo_studio';

export default function App() {
  const [activeView, setActiveView] = useState<AppViewMode>('voice_call');

  const {
    status,
    language,
    atmosphere,
    moodVibe,
    isMuted,
    toggleMute,
    inputLevel,
    outputLevel,
    sessionDuration,
    lastTranscript,
    // Video Call
    callMode,
    isVideoCallActive,
    localVideoStream,
    isCameraMuted,
    cameraFacingMode,
    startVideoCall,
    stopVideoCall,
    toggleCamera,
    toggleCameraMute,
    connect,
    disconnect,
    interrupt,
    sendTextMessage,
    triggerBossAction,
  } = useLiveAssistant();

  // Sync active view if video call becomes active or inactive
  useEffect(() => {
    if (isVideoCallActive && activeView !== 'video_call') {
      setActiveView('video_call');
    }
  }, [isVideoCallActive]);

  const handleToggleVoiceMode = () => {
    if (
      status === 'listening' ||
      status === 'speaking' ||
      status === 'connecting' ||
      status === 'executing_tool'
    ) {
      disconnect();
    } else {
      connect();
    }
  };

  const handleStartVideoCall = async () => {
    setActiveView('video_call');
    await startVideoCall();
  };

  const handleEndVideoCall = () => {
    stopVideoCall();
    disconnect();
    setActiveView('voice_call');
  };

  const handleSwitchToVoice = () => {
    stopVideoCall();
    setActiveView('voice_call');
  };

  return (
    <main
      id="anaya-app-root"
      className="relative w-full h-screen min-h-screen bg-[#07020d] flex flex-col items-center justify-center overflow-hidden select-none"
    >
      {/* Ambient background glows */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0e0318] via-[#140624] to-[#06010a] -z-10" />
      <div className="absolute w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none -top-20 left-1/3 transition-colors duration-700 bg-rose-600/15" />
      <div className="absolute w-[500px] h-[500px] rounded-full blur-[150px] pointer-events-none -bottom-20 right-1/3 transition-colors duration-700 bg-amber-500/10" />

      {/* Top Global Mode Navigation (Visible on wider screens or for instant access) */}
      <header className="w-full max-w-md px-4 pt-2 pb-1 flex items-center justify-between z-30">
        <div className="flex items-center gap-1.5 text-amber-300">
          <Crown className="w-4 h-4 fill-amber-400" />
          <span className="text-xs font-bold tracking-wider">ANAYA • BOSS AI</span>
        </div>

        {/* Global View Switcher */}
        <nav className="flex items-center gap-1 p-1 rounded-full bg-black/60 border border-white/10 backdrop-blur-md shadow-lg">
          <button
            onClick={() => {
              if (activeView === 'video_call') stopVideoCall();
              setActiveView('voice_call');
            }}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
              activeView === 'voice_call'
                ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Mic className="w-3 h-3" />
            <span>वॉइस</span>
          </button>

          <button
            onClick={handleStartVideoCall}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
              activeView === 'video_call'
                ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Video className="w-3 h-3" />
            <span>वीडियो</span>
          </button>

          <button
            onClick={() => {
              if (activeView === 'video_call') stopVideoCall();
              setActiveView('chat_pdf');
            }}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
              activeView === 'chat_pdf'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-black shadow-sm font-extrabold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <FileText className="w-3 h-3" />
            <span>चैट & PDF</span>
          </button>

          <button
            onClick={() => {
              if (activeView === 'video_call') stopVideoCall();
              setActiveView('photo_studio');
            }}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
              activeView === 'photo_studio'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm font-extrabold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Camera className="w-3 h-3" />
            <span>फोटो</span>
          </button>
        </nav>
      </header>

      {/* Main Layout Area */}
      <div className="w-full max-w-md mx-auto flex-1 flex flex-col items-center justify-center p-2 sm:p-3 overflow-hidden">
        {activeView === 'voice_call' && (
          <PhoneVoiceInterface
            status={status}
            inputLevel={inputLevel}
            outputLevel={outputLevel}
            lastTranscript={lastTranscript}
            language={language}
            atmosphere={atmosphere}
            moodVibe={moodVibe}
            onToggleVoice={handleToggleVoiceMode}
            onInterrupt={interrupt}
            isMuted={isMuted}
            onToggleMute={toggleMute}
            onStartVideoCall={handleStartVideoCall}
            onOpenChatPdf={() => setActiveView('chat_pdf')}
            onTriggerBossAction={triggerBossAction}
          />
        )}

        {activeView === 'video_call' && (
          <div
            id="iphone-phone-frame-video"
            className="relative w-full max-w-[420px] h-[850px] max-h-[94vh] rounded-[48px] p-3 sm:p-3.5 bg-gradient-to-b from-[#341d3e] via-[#1f0e2b] to-[#12071a] shadow-[0_25px_90px_rgba(0,0,0,0.9),0_0_70px_rgba(244,63,94,0.3)] border-[3.5px] border-[#59336d] flex flex-col items-center justify-between ring-1 ring-amber-400/20 shrink-0 overflow-hidden"
          >
            <div className="relative w-full h-full rounded-[38px] bg-black overflow-hidden flex flex-col justify-between border border-white/10 shadow-inner">
              <VideoCallInterface
                status={status}
                atmosphere={atmosphere}
                inputLevel={inputLevel}
                outputLevel={outputLevel}
                sessionDuration={sessionDuration}
                isMuted={isMuted}
                toggleMute={toggleMute}
                localVideoStream={localVideoStream}
                isCameraMuted={isCameraMuted}
                toggleCameraMute={toggleCameraMute}
                cameraFacingMode={cameraFacingMode}
                toggleCamera={toggleCamera}
                onEndCall={handleEndVideoCall}
                onSwitchToVoice={handleSwitchToVoice}
                onSendActionPrompt={sendTextMessage}
                lastTranscript={lastTranscript}
              />
              {/* iPhone Home Bar */}
              <div className="w-28 h-1 bg-white/30 rounded-full mx-auto my-1 shrink-0" />
            </div>
          </div>
        )}

        {activeView === 'chat_pdf' && (
          <div
            id="iphone-phone-frame-chat-pdf"
            className="relative w-full max-w-[420px] h-[850px] max-h-[94vh] rounded-[48px] p-3 sm:p-3.5 bg-gradient-to-b from-[#341d3e] via-[#1f0e2b] to-[#12071a] shadow-[0_25px_90px_rgba(0,0,0,0.9),0_0_70px_rgba(244,63,94,0.3)] border-[3.5px] border-[#59336d] flex flex-col items-center justify-between ring-1 ring-amber-400/20 shrink-0 overflow-hidden"
          >
            <div className="relative w-full h-full rounded-[38px] bg-zinc-950 overflow-hidden flex flex-col justify-between border border-white/10 shadow-inner">
              <BossChatPdfView
                onBackToCall={() => setActiveView('voice_call')}
                onStartVideoCall={handleStartVideoCall}
                onOpenPhotoStudio={() => setActiveView('photo_studio')}
              />
              {/* iPhone Home Bar */}
              <div className="w-28 h-1 bg-white/30 rounded-full mx-auto my-1 shrink-0" />
            </div>
          </div>
        )}

        {activeView === 'photo_studio' && (
          <div
            id="iphone-phone-frame-photo-studio"
            className="relative w-full max-w-[420px] h-[850px] max-h-[94vh] rounded-[48px] p-3 sm:p-3.5 bg-gradient-to-b from-[#341d3e] via-[#1f0e2b] to-[#12071a] shadow-[0_25px_90px_rgba(0,0,0,0.9),0_0_70px_rgba(244,63,94,0.3)] border-[3.5px] border-[#59336d] flex flex-col items-center justify-between ring-1 ring-amber-400/20 shrink-0 overflow-hidden"
          >
            <div className="relative w-full h-full rounded-[38px] bg-zinc-950 overflow-hidden flex flex-col justify-between border border-white/10 shadow-inner">
              <BossPhotoEditStudio
                onBackToCall={() => setActiveView('chat_pdf')}
                onSendToChat={() => {
                  setActiveView('chat_pdf');
                }}
              />
              {/* iPhone Home Bar */}
              <div className="w-28 h-1 bg-white/30 rounded-full mx-auto my-1 shrink-0" />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
