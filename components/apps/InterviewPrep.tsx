'use client';
// Campus OS — Interview Prep App
import { motion } from 'framer-motion';
import { MessageSquare, ChevronRight, Brain, Code2, Users } from 'lucide-react';

const CATEGORIES = [
  { label: 'DSA & Coding', icon: <Code2 size={16} />, count: 120, color: '#60a5fa' },
  { label: 'System Design', icon: <Brain size={16} />, count: 45, color: '#a78bfa' },
  { label: 'HR & Behavioral', icon: <Users size={16} />, count: 80, color: '#34d399' },
];

const SAMPLE_QS = [
  { q: 'Explain the difference between TCP and UDP.', level: 'Medium', tag: 'Networks' },
  { q: 'What is the time complexity of QuickSort?', level: 'Easy', tag: 'DSA' },
  { q: 'Tell me about a time you resolved a conflict.', level: 'Easy', tag: 'HR' },
  { q: 'Design a URL shortener like bit.ly.', level: 'Hard', tag: 'System Design' },
];

const LEVEL_COLOR: Record<string, string> = { Easy: '#34d399', Medium: '#fbbf24', Hard: '#f472b6' };

export default function InterviewPrep() {
  return (
    <div className="h-full bg-[#0a0f1e] text-[#e2e8f0] p-6 overflow-y-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#a78bfa]/20 flex items-center justify-center">
          <MessageSquare className="text-[#a78bfa]" size={20} />
        </div>
        <div>
          <h2 className="text-lg font-bold">Interview Prep</h2>
          <p className="text-[#475569] text-xs">Mock interviews and Q&A bank</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        {CATEGORIES.map((cat, i) => (
          <motion.button
            key={i}
            className="glass rounded-xl p-4 text-left hover:bg-[rgba(51,65,85,0.3)] transition-colors"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center gap-2 mb-2" style={{ color: cat.color }}>{cat.icon}</div>
            <p className="text-sm font-semibold text-[#e2e8f0]">{cat.label}</p>
            <p className="text-xs text-[#475569]">{cat.count} questions</p>
          </motion.button>
        ))}
      </div>

      <h3 className="text-sm font-semibold text-[#94a3b8] uppercase tracking-wider mb-3">Sample Questions</h3>
      <div className="space-y-2">
        {SAMPLE_QS.map((q, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0, transition: { delay: i * 0.08 } }}
            className="glass rounded-xl p-3.5 flex items-center gap-3 hover:bg-[rgba(51,65,85,0.3)] cursor-pointer"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[#e2e8f0]">{q.q}</p>
              <div className="flex gap-2 mt-1">
                <span className="text-xs rounded px-1.5 py-0.5" style={{ background: `${LEVEL_COLOR[q.level]}20`, color: LEVEL_COLOR[q.level] }}>{q.level}</span>
                <span className="text-xs text-[#475569]">{q.tag}</span>
              </div>
            </div>
            <ChevronRight size={14} className="text-[#475569]" />
          </motion.div>
        ))}
      </div>

      <div className="mt-4 glass rounded-xl p-4 border border-[#a78bfa]/20 text-center">
        <p className="text-[#a78bfa] font-semibold">🤖 AI Mock Interview — Phase 2</p>
        <p className="text-[#475569] text-xs mt-1">Voice-based AI interviews with real-time feedback</p>
      </div>
    </div>
  );
}
