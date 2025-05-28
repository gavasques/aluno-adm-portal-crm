
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

            // Verificar se os registros existem e têm ID antes de acessar
            const entityId = (newRecord && typeof newRecord === 'object' && 'id' in newRecord ? newRecord.id : 
                            (oldRecord && typeof oldRecord === 'object' && 'id' in oldRecord ? oldRecord.id : 'unknown')) as string;
            
            auditCRUDOperation(
              operation,
              table,
              entityId,
              newRecord,
              oldRecord
            );

            // Detectar atividades suspeitas específicas
            if (table === 'profiles' && operation === 'update') {
              // Verificar se os objetos existem e têm as propriedades necessárias
              const oldRole = oldRecord && typeof oldRecord === 'object' && 'role' in oldRecord ? oldRecord.role : null;
              const newRole = newRecord && typeof newRecord === 'object' && 'role' in newRecord ? newRecord.role : null;
              const oldStatus = oldRecord && typeof oldRecord === 'object' && 'status' in oldRecord ? oldRecord.status : null;
              const newStatus = newRecord && typeof newRecord === 'object' && 'status' in newRecord ? newRecord.status : null;
              
              const roleChanged = oldRole !== newRole;
              const statusChanged = oldStatus !== newStatus;
              
              if (roleChanged || statusChanged) {
                detectSuspiciousActivity('profile_critical_change', {
                  table,
                  operation,
                  entityId,
                  changes: {
                    role: { old: oldRole, new: newRole },
                    status: { old: oldStatus, new: newStatus }
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
