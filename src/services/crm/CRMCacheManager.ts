
import { QueryClient } from '@tanstack/react-query';
import { LeadWithContacts, CRMFilters } from '@/types/crm.types';

// Chaves de query organizadas hierarquicamente
export const crmQueryKeys = {
  // Root
  crm: ['crm'] as const,
  
  // Pipelines
  pipelines: () => [...crmQueryKeys.crm, 'pipelines'] as const,
  pipeline: (id: string) => [...crmQueryKeys.pipelines(), id] as const,
  
  // Columns
  columns: () => [...crmQueryKeys.crm, 'columns'] as const,
  pipelineColumns: (pipelineId: string) => [...crmQueryKeys.columns(), 'pipeline', pipelineId] as const,
  
  // Leads
  leads: () => [...crmQueryKeys.crm, 'leads'] as const,
  unifiedLeads: (filters: CRMFilters) => [...crmQueryKeys.leads(), 'unified', filters] as const,
  leadDetail: (id: string) => [...crmQueryKeys.leads(), 'detail', id] as const,
  leadsByColumn: (columnId: string) => [...crmQueryKeys.leads(), 'column', columnId] as const,
  leadsByPipeline: (pipelineId: string) => [...crmQueryKeys.leads(), 'pipeline', pipelineId] as const,
  
  // Contacts
  contacts: () => [...crmQueryKeys.crm, 'contacts'] as const,
  leadContacts: (leadId: string) => [...crmQueryKeys.contacts(), 'lead', leadId] as const,
  pendingContacts: () => [...crmQueryKeys.contacts(), 'pending'] as const,
  
  // Tags
  tags: () => [...crmQueryKeys.crm, 'tags'] as const,
  leadTags: (leadId: string) => [...crmQueryKeys.tags(), 'lead', leadId] as const,
  
  // Comments
  comments: () => [...crmQueryKeys.crm, 'comments'] as const,
  leadComments: (leadId: string) => [...crmQueryKeys.comments(), 'lead', leadId] as const,
  
  // Analytics
  analytics: () => [...crmQueryKeys.crm, 'analytics'] as const,
  pipelineStats: (pipelineId: string) => [...crmQueryKeys.analytics(), 'pipeline', pipelineId] as const,
} as const;

// Configurações de cache por tipo de dado
const cacheConfigurations = {
  pipelines: {
    staleTime: 10 * 60 * 1000, // 10 minutos
    cacheTime: 30 * 60 * 1000, // 30 minutos
  },
  columns: {
    staleTime: 10 * 60 * 1000, // 10 minutos
    cacheTime: 30 * 60 * 1000, // 30 minutos
  },
  leads: {
    staleTime: 2 * 60 * 1000, // 2 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
  },
  leadDetail: {
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 15 * 60 * 1000, // 15 minutos
  },
  contacts: {
    staleTime: 1 * 60 * 1000, // 1 minuto
    cacheTime: 5 * 60 * 1000, // 5 minutos
  },
  tags: {
    staleTime: 15 * 60 * 1000, // 15 minutos
    cacheTime: 60 * 60 * 1000, // 1 hora
  },
  comments: {
    staleTime: 30 * 1000, // 30 segundos
    cacheTime: 5 * 60 * 1000, // 5 minutos
  },
  analytics: {
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 15 * 60 * 1000, // 15 minutos
  }
};

