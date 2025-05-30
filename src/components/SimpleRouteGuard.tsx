
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';

interface SimpleRouteGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

export const SimpleRouteGuard = ({ 
  children, 
  requireAuth = false, 
  requireAdmin = false 
}: SimpleRouteGuardProps) => {
  const { user, loading } = useSimpleAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        navigate('/login');
        return;
      }
      
      if (requireAdmin && user) {
        // Para agora, vamos permitir qualquer usuário logado acessar admin
        // Mais tarde podemos implementar verificação de permissões mais robusta
      }
    }
  }, [user, loading, requireAuth, requireAdmin, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (requireAuth && !user) {
    return null;
  }

  return <>{children}</>;
};
