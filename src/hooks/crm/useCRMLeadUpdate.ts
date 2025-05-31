
import { supabase } from '@/integrations/supabase/client';
import { CRMLeadInput } from '@/types/crm.types';

export const useCRMLeadUpdate = () => {
  const updateLead = async (leadId: string, updates: Partial<CRMLeadInput>) => {
    try {
      const { data, error } = await supabase
        .from('crm_leads')
        .update(updates)
        .eq('id', leadId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao atualizar lead:', error);
      throw error;
    }
  };

  const updateLeadTags = async (leadId: string, tagIds: string[]) => {
    try {
      // Remover tags existentes
      await supabase
        .from('crm_lead_tags')
        .delete()
        .eq('lead_id', leadId);

      // Adicionar novas tags
      if (tagIds.length > 0) {
        const tagInserts = tagIds.map(tagId => ({
          lead_id: leadId,
          tag_id: tagId
        }));

        const { error } = await supabase
          .from('crm_lead_tags')
          .insert(tagInserts);

        if (error) throw error;
      }
    } catch (error) {
      console.error('Erro ao atualizar tags do lead:', error);
      throw error;
    }
  };

  return {
    updateLead,
    updateLeadTags
  };
};
