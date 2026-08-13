// ============================================================
// Campus OS — Window Store (Zustand)
// Manages: all open windows, z-index, minimize, maximize
// ============================================================
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WindowState, WindowPosition, WindowSize } from '@/types/window';

let zCounter = 100;
let windowIdCounter = 0;

interface WindowStoreState {
  windows: WindowState[];
  activeWindowId: string | null;
  // Actions
  addWindow: (appId: string, title: string, position: WindowPosition, size: WindowSize) => string;
  removeWindow: (windowId: string) => void;
  minimizeWindow: (windowId: string) => void;
  maximizeWindow: (windowId: string) => void;
  restoreWindow: (windowId: string) => void;
  focusWindow: (windowId: string) => void;
  updateWindowPosition: (windowId: string, pos: WindowPosition) => void;
  updateWindowSize: (windowId: string, size: WindowSize) => void;
  removeAllWindows: () => void;
}

export const useWindowStore = create<WindowStoreState>()(
  persist(
    (set, get) => ({
      windows: [],
      activeWindowId: null,

      addWindow: (appId, title, position, size) => {
        const id = `win-${appId}-${++windowIdCounter}`;
        // Check if app already open — bring to front instead of reopening
        const existing = get().windows.find((w) => w.appId === appId);
        if (existing) {
          get().focusWindow(existing.id);
          if (existing.isMinimized) get().restoreWindow(existing.id);
          return existing.id;
        }
        const newWindow: WindowState = {
          id,
          appId,
          title,
          isMinimized: false,
          isMaximized: false,
          isFocused: true,
          position,
          size,
          zIndex: ++zCounter,
        };
        set((s) => ({
          windows: [...s.windows, newWindow],
          activeWindowId: id,
        }));
        return id;
      },

      removeWindow: (windowId) => {
        set((s) => {
          const remaining = s.windows.filter((w) => w.id !== windowId);
          const lastActive = remaining.length > 0 ? remaining[remaining.length - 1].id : null;
          return { windows: remaining, activeWindowId: lastActive };
        });
      },

      minimizeWindow: (windowId) => {
        set((s) => ({
          windows: s.windows.map((w) =>
            w.id === windowId ? { ...w, isMinimized: true, isFocused: false } : w
          ),
          activeWindowId: null,
        }));
      },

      maximizeWindow: (windowId) => {
        set((s) => ({
          windows: s.windows.map((w) =>
            w.id === windowId ? { ...w, isMaximized: !w.isMaximized } : w
          ),
        }));
      },

      restoreWindow: (windowId) => {
        set((s) => ({
          windows: s.windows.map((w) =>
            w.id === windowId ? { ...w, isMinimized: false } : w
          ),
        }));
        get().focusWindow(windowId);
      },

      focusWindow: (windowId) => {
        set((s) => ({
          windows: s.windows.map((w) =>
            w.id === windowId
              ? { ...w, isFocused: true, zIndex: ++zCounter }
              : { ...w, isFocused: false }
          ),
          activeWindowId: windowId,
        }));
      },

      updateWindowPosition: (windowId, pos) => {
        set((s) => ({
          windows: s.windows.map((w) =>
            w.id === windowId ? { ...w, position: pos } : w
          ),
        }));
      },

      updateWindowSize: (windowId, size) => {
        set((s) => ({
          windows: s.windows.map((w) =>
            w.id === windowId ? { ...w, size } : w
          ),
        }));
      },

      removeAllWindows: () => set({ windows: [], activeWindowId: null }),
    }),
    {
      name: 'campus-os-windows',
      // Persist window positions/sizes but not z-index or focus state
      partialize: (state) => ({
        windows: state.windows.map((w) => ({
          ...w,
          isFocused: false,
          zIndex: 100,
        })),
      }),
    }
  )
);
