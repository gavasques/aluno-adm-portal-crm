
import React, { useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CRMLead, CRMFilters, CRMLeadContact, LeadWithContacts, LeadStatus } from '@/types/crm.types';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useCRMDataTransformService } from './services/useCRMDataTransformService';
import { useCRMLeadFilters } from './useCRMLeadFilters';
import { useIntelligentCache } from './useIntelligentCache';
import { measureAsyncOperation } from '@/utils/performanceMonitor';
import { debugLogger } from '@/utils/debug-logger';

export const useUnifiedCRMData = (filters: CRMFilters = {}) => {
  // Debounce search para evitar queries excessivas
  const [debouncedSearch] = useDebouncedValue(filters.search || '', 300);
  const debouncedFilters = { ...filters, search: debouncedSearch };

  // Services para transformação e filtros
  const { transformLeadData } = useCRMDataTransformService();
  const { filterLeadsByContact, filterLeadsByTags } = useCRMLeadFilters();
  const { getCacheStrategy, optimizeCache } = useIntelligentCache();

  // Estratégia de cache inteligente
  const cacheStrategy = getCacheStrategy('unified-crm-leads', debouncedFilters);

  // Função para validar e converter status
  const validateLeadStatus = (status: string): LeadStatus => {
    const validStatuses: LeadStatus[] = ['aberto', 'ganho', 'perdido'];
    return validStatuses.includes(status as LeadStatus) ? (status as LeadStatus) : 'aberto';
  };

  const fetchUnifiedLeadsData = useCallback(async (): Promise<LeadWithContacts[]> => {
    if (!debouncedFilters.pipeline_id) {
      debugLogger.info('⚠️ [UNIFIED_CRM] Nenhum pipeline_id fornecido, aguardando seleção...', {
        component: 'useUnifiedCRMData',
        operation: 'fetchUnifiedLeadsData'
      });
      return [];
    }

    return await measureAsyncOperation('fetch_unified_leads_data', async () => {
      try {
        debugLogger.info('📊 [UNIFIED_CRM] Buscando leads ULTRA SIMPLIFICADO para pipeline', {
          component: 'useUnifiedCRMData',
          operation: 'fetchUnifiedLeadsData',
          pipelineId: debouncedFilters.pipeline_id
        });

        // QUERY ULTRA SIMPLIFICADA - apenas leads básicos
        let leadsQuery = supabase
          .from('crm_leads')
          .select('*')
          .eq('pipeline_id', debouncedFilters.pipeline_id);

        // Aplicar filtros condicionalmente
        if (debouncedFilters.column_id) {
          leadsQuery = leadsQuery.eq('column_id', debouncedFilters.column_id);
        }
        
        if (debouncedFilters.responsible_id) {
          leadsQuery = leadsQuery.eq('responsible_id', debouncedFilters.responsible_id);
        }

        if (debouncedFilters.status) {
          leadsQuery = leadsQuery.eq('status', debouncedFilters.status);
        }
        
        if (debouncedFilters.search) {
          leadsQuery = leadsQuery.or(`name.ilike.%${debouncedFilters.search}%,email.ilike.%${debouncedFilters.search}%`);
        }

        debugLogger.info('🔍 [UNIFIED_CRM] Executando query ultra simplificada...', {
          component: 'useUnifiedCRMData',
          operation: 'executeQuery'
        });

        const { data: leads, error: leadsError } = await leadsQuery
          .order('created_at', { ascending: false });

        if (leadsError) {
          debugLogger.error('❌ [UNIFIED_CRM] Erro na query de leads', {
            component: 'useUnifiedCRMData',
            operation: 'fetchLeads',
            error: leadsError
          });
          throw leadsError;
        }

        debugLogger.info('📊 [UNIFIED_CRM] Leads encontrados', {
          component: 'useUnifiedCRMData',
          operation: 'fetchLeads',
          leadsCount: leads?.length || 0
        });

        if (!leads || leads.length === 0) {
          return [];
        }

        // Buscar dados relacionados SEPARADAMENTE - SEM JOINS
        const leadIds = leads.map(lead => lead.id);

        // Buscar pipelines simples
        const { data: pipelines } = await supabase
          .from('crm_pipelines')
          .select('id, name, description, is_active, sort_order, created_at, updated_at');

        // Buscar colunas simples
        const { data: columns } = await supabase
          .from('crm_pipeline_columns')
          .select('id, name, color, pipeline_id, sort_order, is_active, created_at, updated_at');

        // Buscar responsáveis simples
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, name, email');

        debugLogger.info('🔗 [UNIFIED_CRM] Dados relacionados simples carregados', {
          component: 'useUnifiedCRMData',
          operation: 'fetchRelatedData',
          pipelines: pipelines?.length || 0,
          columns: columns?.length || 0,
          profiles: profiles?.length || 0
        });

        // Criar mapas simples para facilitar a busca
        const pipelinesMap = new Map(pipelines?.map(p => [p.id, p]) || []);
        const columnsMap = new Map(columns?.map(c => [c.id, c]) || []);
        const profilesMap = new Map(profiles?.map(p => [p.id, p]) || []);

        // Montar leads com dados relacionados básicos
        const leadsWithContactsData: LeadWithContacts[] = leads.map(lead => ({
          ...lead,
          status: validateLeadStatus(lead.status),
          pipeline: pipelinesMap.get(lead.pipeline_id),
          column: columnsMap.get(lead.column_id),
          responsible: profilesMap.get(lead.responsible_id),
          tags: [], // Simplificado - sem tags por enquanto
          pending_contacts: [], // Simplificado - sem contatos por enquanto
          last_completed_contact: undefined // Simplificado
        }));

        // Aplicar filtros usando services (simplificado)
        let filteredLeads = leadsWithContactsData;
        if (debouncedFilters.tag_ids && debouncedFilters.tag_ids.length > 0) {
          // Para filtros de tag, simplesmente retornar todos por enquanto
          filteredLeads = leadsWithContactsData;
        }

        debugLogger.info('✅ [UNIFIED_CRM] Leads processados com sucesso (simplificado)', {
          component: 'useUnifiedCRMData',
          operation: 'processLeads',
          filteredCount: filteredLeads.length
        });
        
        return filteredLeads;

      } catch (error) {
        debugLogger.error('❌ [UNIFIED_CRM] Erro ao buscar dados CRM', {
          component: 'useUnifiedCRMData',
          operation: 'fetchUnifiedLeadsData',
          error: error instanceof Error ? error.message : String(error)
        });
        throw error;
      }
    });
  }, [debouncedFilters, transformLeadData, filterLeadsByContact, filterLeadsByTags, validateLeadStatus]);

  const { data: leadsWithContacts = [], isLoading, error, refetch } = useQuery({
    queryKey: ['unified-crm-leads', debouncedFilters],
    queryFn: fetchUnifiedLeadsData,
    enabled: true,
    ...cacheStrategy,
  });

  // Agrupar leads por coluna de forma memoizada com otimização
  const leadsByColumn = useMemo(() => {
    const grouped: Record<string, LeadWithContacts[]> = {};
    
    leadsWithContacts.forEach(lead => {
      if (lead.column_id) {
        if (!grouped[lead.column_id]) grouped[lead.column_id] = [];
        grouped[lead.column_id].push(lead);
      }
    });
    
    debugLogger.info('📊 [UNIFIED_CRM] Leads agrupados por coluna (simplificado)', {
      component: 'useUnifiedCRMData',
      operation: 'groupLeadsByColumn',
      totalColumns: Object.keys(grouped).length,
      distribution: Object.entries(grouped).map(([columnId, leads]) => ({
        columnId,
        count: leads.length
      }))
    });
    
    return grouped;
  }, [leadsWithContacts]);

  // Otimizar cache quando os dados estiverem prontos
  React.useEffect(() => {
    if (leadsWithContacts.length > 0 && !isLoading) {
      optimizeCache(leadsWithContacts);
    }
  }, [leadsWithContacts, isLoading, optimizeCache]);

  return {
    leadsWithContacts,
    leadsByColumn,
    loading: isLoading,
    error,
    refetch
  };
};
