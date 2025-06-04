
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CRMLead, LeadStatus } from '@/types/crm.types';

export const useCRMLeadDetail = (leadId: string) => {
  return useQuery({
    queryKey: ['crm-lead-detail', leadId],
    queryFn: async (): Promise<CRMLead | null> => {
      if (!leadId) return null;

      console.log('🔍 [CRM_LEAD_DETAIL] Buscando detalhes do lead:', leadId);

      // Buscar dados básicos do lead primeiro
      const { data: lead, error } = await supabase
        .from('crm_leads')
        .select('*')
        .eq('id', leadId)
        .maybeSingle();

      if (error) {
        console.error('❌ [CRM_LEAD_DETAIL] Erro ao buscar lead:', error);
        throw error;
      }

      if (!lead) {
        console.log('⚠️ [CRM_LEAD_DETAIL] Lead não encontrado:', leadId);
        return null;
      }

      // Buscar dados relacionados separadamente para evitar JOINs complexos
      const [pipelineData, columnData, responsibleData, lossReasonData, tagsData] = await Promise.all([
        // Pipeline
        lead.pipeline_id ? supabase
          .from('crm_pipelines')
          .select('id, name, description, sort_order, is_active, created_at, updated_at')
          .eq('id', lead.pipeline_id)
          .single()
          .then(res => res.data)
          .catch(() => null) : null,
        
        // Column
        lead.column_id ? supabase
          .from('crm_pipeline_columns')
          .select('id, name, color, pipeline_id, sort_order, is_active, created_at, updated_at')
          .eq('id', lead.column_id)
          .single()
          .then(res => res.data)
          .catch(() => null) : null,
        
        // Responsible
        lead.responsible_id ? supabase
          .from('profiles')
          .select('id, name, email')
          .eq('id', lead.responsible_id)
          .single()
          .then(res => res.data)
          .catch(() => null) : null,
        
        // Loss Reason
        lead.loss_reason_id ? supabase
          .from('crm_loss_reasons')
          .select('id, name, description, sort_order, is_active, created_at, updated_at')
          .eq('id', lead.loss_reason_id)
          .single()
          .then(res => res.data)
          .catch(() => null) : null,
        
        // Tags
        supabase
          .from('crm_lead_tags')
          .select(`
            crm_tags(id, name, color, created_at)
          `)
          .eq('lead_id', leadId)
          .then(res => res.data?.map(item => item.crm_tags).filter(Boolean) || [])
          .catch(() => [])
      ]);

      const processedLead: CRMLead = {
        ...lead,
        status: lead.status as LeadStatus,
        pipeline: pipelineData,
        column: columnData,
        responsible: responsibleData,
        loss_reason: lossReasonData,
        tags: tagsData
      };

      console.log('✅ [CRM_LEAD_DETAIL] Lead encontrado:', {
        id: processedLead.id,
        name: processedLead.name,
        pipeline: processedLead.pipeline?.name,
        column: processedLead.column?.name,
        tagsCount: processedLead.tags.length
      });

      return processedLead;
    },
    enabled: !!leadId,
    staleTime: 1000 * 60 * 2, // 2 minutos
  });
};
