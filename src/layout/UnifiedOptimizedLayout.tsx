
import React, { memo, useMemo, useCallback } from 'react';
import { useAuth } from '@/hooks/auth';
import AdminSidebar from './AdminSidebar';
import StudentSidebar from './StudentSidebar';
import PendingValidationOverlay from '@/components/layout/PendingValidationOverlay';

interface UnifiedOptimizedLayoutProps {
  isAdmin: boolean;
  children: React.ReactNode;
}

const UnifiedOptimizedLayout = memo(({ isAdmin, children }: UnifiedOptimizedLayoutProps) => {
  const { user, loading } = useAuth();

  // Memoize layout calculations
  const layoutConfig = useMemo(() => ({
    sidebarWidth: 256,
    mainContentClass: isAdmin ? 'ml-64' : 'ml-64',
    containerClass: 'min-h-screen bg-gray-50 flex w-full'
  }), [isAdmin]);

  // Memoize loading component
  const loadingComponent = useMemo(() => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="text-gray-600">Carregando...</p>
      </div>
    </div>
  ), []);

  // Memoize sidebar component selection
  const SidebarComponent = useMemo(() => 
    isAdmin ? AdminSidebar : StudentSidebar, 
    [isAdmin]
  );

  // Early return for loading state
  if (loading) {
    return loadingComponent;
  }

  // Early return for unauthenticated users
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    );
  }

  return (
    <div className={layoutConfig.containerClass}>
      {/* Optimized Sidebar Rendering */}
      <div className="flex-shrink-0">
        <SidebarComponent />
      </div>
      
      {/* Main Content Area - Optimized */}
      <div className={`flex-1 overflow-auto ${layoutConfig.mainContentClass}`}>
        <main className="w-full">
          <div className="max-w-full">
            {children}
          </div>
        </main>
      </div>
      
      {/* Overlay Components */}
      <PendingValidationOverlay />
    </div>
  );
});

UnifiedOptimizedLayout.displayName = 'UnifiedOptimizedLayout';

export default UnifiedOptimizedLayout;
