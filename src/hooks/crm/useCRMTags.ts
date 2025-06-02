
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CRMTag } from '@/types/crm.types';
import { toast } from 'sonner';

export const useCRMTags = () => {
  const queryClient = useQueryClient();

  const { data: tags = [], isLoading } = useQuery({
    queryKey: ['crm-tags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('crm_tags')
        .select('*')
        .order('name');

      if (error) throw error;

      return data as CRMTag[];
    }
  });

  const createTagMutation = useMutation({
    mutationFn: async ({ name, color }: { name: string; color: string }) => {
      const { data, error } = await supabase
        .from('crm_tags')
        .insert({ name, color })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-tags'] });
      toast.success('Tag criada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao criar tag:', error);
      toast.error('Erro ao criar tag');
    }
  });

  const updateTagMutation = useMutation({
    mutationFn: async ({ id, name, color }: { id: string; name: string; color: string }) => {
      const { error } = await supabase
        .from('crm_tags')
        .update({ name, color })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-tags'] });
      toast.success('Tag atualizada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar tag:', error);
      toast.error('Erro ao atualizar tag');
    }
  });

  const deleteTagMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('crm_tags')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-tags'] });
      toast.success('Tag excluída com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao excluir tag:', error);
      toast.error('Erro ao excluir tag');
    }
  });

  const createTag = (name: string, color: string) => {
    return createTagMutation.mutateAsync({ name, color });
  };

  const updateTag = (id: string, name: string, color: string) => {
    return updateTagMutation.mutateAsync({ id, name, color });
  };

  const deleteTag = (id: string) => {
    return deleteTagMutation.mutateAsync(id);
  };

  return {
    tags,
    loading: isLoading,
    createTag,
    updateTag,
    deleteTag
  };
};
