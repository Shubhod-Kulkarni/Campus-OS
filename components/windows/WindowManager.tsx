'use client';

// ============================================================
// Campus OS — Window Manager
// Renders all active windows with lazy-loaded app components
// ============================================================
import { lazy, Suspense } from 'react';
import { useWindowStore } from '@/stores/useWindowStore';
import WindowFrame from './WindowFrame';

// Lazy-load all app components for performance
const AppComponents: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  resume:    lazy(() => import('@/components/apps/ResumeAnalyzer')),
  interview: lazy(() => import('@/components/apps/InterviewPrep')),
  expense:   lazy(() => import('@/components/apps/ExpenseTracker')),
  placement: lazy(() => import('@/components/apps/PlacementPortal')),
  codereview:lazy(() => import('@/components/apps/CodeReview')),
  finance:   lazy(() => import('@/components/apps/FinanceEdu')),
  learning:  lazy(() => import('@/components/apps/LearningEngine')),
  campus:    lazy(() => import('@/components/apps/CampusPortal')),
  settings:  lazy(() => import('@/components/apps/Settings')),
};

function AppSkeleton() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-8 h-8 border-2 border-[#60a5fa] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function WindowManager() {
  const { windows } = useWindowStore();

  return (
    <>
      {windows.map((win) => {
        const AppComponent = AppComponents[win.appId];
        if (!AppComponent) return null;

        return (
          <WindowFrame key={win.id} window={win}>
            <Suspense fallback={<AppSkeleton />}>
              <AppComponent />
            </Suspense>
          </WindowFrame>
        );
      })}
    </>
  );
}
