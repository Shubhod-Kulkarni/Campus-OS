// ============================================================
// Campus OS — App Store (Zustand)
// Manages: app registry, launching, closing
// ============================================================
import { create } from 'zustand';
import { AppConfig } from '@/types/app';
import { APP_REGISTRY } from '@/components/apps/AppRegistry';
import { useWindowStore } from './useWindowStore';

interface AppStoreState {
  apps: AppConfig[];
  launchApp: (appId: string) => void;
  closeApp: (appId: string) => void;
  getApp: (appId: string) => AppConfig | undefined;
}

export const useAppStore = create<AppStoreState>()((set, get) => ({
  apps: APP_REGISTRY,

  launchApp: (appId: string) => {
    const app = APP_REGISTRY.find((a) => a.id === appId);
    if (!app) return;

    const { addWindow } = useWindowStore.getState();
    const { windows } = useWindowStore.getState();

    // Check if already open (addWindow handles focus internally)
    addWindow(
      appId,
      app.name,
      app.defaultPosition,
      app.defaultSize
    );
  },

  closeApp: (appId: string) => {
    const { windows, removeWindow } = useWindowStore.getState();
    const win = windows.find((w) => w.appId === appId);
    if (win) removeWindow(win.id);
  },

  getApp: (appId: string) => {
    return APP_REGISTRY.find((a) => a.id === appId);
  },
}));
