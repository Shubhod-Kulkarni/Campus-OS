'use client';
// Campus OS — Resume Analyzer App
import { motion } from 'framer-motion';
import { FileText, Upload, Zap, Target, CheckCircle } from 'lucide-react';

const FEATURES = [
  { icon: <Upload size={18} />, title: 'ATS Score Check', desc: 'Analyze your resume against ATS systems', color: '#60a5fa' },
  { icon: <Target size={18} />, title: 'Job Match %', desc: 'Match resume to specific job descriptions', color: '#a78bfa' },
  { icon: <Zap size={18} />, title: 'AI Suggestions', desc: 'Get AI-powered improvement suggestions', color: '#34d399' },
  { icon: <CheckCircle size={18} />, title: 'Format Check', desc: 'Verify formatting and structure quality', color: '#fbbf24' },
];

export default function ResumeAnalyzer() {
  return (
    <div className="h-full bg-[#0a0f1e] text-[#e2e8f0] p-6 overflow-y-auto">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[#60a5fa]/20 flex items-center justify-center mx-auto mb-4">
            <FileText className="text-[#60a5fa]" size={28} />
          </div>
          <h2 className="text-2xl font-bold text-[#e2e8f0]">Resume Analyzer</h2>
          <p className="text-[#94a3b8] text-sm mt-2">AI-powered resume analysis and career optimization</p>
        </div>

        {/* Upload zone */}
        <div className="glass rounded-2xl p-8 text-center border-2 border-dashed border-[#60a5fa]/30 mb-6 cursor-pointer hover:border-[#60a5fa]/60 transition-colors">
          <Upload className="text-[#60a5fa]/60 mx-auto mb-3" size={32} />
          <p className="text-[#e2e8f0] font-medium">Drop your resume here</p>
          <p className="text-[#475569] text-sm mt-1">PDF, DOCX supported — Max 5MB</p>
          <button className="mt-4 px-5 py-2 bg-[#60a5fa]/20 text-[#60a5fa] rounded-xl text-sm font-medium hover:bg-[#60a5fa]/30 transition-colors">
            Browse Files
          </button>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0, transition: { delay: i * 0.1 } }}
              className="glass rounded-xl p-4"
            >
              <div className="flex items-center gap-2 mb-2" style={{ color: f.color }}>{f.icon}</div>
              <p className="text-[#e2e8f0] text-sm font-semibold">{f.title}</p>
              <p className="text-[#475569] text-xs mt-1">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="glass rounded-xl p-4 border border-[#60a5fa]/20 text-center">
          <p className="text-[#60a5fa] font-semibold">🚀 AI Engine — Phase 2</p>
          <p className="text-[#475569] text-xs mt-1">Resume parsing and AI analysis coming in Phase 2</p>
        </div>
      </div>
    </div>
  );
}
