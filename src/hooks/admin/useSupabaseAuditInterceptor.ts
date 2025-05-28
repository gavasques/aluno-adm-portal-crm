
import { useEffect } from 'react';
import { useAdvancedAudit } from './useAdvancedAudit';
import { supabase } from '@/integrations/supabase/client';

export const useSupabaseAuditInterceptor = () => {
  const { auditCRUDOperation, detectSuspiciousActivity } = useAdvancedAudit();

  useEffect(() => {
    // Interceptar mudanças em tempo real para auditoria
    const channels: any[] = [];

    // Tabelas importantes para monitorar
    const criticalTables = [
      'profiles',
      'permission_groups',
      'my_suppliers',
      'mentoring_enrollments',
      'bonuses'
    ];

    criticalTables.forEach(table => {
      const channel = supabase
        .channel(`audit_${table}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: table
          },
          (payload) => {
            const { eventType, new: newRecord, old: oldRecord } = payload;
            
            let operation: 'create' | 'read' | 'update' | 'delete';
            switch (eventType) {
              case 'INSERT':
                operation = 'create';
                break;
              case 'UPDATE':
                operation = 'update';
                break;
              case 'DELETE':
                operation = 'delete';
                break;
              default:
                return;
            }

            const entityId = newRecord?.id || oldRecord?.id || 'unknown';
            
            auditCRUDOperation(
              operation,
              table,
              entityId,
              newRecord,
              oldRecord
            );

            // Detectar atividades suspeitas específicas
            if (table === 'profiles' && operation === 'update') {
              const roleChanged = oldRecord?.role !== newRecord?.role;
              const statusChanged = oldRecord?.status !== newRecord?.status;
              
              if (roleChanged || statusChanged) {
                detectSuspiciousActivity('profile_critical_change', {
                  table,
                  operation,
                  entityId,
                  changes: {
                    role: { old: oldRecord?.role, new: newRecord?.role },
                    status: { old: oldRecord?.status, new: newRecord?.status }
                  }
                });
              }
            }

            if (table === 'permission_groups' && operation === 'delete') {
              detectSuspiciousActivity('permission_group_deletion', {
                table,
                operation,
                entityId,
                deletedGroup: oldRecord
              });
            }
          }
        )
        .subscribe();

      channels.push(channel);
    });

    return () => {
      channels.forEach(channel => {
        supabase.removeChannel(channel);
      });
    };
  }, [auditCRUDOperation, detectSuspiciousActivity]);
};
