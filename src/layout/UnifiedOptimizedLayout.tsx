
import React, { memo, useMemo } from 'react';
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

  console.log('🏗️ UnifiedOptimizedLayout:', { isAdmin, hasUser: !!user, loading });

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // No user - show children (probably login)
  if (!user) {
    console.log('🚫 No user in layout');
    return (
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    );
  }

  console.log('✅ Rendering layout with user:', user.email);

  return (
    <div className="min-h-screen bg-gray-50 flex w-full">
      {/* Sidebar */}
      <div className="flex-shrink-0">
        {isAdmin ? <AdminSidebar /> : <StudentSidebar />}
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto ml-64">
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

UnifiedOptimizedLayout.displayName = 'UnifiedOptimizedLayout';

export default UnifiedOptimizedLayout;
