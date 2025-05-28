
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CreditStatus } from '@/types/credits.types';
import { toast } from 'sonner';

export const useCredits = () => {
  const [creditStatus, setCreditStatus] = useState<CreditStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCredits = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase.functions.invoke('check-credits');
      
      if (error) throw error;
      
      setCreditStatus(data);

      // Mostrar alertas se necessário
      if (data.alerts.noCredits) {
        toast.error('Seus créditos acabaram! Adquira mais créditos para continuar usando o sistema.');
      } else if (data.alerts.lowCredits) {
        toast.warning('Atenção: Você já usou 90% dos seus créditos mensais.');
      }
    } catch (err) {
      console.error('Error fetching credits:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar créditos');
      toast.error('Erro ao carregar informações de créditos');
    } finally {
      setIsLoading(false);
    }
  };

  const consumeCredits = async (amount: number = 1, description: string = 'Uso de funcionalidade') => {
    try {
      const { data, error } = await supabase.functions.invoke('consume-credits', {
        body: { amount, description }
      });

      if (error) throw error;

      if (data.error) {
        toast.error(data.error);
        return false;
      }

      toast.success(`${amount} crédito(s) consumido(s). Restam ${data.remainingCredits} créditos.`);
      await fetchCredits(); // Atualizar status
      return true;
    } catch (err) {
      console.error('Error consuming credits:', err);
      toast.error('Erro ao consumir créditos');
      return false;
    }
  };

  const purchaseCredits = async (credits: number) => {
    try {
      const { data, error } = await supabase.functions.invoke('purchase-credits', {
        body: { credits }
      });

      if (error) throw error;

      if (data.demo) {
        toast.success(`Compra simulada: ${credits} créditos adicionados! (Modo demonstração)`);
        await fetchCredits();
        return true;
      }

      if (data.url) {
        window.open(data.url, '_blank');
        return true;
      }

      return false;
    } catch (err) {
      console.error('Error purchasing credits:', err);
      toast.error('Erro ao processar compra de créditos');
      return false;
    }
  };

  const subscribeCredits = async (monthlyCredits: number) => {
    try {
      const { data, error } = await supabase.functions.invoke('subscribe-credits', {
        body: { monthlyCredits }
      });

      if (error) throw error;

      if (data.demo) {
        toast.success(`Assinatura simulada: +${monthlyCredits} créditos/mês ativada! (Modo demonstração)`);
        await fetchCredits();
        return true;
      }

      if (data.url) {
        window.open(data.url, '_blank');
        return true;
      }

      return false;
    } catch (err) {
      console.error('Error subscribing credits:', err);
      toast.error('Erro ao processar assinatura de créditos');
      return false;
    }
  };

  useEffect(() => {
    fetchCredits();
  }, []);

  return {
    creditStatus,
    isLoading,
    error,
    fetchCredits,
    consumeCredits,
    purchaseCredits,
    subscribeCredits
  };
};
