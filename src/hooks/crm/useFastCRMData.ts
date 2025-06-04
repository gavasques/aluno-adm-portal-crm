
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CRMFilters, LeadWithContacts } from '@/types/crm.types';
import { useMemo } from 'react';

export const useFastCRMData = (filters: CRMFilters) => {
  const { data: leads = [], isLoading, error } = useQuery({
    queryKey: ['fast-crm-leads', filters],
    queryFn: async (): Promise<LeadWithContacts[]> => {
      let query = supabase
        .from('crm_leads')
        .select(`
          id,
          name,
          email,
          phone,
          status,
          column_id,
          pipeline_id,
          responsible_id,
          notes,
          has_company,
          sells_on_amazon,
          works_with_fba,
          had_contact_with_lv,
          seeks_private_label,
          ready_to_invest_3k,
          calendly_scheduled,
          what_sells,
          keep_or_new_niches,
          amazon_store_link,
          amazon_state,
          amazon_tax_regime,
          main_doubts,
          calendly_link,
          created_by,
          scheduled_contact_date,
          status_reason,
          loss_reason_id,
          status_changed_at,
          status_changed_by,
          created_at,
          updated_at,
          responsible:profiles!crm_leads_responsible_id_fkey(id, name),
          column:crm_pipeline_columns!crm_leads_column_id_fkey(id, name, color),
          pipeline:crm_pipelines!crm_leads_pipeline_id_fkey(id, name)
        `)
        .order('created_at', { ascending: false });

      // Aplicar filtros de forma otimizada
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
        console.error('Erro ao buscar leads:', error);
        throw error;
      }

      // Transformar os dados para incluir as propriedades necessárias
      const leadsWithContacts: LeadWithContacts[] = (data || []).map(lead => ({
        ...lead,
        tags: [], // Inicializar como array vazio por enquanto
        pending_contacts: [], // Inicializar como array vazio por enquanto
        last_completed_contact: undefined, // Pode ser undefined
      }));

      return leadsWithContacts;
    },
    staleTime: 30 * 1000, // 30 segundos
    gcTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Agrupar leads por coluna de forma otimizada
  const leadsByColumn = useMemo(() => {
    const grouped: Record<string, LeadWithContacts[]> = {};
    
    leads.forEach(lead => {
      if (lead.column_id) {
        if (!grouped[lead.column_id]) {
          grouped[lead.column_id] = [];
        }
        grouped[lead.column_id].push(lead);
      }
    });

    return grouped;
  }, [leads]);

  return {
    leadsWithContacts: leads,
    leadsByColumn,
    loading: isLoading,
    error
  };
};
