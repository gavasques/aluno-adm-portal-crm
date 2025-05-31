
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CRMLead, CRMLeadFromDB, CRMLeadContact } from '@/types/crm.types';
import { toast } from 'sonner';

interface LeadWithContacts extends CRMLead {
  pending_contacts: CRMLeadContact[];
  last_completed_contact?: CRMLeadContact;
}

export const useCRMLeadDetail = (leadId: string) => {
  const [lead, setLead] = useState<LeadWithContacts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      notes: dbLead.notes || undefined,
      tags: dbLead.tags?.map(tagWrapper => tagWrapper.tag) || []
    };
  };

  const fetchLead = async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscar dados do lead
      const { data: leadData, error: leadError } = await supabase
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
        .eq('id', leadId)
        .single();

      if (leadError) throw leadError;
      if (!leadData) {
        setError('Lead não encontrado');
        return;
      }

      // Buscar contatos pendentes (apenas status 'pending')
      const { data: pendingContacts, error: pendingContactsError } = await supabase
        .from('crm_lead_contacts')
        .select(`
          *,
          responsible:profiles!crm_lead_contacts_responsible_id_fkey(id, name, email)
        `)
        .eq('lead_id', leadId)
        .eq('status', 'pending')
        .order('contact_date', { ascending: true });

      if (pendingContactsError) {
        console.error('⚠️ Error fetching pending contacts (non-critical):', pendingContactsError);
      }

      // Buscar último contato realizado (apenas status 'completed' com completed_at)
      const { data: completedContacts, error: completedContactsError } = await supabase
        .from('crm_lead_contacts')
        .select(`
          *,
          responsible:profiles!crm_lead_contacts_responsible_id_fkey(id, name, email)
        `)
        .eq('lead_id', leadId)
        .eq('status', 'completed')
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false })
        .limit(1);

      if (completedContactsError) {
        console.error('⚠️ Error fetching completed contacts (non-critical):', completedContactsError);
      }

      // Transformar contatos pendentes
      const transformedPendingContacts = (pendingContacts || [])
        .filter(contact => contact.status === 'pending')
        .map(contact => ({
          ...contact,
          contact_type: contact.contact_type as 'call' | 'email' | 'whatsapp' | 'meeting',
          status: contact.status as 'pending' | 'completed' | 'overdue'
        }));

      // Transformar último contato realizado
      const lastCompletedContact = completedContacts && completedContacts.length > 0
        ? {
            ...completedContacts[0],
            contact_type: completedContacts[0].contact_type as 'call' | 'email' | 'whatsapp' | 'meeting',
            status: completedContacts[0].status as 'pending' | 'completed' | 'overdue'
          }
        : undefined;

      // Transformar lead e adicionar contatos
      const transformedLead = transformLeadData(leadData);
      const leadWithContacts: LeadWithContacts = {
        ...transformedLead,
        pending_contacts: transformedPendingContacts,
        last_completed_contact: lastCompletedContact
      };

      setLead(leadWithContacts);
    } catch (error) {
      console.error('Erro ao buscar lead:', error);
      setError('Erro ao carregar detalhes do lead');
      toast.error('Erro ao carregar detalhes do lead');
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchLead();
  };

  useEffect(() => {
    if (leadId) {
      fetchLead();
    }
  }, [leadId]);

  return {
    lead,
    loading,
    error,
    refetch
  };
};
