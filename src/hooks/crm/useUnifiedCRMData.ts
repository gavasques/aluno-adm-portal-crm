
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CRMFilters, LeadWithContacts } from '@/types/crm.types';
import { useMemo } from 'react';

export const useUnifiedCRMData = (filters: CRMFilters) => {
  const queryKey = ['unified-crm-leads', filters];
  
  const {
    data: leadsWithContacts = [],
    isLoading: loading,
    error,
    refetch
  } = useQuery({
    queryKey,
    queryFn: async () => {
      console.log('🔍 [UNIFIED_CRM_DATA] Buscando leads com filtros:', filters);
      
      // Query simplificada sem FULL JOIN
      let query = supabase
        .from('crm_leads')
        .select(`
          *,
          pipeline:crm_pipelines(id, name),
          column:crm_pipeline_columns(id, name, color),
          responsible:profiles!crm_leads_responsible_id_fkey(id, name, email),
          loss_reason:crm_loss_reasons(id, name),
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
      
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
      }

      const { data: leads, error: leadsError } = await query.order('created_at', { ascending: false });
      
      if (leadsError) {
        console.error('❌ [UNIFIED_CRM_DATA] Erro ao buscar leads:', leadsError);
        throw leadsError;
      }

      console.log(`✅ [UNIFIED_CRM_DATA] ${leads?.length || 0} leads encontrados`);

      // Buscar contatos pendentes para cada lead (query separada para evitar joins complexos)
      const leadIds = leads?.map(lead => lead.id) || [];
      
      let contactsData = [];
      if (leadIds.length > 0) {
        const { data: contacts } = await supabase
          .from('crm_lead_contacts')
          .select(`
            *,
            responsible:profiles!crm_lead_contacts_responsible_id_fkey(id, name, email)
          `)
          .in('lead_id', leadIds)
          .eq('status', 'pending')
          .order('contact_date', { ascending: true });
        
        contactsData = contacts || [];
      }

      // Processar dados para incluir contatos
      const processedLeads: LeadWithContacts[] = (leads || []).map(lead => ({
        ...lead,
        tags: lead.tags?.map((tagWrapper: any) => tagWrapper.tag).filter(Boolean) || [],
        pending_contacts: contactsData.filter(contact => contact.lead_id === lead.id),
        last_completed_contact: undefined // Pode ser implementado depois se necessário
      }));

      console.log('🎯 [UNIFIED_CRM_DATA] Leads processados:', {
        totalLeads: processedLeads.length,
        leadsWithContacts: processedLeads.filter(l => l.pending_contacts.length > 0).length
      });

      return processedLeads;
    },
    staleTime: 1000 * 60 * 2, // 2 minutos
    gcTime: 1000 * 60 * 5, // 5 minutos
  });

  // Agrupar leads por coluna
  const leadsByColumn = useMemo(() => {
    const grouped = leadsWithContacts.reduce((acc, lead) => {
      const columnId = lead.column_id || 'sem-coluna';
      if (!acc[columnId]) {
        acc[columnId] = [];
      }
      acc[columnId].push(lead);
      return acc;
    }, {} as Record<string, LeadWithContacts[]>);

    console.log('📊 [UNIFIED_CRM_DATA] Leads agrupados por coluna:', {
      colunas: Object.keys(grouped).length,
      distribuicao: Object.entries(grouped).map(([col, leads]) => ({
        coluna: col,
        quantidade: leads.length
      }))
    });

    return grouped;
  }, [leadsWithContacts]);

  return {
    leadsWithContacts,
    leadsByColumn,
    loading,
    error,
    refetch
  };
};
