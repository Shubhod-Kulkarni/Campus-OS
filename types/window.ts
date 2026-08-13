// ============================================================
// Campus OS — Window Type Definitions
// ============================================================

export interface WindowPosition {
  x: number;
  y: number;
}

export interface WindowSize {
  width: number;
  height: number;
}

export interface WindowState {
  id: string;           // Unique window instance id (uuid)
  appId: string;        // Links to AppConfig.id
  title: string;
  isMinimized: boolean;
  isMaximized: boolean;
  isFocused: boolean;
  position: WindowPosition;
  size: WindowSize;
  zIndex: number;
}
