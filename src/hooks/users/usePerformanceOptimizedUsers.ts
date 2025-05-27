
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

  // Sempre chamar os hooks na mesma ordem
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

  // Fetch users with optimized caching
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
      return result;
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: (failureCount, error) => {
      console.log(`🔄 Tentativa ${failureCount + 1} de buscar usuários. Erro:`, error);
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Ensure users is always an array - SEMPRE executado
  const usersArray = useMemo(() => {
    const result = Array.isArray(users) ? users : [];
    console.log('📊 usersArray processado:', result.length, 'usuários');
    return result;
  }, [users]);

  // Debounced search otimizado - SEMPRE criado
  const debouncedSearch = useDebouncedCallback((searchTerm: string) => {
    setFiltersState(prev => ({ ...prev, search: searchTerm }));
  }, 300);

  // Mutations - SEMPRE criadas na mesma ordem
  const createUserMutation = useMutation({
    mutationFn: (userData: CreateUserData) => 
      optimizedUserService.createUser(userData),
    onSuccess: () => {
      smartInvalidate();
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: ({ userId, userEmail }: { userId: string; userEmail: string }) =>
      optimizedUserService.deleteUser(userId, userEmail),
    onSuccess: () => {
      smartInvalidate();
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ userId, userEmail, currentStatus }: { 
      userId: string; 
      userEmail: string; 
      currentStatus: string; 
    }) => optimizedUserService.toggleUserStatus(userId, userEmail, currentStatus),
    onSuccess: () => {
      smartInvalidate('filtered');
    },
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
    onSuccess: () => {
      smartInvalidate('filtered');
    },
  });

  // Filtros memoizados sem cache para debugging - SEMPRE executado
  const filteredUsers = useMemo(() => {
    console.log('🔄 Aplicando filtros diretamente (sem cache)...');
    const filtered = optimizedUserService.filterUsers(usersArray, filters);
    console.log('✅ Usuários filtrados:', filtered.length);
    return filtered;
  }, [usersArray, filters]);

  // Stats memoizadas sem cache para debugging - SEMPRE executado
  const stats = useMemo((): UserStats => {
    console.log('📊 Calculando estatísticas diretamente...');
    const calculatedStats = optimizedUserService.calculateStats(usersArray);
    
    const validStats: UserStats = {
      total: calculatedStats?.total || 0,
      active: calculatedStats?.active || 0,
      inactive: calculatedStats?.inactive || 0,
      pending: calculatedStats?.pending || 0
    };
    
    console.log('📊 Estatísticas calculadas:', validStats);
    return validStats;
  }, [usersArray]);

  // Callbacks - SEMPRE criados na mesma ordem
  const setFilters = useCallback((newFilters: Partial<UserFilters>) => {
    console.log('🔧 Atualizando filtros:', newFilters);
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  }, []);

  const searchUsers = useCallback((query: string) => {
    console.log('🔍 Busca ativada:', query);
    debouncedSearch(query);
  }, [debouncedSearch]);

  const refreshUsers = useCallback(async () => {
    console.log('🔄 Forçando refresh de usuários...');
    smartInvalidate();
    await refetch();
  }, [refetch, smartInvalidate]);

  const performanceMetrics = useMemo(() => ({
    ...getMetrics(),
    totalUsers: usersArray.length,
    filteredUsers: filteredUsers.length,
    isOptimized: true
  }), [getMetrics, usersArray.length, filteredUsers.length]);

  // Effects - SEMPRE na mesma ordem e sem condicionais
  useEffect(() => {
    if (usersArray.length > 0) {
      preloadCommonFilters(usersArray);
    }
  }, [usersArray, preloadCommonFilters]);

  useEffect(() => {
    console.log('🔍 Estado atual do hook:', {
      isLoading,
      error: error?.message,
      usersCount: usersArray.length,
      filteredCount: filteredUsers.length,
      stats,
      filters
    });
  }, [isLoading, error, usersArray.length, filteredUsers.length, stats, filters]);

  return {
    users: usersArray,
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
    
    // Mutations
    createUser: createUserMutation.mutateAsync,
    deleteUser: (userId: string, userEmail: string) => 
      deleteUserMutation.mutateAsync({ userId, userEmail }),
    toggleUserStatus: (userId: string, userEmail: string, currentStatus: string) =>
      toggleStatusMutation.mutateAsync({ userId, userEmail, currentStatus }),
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
