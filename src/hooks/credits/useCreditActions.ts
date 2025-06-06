
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useCreditActions = (refreshCredits: () => void) => {
  const consumeCredits = useCallback(async (amount: number = 1, description: string = 'Uso de funcionalidade') => {
    try {
      console.log('💳 Consumindo créditos...', { amount, description });
      
      const { data, error } = await supabase.functions.invoke('consume-credits', {
        body: { amount, description }
      });

      if (error) {
        console.error('❌ Erro ao consumir créditos:', error);
        throw error;
      }

      if (data?.error) {
        console.error('❌ Erro retornado ao consumir créditos:', data.error);
        toast.error(data.error);
        return false;
      }

      console.log('✅ Créditos consumidos com sucesso:', data);
      toast.success(`${amount} crédito(s) consumido(s). Restam ${data.remainingCredits} créditos.`);
      
      setTimeout(() => refreshCredits(), 1000);
      return true;
    } catch (err) {
      console.error('❌ Erro ao consumir créditos:', err);
      toast.error('Erro ao consumir créditos');
      return false;
    }
  }, [refreshCredits]);

  const purchaseCredits = useCallback(async (credits: number) => {
    try {
      console.log('💰 Iniciando compra de créditos...', { credits });
      toast.loading('Processando compra...', { id: 'purchase-loading' });
      
      const { data, error } = await supabase.functions.invoke('purchase-credits', {
        body: { credits }
      });

      toast.dismiss('purchase-loading');

      if (error) {
        console.error('❌ Erro na função purchase-credits:', error);
        toast.error(`Erro ao processar compra: ${error.message}`);
        return false;
      }

      if (data?.error) {
        console.error('❌ Erro retornado pela função:', data.error);
        toast.error(data.error);
        return false;
      }

      if (data?.demo) {
        console.log('✅ Compra simulada realizada');
        toast.success(`Compra simulada: ${credits} créditos adicionados! (Modo demonstração)`);
        refreshCredits();
        return true;
      }

      if (data?.url) {
        console.log('✅ Redirecionando para checkout do Stripe');
        toast.success('Redirecionando para o pagamento...');
        window.open(data.url, '_blank');
        return true;
      }

      console.warn('⚠️ Resposta inesperada:', data);
      toast.error('Resposta inesperada do servidor');
      return false;

    } catch (err) {
      console.error('❌ Erro ao processar compra:', err);
      toast.dismiss('purchase-loading');
      toast.error('Erro ao processar compra de créditos');
      return false;
    }
  }, [refreshCredits]);

  const subscribeCredits = useCallback(async (monthlyCredits: number) => {
    try {
      console.log('📱 Criando assinatura...', { monthlyCredits });
      
      const { data, error } = await supabase.functions.invoke('subscribe-credits', {
        body: { monthlyCredits }
      });

      if (error) {
        console.error('❌ Erro ao criar assinatura:', error);
        throw error;
      }

      if (data?.demo) {
        console.log('✅ Assinatura simulada criada');
        toast.success(`Assinatura simulada: +${monthlyCredits} créditos/mês ativada! (Modo demonstração)`);
        refreshCredits();
        return true;
      }

      if (data?.url) {
        console.log('✅ Redirecionando para assinatura');
        window.open(data.url, '_blank');
        return true;
      }

      return false;
    } catch (err) {
      console.error('❌ Erro ao processar assinatura:', err);
      toast.error('Erro ao processar assinatura de créditos');
      return false;
    }
  }, [refreshCredits]);

  return {
    consumeCredits,
    purchaseCredits,
    subscribeCredits
  };
};
