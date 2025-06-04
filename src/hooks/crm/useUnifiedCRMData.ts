
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CRMFilters, LeadWithContacts, LeadStatus } from '@/types/crm.types';
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
      
      // Buscar leads básicos primeiro
      let query = supabase
        .from('crm_leads')
        .select('*');

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

      if (!leads || leads.length === 0) {
        return [];
      }

      // Buscar dados relacionados em lotes para otimização
      const leadIds = leads.map(lead => lead.id);
      const pipelineIds = [...new Set(leads.map(lead => lead.pipeline_id).filter(Boolean))];
      const columnIds = [...new Set(leads.map(lead => lead.column_id).filter(Boolean))];
      const responsibleIds = [...new Set(leads.map(lead => lead.responsible_id).filter(Boolean))];
      const lossReasonIds = [...new Set(leads.map(lead => lead.loss_reason_id).filter(Boolean))];

      // Buscar todos os dados relacionados em paralelo
      const [
        pipelinesData,
        columnsData,
        responsiblesData,
        lossReasonsData,
        contactsData,
        tagsData
      ] = await Promise.all([
        // Pipelines
        pipelineIds.length > 0 ? 
          supabase
            .from('crm_pipelines')
            .select('id, name, description, sort_order, is_active, created_at, updated_at')
            .in('id', pipelineIds)
            .then(res => res.data || [])
            .catch(err => {
              console.warn('Pipelines not found:', err);
              return [];
            }) : 
          Promise.resolve([]),
        
        // Columns
        columnIds.length > 0 ? 
          supabase
            .from('crm_pipeline_columns')
            .select('id, name, color, pipeline_id, sort_order, is_active, created_at, updated_at')
            .in('id', columnIds)
            .then(res => res.data || [])
            .catch(err => {
              console.warn('Columns not found:', err);
              return [];
            }) : 
          Promise.resolve([]),
        
        // Responsibles
        responsibleIds.length > 0 ? 
          supabase
            .from('profiles')
            .select('id, name, email')
            .in('id', responsibleIds)
            .then(res => res.data || [])
            .catch(err => {
              console.warn('Responsibles not found:', err);
              return [];
            }) : 
          Promise.resolve([]),
        
        // Loss Reasons
        lossReasonIds.length > 0 ? 
          supabase
            .from('crm_loss_reasons')
            .select('id, name, description, sort_order, is_active, created_at, updated_at')
            .in('id', lossReasonIds)
            .then(res => res.data || [])
            .catch(err => {
              console.warn('Loss reasons not found:', err);
              return [];
            }) : 
          Promise.resolve([]),
        
        // Contacts
        supabase
          .from('crm_lead_contacts')
          .select(`
            *,
            responsible:profiles!crm_lead_contacts_responsible_id_fkey(id, name, email)
          `)
          .in('lead_id', leadIds)
          .eq('status', 'pending')
          .order('contact_date', { ascending: true })
          .then(res => res.data || [])
          .catch(err => {
            console.warn('Contacts not found:', err);
            return [];
          }),
        
        // Tags
        supabase
          .from('crm_lead_tags')
          .select(`
            lead_id,
            crm_tags(id, name, color, created_at)
          `)
          .in('lead_id', leadIds)
          .then(res => res.data || [])
          .catch(err => {
            console.warn('Tags not found:', err);
            return [];
          })
      ]);

      // Criar mapas para lookup rápido
      const pipelinesMap = new Map(pipelinesData.map(p => [p.id, p]));
      const columnsMap = new Map(columnsData.map(c => [c.id, c]));
      const responsiblesMap = new Map(responsiblesData.map(r => [r.id, r]));
      const lossReasonsMap = new Map(lossReasonsData.map(lr => [lr.id, lr]));
      const contactsMap = new Map<string, any[]>();
      const tagsMap = new Map<string, any[]>();

      // Organizar contacts por lead
      contactsData.forEach(contact => {
        if (!contactsMap.has(contact.lead_id)) {
          contactsMap.set(contact.lead_id, []);
        }
        contactsMap.get(contact.lead_id)!.push(contact);
      });

      // Organizar tags por lead
      tagsData.forEach(tagWrapper => {
        if (tagWrapper.crm_tags) {
          if (!tagsMap.has(tagWrapper.lead_id)) {
            tagsMap.set(tagWrapper.lead_id, []);
          }
          tagsMap.get(tagWrapper.lead_id)!.push(tagWrapper.crm_tags);
        }
      });

      // Processar leads com dados relacionados
      const processedLeads: LeadWithContacts[] = leads.map(lead => ({
        ...lead,
        status: lead.status as LeadStatus,
        pipeline: lead.pipeline_id ? pipelinesMap.get(lead.pipeline_id) : undefined,
        column: lead.column_id ? columnsMap.get(lead.column_id) : undefined,
        responsible: lead.responsible_id ? responsiblesMap.get(lead.responsible_id) : undefined,
        loss_reason: lead.loss_reason_id ? lossReasonsMap.get(lead.loss_reason_id) : undefined,
        tags: tagsMap.get(lead.id) || [],
        pending_contacts: contactsMap.get(lead.id) || [],
        last_completed_contact: undefined
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
