'use client';

// Campus OS — Resume Analyzer App
// Dynamic File Drag-and-Drop Upload, Text Extraction & Gemini ATS AI Audit Engine
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Upload, Zap, Target, CheckCircle, AlertCircle, 
  ExternalLink, Globe, RefreshCw, BarChart2, Sparkles, Play,
  Copy, Check, Code, ShieldAlert, FileCheck, X, FileUp,
  CheckCircle2, XCircle, AlertTriangle, FileCode, TrendingUp, Layers, HardDrive
} from 'lucide-react';

// Exact System Prompt required for Gemini ATS AI engine
export const ATS_SYSTEM_PROMPT = `You are an expert ATS (Applicant Tracking System) parser and senior talent acquisition engineer. Your task is to analyze the candidate's uploaded resume text, evaluate its ATS parseability, compare it against the target Job Description (if provided), and return a strict, actionable JSON audit.

Rules:
1. Return ONLY a valid JSON object matching the schema below. No Markdown code fences (no \`\`\`json).
2. Weight scores: Impact & Metrics (30%), Skill Match & Keyword Relevance (30%), ATS Parseability (20%), Clarity & Tone (20%).
3. Rewrite weak bullets strictly using Google's XYZ formula (Accomplished [X], measured by [Y], by doing [Z]).

JSON Schema:
{
  "score_overview": {
    "overall_score": 0,
    "grade": "Excellent | Good | Needs Work | Critical Fixes Needed",
    "category_scores": {
      "impact_and_metrics": 0,
      "keyword_match": 0,
      "ats_parseability": 0,
      "clarity_and_tone": 0
    }
  },
  "executive_summary": "2-3 sentences summarizing profile strength and biggest gaps.",
  "strengths": ["string"],
  "critical_fixes": ["string"],
  "skills_analysis": {
    "detected_hard_skills": ["string"],
    "detected_soft_skills": ["string"],
    "missing_target_skills": ["string"],
    "keyword_match_percentage": 0
  },
  "bullet_point_critiques": [
    {
      "original_text": "string",
      "weakness_type": "Lacks Metrics | Passive Voice | Vague Scope | Cliché Heavy",
      "explanation": "string",
      "rewritten_version": "string"
    }
  ],
  "ats_formatting_audit": {
    "parsing_risks": ["string"],
    "contact_info_check": {
      "has_email": true,
      "has_phone": true,
      "has_linkedin_or_portfolio": true,
      "issues": ["string"]
    }
  }
}`;

// TypeScript Types matching the exact schema specs
export interface CategoryScores {
  impact_and_metrics: number;
  keyword_match: number;
  ats_parseability: number;
  clarity_and_tone: number;
}

export interface ScoreOverview {
  overall_score: number;
  grade: 'Excellent' | 'Good' | 'Needs Work' | 'Critical Fixes Needed';
  category_scores: CategoryScores;
}

export interface SkillsAnalysis {
  detected_hard_skills: string[];
  detected_soft_skills: string[];
  missing_target_skills: string[];
  keyword_match_percentage: number;
}

export interface BulletCritique {
  original_text: string;
  weakness_type: 'Lacks Metrics' | 'Passive Voice' | 'Vague Scope' | 'Cliché Heavy' | string;
  explanation: string;
  rewritten_version: string;
}

export interface ContactInfoCheck {
  has_email: boolean;
  has_phone: boolean;
  has_linkedin_or_portfolio: boolean;
  issues: string[];
}

export interface AtsFormattingAudit {
  parsing_risks: string[];
  contact_info_check: ContactInfoCheck;
}

export interface AtsAuditResult {
  score_overview: ScoreOverview;
  executive_summary: string;
  strengths: string[];
  critical_fixes: string[];
  skills_analysis: SkillsAnalysis;
  bullet_point_critiques: BulletCritique[];
  ats_formatting_audit: AtsFormattingAudit;
}

