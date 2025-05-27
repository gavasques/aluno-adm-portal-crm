
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

  // Fetch users with optimized caching
  const {
    data: users = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['users'],
    queryFn: optimizedUserService.fetchUsers.bind(optimizedUserService),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false, // Reduzir refetches desnecessários
    refetchOnMount: false, // Usar cache quando possível
  });

  // Preload quando users carregam
  useEffect(() => {
    if (users.length > 0) {
      preloadCommonFilters(users);
    }
  }, [users, preloadCommonFilters]);

  // Debounced search otimizado
  const debouncedSearch = useDebouncedCallback((searchTerm: string) => {
    setFiltersState(prev => ({ ...prev, search: searchTerm }));
  }, 300);

  // Filtros memoizados com cache inteligente
  const filteredUsers = useMemo(() => {
    // Primeiro, tentar buscar do cache
    const cached = getCachedFilteredUsers(filters);
    if (cached) {
      console.log('🎯 Cache HIT para filtros de usuários');
      return cached;
    }

    console.log('🔄 Cache MISS - filtrando usuários...');
    const usersArray = Array.isArray(users) ? users : [];
    const filtered = optimizedUserService.filterUsers(usersArray, filters);
    
    // Cachear resultado
    cacheFilteredUsers(filters, filtered);
    
    return filtered;
  }, [users, filters, getCachedFilteredUsers, cacheFilteredUsers]);

  // Stats memoizadas com cache
  const stats = useMemo(() => {
    const cached = getCachedUserStats();
    if (cached) {
      console.log('📊 Cache HIT para estatísticas');
      return cached;
    }

    console.log('📊 Calculando estatísticas...');
    const usersArray = Array.isArray(users) ? users : [];
    const calculatedStats = optimizedUserService.calculateStats(usersArray);
    
    cacheUserStats(calculatedStats);
    return calculatedStats;
  }, [users, getCachedUserStats, cacheUserStats]);

  // Mutations otimizadas com invalidação inteligente
  const createUserMutation = useMutation({
    mutationFn: (userData: CreateUserData) => 
      optimizedUserService.createUser(userData),
    onSuccess: () => {
      smartInvalidate(); // Invalidar todo cache de usuários
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
      smartInvalidate('filtered'); // Invalidar apenas filtros
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (email: string) => optimizedUserService.resetPassword(email),
    // Não invalida cache - não afeta listagem
  });

  const setPermissionGroupMutation = useMutation({
    mutationFn: ({ userId, userEmail, groupId }: { 
      userId: string; 
      userEmail: string; 
      groupId: string | null; 
    }) => optimizedUserService.setPermissionGroup(userId, userEmail, groupId),
    onSuccess: () => {
      smartInvalidate('filtered'); // Invalidar filtros de grupo
    },
  });

  // Actions otimizadas
  const setFilters = useCallback((newFilters: Partial<UserFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  }, []);

  const searchUsers = useCallback((query: string) => {
    debouncedSearch(query);
  }, [debouncedSearch]);

  const refreshUsers = useCallback(async () => {
    smartInvalidate(); // Limpar cache
    await refetch();
  }, [refetch, smartInvalidate]);

  // Performance metrics
  const performanceMetrics = useMemo(() => ({
    ...getMetrics(),
    totalUsers: users.length,
    filteredUsers: filteredUsers.length,
    isOptimized: true
  }), [getMetrics, users.length, filteredUsers.length]);

  return {
    users: Array.isArray(users) ? users : [],
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
