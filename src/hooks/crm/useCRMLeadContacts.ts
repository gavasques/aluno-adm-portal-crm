
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CRMLeadContact, CRMLeadContactCreate, ContactFilters } from '@/types/crm.types';

export const useCRMLeadContacts = (leadId?: string, filters?: ContactFilters) => {
  const [contacts, setContacts] = useState<CRMLeadContact[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('crm_lead_contacts')
        .select(`
          *,
          responsible:profiles!crm_lead_contacts_responsible_id_fkey(id, name, email)
        `);

      if (leadId) {
        query = query.eq('lead_id', leadId);
      }

      if (filters?.status) {
        query = query.eq('status', filters.status);
      }

      if (filters?.contact_type) {
        query = query.eq('contact_type', filters.contact_type);
      }

      if (filters?.responsible_id) {
        query = query.eq('responsible_id', filters.responsible_id);
      }

      if (filters?.date_from) {
        query = query.gte('contact_date', filters.date_from);
      }

      if (filters?.date_to) {
        query = query.lte('contact_date', filters.date_to);
      }

      const { data, error } = await query.order('contact_date', { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error('Erro ao buscar contatos:', error);
    } finally {
      setLoading(false);
    }
  };

  const createContact = async (contactData: CRMLeadContactCreate) => {
    try {
      const { data, error } = await supabase
        .from('crm_lead_contacts')
        .insert(contactData)
        .select()
        .single();

      if (error) throw error;
      fetchContacts(); // Refresh list
      return data;
    } catch (error) {
      console.error('Erro ao criar contato:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [leadId, filters]);

  return {
    contacts,
    loading,
    createContact,
    refetch: fetchContacts
  };
};
