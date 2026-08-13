'use client';

// ============================================================
// Campus OS — Weather Widget (Mock Data)
// ============================================================
import { motion } from 'framer-motion';

const WEATHER = {
  city: 'Bengaluru',
  temp: 24,
  feels: 22,
  condition: 'Partly Cloudy',
  emoji: '⛅',
  humidity: 68,
  wind: 12,
};

export default function WeatherWidget() {
  return (
    <motion.div
      className="absolute top-4 right-56 glass rounded-2xl p-4 w-52 select-none cursor-default"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1, transition: { delay: 0.5 } }}
      drag
      dragMomentum={false}
      style={{ touchAction: 'none' }}
    >
      <p className="text-[#a78bfa] text-xs font-medium mb-2 uppercase tracking-wider">🌤 Weather</p>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[#e2e8f0] text-3xl font-bold leading-none">{WEATHER.temp}°</p>
          <p className="text-[#94a3b8] text-xs mt-1">{WEATHER.condition}</p>
          <p className="text-[#475569] text-xs">{WEATHER.city}</p>
        </div>
        <span className="text-5xl">{WEATHER.emoji}</span>
      </div>
      <div className="flex gap-3 mt-3 text-xs text-[#475569]">
        <span>💧 {WEATHER.humidity}%</span>
        <span>💨 {WEATHER.wind} km/h</span>
        <span>🌡 {WEATHER.feels}° feels</span>
      </div>
    </motion.div>
  );
}
