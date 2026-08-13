// ============================================================
// Campus OS — App Registry
// Central configuration for all apps in the OS
// To add a new app: just add an entry here.
// ============================================================
import { AppConfig } from '@/types/app';

export const APP_REGISTRY: AppConfig[] = [
  {
    id: 'resume',
    name: 'Resume Analyzer',
    icon: 'FileText',
    color: '#60a5fa', // blue-400
    description: 'AI-powered resume analysis and optimization',
    category: 'career',
    defaultSize: { width: 800, height: 560 },
    defaultPosition: { x: 80, y: 60 },
    minSize: { width: 500, height: 400 },
  },
  {
    id: 'interview',
    name: 'Interview Prep',
    icon: 'MessageSquare',
    color: '#a78bfa', // purple-400
    description: 'AI mock interviews and feedback',
    category: 'career',
    defaultSize: { width: 760, height: 540 },
    defaultPosition: { x: 100, y: 70 },
    minSize: { width: 480, height: 380 },
  },
  {
    id: 'expense',
    name: 'Expense Tracker',
    icon: 'Wallet',
    color: '#34d399', // emerald-400
    description: 'Track and manage your student expenses',
    category: 'finance',
    defaultSize: { width: 720, height: 520 },
    defaultPosition: { x: 120, y: 80 },
    minSize: { width: 460, height: 360 },
  },
  {
    id: 'placement',
    name: 'Placement Portal',
    icon: 'Briefcase',
    color: '#fbbf24', // amber-400
    description: 'Job listings, applications and placement tracking',
    category: 'career',
    defaultSize: { width: 860, height: 580 },
    defaultPosition: { x: 90, y: 65 },
    minSize: { width: 520, height: 400 },
  },
  {
    id: 'codereview',
    name: 'Code Review',
    icon: 'Code2',
    color: '#f472b6', // pink-400
    description: 'Peer code review and feedback platform',
    category: 'productivity',
    defaultSize: { width: 900, height: 600 },
    defaultPosition: { x: 70, y: 55 },
    minSize: { width: 560, height: 420 },
  },
  {
    id: 'finance',
    name: 'Finance Edu',
    icon: 'TrendingUp',
    color: '#34d399', // emerald-400
    description: 'Financial education, markets and investment basics',
    category: 'finance',
    defaultSize: { width: 860, height: 580 },
    defaultPosition: { x: 110, y: 75 },
    minSize: { width: 540, height: 400 },
  },
  {
    id: 'learning',
    name: 'Learning Engine',
    icon: 'BookOpen',
    color: '#60a5fa', // blue-400
    description: 'Adaptive learning paths and course materials',
    category: 'learning',
    defaultSize: { width: 800, height: 560 },
    defaultPosition: { x: 95, y: 68 },
    minSize: { width: 500, height: 380 },
  },
  {
    id: 'campus',
    name: 'Campus Portal',
    icon: 'GraduationCap',
    color: '#a78bfa', // purple-400
    description: 'Student profile, notices, timetable and attendance',
    category: 'productivity',
    defaultSize: { width: 920, height: 620 },
    defaultPosition: { x: 60, y: 50 },
    minSize: { width: 580, height: 440 },
  },
  {
    id: 'settings',
    name: 'Settings',
    icon: 'Settings',
    color: '#94a3b8', // slate-400
    description: 'Customize your Campus OS experience',
    category: 'system',
    defaultSize: { width: 680, height: 500 },
    defaultPosition: { x: 200, y: 100 },
    minSize: { width: 440, height: 360 },
  },
];

// Quick lookup map
export const APP_MAP = new Map(APP_REGISTRY.map((a) => [a.id, a]));

// Dock apps (shown in taskbar) — ordered
export const DOCK_APP_IDS = [
  'resume',
  'interview',
  'expense',
  'placement',
  'codereview',
  'finance',
  'learning',
  'campus',
  'settings',
];
