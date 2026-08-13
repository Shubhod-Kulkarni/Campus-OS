// ============================================================
// Campus OS — App Type Definitions
// ============================================================

export type AppCategory = 'productivity' | 'finance' | 'career' | 'learning' | 'system';

export interface AppConfig {
  id: string;
  name: string;
  icon: string;            // Lucide icon name
  color: string;           // Window header accent color (hex / tailwind class)
  description: string;
  category: AppCategory;
  defaultSize: { width: number; height: number };
  defaultPosition: { x: number; y: number };
  minSize?: { width: number; height: number };
}
