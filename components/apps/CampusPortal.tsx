'use client';

// ============================================================
// Campus OS — Campus Portal App (BecVortex Integration)
// Features: Student Profile, Notices, Timetable, Attendance, Results
// Inspired by: https://github.com/sangam-gaddi/BecVortex
// ============================================================
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Bell, Calendar, BarChart2, ClipboardList,
  Award, TrendingUp, Clock, MapPin, ChevronRight
} from 'lucide-react';

// ── Mock Data (BecVortex-style) ──────────────────────────────
const STUDENT = {
  name: 'Vikas Kannur',
  rollNo: '4BV21CS042',
  department: 'Computer Science & Engineering',
  semester: '6th Sem',
  section: 'B',
  cgpa: 8.74,
  college: 'BEC, Bagalkot',
  photo: '👨‍💻',
};

const NOTICES = [
  { id: 1, title: 'Placement Drive — TCS', date: '2026-08-15', type: 'placement', priority: 'high' },
  { id: 2, title: 'Internal Assessment Schedule Released', date: '2026-08-12', type: 'academic', priority: 'medium' },
  { id: 3, title: 'Hackathon 2026 Registration Open', date: '2026-08-10', type: 'event', priority: 'medium' },
  { id: 4, title: 'Library Books Return Deadline', date: '2026-08-08', type: 'admin', priority: 'low' },
  { id: 5, title: 'Workshop: Cloud Computing', date: '2026-08-07', type: 'event', priority: 'low' },
];

const TIMETABLE: Record<string, { time: string; subject: string; faculty: string; room: string }[]> = {
  Monday: [
    { time: '9:00', subject: 'Machine Learning', faculty: 'Dr. Priya S.', room: 'CS-301' },
    { time: '10:00', subject: 'Cloud Computing', faculty: 'Prof. Rahul M.', room: 'CS-302' },
    { time: '11:00', subject: 'Software Engineering', faculty: 'Dr. Anita K.', room: 'CS-301' },
    { time: '14:00', subject: 'ML Lab', faculty: 'Dr. Priya S.', room: 'Lab-2' },
  ],
  Tuesday: [
    { time: '9:00', subject: 'Database Systems', faculty: 'Prof. Suresh B.', room: 'CS-303' },
    { time: '10:00', subject: 'Computer Networks', faculty: 'Dr. Meena R.', room: 'CS-301' },
    { time: '11:00', subject: 'Machine Learning', faculty: 'Dr. Priya S.', room: 'CS-302' },
    { time: '14:00', subject: 'Networks Lab', faculty: 'Dr. Meena R.', room: 'Lab-1' },
  ],
  Wednesday: [
    { time: '9:00', subject: 'Software Engineering', faculty: 'Dr. Anita K.', room: 'CS-301' },
    { time: '10:00', subject: 'Cloud Computing', faculty: 'Prof. Rahul M.', room: 'CS-302' },
    { time: '14:00', subject: 'Mini Project', faculty: 'Dr. Priya S.', room: 'Lab-3' },
  ],
  Thursday: [
    { time: '9:00', subject: 'Computer Networks', faculty: 'Dr. Meena R.', room: 'CS-303' },
    { time: '10:00', subject: 'Database Systems', faculty: 'Prof. Suresh B.', room: 'CS-301' },
    { time: '11:00', subject: 'Cloud Computing', faculty: 'Prof. Rahul M.', room: 'CS-302' },
    { time: '14:00', subject: 'DB Lab', faculty: 'Prof. Suresh B.', room: 'Lab-1' },
  ],
  Friday: [
    { time: '9:00', subject: 'Machine Learning', faculty: 'Dr. Priya S.', room: 'CS-302' },
    { time: '10:00', subject: 'Software Engineering', faculty: 'Dr. Anita K.', room: 'CS-301' },
    { time: '11:00', subject: 'Database Systems', faculty: 'Prof. Suresh B.', room: 'CS-303' },
  ],
};

const ATTENDANCE = [
  { subject: 'Machine Learning', attended: 38, total: 42, color: '#60a5fa' },
  { subject: 'Cloud Computing', attended: 30, total: 36, color: '#a78bfa' },
  { subject: 'Software Engineering', attended: 35, total: 38, color: '#34d399' },
  { subject: 'Database Systems', attended: 40, total: 44, color: '#fbbf24' },
  { subject: 'Computer Networks', attended: 28, total: 34, color: '#f472b6' },
];

const RESULTS = [
  { subject: 'Data Structures', ia1: 38, ia2: 37, semester: 72, total: 147 },
  { subject: 'OOP with Java', ia1: 40, ia2: 39, semester: 74, total: 153 },
  { subject: 'Operating Systems', ia1: 35, ia2: 36, semester: 68, total: 139 },
  { subject: 'Computer Architecture', ia1: 37, ia2: 38, semester: 71, total: 146 },
  { subject: 'Discrete Mathematics', ia1: 33, ia2: 34, semester: 65, total: 132 },
];

