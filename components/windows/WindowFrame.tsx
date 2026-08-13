'use client';

// ============================================================
// Campus OS — Window Frame
// react-rnd draggable/resizable window with title bar
// ============================================================
import { Rnd } from 'react-rnd';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, Minimize2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { WindowState } from '@/types/window';
import { useWindowStore } from '@/stores/useWindowStore';
import { APP_MAP } from '@/components/apps/AppRegistry';

function AppIcon({ iconName, color }: { iconName: string; color: string }) {
  const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }>>)[iconName];
  if (!Icon) return null;
  return <Icon size={14} strokeWidth={1.5} style={{ color }} />;
}

interface WindowFrameProps {
  window: WindowState;
  children: React.ReactNode;
}

const TOPBAR_HEIGHT = 28;
const DOCK_HEIGHT = 80;

export default function WindowFrame({ window: win, children }: WindowFrameProps) {
  const { removeWindow, minimizeWindow, maximizeWindow, focusWindow, updateWindowPosition, updateWindowSize } =
    useWindowStore();

  const app = APP_MAP.get(win.appId);

  const handleClick = () => focusWindow(win.id);
  const handleClose = (e: React.MouseEvent) => { e.stopPropagation(); removeWindow(win.id); };
  const handleMinimize = (e: React.MouseEvent) => { e.stopPropagation(); minimizeWindow(win.id); };
  const handleMaximize = (e: React.MouseEvent) => { e.stopPropagation(); maximizeWindow(win.id); };

  // When maximized, fill desktop area
  const maxWidth = typeof globalThis.window !== 'undefined' ? globalThis.window.innerWidth : 1440;
  const maxHeight =
    typeof globalThis.window !== 'undefined'
      ? globalThis.window.innerHeight - TOPBAR_HEIGHT - DOCK_HEIGHT
      : 900;

  const rndSize = win.isMaximized
    ? { width: maxWidth, height: maxHeight }
    : win.size;

  const rndPos = win.isMaximized
    ? { x: 0, y: 0 }
    : win.position;

  return (
    <AnimatePresence>
      {!win.isMinimized && (
        <motion.div
          key={win.id}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1, transition: { duration: 0.18 } }}
          exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.12 } }}
          style={{ position: 'absolute', top: 0, left: 0, zIndex: win.zIndex }}
          onClick={handleClick}
        >
          <Rnd
            size={rndSize}
            position={rndPos}
            minWidth={app?.minSize?.width ?? 400}
            minHeight={app?.minSize?.height ?? 300}
            disableDragging={win.isMaximized}
            enableResizing={!win.isMaximized}
            bounds="parent"
            dragHandleClassName="window-drag-handle"
            onDragStop={(_e, d) => updateWindowPosition(win.id, { x: d.x, y: d.y })}
            onResizeStop={(_e, _dir, ref, _delta, pos) => {
              updateWindowSize(win.id, {
                width: parseInt(ref.style.width),
                height: parseInt(ref.style.height),
              });
              updateWindowPosition(win.id, pos);
            }}
            style={{ position: 'absolute' }}
          >
            <div
              className={`flex flex-col w-full h-full rounded-xl overflow-hidden shadow-2xl border ${
                win.isFocused ? 'border-[rgba(51,65,85,0.7)]' : 'border-[rgba(51,65,85,0.3)]'
              }`}
              style={{
                background: 'rgba(15, 23, 42, 0.92)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
            >
              {/* Title bar */}
              <div
                className={`window-drag-handle flex items-center justify-between px-3 h-9 flex-shrink-0 select-none ${
                  win.isFocused ? 'bg-[rgba(30,41,59,0.9)]' : 'bg-[rgba(15,23,42,0.8)]'
                }`}
                style={{ borderBottom: `1px solid rgba(51,65,85,0.4)` }}
              >
                {/* Traffic lights */}
                <div className="flex items-center gap-1.5">
                  <button
                    id={`win-close-${win.id}`}
                    onClick={handleClose}
                    className="btn-close w-3 h-3 rounded-full transition-all hover:brightness-110 active:brightness-90 group"
                  />
                  <button
                    id={`win-min-${win.id}`}
                    onClick={handleMinimize}
                    className="btn-min w-3 h-3 rounded-full transition-all hover:brightness-110 active:brightness-90"
                  />
                  <button
                    id={`win-max-${win.id}`}
                    onClick={handleMaximize}
                    className="btn-max w-3 h-3 rounded-full transition-all hover:brightness-110 active:brightness-90"
                  />
                </div>

                {/* App name + icon */}
                <div className="flex items-center gap-1.5 absolute left-1/2 -translate-x-1/2">
                  {app && <AppIcon iconName={app.icon} color={app.color} />}
                  <span className="text-[#94a3b8] text-xs font-medium">{win.title}</span>
                </div>

                {/* Maximize toggle icon */}
                <button onClick={handleMaximize} className="text-[#475569] hover:text-[#94a3b8] transition-colors">
                  {win.isMaximized ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
                </button>
              </div>

              {/* App content */}
              <div className="flex-1 overflow-hidden window-content">
                {children}
              </div>
            </div>
          </Rnd>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
