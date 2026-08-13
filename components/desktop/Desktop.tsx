'use client';

// ============================================================
// Campus OS — Desktop
// Main desktop surface: wallpaper + widgets + windows + dock
// ============================================================
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDesktopStore } from '@/stores/useDesktopStore';
import TopBar from './TopBar';
import Dock from './Dock';
import Spotlight from './Spotlight';
import ContextMenu from './ContextMenu';
import WindowManager from '@/components/windows/WindowManager';
import ClockWidget from '@/components/widgets/ClockWidget';
import WeatherWidget from '@/components/widgets/WeatherWidget';
import QuoteWidget from '@/components/widgets/QuoteWidget';

export default function Desktop() {
  const { wallpaper } = useDesktopStore();
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; open: boolean }>({
    x: 0, y: 0, open: false,
  });

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Cmd+K or Ctrl+K: Spotlight
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setSpotlightOpen((prev) => !prev);
    }
    // Escape: close spotlight
    if (e.key === 'Escape') {
      setSpotlightOpen(false);
      setContextMenu((c) => ({ ...c, open: false }));
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Right-click context menu
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, open: true });
  };

  return (
    <motion.div
      className={`fixed inset-0 wallpaper-${wallpaper} overflow-hidden`}
      onContextMenu={handleContextMenu}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.5 } }}
    >
      {/* Top Bar */}
      <TopBar />

      {/* Desktop content area (below top bar, above dock) */}
      <div className="absolute inset-0 top-7 bottom-20">
        {/* Desktop Widgets */}
        <ClockWidget />
        <WeatherWidget />
        <QuoteWidget />

        {/* All open app windows */}
        <WindowManager />
      </div>

      {/* Dock */}
      <Dock />

      {/* Spotlight overlay */}
      <Spotlight isOpen={spotlightOpen} onClose={() => setSpotlightOpen(false)} />

      {/* Context menu */}
      <ContextMenu
        x={contextMenu.x}
        y={contextMenu.y}
        isOpen={contextMenu.open}
        onClose={() => setContextMenu((c) => ({ ...c, open: false }))}
      />

      {/* Screen-too-small warning */}
      <div className="hidden max-[1280px]:flex fixed inset-0 bg-[#0f172a] z-[9999] items-center justify-center">
        <div className="text-center p-8 glass rounded-2xl max-w-sm mx-4">
          <p className="text-4xl mb-4">🖥️</p>
          <h2 className="text-[#e2e8f0] font-bold text-xl mb-2">Desktop Required</h2>
          <p className="text-[#94a3b8] text-sm">Campus OS is best experienced on a screen wider than 1280px.</p>
        </div>
      </div>
    </motion.div>
  );
}
