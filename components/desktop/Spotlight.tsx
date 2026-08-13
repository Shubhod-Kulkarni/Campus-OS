'use client';

// ============================================================
// Campus OS — Spotlight Search (Cmd+K / Ctrl+K)
// Overlay search with keyboard navigation + app launching
// ============================================================
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { APP_REGISTRY } from '@/components/apps/AppRegistry';
import { useAppStore } from '@/stores/useAppStore';
import { AppConfig } from '@/types/app';

function AppIcon({ iconName }: { iconName: string }) {
  const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; strokeWidth?: number }>>)[iconName];
  if (!Icon) return <span>📦</span>;
  return <Icon size={18} strokeWidth={1.5} />;
}

interface SpotlightProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Spotlight({ isOpen, onClose }: SpotlightProps) {
  const [query, setQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { launchApp } = useAppStore();

  // Filter apps
  const results: AppConfig[] = query
    ? APP_REGISTRY.filter(
        (a) =>
          a.name.toLowerCase().includes(query.toLowerCase()) ||
          a.description.toLowerCase().includes(query.toLowerCase()) ||
          a.category.includes(query.toLowerCase())
      )
    : APP_REGISTRY.slice(0, 6);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIdx(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      if (results[selectedIdx]) {
        launch(results[selectedIdx].id);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const launch = (appId: string) => {
    launchApp(appId);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 spotlight-overlay z-[850] flex items-start justify-center pt-32"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <motion.div
            className="glass-dark rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: -20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.97 }}
            transition={{ duration: 0.2 }}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-[#1e293b]">
              <Search className="w-5 h-5 text-[#475569]" />
              <input
                ref={inputRef}
                id="spotlight-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search apps, settings..."
                className="flex-1 bg-transparent text-[#e2e8f0] text-lg placeholder-[#475569] outline-none"
              />
              <kbd className="text-xs text-[#475569] border border-[#1e293b] rounded px-1.5 py-0.5">ESC</kbd>
            </div>

            {/* Results */}
            <div className="py-2 max-h-80 overflow-y-auto">
              {results.length === 0 ? (
                <p className="text-center text-[#475569] py-8 text-sm">No results found</p>
              ) : (
                results.map((app, i) => (
                  <button
                    key={app.id}
                    id={`spotlight-result-${app.id}`}
                    onClick={() => launch(app.id)}
                    onMouseEnter={() => setSelectedIdx(i)}
                    className={`w-full flex items-center gap-4 px-5 py-3 text-left transition-colors ${
                      i === selectedIdx ? 'bg-[#60a5fa]/15' : 'hover:bg-[#1e293b]/60'
                    }`}
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${app.color}22`, color: app.color }}
                    >
                      <AppIcon iconName={app.icon} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[#e2e8f0] text-sm font-medium">{app.name}</p>
                      <p className="text-[#475569] text-xs truncate">{app.description}</p>
                    </div>
                    {i === selectedIdx && <ArrowRight className="w-4 h-4 text-[#60a5fa]" />}
                  </button>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-[#1e293b] px-5 py-2 flex gap-4 text-xs text-[#475569]">
              <span><kbd className="border border-[#1e293b] rounded px-1">↑↓</kbd> Navigate</span>
              <span><kbd className="border border-[#1e293b] rounded px-1">↵</kbd> Open</span>
              <span><kbd className="border border-[#1e293b] rounded px-1">Esc</kbd> Close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
