
import { useCallback } from 'react';
import { useComprehensiveAudit } from '../useComprehensiveAudit';

export const useDataAudit = () => {
  const { logDataOperation } = useComprehensiveAudit();

  const auditCreate = useCallback((entityType: string, entityId: string, data: any) => {
    logDataOperation('create', entityType, entityId, null, data);
    console.log(`✅ CREATE auditado: ${entityType}(${entityId})`);
  }, [logDataOperation]);

  const auditUpdate = useCallback((entityType: string, entityId: string, oldData: any, newData: any) => {
    logDataOperation('update', entityType, entityId, oldData, newData);
    console.log(`✅ UPDATE auditado: ${entityType}(${entityId})`);
  }, [logDataOperation]);

  const auditDelete = useCallback((entityType: string, entityId: string, data: any) => {
    logDataOperation('delete', entityType, entityId, data, null);
    console.log(`✅ DELETE auditado: ${entityType}(${entityId})`);
  }, [logDataOperation]);

  const auditRead = useCallback((entityType: string, entityId: string) => {
    logDataOperation('read', entityType, entityId);
    console.log(`✅ READ auditado: ${entityType}(${entityId})`);
  }, [logDataOperation]);

  return {
    auditCreate,
    auditUpdate,
    auditDelete,
    auditRead
  };
};
