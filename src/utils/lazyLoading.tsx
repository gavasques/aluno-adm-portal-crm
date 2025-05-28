
import React, { Suspense } from 'react';
import { LoadingState } from '@/components/loading/LoadingStates';
import AdvancedSkeleton from '@/components/loading/AdvancedSkeleton';

// Lazy load páginas principais
export const LazyStudentDashboard = React.lazy(() => import('@/pages/student/Dashboard'));
export const LazyAdminDashboard = React.lazy(() => import('@/pages/admin/Dashboard'));
export const LazySuppliers = React.lazy(() => import('@/pages/student/Suppliers'));
export const LazyMySuppliers = React.lazy(() => import('@/pages/student/MySuppliers'));
export const LazyPartners = React.lazy(() => import('@/pages/student/Partners'));
export const LazyTools = React.lazy(() => import('@/pages/student/Tools'));
export const LazyMentoring = React.lazy(() => import('@/pages/student/Mentoring'));
export const LazyCredits = React.lazy(() => import('@/pages/student/Credits'));
export const LazySettings = React.lazy(() => import('@/pages/student/Settings'));

// Admin pages
export const LazyAdminUsers = React.lazy(() => import('@/pages/admin/Users'));
export const LazyAdminSuppliers = React.lazy(() => import('@/pages/admin/Suppliers'));
export const LazyAdminPartners = React.lazy(() => import('@/pages/admin/Partners'));
export const LazyAdminTools = React.lazy(() => import('@/pages/admin/Tools'));
export const LazyAdminMentoring = React.lazy(() => import('@/pages/admin/Mentoring'));
export const LazyAdminCRM = React.lazy(() => import('@/pages/admin/CRM'));
export const LazyAdminTasks = React.lazy(() => import('@/pages/admin/Tasks'));

// HOC para wrapping com Suspense
export const withSuspense = (
  Component: React.ComponentType,
  fallback?: React.ReactNode,
  skeletonVariant?: 'dashboard' | 'table' | 'form' | 'card'
) => {
  const defaultFallback = fallback || (
    <div className="p-6">
      {skeletonVariant ? (
        <AdvancedSkeleton variant={skeletonVariant} />
      ) : (
        <LoadingState size="lg" message="Carregando página..." />
      )}
    </div>
  );

  return (props: any) => (
    <Suspense fallback={defaultFallback}>
      <Component {...props} />
    </Suspense>
  );
};

// Wrapper para lazy loading com error boundary
export const LazyWrapper: React.FC<{
  children: React.ReactNode;
  fallback?: React.ReactNode;
  skeletonVariant?: 'dashboard' | 'table' | 'form' | 'card';
}> = ({ children, fallback, skeletonVariant }) => {
  const defaultFallback = fallback || (
    <div className="p-6">
      {skeletonVariant ? (
        <AdvancedSkeleton variant={skeletonVariant} />
      ) : (
        <LoadingState size="lg" message="Carregando..." />
      )}
    </div>
  );

  return (
    <Suspense fallback={defaultFallback}>
      {children}
    </Suspense>
  );
};

// Função para preload de componentes
export const preloadComponent = (componentImport: () => Promise<any>) => {
  const componentImportPromise = componentImport();
  return () => componentImportPromise;
};

// Preload das principais páginas
export const preloadMainPages = () => {
  preloadComponent(() => import('@/pages/student/Dashboard'))();
  preloadComponent(() => import('@/pages/admin/Dashboard'))();
  preloadComponent(() => import('@/pages/student/Suppliers'))();
};
