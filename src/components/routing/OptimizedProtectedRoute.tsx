
import React from 'react';
import { useAuth } from '@/hooks/auth';
import { useSimplePermissions } from '@/hooks/useSimplePermissions';
import Login from '@/pages/Login';

interface OptimizedProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const OptimizedProtectedRoute: React.FC<OptimizedProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { user, loading: authLoading } = useAuth();
  const { hasAdminAccess, loading: permissionsLoading } = useSimplePermissions();

  console.log('🛡️ ProtectedRoute verificando:', { 
    hasUser: !!user, 
    userEmail: user?.email,
    authLoading, 
    requireAdmin, 
    hasAdminAccess, 
    permissionsLoading 
  });

  // Mostrar loading enquanto verifica
  if (authLoading || (user && permissionsLoading)) {
    console.log('⏳ ProtectedRoute aguardando...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Redirecionar para login se não autenticado
  if (!user) {
    console.log('🔒 Redirecionando para login');
    return <Login />;
  }

  // Verificar acesso admin se necessário
  if (requireAdmin && !hasAdminAccess) {
    console.log('❌ Acesso admin negado');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Acesso Negado</h1>
          <p className="text-gray-600">Você não tem permissão para acessar esta área.</p>
        </div>
      </div>
    );
  }

  console.log('✅ Acesso permitido');
  return <>{children}</>;
};

export default OptimizedProtectedRoute;
