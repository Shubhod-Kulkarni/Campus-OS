'use client';

// ============================================================
// Campus OS — Settings App
// Wallpaper picker, theme, layout reset
// ============================================================
import { motion } from 'framer-motion';
import { useDesktopStore, Wallpaper } from '@/stores/useDesktopStore';
import { useWindowStore } from '@/stores/useWindowStore';
import { Image as ImageIcon, Layout, RefreshCw, Info } from 'lucide-react';

const WALLPAPERS: { id: Wallpaper; label: string; preview: string }[] = [
  { id: 'default', label: 'Deep Space', preview: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #0f172a 100%)' },
  { id: 'aurora', label: 'Aurora', preview: 'linear-gradient(135deg, #0f172a 0%, #064e3b 40%, #1e3a5f 100%)' },
  { id: 'cosmos', label: 'Cosmos', preview: 'radial-gradient(ellipse at 30% 50%, #1a0533 0%, #0f172a 70%)' },
  { id: 'mountains', label: 'Mountains', preview: 'linear-gradient(180deg, #0c1445 0%, #2d3561 60%, #0f172a 100%)' },
  { id: 'abstract', label: 'Abstract', preview: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 33%, #14532d 66%, #0f172a 100%)' },
];

export default function Settings() {
  const { wallpaper, setWallpaper } = useDesktopStore();
  const { removeAllWindows } = useWindowStore();

  return (
    <div className="h-full bg-[#0a0f1e] text-[#e2e8f0] overflow-y-auto p-6 space-y-6">
      <h2 className="text-xl font-bold text-[#e2e8f0]">⚙️ Settings</h2>

      {/* Wallpaper section */}
      <section className="glass rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <ImageIcon className="text-[#60a5fa]" size={18} />
          <h3 className="font-semibold text-[#e2e8f0]">Wallpaper</h3>
        </div>
        <div className="grid grid-cols-5 gap-3">
          {WALLPAPERS.map((wp) => (
            <motion.button
              key={wp.id}
              onClick={() => setWallpaper(wp.id)}
              className={`relative rounded-xl overflow-hidden aspect-video cursor-pointer transition-all ${
                wallpaper === wp.id ? 'ring-2 ring-[#60a5fa] ring-offset-2 ring-offset-[#0a0f1e]' : 'hover:scale-105'
              }`}
              style={{ background: wp.preview }}
              whileTap={{ scale: 0.96 }}
            >
              {wallpaper === wp.id && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="w-5 h-5 rounded-full bg-[#60a5fa] flex items-center justify-center text-white text-xs">✓</div>
                </div>
              )}
            </motion.button>
          ))}
        </div>
        <div className="flex gap-2 mt-3 flex-wrap">
          {WALLPAPERS.map((wp) => (
            <span key={wp.id} className={`text-xs ${wallpaper === wp.id ? 'text-[#60a5fa]' : 'text-[#475569]'}`}>
              {wp.label}
            </span>
          ))}
        </div>
      </section>

      {/* Theme section */}
      <section className="glass rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Layout className="text-[#a78bfa]" size={18} />
          <h3 className="font-semibold text-[#e2e8f0]">Appearance</h3>
        </div>
        <div className="flex gap-3">
          <div className="flex-1 glass-dark rounded-xl p-3 border-2 border-[#60a5fa]/50">
            <div className="w-full h-12 rounded-lg bg-[#0f172a] mb-2 flex items-center justify-center">
              <span className="text-xs text-[#60a5fa]">●●●</span>
            </div>
            <p className="text-xs text-center text-[#e2e8f0] font-medium">Dark ✓</p>
          </div>
          <div className="flex-1 glass rounded-xl p-3 opacity-40 cursor-not-allowed">
            <div className="w-full h-12 rounded-lg bg-[#f8fafc] mb-2" />
            <p className="text-xs text-center text-[#94a3b8]">Light (Phase 2)</p>
          </div>
        </div>
      </section>

      {/* Desktop section */}
      <section className="glass rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <RefreshCw className="text-[#34d399]" size={18} />
          <h3 className="font-semibold text-[#e2e8f0]">Desktop Layout</h3>
        </div>
        <button
          onClick={removeAllWindows}
          className="w-full py-2.5 rounded-xl bg-[#f472b6]/10 text-[#f472b6] border border-[#f472b6]/20 text-sm font-medium hover:bg-[#f472b6]/20 transition-colors"
        >
          Close All Windows
        </button>
      </section>

      {/* About section */}
      <section className="glass rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Info className="text-[#94a3b8]" size={18} />
          <h3 className="font-semibold text-[#e2e8f0]">About Campus OS</h3>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {[
            { label: 'Version', value: '1.0.0 Phase 1' },
            { label: 'Framework', value: 'Next.js 14' },
            { label: 'Animations', value: 'Framer Motion' },
            { label: 'Windows', value: 'react-rnd' },
          ].map((info) => (
            <div key={info.label} className="flex justify-between">
              <span className="text-[#475569]">{info.label}</span>
              <span className="text-[#e2e8f0]">{info.value}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
