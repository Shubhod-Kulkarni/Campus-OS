'use client';

// ============================================================
// Campus OS — Interactive AI Mock Interview App
// Complete voice & video AI interview studio with Gemini evaluation
// ============================================================
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  ChevronRight,
  Brain,
  Code2,
  Users,
  Video,
  Sparkles,
  Award,
  ArrowRight,
  Layers,
} from 'lucide-react';
import {
  InterviewSettings,
  InterviewStage,
  EvaluationReport,
} from './interview/types';
import SetupModal from './interview/SetupModal';
import LiveInterviewScreen from './interview/LiveInterviewScreen';
import FeedbackReport from './interview/FeedbackReport';

const CATEGORIES = [
  { label: 'DSA & Coding', icon: <Code2 size={16} />, count: 120, color: '#60a5fa' },
  { label: 'System Design', icon: <Brain size={16} />, count: 45, color: '#a78bfa' },
  { label: 'HR & Behavioral', icon: <Users size={16} />, count: 80, color: '#34d399' },
];

const SAMPLE_QS = [
  { q: 'Explain the difference between TCP and UDP.', level: 'Medium', tag: 'Networks' },
  { q: 'What is the time complexity of QuickSort?', level: 'Easy', tag: 'DSA' },
  { q: 'Tell me about a time you resolved a conflict using STAR framework.', level: 'Easy', tag: 'HR' },
  { q: 'Design a URL shortener like bit.ly for 10M DAU.', level: 'Hard', tag: 'System Design' },
];

const LEVEL_COLOR: Record<string, string> = { Easy: '#34d399', Medium: '#fbbf24', Hard: '#f472b6' };

export default function InterviewPrep() {
  const [stage, setStage] = useState<InterviewStage | 'home'>('home');
  const [settings, setSettings] = useState<InterviewSettings | null>(null);
  const [report, setReport] = useState<EvaluationReport | null>(null);

  // Start interview from setup modal
  const handleStartInterview = (newSettings: InterviewSettings) => {
    setSettings(newSettings);
    setStage('interviewing');
  };

  // Complete interview session and display evaluation report
  const handleEndInterview = (finalReport: EvaluationReport) => {
    setReport(finalReport);
    setStage('report');
  };

  return (
    <div className="h-full bg-[#0a0f1e] text-[#e2e8f0] overflow-hidden flex flex-col">
      <AnimatePresence mode="wait">
        {/* VIEW 1: HOME QUESTION BANK & STUDIO LAUNCHER */}
        {stage === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full p-6 overflow-y-auto space-y-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#a78bfa]/20 flex items-center justify-center border border-[#a78bfa]/30">
                  <MessageSquare className="text-[#a78bfa]" size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold">AI Interview Studio & Q&A Bank</h2>
                  <p className="text-[#64748b] text-xs">Practice with interactive AI interviewer personas & Gemini feedback</p>
                </div>
              </div>

              <button
                onClick={() => setStage('setup')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-900/40 flex items-center gap-2 transition-all active:scale-95"
              >
                <Video size={15} /> Start AI Mock Interview <ArrowRight size={14} />
              </button>
            </div>

            {/* Featured Studio Hero Banner */}
            <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-500/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-2 max-w-lg z-10">
                <span className="px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-[10px] font-bold tracking-wide uppercase inline-flex items-center gap-1">
                  <Sparkles size={12} /> Gemini Powered Studio
                </span>
                <h3 className="text-xl font-extrabold text-white">Interactive AI Human Avatar Interviewer</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Real-time video avatars with synchronized speech lip-sync, speech-to-text live transcription, candidate WebRTC video PiP preview, and structured STAR framework evaluation reports.
                </p>
                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => setStage('setup')}
                    className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-900/50 transition-all active:scale-95"
                  >
                    <Video size={14} /> Launch Mock Interview Studio
                  </button>
                  <span className="text-[11px] text-slate-400">3 Personas • Live Subtitles • Audio Visualizer</span>
                </div>
              </div>

              {/* Decorative Graphics */}
              <div className="relative w-36 h-36 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex flex-col items-center justify-center p-3 text-center shrink-0">
                <Award size={36} className="text-purple-400 mb-1" />
                <span className="text-xs font-bold text-slate-200">STAR Scoring</span>
                <span className="text-[10px] text-purple-300">0–100 Readiness</span>
              </div>
            </div>

            {/* Category Cards */}
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Layers size={14} className="text-blue-400" /> Prep Categories
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {CATEGORIES.map((cat, i) => (
                  <motion.button
                    key={i}
                    onClick={() => setStage('setup')}
                    className="glass rounded-xl p-4 text-left hover:bg-slate-800/50 border border-slate-800 transition-colors"
                    whileHover={{ y: -2 }}
                  >
                    <div className="flex items-center gap-2 mb-2" style={{ color: cat.color }}>{cat.icon}</div>
                    <p className="text-sm font-semibold text-[#e2e8f0]">{cat.label}</p>
                    <p className="text-xs text-[#64748b]">{cat.count} curated questions</p>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Sample Question Bank */}
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Curated Question Bank Preview
              </h3>
              <div className="space-y-2">
                {SAMPLE_QS.map((q, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0, transition: { delay: i * 0.08 } }}
                    onClick={() => setStage('setup')}
                    className="glass rounded-xl p-3.5 flex items-center gap-3 hover:bg-slate-800/40 border border-slate-800/80 cursor-pointer"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#e2e8f0]">{q.q}</p>
                      <div className="flex gap-2 mt-1">
                        <span className="text-[11px] rounded px-1.5 py-0.5 font-medium" style={{ background: `${LEVEL_COLOR[q.level]}20`, color: LEVEL_COLOR[q.level] }}>
                          {q.level}
                        </span>
                        <span className="text-[11px] text-[#64748b]">{q.tag}</span>
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-[#64748b]" />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* VIEW 2: INTERVIEW SETUP MODAL */}
        {stage === 'setup' && (
          <motion.div key="setup" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
            <SetupModal onStartInterview={handleStartInterview} />
          </motion.div>
        )}

        {/* VIEW 3: LIVE VIDEO INTERVIEW SCREEN */}
        {stage === 'interviewing' && settings && (
          <motion.div key="interviewing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
            <LiveInterviewScreen
              settings={settings}
              onEndInterview={handleEndInterview}
              onExit={() => setStage('home')}
            />
          </motion.div>
        )}

        {/* VIEW 4: POST-INTERVIEW FEEDBACK REPORT */}
        {stage === 'report' && settings && report && (
          <motion.div key="report" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
            <FeedbackReport
              settings={settings}
              report={report}
              onRetake={() => setStage('setup')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
