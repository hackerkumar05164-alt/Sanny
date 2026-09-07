import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Phone,
  RefreshCw,
  Sparkles,
  Eye,
  Heart,
  Crown,
  Volume2,
} from 'lucide-react';
import { ConnectionState, AtmosphereTheme, MoodVibe } from '../types';
import { AnayaRealPhotoAvatar } from './AnayaPhotoAvatar';

interface VideoCallInterfaceProps {
  status: ConnectionState;
  atmosphere: AtmosphereTheme;
  inputLevel: number;
  outputLevel: number;
  sessionDuration: number;
  isMuted: boolean;
  toggleMute: () => void;
  localVideoStream: MediaStream | null;
  isCameraMuted: boolean;
  toggleCameraMute: () => void;
  cameraFacingMode: 'user' | 'environment';
  toggleCamera: () => void;
  onEndCall: () => void;
  onSwitchToVoice: () => void;
  onSendActionPrompt: (prompt: string) => void;
  lastTranscript?: string;
}

export const VideoCallInterface: React.FC<VideoCallInterfaceProps> = ({
  status,
  inputLevel,
  outputLevel,
  sessionDuration,
  isMuted,
  toggleMute,
  localVideoStream,
  isCameraMuted,
  toggleCameraMute,
  cameraFacingMode,
  toggleCamera,
  onEndCall,
  onSwitchToVoice,
  onSendActionPrompt,
  lastTranscript,
}) => {
  const localVideoRef = useRef<HTMLVideoElement | null>(null);

  // Attach MediaStream to local preview video element
  useEffect(() => {
    if (localVideoRef.current && localVideoStream) {
      localVideoRef.current.srcObject = localVideoStream;
    }
  }, [localVideoStream]);

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      id="video-call-interface-container"
      className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-gradient-to-b from-zinc-950 via-zinc-900 to-black text-white select-none"
    >
      {/* Top Header Bar */}
      <div className="relative z-20 flex items-center justify-between px-4 pt-4 pb-2 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400">
            <Crown className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold tracking-wide text-rose-300">अनाया</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                बॉस की क्वीन
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                लाइव वीडियो कॉल
              </span>
              <span>•</span>
              <span className="font-mono text-zinc-300">{formatDuration(sessionDuration)}</span>
            </div>
          </div>
        </div>

        {/* Live Vision Status Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/40 shadow-lg shadow-rose-950/40">
          <Eye className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
          <span className="text-xs font-semibold text-rose-200">लाइव विज़न चालू</span>
        </div>
      </div>

      {/* Main Center Video / Visual Call Arena */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-4">
        {/* Subtle Background Glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <motion.div
            animate={{
              scale: status === 'speaking' ? [1, 1.25, 1] : [1, 1.08, 1],
              opacity: status === 'speaking' ? 0.45 : 0.25,
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-96 h-96 rounded-full bg-gradient-to-tr from-rose-600/30 via-pink-600/20 to-amber-500/20 blur-3xl"
          />
        </div>

        {/* Anaya Photo Avatar with Lip Sync & Reactive Audio Glow */}
        <div className="relative z-10 flex flex-col items-center">
          <AnayaRealPhotoAvatar
            status={status}
            inputLevel={inputLevel}
            outputLevel={outputLevel}
            className="scale-95 sm:scale-105"
          />

          {/* Status Badge */}
          <div className="mt-4 flex items-center gap-2">
            <span
              className={`text-xs px-3 py-1 rounded-full font-medium shadow-md transition-all ${
                status === 'speaking'
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-rose-500/30 animate-pulse'
                  : status === 'listening'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-zinc-800 text-zinc-300'
              }`}
            >
              {status === 'speaking'
                ? 'अनाया बोल रही है...'
                : status === 'listening'
                ? 'अनाया आपको देख और सुन रही है...'
                : 'कनेक्ट हो रहा है...'}
            </span>
          </div>

          {/* Live Transcript / Response Snippet */}
          {lastTranscript && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 max-w-xs sm:max-w-sm px-3.5 py-2 rounded-xl bg-black/60 border border-rose-500/30 backdrop-blur-md text-xs text-rose-100 text-center shadow-lg"
            >
              "{lastTranscript.slice(-90)}"
            </motion.div>
          )}
        </div>

        {/* User Webcam Self-View PiP Window (Picture-in-Picture) */}
        <motion.div
          drag
          dragConstraints={{ left: -140, right: 140, top: -200, bottom: 200 }}
          className="absolute bottom-4 right-4 z-30 w-28 h-36 sm:w-36 sm:h-48 rounded-2xl overflow-hidden border-2 border-rose-500/60 shadow-2xl bg-zinc-950 backdrop-blur-md cursor-grab active:cursor-grabbing group"
        >
          {isCameraMuted ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 text-zinc-500 p-2 text-center">
              <VideoOff className="w-6 h-6 mb-1 text-rose-400" />
              <span className="text-[10px] leading-tight">कैमरा बंद है</span>
            </div>
          ) : (
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${
                cameraFacingMode === 'user' ? 'scale-x-[-1]' : ''
              }`}
            />
          )}

          {/* PiP Overlay Label */}
          <div className="absolute top-1.5 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[9px] font-bold text-amber-300">
            <span>बॉस (You)</span>
          </div>

          {/* Flip Camera Quick Button inside PiP */}
          <button
            id="pip-flip-camera-button"
            onClick={(e) => {
              e.stopPropagation();
              toggleCamera();
            }}
            title="कैमरा बदलें"
            className="absolute bottom-1.5 right-1.5 p-1 rounded-full bg-black/70 hover:bg-rose-600 text-white transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </motion.div>
      </div>

      {/* Quick Boss Prompts Bar */}
      <div className="relative z-20 px-3 py-1.5 flex items-center justify-center gap-1.5 overflow-x-auto no-scrollbar">
        <button
          onClick={() => onSendActionPrompt('अनाया, देखिए मैं कैमरे में कैसा लग रहा हूँ? सच बताइए!')}
          className="whitespace-nowrap px-2.5 py-1 rounded-full bg-zinc-900/90 hover:bg-rose-950/80 border border-rose-500/30 text-[11px] text-rose-200 flex items-center gap-1 transition-all"
        >
          <Sparkles className="w-3 h-3 text-amber-400" />
          कैसा लग रहा हूँ?
        </button>
        <button
          onClick={() => onSendActionPrompt('अनाया, अपने बॉस के स्वैग और लुक की फुल एटीट्यूड में तारीफ करो!')}
          className="whitespace-nowrap px-2.5 py-1 rounded-full bg-zinc-900/90 hover:bg-rose-950/80 border border-rose-500/30 text-[11px] text-rose-200 flex items-center gap-1 transition-all"
        >
          <Heart className="w-3 h-3 text-rose-400" />
          मेरी तारीफ़ करो
        </button>
        <button
          onClick={() => onSendActionPrompt('अनाया, कैमरे में देखिए मैंने क्या पकड़ा हुआ है, बताइए यह क्या है?')}
          className="whitespace-nowrap px-2.5 py-1 rounded-full bg-zinc-900/90 hover:bg-rose-950/80 border border-rose-500/30 text-[11px] text-rose-200 flex items-center gap-1 transition-all"
        >
          <Eye className="w-3 h-3 text-cyan-400" />
          यह क्या है?
        </button>
        <button
          onClick={() => onSendActionPrompt('अनाया, अपने बॉस के लिए एक प्यारी सी रोमांटिक शायरी बोलो!')}
          className="whitespace-nowrap px-2.5 py-1 rounded-full bg-zinc-900/90 hover:bg-rose-950/80 border border-rose-500/30 text-[11px] text-rose-200 flex items-center gap-1 transition-all"
        >
          <Crown className="w-3 h-3 text-amber-400" />
          शायरी सुनाओ
        </button>
      </div>

      {/* Bottom Video Call Controls Bar */}
      <div className="relative z-20 px-6 py-4 bg-gradient-to-t from-black via-black/90 to-transparent flex items-center justify-around">
        {/* Toggle Camera Mute */}
        <button
          id="video-call-toggle-camera-button"
          onClick={toggleCameraMute}
          title={isCameraMuted ? 'कैमरा चालू करें' : 'कैमरा बंद करें'}
          className={`flex flex-col items-center gap-1 p-3 rounded-full transition-all ${
            isCameraMuted
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/40'
              : 'bg-zinc-800/90 text-zinc-300 hover:bg-zinc-700'
          }`}
        >
          {isCameraMuted ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
        </button>

        {/* Flip Camera */}
        <button
          id="video-call-flip-camera-button"
          onClick={toggleCamera}
          title="कैमरा पलटें (आगे/पीछे)"
          className="flex flex-col items-center gap-1 p-3 rounded-full bg-zinc-800/90 text-zinc-300 hover:bg-zinc-700 transition-all active:rotate-180"
        >
          <RefreshCw className="w-5 h-5" />
        </button>

        {/* End Call Button */}
        <button
          id="video-call-end-call-button"
          onClick={onEndCall}
          title="कॉल काटें"
          className="flex flex-col items-center gap-1 p-4 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-xl shadow-rose-600/50 hover:scale-105 transition-all"
        >
          <PhoneOff className="w-6 h-6" />
        </button>

        {/* Toggle Mic */}
        <button
          id="video-call-toggle-mic-button"
          onClick={toggleMute}
          title={isMuted ? 'माइक चालू करें' : 'माइक म्यूट करें'}
          className={`flex flex-col items-center gap-1 p-3 rounded-full transition-all ${
            isMuted
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/40'
              : 'bg-zinc-800/90 text-zinc-300 hover:bg-zinc-700'
          }`}
        >
          {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* Switch to Voice Only */}
        <button
          id="video-call-switch-to-voice-button"
          onClick={onSwitchToVoice}
          title="वॉइस कॉल पर बदलें"
          className="flex flex-col items-center gap-1 p-3 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 transition-all"
        >
          <Phone className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
