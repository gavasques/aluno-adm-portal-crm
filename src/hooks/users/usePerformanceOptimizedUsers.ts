
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
    staleTime: 2 * 60 * 1000, // Reduzido para 2 minutos para melhor responsividade
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

  // Busca otimizada com debounce mais agressivo
  const debouncedSearch = useDebouncedCallback((searchTerm: string) => {
    console.log('🔍 Aplicando busca otimizada:', searchTerm);
    setFiltersState(prev => ({ ...prev, search: searchTerm }));
  }, 100); // Otimizado para 100ms

  // Mutations com invalidação inteligente
  const createUserMutation = useMutation({
    mutationFn: (userData: CreateUserData) => 
      optimizedUserService.createUser(userData),
    onSuccess: () => {
      console.log('✅ Usuário criado, invalidando cache...');
      smartInvalidate();
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: ({ userId, userEmail }: { userId: string; userEmail: string }) =>
      optimizedUserService.deleteUser(userId, userEmail),
    onSuccess: () => {
      console.log('✅ Usuário excluído, invalidando cache...');
      smartInvalidate();
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
    onSuccess: (result, variables) => {
      console.log('✅ Mutation: Status alterado com sucesso para:', variables.userEmail);
      // Invalidar cache e forçar refetch
      queryClient.invalidateQueries({ queryKey: ['users'] });
      smartInvalidate();
      
      // Forçar refetch após um pequeno delay para garantir que o backend foi atualizado
      setTimeout(() => {
        console.log('🔄 Forçando refetch após alteração de status...');
        refetch();
      }, 500);
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
    onSuccess: () => {
      smartInvalidate();
      refetch();
    },
  });

  // Filtros memoizados com otimização de performance
  const filteredUsers = useMemo(() => {
    console.log('🔄 Aplicando filtros otimizados...');
    
    // Se não há busca, retorna todos os usuários mais rapidamente
    if (!filters.search && filters.status === 'all' && filters.group === 'all') {
      console.log('✅ Sem filtros, retornando todos os usuários:', usersArray.length);
      return usersArray;
    }
    
    const filtered = optimizedUserService.filterUsers(usersArray, filters);
    console.log('✅ Usuários filtrados:', filtered.length, 'de', usersArray.length);
    return filtered;
  }, [usersArray, filters]);

  // Stats memoizadas com cache otimizado
  const stats = useMemo((): UserStats => {
    console.log('📊 Calculando estatísticas otimizadas...');
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
    console.log('🔄 Forçando refresh de usuários...');
    queryClient.invalidateQueries({ queryKey: ['users'] });
    smartInvalidate();
    await refetch();
  }, [refetch, smartInvalidate, queryClient]);

  const performanceMetrics = useMemo(() => ({
    ...getMetrics(),
    totalUsers: usersArray.length,
    filteredUsers: filteredUsers.length,
    isOptimized: true
  }), [getMetrics, usersArray.length, filteredUsers.length]);

  // Effects otimizados
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