export class CRMCacheManager {
  private queryClient: QueryClient;

  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient;
  }

  // Invalidação inteligente baseada em dependências
  async invalidateLeadData(leadId: string) {
    console.log('🔄 [CACHE_MANAGER] Invalidando dados do lead:', leadId);
    
    const invalidationPromises = [
      // Invalidar dados específicos do lead
      this.queryClient.invalidateQueries({ queryKey: crmQueryKeys.leadDetail(leadId) }),
      this.queryClient.invalidateQueries({ queryKey: crmQueryKeys.leadContacts(leadId) }),
      this.queryClient.invalidateQueries({ queryKey: crmQueryKeys.leadTags(leadId) }),
      this.queryClient.invalidateQueries({ queryKey: crmQueryKeys.leadComments(leadId) }),
      
      // Invalidar listas que podem conter o lead
      this.queryClient.invalidateQueries({ queryKey: crmQueryKeys.leads() }),
      this.queryClient.invalidateQueries({ queryKey: crmQueryKeys.pendingContacts() }),
    ];

    await Promise.allSettled(invalidationPromises);
  }

  async invalidatePipelineData(pipelineId: string) {
    console.log('🔄 [CACHE_MANAGER] Invalidando dados do pipeline:', pipelineId);
    
    const invalidationPromises = [
      this.queryClient.invalidateQueries({ queryKey: crmQueryKeys.pipeline(pipelineId) }),
      this.queryClient.invalidateQueries({ queryKey: crmQueryKeys.pipelineColumns(pipelineId) }),
      this.queryClient.invalidateQueries({ queryKey: crmQueryKeys.leadsByPipeline(pipelineId) }),
      this.queryClient.invalidateQueries({ queryKey: crmQueryKeys.pipelineStats(pipelineId) }),
    ];

    await Promise.allSettled(invalidationPromises);
  }

  async invalidateColumnData(columnId: string) {
    console.log('🔄 [CACHE_MANAGER] Invalidando dados da coluna:', columnId);
    
    const invalidationPromises = [
      this.queryClient.invalidateQueries({ queryKey: crmQueryKeys.leadsByColumn(columnId) }),
      this.queryClient.invalidateQueries({ queryKey: crmQueryKeys.leads() }),
    ];

    await Promise.allSettled(invalidationPromises);
  }

  // Invalidação em cascata para operações complexas
  async invalidateLeadMovement(leadId: string, fromColumnId: string, toColumnId: string, pipelineId: string) {
    console.log('🔄 [CACHE_MANAGER] Invalidando movimento de lead:', {
      leadId,
      fromColumnId,
      toColumnId,
      pipelineId
    });

    const invalidationPromises = [
      // Lead específico
      this.invalidateLeadData(leadId),
      
      // Colunas afetadas
      this.invalidateColumnData(fromColumnId),
      this.invalidateColumnData(toColumnId),
      
      // Pipeline
      this.invalidatePipelineData(pipelineId),
      
      // Analytics que podem ter mudado
      this.queryClient.invalidateQueries({ queryKey: crmQueryKeys.analytics() }),
    ];

    await Promise.allSettled(invalidationPromises);
  }

  // Pré-carregamento inteligente
  async prefetchLeadData(leadId: string) {
    console.log('🔮 [CACHE_MANAGER] Pré-carregando dados do lead:', leadId);
    
    // Pré-carregar dados relacionados que provavelmente serão necessários
    const prefetchPromises = [
      this.queryClient.prefetchQuery({
        queryKey: crmQueryKeys.leadContacts(leadId),
        staleTime: cacheConfigurations.contacts.staleTime,
      }),
      this.queryClient.prefetchQuery({
        queryKey: crmQueryKeys.leadComments(leadId),
        staleTime: cacheConfigurations.comments.staleTime,
      }),
      this.queryClient.prefetchQuery({
        queryKey: crmQueryKeys.leadTags(leadId),
        staleTime: cacheConfigurations.tags.staleTime,
      }),
    ];

    await Promise.allSettled(prefetchPromises);
  }

  // Otimistic updates para melhor UX
  setOptimisticLeadUpdate(leadId: string, updatedData: Partial<LeadWithContacts>) {
    console.log('⚡ [CACHE_MANAGER] Aplicando update otimista:', { leadId, updatedData });

    // Atualizar todas as queries que podem conter o lead
    this.queryClient.setQueriesData(
      { queryKey: crmQueryKeys.leads() },
      (oldData: any) => {
        if (!oldData) return oldData;
        
        if (Array.isArray(oldData)) {
          return oldData.map((lead: LeadWithContacts) =>
            lead.id === leadId ? { ...lead, ...updatedData } : lead
          );
        }
        
        return oldData;
      }
    );

    // Atualizar query específica do lead
    this.queryClient.setQueryData(
      crmQueryKeys.leadDetail(leadId),
      (oldData: any) => oldData ? { ...oldData, ...updatedData } : oldData
    );
  }

  // Limpeza de cache para performance
  async cleanupStaleCache() {
    console.log('🧹 [CACHE_MANAGER] Limpando cache obsoleto');
    
    const cache = this.queryClient.getQueryCache();
    const queries = cache.getAll();
    
    let removedCount = 0;
    queries.forEach(query => {
      // Remover queries muito antigas ou com erro persistente
      const isOld = Date.now() - query.state.dataUpdatedAt > 30 * 60 * 1000; // 30 minutos
      const hasError = query.state.status === 'error';
      
      if (isOld || hasError) {
        cache.remove(query);
        removedCount++;
      }
    });

    console.log('🧹 [CACHE_MANAGER] Cache limpo:', { removedQueries: removedCount });
  }

  // Métricas de cache para monitoramento
  getCacheMetrics() {
    const cache = this.queryClient.getQueryCache();
    const queries = cache.getAll();
    
    const metrics = {
      totalQueries: queries.length,
      successQueries: queries.filter(q => q.state.status === 'success').length,
      errorQueries: queries.filter(q => q.state.status === 'error').length,
      loadingQueries: queries.filter(q => q.state.status === 'pending').length,
      staleQueries: queries.filter(q => q.isStale()).length,
      crmQueries: queries.filter(q => 
        q.queryKey[0] === 'crm' || 
        q.queryKey.includes('crm') ||
        q.queryKey.includes('unified-crm-leads')
      ).length,
      memoryUsage: JSON.stringify(cache).length,
    };

    console.log('📊 [CACHE_MANAGER] Métricas do cache:', metrics);
    return metrics;
  }

  // Configurar estratégias de cache por tipo
  getCacheConfig(type: keyof typeof cacheConfigurations) {
    return cacheConfigurations[type];
  }
}

// Instância singleton para uso global
let cacheManagerInstance: CRMCacheManager | null = null;

export const getCRMCacheManager = (queryClient: QueryClient): CRMCacheManager => {
  if (!cacheManagerInstance) {
    cacheManagerInstance = new CRMCacheManager(queryClient);
  }
  return cacheManagerInstance;
};

export const resetCRMCacheManager = () => {
  cacheManagerInstance = null;
};