// ── Tab types ────────────────────────────────────────────────
type Tab = 'profile' | 'notices' | 'timetable' | 'attendance' | 'results';

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'profile', label: 'Profile', icon: <User size={15} /> },
  { id: 'notices', label: 'Notices', icon: <Bell size={15} /> },
  { id: 'timetable', label: 'Timetable', icon: <Calendar size={15} /> },
  { id: 'attendance', label: 'Attendance', icon: <BarChart2 size={15} /> },
  { id: 'results', label: 'Results', icon: <ClipboardList size={15} /> },
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TODAY = DAYS[Math.min(new Date().getDay() - 1, 4)] ?? 'Monday';

const NOTICE_COLORS: Record<string, string> = {
  placement: '#60a5fa',
  academic: '#a78bfa',
  event: '#34d399',
  admin: '#fbbf24',
};

export default function CampusPortal() {
  const [tab, setTab] = useState<Tab>('profile');
  const [selectedDay, setSelectedDay] = useState(TODAY);

  return (
    <div className="flex h-full bg-[#0a0f1e] text-[#e2e8f0] font-['Inter',sans-serif]">
      {/* Sidebar */}
      <div className="w-44 flex flex-col gap-1 p-3 border-r border-[rgba(51,65,85,0.4)] bg-[rgba(15,23,42,0.6)] flex-shrink-0">
        <div className="flex items-center gap-2 px-2 py-3 mb-2">
          <span className="text-3xl">{STUDENT.photo}</span>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-[#e2e8f0] truncate">{STUDENT.name.split(' ')[0]}</p>
            <p className="text-[10px] text-[#475569]">{STUDENT.rollNo}</p>
          </div>
        </div>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all text-left ${
              tab === t.id
                ? 'bg-[#60a5fa]/20 text-[#60a5fa] font-medium'
                : 'text-[#94a3b8] hover:bg-[rgba(51,65,85,0.3)] hover:text-[#e2e8f0]'
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.15 }}
            className="h-full"
          >
            {/* ── PROFILE ────────────────────────────── */}
            {tab === 'profile' && (
              <div className="p-6 space-y-5">
                <h2 className="text-lg font-bold text-[#e2e8f0]">Student Profile</h2>
                {/* Profile card */}
                <div className="glass rounded-2xl p-5 flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-[#60a5fa]/20 flex items-center justify-center text-4xl">
                    {STUDENT.photo}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#e2e8f0]">{STUDENT.name}</h3>
                    <p className="text-[#94a3b8] text-sm">{STUDENT.department}</p>
                    <p className="text-[#475569] text-xs mt-0.5">{STUDENT.college}</p>
                  </div>
                  <div className="ml-auto text-right">
                    <div className="text-3xl font-bold text-[#60a5fa]">{STUDENT.cgpa}</div>
                    <div className="text-xs text-[#94a3b8]">CGPA</div>
                  </div>
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Roll No', value: STUDENT.rollNo, icon: '🪪' },
                    { label: 'Semester', value: STUDENT.semester, icon: '📚' },
                    { label: 'Section', value: STUDENT.section, icon: '🏫' },
                  ].map((info) => (
                    <div key={info.label} className="glass rounded-xl p-4 text-center">
                      <div className="text-2xl mb-1">{info.icon}</div>
                      <div className="text-[#e2e8f0] font-semibold text-sm">{info.value}</div>
                      <div className="text-[#475569] text-xs">{info.label}</div>
                    </div>
                  ))}
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="glass rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="text-[#fbbf24]" size={16} />
                      <span className="text-xs text-[#94a3b8] uppercase tracking-wider">Academic Standing</span>
                    </div>
                    <div className="text-[#fbbf24] font-bold text-lg">First Class</div>
                    <div className="text-[#475569] text-xs">with Distinction</div>
                  </div>
                  <div className="glass rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="text-[#34d399]" size={16} />
                      <span className="text-xs text-[#94a3b8] uppercase tracking-wider">Rank</span>
                    </div>
                    <div className="text-[#34d399] font-bold text-lg">#7 / 60</div>
                    <div className="text-[#475569] text-xs">in department</div>
                  </div>
                </div>
              </div>
            )}

            {/* ── NOTICES ────────────────────────────── */}
            {tab === 'notices' && (
              <div className="p-6 space-y-4">
                <h2 className="text-lg font-bold text-[#e2e8f0]">Campus Notices</h2>
                <div className="space-y-3">
                  {NOTICES.map((notice) => (
                    <motion.div
                      key={notice.id}
                      className="glass rounded-xl p-4 flex items-center gap-4 hover:bg-[rgba(51,65,85,0.3)] cursor-pointer transition-colors"
                      whileHover={{ x: 4 }}
                    >
                      <div
                        className="w-2 h-10 rounded-full flex-shrink-0"
                        style={{ background: NOTICE_COLORS[notice.type] ?? '#94a3b8' }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          {notice.priority === 'high' && (
                            <span className="text-[10px] bg-[#f472b6]/20 text-[#f472b6] rounded px-1.5 py-0.5 font-medium uppercase">
                              Urgent
                            </span>
                          )}
                          <span
                            className="text-[10px] rounded px-1.5 py-0.5 font-medium uppercase"
                            style={{
                              background: `${NOTICE_COLORS[notice.type]}20`,
                              color: NOTICE_COLORS[notice.type],
                            }}
                          >
                            {notice.type}
                          </span>
                        </div>
                        <p className="text-[#e2e8f0] text-sm font-medium">{notice.title}</p>
                        <p className="text-[#475569] text-xs mt-0.5">{notice.date}</p>
                      </div>
                      <ChevronRight className="text-[#475569]" size={16} />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* ── TIMETABLE ──────────────────────────── */}
            {tab === 'timetable' && (
              <div className="p-6 space-y-4">
                <h2 className="text-lg font-bold text-[#e2e8f0]">Weekly Timetable</h2>
                {/* Day tabs */}
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {DAYS.map((day) => (
                    <button
                      key={day}
                      onClick={() => setSelectedDay(day)}
                      className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                        selectedDay === day
                          ? 'bg-[#60a5fa] text-white'
                          : 'glass text-[#94a3b8] hover:text-[#e2e8f0]'
                      }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  {(TIMETABLE[selectedDay] ?? []).map((slot, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0, transition: { delay: i * 0.05 } }}
                      className="glass rounded-xl p-4 flex items-center gap-4"
                    >
                      <div className="text-center w-14 flex-shrink-0">
                        <div className="flex items-center gap-1 text-[#60a5fa]">
                          <Clock size={12} />
                          <span className="text-xs font-mono">{slot.time}</span>
                        </div>
                      </div>
                      <div className="w-px h-8 bg-[rgba(51,65,85,0.4)]" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[#e2e8f0] text-sm font-semibold">{slot.subject}</p>
                        <p className="text-[#94a3b8] text-xs">{slot.faculty}</p>
                      </div>
                      <div className="flex items-center gap-1 text-[#475569] text-xs">
                        <MapPin size={11} />
                        {slot.room}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* ── ATTENDANCE ─────────────────────────── */}
            {tab === 'attendance' && (
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-[#e2e8f0]">Attendance Tracker</h2>
                  <span className="text-xs text-[#94a3b8] glass rounded-full px-3 py-1">Sem 6 • 2026</span>
                </div>
                <div className="space-y-4">
                  {ATTENDANCE.map((sub) => {
                    const pct = Math.round((sub.attended / sub.total) * 100);
                    const isSafe = pct >= 75;
                    return (
                      <div key={sub.subject} className="glass rounded-xl p-4">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-[#e2e8f0] font-medium">{sub.subject}</span>
                          <span
                            className="text-sm font-bold"
                            style={{ color: isSafe ? sub.color : '#f472b6' }}
                          >
                            {pct}%
                          </span>
                        </div>
                        <div className="h-2 bg-[#1e293b] rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ background: isSafe ? sub.color : '#f472b6' }}
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                          />
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-[#475569]">{sub.attended} / {sub.total} classes</span>
                          {!isSafe && (
                            <span className="text-xs text-[#f472b6]">
                              Need {Math.ceil((0.75 * sub.total - sub.attended) / 0.25)} more
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── RESULTS ────────────────────────────── */}
            {tab === 'results' && (
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-[#e2e8f0]">Semester Results</h2>
                  <span className="text-xs text-[#94a3b8] glass rounded-full px-3 py-1">5th Sem</span>
                </div>
                <div className="glass rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[rgba(51,65,85,0.3)] text-[#94a3b8] text-xs uppercase tracking-wider">
                        <th className="text-left px-4 py-3">Subject</th>
                        <th className="px-4 py-3">IA1</th>
                        <th className="px-4 py-3">IA2</th>
                        <th className="px-4 py-3">Sem</th>
                        <th className="px-4 py-3">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {RESULTS.map((r, i) => {
                        const pct = (r.total / 200) * 100;
                        return (
                          <tr
                            key={i}
                            className="border-t border-[rgba(51,65,85,0.3)] hover:bg-[rgba(51,65,85,0.2)] transition-colors"
                          >
                            <td className="px-4 py-3 text-[#e2e8f0]">{r.subject}</td>
                            <td className="px-4 py-3 text-center text-[#94a3b8]">{r.ia1}</td>
                            <td className="px-4 py-3 text-center text-[#94a3b8]">{r.ia2}</td>
                            <td className="px-4 py-3 text-center text-[#94a3b8]">{r.semester}</td>
                            <td className="px-4 py-3 text-center">
                              <span
                                className="font-bold"
                                style={{ color: pct >= 60 ? '#34d399' : '#f472b6' }}
                              >
                                {r.total}
                              </span>
                              <span className="text-[#475569] text-xs">/200</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="glass rounded-xl p-3 text-center">
                    <div className="text-[#60a5fa] font-bold text-lg">717</div>
                    <div className="text-[#475569] text-xs">Total Marks</div>
                  </div>
                  <div className="glass rounded-xl p-3 text-center">
                    <div className="text-[#34d399] font-bold text-lg">8.4</div>
                    <div className="text-[#475569] text-xs">SGPA</div>
                  </div>
                  <div className="glass rounded-xl p-3 text-center">
                    <div className="text-[#fbbf24] font-bold text-lg">A</div>
                    <div className="text-[#475569] text-xs">Grade</div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
