'use client';

import { motion } from 'framer-motion';
import { AvatarPersona, PERSONA_DETAILS } from './types';
import { Volume2, Mic, Brain, Sparkles } from 'lucide-react';

interface AIAvatarCanvasProps {
  persona: AvatarPersona;
  isSpeaking: boolean;
  isListening: boolean;
  isThinking: boolean;
  mouthOpen: number; // 0 to 1
  subtitleText: string;
}

export default function AIAvatarCanvas({
  persona,
  isSpeaking,
  isListening,
  isThinking,
  mouthOpen,
  subtitleText,
}: AIAvatarCanvasProps) {
  const details = PERSONA_DETAILS[persona] || PERSONA_DETAILS['Corporate Recruiter'];

  // Status text & colors
  let statusText = 'Ready';
  let statusColor = '#94a3b8'; // slate
  let StatusIcon = Sparkles;

  if (isSpeaking) {
    statusText = 'Speaking...';
    statusColor = details.avatarAccent;
    StatusIcon = Volume2;
  } else if (isThinking) {
    statusText = 'Thinking...';
    statusColor = '#fbbf24'; // amber
    StatusIcon = Brain;
  } else if (isListening) {
    statusText = 'Listening...';
    statusColor = '#34d399'; // emerald
    StatusIcon = Mic;
  }

  // Mouth height calculation for lip-sync animation
  const mouthHeight = Math.max(3, mouthOpen * 22);

  return (
    <div className="relative w-full h-full min-h-[380px] rounded-2xl bg-[#080d1a] border border-slate-800/80 overflow-hidden flex flex-col items-center justify-center shadow-2xl">
      {/* Background Gradient & Ambient Glow Aura */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${details.avatarBg} opacity-20 transition-opacity duration-500`}
      />

      {/* Pulsating Voice Wave / Aura Rings when Speaking */}
      {isSpeaking && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="w-80 h-80 rounded-full blur-3xl"
            style={{ background: details.avatarAccent }}
          />
          <motion.div
            animate={{ scale: [1.1, 1.4, 1.1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
            className="w-96 h-96 rounded-full blur-3xl"
            style={{ background: details.avatarAccent }}
          />
        </div>
      )}

      {/* Pulsating Thinking Glow */}
      {isThinking && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            animate={{ rotate: 360, opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            className="w-72 h-72 rounded-full border-2 border-dashed border-amber-400/40 blur-sm"
          />
        </div>
      )}

      {/* Top Status Bar Badge */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/50 shadow-lg">
        <span
          className="w-2.5 h-2.5 rounded-full animate-pulse"
          style={{ backgroundColor: statusColor }}
        />
        <StatusIcon size={14} style={{ color: statusColor }} />
        <span className="text-xs font-semibold tracking-wide text-slate-200">{statusText}</span>
      </div>

      {/* Persona Info Tag */}
      <div className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/50 text-xs font-medium text-slate-300 shadow-lg">
        {details.name} • <span style={{ color: details.avatarAccent }}>{persona}</span>
      </div>

      {/* Interactive Animated SVG AI Avatar Container */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center"
        animate={isSpeaking ? { y: [0, -3, 0] } : isThinking ? { rotate: [-1, 1, -1] } : { y: [0, 2, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Avatar Head & Body SVG Visualizer */}
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
          {/* Avatar Base Silhouette & Face Artwork */}
          <svg className="w-full h-full drop-shadow-2xl" viewBox="0 0 200 200" fill="none">
            {/* Background Halo */}
            <circle cx="100" cy="100" r="90" fill="url(#avatarGlow)" opacity="0.15" />

            {/* Suit / Body Shoulders */}
            <path
              d="M30 190 C30 145 60 135 100 135 C140 135 170 145 170 190 Z"
              fill={persona === 'Startup Lead' ? '#1e293b' : persona === 'Senior Engineering Manager' ? '#0f172a' : '#1e1b4b'}
              stroke="#334155"
              strokeWidth="2"
            />
            {/* Shirt V-Neck */}
            <path d="M85 135 L100 165 L115 135 Z" fill="#38bdf8" opacity="0.8" />
            {persona === 'Corporate Recruiter' && (
              <path d="M96 135 L100 160 L104 135 Z" fill="#f43f5e" />
            )}

            {/* Neck */}
            <rect x="86" y="115" width="28" height="25" rx="6" fill="#e2e8f0" />

            {/* Face Shape */}
            <path
              d="M60 70 C60 40 80 30 100 30 C120 30 140 40 140 70 C140 100 120 120 100 120 C80 120 60 100 60 70 Z"
              fill="#f1f5f9"
              stroke="#94a3b8"
              strokeWidth="2"
            />

            {/* Hair Style per Persona */}
            {persona === 'Corporate Recruiter' && (
              <path d="M55 65 C55 35 75 22 100 22 C125 22 145 35 145 65 C145 45 130 25 100 25 C70 25 55 45 55 65 Z" fill="#334155" />
            )}
            {persona === 'Senior Engineering Manager' && (
              <path d="M58 55 C58 25 80 20 100 20 C120 20 142 25 142 55 C142 35 125 22 100 22 C75 22 58 35 58 55 Z" fill="#1e293b" />
            )}
            {persona === 'Startup Lead' && (
              <path d="M60 45 C65 20 85 15 100 15 C120 15 135 25 140 45 C130 30 115 25 100 25 C85 25 70 35 60 45 Z" fill="#475569" />
            )}

            {/* Glasses for Senior Eng Manager */}
            {persona === 'Senior Engineering Manager' && (
              <g stroke="#38bdf8" strokeWidth="2.5" fill="none">
                <rect x="70" y="62" width="22" height="14" rx="3" />
                <rect x="108" y="62" width="22" height="14" rx="3" />
                <line x1="92" y1="68" x2="108" y2="68" />
              </g>
            )}

            {/* Eyes */}
            <circle cx="78" cy="68" r="4.5" fill="#0f172a" />
            <circle cx="122" cy="68" r="4.5" fill="#0f172a" />
            <circle cx="79.5" cy="66.5" r="1.5" fill="#ffffff" />
            <circle cx="123.5" cy="66.5" r="1.5" fill="#ffffff" />

            {/* Eyebrows */}
            <path d="M72 58 Q78 55 84 58" stroke="#475569" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M116 58 Q122 55 128 58" stroke="#475569" strokeWidth="2" strokeLinecap="round" fill="none" />

            {/* Nose */}
            <path d="M100 74 L97 84 L103 84" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />

            {/* Lip-Sync Dynamic Mouth */}
            <rect
              x="86"
              y={94 - mouthHeight / 2}
              width="28"
              height={mouthHeight}
              rx={mouthHeight > 8 ? "10" : "2"}
              fill={isSpeaking ? "#e11d48" : "#94a3b8"}
              className="transition-all duration-75"
            />
            {isSpeaking && mouthHeight > 8 && (
              <rect x="90" y={94 - mouthHeight / 2 + 2} width="20" height="3" rx="1" fill="#ffffff" opacity="0.9" />
            )}

            <defs>
              <radialGradient id="avatarGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={details.avatarAccent} />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </motion.div>

      {/* Live Subtitle Overlay Bar */}
      <div className="absolute bottom-4 left-4 right-4 z-20">
        <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/60 shadow-2xl text-center">
          <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1 flex items-center justify-center gap-1.5">
            <Volume2 size={13} style={{ color: details.avatarAccent }} />
            Interviewer Spoken Subtitles
          </p>
          <p className="text-sm sm:text-base font-medium text-slate-100 leading-snug line-clamp-2">
            {subtitleText || details.greeting}
          </p>
        </div>
      </div>
    </div>
  );
}
