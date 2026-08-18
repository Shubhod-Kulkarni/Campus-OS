'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  InterviewSettings,
  InterviewType,
  AvatarPersona,
  PERSONA_DETAILS,
} from './types';
import {
  Briefcase,
  Layers,
  UserCheck,
  HelpCircle,
  Play,
  Sparkles,
  CheckCircle2,
  FileText,
} from 'lucide-react';

interface SetupModalProps {
  onStartInterview: (settings: InterviewSettings) => void;
}

const ROLES_PRESETS = [
  'Fullstack Software Engineer',
  'Frontend Engineer (React/Next.js)',
  'Backend Engineer (Node/Python)',
  'System Architect & Lead',
  'Data Scientist & ML Engineer',
  'Product Manager',
];

const INTERVIEW_TYPES: { type: InterviewType; label: string; desc: string }[] = [
  {
    type: 'Technical',
    label: 'Technical Deep-Dive',
    desc: 'Coding concepts, algorithms, language specifics, and debugging.',
  },
  {
    type: 'Behavioral (STAR)',
    label: 'Behavioral (STAR)',
    desc: 'Past experiences, leadership, conflict resolution, and impact.',
  },
  {
    type: 'System Design',
    label: 'System Design',
    desc: 'Scalability, microservices, database schemas, and load balancing.',
  },
  {
    type: 'HR Screening',
    label: 'HR Screening',
    desc: 'Culture fit, career trajectory, salary expectations, and motivation.',
  },
];

const PERSONAS: AvatarPersona[] = [
  'Corporate Recruiter',
  'Senior Engineering Manager',
  'Startup Lead',
];

export default function SetupModal({ onStartInterview }: SetupModalProps) {
  const [targetRole, setTargetRole] = useState('Fullstack Software Engineer');
  const [jobDescription, setJobDescription] = useState('');
  const [interviewType, setInterviewType] = useState<InterviewType>('Technical');
  const [persona, setPersona] = useState<AvatarPersona>('Senior Engineering Manager');
  const [questionCount, setQuestionCount] = useState(3);
  const [showJdInput, setShowJdInput] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartInterview({
      targetRole: targetRole.trim() || 'Software Engineer',
      jobDescription: jobDescription.trim(),
      interviewType,
      persona,
      questionCount,
    });
  };

  return (
    <div className="h-full bg-[#0a0f1e] text-slate-100 p-6 overflow-y-auto flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Sparkles size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100">AI Mock Interview Setup</h2>
              <p className="text-xs text-slate-400">Configure your target role, persona, and interview scope</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
            Interactive AI Studio
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 1. Target Role & Job Description */}
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Briefcase size={14} className="text-purple-400" /> Target Role / Job Title
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Senior Frontend Developer"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-purple-500 transition-colors"
              required
            />
            {/* Presets */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {ROLES_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setTargetRole(preset)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border ${
                    targetRole === preset
                      ? 'bg-purple-500/20 border-purple-500 text-purple-300 font-medium'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
                  } transition-colors`}
                >
                  {preset}
                </button>
              ))}
            </div>

            {/* Optional JD Input Toggle */}
            <div className="mt-3">
              <button
                type="button"
                onClick={() => setShowJdInput(!showJdInput)}
                className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-medium"
              >
                <FileText size={13} />
                {showJdInput ? 'Hide Job Description' : '+ Paste custom Job Description (Optional)'}
              </button>
              {showJdInput && (
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste Job Description requirements, tech stack, and responsibilities..."
                  rows={3}
                  className="w-full mt-2 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-purple-500 transition-colors"
                />
              )}
            </div>
          </div>

          {/* 2. Interview Type Selection */}
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Layers size={14} className="text-blue-400" /> Interview Type
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {INTERVIEW_TYPES.map((item) => {
                const isSelected = interviewType === item.type;
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => setInterviewType(item.type)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-blue-500/15 border-blue-500/80 shadow-md ring-1 ring-blue-500/50'
                        : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/40 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-bold ${isSelected ? 'text-blue-300' : 'text-slate-200'}`}>
                        {item.label}
                      </span>
                      {isSelected && <CheckCircle2 size={14} className="text-blue-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">{item.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Avatar Persona Selection */}
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <UserCheck size={14} className="text-emerald-400" /> AI Avatar Persona
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {PERSONAS.map((p) => {
                const isSelected = persona === p;
                const info = PERSONA_DETAILS[p];
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPersona(p)}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      isSelected
                        ? 'bg-emerald-500/15 border-emerald-500/80 shadow-md ring-1 ring-emerald-500/50'
                        : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-bold ${isSelected ? 'text-emerald-300' : 'text-slate-200'}`}>
                          {p}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-tight">{info.name}</p>
                    </div>
                    <span className="text-[9px] mt-2 text-slate-500 line-clamp-1">{info.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Number of Questions */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle size={14} className="text-amber-400" /> Number of Questions
              </label>
              <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                {questionCount} Questions
              </span>
            </div>
            <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400">3 Qs (Quick)</span>
              <input
                type="range"
                min={3}
                max={5}
                step={1}
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="flex-1 accent-amber-400 cursor-pointer"
              />
              <span className="text-xs text-slate-400">5 Qs (Comprehensive)</span>
            </div>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-purple-900/30 flex items-center justify-center gap-2 transform active:scale-[0.99] transition-all"
          >
            <Play size={16} /> Start Live AI Mock Interview
          </button>
        </form>
      </motion.div>
    </div>
  );
}
