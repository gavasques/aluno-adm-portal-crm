
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useCallback, useMemo } from 'react';
import { optimizedUserService } from '@/services/OptimizedUserService';
import { User, UserFilters, UserStats, CreateUserData } from '@/types/user.types';
import { useDebouncedCallback } from 'use-debounce';

export const useOptimizedUsers = () => {
  const queryClient = useQueryClient();
  const [filters, setFiltersState] = useState<UserFilters>({
    search: '',
    status: 'all',
    group: 'all'
  });

  // Set query client on service
  optimizedUserService.setQueryClient(queryClient);

  // Fetch users with React Query
  const {
    data: users = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['users'],
    queryFn: optimizedUserService.fetchUsers.bind(optimizedUserService),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: (userData: CreateUserData) => 
      optimizedUserService.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: ({ userId, userEmail }: { userId: string; userEmail: string }) =>
      optimizedUserService.deleteUser(userId, userEmail),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  // Toggle status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: ({ userId, userEmail, currentStatus }: { 
      userId: string; 
      userEmail: string; 
      currentStatus: string; 
    }) => optimizedUserService.toggleUserStatus(userId, userEmail, currentStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: (email: string) => optimizedUserService.resetPassword(email),
  });

  // Set permission group mutation
  const setPermissionGroupMutation = useMutation({
    mutationFn: ({ userId, userEmail, groupId }: { 
      userId: string; 
      userEmail: string; 
      groupId: string | null; 
    }) => optimizedUserService.setPermissionGroup(userId, userEmail, groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  // Debounced search
  const debouncedSearch = useDebouncedCallback((searchTerm: string) => {
    setFiltersState(prev => ({ ...prev, search: searchTerm }));
  }, 300);

  // Memoized filtered users and stats - Fix the type issues here
  const filteredUsers = useMemo(() => {
    // Ensure users is always an array
    const usersArray = Array.isArray(users) ? users : [];
    return optimizedUserService.filterUsers(usersArray, filters);
  }, [users, filters]);

  const stats = useMemo(() => {
    // Ensure users is always an array
    const usersArray = Array.isArray(users) ? users : [];
    return optimizedUserService.calculateStats(usersArray);
  }, [users]);

  const setFilters = useCallback((newFilters: Partial<UserFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  }, []);

  const searchUsers = useCallback((query: string) => {
    debouncedSearch(query);
  }, [debouncedSearch]);

  const refreshUsers = useCallback(async () => {
    await refetch();
  }, [refetch]);

  return {
    users: Array.isArray(users) ? users : [],
    filteredUsers,
    stats,
    filters,
    isLoading,
    isRefreshing: false, // React Query handles this internally
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
  };
};
