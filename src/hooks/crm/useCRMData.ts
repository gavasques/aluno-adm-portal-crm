
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CRMFilters, CRMLead, LeadWithContacts } from '@/types/crm.types';
import { debugLogger } from '@/utils/debug-logger';

export const useCRMData = (filters: CRMFilters = {}) => {
  const {
    data: leads = [],
    isLoading: loading,
    error,
    refetch
  } = useQuery({
    queryKey: ['crm-leads', filters],
    queryFn: async () => {
      debugLogger.info('📊 [CRM_DATA] Buscando leads com filtros:', filters);

      try {
        let query = supabase
          .from('crm_leads')
          .select(`
            *,
            tags:crm_lead_tags(crm_tags(id, name, color)),
            pipeline:crm_pipelines(id, name),
            column:crm_pipeline_columns(id, name, color),
            loss_reason:crm_loss_reasons(id, name),
            responsible:profiles!crm_leads_responsible_id_fkey(id, name, email)
          `)
          .order('created_at', { ascending: false });

        // Aplicar filtros
        if (filters.pipeline_id) {
          query = query.eq('pipeline_id', filters.pipeline_id);
        }
        if (filters.column_id) {
          query = query.eq('column_id', filters.column_id);
        }
        if (filters.responsible_id) {
          query = query.eq('responsible_id', filters.responsible_id);
        }
        if (filters.search) {
          query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
        }

        const { data, error } = await query;

        if (error) {
          debugLogger.error('❌ [CRM_DATA] Erro ao buscar leads:', error);
          throw error;
        }

        const processedLeads = (data || []).map(lead => ({
          ...lead,
          tags: lead.tags?.map((tagRel: any) => tagRel.crm_tags) || [],
          pending_contacts: [],
          last_completed_contact: undefined
        })) as LeadWithContacts[];

        debugLogger.info('✅ [CRM_DATA] Leads carregados:', { 
          count: processedLeads.length 
        });

        return processedLeads;

      } catch (error) {
        debugLogger.error('❌ [CRM_DATA] Erro:', error);
        throw error;
      }
    },
    staleTime: 30000
  });

  return {
    leads,
    leadsWithContacts: leads,
    loading,
    error,
    refetch
  };
};
