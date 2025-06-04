
import { QueryClient } from '@tanstack/react-query';

// Optimized query client configuration with CORS handling
export const createOptimizedQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Increase stale time for better performance
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 15 * 60 * 1000, // 15 minutes (increased from 10)
        
        // Smart retry logic with CORS detection
        retry: (failureCount, error: any) => {
          // Don't retry on CORS errors
          if (error?.message?.includes('CORS') || 
              error?.message?.includes('cross-origin') ||
              error?.message?.includes('Access-Control-Allow-Origin')) {
            console.log('❌ [QUERY_CLIENT] CORS error detected, not retrying');
            return false;
          }
          
          // Don't retry on authentication or permission errors
          if (error?.status === 404 || error?.status === 403 || error?.status === 401) {
            return false;
          }
          
          // Retry on server errors
          if (error?.status >= 500) return failureCount < 2;
          
          // Limited retry for other errors
          return failureCount < 1;
        },
        
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        
        // Enable background refetching for better UX
        refetchOnMount: 'always',
        
        // Reduce network requests with smart refetching
        refetchInterval: false,
        
        // Network mode configuration for CORS handling
        networkMode: 'always',
      },
      mutations: {
        // Don't retry mutations on CORS errors
        retry: (failureCount, error: any) => {
          // Don't retry on CORS errors
          if (error?.message?.includes('CORS') || 
              error?.message?.includes('cross-origin')) {
            console.log('❌ [MUTATION] CORS error detected, not retrying');
            return false;
          }
          return failureCount < 1;
        },
        
        // Add global error handling with CORS detection
        onError: (error: any) => {
          console.error('❌ [MUTATION] Error:', error);
          
          // Special handling for CORS errors
          if (error?.message?.includes('CORS') || 
              error?.message?.includes('cross-origin')) {
            console.error('🚫 [MUTATION] CORS error detected - check Supabase configuration');
          }
        },
        
        // Network mode configuration
        networkMode: 'always',
        
        // Enable optimistic updates by default
        onMutate: async () => {
          // Global optimistic update setup if needed
        }
      }
    }
  });
};

// Centralized query key factory
export const queryKeys = {
  // Auth and permissions
  auth: ['auth'] as const,
  permissions: () => [...queryKeys.auth, 'permissions'] as const,
  userPermissions: (userId: string) => [...queryKeys.permissions(), userId] as const,
  
  // Users
  users: ['users'] as const,
  usersList: (filters?: any) => [...queryKeys.users, 'list', filters] as const,
  user: (id: string) => [...queryKeys.users, id] as const,
  
  // CRM specific keys
  crm: ['crm'] as const,
  crmLeads: (filters?: any) => [...queryKeys.crm, 'leads', filters] as const,
  crmPipelines: () => [...queryKeys.crm, 'pipelines'] as const,
  crmColumns: (pipelineId?: string) => [...queryKeys.crm, 'columns', pipelineId] as const,
  
  // Mentoring
  mentoring: ['mentoring'] as const,
  mentoringCatalogs: () => [...queryKeys.mentoring, 'catalogs'] as const,
  mentoringEnrollments: (filters?: any) => [...queryKeys.mentoring, 'enrollments', filters] as const,
  mentoringMaterials: (filters?: any) => [...queryKeys.mentoring, 'materials', filters] as const,
  mentoringSessions: (enrollmentId?: string) => [...queryKeys.mentoring, 'sessions', enrollmentId] as const,
  
  // Suppliers
  suppliers: ['suppliers'] as const,
  suppliersList: (filters?: any) => [...queryKeys.suppliers, 'list', filters] as const,
  mySuppliers: (userId: string, filters?: any) => [...queryKeys.suppliers, 'my', userId, filters] as const,
  
  // Partners and Tools
  partners: ['partners'] as const,
  tools: ['tools'] as const,
  
  // Admin specific
  admin: ['admin'] as const,
  adminStats: () => [...queryKeys.admin, 'stats'] as const,
  adminAudit: (filters?: any) => [...queryKeys.admin, 'audit', filters] as const,
} as const;

// Query invalidation helpers
export const invalidateQueries = {
  auth: (queryClient: QueryClient) => {
    return queryClient.invalidateQueries({ queryKey: queryKeys.auth });
  },
  permissions: (queryClient: QueryClient) => {
    return queryClient.invalidateQueries({ queryKey: queryKeys.permissions() });
  },
  users: (queryClient: QueryClient) => {
    return queryClient.invalidateQueries({ queryKey: queryKeys.users });
  },
  crm: (queryClient: QueryClient) => {
    return queryClient.invalidateQueries({ queryKey: queryKeys.crm });
  },
  mentoring: (queryClient: QueryClient) => {
    return queryClient.invalidateQueries({ queryKey: queryKeys.mentoring });
  },
  suppliers: (queryClient: QueryClient) => {
    return queryClient.invalidateQueries({ queryKey: queryKeys.suppliers });
  },
  all: (queryClient: QueryClient) => {
    return queryClient.invalidateQueries();
  }
};

// CORS diagnostic utility for query client
export const addCORSDiagnostics = (queryClient: QueryClient) => {
  // Add global error handler for CORS detection
  queryClient.getQueryCache().subscribe((event) => {
    if (event.type === 'queryRemoved' && event.query.state.error) {
      const error = event.query.state.error as any;
      if (error?.message?.includes('CORS')) {
        console.warn('🚫 [QUERY_CACHE] CORS error detected in query cache');
      }
    }
  });

  queryClient.getMutationCache().subscribe((event) => {
    if (event.type === 'mutationRemoved' && event.mutation.state.error) {
      const error = event.mutation.state.error as any;
      if (error?.message?.includes('CORS')) {
        console.warn('🚫 [MUTATION_CACHE] CORS error detected in mutation cache');
      }
    }
  });
};
