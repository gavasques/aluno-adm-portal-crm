
import React, { memo, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useOptimizedAuth } from '@/hooks/auth/useOptimizedAuth';
import AdminSidebar from './AdminSidebar';
import StudentSidebar from './StudentSidebar';
import PendingValidationOverlay from '@/components/layout/PendingValidationOverlay';

interface OptimizedLayoutProps {
  isAdmin: boolean;
  children: React.ReactNode;
}

const OptimizedLayout = memo(({ isAdmin, children }: OptimizedLayoutProps) => {
  const { user, loading } = useOptimizedAuth();
  const location = useLocation();
  const [isStudentSidebarCollapsed, setIsStudentSidebarCollapsed] = useState(false);

  const handleStudentSidebarToggle = () => {
    setIsStudentSidebarCollapsed(!isStudentSidebarCollapsed);
  };

  // Memoize the sidebar width calculation
  const sidebarWidth = useMemo(() => {
    return isAdmin ? 256 : (isStudentSidebarCollapsed ? 64 : 256);
  }, [isAdmin, isStudentSidebarCollapsed]);

  // Memoize loading state
  const loadingComponent = useMemo(() => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="text-gray-600">Carregando...</p>
      </div>
    </div>
  ), []);

  // Memoize the main content area styles
  const mainContentStyles = useMemo(() => ({
    marginLeft: `${sidebarWidth}px`
  }), [sidebarWidth]);

  // Early returns for loading and unauthenticated states
  if (loading) {
    return loadingComponent;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex w-full">
      {/* Sidebar - optimized rendering */}
      {isAdmin ? (
        <div className="flex-shrink-0">
          <AdminSidebar />
        </div>
      ) : (
        <StudentSidebar 
          isCollapsed={isStudentSidebarCollapsed} 
          onToggle={handleStudentSidebarToggle} 
        />
      )}
      
      {/* Main content area - optimized styling */}
      <div 
        className="flex-1 overflow-auto transition-all duration-300"
        style={mainContentStyles}
      >
        <main className="w-full">
          <div className="max-w-full">
            {children}
          </div>
        </main>
      </div>
      
      <PendingValidationOverlay />
    </div>
  );
});

OptimizedLayout.displayName = 'OptimizedLayout';

export default OptimizedLayout;
