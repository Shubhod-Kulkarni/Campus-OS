'use client';

// ============================================================
// Campus OS — Dock
// macOS-style bottom dock with magnification + bounce + dots
// ============================================================
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { useAppStore } from '@/stores/useAppStore';
import { useWindowStore } from '@/stores/useWindowStore';
import { DOCK_APP_IDS, APP_MAP } from '@/components/apps/AppRegistry';

// Dynamic Lucide icon renderer
function AppIcon({ iconName, size = 28 }: { iconName: string; size?: number }) {
  const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; strokeWidth?: number }>>)[iconName];
  if (!Icon) return <span className="text-2xl">📦</span>;
  return <Icon size={size} strokeWidth={1.5} />;
}

export default function Dock() {
  const [bouncing, setBouncing] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const { launchApp } = useAppStore();
  const { windows } = useWindowStore();

  const openAppIds = new Set(windows.filter((w) => !w.isMinimized).map((w) => w.appId));

  const handleLaunch = (appId: string) => {
    setBouncing(appId);
    launchApp(appId);
    setTimeout(() => setBouncing(null), 700);
  };

  return (
    <div className="absolute bottom-3 left-0 right-0 flex justify-center z-[700] pointer-events-none">
      <motion.div
        className="glass rounded-2xl px-3 py-2 flex items-end gap-1.5 pointer-events-auto shadow-2xl"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30, delay: 0.2 } }}
      >
        {DOCK_APP_IDS.map((appId) => {
          const app = APP_MAP.get(appId);
          if (!app) return null;
          const isOpen = openAppIds.has(appId);
          const isBouncing = bouncing === appId;
          const isHovered = hoveredId === appId;

          return (
            <div key={appId} className="relative flex flex-col items-center">
              {/* Tooltip */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="absolute bottom-full mb-2 glass rounded-lg px-2.5 py-1 text-xs text-[#e2e8f0] whitespace-nowrap pointer-events-none z-10"
                  >
                    {app.name}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Icon button */}
              <motion.button
                id={`dock-${appId}`}
                onClick={() => handleLaunch(appId)}
                onMouseEnter={() => setHoveredId(appId)}
                onMouseLeave={() => setHoveredId(null)}
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white cursor-pointer relative"
                style={{ background: `${app.color}22`, border: `1px solid ${app.color}44` }}
                animate={
                  isBouncing
                    ? { y: [0, -16, 0, -8, 0], transition: { duration: 0.6 } }
                    : isHovered
                    ? { scale: 1.3, y: -10 }
                    : { scale: 1, y: 0 }
                }
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                whileTap={{ scale: 0.88 }}
              >
                <span style={{ color: app.color }}>
                  <AppIcon iconName={app.icon} size={24} />
                </span>
              </motion.button>

              {/* Open indicator dot */}
              <motion.div
                className="w-1 h-1 rounded-full mt-0.5"
                style={{ background: app.color }}
                animate={{ opacity: isOpen ? 1 : 0, scale: isOpen ? 1 : 0 }}
                transition={{ duration: 0.2 }}
              />
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
