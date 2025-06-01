
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CRMLossReason } from '@/types/crm.types';

export const useCRMLossReasons = () => {
  const queryClient = useQueryClient();

  const { data: lossReasons = [], isLoading, refetch } = useQuery({
    queryKey: ['crm-loss-reasons'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('crm_loss_reasons')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data as CRMLossReason[];
    }
  });

  const createLossReasonMutation = useMutation({
    mutationFn: async (data: Omit<CRMLossReason, 'id' | 'created_at' | 'updated_at'>) => {
      const { error } = await supabase
        .from('crm_loss_reasons')
        .insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-loss-reasons'] });
      toast.success('Motivo de perda criado com sucesso');
    },
    onError: () => {
      toast.error('Erro ao criar motivo de perda');
    }
  });

  const updateLossReasonMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CRMLossReason> }) => {
      const { error } = await supabase
        .from('crm_loss_reasons')
        .update(data)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-loss-reasons'] });
      toast.success('Motivo de perda atualizado com sucesso');
    },
    onError: () => {
      toast.error('Erro ao atualizar motivo de perda');
    }
  });

  const deleteLossReasonMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('crm_loss_reasons')
        .update({ is_active: false })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-loss-reasons'] });
      toast.success('Motivo de perda excluído com sucesso');
    },
    onError: () => {
      toast.error('Erro ao excluir motivo de perda');
    }
  });

  const updateSortOrderMutation = useMutation({
    mutationFn: async (reasons: { id: string; sort_order: number }[]) => {
      for (const reason of reasons) {
        const { error } = await supabase
          .from('crm_loss_reasons')
          .update({ sort_order: reason.sort_order })
          .eq('id', reason.id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-loss-reasons'] });
      toast.success('Ordem dos motivos atualizada');
    },
    onError: () => {
      toast.error('Erro ao atualizar ordem dos motivos');
    }
  });

  return {
    lossReasons,
    isLoading,
    refetch,
    createLossReason: createLossReasonMutation.mutate,
    updateLossReason: updateLossReasonMutation.mutate,
    deleteLossReason: deleteLossReasonMutation.mutate,
    updateSortOrder: updateSortOrderMutation.mutate,
    isCreating: createLossReasonMutation.isPending,
    isUpdating: updateLossReasonMutation.isPending,
    isDeleting: deleteLossReasonMutation.isPending,
  };
};
