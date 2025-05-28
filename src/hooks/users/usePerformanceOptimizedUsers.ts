
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useCallback, useMemo, useEffect } from 'react';
import { optimizedUserService } from '@/services/OptimizedUserService';
import { User, UserFilters, UserStats, CreateUserData } from '@/types/user.types';
import { useDebouncedCallback } from 'use-debounce';
import { useOptimizedUserCache } from './useOptimizedUserCache';

export const usePerformanceOptimizedUsers = () => {
  const queryClient = useQueryClient();
  const [optimisticUpdates, setOptimisticUpdates] = useState<Map<string, Partial<User>>>(new Map());
  
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

  // Fetch users with normal caching
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
      
      // Verificar especificamente o André Ferreira
      const andre = result?.find(u => u.email === 'contato@liberdadevirtual.tv');
      if (andre) {
        console.log('🔍 Status do André Ferreira:', {
          email: andre.email,
          status: andre.status,
          id: andre.id
        });
      }
      
      // Clear optimistic updates after successful fetch
      setOptimisticUpdates(new Map());
      
      return result;
    },
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
  });

  // Apply optimistic updates to users array
  const usersWithOptimisticUpdates = useMemo(() => {
    const result = Array.isArray(users) ? users : [];
    
    if (optimisticUpdates.size === 0) {
      return result;
    }
    
    return result.map(user => {
      const optimisticUpdate = optimisticUpdates.get(user.id);
      if (optimisticUpdate) {
        console.log('🔄 Aplicando atualização otimista para:', user.email, optimisticUpdate);
        return { ...user, ...optimisticUpdate };
      }
      return user;
    });
  }, [users, optimisticUpdates]);

  console.log('📊 usersArray processado:', usersWithOptimisticUpdates.length, 'usuários');

  // Enhanced search with immediate response
  const debouncedSearch = useDebouncedCallback((searchTerm: string) => {
    console.log('🔍 Aplicando busca otimizada:', searchTerm);
    setFiltersState(prev => ({ ...prev, search: searchTerm }));
  }, 100);

  // Simple force refresh
  const forceRefresh = useCallback(async () => {
    console.log('🔄 Executando refresh...');
    
    // Clear optimistic updates
    setOptimisticUpdates(new Map());
    
    // Invalidate and refetch
    await queryClient.invalidateQueries({ queryKey: ['users'] });
    await refetch();
    
    console.log('✅ Refresh concluído');
  }, [queryClient, refetch]);

  // Optimistic update helper
  const applyOptimisticUpdate = useCallback((userId: string, updates: Partial<User>) => {
    console.log('🔄 Aplicando atualização otimista para:', userId, updates);
    setOptimisticUpdates(prev => {
      const newMap = new Map(prev);
      newMap.set(userId, updates);
      return newMap;
    });
  }, []);

  // Clear optimistic update
  const clearOptimisticUpdate = useCallback((userId: string) => {
    console.log('🧹 Limpando atualização otimista para:', userId);
    setOptimisticUpdates(prev => {
      const newMap = new Map(prev);
      newMap.delete(userId);
      return newMap;
    });
  }, []);

  // Mutations with simple refresh
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
    onMutate: ({ userId, currentStatus }) => {
      // Apply optimistic update immediately
      const newStatus = currentStatus?.toLowerCase() === 'ativo' ? 'Inativo' : 'Ativo';
      console.log('🎯 Aplicando atualização otimista - Status:', currentStatus, '->', newStatus);
      applyOptimisticUpdate(userId, { status: newStatus });
    },
    onSuccess: async (result, variables) => {
      console.log('✅ Mutation: Status alterado com sucesso para:', variables.userEmail);
      
      // Clear optimistic update for this user
      clearOptimisticUpdate(variables.userId);
      
      // Execute simple refresh
      await forceRefresh();
    },
    onError: (error, variables) => {
      console.error('❌ Erro na mutation de status:', error, 'Usuário:', variables.userEmail);
      // Clear optimistic update on error
      clearOptimisticUpdate(variables.userId);
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

  // Enhanced filtered users with optimistic updates
  const filteredUsers = useMemo(() => {
    console.log('🔄 Aplicando filtros otimizados...');
    
    if (!filters.search && filters.status === 'all' && filters.group === 'all') {
      console.log('✅ Sem filtros, retornando todos os usuários:', usersWithOptimisticUpdates.length);
      return usersWithOptimisticUpdates;
    }
    
    const filtered = optimizedUserService.filterUsers(usersWithOptimisticUpdates, filters);
    console.log('✅ Usuários filtrados:', filtered.length, 'de', usersWithOptimisticUpdates.length);
    return filtered;
  }, [usersWithOptimisticUpdates, filters]);

  // Enhanced stats with optimistic updates
  const stats = useMemo((): UserStats => {
    console.log('📊 Calculando estatísticas otimizadas...');
    const calculatedStats = optimizedUserService.calculateStats(usersWithOptimisticUpdates);
    
    const validStats: UserStats = {
      total: calculatedStats?.total || 0,
      active: calculatedStats?.active || 0,
      inactive: calculatedStats?.inactive || 0,
      pending: calculatedStats?.pending || 0
    };
    
    console.log('📊 Estatísticas calculadas:', validStats);
    return validStats;
  }, [usersWithOptimisticUpdates]);

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
    totalUsers: usersWithOptimisticUpdates.length,
    filteredUsers: filteredUsers.length,
    optimisticUpdates: optimisticUpdates.size,
    isOptimized: true
  }), [getMetrics, usersWithOptimisticUpdates.length, filteredUsers.length, optimisticUpdates.size]);

  // Effects otimizados
  useEffect(() => {
    if (usersWithOptimisticUpdates.length > 0) {
      preloadCommonFilters(usersWithOptimisticUpdates);
    }
  }, [usersWithOptimisticUpdates, preloadCommonFilters]);

  useEffect(() => {
    console.log('🔍 Estado atual do hook:', {
      isLoading,
      error: error?.message,
      usersCount: usersWithOptimisticUpdates.length,
      filteredCount: filteredUsers.length,
      optimisticUpdatesCount: optimisticUpdates.size,
      stats,
      filters
    });
  }, [isLoading, error, usersWithOptimisticUpdates.length, filteredUsers.length, optimisticUpdates.size, stats, filters]);

  return {
    users: usersWithOptimisticUpdates,
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
