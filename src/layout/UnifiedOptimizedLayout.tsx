
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
  const { user, loading, error } = useAuth();

  console.log('🏗️ Layout:', { 
    isAdmin, 
    hasUser: !!user, 
    userEmail: user?.email,
    loading,
    error
  });

  // Se há erro, mostrar erro
  if (error) {
    console.log('❌ Layout: Erro detectado');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Erro na Aplicação</h1>
          <p className="text-gray-600 mt-2">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Recarregar
          </button>
        </div>
      </div>
    );
  }

  // Se ainda carregando auth, mostrar loading
  if (loading) {
    console.log('⏳ Layout: Aguardando autenticação...');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-gray-600">Carregando layout...</p>
        </div>
      </div>
    );
  }

  // Se não há usuário, retornar erro
  if (!user) {
    console.log('🚫 Layout: Sem usuário autenticado');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Sessão Expirada</h1>
          <p className="text-gray-600 mt-2">Sua sessão expirou. Faça login novamente.</p>
          <a 
            href="/login"
            className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Fazer Login
          </a>
        </div>
      </div>
    );
  }

  console.log('✅ Layout: Renderizando com usuário autenticado');

  try {
    return (
      <div className="min-h-screen bg-gray-50 flex w-full">
        {/* Sidebar */}
        <div className="flex-shrink-0">
          {isAdmin ? (
            <AdminSidebar />
          ) : (
            <StudentSidebar />
          )}
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
  } catch (layoutError) {
    console.error('❌ Layout: Erro ao renderizar:', layoutError);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Erro no Layout</h1>
          <p className="text-gray-600 mt-2">Erro ao carregar o layout da aplicação.</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Recarregar
          </button>
        </div>
      </div>
    );
  }
};

export default UnifiedOptimizedLayout;
