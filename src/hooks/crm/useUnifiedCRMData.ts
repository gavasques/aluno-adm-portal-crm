
import React, { useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CRMLead, CRMFilters, CRMLeadContact, LeadWithContacts } from '@/types/crm.types';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useCRMDataTransformService } from './services/useCRMDataTransformService';
import { useCRMLeadFilters } from './useCRMLeadFilters';
import { useIntelligentCache } from './useIntelligentCache';
import { measureAsyncOperation } from '@/utils/performanceMonitor';

export const useUnifiedCRMData = (filters: CRMFilters = {}) => {
  // Debounce search para evitar queries excessivas
  const [debouncedSearch] = useDebouncedValue(filters.search || '', 300);
  const debouncedFilters = { ...filters, search: debouncedSearch };

  // Services para transformação e filtros
  const { transformLeadData } = useCRMDataTransformService();
  const { filterLeadsByContact, filterLeadsByTags } = useCRMLeadFilters();
  const { getCacheStrategy, optimizeCache } = useIntelligentCache();

  // Estratégia de cache inteligente
  const cacheStrategy = getCacheStrategy('unified-crm-leads', debouncedFilters);

  const fetchUnifiedLeadsData = useCallback(async (): Promise<LeadWithContacts[]> => {
    if (!debouncedFilters.pipeline_id) {
      console.log('⚠️ [UNIFIED_CRM] Nenhum pipeline_id fornecido, aguardando seleção...');
      return [];
    }

    return await measureAsyncOperation('fetch_unified_leads_data', async () => {
      try {
        console.log('📊 [UNIFIED_CRM] Buscando leads com cache otimizado para pipeline:', debouncedFilters.pipeline_id);

        // Query otimizada para leads com joins necessários
        let leadsQuery = supabase
          .from('crm_leads')
          .select(`
            id, name, email, phone, has_company, sells_on_amazon, works_with_fba,
            had_contact_with_lv, seeks_private_label, ready_to_invest_3k,
            calendly_scheduled, what_sells, keep_or_new_niches, amazon_store_link,
            amazon_state, amazon_tax_regime, main_doubts, calendly_link,
            pipeline_id, column_id, responsible_id, created_by, notes, status,
            scheduled_contact_date, created_at, updated_at,
            pipeline:crm_pipelines(id, name),
            column:crm_pipeline_columns(id, name, color),
            responsible:profiles!crm_leads_responsible_id_fkey(id, name, email),
            tags:crm_lead_tags(
              tag:crm_tags(id, name, color, created_at)
            )
          `)
          .eq('pipeline_id', debouncedFilters.pipeline_id);

        // Aplicar filtros condicionalmente
        if (debouncedFilters.column_id) {
          leadsQuery = leadsQuery.eq('column_id', debouncedFilters.column_id);
        }
        
        if (debouncedFilters.responsible_id) {
          leadsQuery = leadsQuery.eq('responsible_id', debouncedFilters.responsible_id);
        }

        if (debouncedFilters.status) {
          leadsQuery = leadsQuery.eq('status', debouncedFilters.status);
        }
        
        if (debouncedFilters.search) {
          leadsQuery = leadsQuery.or(`name.ilike.%${debouncedFilters.search}%,email.ilike.%${debouncedFilters.search}%`);
        }

        // Executar queries em paralelo para melhor performance
        const [leadsResult, pendingContactsResult, completedContactsResult] = await Promise.allSettled([
          measureAsyncOperation('fetch_leads', async () => {
            const result = await leadsQuery.order('created_at', { ascending: false });
            return result;
          }),
          
          measureAsyncOperation('fetch_pending_contacts', async () => {
            const result = await supabase
              .from('crm_lead_contacts')
              .select(`
                id, lead_id, contact_type, contact_reason, contact_date, status,
                notes, responsible_id, completed_by, completed_at, created_at, updated_at,
                responsible:profiles!crm_lead_contacts_responsible_id_fkey(id, name, email)
              `)
              .eq('status', 'pending')
              .order('contact_date', { ascending: true });
            return result;
          }),
          
          measureAsyncOperation('fetch_completed_contacts', async () => {
            const result = await supabase
              .from('crm_lead_contacts')
              .select(`
                id, lead_id, contact_type, contact_reason, contact_date, status,
                notes, responsible_id, completed_by, completed_at, created_at, updated_at,
                responsible:profiles!crm_lead_contacts_responsible_id_fkey(id, name, email)
              `)
              .eq('status', 'completed')
              .not('completed_at', 'is', null)
              .order('completed_at', { ascending: false });
            return result;
          })
        ]);

        if (leadsResult.status === 'rejected') {
          throw leadsResult.reason;
        }

        // Verificar se leadsResult.value tem a estrutura esperada
        const leadsResponse = leadsResult.value as { data: any[] | null; error: any };
        if (leadsResponse.error) throw leadsResponse.error;

        const leads = leadsResponse.data;
        console.log('📊 [UNIFIED_CRM] Leads encontrados:', leads?.length || 0);

        if (!leads || leads.length === 0) {
          return [];
        }

        // Transformar leads usando service centralizado
        const transformedLeads = leads.map(transformLeadData);
        const leadIds = transformedLeads.map(lead => lead.id);

        // Processar contatos de forma otimizada
        const pendingContacts = pendingContactsResult.status === 'fulfilled' && 
          (pendingContactsResult.value as { data: any[] | null })?.data ? 
          (pendingContactsResult.value as { data: any[] }).data
            .filter(contact => leadIds.includes(contact.lead_id) && contact.status === 'pending')
            .map(contact => ({
              ...contact,
              contact_type: contact.contact_type as 'call' | 'email' | 'whatsapp' | 'meeting',
              status: contact.status as 'pending' | 'completed' | 'overdue'
            })) : [];

        const completedContacts = completedContactsResult.status === 'fulfilled' && 
          (completedContactsResult.value as { data: any[] | null })?.data ? 
          (completedContactsResult.value as { data: any[] }).data
            .filter(contact => leadIds.includes(contact.lead_id) && contact.status === 'completed' && contact.completed_at)
            .map(contact => ({
              ...contact,
              contact_type: contact.contact_type as 'call' | 'email' | 'whatsapp' | 'meeting',
              status: contact.status as 'pending' | 'completed' | 'overdue'
            })) : [];

        // Agrupar contatos por lead de forma eficiente usando Map para melhor performance
        const pendingContactsByLead = pendingContacts.reduce((acc, contact) => {
          if (!acc[contact.lead_id]) acc[contact.lead_id] = [];
          acc[contact.lead_id].push(contact);
          return acc;
        }, {} as Record<string, CRMLeadContact[]>);

        const lastCompletedContactsByLead = completedContacts.reduce((acc, contact) => {
          if (!acc[contact.lead_id]) {
            acc[contact.lead_id] = contact;
          }
          return acc;
        }, {} as Record<string, CRMLeadContact>);

        // Combinar leads com contatos
        let leadsWithContactsData: LeadWithContacts[] = transformedLeads.map(lead => ({
          ...lead,
          pending_contacts: pendingContactsByLead[lead.id] || [],
          last_completed_contact: lastCompletedContactsByLead[lead.id]
        }));

        // Aplicar filtros usando services
        leadsWithContactsData = filterLeadsByContact(leadsWithContactsData, debouncedFilters.contact_filter);
        leadsWithContactsData = filterLeadsByTags(leadsWithContactsData, debouncedFilters.tag_ids);

        console.log('📊 [UNIFIED_CRM] Leads processados com filtros e cache otimizado:', leadsWithContactsData.length);
        
        return leadsWithContactsData;

      } catch (error) {
        console.error('❌ [UNIFIED_CRM] Erro ao buscar dados CRM:', error);
        throw error;
      }
    });
  }, [debouncedFilters, transformLeadData, filterLeadsByContact, filterLeadsByTags]);

  const { data: leadsWithContacts = [], isLoading, error, refetch } = useQuery({
    queryKey: ['unified-crm-leads', debouncedFilters],
    queryFn: fetchUnifiedLeadsData,
    enabled: true,
    ...cacheStrategy, // Aplicar estratégia de cache inteligente
  });

  // Agrupar leads por coluna de forma memoizada com otimização
  const leadsByColumn = useMemo(() => {
    const grouped: Record<string, LeadWithContacts[]> = {};
    
    // Usar forEach para melhor performance em arrays grandes
    leadsWithContacts.forEach(lead => {
      if (lead.column_id) {
        if (!grouped[lead.column_id]) grouped[lead.column_id] = [];
        grouped[lead.column_id].push(lead);
      }
    });
    
    console.log('📊 [UNIFIED_CRM] Leads agrupados por coluna:', {
      totalColumns: Object.keys(grouped).length,
      distribution: Object.entries(grouped).map(([columnId, leads]) => ({
        columnId,
        count: leads.length
      }))
    });
    
    return grouped;
  }, [leadsWithContacts]);

  // Otimizar cache quando os dados estiverem prontos
  React.useEffect(() => {
    if (leadsWithContacts.length > 0 && !isLoading) {
      optimizeCache(leadsWithContacts);
    }
  }, [leadsWithContacts, isLoading, optimizeCache]);

  return {
    leadsWithContacts,
    leadsByColumn,
    loading: isLoading,
    error,
    refetch
  };
};
