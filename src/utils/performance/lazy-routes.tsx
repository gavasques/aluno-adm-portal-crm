
import React, { Suspense } from 'react';
import { LoadingState } from '@/components/loading/LoadingStates';
import AdvancedSkeleton from '@/components/loading/AdvancedSkeleton';

// Enhanced lazy loading with error boundaries
export const createLazyRoute = (
  importFunction: () => Promise<{ default: React.ComponentType<any> }>,
  fallback?: React.ReactNode,
  skeletonVariant?: 'dashboard' | 'table' | 'form' | 'card'
) => {
  const LazyComponent = React.lazy(importFunction);
  
  const defaultFallback = fallback || (
    <div className="p-6">
      {skeletonVariant ? (
        <AdvancedSkeleton variant={skeletonVariant} />
      ) : (
        <LoadingState size="lg" message="Carregando página..." />
      )}
    </div>
  );

  return React.forwardRef<any, any>((props, ref) => (
    <Suspense fallback={defaultFallback}>
      <LazyComponent {...props} ref={ref} />
    </Suspense>
  ));
};

// Preload function with priority
export const preloadRoute = (
  importFunction: () => Promise<{ default: React.ComponentType<any> }>,
  priority: 'high' | 'low' = 'low'
) => {
  if (priority === 'high') {
    // Immediate preload
    importFunction();
  } else {
    // Preload when browser is idle
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        importFunction();
      });
    } else {
      setTimeout(() => {
        importFunction();
      }, 1000);
    }
  }
};

// Route-based code splitting
export const AdminRoutes = {
  Dashboard: createLazyRoute(
    () => import('@/pages/admin/Dashboard'),
    undefined,
    'dashboard'
  ),
  Users: createLazyRoute(
    () => import('@/pages/admin/Users'),
    undefined,
    'table'
  ),
  // Add more admin routes as needed
};

export const StudentRoutes = {
  Dashboard: createLazyRoute(
    () => import('@/pages/student/Dashboard'),
    undefined,
    'dashboard'
  ),
  Suppliers: createLazyRoute(
    () => import('@/pages/student/Suppliers'),
    undefined,
    'table'
  ),
  // Add more student routes as needed
};

// Preload critical routes
export const preloadCriticalRoutes = () => {
  preloadRoute(() => import('@/pages/admin/Dashboard'), 'high');
  preloadRoute(() => import('@/pages/student/Dashboard'), 'high');
  preloadRoute(() => import('@/pages/admin/Users'), 'low');
};
