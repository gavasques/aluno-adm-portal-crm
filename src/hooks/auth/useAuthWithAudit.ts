
import { useEffect } from 'react';
import { useAuth } from '../auth';
import { useAdvancedAudit } from '../admin/useAdvancedAudit';
import { useComprehensiveAudit } from '../useComprehensiveAudit';

export const useAuthWithAudit = () => {
  const { user, loading, signOut } = useAuth();
  const { logAuthentication, logSecurityEvent } = useComprehensiveAudit();
  const { detectSuspiciousActivity, auditSensitiveDataAccess } = useAdvancedAudit();

  // Log de eventos de autenticação
  useEffect(() => {
    if (!loading && user) {
      // Log de login bem-sucedido
      logAuthentication('login', user.email);
      console.log('✅ Login registrado na auditoria:', user.email);

      // Verificar tentativas de login suspeitas
      const loginCount = sessionStorage.getItem('login_attempts') || '0';
      const currentCount = parseInt(loginCount) + 1;
      sessionStorage.setItem('login_attempts', currentCount.toString());

      if (currentCount > 3) {
        detectSuspiciousActivity('multiple_login_attempts', {
          user_email: user.email,
          attempt_count: currentCount,
          session_info: {
            user_agent: navigator.userAgent,
            timestamp: new Date().toISOString()
          }
        });
      }
    }
  }, [user, loading, logAuthentication, detectSuspiciousActivity]);

  // Wrapper para logout com auditoria
  const signOutWithAudit = async () => {
    if (user) {
      logAuthentication('logout', user.email);
      console.log('✅ Logout registrado na auditoria:', user.email);
      
      // Limpar tentativas de login
      sessionStorage.removeItem('login_attempts');
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
        user_email: user?.email,
        page_url: window.location.href,
        referrer: document.referrer
      }
    );
    
    detectSuspiciousActivity('unauthorized_access_attempt', {
      resource,
      user_context: {
        id: user?.id,
        email: user?.email,
        role: user?.role
      },
      access_context: {
        url: window.location.href,
        timestamp: new Date().toISOString()
      }
    });
    
    console.log('🚨 Acesso não autorizado registrado:', resource);
  };

  // Log de falhas de login
  const logFailedLogin = (email: string, error: string) => {
    logAuthentication('login_failed', email, error);
    
    // Detectar padrões de ataques de força bruta
    const failedAttempts = sessionStorage.getItem(`failed_login_${email}`) || '0';
    const currentAttempts = parseInt(failedAttempts) + 1;
    sessionStorage.setItem(`failed_login_${email}`, currentAttempts.toString());

    if (currentAttempts >= 3) {
      detectSuspiciousActivity('brute_force_attempt', {
        target_email: email,
        failed_attempts: currentAttempts,
        error_message: error,
        detection_context: {
          user_agent: navigator.userAgent,
          ip_info: 'client_side_detection',
          timestamp: new Date().toISOString()
        }
      });
    }
    
    console.log('❌ Falha de login registrada:', email);
  };

  // Log de acesso a dados sensíveis
  const logSensitiveAccess = (dataType: string, reason: string) => {
    auditSensitiveDataAccess(dataType, reason);
  };

  return {
    user,
    loading,
    signOut: signOutWithAudit,
    logUnauthorizedAccess,
    logFailedLogin,
    logSensitiveAccess
  };
};
