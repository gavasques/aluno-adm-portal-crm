
import { supabase } from '@/integrations/supabase/client';
import { CRMFilters, LeadWithContacts } from '@/types/crm.types';
import { debugLogger } from '@/utils/debug-logger';

export const crmOperations = {
  async getLeadsWithContacts(filters: CRMFilters = {}): Promise<LeadWithContacts[]> {
    debugLogger.info('📊 [CRM_OPERATIONS] Buscando leads com contatos:', filters);

    try {
      let query = supabase
        .from('crm_leads')
        .select(`
          *,
          tags:crm_lead_tags(crm_tags(id, name, color)),
          pipeline:crm_pipelines(id, name),
          column:crm_pipeline_columns(id, name, color),
          loss_reason:crm_loss_reasons(id, name),
          responsible:profiles!crm_leads_responsible_id_fkey(id, name, email),
          pending_contacts:crm_lead_contacts!inner(
            id, contact_type, contact_date, status, contact_reason,
            responsible:profiles!crm_lead_contacts_responsible_id_fkey(id, name, email)
          ),
          last_completed_contact:crm_lead_contacts!left(
            id, contact_type, contact_date, status, completed_at,
            responsible:profiles!crm_lead_contacts_responsible_id_fkey(id, name, email)
          )
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
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) {
        debugLogger.error('❌ [CRM_OPERATIONS] Erro ao buscar leads:', error);
        throw error;
      }

      const processedLeads = (data || []).map(lead => ({
        ...lead,
        tags: lead.tags?.map((tagRel: any) => tagRel.crm_tags) || [],
        pending_contacts: lead.pending_contacts?.filter((contact: any) => contact.status === 'pending') || [],
        last_completed_contact: lead.last_completed_contact?.find((contact: any) => contact.status === 'completed') || undefined
      })) as LeadWithContacts[];

      debugLogger.info('✅ [CRM_OPERATIONS] Leads carregados:', { 
        count: processedLeads.length 
      });
      return processedLeads;

    } catch (error) {
      debugLogger.error('❌ [CRM_OPERATIONS] Erro:', error);
      throw error;
    }
  }
};
