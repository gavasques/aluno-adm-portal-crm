
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CRMLeadContact, CRMLeadContactCreate, ContactFilters } from '@/types/crm.types';
import { toast } from 'sonner';

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
      
      // Transform data to match expected type, ensuring contact_type is properly typed
      const transformedContacts = (data || []).map(contact => ({
        ...contact,
        contact_type: contact.contact_type as 'call' | 'email' | 'whatsapp' | 'meeting',
        status: contact.status as 'pending' | 'completed' | 'overdue'
      }));
      
      setContacts(transformedContacts);
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
      toast.success('Contato agendado com sucesso');
      return data;
    } catch (error) {
      console.error('Erro ao criar contato:', error);
      toast.error('Erro ao agendar contato');
      throw error;
    }
  };

  const completeContact = async (contactId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('crm_lead_contacts')
        .update({
          status: 'completed',
          completed_by: user.id,
          completed_at: new Date().toISOString()
        })
        .eq('id', contactId);

      if (error) throw error;
      
      await fetchContacts();
      toast.success('Contato marcado como realizado');
    } catch (error) {
      console.error('Erro ao completar contato:', error);
      toast.error('Erro ao marcar contato como realizado');
    }
  };

  const deleteContact = async (contactId: string) => {
    try {
      const { error } = await supabase
        .from('crm_lead_contacts')
        .delete()
        .eq('id', contactId);

      if (error) throw error;
      
      await fetchContacts();
      toast.success('Contato removido com sucesso');
    } catch (error) {
      console.error('Erro ao remover contato:', error);
      toast.error('Erro ao remover contato');
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [leadId, filters]);

  return {
    contacts,
    loading,
    createContact,
    completeContact,
    deleteContact,
    refetch: fetchContacts
  };
};
