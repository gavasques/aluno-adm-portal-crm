
import React from 'react';
import { useAuth } from '@/hooks/auth';
import { useSimplePermissions } from '@/hooks/useSimplePermissions';
import { Navigate } from 'react-router-dom';

interface OptimizedProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const OptimizedProtectedRoute: React.FC<OptimizedProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { user, loading: authLoading, error } = useAuth();
  const { hasAdminAccess, loading: permissionsLoading } = useSimplePermissions();

  console.log('🛡️ ProtectedRoute:', { 
    hasUser: !!user, 
    userEmail: user?.email,
    authLoading, 
    requireAdmin, 
    hasAdminAccess, 
    permissionsLoading,
    error
  });

  // Se há erro na autenticação, redirecionar para login
  if (error) {
    console.log('❌ ProtectedRoute: Erro na autenticação, redirecionando para login');
    return <Navigate to="/login" replace />;
  }

  // Mostrar loading enquanto verifica
  if (authLoading || (user && permissionsLoading)) {
    console.log('⏳ ProtectedRoute: Aguardando autenticação/permissões...');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-gray-600">
            {authLoading ? 'Verificando autenticação...' : 'Carregando permissões...'}
          </p>
        </div>
      </div>
    );
  }

  // Redirecionar para login se não autenticado
  if (!user) {
    console.log('🔒 ProtectedRoute: Usuário não autenticado, redirecionando para login');
    return <Navigate to="/login" replace />;
  }

  // Verificar acesso admin se necessário
  if (requireAdmin && !hasAdminAccess) {
    console.log('❌ ProtectedRoute: Acesso admin negado');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Acesso Negado</h1>
          <p className="text-gray-600 mt-2">Você não tem permissão para acessar esta área.</p>
          <button 
            onClick={() => window.history.back()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  console.log('✅ ProtectedRoute: Acesso permitido');
  return <>{children}</>;
};

export default OptimizedProtectedRoute;
