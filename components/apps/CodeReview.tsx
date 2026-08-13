'use client';
// Campus OS — Code Review App
import { motion } from 'framer-motion';
import { Code2, GitPullRequest, MessageCircle, Eye } from 'lucide-react';

const PRs = [
  { title: 'feat: Add dark mode toggle', author: 'Sangam G.', status: 'Open', comments: 3, reviews: 1, lang: 'TypeScript', color: '#60a5fa' },
  { title: 'fix: Resolve attendance calculation bug', author: 'Priya M.', status: 'Review', comments: 7, reviews: 2, lang: 'Python', color: '#34d399' },
  { title: 'refactor: Optimize DB queries', author: 'Rahul K.', status: 'Merged', comments: 2, reviews: 3, lang: 'SQL', color: '#a78bfa' },
  { title: 'docs: Update README', author: 'Anita S.', status: 'Open', comments: 0, reviews: 0, lang: 'Markdown', color: '#fbbf24' },
];

const STATUS_COLOR: Record<string, string> = { Open: '#60a5fa', Review: '#fbbf24', Merged: '#34d399' };

const CODE_SNIPPET = `function calculateCGPA(grades: number[]): number {
  if (!grades.length) return 0;
  const sum = grades.reduce((acc, g) => acc + g, 0);
  return parseFloat((sum / grades.length).toFixed(2));
  // TODO: Add credit weighting in Phase 2
}`;

export default function CodeReview() {
  return (
    <div className="h-full bg-[#0a0f1e] text-[#e2e8f0] p-6 overflow-y-auto">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-[#f472b6]/20 flex items-center justify-center">
          <Code2 className="text-[#f472b6]" size={20} />
        </div>
        <div>
          <h2 className="text-lg font-bold">Code Review</h2>
          <p className="text-[#475569] text-xs">Peer code review platform</p>
        </div>
      </div>

      {/* Code snippet preview */}
      <div className="glass rounded-xl mb-5 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-[rgba(51,65,85,0.4)]">
          <span className="text-xs text-[#94a3b8] font-mono">utils/cgpa.ts</span>
          <div className="flex gap-2 text-xs text-[#475569]">
            <span>TypeScript</span>
          </div>
        </div>
        <pre className="p-4 text-xs font-mono text-[#a78bfa] leading-relaxed overflow-x-auto">
          {CODE_SNIPPET}
        </pre>
      </div>

      {/* Pull requests */}
      <h3 className="text-sm font-semibold text-[#94a3b8] uppercase tracking-wider mb-3 flex items-center gap-2">
        <GitPullRequest size={14} /> Pull Requests
      </h3>
      <div className="space-y-2">
        {PRs.map((pr, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0, transition: { delay: i * 0.08 } }}
            className="glass rounded-xl p-3.5 flex items-start gap-3 hover:bg-[rgba(51,65,85,0.3)] cursor-pointer"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs rounded px-1.5 py-0.5 font-medium" style={{ background: `${STATUS_COLOR[pr.status]}20`, color: STATUS_COLOR[pr.status] }}>
                  {pr.status}
                </span>
                <span className="text-xs text-[#475569]">{pr.lang}</span>
              </div>
              <p className="text-sm text-[#e2e8f0] font-medium">{pr.title}</p>
              <p className="text-xs text-[#475569] mt-0.5">by {pr.author}</p>
            </div>
            <div className="flex gap-3 text-xs text-[#475569]">
              <span className="flex items-center gap-1"><MessageCircle size={11} />{pr.comments}</span>
              <span className="flex items-center gap-1"><Eye size={11} />{pr.reviews}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
