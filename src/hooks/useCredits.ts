
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CreditStatus } from '@/types/credits.types';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/auth';

export const useCredits = () => {
  const { user } = useAuth();
  const [creditStatus, setCreditStatus] = useState<CreditStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<number>(0);

  const fetchCredits = useCallback(async (forceRefresh = false) => {
    console.log('🔍 useCredits: Iniciando fetchCredits...', { user: user?.email, forceRefresh });
    
    if (!user) {
      console.log('🔍 useCredits: Usuário não autenticado');
      setIsLoading(false);
      setError('Usuário não autenticado');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      // Cache por 10 segundos, a menos que seja refresh forçado
      const now = Date.now();
      if (!forceRefresh && lastFetch && (now - lastFetch) < 10000) {
        console.log('🔄 useCredits: Usando cache de créditos');
        setIsLoading(false);
        return;
      }
      
      console.log('🔍 useCredits: Chamando edge function check-credits...');

      const { data, error: functionError } = await supabase.functions.invoke('check-credits');
      
      console.log('📊 useCredits: Resposta da função check-credits:', { data, error: functionError });
      
      if (functionError) {
        console.error('❌ useCredits: Erro na função check-credits:', functionError);
        throw new Error(functionError.message || 'Erro ao verificar créditos');
      }
      
      // Verificar se há erro na resposta mas ainda há dados
      if (data?.error) {
        console.warn('⚠️ useCredits: Erro retornado pela função:', data.error);
        setError(data.error);
        // Continuar processando se houver dados
      }
      
      // Validar estrutura dos dados
      if (!data || !data.credits) {
        console.error('❌ useCredits: Dados inválidos retornados:', data);
        throw new Error('Dados de créditos inválidos');
      }

      setCreditStatus(data);
      setLastFetch(now);

      console.log('✅ useCredits: Créditos carregados com sucesso:', {
        current: data.credits.current,
        transactions: data.transactions?.length || 0,
        subscription: !!data.subscription
      });

      // Mostrar alertas se necessário (apenas se não for um refresh manual)
      if (!forceRefresh) {
        if (data.alerts?.noCredits) {
          toast.error('Seus créditos acabaram! Adquira mais créditos para continuar usando o sistema.');
        } else if (data.alerts?.lowCredits) {
          toast.warning('Atenção: Você já usou 90% dos seus créditos mensais.');
        }
      }
    } catch (err) {
      console.error('❌ useCredits: Erro ao buscar créditos:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar créditos';
      setError(errorMessage);
      
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
  }, [user, lastFetch]);

  const refreshCredits = useCallback(() => {
    console.log('🔄 useCredits: Refresh manual de créditos');
    return fetchCredits(true);
  }, [fetchCredits]);

  const consumeCredits = async (amount: number = 1, description: string = 'Uso de funcionalidade') => {
    try {
      console.log('💳 useCredits: Consumindo créditos...', { amount, description });
      
      const { data, error } = await supabase.functions.invoke('consume-credits', {
        body: { amount, description }
      });

      if (error) {
        console.error('❌ useCredits: Erro ao consumir créditos:', error);
        throw error;
      }

      if (data?.error) {
        console.error('❌ useCredits: Erro retornado ao consumir créditos:', data.error);
        toast.error(data.error);
        return false;
      }

      console.log('✅ useCredits: Créditos consumidos com sucesso:', data);
      toast.success(`${amount} crédito(s) consumido(s). Restam ${data.remainingCredits} créditos.`);
      
      // Refresh automático após consumo
      setTimeout(() => refreshCredits(), 1000);
      
      return true;
    } catch (err) {
      console.error('❌ useCredits: Erro ao consumir créditos:', err);
      toast.error('Erro ao consumir créditos');
      return false;
    }
  };

  const purchaseCredits = async (credits: number) => {
    try {
      console.log('💰 useCredits: Comprando créditos...', { credits });
      
      const { data, error } = await supabase.functions.invoke('purchase-credits', {
        body: { credits }
      });

      if (error) {
        console.error('❌ useCredits: Erro ao comprar créditos:', error);
        throw error;
      }

      if (data?.demo) {
        console.log('✅ useCredits: Compra simulada realizada');
        toast.success(`Compra simulada: ${credits} créditos adicionados! (Modo demonstração)`);
        await refreshCredits();
        return true;
      }

      if (data?.url) {
        console.log('✅ useCredits: Redirecionando para checkout');
        window.open(data.url, '_blank');
        return true;
      }

      return false;
    } catch (err) {
      console.error('❌ useCredits: Erro ao processar compra:', err);
      toast.error('Erro ao processar compra de créditos');
      return false;
    }
  };

  const subscribeCredits = async (monthlyCredits: number) => {
    try {
      console.log('📱 useCredits: Criando assinatura...', { monthlyCredits });
      
      const { data, error } = await supabase.functions.invoke('subscribe-credits', {
        body: { monthlyCredits }
      });

      if (error) {
        console.error('❌ useCredits: Erro ao criar assinatura:', error);
        throw error;
      }

      if (data?.demo) {
        console.log('✅ useCredits: Assinatura simulada criada');
        toast.success(`Assinatura simulada: +${monthlyCredits} créditos/mês ativada! (Modo demonstração)`);
        await refreshCredits();
        return true;
      }

      if (data?.url) {
        console.log('✅ useCredits: Redirecionando para assinatura');
        window.open(data.url, '_blank');
        return true;
      }

      return false;
    } catch (err) {
      console.error('❌ useCredits: Erro ao processar assinatura:', err);
      toast.error('Erro ao processar assinatura de créditos');
      return false;
    }
  };

  useEffect(() => {
    console.log('🔄 useCredits: useEffect iniciado', { user: user?.email });
    if (user) {
      fetchCredits();
    } else {
      setIsLoading(false);
      setCreditStatus(null);
      setError('Usuário não autenticado');
    }
  }, [user, fetchCredits]);

  // Listener para mudanças na autenticação
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔐 useCredits: Auth state changed:', event);
      if (event === 'SIGNED_IN' && session) {
        console.log('🔐 useCredits: Usuário logado, atualizando créditos');
        refreshCredits();
      } else if (event === 'SIGNED_OUT') {
        console.log('🚪 useCredits: Usuário deslogado, limpando créditos');
        setCreditStatus(null);
        setLastFetch(0);
        setError(null);
        setIsLoading(false);
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
