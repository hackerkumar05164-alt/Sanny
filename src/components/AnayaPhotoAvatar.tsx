import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart, Music2, ExternalLink } from 'lucide-react';
import { ConnectionState } from '../types';

interface AnayaRealPhotoAvatarProps {
  status: ConnectionState;
  inputLevel: number;
  outputLevel: number;
  onTap?: () => void;
  className?: string;
}

export const AnayaRealPhotoAvatar: React.FC<AnayaRealPhotoAvatarProps> = ({
  status,
  inputLevel,
  outputLevel,
  onTap,
  className = '',
}) => {
  const isSpeaking = status === 'speaking';
  const isListening = status === 'listening';

  // Dynamic mouth viseme state for realistic lip-syncing when Anaya speaks
  const [mouthShape, setMouthShape] = useState<number>(0);
  const [isWinking, setIsWinking] = useState<boolean>(false);

  useEffect(() => {
    if (!isSpeaking) {
      setMouthShape(0);
      return;
    }

    const interval = setInterval(() => {
      // Rotate mouth shapes based on voice intensity
      const shapes = [0, 1, 2, 3, 2, 1];
      const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
      setMouthShape(randomShape);
    }, 110);

    return () => clearInterval(interval);
  }, [isSpeaking]);

  // Periodic cute wink
  useEffect(() => {
    const winkInterval = setInterval(() => {
      if (!isSpeaking) {
        setIsWinking(true);
        setTimeout(() => setIsWinking(false), 250);
      }
    }, 6000);

    return () => clearInterval(winkInterval);
  }, [isSpeaking]);

  return (
    <div
      id="anaya-real-photo-avatar-container"
      onClick={onTap}
      className={`relative flex flex-col items-center justify-center cursor-pointer select-none ${className}`}
    >
      {/* Outer Sound-Reactive Glow Aura Ring */}
      <motion.div
        animate={{
          scale: isSpeaking
            ? [1.02, 1.14 + outputLevel * 0.4, 1.02]
            : isListening
            ? [1.0, 1.06 + inputLevel * 0.2, 1.0]
            : [1.0, 1.03, 1.0],
          opacity: isSpeaking ? [0.75, 1, 0.75] : [0.4, 0.65, 0.4],
        }}
        transition={{
          duration: isSpeaking ? 0.9 : 2.4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-gradient-to-tr from-pink-600/40 via-rose-500/30 to-amber-400/30 blur-2xl pointer-events-none -z-10"
      />

      {/* Rotating Cyber-Aura Border */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        className="absolute w-52 h-52 sm:w-60 sm:h-60 rounded-full border-2 border-dashed border-pink-400/40 pointer-events-none"
      />

      {/* Audio Reactive Pulse Ring */}
      {isSpeaking && (
        <motion.div
          animate={{ scale: [1, 1.25, 1.4], opacity: [0.8, 0.4, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
          className="absolute w-48 h-48 sm:w-56 sm:h-56 rounded-full border-2 border-pink-400 pointer-events-none"
        />
      )}

      {/* Main Avatar Circular Frame */}
      <motion.div
        animate={{
          scale: isSpeaking
            ? 1.0 + Math.min(0.18, outputLevel * 0.6)
            : isListening
            ? 1.0 + Math.min(0.08, inputLevel * 0.3)
            : 1.0,
          y: isSpeaking ? [0, -3, 0] : [0, -1, 0],
        }}
        transition={{
          scale: { type: 'spring', stiffness: 300, damping: 20 },
          y: { duration: 1.6, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full p-1.5 bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-300 shadow-[0_0_50px_rgba(244,63,94,0.85)] overflow-hidden z-10 flex items-center justify-center border-2 border-white/40"
      >
        {/* Inner Canvas with High-Fidelity Anaya Portrait */}
        <div className="w-full h-full rounded-full bg-[#1c0822] relative overflow-hidden flex items-center justify-center border border-white/20">
          {/* Background Ambient Gradient matching the screenshot's soft pink interior */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#3b092b] via-[#6e1e47] to-[#f4a0be] z-0" />

          {/* High-Fidelity Realistic Vector Portrait of Anaya (from user's screenshot) */}
          <svg
            viewBox="0 0 300 300"
            className="w-full h-full object-cover scale-110 translate-y-1 transition-transform duration-300 z-10"
          >
            <defs>
              {/* Skin Tone Gradient (Soft Indian Warm Fair Tone) */}
              <radialGradient id="anayaSkin" cx="50%" cy="40%" r="55%">
                <stop offset="0%" stopColor="#fff0f3" />
                <stop offset="65%" stopColor="#fed7e2" />
                <stop offset="100%" stopColor="#f8b4c8" />
              </radialGradient>

              {/* Glossy Black Hair with Natural Highlights */}
              <linearGradient id="anayaHair" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#2c1624" />
                <stop offset="35%" stopColor="#150813" />
                <stop offset="85%" stopColor="#080208" />
                <stop offset="100%" stopColor="#000000" />
              </linearGradient>

              {/* Rich Rose-Pink Matte Lipstick */}
              <linearGradient id="anayaLips" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff2a6d" />
                <stop offset="60%" stopColor="#d91b5c" />
                <stop offset="100%" stopColor="#960d3d" />
              </linearGradient>

              {/* Gold Jewelry Shimmer */}
              <linearGradient id="goldShimmer" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="50%" stopColor="#facc15" />
                <stop offset="100%" stopColor="#b45309" />
              </linearGradient>

              {/* Cheek Glow */}
              <radialGradient id="anayaBlush" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ff4d79" stopOpacity={isSpeaking ? 0.75 : 0.55} />
                <stop offset="100%" stopColor="#ff4d79" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* 1. Flowing Voluminous Black Hair (Back Layer) */}
            <path
              d="M 50 180 C 30 100 60 20 150 18 C 240 20 270 100 250 180 C 265 240 280 290 280 300 L 20 300 C 20 290 35 240 50 180 Z"
              fill="url(#anayaHair)"
            />

            {/* 2. Black Embroidered Traditional Dress with Sequin Texture */}
            <path
              d="M 50 300 C 60 230 110 210 150 210 C 190 210 240 230 250 300 Z"
              fill="#0d030f"
            />
            {/* Sequin Embroidery Border */}
            <path
              d="M 85 240 Q 150 220 215 240 L 225 255 Q 150 232 75 255 Z"
              fill="url(#goldShimmer)"
              opacity="0.85"
            />
            {/* Subtle sequin sparkle dots */}
            <g fill="#ffffff" opacity="0.6">
              <circle cx="100" cy="245" r="1.5" />
              <circle cx="125" cy="238" r="1.5" />
              <circle cx="150" cy="235" r="1.8" />
              <circle cx="175" cy="238" r="1.5" />
              <circle cx="200" cy="245" r="1.5" />
            </g>

            {/* Delicate Golden Necklace with Diamond Pendant */}
            <path
              d="M 120 205 Q 150 228 180 205"
              stroke="url(#goldShimmer)"
              strokeWidth="1.6"
              fill="none"
            />
            <circle cx="150" cy="224" r="3" fill="#ffffff" stroke="#facc15" strokeWidth="0.8" />

            {/* 3. Neck and Elegant Collarbone */}
            <path
              d="M 132 170 L 132 208 C 142 214 158 214 168 208 L 168 170 Z"
              fill="url(#anayaSkin)"
            />

            {/* Long Traditional Dangling Jhumka / Chandelier Earring (Right Side) */}
            <g transform="translate(208, 125)">
              <circle cx="0" cy="0" r="3" fill="url(#goldShimmer)" />
              <line x1="0" y1="3" x2="0" y2="45" stroke="url(#goldShimmer)" strokeWidth="2.2" />
              <line x1="-3" y1="12" x2="3" y2="12" stroke="url(#goldShimmer)" strokeWidth="1.8" />
              <line x1="-4" y1="24" x2="4" y2="24" stroke="url(#goldShimmer)" strokeWidth="1.8" />
              <line x1="-5" y1="36" x2="5" y2="36" stroke="url(#goldShimmer)" strokeWidth="1.8" />
              <circle cx="0" cy="46" r="3.5" fill="url(#goldShimmer)" />
            </g>

            {/* 4. Beautiful Face Contour (Slight Elegant Tilt) */}
            <path
              d="M 98 115 C 98 160 125 186 150 186 C 175 186 202 160 202 115 C 202 78 178 70 150 70 C 122 70 98 78 98 115 Z"
              fill="url(#anayaSkin)"
            />

            {/* Warm Cheeks Blush */}
            <ellipse cx="120" cy="140" rx={isSpeaking ? 14 : 11} ry={isSpeaking ? 8 : 6} fill="url(#anayaBlush)" />
            <ellipse cx="180" cy="140" rx={isSpeaking ? 14 : 11} ry={isSpeaking ? 8 : 6} fill="url(#anayaBlush)" />

            {/* Iconic Small Black Bindi between Eyebrows */}
            <circle cx="150" cy="98" r="2.4" fill="#0f020c" />

            {/* Iconic Beauty Mole (Near Right Corner of Lips/Chin as in screenshot) */}
            <circle cx="166" cy="166" r="1.6" fill="#1f0515" />

            {/* Cute Nose */}
            <path
              d="M 148 118 Q 150 134 153 134 Q 156 134 154 130"
              stroke="#d9869f"
              strokeWidth="1.4"
              fill="none"
              strokeLinecap="round"
            />

            {/* 5. Big Almond Expressive Eyes */}
            {/* Left Eye */}
            <g>
              {/* Eyeliner / Kajal */}
              <path
                d="M 112 118 Q 126 108 140 119"
                stroke="#150212"
                strokeWidth="3.2"
                strokeLinecap="round"
                fill="none"
              />
              <ellipse cx="126" cy="122" rx="7.5" ry="9" fill="#180410" />
              <ellipse cx="126" cy="122" rx="5" ry="6.5" fill="#3d1226" />
              <circle cx="123" cy="118" r="2.8" fill="#ffffff" />
              <circle cx="129" cy="125" r="1.4" fill="#ffffff" />
              {/* Lower Lash Line */}
              <path d="M 116 128 Q 126 131 136 128" stroke="#3d1226" strokeWidth="1.4" fill="none" />
            </g>

            {/* Right Eye (Normal or Playful Wink) */}
            {isWinking ? (
              <g>
                <path
                  d="M 160 124 Q 174 114 188 126"
                  stroke="#150212"
                  strokeWidth="3.6"
                  strokeLinecap="round"
                  fill="none"
                />
                <path d="M 185 120 L 189 116" stroke="#150212" strokeWidth="2.2" strokeLinecap="round" />
              </g>
            ) : (
              <g>
                <path
                  d="M 160 119 Q 174 108 188 118"
                  stroke="#150212"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  fill="none"
                />
                <ellipse cx="174" cy="122" rx="7.5" ry="9" fill="#180410" />
                <ellipse cx="174" cy="122" rx="5" ry="6.5" fill="#3d1226" />
                <circle cx="171" cy="118" r="2.8" fill="#ffffff" />
                <circle cx="177" cy="125" r="1.4" fill="#ffffff" />
                <path d="M 164 128 Q 174 131 184 128" stroke="#3d1226" strokeWidth="1.4" fill="none" />
              </g>
            )}

            {/* Well-Defined Natural Eyebrows */}
            <path
              d="M 108 103 Q 124 94 138 104"
              stroke="#1a0412"
              strokeWidth="3.4"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 162 104 Q 176 94 192 103"
              stroke="#1a0412"
              strokeWidth="3.4"
              strokeLinecap="round"
              fill="none"
            />

            {/* 6. Dynamic Lip-Syncing Lips (Reacts to Anaya's voice) */}
            {isSpeaking ? (
              mouthShape === 0 ? (
                // Shape 1: Open Talking ('A' / 'Ah')
                <g>
                  <path
                    d="M 140 152 Q 150 148 160 152 Q 162 165 150 166 Q 138 165 140 152 Z"
                    fill="url(#anayaLips)"
                    stroke="#7a0a2c"
                    strokeWidth="1.2"
                  />
                  <path d="M 143 153 Q 150 155 157 153" stroke="#ffffff" strokeWidth="1.8" fill="none" />
                  <path d="M 145 161 Q 150 158 155 161" fill="#ff739a" />
                </g>
              ) : mouthShape === 1 ? (
                // Shape 2: Round Talking ('O' / 'Oh')
                <g>
                  <ellipse cx="150" cy="158" rx="6.5" ry="8" fill="url(#anayaLips)" stroke="#7a0a2c" strokeWidth="1.2" />
                  <ellipse cx="150" cy="161" rx="4" ry="3" fill="#ff739a" />
                  <path d="M 146 154 Q 150 155 154 154" stroke="#ffffff" strokeWidth="1.4" fill="none" />
                </g>
              ) : mouthShape === 2 ? (
                // Shape 3: Smiling Open Laugh ('E' / 'Smile')
                <g>
                  <path
                    d="M 138 152 Q 150 155 162 152 Q 160 163 150 164 Q 140 163 138 152 Z"
                    fill="url(#anayaLips)"
                    stroke="#7a0a2c"
                    strokeWidth="1.2"
                  />
                  <path d="M 140 153 Q 150 156 160 153" stroke="#ffffff" strokeWidth="1.8" fill="none" />
                  <circle cx="150" cy="160" r="2.2" fill="#ff739a" />
                </g>
              ) : (
                // Shape 4: Cute Talking Smile
                <g>
                  <path
                    d="M 139 152 Q 145 156 150 153 Q 155 156 161 152 Q 159 161 150 162 Q 141 161 139 152 Z"
                    fill="url(#anayaLips)"
                    stroke="#7a0a2c"
                    strokeWidth="1.2"
                  />
                </g>
              )
            ) : (
              // Resting Pink Lipstick Smile (matching screenshot)
              <g>
                {/* Upper Lip */}
                <path
                  d="M 138 153 Q 145 149 150 151 Q 155 149 162 153 Q 150 157 138 153 Z"
                  fill="url(#anayaLips)"
                />
                {/* Lower Lip (Plump & Glossy Pink) */}
                <path
                  d="M 138 153 Q 150 164 162 153 Q 150 157 138 153 Z"
                  fill="url(#anayaLips)"
                />
                {/* Lip Shine highlight */}
                <ellipse cx="150" cy="158" rx="4" ry="1.2" fill="#ffffff" opacity="0.4" />
              </g>
            )}

            {/* 7. Front Natural Hair Strands & Windswept Side Bangs */}
            {/* Left Frame Strands */}
            <path
              d="M 98 80 C 88 100 80 140 82 180 C 88 150 98 120 106 95 Z"
              fill="url(#anayaHair)"
            />
            {/* Right Flowing Side Strands */}
            <path
              d="M 195 80 C 215 105 235 140 242 180 C 230 140 215 110 202 95 Z"
              fill="url(#anayaHair)"
            />
            {/* Soft Forehead Strands */}
            <path
              d="M 95 70 C 110 75 125 90 128 98 C 135 88 145 82 155 88 C 165 80 180 82 195 72 C 175 60 120 60 95 70 Z"
              fill="url(#anayaHair)"
            />
          </svg>

          {/* Floating Twinkle Sparkles */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20">
            <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#ffffff] absolute top-8 right-8 animate-ping" />
            <div className="w-1.5 h-1.5 rounded-full bg-pink-300 shadow-[0_0_10px_#f43f5e] absolute bottom-10 left-8 animate-pulse" />
          </div>
        </div>
      </motion.div>

      {/* Identity Tag */}
      <div className="mt-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-950/60 border border-pink-500/30 text-[12px] text-pink-200 shadow-md backdrop-blur-md">
        <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400 animate-pulse" />
        <span>Voice AI Avatar</span>
      </div>
    </div>
  );
};
