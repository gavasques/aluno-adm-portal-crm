
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CRMLossReason } from '@/types/crm.types';
import { toast } from 'sonner';

export const useCRMLossReasons = () => {
  const queryClient = useQueryClient();

  const { data: lossReasons = [], isLoading, error } = useQuery({
    queryKey: ['crm', 'loss-reasons'],
    queryFn: async (): Promise<CRMLossReason[]> => {
      console.log('📋 [LOSS_REASONS] Buscando motivos de perda...');
      
      const { data, error } = await supabase
        .from('crm_loss_reasons')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('❌ [LOSS_REASONS] Erro ao buscar motivos de perda:', error);
        throw error;
      }

      console.log('📋 [LOSS_REASONS] Motivos de perda carregados:', data.length);
      return data || [];
    },
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 30 * 60 * 1000, // 30 minutos
  });

  const createLossReasonMutation = useMutation({
    mutationFn: async (data: Omit<CRMLossReason, 'id' | 'created_at' | 'updated_at'>) => {
      const { data: result, error } = await supabase
        .from('crm_loss_reasons')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm', 'loss-reasons'] });
      toast.success('Motivo de perda criado com sucesso');
    },
    onError: (error) => {
      console.error('Erro ao criar motivo de perda:', error);
      toast.error('Erro ao criar motivo de perda');
    }
  });

  const updateLossReasonMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CRMLossReason> }) => {
      const { data: result, error } = await supabase
        .from('crm_loss_reasons')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm', 'loss-reasons'] });
      toast.success('Motivo de perda atualizado com sucesso');
    },
    onError: (error) => {
      console.error('Erro ao atualizar motivo de perda:', error);
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
      queryClient.invalidateQueries({ queryKey: ['crm', 'loss-reasons'] });
      toast.success('Motivo de perda removido com sucesso');
    },
    onError: (error) => {
      console.error('Erro ao remover motivo de perda:', error);
      toast.error('Erro ao remover motivo de perda');
    }
  });

  const updateSortOrderMutation = useMutation({
    mutationFn: async (reasons: { id: string; sort_order: number }[]) => {
      const updates = reasons.map(reason => 
        supabase
          .from('crm_loss_reasons')
          .update({ sort_order: reason.sort_order })
          .eq('id', reason.id)
      );

      const results = await Promise.all(updates);
      
      for (const result of results) {
        if (result.error) throw result.error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm', 'loss-reasons'] });
      toast.success('Ordem atualizada com sucesso');
    },
    onError: (error) => {
      console.error('Erro ao atualizar ordem:', error);
      toast.error('Erro ao atualizar ordem');
    }
  });

  return {
    lossReasons,
    loading: isLoading,
    error,
    isLoading,
    createLossReason: createLossReasonMutation.mutate,
    updateLossReason: updateLossReasonMutation.mutate,
    deleteLossReason: deleteLossReasonMutation.mutate,
    updateSortOrder: updateSortOrderMutation.mutate,
  };
};
