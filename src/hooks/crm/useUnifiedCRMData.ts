
import React, { useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CRMLead, CRMFilters, CRMLeadContact, LeadWithContacts } from '@/types/crm.types';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useCRMDataTransformService } from './services/useCRMDataTransformService';
import { useCRMLeadFilters } from './useCRMLeadFilters';
import { useIntelligentCache } from './useIntelligentCache';
import { measureAsyncOperation } from '@/utils/performanceMonitor';

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

  const fetchUnifiedLeadsData = useCallback(async (): Promise<LeadWithContacts[]> => {
    if (!debouncedFilters.pipeline_id) {
      console.log('⚠️ [UNIFIED_CRM] Nenhum pipeline_id fornecido, aguardando seleção...');
      return [];
    }

    return await measureAsyncOperation('fetch_unified_leads_data', async () => {
      try {
        console.log('📊 [UNIFIED_CRM] Buscando leads simplificado para pipeline:', debouncedFilters.pipeline_id);

        // Query SUPER SIMPLIFICADA - apenas a tabela de leads
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

        console.log('🔍 [UNIFIED_CRM] Executando query simplificada...');

        const { data: leads, error: leadsError } = await leadsQuery
          .order('created_at', { ascending: false });

        if (leadsError) {
          console.error('❌ [UNIFIED_CRM] Erro na query de leads:', leadsError);
          throw leadsError;
        }

        console.log('📊 [UNIFIED_CRM] Leads encontrados:', leads?.length || 0);

        if (!leads || leads.length === 0) {
          return [];
        }

        // Buscar dados relacionados SEPARADAMENTE para evitar JOINs
        const leadIds = leads.map(lead => lead.id);

        // Buscar pipelines
        const { data: pipelines } = await supabase
          .from('crm_pipelines')
          .select('*');

        // Buscar colunas
        const { data: columns } = await supabase
          .from('crm_pipeline_columns')
          .select('*');

        // Buscar responsáveis
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, name, email');

        // Buscar tags dos leads
        const { data: leadTags } = await supabase
          .from('crm_lead_tags')
          .select(`
            lead_id,
            tag:crm_tags(id, name, color, created_at)
          `)
          .in('lead_id', leadIds);

        // Buscar contatos pendentes
        const { data: pendingContacts } = await supabase
          .from('crm_lead_contacts')
          .select('*')
          .in('lead_id', leadIds)
          .eq('status', 'pending')
          .order('contact_date', { ascending: true });

        // Buscar último contato completado
        const { data: completedContacts } = await supabase
          .from('crm_lead_contacts')
          .select('*')
          .in('lead_id', leadIds)
          .eq('status', 'completed')
          .not('completed_at', 'is', null)
          .order('completed_at', { ascending: false });

        console.log('🔗 [UNIFIED_CRM] Dados relacionados carregados:', {
          pipelines: pipelines?.length || 0,
          columns: columns?.length || 0,
          profiles: profiles?.length || 0,
          leadTags: leadTags?.length || 0,
          pendingContacts: pendingContacts?.length || 0,
          completedContacts: completedContacts?.length || 0
        });

        // Criar mapas para facilitar a busca
        const pipelinesMap = new Map(pipelines?.map(p => [p.id, p]) || []);
        const columnsMap = new Map(columns?.map(c => [c.id, c]) || []);
        const profilesMap = new Map(profiles?.map(p => [p.id, p]) || []);
        
        // Agrupar tags por lead
        const tagsByLead = leadTags?.reduce((acc, item) => {
          if (!acc[item.lead_id]) acc[item.lead_id] = [];
          acc[item.lead_id].push(item.tag);
          return acc;
        }, {} as Record<string, any[]>) || {};

        // Agrupar contatos por lead
        const pendingContactsByLead = pendingContacts?.reduce((acc, contact) => {
          if (!acc[contact.lead_id]) acc[contact.lead_id] = [];
          acc[contact.lead_id].push({
            ...contact,
            responsible: profilesMap.get(contact.responsible_id)
          });
          return acc;
        }, {} as Record<string, any[]>) || {};

        const lastCompletedContactsByLead = completedContacts?.reduce((acc, contact) => {
          if (!acc[contact.lead_id]) {
            acc[contact.lead_id] = {
              ...contact,
              responsible: profilesMap.get(contact.responsible_id)
            };
          }
          return acc;
        }, {} as Record<string, any>) || {};

        // Montar leads com dados relacionados
        const leadsWithContactsData: LeadWithContacts[] = leads.map(lead => ({
          ...lead,
          pipeline: pipelinesMap.get(lead.pipeline_id),
          column: columnsMap.get(lead.column_id),
          responsible: profilesMap.get(lead.responsible_id),
          tags: tagsByLead[lead.id] || [],
          pending_contacts: pendingContactsByLead[lead.id] || [],
          last_completed_contact: lastCompletedContactsByLead[lead.id]
        }));

        // Aplicar filtros usando services
        let filteredLeads = filterLeadsByContact(leadsWithContactsData, debouncedFilters.contact_filter);
        filteredLeads = filterLeadsByTags(filteredLeads, debouncedFilters.tag_ids);

        console.log('✅ [UNIFIED_CRM] Leads processados com sucesso:', filteredLeads.length);
        
        return filteredLeads;

      } catch (error) {
        console.error('❌ [UNIFIED_CRM] Erro ao buscar dados CRM:', error);
        throw error;
      }
    });
  }, [debouncedFilters, transformLeadData, filterLeadsByContact, filterLeadsByTags]);

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
    
    console.log('📊 [UNIFIED_CRM] Leads agrupados por coluna:', {
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
