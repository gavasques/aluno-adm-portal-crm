
import { useCallback, useEffect } from 'react';
import { useCRMContext, useCRMActions, useCRMState } from '@/contexts/CRMContext';
import { useCRMRealtime } from './useCRMRealtime';
import { useUnifiedCRMData } from './useUnifiedCRMData';
import { useCRMPipelines } from './useCRMPipelines';
import { useQueryClient } from '@tanstack/react-query';
import { getCRMCacheManager } from '@/services/crm/CRMCacheManager';
import { CRMFilters, LeadWithContacts } from '@/types/crm.types';

interface UseCRMStateManagerOptions {
  enableRealtime?: boolean;
  enableCacheOptimization?: boolean;
  autoCleanup?: boolean;
}

/**
 * Hook principal para gerenciar todo o estado do CRM
 * Integra:
 * - Estado global via Context
 * - Cache unificado via React Query
 * - Real-time sync via Supabase
 * - Otimizações de performance
 */
export const useCRMStateManager = (options: UseCRMStateManagerOptions = {}) => {
  const {
    enableRealtime = true,
    enableCacheOptimization = true,
    autoCleanup = true
  } = options;

  const state = useCRMState();
  const actions = useCRMActions();
  const queryClient = useQueryClient();
  const cacheManager = getCRMCacheManager(queryClient);

  // Buscar pipelines
  const { 
    pipelines, 
    columns, 
    loading: pipelinesLoading 
  } = useCRMPipelines();

  // Buscar leads unificados
  const {
    leadsWithContacts,
    leadsByColumn,
    loading: leadsLoading,
    error: leadsError,
    refetch: refetchLeads
  } = useUnifiedCRMData(state.filters);

  // Real-time sync
  useCRMRealtime({
    pipelineId: state.selectedPipelineId || undefined,
    onLeadUpdate: useCallback((lead: LeadWithContacts) => {
      console.log('🔄 [STATE_MANAGER] Lead updated via realtime:', lead.id);
      actions.updateLead(lead);
    }, [actions]),
    
    onLeadMove: useCallback((leadId: string, newColumnId: string) => {
      console.log('🚀 [STATE_MANAGER] Lead moved via realtime:', { leadId, newColumnId });
      actions.moveLead(leadId, newColumnId);
    }, [actions]),
    
    onCommentAdded: useCallback((leadId: string) => {
      console.log('💬 [STATE_MANAGER] Comment added via realtime:', leadId);
      // O cache será invalidado automaticamente pelo real-time hook
    }, []),
    
    onContactUpdate: useCallback((leadId: string) => {
      console.log('📞 [STATE_MANAGER] Contact updated via realtime:', leadId);
      // O cache será invalidado automaticamente pelo real-time hook
    }, [])
  });

  // Sincronizar dados com o estado global
  useEffect(() => {
    if (pipelines.length > 0 && state.pipelines.length === 0) {
      console.log('📊 [STATE_MANAGER] Sincronizando pipelines:', pipelines.length);
      actions.setPipelines(pipelines);
    }
  }, [pipelines, state.pipelines.length, actions]);

  useEffect(() => {
    if (columns.length > 0 && state.columns.length === 0) {
      console.log('📊 [STATE_MANAGER] Sincronizando colunas:', columns.length);
      actions.setColumns(columns);
    }
  }, [columns, state.columns.length, actions]);

  useEffect(() => {
    if (leadsWithContacts.length >= 0) {
      console.log('📊 [STATE_MANAGER] Sincronizando leads:', leadsWithContacts.length);
      actions.setLeads(leadsWithContacts);
    }
  }, [leadsWithContacts, actions]);

  useEffect(() => {
    if (Object.keys(leadsByColumn).length >= 0) {
      console.log('📊 [STATE_MANAGER] Sincronizando leads por coluna:', Object.keys(leadsByColumn).length);
      actions.setLeadsByColumn(leadsByColumn);
    }
  }, [leadsByColumn, actions]);

  // Gerenciar estados de loading
  useEffect(() => {
    const isLoading = pipelinesLoading || leadsLoading;
    if (state.isLoading !== isLoading) {
      actions.setLoading(isLoading);
    }
  }, [pipelinesLoading, leadsLoading, state.isLoading, actions]);

  // Gerenciar erros
  useEffect(() => {
    if (leadsError && state.error !== leadsError.message) {
      actions.setError(leadsError.message);
    } else if (!leadsError && state.error) {
      actions.setError(null);
    }
  }, [leadsError, state.error, actions]);

  // Limpeza automática de cache
  useEffect(() => {
    if (!autoCleanup || !enableCacheOptimization) return;

    const cleanupInterval = setInterval(() => {
      cacheManager.cleanupStaleCache();
    }, 10 * 60 * 1000); // 10 minutos

    return () => clearInterval(cleanupInterval);
  }, [autoCleanup, enableCacheOptimization, cacheManager]);

  // Actions unificadas
  const unifiedActions = {
    // Filtros
    setFilters: useCallback((filters: Partial<CRMFilters>) => {
      console.log('🔍 [STATE_MANAGER] Atualizando filtros:', filters);
      actions.setFilters(filters);
    }, [actions]),

    setSelectedPipeline: useCallback((pipelineId: string | null) => {
      console.log('📋 [STATE_MANAGER] Selecionando pipeline:', pipelineId);
      actions.setSelectedPipeline(pipelineId);
    }, [actions]),

    // Leads
    updateLead: useCallback(async (lead: LeadWithContacts) => {
      console.log('📝 [STATE_MANAGER] Atualizando lead:', lead.id);
      
      // Update otimista
      actions.updateLead(lead);
      
      // Invalidar cache
      if (enableCacheOptimization) {
        await cacheManager.invalidateLeadData(lead.id);
      }
    }, [actions, enableCacheOptimization, cacheManager]),

    moveLead: useCallback(async (leadId: string, newColumnId: string) => {
      console.log('🚀 [STATE_MANAGER] Movendo lead:', { leadId, newColumnId });
      
      // Update otimista
      actions.moveLead(leadId, newColumnId);
      
      // Invalidar cache relacionado
      if (enableCacheOptimization) {
        const lead = state.leadsWithContacts.find(l => l.id === leadId);
        if (lead) {
          await cacheManager.invalidateLeadMovement(
            leadId,
            lead.column_id || '',
            newColumnId,
            lead.pipeline_id || ''
          );
        }
      }
    }, [actions, state.leadsWithContacts, enableCacheOptimization, cacheManager]),

    removeLead: useCallback(async (leadId: string) => {
      console.log('🗑️ [STATE_MANAGER] Removendo lead:', leadId);
      
      // Update otimista
      actions.removeLead(leadId);
      
      // Invalidar cache
      if (enableCacheOptimization) {
        await cacheManager.invalidateLeadData(leadId);
      }
    }, [actions, enableCacheOptimization, cacheManager]),

    // UI
    setSelectedLead: actions.setSelectedLead,
    setDragging: actions.setDragging,
    setFormOpen: actions.setFormOpen,
    setDetailOpen: actions.setDetailOpen,

    // Cache
    invalidateCache: useCallback(async (type?: 'leads' | 'pipelines' | 'all') => {
      console.log('🔄 [STATE_MANAGER] Invalidando cache:', type);
      
      switch (type) {
        case 'leads':
          await queryClient.invalidateQueries({ queryKey: ['crm', 'leads'] });
          break;
        case 'pipelines':
          await queryClient.invalidateQueries({ queryKey: ['crm', 'pipelines'] });
          break;
        default:
          await queryClient.invalidateQueries({ queryKey: ['crm'] });
      }
    }, [queryClient]),

    prefetchLead: useCallback(async (leadId: string) => {
      if (enableCacheOptimization) {
        await cacheManager.prefetchLeadData(leadId);
      }
    }, [enableCacheOptimization, cacheManager]),

    // Refresh
    refreshData: useCallback(async () => {
      console.log('🔄 [STATE_MANAGER] Refreshing all data');
      actions.refreshData();
      await refetchLeads();
    }, [actions, refetchLeads]),

    // Métricas
    getCacheMetrics: useCallback(() => {
      return cacheManager.getCacheMetrics();
    }, [cacheManager])
  };

  // Log de estado para debug
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 [STATE_MANAGER] Estado atual:', {
        leads: state.leadsWithContacts.length,
        columns: Object.keys(state.leadsByColumn).length,
        selectedPipeline: state.selectedPipelineId,
        isLoading: state.isLoading,
        connectionStatus: state.connectionStatus,
        lastUpdate: new Date(state.lastUpdate).toLocaleTimeString()
      });
    }
  }, [state]);

  return {
    // Estado
    state,
    
    // Actions unificadas
    actions: unifiedActions,
    
    // Status
    isLoading: state.isLoading,
    error: state.error,
    connectionStatus: state.connectionStatus,
    
    // Métricas
    metrics: {
      totalLeads: state.leadsWithContacts.length,
      totalColumns: Object.keys(state.leadsByColumn).length,
      lastUpdate: state.lastUpdate
    }
  };
};

export default useCRMStateManager;
