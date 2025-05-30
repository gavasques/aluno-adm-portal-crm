
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CreditStatus } from '@/types/credits.types';
import { toast } from 'sonner';

export const useCredits = () => {
  const [creditStatus, setCreditStatus] = useState<CreditStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<number>(0);

  const fetchCredits = useCallback(async (forceRefresh = false) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Cache por 10 segundos, a menos que seja refresh forçado
      const now = Date.now();
      if (!forceRefresh && lastFetch && (now - lastFetch) < 10000) {
        console.log('🔄 Usando cache de créditos');
        setIsLoading(false);
        return;
      }
      
      console.log('🔍 Buscando créditos...');

      const { data, error } = await supabase.functions.invoke('check-credits');
      
      console.log('📊 Resposta da função check-credits:', data, error);
      
      if (error) {
        console.error('❌ Erro na função check-credits:', error);
        throw error;
      }
      
      // Verificar se há erro na resposta
      if (data?.error) {
        console.error('❌ Erro retornado pela função:', data.error);
        // Continuar com os dados padrão retornados
      }
      
      setCreditStatus(data);
      setLastFetch(now);

      // Debug logs
      console.log('✅ Créditos carregados:', {
        current: data?.credits?.current,
        transactions: data?.transactions?.length,
        debug: data?.debug
      });

      // Mostrar alertas se necessário
      if (data?.alerts?.noCredits) {
        toast.error('Seus créditos acabaram! Adquira mais créditos para continuar usando o sistema.');
      } else if (data?.alerts?.lowCredits) {
        toast.warning('Atenção: Você já usou 90% dos seus créditos mensais.');
      }
    } catch (err) {
      console.error('❌ Error fetching credits:', err);
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
  }, [lastFetch]);

  const refreshCredits = useCallback(() => {
    console.log('🔄 Refresh manual de créditos');
    return fetchCredits(true);
  }, [fetchCredits]);

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
      
      // Refresh automático após consumo
      setTimeout(() => refreshCredits(), 1000);
      
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
        await refreshCredits();
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
        await refreshCredits();
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
  }, [fetchCredits]);

  // Listener para mudanças na autenticação
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        console.log('🔐 Usuário logado, atualizando créditos');
        refreshCredits();
      } else if (event === 'SIGNED_OUT') {
        console.log('🚪 Usuário deslogado, limpando créditos');
        setCreditStatus(null);
        setLastFetch(0);
      }
    });

    return () => subscription.unsubscribe();
  }, [refreshCredits]);

  return {
    creditStatus,
    isLoading,
    error,
    fetchCredits,
    refreshCredits,
    consumeCredits,
    purchaseCredits,
    subscribeCredits
  };
};
