import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { usePerformanceTracking } from '@/utils/performanceMonitor';
import { CRMFilters, LeadWithContacts, CRMPipelineColumn } from '@/types/crm.types';
import { useUnifiedCRMData } from './useUnifiedCRMData';
import { useUnifiedLeadMovement } from './useUnifiedLeadMovement';

interface UseOptimizedCRMDataOptions {
  enableRealtime?: boolean;
  enableVirtualization?: boolean;
  cacheTimeout?: number;
  prefetchRelated?: boolean;
}

export const useOptimizedCRMData = (
  filters: CRMFilters,
  options: UseOptimizedCRMDataOptions = {}
) => {
  const {
    enableRealtime = true,
    enableVirtualization = true,
    cacheTimeout = 5 * 60 * 1000, // 5 minutos
    prefetchRelated = true
  } = options;

  const queryClient = useQueryClient();
  const { startTiming } = usePerformanceTracking('OptimizedCRMData');
  
  // Estados para otimizações
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [virtualizedRange, setVirtualizedRange] = useState({ start: 0, end: 50 });
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);

  // Hook base para dados
  const {
    leadsWithContacts: allLeads,
    leadsByColumn,
    loading,
    error,
    refetch
  } = useUnifiedCRMData(filters);

  // Hook para movimentação
  const { moveLeadToColumn } = useUnifiedLeadMovement(filters);

  // Dados virtualizados para performance
  const virtualizedLeads = useMemo(() => {
    if (!enableVirtualization || allLeads.length <= 100) {
      return allLeads;
    }

    const endTiming = startTiming();
    const result = allLeads.slice(virtualizedRange.start, virtualizedRange.end);
    endTiming();
    
    return result;
  }, [allLeads, virtualizedRange, enableVirtualization, startTiming]);

  // Leads por coluna virtualizados
  const virtualizedLeadsByColumn = useMemo(() => {
    if (!enableVirtualization) {
      return leadsByColumn;
    }

    const result: Record<string, LeadWithContacts[]> = {};
    
    Object.entries(leadsByColumn).forEach(([columnId, leads]) => {
      if (leads.length <= 50) {
        result[columnId] = leads;
      } else {
        // Para colunas com muitos leads, aplicar virtualização
        result[columnId] = leads.slice(0, 50);
      }
    });

    return result;
  }, [leadsByColumn, enableVirtualization]);

  // Prefetch de dados relacionados
  const prefetchRelatedData = useCallback(async (leadIds: string[]) => {
    if (!prefetchRelated || leadIds.length === 0) return;

    const prefetchOperations = leadIds.map(leadId => 
      queryClient.prefetchQuery({
        queryKey: ['crm-lead-detail', leadId],
        queryFn: async () => {
          const { data } = await supabase
            .from('crm_leads')
            .select(`
              *,
              responsible:profiles!crm_leads_responsible_id_fkey(id, name, email),
              column:crm_pipeline_columns!crm_leads_column_id_fkey(id, name, color),
              pipeline:crm_pipelines!crm_leads_pipeline_id_fkey(id, name),
              tags:crm_lead_tags(crm_tags(id, name, color)),
              comments:crm_lead_comments(id, content, created_at, user:profiles(name)),
              contacts:crm_lead_contacts(id, contact_type, contact_date, status)
            `)
            .eq('id', leadId)
            .single();
          return data;
        },
        staleTime: cacheTimeout
      })
    );

    await Promise.allSettled(prefetchOperations);
  }, [queryClient, prefetchRelated, cacheTimeout]);

  // Real-time subscriptions otimizadas
  useEffect(() => {
    if (!enableRealtime) return;

    console.log('🔄 [OPTIMIZED_CRM] Configurando real-time...');

    const channel = supabase
      .channel('optimized-crm-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'crm_leads',
          filter: filters.pipeline_id 
            ? `pipeline_id=eq.${filters.pipeline_id}`
            : undefined
        },
        async (payload) => {
          console.log('📡 [OPTIMIZED_CRM] Real-time update:', payload);
          
          // Throttle para evitar muitas atualizações
          const now = Date.now();
          if (now - lastFetchTime < 1000) return; // 1 segundo de throttle
          
          setLastFetchTime(now);
          
          // Invalidar cache e refetch
          await queryClient.invalidateQueries({ 
            queryKey: ['unified-crm-leads'] 
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [enableRealtime, filters.pipeline_id, queryClient, lastFetchTime]);

  // Atualizar range de virtualização
  const updateVirtualizedRange = useCallback((start: number, end: number) => {
    setVirtualizedRange({ start, end });
  }, []);

  // Otimizar cache
  const optimizeCache = useCallback(async () => {
    setIsOptimizing(true);
    
    try {
      // Limpar queries antigas
      queryClient.removeQueries({
        queryKey: ['crm'],
        predicate: (query) => {
          const age = Date.now() - (query.state.dataUpdatedAt || 0);
          return age > cacheTimeout;
        }
      });

      // Prefetch dados visíveis
      const visibleLeadIds = virtualizedLeads.map(lead => lead.id);
      await prefetchRelatedData(visibleLeadIds);
      
      console.log('🚀 [OPTIMIZED_CRM] Cache otimizado');
    } catch (error) {
      console.error('❌ [OPTIMIZED_CRM] Erro ao otimizar cache:', error);
    } finally {
      setIsOptimizing(false);
    }
  }, [queryClient, cacheTimeout, virtualizedLeads, prefetchRelatedData]);

  // Mover lead com otimizações
  const optimizedMoveLeadToColumn = useCallback(async (
    leadId: string,
    newColumnId: string
  ) => {
    const endTiming = startTiming();
    
    try {
      await moveLeadToColumn(leadId, newColumnId);
      
      // Prefetch dados da nova coluna se necessário
      const newColumnLeads = leadsByColumn[newColumnId] || [];
      if (newColumnLeads.length < 10) {
        await prefetchRelatedData([leadId]);
      }
      
    } finally {
      endTiming();
    }
  }, [moveLeadToColumn, leadsByColumn, prefetchRelatedData, startTiming]);

  // Métricas de performance
  const performanceMetrics = useMemo(() => ({
    totalLeads: allLeads.length,
    virtualizedLeads: virtualizedLeads.length,
    columnsWithData: Object.keys(leadsByColumn).length,
    isVirtualized: enableVirtualization && allLeads.length > 100,
    cacheAge: Date.now() - lastFetchTime,
    isOptimizing
  }), [
    allLeads.length,
    virtualizedLeads.length,
    leadsByColumn,
    enableVirtualization,
    lastFetchTime,
    isOptimizing
  ]);

  return {
    // Dados principais
    leadsWithContacts: enableVirtualization ? virtualizedLeads : allLeads,
    leadsByColumn: enableVirtualization ? virtualizedLeadsByColumn : leadsByColumn,
    allLeads, // Dados completos sempre disponíveis
    
    // Estados
    loading,
    error,
    isOptimizing,
    
    // Actions
    refetch,
    moveLeadToColumn: optimizedMoveLeadToColumn,
    optimizeCache,
    updateVirtualizedRange,
    
    // Métricas
    performanceMetrics,
    
    // Configurações
    options: {
      enableRealtime,
      enableVirtualization,
      cacheTimeout,
      prefetchRelated
    }
  };
};

export default useOptimizedCRMData;
