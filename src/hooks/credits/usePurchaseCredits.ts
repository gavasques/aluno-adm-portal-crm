
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
        // Fallback para modo demo se houver erro na function
        toast.warning(`Erro na conexão: ${error.message}. Simulando compra de ${credits} créditos (modo demonstração)`);
        return { success: true, demo: true, credits };
      }

      // Se não há dados, tratar como erro
      if (!data) {
        console.warn('⚠️ Nenhum dado retornado');
        toast.warning(`Resposta vazia do servidor. Simulando compra de ${credits} créditos (modo demonstração)`);
        return { success: true, demo: true, credits };
      }

      // Se há erro nos dados mas é modo demo
      if (data?.error && data?.demo) {
        console.log('✅ Modo demo ativado:', data.message);
        toast.success(data.message || `Compra simulada: ${credits} créditos adicionados! (Modo demonstração)`);
        return { success: true, demo: true, credits: data.credits || credits };
      }

      // Se há erro nos dados e não é modo demo
      if (data?.error && !data?.demo) {
        console.error('❌ Erro retornado pela função:', data.error);
        toast.error(data.error);
        return { success: false, error: data.error };
      }

      // Modo demo bem-sucedido
      if (data?.demo) {
        console.log('✅ Compra simulada realizada');
        toast.success(data.message || `Compra simulada: ${credits} créditos adicionados! (Modo demonstração)`);
        return { success: true, demo: true, credits: data.credits || credits };
      }

      // Redirecionamento para Stripe
      if (data?.url) {
        console.log('✅ Redirecionando para checkout do Stripe');
        toast.success('Redirecionando para o pagamento...');
        window.open(data.url, '_blank');
        return { success: true, redirected: true };
      }

      // Resposta inesperada
      console.warn('⚠️ Resposta inesperada:', data);
      toast.warning(`Resposta inesperada. Simulando compra de ${credits} créditos (modo demonstração)`);
      return { success: true, demo: true, credits };

    } catch (err) {
      console.error('❌ Erro ao processar compra:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      
      // Em caso de erro, sempre oferecer modo demo
      toast.warning(`Erro na conexão: ${errorMessage}. Simulando compra de ${credits} créditos (modo demonstração)`);
      return { success: true, demo: true, credits };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    purchaseCredits,
    isLoading
  };
};
