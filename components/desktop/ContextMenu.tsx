'use client';

// ============================================================
// Campus OS — Context Menu
// Right-click desktop context menu
// ============================================================
import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, RefreshCw } from 'lucide-react';
import { useWindowStore } from '@/stores/useWindowStore';
import { useAppStore } from '@/stores/useAppStore';

interface ContextMenuProps {
  x: number;
  y: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function ContextMenu({ x, y, isOpen, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const { removeAllWindows } = useWindowStore();
  const { launchApp } = useAppStore();

  useEffect(() => {
    const handleClick = () => onClose();
    if (isOpen) document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [isOpen, onClose]);

  // Clamp position so menu stays in viewport
  const safeX = typeof window !== 'undefined' ? Math.min(x, window.innerWidth - 200) : x;
  const safeY = typeof window !== 'undefined' ? Math.min(y, window.innerHeight - 180) : y;

  const items = [
    {
      label: 'Change Wallpaper',
      icon: <ImageIcon size={14} />,
      action: () => { launchApp('settings'); onClose(); },
    },
    {
      label: 'Refresh Desktop',
      icon: <RefreshCw size={14} />,
      action: () => { removeAllWindows(); onClose(); },
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          className="fixed glass rounded-xl py-1.5 w-48 shadow-2xl z-[900]"
          style={{ left: safeX, top: safeY }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.12 }}
          onClick={(e) => e.stopPropagation()}
        >
          {items.map((item, i) => (
            <button
              key={i}
              onClick={item.action}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[#e2e8f0] hover:bg-[#60a5fa]/15 transition-colors text-left"
            >
              <span className="text-[#94a3b8]">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