export default function ResumeAnalyzer() {
  const [activeTab, setActiveTab] = useState<'analyzer' | 'embedded'>('analyzer');
  const [inputMode, setInputMode] = useState<'upload' | 'paste'>('upload');
  
  // File Upload & Input States
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [pastedText, setPastedText] = useState('');
  const [targetJd, setTargetJd] = useState('');
  
  // Processing & Dashboard States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Extracting document & querying Gemini AI...');
  const [auditResult, setAuditResult] = useState<AtsAuditResult | null>(null);
  const [extractedPreview, setExtractedPreview] = useState('');
  const [viewMode, setViewMode] = useState<'visual' | 'json'>('visual');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [jsonCopied, setJsonCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Web App Integration iframe state
  const [externalUrl, setExternalUrl] = useState('https://resume-analyzer-demo.streamlit.app');
  const [iframeKey, setIframeKey] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // File Drag & Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    const validExtensions = ['.pdf', '.docx', '.doc', '.txt'];
    const fileName = file.name.toLowerCase();
    const isValid = validExtensions.some(ext => fileName.endsWith(ext));

    if (!isValid) {
      setErrorMessage('Please upload a valid document format (.pdf, .docx, .doc, .txt).');
      return;
    }

    setErrorMessage('');
    setSelectedFile(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Main submission handler to backend /api/analyze-resume
  const handleAnalyzeResume = async () => {
    if (!selectedFile && !pastedText.trim()) {
      setErrorMessage('Please upload a resume file or paste resume text to analyze.');
      return;
    }

    setErrorMessage('');
    setIsAnalyzing(true);
    setStatusMessage('Reading document & extracting raw text...');

    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('file', selectedFile);
      } else {
        formData.append('resume_text', pastedText);
      }
      formData.append('target_job_description', targetJd);

      setStatusMessage('Parsing ATS criteria & querying Gemini API model...');

      const response = await fetch('/api/analyze-resume', {
        method: 'POST',
        body: formData
      });

      const json = await response.json();

      if (!response.ok || !json.success) {
        throw new Error(json.error || 'Failed to analyze resume.');
      }

      setAuditResult(json.data);
      if (json.extracted_text_preview) {
        setExtractedPreview(json.extracted_text_preview);
      }
    } catch (err: any) {
      console.error('Error during resume analysis:', err);
      setErrorMessage(err.message || 'An unexpected error occurred during resume parsing.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyRewrittenBullet = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const copyJsonSchema = () => {
    if (!auditResult) return;
    navigator.clipboard.writeText(JSON.stringify(auditResult, null, 2));
    setJsonCopied(true);
    setTimeout(() => setJsonCopied(false), 2000);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="h-full bg-[#0a0f1e] text-[#e2e8f0] flex flex-col overflow-hidden font-sans">
      {/* App Header & Navigation */}
      <div className="glass px-6 py-3.5 flex items-center justify-between border-b border-[#334155]/50 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#60a5fa]/20 to-[#3b82f6]/30 flex items-center justify-center border border-[#60a5fa]/40 shadow-inner">
            <FileText className="text-[#60a5fa]" size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#e2e8f0]">Resume Analyzer</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-[#34d399]/20 text-[#34d399] border border-[#34d399]/30">
                Gemini 2.5 Dynamic Engine
              </span>
            </div>
            <p className="text-xs text-[#94a3b8]">Upload PDF/Word documents for AI ATS score, XYZ metric rewrites & keyword audit</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#0f172a] p-1 rounded-xl border border-[#334155]">
          <button
            onClick={() => setActiveTab('analyzer')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'analyzer' 
                ? 'bg-[#60a5fa] text-[#0f172a] shadow-lg shadow-[#60a5fa]/20' 
                : 'text-[#94a3b8] hover:text-[#e2e8f0]'
            }`}
          >
            <Sparkles size={14} />
            Document Analyzer
          </button>
          <button
            onClick={() => setActiveTab('embedded')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'embedded' 
                ? 'bg-[#60a5fa] text-[#0f172a] shadow-lg shadow-[#60a5fa]/20' 
                : 'text-[#94a3b8] hover:text-[#e2e8f0]'
            }`}
          >
            <Globe size={14} />
            Web App Integration
          </button>
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 overflow-y-auto p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'analyzer' ? (
            <motion.div
              key="analyzer-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-6xl mx-auto space-y-6"
            >
              {/* Top Form Grid: Upload & Job Context (5 Cols) vs Dashboard (7 Cols) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Column: File Upload & Input Form (5 Cols) */}
                <div className="lg:col-span-5 space-y-4 flex flex-col">
                  
                  {/* File Upload Zone */}
                  <div className="glass rounded-2xl p-5 border border-[#334155]/60 space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-[#e2e8f0] uppercase tracking-wider flex items-center gap-1.5">
                        <Upload className="text-[#60a5fa]" size={16} />
                        Upload Resume Document
                      </label>
                      <div className="flex gap-1 bg-[#0f172a] p-0.5 rounded-lg border border-[#334155]">
                        <button
                          onClick={() => setInputMode('upload')}
                          className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                            inputMode === 'upload' ? 'bg-[#60a5fa] text-[#0f172a]' : 'text-[#94a3b8]'
                          }`}
                        >
                          File
                        </button>
                        <button
                          onClick={() => setInputMode('paste')}
                          className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                            inputMode === 'paste' ? 'bg-[#60a5fa] text-[#0f172a]' : 'text-[#94a3b8]'
                          }`}
                        >
                          Paste Text
                        </button>
                      </div>
                    </div>

                    {inputMode === 'upload' ? (
                      /* Drag & Drop File Zone */
                      <div>
                        {!selectedFile ? (
                          <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                              isDragging 
                                ? 'border-[#60a5fa] bg-[#60a5fa]/10 scale-[1.01]' 
                                : 'border-[#334155] hover:border-[#60a5fa]/60 bg-[#0f172a]/60 hover:bg-[#0f172a]'
                            }`}
                          >
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={handleFileSelect}
                              accept=".pdf,.docx,.doc,.txt"
                              className="hidden"
                            />
                            <div className="w-12 h-12 rounded-2xl bg-[#60a5fa]/15 text-[#60a5fa] flex items-center justify-center mx-auto mb-3 border border-[#60a5fa]/30">
                              <FileUp size={24} />
                            </div>
                            <p className="text-xs font-bold text-[#e2e8f0]">
                              Drag & Drop resume file here
                            </p>
                            <p className="text-[11px] text-[#94a3b8] mt-1">
                              Supports <span className="text-[#60a5fa] font-semibold">.PDF</span>, <span className="text-[#60a5fa] font-semibold">.DOCX</span>, and <span className="text-[#60a5fa] font-semibold">.DOC</span> documents
                            </p>
                          </div>
                        ) : (
                          /* Uploaded File Item Preview */
                          <div className="bg-[#0f172a] rounded-xl p-3.5 border border-[#34d399]/40 flex items-center justify-between">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-9 h-9 rounded-lg bg-[#34d399]/20 text-[#34d399] flex items-center justify-center flex-shrink-0 border border-[#34d399]/30">
                                <FileCheck size={18} />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-[#e2e8f0] truncate">{selectedFile.name}</p>
                                <p className="text-[10px] text-[#94a3b8]">{formatFileSize(selectedFile.size)} • Ready for parsing</p>
                              </div>
                            </div>
                            <button
                              onClick={removeFile}
                              className="p-1.5 text-[#94a3b8] hover:text-[#f87171] hover:bg-[#f87171]/10 rounded-lg transition-colors"
                              title="Remove file"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Paste Text Fallback Area */
                      <textarea
                        value={pastedText}
                        onChange={(e) => setPastedText(e.target.value)}
                        placeholder="Paste raw candidate resume text here..."
                        className="w-full h-36 bg-[#0f172a] text-[#e2e8f0] text-xs p-3 rounded-xl border border-[#334155] focus:outline-none focus:border-[#60a5fa] resize-none font-mono"
                      />
                    )}

                    {/* Target Job Description Input */}
                    <div className="space-y-2 pt-2 border-t border-[#334155]/40">
                      <label className="text-xs font-bold text-[#e2e8f0] uppercase tracking-wider flex items-center gap-1.5">
                        <Target className="text-[#a78bfa]" size={15} />
                        Target Job Description / Role (Optional)
                      </label>
                      <textarea
                        value={targetJd}
                        onChange={(e) => setTargetJd(e.target.value)}
                        placeholder="Paste target job requirements, skills, or job title (e.g. Senior Full-Stack Developer: React, Next.js, Node.js, PostgreSQL, Docker)..."
                        className="w-full h-24 bg-[#0f172a] text-[#e2e8f0] text-xs p-3 rounded-xl border border-[#334155] focus:outline-none focus:border-[#60a5fa] resize-none"
                      />
                    </div>

                    {/* Error Banner */}
                    {errorMessage && (
                      <div className="p-3 bg-[#f87171]/15 border border-[#f87171]/40 rounded-xl text-xs text-[#f87171] flex items-center gap-2">
                        <AlertCircle size={15} className="flex-shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    {/* Analyze Action Button */}
                    <button
                      onClick={handleAnalyzeResume}
                      disabled={isAnalyzing || (!selectedFile && !pastedText.trim())}
                      className="w-full py-3 bg-gradient-to-r from-[#60a5fa] via-[#3b82f6] to-[#2563eb] text-[#0f172a] rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.99] disabled:opacity-50 transition-all shadow-lg shadow-[#60a5fa]/25 uppercase tracking-wider"
                    >
                      {isAnalyzing ? (
                        <>
                          <RefreshCw className="animate-spin" size={16} />
                          <span>{statusMessage}</span>
                        </>
                      ) : (
                        <>
                          <Play size={16} className="fill-current" />
                          <span>Analyze Resume via Gemini AI</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Right Column: Dynamic Results Dashboard (7 Cols) */}
                <div className="lg:col-span-7">
                  {auditResult ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-5"
                    >
                      {/* Dashboard Controls (Visual vs Raw JSON) */}
                      <div className="flex items-center justify-between glass p-2.5 rounded-xl border border-[#334155]/60">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#e2e8f0]">
                            ATS Evaluation Audit
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-extrabold uppercase tracking-wider border ${
                            auditResult.score_overview.grade === 'Excellent' ? 'bg-[#34d399]/20 text-[#34d399] border-[#34d399]/40' :
                            auditResult.score_overview.grade === 'Good' ? 'bg-[#60a5fa]/20 text-[#60a5fa] border-[#60a5fa]/40' :
                            auditResult.score_overview.grade === 'Needs Work' ? 'bg-[#fbbf24]/20 text-[#fbbf24] border-[#fbbf24]/40' :
                            'bg-[#f87171]/20 text-[#f87171] border-[#f87171]/40'
                          }`}>
                            {auditResult.score_overview.grade}
                          </span>
                        </div>

                        <div className="flex gap-1 bg-[#0f172a] p-1 rounded-lg border border-[#334155]">
                          <button
                            onClick={() => setViewMode('visual')}
                            className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                              viewMode === 'visual' ? 'bg-[#60a5fa] text-[#0f172a]' : 'text-[#94a3b8]'
                            }`}
                          >
                            Visual Report
                          </button>
                          <button
                            onClick={() => setViewMode('json')}
                            className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-all ${
                              viewMode === 'json' ? 'bg-[#60a5fa] text-[#0f172a]' : 'text-[#94a3b8]'
                            }`}
                          >
                            <Code size={12} />
                            Raw JSON Schema
                          </button>
                        </div>
                      </div>

                      {viewMode === 'visual' ? (
                        <>
                          {/* Score Overview Radial Meter & 4 Category Bars */}
                          <div className="glass rounded-2xl p-6 border border-[#60a5fa]/30 relative overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#0f172a] to-[#1e293b]">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                              
                              {/* Overall Radial Score Gauge */}
                              <div className="md:col-span-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-[#334155]/60 pb-4 md:pb-0 md:pr-4 text-center">
                                <span className="text-[11px] uppercase tracking-widest font-extrabold text-[#94a3b8]">Overall ATS Score</span>
                                
                                <div className="relative w-28 h-28 my-3 flex items-center justify-center">
                                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                    <path
                                      className="text-[#1e293b]"
                                      strokeWidth="3.5"
                                      stroke="currentColor"
                                      fill="none"
                                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    />
                                    <path
                                      className={`${
                                        auditResult.score_overview.overall_score >= 80 ? 'text-[#34d399]' :
                                        auditResult.score_overview.overall_score >= 65 ? 'text-[#60a5fa]' :
                                        auditResult.score_overview.overall_score >= 45 ? 'text-[#fbbf24]' : 'text-[#f87171]'
                                      }`}
                                      strokeDasharray={`${auditResult.score_overview.overall_score}, 100`}
                                      strokeWidth="3.5"
                                      strokeLinecap="round"
                                      stroke="currentColor"
                                      fill="none"
                                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    />
                                  </svg>
                                  <div className="absolute text-center">
                                    <span className="text-3xl font-black text-[#e2e8f0]">{auditResult.score_overview.overall_score}</span>
                                    <span className="text-[10px] block text-[#94a3b8] font-bold">/100</span>
                                  </div>
                                </div>

                                <span className="text-xs text-[#cbd5e1] font-semibold">
                                  {auditResult.score_overview.grade}
                                </span>
                              </div>

                              {/* 4 Category Breakdown Progress Bars */}
                              <div className="md:col-span-8 space-y-3">
                                <div>
                                  <div className="flex justify-between text-xs font-bold mb-1">
                                    <span className="text-[#e2e8f0]">Impact & Metrics (30%)</span>
                                    <span className="text-[#a78bfa]">{auditResult.score_overview.category_scores.impact_and_metrics}%</span>
                                  </div>
                                  <div className="w-full bg-[#1e293b] h-2 rounded-full overflow-hidden">
                                    <div className="bg-[#a78bfa] h-full transition-all duration-500" style={{ width: `${auditResult.score_overview.category_scores.impact_and_metrics}%` }} />
                                  </div>
                                </div>

                                <div>
                                  <div className="flex justify-between text-xs font-bold mb-1">
                                    <span className="text-[#e2e8f0]">Skill Match & Keywords (30%)</span>
                                    <span className="text-[#60a5fa]">{auditResult.score_overview.category_scores.keyword_match}%</span>
                                  </div>
                                  <div className="w-full bg-[#1e293b] h-2 rounded-full overflow-hidden">
                                    <div className="bg-[#60a5fa] h-full transition-all duration-500" style={{ width: `${auditResult.score_overview.category_scores.keyword_match}%` }} />
                                  </div>
                                </div>

                                <div>
                                  <div className="flex justify-between text-xs font-bold mb-1">
                                    <span className="text-[#e2e8f0]">ATS Parseability (20%)</span>
                                    <span className="text-[#34d399]">{auditResult.score_overview.category_scores.ats_parseability}%</span>
                                  </div>
                                  <div className="w-full bg-[#1e293b] h-2 rounded-full overflow-hidden">
                                    <div className="bg-[#34d399] h-full transition-all duration-500" style={{ width: `${auditResult.score_overview.category_scores.ats_parseability}%` }} />
                                  </div>
                                </div>

                                <div>
                                  <div className="flex justify-between text-xs font-bold mb-1">
                                    <span className="text-[#e2e8f0]">Clarity & Tone (20%)</span>
                                    <span className="text-[#fbbf24]">{auditResult.score_overview.category_scores.clarity_and_tone}%</span>
                                  </div>
                                  <div className="w-full bg-[#1e293b] h-2 rounded-full overflow-hidden">
                                    <div className="bg-[#fbbf24] h-full transition-all duration-500" style={{ width: `${auditResult.score_overview.category_scores.clarity_and_tone}%` }} />
                                  </div>
                                </div>
                              </div>

                            </div>
                          </div>

                          {/* Executive Summary */}
                          <div className="glass rounded-2xl p-5 border border-[#334155]/60">
                            <h4 className="text-xs font-bold text-[#60a5fa] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                              <Sparkles size={14} /> Executive Summary
                            </h4>
                            <p className="text-xs text-[#cbd5e1] leading-relaxed">
                              {auditResult.executive_summary}
                            </p>
                          </div>

                          {/* Strengths & Critical Fixes Side-by-Side */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Strengths */}
                            <div className="glass rounded-2xl p-4 border border-[#34d399]/30 bg-[#34d399]/5">
                              <h4 className="text-xs font-bold text-[#34d399] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                                <CheckCircle2 size={15} /> Key Profile Strengths
                              </h4>
                              <ul className="space-y-2">
                                {auditResult.strengths.map((item, idx) => (
                                  <li key={idx} className="text-xs text-[#cbd5e1] flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] mt-1.5 flex-shrink-0" />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Critical Fixes */}
                            <div className="glass rounded-2xl p-4 border border-[#f87171]/30 bg-[#f87171]/5">
                              <h4 className="text-xs font-bold text-[#f87171] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                                <AlertTriangle size={15} /> Urgent Critical Fixes
                              </h4>
                              <ul className="space-y-2">
                                {auditResult.critical_fixes.map((item, idx) => (
                                  <li key={idx} className="text-xs text-[#cbd5e1] flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#f87171] mt-1.5 flex-shrink-0" />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* Skills Analysis & Missing JD Keywords */}
                          <div className="glass rounded-2xl p-5 border border-[#334155]/60 space-y-4">
                            <div className="flex items-center justify-between border-b border-[#334155]/40 pb-3">
                              <h4 className="text-xs font-bold text-[#e2e8f0] uppercase tracking-wider flex items-center gap-1.5">
                                <Layers className="text-[#60a5fa]" size={15} /> Skills & Keyword Match Analysis
                              </h4>
                              <span className="text-xs font-bold text-[#60a5fa]">
                                {auditResult.skills_analysis.keyword_match_percentage}% JD Keyword Match
                              </span>
                            </div>

                            {/* Hard Skills */}
                            <div>
                              <p className="text-[11px] font-semibold text-[#94a3b8] mb-2 uppercase">Extracted Technical / Hard Skills</p>
                              <div className="flex flex-wrap gap-1.5">
                                {auditResult.skills_analysis.detected_hard_skills.map((skill, idx) => (
                                  <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-[#60a5fa]/15 text-[#60a5fa] border border-[#60a5fa]/30 font-medium">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Soft Skills */}
                            {auditResult.skills_analysis.detected_soft_skills.length > 0 && (
                              <div>
                                <p className="text-[11px] font-semibold text-[#94a3b8] mb-2 uppercase">Extracted Soft Skills</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {auditResult.skills_analysis.detected_soft_skills.map((skill, idx) => (
                                    <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-[#a78bfa]/15 text-[#a78bfa] border border-[#a78bfa]/30 font-medium">
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Missing Target Skills */}
                            {auditResult.skills_analysis.missing_target_skills.length > 0 && (
                              <div>
                                <p className="text-[11px] font-semibold text-[#f87171] mb-2 uppercase flex items-center gap-1">
                                  Missing Required JD Skills / Keywords
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                  {auditResult.skills_analysis.missing_target_skills.map((skill, idx) => (
                                    <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-[#f87171]/15 text-[#f87171] border border-[#f87171]/30 font-medium flex items-center gap-1">
                                      <XCircle size={12} /> {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Bullet Point Critiques & Google's XYZ Formula Rewrites */}
                          <div className="glass rounded-2xl p-5 border border-[#334155]/60 space-y-4">
                            <h4 className="text-xs font-bold text-[#e2e8f0] uppercase tracking-wider flex items-center gap-1.5">
                              <TrendingUp className="text-[#a78bfa]" size={15} /> Bullet Point Critiques & XYZ Rewrites
                            </h4>

                            <div className="space-y-3">
                              {auditResult.bullet_point_critiques.map((item, idx) => (
                                <div key={idx} className="bg-[#0f172a] rounded-xl p-4 border border-[#334155] space-y-3">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded bg-[#fbbf24]/20 text-[#fbbf24] border border-[#fbbf24]/30">
                                      {item.weakness_type}
                                    </span>
                                    <button
                                      onClick={() => copyRewrittenBullet(item.rewritten_version, idx)}
                                      className="text-[11px] text-[#60a5fa] hover:text-[#93c5fd] flex items-center gap-1 font-semibold transition-colors"
                                    >
                                      {copiedIndex === idx ? (
                                        <>
                                          <Check size={13} className="text-[#34d399]" /> Copied XYZ Bullet!
                                        </>
                                      ) : (
                                        <>
                                          <Copy size={13} /> Copy XYZ Rewritten Bullet
                                        </>
                                      )}
                                    </button>
                                  </div>

                                  {/* Original Bullet */}
                                  <div>
                                    <p className="text-[11px] text-[#94a3b8] font-semibold mb-1">Original Bullet:</p>
                                    <p className="text-xs text-[#cbd5e1] font-mono bg-[#1e293b]/60 p-2.5 rounded-lg border border-[#334155]/50">
                                      "{item.original_text}"
                                    </p>
                                  </div>

                                  {/* Explanation */}
                                  <p className="text-xs text-[#fbbf24] italic">
                                    <span className="font-semibold">Critique:</span> {item.explanation}
                                  </p>

                                  {/* Rewritten XYZ Bullet */}
                                  <div className="bg-gradient-to-r from-[#34d399]/10 to-[#60a5fa]/10 p-3 rounded-lg border border-[#34d399]/30">
                                    <p className="text-[11px] text-[#34d399] font-bold uppercase mb-1 flex items-center gap-1">
                                      <Zap size={12} /> Rewritten (Google's XYZ Formula):
                                    </p>
                                    <p className="text-xs text-[#e2e8f0] font-medium leading-relaxed">
                                      {item.rewritten_version}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* ATS Formatting & Contact Audit */}
                          <div className="glass rounded-2xl p-5 border border-[#334155]/60 space-y-4">
                            <h4 className="text-xs font-bold text-[#e2e8f0] uppercase tracking-wider flex items-center gap-1.5">
                              <ShieldAlert className="text-[#34d399]" size={15} /> ATS Formatting & Contact Info Audit
                            </h4>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-semibold ${
                                auditResult.ats_formatting_audit.contact_info_check.has_email 
                                  ? 'bg-[#34d399]/10 border-[#34d399]/30 text-[#34d399]' 
                                  : 'bg-[#f87171]/10 border-[#f87171]/30 text-[#f87171]'
                              }`}>
                                {auditResult.ats_formatting_audit.contact_info_check.has_email ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                                Email Address
                              </div>

                              <div className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-semibold ${
                                auditResult.ats_formatting_audit.contact_info_check.has_phone 
                                  ? 'bg-[#34d399]/10 border-[#34d399]/30 text-[#34d399]' 
                                  : 'bg-[#f87171]/10 border-[#f87171]/30 text-[#f87171]'
                              }`}>
                                {auditResult.ats_formatting_audit.contact_info_check.has_phone ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                                Phone Number
                              </div>

                              <div className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-semibold ${
                                auditResult.ats_formatting_audit.contact_info_check.has_linkedin_or_portfolio 
                                  ? 'bg-[#34d399]/10 border-[#34d399]/30 text-[#34d399]' 
                                  : 'bg-[#f87171]/10 border-[#f87171]/30 text-[#f87171]'
                              }`}>
                                {auditResult.ats_formatting_audit.contact_info_check.has_linkedin_or_portfolio ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                                LinkedIn / Portfolio
                              </div>
                            </div>

                            {auditResult.ats_formatting_audit.parsing_risks.length > 0 && (
                              <div>
                                <p className="text-[11px] font-semibold text-[#94a3b8] mb-1.5 uppercase">Parsing Risks & Format Warnings:</p>
                                <ul className="space-y-1">
                                  {auditResult.ats_formatting_audit.parsing_risks.map((risk, idx) => (
                                    <li key={idx} className="text-xs text-[#cbd5e1] flex items-center gap-1.5">
                                      <AlertCircle size={13} className="text-[#fbbf24] flex-shrink-0" />
                                      {risk}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </>
                      ) : (
                        /* Raw JSON Viewer Mode */
                        <div className="glass rounded-2xl p-5 border border-[#334155]/60 space-y-3">
                          <div className="flex items-center justify-between border-b border-[#334155]/40 pb-3">
                            <span className="text-xs font-bold text-[#60a5fa] font-mono">Structured Audit JSON Response</span>
                            <button
                              onClick={copyJsonSchema}
                              className="px-3 py-1.5 bg-[#60a5fa] text-[#0f172a] rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-[#93c5fd] transition-colors"
                            >
                              {jsonCopied ? <Check size={14} /> : <Copy size={14} />}
                              {jsonCopied ? 'Copied JSON!' : 'Copy JSON Object'}
                            </button>
                          </div>

                          <pre className="p-4 bg-[#0f172a] text-[#34d399] rounded-xl text-xs font-mono overflow-x-auto leading-relaxed border border-[#334155]/50 max-h-[600px]">
                            {JSON.stringify(auditResult, null, 2)}
                          </pre>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    /* Initial Empty State */
                    <div className="glass rounded-2xl p-10 text-center h-full flex flex-col items-center justify-center border border-dashed border-[#334155]/80 min-h-[440px]">
                      <div className="w-16 h-16 rounded-2xl bg-[#60a5fa]/10 flex items-center justify-center text-[#60a5fa] mb-4 border border-[#60a5fa]/20">
                        <Upload size={32} />
                      </div>
                      <h3 className="text-base font-bold text-[#e2e8f0]">Upload Resume to Start ATS Audit</h3>
                      <p className="text-xs text-[#94a3b8] mt-2 max-w-sm leading-relaxed">
                        Drag and drop your candidate resume document (<strong className="text-[#60a5fa]">.PDF, .DOCX, .DOC</strong>) on the left and click <strong className="text-[#60a5fa]">Analyze Resume</strong> to extract text and query Gemini AI.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            /* External Embedded Web App Tab */
            <motion.div
              key="embedded-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-full flex flex-col space-y-4"
            >
              {/* URL Address Bar */}
              <div className="glass rounded-xl p-3 flex items-center gap-2 border border-[#334155]">
                <Globe size={16} className="text-[#60a5fa]" />
                <input
                  type="url"
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                  placeholder="Enter external Resume Analyzer web app URL (e.g. Streamlit, HuggingFace, Vercel link)"
                  className="flex-1 bg-[#0f172a] text-[#e2e8f0] text-xs px-3 py-1.5 rounded-lg border border-[#334155] focus:outline-none focus:border-[#60a5fa]"
                />
                <button
                  onClick={() => setIframeKey(k => k + 1)}
                  title="Reload Web App"
                  className="p-1.5 bg-[#334155]/50 text-[#e2e8f0] rounded-lg hover:bg-[#334155] transition-colors"
                >
                  <RefreshCw size={14} />
                </button>
                <a
                  href={externalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-[#60a5fa]/20 text-[#60a5fa] rounded-lg text-xs font-semibold flex items-center gap-1 hover:bg-[#60a5fa]/30 transition-colors"
                >
                  Open <ExternalLink size={12} />
                </a>
              </div>

              {/* Embedded Web App Frame */}
              <div className="flex-1 glass rounded-2xl overflow-hidden border border-[#334155] relative min-h-[400px]">
                <iframe
                  key={iframeKey}
                  src={externalUrl}
                  title="External Resume Analyzer App"
                  className="w-full h-full border-0 bg-white"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
