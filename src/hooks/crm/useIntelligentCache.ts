
import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { CRMFilters, LeadWithContacts } from '@/types/crm.types';

interface CacheStrategy {
  staleTime: number;
  cacheTime: number;
  refetchOnWindowFocus: boolean;
  refetchOnMount: boolean;
}

const CACHE_STRATEGIES: Record<string, CacheStrategy> = {
  'high-frequency': {
    staleTime: 30 * 1000, // 30 segundos
    cacheTime: 2 * 60 * 1000, // 2 minutos
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  },
  'medium-frequency': {
    staleTime: 2 * 60 * 1000, // 2 minutos
    cacheTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  },
  'low-frequency': {
    staleTime: 10 * 60 * 1000, // 10 minutos
    cacheTime: 30 * 60 * 1000, // 30 minutos
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  },
};

export const useIntelligentCache = () => {
  const queryClient = useQueryClient();

  const getCacheStrategy = useCallback((queryType: string, filters: CRMFilters): CacheStrategy => {
    // Estratégia baseada no tipo de query e filtros
    if (filters.search || filters.contact_filter) {
      return CACHE_STRATEGIES['high-frequency']; // Busca ativa = cache curto
    }
    
    if (filters.column_id || filters.responsible_id) {
      return CACHE_STRATEGIES['medium-frequency']; // Filtros específicos = cache médio
    }
    
    return CACHE_STRATEGIES['low-frequency']; // Visualização geral = cache longo
  }, []);

  const prefetchRelatedData = useCallback(async (leadIds: string[]) => {
    console.log('🔮 [INTELLIGENT_CACHE] Prefetching dados relacionados para', leadIds.length, 'leads');
    
    // Prefetch de dados que provavelmente serão necessários
    const prefetchPromises = leadIds.slice(0, 10).map(leadId => // Limitar a 10 para evitar sobrecarga
      queryClient.prefetchQuery({
        queryKey: ['lead-detail', leadId],
        queryFn: async () => {
          // Simular fetch de detalhes do lead
          console.log('📊 [PREFETCH] Carregando detalhes do lead:', leadId);
          return null; // Implementar quando necessário
        },
        staleTime: 5 * 60 * 1000, // 5 minutos
      })
    );

    try {
      await Promise.allSettled(prefetchPromises);
      console.log('✅ [INTELLIGENT_CACHE] Prefetch concluído');
    } catch (error) {
      console.warn('⚠️ [INTELLIGENT_CACHE] Erro no prefetch:', error);
    }
  }, [queryClient]);

  const optimizeCache = useCallback((leads: LeadWithContacts[]) => {
    console.log('🧠 [INTELLIGENT_CACHE] Otimizando cache para', leads.length, 'leads');
    
    // Agrupar leads por pipeline para otimização
    const leadsByPipeline = leads.reduce((acc, lead) => {
      if (lead.pipeline_id) {
        if (!acc[lead.pipeline_id]) acc[lead.pipeline_id] = [];
        acc[lead.pipeline_id].push(lead);
      }
      return acc;
    }, {} as Record<string, LeadWithContacts[]>);

    // Cache de estatísticas por pipeline
    Object.entries(leadsByPipeline).forEach(([pipelineId, pipelineLeads]) => {
      const stats = {
        totalLeads: pipelineLeads.length,
        leadsByColumn: pipelineLeads.reduce((acc, lead) => {
          if (lead.column_id) {
            acc[lead.column_id] = (acc[lead.column_id] || 0) + 1;
          }
          return acc;
        }, {} as Record<string, number>),
        lastUpdated: Date.now()
      };

      queryClient.setQueryData(['pipeline-stats', pipelineId], stats);
    });

    // Prefetch inteligente baseado na atividade do usuário
    const recentlyViewedLeads = leads
      .filter(lead => lead.updated_at)
      .sort((a, b) => new Date(b.updated_at!).getTime() - new Date(a.updated_at!).getTime())
      .slice(0, 5)
      .map(lead => lead.id);

    if (recentlyViewedLeads.length > 0) {
      prefetchRelatedData(recentlyViewedLeads);
    }
  }, [queryClient, prefetchRelatedData]);

  const invalidateRelatedQueries = useCallback((leadId: string, columnId?: string) => {
    console.log('🔄 [INTELLIGENT_CACHE] Invalidando queries relacionadas:', { leadId, columnId });
    
    // Invalidação seletiva baseada no contexto
    const queriesToInvalidate = [
      ['unified-crm-leads'],
      ['optimized-crm-leads'],
      ['lead-detail', leadId]
    ];

    if (columnId) {
      queriesToInvalidate.push(['column-leads', columnId]);
    }

    queriesToInvalidate.forEach(queryKey => {
      queryClient.invalidateQueries({ queryKey });
    });
  }, [queryClient]);

  const getCacheMetrics = useCallback(() => {
    const cache = queryClient.getQueryCache();
    const queries = cache.getAll();
    
    const metrics = {
      totalQueries: queries.length,
      activeQueries: queries.filter(q => q.state.status === 'pending').length,
      staleQueries: queries.filter(q => q.isStale()).length,
      errorQueries: queries.filter(q => q.state.status === 'error').length,
      memoryUsage: JSON.stringify(cache).length, // Aproximação
    };

    console.log('📊 [CACHE_METRICS]', metrics);
    return metrics;
  }, [queryClient]);

  return {
    getCacheStrategy,
    prefetchRelatedData,
    optimizeCache,
    invalidateRelatedQueries,
    getCacheMetrics
  };
};
