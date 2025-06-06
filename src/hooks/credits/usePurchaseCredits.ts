
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const usePurchaseCredits = () => {
  const [isLoading, setIsLoading] = useState(false);

  const purchaseCredits = async (credits: number) => {
    setIsLoading(true);
    
    try {
      console.log('💰 Iniciando compra de créditos...', { credits });
      
      const { data, error } = await supabase.functions.invoke('purchase-credits', {
        body: { credits }
      });

      console.log('📊 Resposta da compra:', { data, error });

      if (error) {
        console.error('❌ Erro na edge function:', error);
        toast.error(`Erro ao processar compra: ${error.message}`);
        return { success: false, error: error.message };
      }

      if (data?.error && !data?.demo) {
        console.error('❌ Erro retornado pela função:', data.error);
        toast.error(data.error);
        return { success: false, error: data.error };
      }

      if (data?.demo) {
        console.log('✅ Compra simulada realizada');
        toast.success(data.message || `Compra simulada: ${credits} créditos adicionados!`);
        return { success: true, demo: true, credits: data.credits };
      }

      if (data?.url) {
        console.log('✅ Redirecionando para checkout do Stripe');
        toast.success('Redirecionando para o pagamento...');
        window.open(data.url, '_blank');
        return { success: true, redirected: true };
      }

      console.warn('⚠️ Resposta inesperada:', data);
      toast.warning('Resposta inesperada do servidor');
      return { success: false, error: 'Resposta inesperada' };

    } catch (err) {
      console.error('❌ Erro ao processar compra:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      toast.error('Erro ao processar compra de créditos');
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    purchaseCredits,
    isLoading
  };
};
