
import { QueryClient } from '@tanstack/react-query';

// Optimized query client configuration
export const createOptimizedQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Increase stale time for better performance
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 15 * 60 * 1000, // 15 minutes (increased from 10)
        retry: (failureCount, error: any) => {
          // Smart retry logic
          if (error?.status === 404 || error?.status === 403) return false;
          if (error?.status >= 500) return failureCount < 2;
          return failureCount < 1;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        // Enable background refetching for better UX
        refetchOnMount: 'always',
        // Reduce network requests with smart refetching
        refetchInterval: false,
      },
      mutations: {
        retry: false,
        // Add global error handling
        onError: (error: any) => {
          console.error('Mutation error:', error);
          // Could add toast notification here
        },
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
