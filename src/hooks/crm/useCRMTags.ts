
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CRMTag } from '@/types/crm.types';
import { toast } from 'sonner';

export const useCRMTags = () => {
  const [tags, setTags] = useState<CRMTag[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTags = async () => {
    try {
      const { data, error } = await supabase
        .from('crm_tags')
        .select('*')
        .order('name');

      if (error) throw error;
      setTags(data || []);
    } catch (error) {
      console.error('Erro ao buscar tags:', error);
      toast.error('Erro ao carregar tags');
    } finally {
      setLoading(false);
    }
  };

  const createTag = async (name: string, color: string) => {
    try {
      const { data, error } = await supabase
        .from('crm_tags')
        .insert({ name, color })
        .select()
        .single();

      if (error) throw error;

      setTags(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
      return data;
    } catch (error) {
      console.error('Erro ao criar tag:', error);
      throw error;
    }
  };

  const updateTag = async (tagId: string, name: string, color: string) => {
    try {
      const { error } = await supabase
        .from('crm_tags')
        .update({ name, color })
        .eq('id', tagId);

      if (error) throw error;

      setTags(prev => prev.map(tag => 
        tag.id === tagId ? { ...tag, name, color } : tag
      ).sort((a, b) => a.name.localeCompare(b.name)));
    } catch (error) {
      console.error('Erro ao atualizar tag:', error);
      throw error;
    }
  };

  const deleteTag = async (tagId: string) => {
    try {
      // Primeiro, remover a tag de todos os leads
      const { error: deleteLeadTagsError } = await supabase
        .from('crm_lead_tags')
        .delete()
        .eq('tag_id', tagId);

      if (deleteLeadTagsError) throw deleteLeadTagsError;

      // Depois, excluir a tag
      const { error } = await supabase
        .from('crm_tags')
        .delete()
        .eq('id', tagId);

      if (error) throw error;

      setTags(prev => prev.filter(tag => tag.id !== tagId));
    } catch (error) {
      console.error('Erro ao remover tag:', error);
      throw error;
    }
  };

  const addTagToLead = async (leadId: string, tagId: string) => {
    try {
      const { error } = await supabase
        .from('crm_lead_tags')
        .insert({ lead_id: leadId, tag_id: tagId });

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao adicionar tag ao lead:', error);
      throw error;
    }
  };

  const removeTagFromLead = async (leadId: string, tagId: string) => {
    try {
      const { error } = await supabase
        .from('crm_lead_tags')
        .delete()
        .eq('lead_id', leadId)
        .eq('tag_id', tagId);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao remover tag do lead:', error);
      throw error;
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
    } catch (error) {
      console.error('Erro ao atualizar tags do lead:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  return {
    tags,
    loading,
    fetchTags,
    createTag,
    updateTag,
    deleteTag,
    addTagToLead,
    removeTagFromLead,
    updateLeadTags
  };
};
