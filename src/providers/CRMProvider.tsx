
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CRMProvider as CRMContextProvider } from '@/contexts/CRMContext';

// Query client otimizado para CRM com configurações de CORS melhoradas
const createCRMQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Cache mais agressivo para dados CRM
        staleTime: 2 * 60 * 1000, // 2 minutos
        gcTime: 10 * 60 * 1000, // 10 minutos
        
        // Retry customizado para problemas de CORS
        retry: (failureCount, error: any) => {
          // Não retry em erros de CORS ou autenticação
          if (error?.status === 401 || error?.status === 403) {
            return false;
          }
          
          // Detectar erros de CORS
          if (error?.message?.includes('CORS') || 
              error?.message?.includes('cross-origin') ||
              error?.message?.includes('Access-Control-Allow-Origin')) {
            console.log('❌ [CRM_PROVIDER] Erro de CORS detectado, não fazendo retry');
            return false;
          }
          
          // Retry limitado para outros erros
          return failureCount < 1;
        },
        
        // Delay progressivo entre retries
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
        
        // Configurações de refetch otimizadas para ambiente Lovable
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        refetchOnMount: 'always',
        
        // Configuração específica para detectar problemas de rede
        networkMode: 'always',
      },
      
      mutations: {
        // Configurações globais para mutations CRM
        retry: (failureCount, error: any) => {
          // Não retry em erros de CORS
          if (error?.message?.includes('CORS') || 
              error?.message?.includes('cross-origin')) {
            return false;
          }
          return failureCount < 1;
        },
        
        onError: (error: any) => {
          console.error('❌ [CRM_MUTATION] Erro em mutation:', error);
          
          // Log específico para erros de CORS
          if (error?.message?.includes('CORS')) {
            console.error('🚫 [CRM_MUTATION] Erro de CORS detectado - verifique configurações do Supabase');
          }
        },
        
        // Configurações de timeout
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
 * Integra:
 * - React Query para cache e sincronização
 * - Context para estado global
 * - Configurações otimizadas para ambiente Lovable
 * - Tratamento específico de erros de CORS
 */
export const UnifiedCRMProvider: React.FC<CRMProviderProps> = ({ children }) => {
  console.log('🚀 [UNIFIED_CRM_PROVIDER] Inicializando provider unificado (refatorado)');

  // Adicionar listeners para detectar problemas de rede
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

  // Log de status do cliente
  React.useEffect(() => {
    console.log('📊 [CRM_PROVIDER] Status do cliente:', {
      queriesCount: crmQueryClient.getQueryCache().getAll().length,
      mutationsCount: crmQueryClient.getMutationCache().getAll().length,
      isOnline: navigator.onLine
    });
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
