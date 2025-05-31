
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CRMLead, CRMLeadFromDB, CRMFilters, CRMLeadContact } from '@/types/crm.types';
import { toast } from 'sonner';
import { isToday, isTomorrow, isPast } from 'date-fns';

interface LeadWithContacts extends CRMLead {
  pending_contacts: CRMLeadContact[];
  last_completed_contact?: CRMLeadContact;
}

export const useCRMLeadsWithContacts = (filters: CRMFilters = {}) => {
  const [leadsWithContacts, setLeadsWithContacts] = useState<LeadWithContacts[]>([]);
  const [loading, setLoading] = useState(true);

  console.log('🔍 useCRMLeadsWithContacts - filters:', filters);

  const transformLeadData = useCallback((dbLead: CRMLeadFromDB): CRMLead => {
    console.log('🔄 Transforming lead:', dbLead.id, dbLead.name);
    
    try {
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
        scheduled_contact_date: dbLead.scheduled_contact_date || undefined,
        notes: dbLead.notes || undefined,
        tags: dbLead.tags?.map(tagWrapper => tagWrapper.tag) || []
      };
    } catch (error) {
      console.error('❌ Error transforming lead:', error);
      return {
        ...dbLead,
        has_company: false,
        sells_on_amazon: false,
        works_with_fba: false,
        had_contact_with_lv: false,
        seeks_private_label: false,
        ready_to_invest_3k: false,
        calendly_scheduled: false,
        tags: []
      };
    }
  }, []);

  const filterLeadsByContact = useCallback((leadsData: LeadWithContacts[], contactFilter?: string) => {
    if (!contactFilter) return leadsData;

    console.log('🔍 Filtering leads by contact filter:', contactFilter);

    return leadsData.filter(lead => {
      const hasContacts = lead.pending_contacts.length > 0;
      
      switch (contactFilter) {
        case 'today':
          return hasContacts && lead.pending_contacts.some(contact => 
            isToday(new Date(contact.contact_date))
          );
        
        case 'tomorrow':
          return hasContacts && lead.pending_contacts.some(contact => 
            isTomorrow(new Date(contact.contact_date))
          );
        
        case 'overdue':
          return hasContacts && lead.pending_contacts.some(contact => {
            const contactDate = new Date(contact.contact_date);
            return isPast(contactDate) && !isToday(contactDate);
          });
        
        case 'no_contact':
          return !hasContacts;
        
        default:
          return true;
      }
    });
  }, []);

  const fetchLeadsWithContacts = useCallback(async () => {
    console.log('🚀 fetchLeadsWithContacts called with filters:', filters);

    // GUARD: Não executar sem pipeline_id válido
    if (!filters.pipeline_id) {
      console.log('⚠️ No pipeline_id provided, setting empty state');
      setLeadsWithContacts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('📡 Starting fetch for pipeline:', filters.pipeline_id);

      // Buscar leads com filtros
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

      if (filters.column_id) {
        leadsQuery = leadsQuery.eq('column_id', filters.column_id);
      }
      
      if (filters.responsible_id) {
        leadsQuery = leadsQuery.eq('responsible_id', filters.responsible_id);
      }
      
      if (filters.search) {
        leadsQuery = leadsQuery.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
      }

      console.log('📡 Executing leads query...');
      const { data: leads, error: leadsError } = await leadsQuery.order('created_at', { ascending: false });

      if (leadsError) {
        console.error('❌ Error fetching leads:', leadsError);
        throw leadsError;
      }

      console.log('✅ Leads fetched:', leads?.length || 0);

      if (!leads || leads.length === 0) {
        console.log('📭 No leads found, setting empty state');
        setLeadsWithContacts([]);
        return;
      }

      // Transformar leads
      const transformedLeads = leads.map(transformLeadData);
      console.log('🔄 Leads transformed:', transformedLeads.length);

      // Buscar contatos pendentes para todos os leads de uma vez
      const leadIds = transformedLeads.map(lead => lead.id);
      console.log('📡 Fetching pending contacts for leads:', leadIds.length);
      
      const { data: pendingContacts, error: pendingContactsError } = await supabase
        .from('crm_lead_contacts')
        .select(`
          *,
          responsible:profiles!crm_lead_contacts_responsible_id_fkey(id, name, email)
        `)
        .in('lead_id', leadIds)
        .eq('status', 'pending')
        .order('contact_date', { ascending: true });

      if (pendingContactsError) {
        console.error('⚠️ Error fetching pending contacts (non-critical):', pendingContactsError);
      }

      console.log('✅ Pending contacts fetched:', pendingContacts?.length || 0);

      // Buscar último contato realizado para cada lead
      console.log('📡 Fetching last completed contacts for leads:', leadIds.length);
      
      const { data: completedContacts, error: completedContactsError } = await supabase
        .from('crm_lead_contacts')
        .select(`
          *,
          responsible:profiles!crm_lead_contacts_responsible_id_fkey(id, name, email)
        `)
        .in('lead_id', leadIds)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false });

      if (completedContactsError) {
        console.error('⚠️ Error fetching completed contacts (non-critical):', completedContactsError);
      }

      console.log('✅ Completed contacts fetched:', completedContacts?.length || 0);

      // Transformar contatos pendentes
      const transformedPendingContacts = (pendingContacts || []).map(contact => ({
        ...contact,
        contact_type: contact.contact_type as 'call' | 'email' | 'whatsapp' | 'meeting',
        status: contact.status as 'pending' | 'completed' | 'overdue'
      }));

      // Transformar contatos realizados
      const transformedCompletedContacts = (completedContacts || []).map(contact => ({
        ...contact,
        contact_type: contact.contact_type as 'call' | 'email' | 'whatsapp' | 'meeting',
        status: contact.status as 'pending' | 'completed' | 'overdue'
      }));

      // Agrupar contatos pendentes por lead
      const pendingContactsByLead = transformedPendingContacts.reduce((acc, contact) => {
        if (!acc[contact.lead_id]) {
          acc[contact.lead_id] = [];
        }
        acc[contact.lead_id].push(contact);
        return acc;
      }, {} as Record<string, CRMLeadContact[]>);

      // Agrupar último contato realizado por lead
      const lastCompletedContactsByLead = transformedCompletedContacts.reduce((acc, contact) => {
        if (!acc[contact.lead_id]) {
          acc[contact.lead_id] = contact; // Primeiro contato (mais recente devido ao order)
        }
        return acc;
      }, {} as Record<string, CRMLeadContact>);

      console.log('🔗 Contacts grouped by lead');

      // Combinar leads com seus contatos
      const leadsWithContactsData: LeadWithContacts[] = transformedLeads.map(lead => ({
        ...lead,
        pending_contacts: pendingContactsByLead[lead.id] || [],
        last_completed_contact: lastCompletedContactsByLead[lead.id]
      }));

      // Aplicar filtro de contatos
      const filteredLeads = filterLeadsByContact(leadsWithContactsData, filters.contact_filter);
      console.log('🔍 Leads after contact filter:', filteredLeads.length, 'from', leadsWithContactsData.length);

      console.log('✅ Final leads with contacts prepared:', filteredLeads.length);
      setLeadsWithContacts(filteredLeads);
    } catch (error) {
      console.error('💥 Critical error in fetchLeadsWithContacts:', error);
      toast.error('Erro ao carregar leads');
      setLeadsWithContacts([]);
    } finally {
      setLoading(false);
      console.log('🏁 fetchLeadsWithContacts completed');
    }
  }, [filters.pipeline_id, filters.column_id, filters.responsible_id, filters.search, filters.contact_filter, transformLeadData, filterLeadsByContact]);

  useEffect(() => {
    console.log('🔄 useEffect triggered, pipeline_id:', filters.pipeline_id);
    
    // GUARD: Não executar sem pipeline_id
    if (!filters.pipeline_id) {
      console.log('⏭️ Skipping fetch, no pipeline_id');
      setLoading(false);
      return;
    }

    fetchLeadsWithContacts();
  }, [fetchLeadsWithContacts]);

  console.log('📊 Hook state - loading:', loading, 'leads count:', leadsWithContacts.length);

  return {
    leadsWithContacts,
    loading,
    fetchLeadsWithContacts
  };
};
