import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CRMLeadInput } from '@/types/crm.types';
import { toast } from 'sonner';

export const useCRMLeadUpdate = () => {
  const [updating, setUpdating] = useState(false);

  const updateLead = async (leadId: string, data: Partial<CRMLeadInput>) => {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('crm_leads')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('id', leadId);

      if (error) throw error;
      
      toast.success('Lead atualizado com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro ao atualizar lead:', error);
      toast.error('Erro ao atualizar lead');
      return false;
    } finally {
      setUpdating(false);
    }
  };

  const updateLeadTags = async (leadId: string, tagIds: string[]) => {
    try {
      // Primeiro, remover todas as tags do lead
      const { error: deleteError } = await supabase
        .from('crm_lead_tags')
        .delete()
        .eq('lead_id', leadId);

      if (deleteError) throw deleteError;

      // Depois, adicionar as novas tags
      if (tagIds.length > 0) {
        const { error: insertError } = await supabase
          .from('crm_lead_tags')
          .insert(tagIds.map(tagId => ({ lead_id: leadId, tag_id: tagId })));

        if (insertError) throw insertError;
      }

      toast.success('Tags atualizadas com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro ao atualizar tags:', error);
      toast.error('Erro ao atualizar tags');
      return false;
    }
  };

  const assignResponsible = async (leadId: string, responsibleId: string | null) => {
    try {
      const { error } = await supabase
        .from('crm_leads')
        .update({ 
          responsible_id: responsibleId,
          updated_at: new Date().toISOString()
        })
        .eq('id', leadId);

      if (error) throw error;
      
      toast.success('Responsável atualizado com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro ao atribuir responsável:', error);
      toast.error('Erro ao atribuir responsável');
      return false;
    }
  };

  const moveToColumn = async (leadId: string, columnId: string) => {
    try {
      const { error } = await supabase
        .from('crm_leads')
        .update({ 
          column_id: columnId,
          updated_at: new Date().toISOString()
        })
        .eq('id', leadId);

      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Erro ao mover lead:', error);
      toast.error('Erro ao mover lead');
      return false;
    }
  };

  return {
    updating,
    updateLead,
    updateLeadTags,
    assignResponsible,
    moveToColumn
  };
};
