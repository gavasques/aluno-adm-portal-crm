
import { useCallback, useEffect, useRef } from 'react';
import { useAuth } from './auth';
import { supabase } from '@/integrations/supabase/client';

interface AuditEvent {
  event_type: string;
  event_category: string;
  entity_type?: string;
  entity_id?: string;
  action: string;
  description?: string;
  old_values?: any;
  new_values?: any;
  metadata?: any;
  risk_level?: 'low' | 'medium' | 'high' | 'critical';
  success?: boolean;
  error_message?: string;
}

export const useComprehensiveAudit = () => {
  const { user, session } = useAuth();
  const sessionIdRef = useRef<string>(
    `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  );

  // Log de evento de auditoria
  const logEvent = useCallback(async (event: AuditEvent) => {
    try {
      const auditData = {
        user_id: user?.id,
        session_id: sessionIdRef.current,
        request_path: window.location.pathname,
        request_method: 'GET', // Para eventos de navegação
        metadata: {
          ...event.metadata,
          timestamp: Date.now(),
          url: window.location.href,
          referrer: document.referrer
        },
        ...event
      };

      // Chamar Edge Function
      const { error } = await supabase.functions.invoke('audit-logger', {
        body: { data: auditData }
      });

      if (error) {
        console.error('Erro ao registrar log de auditoria:', error);
      }
    } catch (error) {
      console.error('Erro na função de auditoria:', error);
    }
  }, [user?.id]);

  // Logs específicos para diferentes tipos de eventos
  const logNavigation = useCallback((path: string, previousPath?: string) => {
    logEvent({
      event_type: 'navigation',
      event_category: 'user_activity',
      action: 'page_visit',
      description: `Usuário navegou para ${path}`,
      metadata: {
        current_path: path,
        previous_path: previousPath,
        navigation_type: 'spa_navigation'
      },
      risk_level: 'low'
    });
  }, [logEvent]);

  const logAuthentication = useCallback((action: 'login' | 'logout' | 'login_failed', email?: string, error?: string) => {
    logEvent({
      event_type: `auth_${action}`,
      event_category: 'authentication',
      action,
      description: `Tentativa de ${action}${email ? ` para ${email}` : ''}`,
      metadata: {
        email,
        login_method: 'email_password'
      },
      risk_level: action === 'login_failed' ? 'high' : 'medium',
      success: action !== 'login_failed',
      error_message: error
    });
  }, [logEvent]);

  const logDataOperation = useCallback((
    operation: 'create' | 'read' | 'update' | 'delete',
    entityType: string,
    entityId: string,
    oldValues?: any,
    newValues?: any
  ) => {
    logEvent({
      event_type: 'data_operation',
      event_category: 'data_management',
      entity_type: entityType,
      entity_id: entityId,
      action: operation,
      description: `${operation.toUpperCase()} em ${entityType} (${entityId})`,
      old_values: oldValues,
      new_values: newValues,
      metadata: {
        operation_type: operation,
        entity_count: Array.isArray(newValues) ? newValues.length : 1
      },
      risk_level: operation === 'delete' ? 'medium' : 'low'
    });
  }, [logEvent]);

  const logSecurityEvent = useCallback((
    eventType: string,
    description: string,
    riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'medium',
    metadata?: any
  ) => {
    logEvent({
      event_type: eventType,
      event_category: 'security',
      action: 'security_event',
      description,
      metadata: {
        ...metadata,
        detection_time: new Date().toISOString(),
        user_agent: navigator.userAgent
      },
      risk_level: riskLevel
    });
  }, [logEvent]);

  const logSystemEvent = useCallback((
    eventType: string,
    action: string,
    description: string,
    metadata?: any
  ) => {
    logEvent({
      event_type: eventType,
      event_category: 'system',
      action,
      description,
      metadata: {
        ...metadata,
        system_info: {
          browser: navigator.userAgent,
          language: navigator.language,
          platform: navigator.platform
        }
      },
      risk_level: 'low'
    });
  }, [logEvent]);

  // Interceptar navegação
  useEffect(() => {
    let currentPath = window.location.pathname;
    
    const handleNavigation = () => {
      const newPath = window.location.pathname;
      if (newPath !== currentPath) {
        logNavigation(newPath, currentPath);
        currentPath = newPath;
      }
    };

    // Listener para mudanças de URL
    window.addEventListener('popstate', handleNavigation);
    
    // Observer para mudanças no DOM (SPA)
    const observer = new MutationObserver(() => {
      if (window.location.pathname !== currentPath) {
        handleNavigation();
      }
    });
    
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });

    return () => {
      window.removeEventListener('popstate', handleNavigation);
      observer.disconnect();
    };
  }, [logNavigation]);

  // Log de carregamento inicial da sessão
  useEffect(() => {
    if (user) {
      logSystemEvent(
        'session_start',
        'user_session_initiated',
        'Nova sessão de usuário iniciada',
        {
          user_id: user.id,
          session_id: sessionIdRef.current
        }
      );
    }
  }, [user, logSystemEvent]);

  return {
    logEvent,
    logNavigation,
    logAuthentication,
    logDataOperation,
    logSecurityEvent,
    logSystemEvent
  };
};
