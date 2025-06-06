
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CreditStatus } from '@/types/credits.types';
import { useAuth } from '@/hooks/auth';

export const useCreditStatus = () => {
  const { user } = useAuth();
  const [creditStatus, setCreditStatus] = useState<CreditStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCredits = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      setError('Usuário não autenticado');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔍 Buscando créditos do usuário...');

      const { data, error: functionError } = await supabase.functions.invoke('check-credits');
      
      if (functionError) {
        console.error('❌ Erro na função check-credits:', functionError);
        throw new Error(functionError.message || 'Erro ao verificar créditos');
      }
      
      if (data?.error) {
        console.warn('⚠️ Erro retornado pela função:', data.error);
        setError(data.error);
      }
      
      if (!data || !data.credits) {
        throw new Error('Dados de créditos inválidos');
      }

      setCreditStatus(data);
      console.log('✅ Créditos carregados:', data.credits.current);

    } catch (err) {
      console.error('❌ Erro ao buscar créditos:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar créditos';
      setError(errorMessage);
      
      // Dados padrão em caso de erro
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
  }, [user]);

  const refreshCredits = useCallback(() => {
    console.log('🔄 Refresh manual de créditos');
    return fetchCredits();
  }, [fetchCredits]);

  useEffect(() => {
    if (user) {
      fetchCredits();
    } else {
      setIsLoading(false);
      setCreditStatus(null);
      setError('Usuário não autenticado');
    }
  }, [user, fetchCredits]);

  return {
    creditStatus,
    isLoading,
    error,
    refreshCredits
  };
};
