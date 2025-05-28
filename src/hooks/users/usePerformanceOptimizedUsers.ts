
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useCallback, useMemo, useEffect } from 'react';
import { optimizedUserService } from '@/services/OptimizedUserService';
import { User, UserFilters, UserStats, CreateUserData } from '@/types/user.types';
import { useDebouncedCallback } from 'use-debounce';
import { useOptimizedUserCache } from './useOptimizedUserCache';

export const usePerformanceOptimizedUsers = () => {
  const queryClient = useQueryClient();
  
  const [filters, setFiltersState] = useState<UserFilters>({
    search: '',
    status: 'all',
    group: 'all'
  });

  const {
    cacheFilteredUsers,
    getCachedFilteredUsers,
    cacheUserStats,
    getCachedUserStats,
    smartInvalidate,
    getMetrics,
    preloadCommonFilters
  } = useOptimizedUserCache();

  // Set query client on service
  optimizedUserService.setQueryClient(queryClient);

  // Fetch users with aggressive refresh for status updates
  const {
    data: users = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      console.log('🔄 Query executando fetchUsers...');
      
      const result = await optimizedUserService.fetchUsers();
      console.log('✅ Query retornou:', result?.length, 'usuários');
      
      // Log específico do André Ferreira para debug
      const andre = result?.find(u => u.email === 'contato@liberdadevirtual.tv');
      if (andre) {
        console.log('🔍 Status do André Ferreira:', {
          email: andre.email,
          status: andre.status,
          id: andre.id
        });
      }
      
      return result;
    },
    staleTime: 0, // Always fetch fresh data
    gcTime: 0, // Don't cache
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
  });

  console.log('📊 usersArray processado:', users.length, 'usuários');

  // Enhanced search with immediate response
  const debouncedSearch = useDebouncedCallback((searchTerm: string) => {
    console.log('🔍 Aplicando busca otimizada:', searchTerm);
    setFiltersState(prev => ({ ...prev, search: searchTerm }));
  }, 100);

  // Force refresh that truly refreshes everything
  const forceRefresh = useCallback(async () => {
    console.log('🔄 Executando refresh forçado...');
    
    // Invalidate all cache
    await queryClient.invalidateQueries({ queryKey: ['users'] });
    await queryClient.refetchQueries({ queryKey: ['users'] });
    
    console.log('✅ Refresh forçado concluído');
  }, [queryClient]);

  // Mutations with immediate data refresh
  const createUserMutation = useMutation({
    mutationFn: (userData: CreateUserData) => 
      optimizedUserService.createUser(userData),
    onSuccess: async () => {
      console.log('✅ Usuário criado, executando refresh...');
      await forceRefresh();
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: ({ userId, userEmail }: { userId: string; userEmail: string }) =>
      optimizedUserService.deleteUser(userId, userEmail),
    onSuccess: async () => {
      console.log('✅ Usuário excluído, executando refresh...');
      await forceRefresh();
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ userId, userEmail, currentStatus }: { 
      userId: string; 
      userEmail: string; 
      currentStatus: string; 
    }) => {
      console.log('🔄 Mutation: Alternando status do usuário:', userEmail, 'Status atual:', currentStatus);
      return optimizedUserService.toggleUserStatus(userId, userEmail, currentStatus);
    },
    onSuccess: async (result, variables) => {
      console.log('✅ Mutation: Status alterado com sucesso para:', variables.userEmail);
      
      // Execute multiple refreshes to ensure data is updated
      console.log('🔄 Iniciando refresh agressivo...');
      
      await forceRefresh();
      
      // Additional refreshes with delays
      setTimeout(async () => {
        console.log('🔄 Refresh adicional (500ms)...');
        await forceRefresh();
      }, 500);
      
      setTimeout(async () => {
        console.log('🔄 Refresh adicional (1.5s)...');
        await forceRefresh();
      }, 1500);
      
      setTimeout(async () => {
        console.log('🔄 Refresh final (3s)...');
        await forceRefresh();
      }, 3000);
    },
    onError: (error, variables) => {
      console.error('❌ Erro na mutation de status:', error, 'Usuário:', variables.userEmail);
    }
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (email: string) => optimizedUserService.resetPassword(email),
  });

  const setPermissionGroupMutation = useMutation({
    mutationFn: ({ userId, userEmail, groupId }: { 
      userId: string; 
      userEmail: string; 
      groupId: string | null; 
    }) => optimizedUserService.setPermissionGroup(userId, userEmail, groupId),
    onSuccess: async () => {
      console.log('✅ Permissões alteradas, executando refresh...');
      await forceRefresh();
    },
  });

  // Enhanced filtered users
  const filteredUsers = useMemo(() => {
    console.log('🔄 Aplicando filtros otimizados...');
    
    if (!filters.search && filters.status === 'all' && filters.group === 'all') {
      console.log('✅ Sem filtros, retornando todos os usuários:', users.length);
      return users;
    }
    
    const filtered = optimizedUserService.filterUsers(users, filters);
    console.log('✅ Usuários filtrados:', filtered.length, 'de', users.length);
    return filtered;
  }, [users, filters]);

  // Enhanced stats
  const stats = useMemo((): UserStats => {
    console.log('📊 Calculando estatísticas otimizadas...');
    const calculatedStats = optimizedUserService.calculateStats(users);
    
    const validStats: UserStats = {
      total: calculatedStats?.total || 0,
      active: calculatedStats?.active || 0,
      inactive: calculatedStats?.inactive || 0,
      pending: calculatedStats?.pending || 0
    };
    
    console.log('📊 Estatísticas calculadas:', validStats);
    return validStats;
  }, [users]);

  // Callbacks otimizados
  const setFilters = useCallback((newFilters: Partial<UserFilters>) => {
    console.log('🔧 Atualizando filtros:', newFilters);
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  }, []);

  const searchUsers = useCallback((query: string) => {
    console.log('🔍 Busca ativada:', query);
    debouncedSearch(query);
  }, [debouncedSearch]);

  const refreshUsers = useCallback(async () => {
    console.log('🔄 Refresh de usuários solicitado...');
    await forceRefresh();
  }, [forceRefresh]);

  const performanceMetrics = useMemo(() => ({
    ...getMetrics(),
    totalUsers: users.length,
    filteredUsers: filteredUsers.length,
    isOptimized: true
  }), [getMetrics, users.length, filteredUsers.length]);

  // Effects otimizados
  useEffect(() => {
    if (users.length > 0) {
      preloadCommonFilters(users);
    }
  }, [users, preloadCommonFilters]);

  useEffect(() => {
    console.log('🔍 Estado atual do hook:', {
      isLoading,
      error: error?.message,
      usersCount: users.length,
      filteredCount: filteredUsers.length,
      stats,
      filters
    });
  }, [isLoading, error, users.length, filteredUsers.length, stats, filters]);

  return {
    users,
    filteredUsers,
    stats,
    filters,
    isLoading,
    isRefreshing: false,
    error: error?.message || null,
    
    // Actions
    setFilters,
    refreshUsers,
    searchUsers,
    forceRefresh,
    
    // Mutations
    createUser: createUserMutation.mutateAsync,
    deleteUser: (userId: string, userEmail: string) => 
      deleteUserMutation.mutateAsync({ userId, userEmail }),
    toggleUserStatus: (userId: string, userEmail: string, currentStatus: string) => {
      console.log('🔧 Hook: toggleUserStatus chamado para:', userEmail, 'Status:', currentStatus);
      return toggleStatusMutation.mutateAsync({ userId, userEmail, currentStatus });
    },
    resetPassword: resetPasswordMutation.mutateAsync,
    setPermissionGroup: (userId: string, userEmail: string, groupId: string | null) =>
      setPermissionGroupMutation.mutateAsync({ userId, userEmail, groupId }),
    
    // Mutation states
    isCreating: createUserMutation.isPending,
    isDeleting: deleteUserMutation.isPending,
    isTogglingStatus: toggleStatusMutation.isPending,
    isResettingPassword: resetPasswordMutation.isPending,
    isSettingPermissions: setPermissionGroupMutation.isPending,

    // Performance
    performanceMetrics,
    smartInvalidate,
  };
};
