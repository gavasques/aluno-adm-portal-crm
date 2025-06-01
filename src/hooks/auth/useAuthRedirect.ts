
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/auth';

export const useAuthRedirect = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Aguardar carregamento inicial
    if (loading) return;

    // Se usuário logado, redirecionar para CRM
    if (user) {
      console.log('✅ User authenticated, redirecting to CRM...');
      navigate('/admin/crm', { replace: true });
    }
  }, [user, loading, navigate]);

  return { user, loading };
};
