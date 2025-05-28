
import { useEffect } from 'react';
import { useAuth } from '../auth';
import { useComprehensiveAudit } from '../useComprehensiveAudit';

export const useAuthWithAudit = () => {
  const { user, loading, signOut } = useAuth();
  const { logAuthentication, logSecurityEvent } = useComprehensiveAudit();

  // Log de eventos de autenticação
  useEffect(() => {
    if (!loading && user) {
      // Log de login bem-sucedido
      logAuthentication('login', user.email);
      console.log('✅ Login registrado na auditoria:', user.email);
    }
  }, [user, loading, logAuthentication]);

  // Wrapper para logout com auditoria
  const signOutWithAudit = async () => {
    if (user) {
      logAuthentication('logout', user.email);
      console.log('✅ Logout registrado na auditoria:', user.email);
    }
    await signOut();
  };

  // Log de tentativas de acesso não autorizado
  const logUnauthorizedAccess = (resource: string) => {
    logSecurityEvent(
      'unauthorized_access',
      `Tentativa de acesso não autorizado a ${resource}`,
      'high',
      { 
        resource, 
        attempted_at: new Date().toISOString(),
        user_id: user?.id,
        user_email: user?.email
      }
    );
    console.log('🚨 Acesso não autorizado registrado:', resource);
  };

  // Log de falhas de login
  const logFailedLogin = (email: string, error: string) => {
    logAuthentication('login_failed', email, error);
    console.log('❌ Falha de login registrada:', email);
  };

  return {
    user,
    loading,
    signOut: signOutWithAudit,
    logUnauthorizedAccess,
    logFailedLogin
  };
};
