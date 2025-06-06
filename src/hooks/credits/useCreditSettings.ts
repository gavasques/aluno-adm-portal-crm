
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface CreditPackage {
  id: string;
  credits: number;
  price: number;
  original_price: number;
  discount_percentage: number;
  is_popular: boolean;
  is_active: boolean;
  sort_order: number;
  stripe_price_id: string | null;
}

export interface SystemCreditSettings {
  monthly_free_credits: number;
  credit_base_price: number;
  enable_purchases: boolean;
  enable_subscriptions: boolean;
  low_credit_threshold: number;
}

export interface CreditSubscriptionPlan {
  id: string;
  name: string;
  monthly_credits: number;
  price: number;
  is_popular: boolean;
  is_active: boolean;
  sort_order: number;
  stripe_price_id: string | null;
  description: string | null;
}

export interface CreditSettingsData {
  systemSettings: SystemCreditSettings;
  packages: CreditPackage[];
  subscriptionPlans: CreditSubscriptionPlan[];
}

export const useCreditSettings = () => {
  const queryClient = useQueryClient();

  const { data: creditSettings, isLoading, error } = useQuery({
    queryKey: ['credit-settings'],
    queryFn: async (): Promise<CreditSettingsData> => {
      console.log('🔍 Buscando configurações de créditos...');
      
      const { data, error } = await supabase.functions.invoke('get-credit-settings');
      
      if (error) {
        console.error('❌ Erro na edge function:', error);
        throw new Error('Erro ao buscar configurações de créditos');
      }
      
      if (!data.success) {
        throw new Error(data.error || 'Erro desconhecido');
      }
      
      console.log('✅ Configurações carregadas:', data.data);
      return data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 1
  });

  const updateSystemSetting = useMutation({
    mutationFn: async ({ key, value, type }: { key: string; value: string; type: string }) => {
      const { error } = await supabase
        .from('system_credit_settings')
        .update({ 
          setting_value: value,
          setting_type: type,
          updated_at: new Date().toISOString()
        })
        .eq('setting_key', key);

      if (error) {
        throw new Error(`Erro ao atualizar configuração: ${error.message}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credit-settings'] });
      toast.success('Configuração atualizada com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar configuração:', error);
      toast.error(error.message);
    }
  });

  const updateCreditPackage = useMutation({
    mutationFn: async (packageData: Partial<CreditPackage> & { id: string }) => {
      const { error } = await supabase
        .from('credit_packages')
        .update({
          ...packageData,
          updated_at: new Date().toISOString()
        })
        .eq('id', packageData.id);

      if (error) {
        throw new Error(`Erro ao atualizar pacote: ${error.message}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credit-settings'] });
      toast.success('Pacote atualizado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar pacote:', error);
      toast.error(error.message);
    }
  });

  const createCreditPackage = useMutation({
    mutationFn: async (packageData: Omit<CreditPackage, 'id'>) => {
      const { error } = await supabase
        .from('credit_packages')
        .insert(packageData);

      if (error) {
        throw new Error(`Erro ao criar pacote: ${error.message}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credit-settings'] });
      toast.success('Pacote criado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao criar pacote:', error);
      toast.error(error.message);
    }
  });

  const deleteCreditPackage = useMutation({
    mutationFn: async (packageId: string) => {
      const { error } = await supabase
        .from('credit_packages')
        .update({ is_active: false })
        .eq('id', packageId);

      if (error) {
        throw new Error(`Erro ao desativar pacote: ${error.message}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credit-settings'] });
      toast.success('Pacote desativado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao desativar pacote:', error);
      toast.error(error.message);
    }
  });

  // Mutations para planos de assinatura
  const updateSubscriptionPlan = useMutation({
    mutationFn: async (planData: Partial<CreditSubscriptionPlan> & { id: string }) => {
      const { error } = await supabase
        .from('credit_subscription_plans')
        .update({
          ...planData,
          updated_at: new Date().toISOString()
        })
        .eq('id', planData.id);

      if (error) {
        throw new Error(`Erro ao atualizar plano: ${error.message}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credit-settings'] });
      toast.success('Plano atualizado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao atualizar plano:', error);
      toast.error(error.message);
    }
  });

  const createSubscriptionPlan = useMutation({
    mutationFn: async (planData: Omit<CreditSubscriptionPlan, 'id'>) => {
      const { error } = await supabase
        .from('credit_subscription_plans')
        .insert(planData);

      if (error) {
        throw new Error(`Erro ao criar plano: ${error.message}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credit-settings'] });
      toast.success('Plano criado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao criar plano:', error);
      toast.error(error.message);
    }
  });

  const deleteSubscriptionPlan = useMutation({
    mutationFn: async (planId: string) => {
      const { error } = await supabase
        .from('credit_subscription_plans')
        .update({ is_active: false })
        .eq('id', planId);

      if (error) {
        throw new Error(`Erro ao desativar plano: ${error.message}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credit-settings'] });
      toast.success('Plano desativado com sucesso!');
    },
    onError: (error) => {
      console.error('Erro ao desativar plano:', error);
      toast.error(error.message);
    }
  });

  return {
    creditSettings,
    isLoading,
    error,
    updateSystemSetting,
    updateCreditPackage,
    createCreditPackage,
    deleteCreditPackage,
    updateSubscriptionPlan,
    createSubscriptionPlan,
    deleteSubscriptionPlan
  };
};
