
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CRMProvider as CRMContextProvider } from '@/contexts/CRMContext';
import { createOptimizedQueryClient } from '@/config/queryClient';

// Query client otimizado para CRM
const crmQueryClient = createOptimizedQueryClient();

// Configurações específicas para CRM
crmQueryClient.setDefaultOptions({
  queries: {
    // Cache mais agressivo para dados CRM
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    
    // Retry customizado para CRM
    retry: (failureCount, error: any) => {
      // Não retry em erros de autenticação ou permissão
      if (error?.status === 401 || error?.status === 403) {
        return false;
      }
      // Retry limitado para outros erros
      return failureCount < 2;
    },
    
    // Configurações de refetch otimizadas
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchOnMount: 'always',
  },
  
  mutations: {
    // Configurações globais para mutations CRM
    retry: 1,
    onError: (error: any) => {
      console.error('❌ [CRM_MUTATION] Erro em mutation:', error);
    },
  }
});

interface CRMProviderProps {
  children: React.ReactNode;
}

/**
 * Provider unificado para todo o sistema CRM
 * Integra:
 * - React Query para cache e sincronização
 * - Context para estado global
 * - Real-time subscriptions
 * - Cache management otimizado
 */
export const UnifiedCRMProvider: React.FC<CRMProviderProps> = ({ children }) => {
  console.log('🚀 [UNIFIED_CRM_PROVIDER] Inicializando provider unificado');

  return (
    <QueryClientProvider client={crmQueryClient}>
      <CRMContextProvider>
        {children}
      </CRMContextProvider>
    </QueryClientProvider>
  );
};

// Hook para acessar o query client CRM
export const useCRMQueryClient = () => {
  return crmQueryClient;
};

// Provider alternativo que permite usar query client existente
interface CRMProviderWithClientProps {
  children: React.ReactNode;
  queryClient?: QueryClient;
}

export const CRMProviderWithClient: React.FC<CRMProviderWithClientProps> = ({ 
  children, 
  queryClient 
}) => {
  const client = queryClient || crmQueryClient;
  
  return (
    <QueryClientProvider client={client}>
      <CRMContextProvider>
        {children}
      </CRMContextProvider>
    </QueryClientProvider>
  );
};

export default UnifiedCRMProvider;
