
import { useCallback, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CRMLead, CRMLeadFromDB, CRMFilters, CRMLeadContact } from '@/types/crm.types';
import { toast } from 'sonner';
import { isToday, isTomorrow, isPast } from 'date-fns';

interface LeadWithContacts extends CRMLead {
  pending_contacts: CRMLeadContact[];
  last_completed_contact?: CRMLeadContact;
}

export const useCRMData = (filters: CRMFilters = {}) => {
  const queryClient = useQueryClient();

  // Query key mais estável
  const queryKey = useMemo(() => {
    // Criar chave baseada apenas nos valores relevantes
    const key = [
      'crm-leads-with-contacts',
      filters.pipeline_id || 'no-pipeline',
      filters.column_id || 'no-column',
      filters.responsible_id || 'no-responsible',
      filters.status || 'no-status',
      filters.search || 'no-search',
      filters.contact_filter || 'no-contact-filter',
      (filters.tag_ids || []).sort().join(',') || 'no-tags'
    ];
    
    console.log('🔑 [CRM_DATA] Query key gerada:', key);
    return key;
  }, [
    filters.pipeline_id,
    filters.column_id,
    filters.responsible_id,
    filters.status,
    filters.search,
    filters.contact_filter,
    filters.tag_ids
  ]);

  const transformLeadData = useCallback((dbLead: any): CRMLead => {
    return {
      ...dbLead,
      has_company: dbLead.has_company ?? false,
      sells_on_amazon: dbLead.sells_on_amazon ?? false,
      works_with_fba: dbLead.works_with_fba ?? false,
      had_contact_with_lv: dbLead.had_contact_with_lv ?? false,
      seeks_private_label: dbLead.seeks_private_label ?? false,
      ready_to_invest_3k: dbLead.ready_to_invest_3k ?? false,
      calendly_scheduled: dbLead.calendly_scheduled ?? false,
      status: dbLead.status || 'aberto',
      phone: dbLead.phone || undefined,
      what_sells: dbLead.what_sells || undefined,
      keep_or_new_niches: dbLead.keep_or_new_niches || undefined,
      amazon_store_link: dbLead.amazon_store_link || undefined,
      amazon_state: dbLead.amazon_state || undefined,
      amazon_tax_regime: dbLead.amazon_tax_regime || undefined,
      main_doubts: dbLead.main_doubts || undefined,
      calendly_link: dbLead.calendly_link || undefined,
      pipeline_id: dbLead.pipeline_id || undefined,
      column_id: dbLead.column_id || undefined,
      responsible_id: dbLead.responsible_id || undefined,
      created_by: dbLead.created_by || undefined,
      notes: dbLead.notes || undefined,
      status_reason: dbLead.status_reason || undefined,
      status_changed_at: dbLead.status_changed_at || undefined,
      status_changed_by: dbLead.status_changed_by || undefined,
      tags: dbLead.tags?.map((tagWrapper: any) => tagWrapper.tag) || []
    };
  }, []);

  const filterLeadsByContact = useCallback((leadsData: LeadWithContacts[], contactFilter?: string) => {
    if (!contactFilter) return leadsData;

    return leadsData.filter(lead => {
      const hasPendingContacts = lead.pending_contacts.length > 0;
      
      switch (contactFilter) {
        case 'today':
          return hasPendingContacts && lead.pending_contacts.some(contact => 
            isToday(new Date(contact.contact_date))
          );
        case 'tomorrow':
          return hasPendingContacts && lead.pending_contacts.some(contact => 
            isTomorrow(new Date(contact.contact_date))
          );
        case 'overdue':
          return hasPendingContacts && lead.pending_contacts.some(contact => {
            const contactDate = new Date(contact.contact_date);
            return isPast(contactDate) && !isToday(contactDate);
          });
        case 'no_contact':
          return !hasPendingContacts;
        default:
          return true;
      }
    });
  }, []);

  // Função de fetch estabilizada e simplificada
  const fetchLeadsWithContacts = useCallback(async (): Promise<LeadWithContacts[]> => {
    console.log('🔍 [CRM_DATA] Iniciando busca de leads com filtros:', filters);
    
    // Early return se não há pipeline_id
    if (!filters.pipeline_id) {
      console.log('⚠️ [CRM_DATA] Nenhum pipeline_id fornecido, retornando array vazio');
      return [];
    }

    try {
      // Buscar leads com filtros básicos
      let leadsQuery = supabase
        .from('crm_leads')
        .select(`
          *,
          pipeline:crm_pipelines(id, name),
          column:crm_pipeline_columns(id, name, color),
          responsible:profiles!crm_leads_responsible_id_fkey(id, name, email),
          tags:crm_lead_tags(
            tag:crm_tags(id, name, color, created_at)
          )
        `)
        .eq('pipeline_id', filters.pipeline_id);

      // Aplicar filtros condicionalmente
      if (filters.column_id) {
        leadsQuery = leadsQuery.eq('column_id', filters.column_id);
      }
      
      if (filters.responsible_id) {
        leadsQuery = leadsQuery.eq('responsible_id', filters.responsible_id);
      }

      if (filters.status) {
        leadsQuery = leadsQuery.eq('status', filters.status);
      }
      
      if (filters.search) {
        leadsQuery = leadsQuery.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
      }

      const { data: leads, error: leadsError } = await leadsQuery.order('created_at', { ascending: false });

      if (leadsError) throw leadsError;

      console.log('📊 [CRM_DATA] Leads encontrados:', leads?.length || 0);

      if (!leads || leads.length === 0) {
        return [];
      }

      // Transformar leads
      const transformedLeads = leads.map(transformLeadData);
      const leadIds = transformedLeads.map(lead => lead.id);

      // Buscar contatos apenas se necessário
      const pendingContactsResult = await supabase
        .from('crm_lead_contacts')
        .select(`
          *,
          responsible:profiles!crm_lead_contacts_responsible_id_fkey(id, name, email)
        `)
        .in('lead_id', leadIds)
        .eq('status', 'pending')
        .order('contact_date', { ascending: true });

      const pendingContacts = pendingContactsResult.data || [];

      // Transformar e agrupar contatos
      const transformedPendingContacts = pendingContacts.map(contact => ({
        ...contact,
        contact_type: contact.contact_type as 'call' | 'email' | 'whatsapp' | 'meeting',
        status: contact.status as 'pending' | 'completed' | 'overdue'
      }));

      // Agrupar contatos por lead
      const pendingContactsByLead = transformedPendingContacts.reduce((acc, contact) => {
        if (!acc[contact.lead_id]) acc[contact.lead_id] = [];
        acc[contact.lead_id].push(contact);
        return acc;
      }, {} as Record<string, CRMLeadContact[]>);

      // Combinar leads com contatos
      const leadsWithContactsData: LeadWithContacts[] = transformedLeads.map(lead => ({
        ...lead,
        pending_contacts: pendingContactsByLead[lead.id] || [],
        last_completed_contact: undefined
      }));

      console.log('📊 [CRM_DATA] Leads processados com contatos:', leadsWithContactsData.length);
      return filterLeadsByContact(leadsWithContactsData, filters.contact_filter);

    } catch (error) {
      console.error('❌ [CRM_DATA] Erro ao buscar dados CRM:', error);
      toast.error('Erro ao carregar dados do CRM');
      return [];
    }
  }, [filters.pipeline_id, filters.column_id, filters.responsible_id, filters.status, filters.search, filters.contact_filter, transformLeadData, filterLeadsByContact]);

  const { data: leadsWithContacts = [], isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: fetchLeadsWithContacts,
    enabled: !!filters.pipeline_id,
    staleTime: 60000, // 1 minuto
    gcTime: 300000, // 5 minutos
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const moveLeadToColumn = useCallback(async (leadId: string, newColumnId: string) => {
    try {
      const { error } = await supabase
        .from('crm_leads')
        .update({ column_id: newColumnId })
        .eq('id', leadId);

      if (error) throw error;

      // Invalidar cache para atualizar dados
      queryClient.invalidateQueries({ queryKey: ['crm-leads-with-contacts'] });
      toast.success('Lead movido com sucesso');
    } catch (error) {
      toast.error('Erro ao mover lead');
      throw error;
    }
  }, [queryClient]);

  const leadsByColumn = useMemo(() => {
    const grouped: Record<string, LeadWithContacts[]> = {};
    leadsWithContacts.forEach(lead => {
      if (lead.column_id) {
        if (!grouped[lead.column_id]) grouped[lead.column_id] = [];
        grouped[lead.column_id].push(lead);
      }
    });
    
    console.log('📊 [CRM_DATA] Leads agrupados por coluna:', Object.keys(grouped).length);
    return grouped;
  }, [leadsWithContacts]);

  return {
    leadsWithContacts,
    leadsByColumn,
    loading: isLoading,
    error,
    refetch,
    moveLeadToColumn
  };
};
