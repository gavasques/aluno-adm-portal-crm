
import { useCallback, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CRMLead, CRMFilters, CRMLeadContact } from '@/types/crm.types';
import { toast } from 'sonner';
import { isToday, isTomorrow, isPast } from 'date-fns';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

interface LeadWithContacts extends CRMLead {
  pending_contacts: CRMLeadContact[];
  last_completed_contact?: CRMLeadContact;
}

export const useOptimizedCRMData = (filters: CRMFilters = {}) => {
  const queryClient = useQueryClient();
  
  // Debounce search para evitar queries excessivas
  const [debouncedSearch] = useDebouncedValue(filters.search || '', 300);
  const debouncedFilters = { ...filters, search: debouncedSearch };

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

  const filterLeadsByTags = useCallback((leadsData: LeadWithContacts[], tagIds?: string[]) => {
    if (!tagIds || tagIds.length === 0) return leadsData;

    return leadsData.filter(lead => {
      const leadTagIds = lead.tags?.map(tag => tag.id) || [];
      return tagIds.some(tagId => leadTagIds.includes(tagId));
    });
  }, []);

  const fetchLeadsWithContacts = useCallback(async (): Promise<LeadWithContacts[]> => {
    if (!debouncedFilters.pipeline_id) {
      console.log('⚠️ Nenhum pipeline_id fornecido, aguardando seleção...');
      return [];
    }

    try {
      console.log('📊 Buscando leads otimizado para pipeline:', debouncedFilters.pipeline_id);

      // Query otimizada para leads
      let leadsQuery = supabase
        .from('crm_leads')
        .select(`
          id, name, email, phone, has_company, sells_on_amazon, works_with_fba,
          had_contact_with_lv, seeks_private_label, ready_to_invest_3k,
          calendly_scheduled, what_sells, keep_or_new_niches, amazon_store_link,
          amazon_state, amazon_tax_regime, main_doubts, calendly_link,
          pipeline_id, column_id, responsible_id, created_by, notes,
          scheduled_contact_date, created_at, updated_at,
          pipeline:crm_pipelines(id, name),
          column:crm_pipeline_columns(id, name, color),
          responsible:profiles!crm_leads_responsible_id_fkey(id, name, email),
          tags:crm_lead_tags(
            tag:crm_tags(id, name, color, created_at)
          )
        `)
        .eq('pipeline_id', debouncedFilters.pipeline_id);

      if (debouncedFilters.column_id) {
        leadsQuery = leadsQuery.eq('column_id', debouncedFilters.column_id);
      }
      
      if (debouncedFilters.responsible_id) {
        leadsQuery = leadsQuery.eq('responsible_id', debouncedFilters.responsible_id);
      }
      
      if (debouncedFilters.search) {
        leadsQuery = leadsQuery.or(`name.ilike.%${debouncedFilters.search}%,email.ilike.%${debouncedFilters.search}%`);
      }

      // Executar queries em paralelo
      const [leadsResult, pendingContactsResult, completedContactsResult] = await Promise.allSettled([
        leadsQuery.order('created_at', { ascending: false }),
        
        supabase
          .from('crm_lead_contacts')
          .select(`
            id, lead_id, contact_type, contact_reason, contact_date, status,
            notes, responsible_id, completed_by, completed_at, created_at, updated_at,
            responsible:profiles!crm_lead_contacts_responsible_id_fkey(id, name, email)
          `)
          .eq('status', 'pending')
          .order('contact_date', { ascending: true }),
        
        supabase
          .from('crm_lead_contacts')
          .select(`
            id, lead_id, contact_type, contact_reason, contact_date, status,
            notes, responsible_id, completed_by, completed_at, created_at, updated_at,
            responsible:profiles!crm_lead_contacts_responsible_id_fkey(id, name, email)
          `)
          .eq('status', 'completed')
          .not('completed_at', 'is', null)
          .order('completed_at', { ascending: false })
      ]);

      if (leadsResult.status === 'rejected') {
        throw leadsResult.reason;
      }

      const { data: leads, error: leadsError } = leadsResult.value;
      if (leadsError) throw leadsError;

      console.log('📊 Leads encontrados:', leads?.length || 0);

      if (!leads || leads.length === 0) {
        return [];
      }

      // Transformar leads
      const transformedLeads = leads.map(transformLeadData);
      const leadIds = transformedLeads.map(lead => lead.id);

      // Processar contatos
      const pendingContacts = pendingContactsResult.status === 'fulfilled' ? 
        (pendingContactsResult.value.data || []).filter(contact => 
          leadIds.includes(contact.lead_id) && contact.status === 'pending'
        ).map(contact => ({
          ...contact,
          contact_type: contact.contact_type as 'call' | 'email' | 'whatsapp' | 'meeting',
          status: contact.status as 'pending' | 'completed' | 'overdue'
        })) : [];

      const completedContacts = completedContactsResult.status === 'fulfilled' ? 
        (completedContactsResult.value.data || []).filter(contact => 
          leadIds.includes(contact.lead_id) && contact.status === 'completed' && contact.completed_at
        ).map(contact => ({
          ...contact,
          contact_type: contact.contact_type as 'call' | 'email' | 'whatsapp' | 'meeting',
          status: contact.status as 'pending' | 'completed' | 'overdue'
        })) : [];

      // Agrupar contatos por lead
      const pendingContactsByLead = pendingContacts.reduce((acc, contact) => {
        if (!acc[contact.lead_id]) acc[contact.lead_id] = [];
        acc[contact.lead_id].push(contact);
        return acc;
      }, {} as Record<string, CRMLeadContact[]>);

      const lastCompletedContactsByLead = completedContacts.reduce((acc, contact) => {
        if (!acc[contact.lead_id]) {
          acc[contact.lead_id] = contact;
        }
        return acc;
      }, {} as Record<string, CRMLeadContact>);

      // Combinar leads com contatos
      let leadsWithContactsData: LeadWithContacts[] = transformedLeads.map(lead => ({
        ...lead,
        pending_contacts: pendingContactsByLead[lead.id] || [],
        last_completed_contact: lastCompletedContactsByLead[lead.id]
      }));

      // Aplicar filtros
      leadsWithContactsData = filterLeadsByContact(leadsWithContactsData, debouncedFilters.contact_filter);
      leadsWithContactsData = filterLeadsByTags(leadsWithContactsData, debouncedFilters.tag_ids);

      console.log('📊 Leads processados com filtros:', leadsWithContactsData.length);
      return leadsWithContactsData;

    } catch (error) {
      console.error('❌ Erro ao buscar dados CRM:', error);
      toast.error('Erro ao carregar dados do CRM');
      return [];
    }
  }, [debouncedFilters, transformLeadData, filterLeadsByContact, filterLeadsByTags]);

  const { data: leadsWithContacts = [], isLoading, error, refetch } = useQuery({
    queryKey: ['optimized-crm-leads', debouncedFilters],
    queryFn: fetchLeadsWithContacts,
    enabled: true,
    staleTime: 2 * 60 * 1000, // 2 minutos para dados dinâmicos
    refetchOnWindowFocus: false,
  });

  const moveLeadToColumn = useCallback(async (leadId: string, newColumnId: string) => {
    try {
      console.log(`🔄 Starting move operation for lead ${leadId} to column ${newColumnId}`);
      
      const { error } = await supabase
        .from('crm_leads')
        .update({ 
          column_id: newColumnId,
          updated_at: new Date().toISOString()
        })
        .eq('id', leadId);

      if (error) {
        console.error('❌ Database error:', error);
        throw error;
      }

      console.log('✅ Database update successful');

      // Invalidação mais específica e forçada do cache
      await queryClient.invalidateQueries({ 
        queryKey: ['optimized-crm-leads'],
        exact: false,
        refetchType: 'active'
      });
      
      console.log('✅ Cache invalidated successfully');
      
    } catch (error) {
      console.error('❌ Error in moveLeadToColumn:', error);
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
