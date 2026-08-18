'use client';

// Campus OS — Resume Analyzer App
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Upload, Zap, Target, CheckCircle, AlertCircle, 
  ExternalLink, Globe, RefreshCw, BarChart2, Sparkles, ArrowRight, Play 
} from 'lucide-react';

const SAMPLE_ROLES = [
  { id: 'fullstack', label: 'Full-Stack Developer', keywords: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Tailwind', 'PostgreSQL', 'REST API', 'Git'] },
  { id: 'data', label: 'Data Analyst / Scientist', keywords: ['Python', 'SQL', 'Pandas', 'PowerBI', 'Tableau', 'Machine Learning', 'Statistics', 'R'] },
  { id: 'frontend', label: 'Frontend Engineer', keywords: ['JavaScript', 'React', 'CSS3', 'HTML5', 'Redux', 'Tailwind', 'Web Performance', 'UI/UX'] },
  { id: 'backend', label: 'Backend / Systems Engineer', keywords: ['Java', 'Go', 'Python', 'Microservices', 'Docker', 'Kubernetes', 'Redis', 'System Design'] },
];

export default function ResumeAnalyzer() {
  const [activeTab, setActiveTab] = useState<'analyzer' | 'embedded'>('analyzer');
  const [targetRole, setTargetRole] = useState('fullstack');
  const [resumeText, setResumeText] = useState('');
  const [externalUrl, setExternalUrl] = useState('https://resume-analyzer-demo.streamlit.app');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  const selectedRoleKeywords = SAMPLE_ROLES.find(r => r.id === targetRole)?.keywords || [];

  const handleRunAnalysis = () => {
    if (!resumeText.trim()) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalyzed(true);
    }, 1200);
  };

  // Simple heuristic scoring based on input length & keyword matches
  const textUpper = resumeText.toUpperCase();
  const matchedKeywords = selectedRoleKeywords.filter(kw => textUpper.includes(kw.toUpperCase()));
  const keywordScore = Math.min(100, Math.round((matchedKeywords.length / selectedRoleKeywords.length) * 100));
  const formatScore = resumeText.length > 200 ? 92 : 65;
  const impactScore = (textUpper.match(/(BUILT|DEVELOPED|LED|INCREASED|OPTIMIZED|DESIGNED|CREATED|MANAGED)/g) || []).length * 15;
  const clampedImpact = Math.min(100, Math.max(40, impactScore));
  const overallScore = Math.round((keywordScore * 0.4) + (formatScore * 0.3) + (clampedImpact * 0.3));

  return (
    <div className="h-full bg-[#0a0f1e] text-[#e2e8f0] flex flex-col overflow-hidden">
      {/* Top Header & Tab Bar */}
      <div className="glass px-6 py-4 flex items-center justify-between border-b border-[#334155]/50 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#60a5fa]/20 flex items-center justify-center border border-[#60a5fa]/30">
            <FileText className="text-[#60a5fa]" size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#e2e8f0]">Resume Analyzer</h2>
            <p className="text-xs text-[#94a3b8]">AI-powered ATS audit & Web App Integration</p>
          </div>
        </div>

        {/* Navigation Mode Switcher */}
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
            AI Analyzer
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

      {/* Main Content View */}
      <div className="flex-1 overflow-y-auto p-6">
        <AnimatePresence mode="wait">
          {activeTab === 'analyzer' ? (
            <motion.div
              key="analyzer-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-4xl mx-auto space-y-6"
            >
              {/* Role Selection Bar */}
              <div className="glass rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 border border-[#60a5fa]/20">
                <div className="flex items-center gap-2">
                  <Target className="text-[#60a5fa]" size={18} />
                  <span className="text-sm font-semibold text-[#e2e8f0]">Target Job Role:</span>
                </div>
                <select
                  value={targetRole}
                  onChange={(e) => { setTargetRole(e.target.value); setAnalyzed(false); }}
                  className="bg-[#0f172a] text-[#e2e8f0] text-sm rounded-lg px-3 py-1.5 border border-[#334155] focus:outline-none focus:border-[#60a5fa]"
                >
                  {SAMPLE_ROLES.map(r => (
                    <option key={r.id} value={r.id}>{r.label}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column: Resume Input */}
                <div className="space-y-4 flex flex-col">
                  <div className="glass rounded-2xl p-5 border border-[#334155]/60 flex-1 flex flex-col">
                    <label className="text-sm font-semibold text-[#e2e8f0] mb-2 flex items-center justify-between">
                      <span>Paste Resume Text</span>
                      <span className="text-xs text-[#94a3b8]">{resumeText.length} chars</span>
                    </label>
                    <textarea
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      placeholder="Paste your resume summary, experience, skills, and projects here to run the ATS scan..."
                      className="w-full h-48 bg-[#0f172a]/80 text-[#e2e8f0] text-xs p-3 rounded-xl border border-[#334155] focus:outline-none focus:border-[#60a5fa] resize-none font-mono"
                    />

                    <div className="mt-4 flex items-center gap-3">
                      <button
                        onClick={handleRunAnalysis}
                        disabled={isAnalyzing || !resumeText.trim()}
                        className="flex-1 py-2.5 bg-gradient-to-r from-[#60a5fa] to-[#3b82f6] text-[#0f172a] rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all shadow-md shadow-[#60a5fa]/20"
                      >
                        {isAnalyzing ? (
                          <>
                            <RefreshCw className="animate-spin" size={16} />
                            Scanning Resume...
                          </>
                        ) : (
                          <>
                            <Play size={16} />
                            Run ATS Audit
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Targeted Keywords Preview */}
                  <div className="glass rounded-xl p-4">
                    <p className="text-xs font-semibold text-[#94a3b8] mb-2">TARGET KEYWORDS FOR {SAMPLE_ROLES.find(r=>r.id===targetRole)?.label.toUpperCase()}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedRoleKeywords.map(kw => {
                        const isFound = textUpper.includes(kw.toUpperCase());
                        return (
                          <span
                            key={kw}
                            className={`text-xs px-2 py-0.5 rounded-md font-medium border ${
                              isFound 
                                ? 'bg-[#34d399]/15 text-[#34d399] border-[#34d399]/40' 
                                : 'bg-[#1e293b] text-[#64748b] border-[#334155]'
                            }`}
                          >
                            {isFound ? '✓ ' : ''}{kw}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right Column: Score Breakdown & Report */}
                <div>
                  {analyzed ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-4"
                    >
                      {/* Overall ATS Score Header */}
                      <div className="glass rounded-2xl p-6 text-center border border-[#60a5fa]/30 relative overflow-hidden">
                        <div className="text-xs uppercase tracking-wider font-semibold text-[#94a3b8] mb-1">ATS Compatibility Score</div>
                        <div className="text-5xl font-extrabold text-[#60a5fa] my-2">{overallScore}<span className="text-xl text-[#94a3b8]">/100</span></div>
                        <p className="text-xs text-[#34d399] font-medium">
                          {overallScore >= 75 ? '🎉 Strong ATS Match' : overallScore >= 50 ? '⚠️ Moderate Match — Needs Keywords' : '❌ Needs formatting & key terms'}
                        </p>
                      </div>

                      {/* Sub-scores */}
                      <div className="glass rounded-xl p-4 space-y-3">
                        <div>
                          <div className="flex justify-between text-xs font-semibold mb-1">
                            <span>Keyword Coverage</span>
                            <span className="text-[#60a5fa]">{keywordScore}%</span>
                          </div>
                          <div className="w-full bg-[#1e293b] h-2 rounded-full overflow-hidden">
                            <div className="bg-[#60a5fa] h-full transition-all" style={{ width: `${keywordScore}%` }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs font-semibold mb-1">
                            <span>Action / Impact Verbs</span>
                            <span className="text-[#a78bfa]">{clampedImpact}%</span>
                          </div>
                          <div className="w-full bg-[#1e293b] h-2 rounded-full overflow-hidden">
                            <div className="bg-[#a78bfa] h-full transition-all" style={{ width: `${clampedImpact}%` }} />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs font-semibold mb-1">
                            <span>ATS Formatting Score</span>
                            <span className="text-[#34d399]">{formatScore}%</span>
                          </div>
                          <div className="w-full bg-[#1e293b] h-2 rounded-full overflow-hidden">
                            <div className="bg-[#34d399] h-full transition-all" style={{ width: `${formatScore}%` }} />
                          </div>
                        </div>
                      </div>

                      {/* Recommendations */}
                      <div className="glass rounded-xl p-4 space-y-2">
                        <h4 className="text-xs font-bold text-[#e2e8f0] flex items-center gap-1.5">
                          <Zap size={14} className="text-[#fbbf24]" />
                          AI Improvement Suggestions
                        </h4>
                        <ul className="text-xs text-[#94a3b8] space-y-1.5">
                          <li className="flex items-start gap-1.5">
                            <CheckCircle size={14} className="text-[#34d399] mt-0.5 flex-shrink-0" />
                            <span>Include missing core keywords: {selectedRoleKeywords.filter(k => !textUpper.includes(k.toUpperCase())).slice(0, 3).join(', ') || 'All matched!'}</span>
                          </li>
                          <li className="flex items-start gap-1.5">
                            <AlertCircle size={14} className="text-[#fbbf24] mt-0.5 flex-shrink-0" />
                            <span>Use strong action verbs like <i>Optimized</i>, <i>Developed</i>, and <i>Engineered</i> in bullet points.</span>
                          </li>
                        </ul>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="glass rounded-2xl p-8 text-center h-full flex flex-col items-center justify-center border border-dashed border-[#334155]">
                      <BarChart2 className="text-[#60a5fa]/40 mb-3" size={40} />
                      <h3 className="text-base font-semibold text-[#e2e8f0]">Ready for ATS Analysis</h3>
                      <p className="text-xs text-[#94a3b8] mt-1 max-w-xs">
                        Paste your resume content on the left and select your target job role to generate a detailed ATS score breakdown.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
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
