
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CRMFilters, LeadWithContacts } from '@/types/crm.types';
import { crmQueryKeys } from '@/services/crm/CRMCacheManager';
import { crmOperations } from '@/services/crm/CRMOperations';
import { debugLogger } from '@/utils/debug-logger';

export const useUnifiedCRMData = (filters: CRMFilters = {}) => {
  const filtersKey = JSON.stringify(filters);
  
  debugLogger.info('🔄 [UNIFIED_CRM_DATA] Hook executado com filtros:', {
    filters,
    filtersKey,
    timestamp: new Date().toISOString()
  });

  const {
    data: leadsWithContacts = [],
    isLoading: loading,
    error,
    refetch
  } = useQuery({
    queryKey: crmQueryKeys.leadsWithContacts(filters),
    queryFn: () => crmOperations.getLeadsWithContacts(filters),
    staleTime: 30000, // 30 segundos
    refetchOnWindowFocus: true,
    refetchOnMount: true
  });

  // Agrupar leads por coluna
  const leadsByColumn = useMemo(() => {
    const grouped = leadsWithContacts.reduce((acc, lead) => {
      if (lead.column_id) {
        if (!acc[lead.column_id]) {
          acc[lead.column_id] = [];
        }
        acc[lead.column_id].push(lead);
      }
      return acc;
    }, {} as Record<string, LeadWithContacts[]>);

    debugLogger.info('📊 [UNIFIED_CRM_DATA] Leads agrupados por coluna:', {
      totalLeads: leadsWithContacts.length,
      columnGroups: Object.entries(grouped).map(([columnId, leads]) => ({
        columnId,
        leadsCount: leads.length,
        leadNames: leads.map(l => l.name)
      })),
      timestamp: new Date().toISOString()
    });

    return grouped;
  }, [leadsWithContacts]);

  debugLogger.info('📈 [UNIFIED_CRM_DATA] Resultado final:', {
    totalLeads: leadsWithContacts.length,
    loading,
    hasError: !!error,
    columnsWithLeads: Object.keys(leadsByColumn).length,
    timestamp: new Date().toISOString()
  });

  return {
    leadsWithContacts,
    leadsByColumn,
    loading,
    error,
    refetch
  };
};
