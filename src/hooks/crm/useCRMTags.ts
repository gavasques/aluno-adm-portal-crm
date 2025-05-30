
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

      setTags(prev => [...prev, data]);
      toast.success('Tag criada com sucesso');
      return data;
    } catch (error) {
      console.error('Erro ao criar tag:', error);
      toast.error('Erro ao criar tag');
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
      ));
      
      toast.success('Tag atualizada com sucesso');
    } catch (error) {
      console.error('Erro ao atualizar tag:', error);
      toast.error('Erro ao atualizar tag');
    }
  };

  const deleteTag = async (tagId: string) => {
    try {
      const { error } = await supabase
        .from('crm_tags')
        .delete()
        .eq('id', tagId);

      if (error) throw error;

      setTags(prev => prev.filter(tag => tag.id !== tagId));
      toast.success('Tag removida com sucesso');
    } catch (error) {
      console.error('Erro ao remover tag:', error);
      toast.error('Erro ao remover tag');
    }
  };

  const addTagToLead = async (leadId: string, tagId: string) => {
    try {
      const { error } = await supabase
        .from('crm_lead_tags')
        .insert({ lead_id: leadId, tag_id: tagId });

      if (error) throw error;
      toast.success('Tag adicionada ao lead');
    } catch (error) {
      console.error('Erro ao adicionar tag ao lead:', error);
      toast.error('Erro ao adicionar tag');
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
      toast.success('Tag removida do lead');
    } catch (error) {
      console.error('Erro ao remover tag do lead:', error);
      toast.error('Erro ao remover tag');
    }
  };

  useEffect(() => {
    const loadTags = async () => {
      setLoading(true);
      await fetchTags();
      setLoading(false);
    };

    loadTags();
  }, []);

  return {
    tags,
    loading,
    fetchTags,
    createTag,
    updateTag,
    deleteTag,
    addTagToLead,
    removeTagFromLead
  };
};
