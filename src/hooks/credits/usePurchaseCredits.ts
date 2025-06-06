
import { useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const usePurchaseCredits = () => {
  const [isLoading, setIsLoading] = useState(false);

  const purchaseCredits = useCallback(async (credits: number) => {
    setIsLoading(true);
    try {
      console.log('💰 Comprando créditos...', { credits });
      
      const { data, error } = await supabase.functions.invoke('purchase-credits', {
        body: { credits }
      });

      if (error) {
        console.error('❌ Erro ao comprar créditos:', error);
        toast.error('Erro ao processar compra de créditos');
        return { success: false };
      }

      if (data?.demo) {
        console.log('✅ Compra simulada realizada');
        toast.success(data.message || `Compra simulada: ${credits} créditos adicionados! (Modo demonstração)`);
        return { success: true, demo: true };
      }

      if (data?.url) {
        console.log('✅ Redirecionando para checkout');
        window.open(data.url, '_blank');
        return { success: true, redirected: true };
      }

      return { success: false };
    } catch (err) {
      console.error('❌ Erro ao processar compra:', err);
      toast.error('Erro ao processar compra de créditos');
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    purchaseCredits,
    isLoading
  };
};
