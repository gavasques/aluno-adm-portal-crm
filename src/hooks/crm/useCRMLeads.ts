
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CRMLead, CRMLeadFromDB, CRMLeadCreate, CRMFilters } from '@/types/crm.types';
import { toast } from 'sonner';

export const useCRMLeads = (filters: CRMFilters = {}) => {
  const [leads, setLeads] = useState<CRMLead[]>([]);
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
      tags: dbLead.tags || []
    };
  };

  const fetchLeads = async () => {
    try {
      let query = supabase
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

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      // Transformar dados para incluir tags como array
      const transformedData = (data as CRMLeadFromDB[])?.map(lead => {
        const transformedLead = transformLeadData(lead);
        return {
          ...transformedLead,
          tags: lead.tags?.map((lt: any) => lt.tag).filter(Boolean) || []
        };
      }) || [];

      setLeads(transformedData);
    } catch (error) {
      console.error('Erro ao buscar leads:', error);
      toast.error('Erro ao carregar leads');
    }
  };

  const createLead = async (leadData: CRMLeadCreate) => {
    try {
      const { data, error } = await supabase
        .from('crm_leads')
        .insert(leadData)
        .select()
        .single();

      if (error) throw error;

      await fetchLeads();
      toast.success('Lead criado com sucesso');
      return data;
    } catch (error) {
      console.error('Erro ao criar lead:', error);
      toast.error('Erro ao criar lead');
      throw error;
    }
  };

  const updateLead = async (leadId: string, updates: Partial<CRMLeadCreate>) => {
    try {
      const { error } = await supabase
        .from('crm_leads')
        .update(updates)
        .eq('id', leadId);

      if (error) throw error;

      // Atualizar estado local
      setLeads(prev => prev.map(lead => 
        lead.id === leadId ? { ...lead, ...updates } : lead
      ));

      toast.success('Lead atualizado com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar lead:', error);
      toast.error('Erro ao atualizar lead');
      throw error;
    }
  };

  const moveLeadToColumn = async (leadId: string, columnId: string) => {
    try {
      await updateLead(leadId, { column_id: columnId });
    } catch (error) {
      console.error('Erro ao mover lead:', error);
      toast.error('Erro ao mover lead');
    }
  };

  const assignResponsible = async (leadId: string, responsibleId: string) => {
    try {
      await updateLead(leadId, { responsible_id: responsibleId });
      
      // Criar notificação
      await supabase
        .from('crm_notifications')
        .insert({
          user_id: responsibleId,
          lead_id: leadId,
          type: 'assignment',
          title: 'Novo lead atribuído',
          message: 'Um novo lead foi atribuído a você'
        });
    } catch (error) {
      console.error('Erro ao atribuir responsável:', error);
      toast.error('Erro ao atribuir responsável');
    }
  };

  const deleteLead = async (leadId: string) => {
    try {
      const { error } = await supabase
        .from('crm_leads')
        .delete()
        .eq('id', leadId);

      if (error) throw error;

      setLeads(prev => prev.filter(lead => lead.id !== leadId));
      toast.success('Lead removido com sucesso');
    } catch (error) {
      console.error('Erro ao remover lead:', error);
      toast.error('Erro ao remover lead');
    }
  };

  useEffect(() => {
    const loadLeads = async () => {
      setLoading(true);
      await fetchLeads();
      setLoading(false);
    };

    loadLeads();
  }, [filters.pipeline_id, filters.column_id, filters.responsible_id, filters.search]);

  return {
    leads,
    loading,
    fetchLeads,
    createLead,
    updateLead,
    moveLeadToColumn,
    assignResponsible,
    deleteLead
  };
};
