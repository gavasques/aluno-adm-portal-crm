
import React, { Suspense } from 'react';
import { LoadingState } from '@/components/loading/LoadingStates';
import AdvancedSkeleton from '@/components/loading/AdvancedSkeleton';

// Componente de fallback otimizado para diferentes tipos de página
const createOptimizedFallback = (variant: 'dashboard' | 'table' | 'form' | 'card' = 'dashboard') => (
  <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
    <AdvancedSkeleton variant={variant} />
  </div>
);

// Factory para criar rotas lazy com fallback otimizado
export const createOptimizedLazyRoute = (
  importFunction: () => Promise<{ default: React.ComponentType<any> }>,
  variant: 'dashboard' | 'table' | 'form' | 'card' = 'dashboard'
) => {
  const LazyComponent = React.lazy(importFunction);
  
  return React.memo(React.forwardRef<any, any>((props, ref) => (
    <Suspense fallback={createOptimizedFallback(variant)}>
      <LazyComponent {...props} ref={ref} />
    </Suspense>
  )));
};

// Preload function com prioridade otimizada
export const preloadRoute = (
  importFunction: () => Promise<{ default: React.ComponentType<any> }>,
  priority: 'high' | 'medium' | 'low' = 'low'
) => {
  const preload = () => {
    try {
      importFunction();
    } catch (error) {
      console.warn('Failed to preload route:', error);
    }
  };

  if (priority === 'high') {
    // Preload imediato para rotas críticas
    preload();
  } else if (priority === 'medium') {
    // Preload após um pequeno delay
    setTimeout(preload, 500);
  } else {
    // Preload quando o browser estiver idle
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(preload);
    } else {
      setTimeout(preload, 2000);
    }
  }
};

// Rotas lazy organizadas por área
export const AdminRoutes = {
  Dashboard: createOptimizedLazyRoute(
    () => import('@/pages/admin/Dashboard'),
    'dashboard'
  ),
  Users: createOptimizedLazyRoute(
    () => import('@/pages/admin/Users'),
    'table'
  ),
  News: createOptimizedLazyRoute(
    () => import('@/pages/admin/News'),
    'table'
  ),
  Mentoring: createOptimizedLazyRoute(
    () => import('@/pages/admin/Mentoring'),
    'dashboard'
  ),
  Settings: createOptimizedLazyRoute(
    () => import('@/pages/admin/Settings'),
    'form'
  ),
  Partners: createOptimizedLazyRoute(
    () => import('@/pages/admin/Partners'),
    'table'
  ),
  Tools: createOptimizedLazyRoute(
    () => import('@/pages/admin/Tools'),
    'table'
  ),
};

export const StudentRoutes = {
  Dashboard: createOptimizedLazyRoute(
    () => import('@/pages/student/Dashboard'),
    'dashboard'
  ),
  Credits: createOptimizedLazyRoute(
    () => import('@/pages/student/Credits'),
    'card'
  ),
  MySuppliers: createOptimizedLazyRoute(
    () => import('@/pages/student/MySuppliers'),
    'table'
  ),
  Mentoring: createOptimizedLazyRoute(
    () => import('@/pages/student/Mentoring'),
    'dashboard'
  ),
  Partners: createOptimizedLazyRoute(
    () => import('@/pages/student/Partners'),
    'table'
  ),
  Tools: createOptimizedLazyRoute(
    () => import('@/pages/student/Tools'),
    'table'
  ),
  Suppliers: createOptimizedLazyRoute(
    () => import('@/pages/student/Suppliers'),
    'table'
  ),
  LiviAI: createOptimizedLazyRoute(
    () => import('@/pages/student/LiviAI'),
    'card'
  ),
};

// Função para preload de rotas críticas baseada no tipo de usuário
export const preloadCriticalRoutes = (isAdmin: boolean) => {
  if (isAdmin) {
    preloadRoute(() => import('@/pages/admin/Dashboard'), 'high');
    preloadRoute(() => import('@/pages/admin/Users'), 'medium');
    preloadRoute(() => import('@/pages/admin/News'), 'low');
  } else {
    preloadRoute(() => import('@/pages/student/Dashboard'), 'high');
    preloadRoute(() => import('@/pages/student/Credits'), 'medium');
    preloadRoute(() => import('@/pages/student/MySuppliers'), 'low');
  }
};
