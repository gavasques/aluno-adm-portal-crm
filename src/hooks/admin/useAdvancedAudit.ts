
import { useCallback } from 'react';
import { useComprehensiveAudit } from '../useComprehensiveAudit';
import { useAuth } from '../auth';
import { toast } from 'sonner';

export const useAdvancedAudit = () => {
  const { logDataOperation, logSecurityEvent } = useComprehensiveAudit();
  const { user } = useAuth();

  // Interceptar operações CRUD automaticamente
  const auditCRUDOperation = useCallback(async (
    operation: 'create' | 'read' | 'update' | 'delete',
    entityType: string,
    entityId: string,
    data?: any,
    oldData?: any
  ) => {
    try {
      // Log da operação
      logDataOperation(operation, entityType, entityId, oldData, data);
      
      // Verificar se é uma operação de alto risco
      const isHighRisk = operation === 'delete' || 
                        entityType === 'profiles' || 
                        entityType === 'permission_groups';
      
      if (isHighRisk) {
        logSecurityEvent(
          'high_risk_operation',
          `Operação ${operation.toUpperCase()} em ${entityType} por ${user?.email}`,
          'high',
          {
            operation,
            entityType,
            entityId,
            user_id: user?.id,
            user_email: user?.email,
            timestamp: new Date().toISOString()
          }
        );
      }
      
      console.log(`✅ Operação ${operation} auditada: ${entityType}(${entityId})`);
    } catch (error) {
      console.error('Erro ao auditar operação:', error);
    }
  }, [logDataOperation, logSecurityEvent, user]);

  // Detectar atividades suspeitas
  const detectSuspiciousActivity = useCallback((activityType: string, details: any) => {
    logSecurityEvent(
      'suspicious_activity',
      `Atividade suspeita detectada: ${activityType}`,
      'medium',
      {
        activity_type: activityType,
        details,
        detection_time: new Date().toISOString(),
        user_id: user?.id
      }
    );
  }, [logSecurityEvent, user]);

  // Log de acesso a dados sensíveis
  const auditSensitiveDataAccess = useCallback((dataType: string, reason: string) => {
    logSecurityEvent(
      'sensitive_data_access',
      `Acesso a dados sensíveis: ${dataType}`,
      'medium',
      {
        data_type: dataType,
        access_reason: reason,
        user_id: user?.id,
        user_email: user?.email
      }
    );
  }, [logSecurityEvent, user]);

  return {
    auditCRUDOperation,
    detectSuspiciousActivity,
    auditSensitiveDataAccess
  };
};
