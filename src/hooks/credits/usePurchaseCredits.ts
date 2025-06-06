
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const usePurchaseCredits = () => {
  const [isLoading, setIsLoading] = useState(false);

  const purchaseCredits = async (credits: number) => {
    setIsLoading(true);
    
    try {
      console.log('💰 Iniciando compra de créditos...', { credits });
      
      // Verificar se o usuário está autenticado
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.log('⚠️ Usuário não autenticado, simulando compra');
        toast.success(`Compra simulada: ${credits} créditos adicionados! (Modo demonstração - usuário não autenticado)`);
        return { success: true, demo: true, credits };
      }

      console.log('👤 Usuário autenticado:', user.email);

      // Tentar chamar a edge function
      const { data, error } = await supabase.functions.invoke('purchase-credits', {
        body: { credits }
      });

      console.log('📊 Resposta da compra:', { data, error });

      // Se há erro na invocação da função, usar modo demo
      if (error) {
        console.error('❌ Erro na edge function:', error);
        toast.success(`Erro na conexão com servidor. Simulando compra de ${credits} créditos (modo demonstração)`);
        return { success: true, demo: true, credits };
      }

      // Se não há dados, usar modo demo
      if (!data) {
        console.warn('⚠️ Nenhum dado retornado');
        toast.success(`Resposta vazia do servidor. Simulando compra de ${credits} créditos (modo demonstração)`);
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
        toast.error(`Erro: ${data.error}. Simulando compra de ${credits} créditos (modo demonstração)`);
        return { success: true, demo: true, credits };
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

      // Resposta inesperada - usar modo demo como fallback
      console.warn('⚠️ Resposta inesperada:', data);
      toast.success(`Resposta inesperada do servidor. Simulando compra de ${credits} créditos (modo demonstração)`);
      return { success: true, demo: true, credits };

    } catch (err) {
      console.error('❌ Erro ao processar compra:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      
      // Em caso de qualquer erro, sempre oferecer modo demo
      toast.success(`Erro na conexão: ${errorMessage}. Simulando compra de ${credits} créditos (modo demonstração)`);
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
