// ============================================================
// Campus OS — Desktop Store (Zustand)
// Manages: booting, lock screen, wallpaper, widgets
// ============================================================
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Wallpaper =
  | 'default'
  | 'aurora'
  | 'cosmos'
  | 'mountains'
  | 'abstract';

interface DesktopState {
  isBooting: boolean;
  isLocked: boolean;
  wallpaper: Wallpaper;
  // Actions
  finishBoot: () => void;
  unlock: () => void;
  lock: () => void;
  setWallpaper: (w: Wallpaper) => void;
  restart: () => void;
}

export const useDesktopStore = create<DesktopState>()(
  persist(
    (set) => ({
      isBooting: true,
      isLocked: true,
      wallpaper: 'default',

      finishBoot: () => set({ isBooting: false }),
      unlock: () => set({ isLocked: false }),
      lock: () => set({ isLocked: true }),
      setWallpaper: (wallpaper) => set({ wallpaper }),
      restart: () => set({ isBooting: true, isLocked: true }),
    }),
    {
      name: 'campus-os-desktop',
      // Only persist wallpaper — boot/lock resets fresh each session
      partialize: (state) => ({ wallpaper: state.wallpaper }),
    }
  )
);
