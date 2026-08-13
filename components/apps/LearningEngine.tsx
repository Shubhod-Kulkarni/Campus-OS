'use client';
// Campus OS — Learning Engine App
import { motion } from 'framer-motion';
import { BookOpen, Play, Award, Clock } from 'lucide-react';

const COURSES = [
  { title: 'Complete DSA in Python', progress: 68, total: 120, duration: '40h', level: 'Intermediate', color: '#60a5fa', icon: '🐍' },
  { title: 'Machine Learning A-Z', progress: 34, total: 85, duration: '28h', level: 'Advanced', color: '#a78bfa', icon: '🤖' },
  { title: 'Web Development Bootcamp', progress: 91, total: 60, duration: '22h', level: 'Beginner', color: '#34d399', icon: '🌐' },
  { title: 'System Design Fundamentals', progress: 12, total: 45, duration: '15h', level: 'Advanced', color: '#fbbf24', icon: '🏗️' },
];

export default function LearningEngine() {
  return (
    <div className="h-full bg-[#0a0f1e] text-[#e2e8f0] p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#60a5fa]/20 flex items-center justify-center">
            <BookOpen className="text-[#60a5fa]" size={20} />
          </div>
          <h2 className="text-lg font-bold">Learning Engine</h2>
        </div>
        <div className="glass rounded-xl px-3 py-1.5 flex items-center gap-1.5">
          <Award className="text-[#fbbf24]" size={14} />
          <span className="text-xs text-[#fbbf24] font-semibold">3 Badges Earned</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Hours Learned', value: '47', icon: <Clock size={14} />, color: '#60a5fa' },
          { label: 'Courses Active', value: '4', icon: <BookOpen size={14} />, color: '#a78bfa' },
          { label: 'Streak', value: '12d', icon: '🔥', color: '#f472b6' },
        ].map((s, i) => (
          <div key={i} className="glass rounded-xl p-3 text-center">
            <div className="flex justify-center mb-1" style={{ color: s.color }}>
              {typeof s.icon === 'string' ? <span>{s.icon}</span> : s.icon}
            </div>
            <div className="text-xl font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-[#475569]">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Active courses */}
      <h3 className="text-sm font-semibold text-[#94a3b8] uppercase tracking-wider mb-3">Active Courses</h3>
      <div className="space-y-3">
        {COURSES.map((course, i) => {
          const pct = Math.round((course.progress / course.total) * 100);
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0, transition: { delay: i * 0.1 } }}
              className="glass rounded-xl p-4 hover:bg-[rgba(51,65,85,0.3)] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{course.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#e2e8f0] text-sm">{course.title}</p>
                  <div className="flex gap-2 mt-0.5">
                    <span className="text-xs text-[#475569]">{course.level}</span>
                    <span className="text-xs text-[#475569]">• {course.duration}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold" style={{ color: course.color }}>{pct}%</span>
                  <button className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: `${course.color}20` }}>
                    <Play size={11} style={{ color: course.color }} />
                  </button>
                </div>
              </div>
              <div className="mt-3 h-1.5 bg-[#1e293b] rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: course.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.8, delay: i * 0.1 }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
