
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CRMLead, CRMLeadFromDB, CRMFilters, CRMLeadContact } from '@/types/crm.types';
import { toast } from 'sonner';

interface LeadWithContacts extends CRMLead {
  pending_contacts: CRMLeadContact[];
}

export const useCRMLeadsWithContacts = (filters: CRMFilters = {}) => {
  const [leadsWithContacts, setLeadsWithContacts] = useState<LeadWithContacts[]>([]);
  const [loading, setLoading] = useState(true);

  const transformLeadData = (dbLead: CRMLeadFromDB): CRMLead => {
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
  };

  const fetchLeadsWithContacts = async () => {
    try {
      // Buscar leads com filtros
      let leadsQuery = supabase
        .from('crm_leads')
        .select(`
          *,
          pipeline:crm_pipelines(id, name),
          column:crm_pipeline_columns(id, name, color),
          responsible:profiles!crm_leads_responsible_id_fkey(id, name, email),
          tags:crm_lead_tags(
            tag:crm_tags(id, name, color)
          )
        `);

      if (filters.pipeline_id) {
        leadsQuery = leadsQuery.eq('pipeline_id', filters.pipeline_id);
      }
      
      if (filters.column_id) {
        leadsQuery = leadsQuery.eq('column_id', filters.column_id);
      }
      
      if (filters.responsible_id) {
        leadsQuery = leadsQuery.eq('responsible_id', filters.responsible_id);
      }
      
      if (filters.search) {
        leadsQuery = leadsQuery.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
      }

      const { data: leads, error: leadsError } = await leadsQuery.order('created_at', { ascending: false });

      if (leadsError) throw leadsError;

      const transformedLeads = (leads as CRMLeadFromDB[])?.map(transformLeadData) || [];

      if (transformedLeads.length === 0) {
        setLeadsWithContacts([]);
        return;
      }

      // Buscar contatos pendentes para todos os leads de uma vez
      const leadIds = transformedLeads.map(lead => lead.id);
      const { data: contacts, error: contactsError } = await supabase
        .from('crm_lead_contacts')
        .select(`
          *,
          responsible:profiles!crm_lead_contacts_responsible_id_fkey(id, name, email)
        `)
        .in('lead_id', leadIds)
        .eq('status', 'pending')
        .order('contact_date', { ascending: true });

      if (contactsError) throw contactsError;

      // Transformar contatos
      const transformedContacts = (contacts || []).map(contact => ({
        ...contact,
        contact_type: contact.contact_type as 'call' | 'email' | 'whatsapp' | 'meeting',
        status: contact.status as 'pending' | 'completed' | 'overdue'
      }));

      // Agrupar contatos por lead
      const contactsByLead = transformedContacts.reduce((acc, contact) => {
        if (!acc[contact.lead_id]) {
          acc[contact.lead_id] = [];
        }
        acc[contact.lead_id].push(contact);
        return acc;
      }, {} as Record<string, CRMLeadContact[]>);

      // Combinar leads com seus contatos
      const leadsWithContactsData: LeadWithContacts[] = transformedLeads.map(lead => ({
        ...lead,
        pending_contacts: contactsByLead[lead.id] || []
      }));

      setLeadsWithContacts(leadsWithContactsData);
    } catch (error) {
      console.error('Erro ao buscar leads com contatos:', error);
      toast.error('Erro ao carregar leads');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchLeadsWithContacts();
      setLoading(false);
    };

    loadData();
  }, [filters.pipeline_id, filters.column_id, filters.responsible_id, filters.search]);

  return {
    leadsWithContacts,
    loading,
    fetchLeadsWithContacts
  };
};
