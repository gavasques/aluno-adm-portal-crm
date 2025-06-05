
import { QueryClient } from '@tanstack/react-query';
import { CRMFilters } from '@/types/crm.types';
import { debugLogger } from '@/utils/debug-logger';

// Cache keys centralizadas
export const crmQueryKeys = {
  all: ['crm'] as const,
  pipelines: () => [...crmQueryKeys.all, 'pipelines'] as const,
  pipelineColumns: (pipelineId?: string) => 
    [...crmQueryKeys.pipelines(), 'columns', pipelineId] as const,
  leads: () => [...crmQueryKeys.all, 'leads'] as const,
  leadsWithContacts: (filters?: CRMFilters) => 
    [...crmQueryKeys.leads(), 'with-contacts', filters] as const,
  leadDetail: (leadId: string) => 
    [...crmQueryKeys.leads(), 'detail', leadId] as const,
  leadComments: (leadId: string) => 
    [...crmQueryKeys.leads(), leadId, 'comments'] as const,
  leadContacts: (leadId: string) => 
    [...crmQueryKeys.leads(), leadId, 'contacts'] as const,
  pendingContacts: () => [...crmQueryKeys.all, 'pending-contacts'] as const,
  tags: () => [...crmQueryKeys.all, 'tags'] as const,
  lossReasons: () => [...crmQueryKeys.all, 'loss-reasons'] as const,
  fieldConfigurations: () => [...crmQueryKeys.all, 'field-configurations'] as const,
  cardPreferences: (userId: string) => 
    [...crmQueryKeys.all, 'card-preferences', userId] as const,
  reports: (filters?: CRMFilters) => 
    [...crmQueryKeys.all, 'reports', filters] as const,
};

// Cache manager
export class CRMCacheManager {
  constructor(private queryClient: QueryClient) {}

  // Invalidar dados de leads
  async invalidateLeadData(leadId: string) {
    debugLogger.info('🧹 [CACHE_MANAGER] Invalidando dados do lead:', { leadId });
    
    await Promise.all([
      this.queryClient.invalidateQueries({
        queryKey: crmQueryKeys.leadDetail(leadId)
      }),
      this.queryClient.invalidateQueries({
        queryKey: crmQueryKeys.leads()
      }),
      this.queryClient.invalidateQueries({
        queryKey: crmQueryKeys.leadsWithContacts()
      })
    ]);
  }

  // Invalidar dados quando lead move entre colunas
  async invalidateLeadMovement(
    leadId: string, 
    oldColumnId: string, 
    newColumnId: string, 
    pipelineId: string
  ) {
    debugLogger.info('🧹 [CACHE_MANAGER] Invalidando movimento de lead:', {
      leadId,
      oldColumnId,
      newColumnId,
      pipelineId
    });

    await Promise.all([
      this.invalidateLeadData(leadId),
      this.invalidatePipelineData(pipelineId),
      // Invalidar queries específicas de contatos e comentários
      this.queryClient.invalidateQueries({
        queryKey: crmQueryKeys.leadContacts(leadId)
      }),
      this.queryClient.invalidateQueries({
        queryKey: crmQueryKeys.leadComments(leadId)
      })
    ]);
  }

  // Invalidar dados do pipeline
  async invalidatePipelineData(pipelineId: string) {
    debugLogger.info('🧹 [CACHE_MANAGER] Invalidando dados do pipeline:', { pipelineId });
    
    await Promise.all([
      this.queryClient.invalidateQueries({
        queryKey: crmQueryKeys.pipelineColumns(pipelineId)
      }),
      this.queryClient.invalidateQueries({
        queryKey: crmQueryKeys.leadsWithContacts()
      }),
      this.queryClient.invalidateQueries({
        queryKey: crmQueryKeys.leads()
      })
    ]);
  }

  // Prefetch dados de um lead
  async prefetchLeadData(leadId: string) {
    debugLogger.info('⚡ [CACHE_MANAGER] Prefetch de dados do lead:', { leadId });
    
    // Implementar prefetch conforme necessário
  }

  // Limpar todo o cache do CRM
  async clearCRMCache() {
    debugLogger.info('🧹 [CACHE_MANAGER] Limpando todo o cache do CRM');
    
    await this.queryClient.invalidateQueries({
      queryKey: crmQueryKeys.all
    });
  }

  // Forçar refresh de todos os dados
  async forceRefreshAll() {
    debugLogger.info('🔄 [CACHE_MANAGER] Forçando refresh de todos os dados');
    
    await Promise.all([
      this.queryClient.refetchQueries({
        queryKey: crmQueryKeys.leadsWithContacts()
      }),
      this.queryClient.refetchQueries({
        queryKey: crmQueryKeys.pipelines()
      })
    ]);
  }
}

// Singleton instance
let cacheManagerInstance: CRMCacheManager | null = null;

export const getCRMCacheManager = (queryClient: QueryClient): CRMCacheManager => {
  if (!cacheManagerInstance) {
    cacheManagerInstance = new CRMCacheManager(queryClient);
  }
  return cacheManagerInstance;
};
