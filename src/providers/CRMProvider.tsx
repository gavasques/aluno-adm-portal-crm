
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CRMProvider as CRMContextProvider } from '@/contexts/CRMContext';

// Query client otimizado para CRM com configurações de CORS melhoradas
const createCRMQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 2 * 60 * 1000, // 2 minutos
        gcTime: 10 * 60 * 1000, // 10 minutos
        
        retry: (failureCount, error: any) => {
          if (error?.status === 401 || error?.status === 403) {
            return false;
          }
          
          if (error?.message?.includes('CORS') || 
              error?.message?.includes('cross-origin') ||
              error?.message?.includes('Access-Control-Allow-Origin')) {
            console.log('❌ [CRM_PROVIDER] Erro de CORS detectado, não fazendo retry');
            return false;
          }
          
          return failureCount < 1;
        },
        
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        refetchOnMount: 'always',
        networkMode: 'always',
      },
      
      mutations: {
        retry: (failureCount, error: any) => {
          if (error?.message?.includes('CORS') || 
              error?.message?.includes('cross-origin')) {
            return false;
          }
          return failureCount < 1;
        },
        
        onError: (error: any) => {
          console.error('❌ [CRM_MUTATION] Erro em mutation:', error);
          
          if (error?.message?.includes('CORS')) {
            console.error('🚫 [CRM_MUTATION] Erro de CORS detectado - verifique configurações do Supabase');
          }
        },
        
        networkMode: 'always',
      }
    }
  });
};

// Cliente singleton para CRM
const crmQueryClient = createCRMQueryClient();

interface CRMProviderProps {
  children: React.ReactNode;
}

/**
 * Provider unificado para todo o sistema CRM
 * Integra React Query e Context corretamente
 */
export const UnifiedCRMProvider: React.FC<CRMProviderProps> = ({ children }) => {
  console.log('🚀 [UNIFIED_CRM_PROVIDER] Inicializando provider unificado');

  React.useEffect(() => {
    const handleOnline = () => {
      console.log('🌐 [CRM_PROVIDER] Conexão online detectada');
      crmQueryClient.refetchQueries();
    };

    const handleOffline = () => {
      console.log('📴 [CRM_PROVIDER] Conexão offline detectada');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

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

export default UnifiedCRMProvider;
