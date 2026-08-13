'use client';
// Campus OS — Expense Tracker App
import { motion } from 'framer-motion';
import { Wallet, Plus } from 'lucide-react';

const EXPENSES = [
  { name: 'Hostel Fees', amount: 8500, category: 'Housing', icon: '🏠', color: '#60a5fa' },
  { name: 'Mess Bill', amount: 2800, category: 'Food', icon: '🍛', color: '#34d399' },
  { name: 'Books & Materials', amount: 1200, category: 'Education', icon: '📚', color: '#a78bfa' },
  { name: 'Transport', amount: 600, category: 'Travel', icon: '🚌', color: '#fbbf24' },
  { name: 'Internet', amount: 399, category: 'Utilities', icon: '📶', color: '#f472b6' },
];

const TOTAL = EXPENSES.reduce((s, e) => s + e.amount, 0);
const BUDGET = 15000;

export default function ExpenseTracker() {
  return (
    <div className="h-full bg-[#0a0f1e] text-[#e2e8f0] p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#34d399]/20 flex items-center justify-center">
            <Wallet className="text-[#34d399]" size={20} />
          </div>
          <h2 className="text-lg font-bold">Expense Tracker</h2>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#34d399]/20 text-[#34d399] rounded-xl text-sm font-medium hover:bg-[#34d399]/30 transition-colors">
          <Plus size={14} /> Add
        </button>
      </div>

      {/* Summary card */}
      <div className="glass rounded-2xl p-5 mb-5">
        <div className="flex justify-between mb-3">
          <div>
            <p className="text-[#475569] text-xs">Spent this month</p>
            <p className="text-3xl font-bold text-[#e2e8f0]">₹{TOTAL.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-[#475569] text-xs">Budget</p>
            <p className="text-xl font-bold text-[#34d399]">₹{BUDGET.toLocaleString()}</p>
          </div>
        </div>
        {/* Budget bar */}
        <div className="h-3 bg-[#1e293b] rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: TOTAL > BUDGET * 0.9 ? '#f472b6' : '#34d399' }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((TOTAL / BUDGET) * 100, 100)}%` }}
            transition={{ duration: 1 }}
          />
        </div>
        <div className="flex justify-between mt-1.5 text-xs text-[#475569]">
          <span>{Math.round((TOTAL / BUDGET) * 100)}% used</span>
          <span>₹{(BUDGET - TOTAL).toLocaleString()} remaining</span>
        </div>
      </div>

      {/* Expense list */}
      <div className="space-y-2">
        {EXPENSES.map((exp, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0, transition: { delay: i * 0.07 } }}
            className="glass rounded-xl p-3.5 flex items-center gap-3"
          >
            <span className="text-2xl">{exp.icon}</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-[#e2e8f0]">{exp.name}</p>
              <p className="text-xs text-[#475569]">{exp.category}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-[#e2e8f0]">₹{exp.amount.toLocaleString()}</p>
              <div className="w-16 h-1 bg-[#1e293b] rounded-full mt-1 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${(exp.amount / TOTAL) * 100}%`, background: exp.color }} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
