
import { useCallback, useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getIntelligentCacheManager } from '@/services/cache/IntelligentCacheManager';
import { LeadWithContacts, CRMFilters, CRMPipelineColumn } from '@/types/crm.types';

export const useIntelligentCRMCache = () => {
  const queryClient = useQueryClient();
  const cacheManager = useRef(getIntelligentCacheManager(queryClient));

  // Auto-salvar estado do Kanban
  const saveKanbanState = useCallback((state: {
    selectedPipelineId: string | null;
    filters: CRMFilters;
    viewMode: 'kanban' | 'list';
  }) => {
    cacheManager.current.savePersistentState({
      kanbanState: {
        ...state,
        columnWidths: {} // Pode ser expandido posteriormente
      }
    });
  }, []);

  // Carregar estado do Kanban
  const loadKanbanState = useCallback(() => {
    const state = cacheManager.current.loadPersistentState();
    return state.kanbanState;
  }, []);

  // Cache otimizado para leads por coluna
  const cacheLeadsByColumn = useCallback((pipelineId: string, data: Record<string, LeadWithContacts[]>) => {
    cacheManager.current.cacheLeadsByColumn(pipelineId, data);
  }, []);

  const getCachedLeadsByColumn = useCallback((pipelineId: string) => {
    return cacheManager.current.getCachedLeadsByColumn(pipelineId);
  }, []);

  // Cache para colunas
  const cacheColumns = useCallback((pipelineId: string, columns: CRMPipelineColumn[]) => {
    cacheManager.current.cacheColumns(pipelineId, columns);
  }, []);

  const getCachedColumns = useCallback((pipelineId: string) => {
    return cacheManager.current.getCachedColumns(pipelineId);
  }, []);

  // Operações offline
  const addOfflineOperation = useCallback((operation: {
    type: 'move_lead' | 'update_lead' | 'create_lead' | 'delete_lead';
    data: any;
  }) => {
    cacheManager.current.addToOfflineQueue(operation);
  }, []);

  // Invalidação inteligente
  const invalidateLeadData = useCallback((leadId: string) => {
    cacheManager.current.invalidateLeadData(leadId);
  }, []);

  const invalidatePipelineData = useCallback((pipelineId: string) => {
    cacheManager.current.invalidatePipelineData(pipelineId);
  }, []);

  // Prefetch inteligente
  const prefetchCriticalData = useCallback((pipelineId: string) => {
    cacheManager.current.prefetchCriticalData(pipelineId);
  }, []);

  // Métricas
  const getCacheStats = useCallback(() => {
    return cacheManager.current.getStats();
  }, []);

  // Limpeza e manutenção
  const cleanupCache = useCallback(() => {
    cacheManager.current.cleanup();
  }, []);

  const clearCache = useCallback(() => {
    cacheManager.current.clear();
  }, []);

  // Processar queue offline quando houver conectividade
  const processOfflineQueue = useCallback(async () => {
    await cacheManager.current.processOfflineQueue();
  }, []);

  // Auto-processar queue quando componente monta (se online)
  useEffect(() => {
    if (navigator.onLine) {
      processOfflineQueue();
    }
  }, [processOfflineQueue]);

  // Processar queue quando voltar online
  useEffect(() => {
    const handleOnline = () => {
      processOfflineQueue();
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [processOfflineQueue]);

  // Log de estatísticas em desenvolvimento
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const interval = setInterval(() => {
        const stats = getCacheStats();
        console.log('📊 [CACHE_STATS]', stats);
      }, 30000); // A cada 30 segundos

      return () => clearInterval(interval);
    }
  }, [getCacheStats]);

  return {
    // Estado persistente
    saveKanbanState,
    loadKanbanState,
    
    // Cache de dados
    cacheLeadsByColumn,
    getCachedLeadsByColumn,
    cacheColumns,
    getCachedColumns,
    
    // Operações offline
    addOfflineOperation,
    processOfflineQueue,
    
    // Invalidação
    invalidateLeadData,
    invalidatePipelineData,
    
    // Otimizações
    prefetchCriticalData,
    
    // Manutenção
    getCacheStats,
    cleanupCache,
    clearCache
  };
};
