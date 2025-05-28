
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
      
      console.log('Iniciando fetch de créditos...');

      const { data, error } = await supabase.functions.invoke('check-credits');
      
      console.log('Resposta da função check-credits:', data, error);
      
      if (error) {
        console.error('Erro na função check-credits:', error);
        throw error;
      }
      
      // Se data.error existe, é um erro tratado pela função
      if (data?.error) {
        console.error('Erro retornado pela função:', data.error);
        // Ainda assim usar os dados padrão retornados
      }
      
      setCreditStatus(data);

      // Mostrar alertas se necessário
      if (data?.alerts?.noCredits) {
        toast.error('Seus créditos acabaram! Adquira mais créditos para continuar usando o sistema.');
      } else if (data?.alerts?.lowCredits) {
        toast.warning('Atenção: Você já usou 90% dos seus créditos mensais.');
      }
    } catch (err) {
      console.error('Error fetching credits:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar créditos');
      
      // Definir dados padrão em caso de erro
      setCreditStatus({
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
      });
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
