
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CRMLeadInput } from '@/types/crm.types';
import { toast } from 'sonner';

export const useCRMLeadUpdate = () => {
  const [updating, setUpdating] = useState(false);

  const updateLead = async (leadId: string, updates: Partial<CRMLeadInput>) => {
    try {
      setUpdating(true);
      const { data, error } = await supabase
        .from('crm_leads')
        .update(updates)
        .eq('id', leadId)
        .select()
        .single();

      if (error) throw error;
      toast.success('Lead atualizado com sucesso');
      return data;
    } catch (error) {
      console.error('Erro ao atualizar lead:', error);
      toast.error('Erro ao atualizar lead');
      throw error;
    } finally {
      setUpdating(false);
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
      
      toast.success('Tags atualizadas com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar tags do lead:', error);
      toast.error('Erro ao atualizar tags');
      throw error;
    }
  };

  return {
    updateLead,
    updateLeadTags,
    updating
  };
};
