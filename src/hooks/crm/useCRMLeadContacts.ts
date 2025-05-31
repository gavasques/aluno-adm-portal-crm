
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CRMLeadContact, CRMLeadContactCreate, ContactFilters } from '@/types/crm.types';
import { toast } from 'sonner';

export const useCRMLeadContacts = (leadId: string, filters: ContactFilters = {}) => {
  const [contacts, setContacts] = useState<CRMLeadContact[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    try {
      let query = supabase
        .from('crm_lead_contacts')
        .select(`
          *,
          responsible:profiles!crm_lead_contacts_responsible_id_fkey(id, name, email),
          completed_by_user:profiles!crm_lead_contacts_completed_by_fkey(id, name, email)
        `)
        .eq('lead_id', leadId);

      // Aplicar filtros
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      
      if (filters.responsible_id) {
        query = query.eq('responsible_id', filters.responsible_id);
      }
      
      if (filters.contact_type) {
        query = query.eq('contact_type', filters.contact_type);
      }
      
      if (filters.date_from) {
        query = query.gte('contact_date', filters.date_from);
      }
      
      if (filters.date_to) {
        query = query.lte('contact_date', filters.date_to);
      }

      const { data, error } = await query.order('contact_date', { ascending: false });

      if (error) throw error;

      // Fazer cast explícito dos tipos para garantir conformidade
      const transformedContacts: CRMLeadContact[] = (data || []).map(contact => ({
        ...contact,
        contact_type: contact.contact_type as 'call' | 'email' | 'whatsapp' | 'meeting',
        status: contact.status as 'pending' | 'completed' | 'overdue'
      }));

      setContacts(transformedContacts);
    } catch (error) {
      console.error('Erro ao buscar contatos:', error);
      toast.error('Erro ao carregar contatos');
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

      await fetchContacts();
      toast.success('Contato agendado com sucesso');
      return data;
    } catch (error) {
      console.error('Erro ao criar contato:', error);
      toast.error('Erro ao agendar contato');
      throw error;
    }
  };

  const updateContact = async (contactId: string, updates: Partial<CRMLeadContact>) => {
    try {
      const { error } = await supabase
        .from('crm_lead_contacts')
        .update(updates)
        .eq('id', contactId);

      if (error) throw error;

      await fetchContacts();
      toast.success('Contato atualizado com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar contato:', error);
      toast.error('Erro ao atualizar contato');
      throw error;
    }
  };

  const completeContact = async (contactId: string, notes?: string) => {
    try {
      await updateContact(contactId, {
        status: 'completed',
        completed_at: new Date().toISOString(),
        completed_by: (await supabase.auth.getUser()).data.user?.id,
        notes: notes
      });
    } catch (error) {
      console.error('Erro ao marcar contato como realizado:', error);
      throw error;
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
      throw error;
    }
  };

  useEffect(() => {
    const loadContacts = async () => {
      setLoading(true);
      await fetchContacts();
      setLoading(false);
    };

    if (leadId) {
      loadContacts();
    }
  }, [leadId, filters.status, filters.responsible_id, filters.contact_type, filters.date_from, filters.date_to]);

  return {
    contacts,
    loading,
    fetchContacts,
    createContact,
    updateContact,
    completeContact,
    deleteContact
  };
};
