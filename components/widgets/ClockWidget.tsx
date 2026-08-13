'use client';

// ============================================================
// Campus OS — Clock Widget (Draggable Desktop Widget)
// ============================================================
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// We use a simple CSS-based draggable here for widgets
export default function ClockWidget() {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const h = now.getHours();
      const m = now.getMinutes().toString().padStart(2, '0');
      const s = now.getSeconds().toString().padStart(2, '0');
      const ampm = h >= 12 ? 'PM' : 'AM';
      const h12 = (h % 12 || 12).toString().padStart(2, '0');
      setTime(`${h12}:${m}:${s} ${ampm}`);
      setDate(now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }));
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.div
      className="absolute top-4 right-4 glass rounded-2xl p-4 w-48 select-none cursor-default"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1, transition: { delay: 0.4 } }}
      drag
      dragMomentum={false}
      style={{ touchAction: 'none' }}
    >
      <p className="text-[#60a5fa] text-xs font-medium mb-1 uppercase tracking-wider">⏰ Clock</p>
      <p className="text-[#e2e8f0] font-bold text-xl font-mono leading-none">{time}</p>
      <p className="text-[#94a3b8] text-xs mt-1">{date}</p>
    </motion.div>
  );
}
