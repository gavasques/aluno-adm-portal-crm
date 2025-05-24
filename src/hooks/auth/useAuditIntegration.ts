
import { useEffect } from 'react';
import { useComprehensiveAudit } from '../useComprehensiveAudit';
import { User } from '@supabase/supabase-js';

export const useAuditIntegration = (user: User | null, loading: boolean) => {
  const { logAuthentication, logSecurityEvent } = useComprehensiveAudit();

  // Interceptar eventos de autenticação
  useEffect(() => {
    if (!loading && user) {
      // Log de login bem-sucedido
      logAuthentication('login', user.email);
    }
  }, [user, loading, logAuthentication]);

  // Interceptar tentativas de login com falha
  const logFailedLogin = (email: string, error: string) => {
    logAuthentication('login_failed', email, error);
  };

  // Interceptar logout
  const logLogout = () => {
    if (user) {
      logAuthentication('logout', user.email);
    }
  };

  // Interceptar eventos de segurança
  const logUnauthorizedAccess = (resource: string) => {
    logSecurityEvent(
      'unauthorized_access',
      `Tentativa de acesso não autorizado a ${resource}`,
      'high',
      { resource, attempted_at: new Date().toISOString() }
    );
  };

  const logSuspiciousActivity = (activityType: string, details: any) => {
    logSecurityEvent(
      'suspicious_activity',
      `Atividade suspeita detectada: ${activityType}`,
      'medium',
      { activity_type: activityType, details }
    );
  };

  return {
    logFailedLogin,
    logLogout,
    logUnauthorizedAccess,
    logSuspiciousActivity
  };
};
