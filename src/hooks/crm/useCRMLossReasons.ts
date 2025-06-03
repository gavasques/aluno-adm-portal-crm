
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CRMLossReason } from '@/types/crm.types';

export const useCRMLossReasons = () => {
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

  return {
    lossReasons,
    loading: isLoading,
    error
  };
};
