
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CreditStatus } from '@/types/credits.types';

export const useCreditStatus = () => {
  const { data: creditStatus, isLoading, error, refetch } = useQuery({
    queryKey: ['user-credits'],
    queryFn: async (): Promise<CreditStatus> => {
      console.log('🔍 Buscando status de créditos do usuário...');
      
      const { data, error } = await supabase.functions.invoke('check-credits');
      
      if (error) {
        console.error('❌ Erro na edge function check-credits:', error);
        // Retornar dados padrão em caso de erro
        return {
          credits: {
            current: 0,
            used: 0,
            limit: 50,
            renewalDate: new Date().toISOString().split('T')[0],
            usagePercentage: 0
          },
          subscription: null,
          transactions: [],
          alerts: {
            lowCredits: false,
            noCredits: true
          }
        };
      }
      
      console.log('✅ Status de créditos carregado:', data);
      return data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutos
    retry: 1
  });

  const refreshCredits = async () => {
    console.log('🔄 Atualizando status de créditos...');
    await refetch();
  };

  return {
    creditStatus,
    isLoading,
    error: error?.message || null,
    refreshCredits
  };
};
