
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CRMTag } from '@/types/crm.types';
import { toast } from 'sonner';

export const useOptimizedCRMTags = (options?: { enabled?: boolean }) => {
  const queryClient = useQueryClient();

  // Query otimizada para tags
  const { data: tags = [], isLoading: loading, error } = useQuery({
    queryKey: ['crm-tags'],
    queryFn: async () => {
      console.log('🏷️ Fetching CRM tags...');
      const { data, error } = await supabase
        .from('crm_tags')
        .select('*')
        .order('name');

      if (error) throw error;
      console.log(`✅ Loaded ${data?.length || 0} tags`);
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutos - tags são muito estáticas
    refetchOnWindowFocus: false,
    enabled: options?.enabled !== false // Enabled by default unless explicitly set to false
  });

  const createTag = async (tagData: Omit<CRMTag, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('crm_tags')
        .insert(tagData)
        .select()
        .single();

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['crm-tags'] });
      toast.success('Tag criada com sucesso!');
      return data;
    } catch (error) {
      console.error('Erro ao criar tag:', error);
      toast.error('Erro ao criar tag');
      throw error;
    }
  };

  const updateTag = async (id: string, updates: Partial<CRMTag>) => {
    try {
      const { error } = await supabase
        .from('crm_tags')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['crm-tags'] });
      toast.success('Tag atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar tag:', error);
      toast.error('Erro ao atualizar tag');
      throw error;
    }
  };

  const deleteTag = async (id: string) => {
    try {
      const { error } = await supabase
        .from('crm_tags')
        .delete()
        .eq('id', id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['crm-tags'] });
      toast.success('Tag removida com sucesso!');
    } catch (error) {
      console.error('Erro ao remover tag:', error);
      toast.error('Erro ao remover tag');
      throw error;
    }
  };

  const updateLeadTags = async (leadId: string, tagIds: string[]) => {
    try {
      // Remove todas as tags existentes do lead
      await supabase
        .from('crm_lead_tags')
        .delete()
        .eq('lead_id', leadId);

      // Adiciona as novas tags
      if (tagIds.length > 0) {
        const leadTags = tagIds.map(tagId => ({
          lead_id: leadId,
          tag_id: tagId
        }));

        const { error } = await supabase
          .from('crm_lead_tags')
          .insert(leadTags);

        if (error) throw error;
      }

      // Invalidar cache de leads para atualizar as tags
      queryClient.invalidateQueries({ 
        queryKey: ['optimized-crm-leads'],
        exact: false 
      });
      
      toast.success('Tags do lead atualizadas!');
    } catch (error) {
      console.error('Erro ao atualizar tags do lead:', error);
      toast.error('Erro ao atualizar tags do lead');
      throw error;
    }
  };

  return {
    tags,
    loading,
    error,
    createTag,
    updateTag,
    deleteTag,
    updateLeadTags
  };
};
