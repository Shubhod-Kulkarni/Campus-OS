'use client';

// ============================================================
// Campus OS — Boot Sequence
// Apple-style boot animation with logo + progress bar
// Auto-redirects to lock screen after animation completes
// ============================================================
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDesktopStore } from '@/stores/useDesktopStore';

export default function BootSequence() {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'logo' | 'progress' | 'done'>('logo');
  const { finishBoot } = useDesktopStore();

  useEffect(() => {
    // Phase 1: Show logo for 800ms
    const t1 = setTimeout(() => setPhase('progress'), 800);

    // Phase 2: Animate progress bar over 2.2s
    let prog = 0;
    const interval = setInterval(() => {
      prog += Math.random() * 4 + 2;
      if (prog >= 100) {
        prog = 100;
        clearInterval(interval);
        setTimeout(() => {
          setPhase('done');
          setTimeout(finishBoot, 500);
        }, 300);
      }
      setProgress(prog);
    }, 60);

    return () => {
      clearTimeout(t1);
      clearInterval(interval);
    };
  }, [finishBoot]);

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          key="boot"
          className="fixed inset-0 flex flex-col items-center justify-center bg-[#0f172a] z-[9999]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02, transition: { duration: 0.5 } }}
        >
          {/* Campus OS Logo */}
          <motion.div
            className="flex flex-col items-center gap-8 mb-16"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } }}
          >
            {/* Animated logo ring */}
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#60a5fa] to-[#a78bfa] animate-pulse-ring opacity-30" />
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-[#60a5fa] to-[#a78bfa] flex items-center justify-center shadow-2xl">
                <svg viewBox="0 0 48 48" className="w-10 h-10 text-white fill-current">
                  <path d="M24 4C13 4 4 13 4 24s9 20 20 20 20-9 20-20S35 4 24 4zm-2 28v-8h-6l8-12v8h6L22 32z" />
                </svg>
              </div>
              {/* Spinning ring */}
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#60a5fa]/60 animate-spin-slow" />
            </div>

            <div className="text-center">
              <h1 className="text-3xl font-bold text-white tracking-tight">Campus OS</h1>
              <p className="text-sm text-[#94a3b8] mt-1 tracking-widest uppercase">Student Desktop Environment</p>
            </div>
          </motion.div>

          {/* Progress bar */}
          {phase === 'progress' && (
            <motion.div
              className="w-64"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.2 } }}
            >
              <div className="h-1 bg-[#1e293b] rounded-full overflow-hidden">
                <motion.div
                  className="h-full progress-shine rounded-full"
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: 'linear', duration: 0.06 }}
                />
              </div>
              <p className="text-center text-xs text-[#475569] mt-3">
                {progress < 40 ? 'Initializing...' : progress < 75 ? 'Loading apps...' : 'Almost ready...'}
              </p>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
