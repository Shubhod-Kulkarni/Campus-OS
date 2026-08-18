'use client';

import { motion } from 'framer-motion';
import { EvaluationReport, InterviewSettings } from './types';
import {
  Trophy,
  CheckCircle2,
  AlertTriangle,
  Award,
  BarChart2,
  RefreshCw,
  MessageSquare,
  Sparkles,
  Zap,
  Target,
  FileCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useState } from 'react';

interface FeedbackReportProps {
  settings: InterviewSettings;
  report: EvaluationReport;
  onRetake: () => void;
}

const VERDICT_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  'Strong Hire': { bg: 'bg-emerald-500/20', border: 'border-emerald-500', text: 'text-emerald-400' },
  'Hire': { bg: 'bg-teal-500/20', border: 'border-teal-500', text: 'text-teal-300' },
  'Leaning Hire': { bg: 'bg-blue-500/20', border: 'border-blue-500', text: 'text-blue-300' },
  'Needs Practice': { bg: 'bg-amber-500/20', border: 'border-amber-500', text: 'text-amber-400' },
  'Not Ready': { bg: 'bg-rose-500/20', border: 'border-rose-500', text: 'text-rose-400' },
};

export default function FeedbackReport({ settings, report, onRetake }: FeedbackReportProps) {
  const { interview_summary, strengths, high_priority_improvements, question_evaluations } = report;
  const verdictStyle = VERDICT_COLORS[interview_summary.verdict] || VERDICT_COLORS['Needs Practice'];
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(1);

  return (
    <div className="h-full bg-[#0a0f1e] text-slate-100 p-6 overflow-y-auto space-y-6">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-purple-950/60 border border-slate-800 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-lg">
            <Trophy size={32} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-100">Post-Interview Feedback Audit</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${verdictStyle.bg} ${verdictStyle.border} ${verdictStyle.text}`}>
                {interview_summary.verdict}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Role: <span className="text-slate-200 font-medium">{settings.targetRole}</span> • Type:{' '}
              <span className="text-slate-200 font-medium">{settings.interviewType}</span> • Persona:{' '}
              <span className="text-purple-300 font-medium">{settings.persona}</span>
            </p>
          </div>
        </div>

        <button
          onClick={onRetake}
          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-900/40 transition-all active:scale-95"
        >
          <RefreshCw size={14} /> Start New Mock Session
        </button>
      </motion.div>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Score */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overall Score</span>
            <Award size={18} className="text-purple-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-100">{interview_summary.overall_score}</span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 rounded-full"
              style={{ width: `${interview_summary.overall_score}%` }}
            />
          </div>
        </div>

        {/* STAR Framework Score */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">STAR Framework</span>
            <Target size={18} className="text-blue-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-100">
              {interview_summary.star_framework_adherence_percentage}%
            </span>
            <span className="text-xs text-slate-400">adherence</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${interview_summary.star_framework_adherence_percentage}%` }}
            />
          </div>
        </div>

        {/* Confidence & Delivery */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Delivery Index</span>
            <Zap size={18} className="text-amber-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-100">{interview_summary.confidence_score}%</span>
            <span className="text-xs text-slate-400">confidence</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full"
              style={{ width: `${interview_summary.confidence_score}%` }}
            />
          </div>
        </div>

        {/* Verdict Badge */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Hire Recommendation</span>
            <BarChart2 size={18} className="text-emerald-400" />
          </div>
          <div className="mt-3">
            <span className={`text-base font-bold ${verdictStyle.text}`}>
              {interview_summary.verdict}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 line-clamp-1">
            Based on technical precision & STAR delivery
          </p>
        </div>
      </div>

      {/* Tone & Keywords Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Tone Assessment & Communication */}
        <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <MessageSquare size={15} className="text-purple-400" /> Communication & Delivery Tone
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800">
            {interview_summary.tone_analysis}
          </p>
        </div>

        {/* Technical Keyword & Concept Coverage */}
        <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Sparkles size={15} className="text-emerald-400" /> Keyword & Concept Density
          </h3>
          <div>
            <span className="text-[11px] text-slate-400 font-medium block mb-1">Detected Key Concepts:</span>
            <div className="flex flex-wrap gap-1.5">
              {interview_summary.detected_keywords.map((kw, i) => (
                <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                  ✓ {kw}
                </span>
              ))}
            </div>
          </div>
          {interview_summary.missed_key_concepts.length > 0 && (
            <div>
              <span className="text-[11px] text-slate-400 font-medium block mb-1">Missed Concepts / Gaps:</span>
              <div className="flex flex-wrap gap-1.5">
                {interview_summary.missed_key_concepts.map((kw, i) => (
                  <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-300">
                    ✕ {kw}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Strengths vs Actionable Improvements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Key Strengths */}
        <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 text-emerald-400">
            <CheckCircle2 size={16} /> Key Interview Strengths
          </h3>
          <ul className="space-y-2">
            {strengths.map((str, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-emerald-400 font-bold">•</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* High Priority Improvements */}
        <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 text-amber-400">
            <AlertTriangle size={16} /> Actionable Improvement Checklist
          </h3>
          <ul className="space-y-2">
            {high_priority_improvements.map((imp, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-amber-400 font-bold">•</span>
                <span>{imp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Question-by-Question Deep-Dive Breakdown */}
      <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <FileCheck size={16} className="text-purple-400" /> Question-by-Question Breakdown & Exemplary Model Answers
        </h3>

        <div className="space-y-3">
          {question_evaluations.map((q) => {
            const isExpanded = expandedQuestion === q.question_number;
            return (
              <div
                key={q.question_number}
                className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden transition-all"
              >
                {/* Accordion Header */}
                <button
                  onClick={() => setExpandedQuestion(isExpanded ? null : q.question_number)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-900/50 transition-colors"
                >
                  <div className="flex items-center gap-3 pr-2">
                    <span className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold flex items-center justify-center">
                      Q{q.question_number}
                    </span>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-slate-200 leading-snug">{q.question_text}</p>
                      <span className="text-[10px] text-slate-400">Score: {q.score} / 100</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded border ${
                      q.score >= 80 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                    }`}>
                      {q.score >= 80 ? 'Good' : 'Needs Work'}
                    </span>
                    {isExpanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-4 border-t border-slate-800/80 bg-slate-900/40 space-y-3 text-xs">
                    {/* Candidate Transcript */}
                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                        Candidate Answer Transcript:
                      </span>
                      <p className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 italic">
                        &quot;{q.candidate_answer_transcript || 'No answer recorded.'}&quot;
                      </p>
                    </div>

                    {/* AI Feedback */}
                    <div>
                      <span className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider block mb-1">
                        Evaluator Feedback & Gap Analysis:
                      </span>
                      <p className="p-3 rounded-lg bg-purple-950/20 border border-purple-900/40 text-purple-200">
                        {q.feedback}
                      </p>
                    </div>

                    {/* Exemplary Model Answer */}
                    <div>
                      <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                        <Sparkles size={13} /> Exemplary Model Answer:
                      </span>
                      <p className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/40 text-emerald-200">
                        {q.model_answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
