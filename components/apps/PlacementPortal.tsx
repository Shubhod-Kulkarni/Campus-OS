'use client';
// Campus OS — Placement Portal App
import { motion } from 'framer-motion';
import { Briefcase, MapPin, DollarSign, Clock } from 'lucide-react';

const COMPANIES = [
  { name: 'TCS', role: 'Software Engineer', package: '7 LPA', location: 'Bengaluru', deadline: '2026-08-20', type: 'Service', logo: '🔵' },
  { name: 'Infosys', role: 'Systems Engineer', package: '6.5 LPA', location: 'Pune', deadline: '2026-08-22', type: 'Service', logo: '🟢' },
  { name: 'Wipro', role: 'Project Engineer', package: '6.8 LPA', location: 'Hyderabad', deadline: '2026-08-25', type: 'Service', logo: '🟡' },
  { name: 'Accenture', role: 'Associate SE', package: '8 LPA', location: 'Bengaluru', deadline: '2026-09-01', type: 'Consulting', logo: '🟣' },
  { name: 'Capgemini', role: 'Analyst', package: '7.5 LPA', location: 'Mumbai', deadline: '2026-09-05', type: 'Service', logo: '🔴' },
];

export default function PlacementPortal() {
  return (
    <div className="h-full bg-[#0a0f1e] text-[#e2e8f0] p-6 overflow-y-auto">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-[#fbbf24]/20 flex items-center justify-center">
          <Briefcase className="text-[#fbbf24]" size={20} />
        </div>
        <div>
          <h2 className="text-lg font-bold">Placement Portal</h2>
          <p className="text-[#475569] text-xs">On-campus recruitment drives</p>
        </div>
        <div className="ml-auto glass rounded-xl px-3 py-1">
          <span className="text-xs text-[#34d399]">5 active drives</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Applied', value: '3', color: '#60a5fa' },
          { label: 'Shortlisted', value: '1', color: '#34d399' },
          { label: 'Avg Package', value: '7.2L', color: '#fbbf24' },
        ].map((s) => (
          <div key={s.label} className="glass rounded-xl p-3 text-center">
            <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-[#475569] mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {COMPANIES.map((co, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0, transition: { delay: i * 0.08 } }}
            className="glass rounded-xl p-4 flex items-center gap-3 hover:bg-[rgba(51,65,85,0.3)] cursor-pointer transition-colors"
          >
            <span className="text-3xl">{co.logo}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#e2e8f0]">{co.name}</span>
                <span className="text-xs bg-[#60a5fa]/15 text-[#60a5fa] rounded px-1.5 py-0.5">{co.type}</span>
              </div>
              <p className="text-xs text-[#94a3b8]">{co.role}</p>
              <div className="flex gap-3 mt-1 text-xs text-[#475569]">
                <span className="flex items-center gap-1"><MapPin size={10} />{co.location}</span>
                <span className="flex items-center gap-1"><Clock size={10} />{co.deadline}</span>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="flex items-center gap-1 text-[#34d399] font-semibold text-sm">
                <DollarSign size={13} />{co.package}
              </div>
              <button className="mt-1 text-xs bg-[#fbbf24]/20 text-[#fbbf24] px-2 py-0.5 rounded-lg hover:bg-[#fbbf24]/30 transition-colors">
                Apply
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
