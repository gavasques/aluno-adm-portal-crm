
import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Configuração otimizada do QueryClient para mentorias
const createMentoringQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Configurações padrão para queries
        staleTime: 5 * 60 * 1000, // 5 minutos
        gcTime: 10 * 60 * 1000, // 10 minutos (anteriormente cacheTime)
        retry: (failureCount, error: any) => {
          // Retry lógico baseado no tipo de erro
          if (error?.status === 404) return false;
          if (error?.status >= 500) return failureCount < 2;
          return failureCount < 1;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
      },
      mutations: {
        // Configurações padrão para mutations
        retry: false,
        onError: (error) => {
          console.error('Mutation error:', error);
        }
      }
    }
  });
};

interface MentoringQueryProviderProps {
  children: ReactNode;
  client?: QueryClient;
}

export const MentoringQueryProvider: React.FC<MentoringQueryProviderProps> = ({ 
  children, 
  client 
}) => {
  const queryClient = client || createMentoringQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

// Hook para acessar o QueryClient
export const useMentoringQueryClient = () => {
  const queryClient = new QueryClient();
  return queryClient;
};
