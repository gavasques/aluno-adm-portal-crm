
import React from 'react';
import { useAuth } from '@/hooks/auth';
import AdminSidebar from './AdminSidebar';
import StudentSidebar from './StudentSidebar';
import PendingValidationOverlay from '@/components/layout/PendingValidationOverlay';

interface UnifiedOptimizedLayoutProps {
  isAdmin: boolean;
  children: React.ReactNode;
}

const UnifiedOptimizedLayout: React.FC<UnifiedOptimizedLayoutProps> = ({ 
  isAdmin, 
  children 
}) => {
  const { user, loading } = useAuth();

  console.log('🏗️ Layout renderizando:', { 
    isAdmin, 
    hasUser: !!user, 
    userEmail: user?.email,
    loading 
  });

  // Se ainda carregando auth, mostrar loading
  if (loading) {
    console.log('⏳ Layout aguardando auth...');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não há usuário, renderizar children (normalmente será redirecionado)
  if (!user) {
    console.log('🚫 Layout sem usuário');
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  console.log('✅ Layout renderizando com usuário autenticado');

  return (
    <div className="min-h-screen bg-gray-50 flex w-full">
      {/* Sidebar */}
      <div className="flex-shrink-0">
        {isAdmin ? <AdminSidebar /> : <StudentSidebar />}
      </div>
      
      {/* Conteúdo Principal */}
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
};

export default UnifiedOptimizedLayout;
