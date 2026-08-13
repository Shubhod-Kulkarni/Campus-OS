'use client';

// ============================================================
// Campus OS — Finance Edu App (FinSack Integration)
// Market tickers, charts, financial education
// Inspired by: https://github.com/only-vikas/finsack
// ============================================================
import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, BookOpen, BarChart3, PieChart } from 'lucide-react';

const TICKERS = [
  { symbol: 'BTC', name: 'Bitcoin', price: 67842, change: +2.34, color: '#fbbf24' },
  { symbol: 'ETH', name: 'Ethereum', price: 3521, change: -0.87, color: '#60a5fa' },
  { symbol: 'NIFTY', name: 'Nifty 50', price: 24890, change: +0.62, color: '#34d399' },
  { symbol: 'SENSEX', name: 'BSE Sensex', price: 81245, change: +0.41, color: '#a78bfa' },
  { symbol: 'GOLD', name: 'Gold (10g)', price: 73200, change: -0.15, color: '#fbbf24' },
];

const FUNDS = [
  { name: 'Mirae Asset Large Cap', returns: 18.4, risk: 'Low', rating: 5, color: '#60a5fa' },
  { name: 'Axis Bluechip Fund', returns: 16.2, risk: 'Low', rating: 4, color: '#34d399' },
  { name: 'SBI Small Cap Fund', returns: 28.7, risk: 'High', rating: 4, color: '#f472b6' },
  { name: 'HDFC Balanced Advantage', returns: 14.1, risk: 'Medium', rating: 5, color: '#a78bfa' },
];

const TIPS = [
  { title: 'Start Early', desc: 'Compound interest is the 8th wonder. Even ₹500/month SIP at 22 can build ₹2Cr by 60.', icon: '🌱' },
  { title: '50-30-20 Rule', desc: '50% needs, 30% wants, 20% savings — the golden budget ratio for students.', icon: '📊' },
  { title: 'Emergency Fund', desc: 'Keep 3-6 months of expenses liquid before investing in markets.', icon: '🛡️' },
  { title: 'Index Funds', desc: 'For beginners: low-cost index funds consistently beat 80% of active funds.', icon: '📈' },
];

type Tab = 'markets' | 'funds' | 'learn';

export default function FinanceEdu() {
  const [tab, setTab] = useState<Tab>('markets');

  return (
    <div className="flex h-full bg-[#0a0f1e] text-[#e2e8f0]">
      {/* Sidebar */}
      <div className="w-40 flex flex-col gap-1 p-3 border-r border-[rgba(51,65,85,0.4)] bg-[rgba(15,23,42,0.6)] flex-shrink-0">
        <div className="px-2 py-3 mb-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-[#34d399]" size={20} />
            <span className="font-bold text-sm text-[#e2e8f0]">Finance Edu</span>
          </div>
          <p className="text-[#475569] text-xs mt-1">Learn & Invest</p>
        </div>
        {([
          { id: 'markets' as Tab, label: 'Markets', icon: <BarChart3 size={15} /> },
          { id: 'funds' as Tab, label: 'Mutual Funds', icon: <PieChart size={15} /> },
          { id: 'learn' as Tab, label: 'Learn', icon: <BookOpen size={15} /> },
        ]).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all text-left ${
              tab === t.id ? 'bg-[#34d399]/20 text-[#34d399] font-medium' : 'text-[#94a3b8] hover:bg-[rgba(51,65,85,0.3)]'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5">
        {tab === 'markets' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Live Markets</h2>
            <div className="grid grid-cols-1 gap-3">
              {TICKERS.map((t) => (
                <motion.div
                  key={t.symbol}
                  className="glass rounded-xl p-4 flex items-center justify-between"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm"
                      style={{ background: `${t.color}22`, color: t.color }}
                    >
                      {t.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-semibold text-[#e2e8f0]">{t.symbol}</p>
                      <p className="text-[#475569] text-xs">{t.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#e2e8f0]">₹{t.price.toLocaleString()}</p>
                    <div className={`flex items-center gap-1 text-sm justify-end ${t.change >= 0 ? 'text-[#34d399]' : 'text-[#f472b6]'}`}>
                      {t.change >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                      {t.change >= 0 ? '+' : ''}{t.change}%
                    </div>
                  </div>
                  {/* Mini sparkline (CSS) */}
                  <div className="ml-4 flex items-end gap-px h-8">
                    {Array.from({ length: 12 }, (_, i) => (
                      <div
                        key={i}
                        className="w-1 rounded-sm"
                        style={{
                          height: `${20 + Math.sin(i * 0.8 + t.change) * 12}px`,
                          background: t.change >= 0 ? '#34d399' : '#f472b6',
                          opacity: 0.4 + i * 0.05,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
            <p className="text-xs text-[#475569] text-center">* Mock data for educational purposes</p>
          </div>
        )}

        {tab === 'funds' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Top Mutual Funds</h2>
            {FUNDS.map((fund, i) => (
              <div key={i} className="glass rounded-xl p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-[#e2e8f0]">{fund.name}</p>
                    <div className="flex gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        fund.risk === 'Low' ? 'bg-[#34d399]/20 text-[#34d399]'
                          : fund.risk === 'High' ? 'bg-[#f472b6]/20 text-[#f472b6]'
                          : 'bg-[#fbbf24]/20 text-[#fbbf24]'
                      }`}>{fund.risk} Risk</span>
                      <span className="text-xs text-[#475569]">{'★'.repeat(fund.rating)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold" style={{ color: fund.color }}>{fund.returns}%</div>
                    <div className="text-xs text-[#475569]">1Y Returns</div>
                  </div>
                </div>
                <div className="h-2 bg-[#1e293b] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: fund.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(fund.returns / 35) * 100}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'learn' && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Financial Tips for Students</h2>
            {TIPS.map((tip, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0, transition: { delay: i * 0.1 } }}
                className="glass rounded-xl p-4 flex gap-4"
              >
                <span className="text-3xl">{tip.icon}</span>
                <div>
                  <h3 className="font-semibold text-[#e2e8f0] mb-1">{tip.title}</h3>
                  <p className="text-[#94a3b8] text-sm leading-relaxed">{tip.desc}</p>
                </div>
              </motion.div>
            ))}
            <div className="glass rounded-xl p-4 text-center border border-[#60a5fa]/20">
              <DollarSign className="text-[#60a5fa] mx-auto mb-2" size={24} />
              <p className="text-[#60a5fa] font-semibold">Full FinSack Integration Coming Phase 2</p>
              <p className="text-[#475569] text-xs mt-1">Portfolio tracking, real-time alerts, AI advisor</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
