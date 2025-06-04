
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CRMLead } from '@/types/crm.types';

export const useCRMLeadDetail = (leadId: string) => {
  return useQuery({
    queryKey: ['crm-lead-detail', leadId],
    queryFn: async (): Promise<CRMLead | null> => {
      if (!leadId) return null;

      console.log('🔍 [CRM_LEAD_DETAIL] Buscando detalhes do lead:', leadId);

      // Query simplificada sem FULL JOIN
      const { data: lead, error } = await supabase
        .from('crm_leads')
        .select(`
          *,
          pipeline:crm_pipelines(id, name),
          column:crm_pipeline_columns(id, name, color),
          responsible:profiles!crm_leads_responsible_id_fkey(id, name, email),
          loss_reason:crm_loss_reasons(id, name)
        `)
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

      // Buscar tags separadamente para evitar joins complexos
      const { data: tags } = await supabase
        .from('crm_lead_tags')
        .select(`
          tag:crm_tags(id, name, color)
        `)
        .eq('lead_id', leadId);

      const processedLead: CRMLead = {
        ...lead,
        tags: tags?.map(tagWrapper => tagWrapper.tag).filter(Boolean) || []
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
