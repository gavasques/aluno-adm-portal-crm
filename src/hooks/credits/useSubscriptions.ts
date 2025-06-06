
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useSubscriptions = () => {
  const createSubscription = useCallback(async (planId: string) => {
    try {
      console.log('📱 Criando assinatura...', { planId });
      
      const { data, error } = await supabase.functions.invoke('create-subscription', {
        body: { plan_id: planId }
      });

      if (error) {
        console.error('❌ Erro ao criar assinatura:', error);
        throw error;
      }

      if (data?.demo) {
        console.log('✅ Assinatura simulada criada');
        toast.success(data.message);
        return { success: true, demo: true };
      }

      if (data?.url) {
        console.log('✅ Redirecionando para checkout de assinatura');
        window.open(data.url, '_blank');
        return { success: true, redirected: true };
      }

      return { success: false };
    } catch (err) {
      console.error('❌ Erro ao processar assinatura:', err);
      toast.error('Erro ao processar assinatura de créditos');
      return { success: false };
    }
  }, []);

  return {
    createSubscription
  };
};
