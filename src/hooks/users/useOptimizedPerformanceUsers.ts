
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useCallback, useMemo, useEffect } from 'react';
import { User, UserFilters, UserStats, CreateUserData } from '@/types/user.types';
import { useDebouncedCallback } from 'use-debounce';
import { usePermissionGroups } from '@/hooks/admin/usePermissionGroups';

interface OptimizedUserService {
  fetchUsers: () => Promise<User[]>;
  filterUsers: (users: User[], filters: UserFilters) => User[];
  calculateStats: (users: User[]) => UserStats;
  createUser: (userData: CreateUserData) => Promise<boolean>;
  deleteUser: (userId: string, userEmail: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  setPermissionGroup: (userId: string, userEmail: string, groupId: string | null) => Promise<boolean>;
}

// Service otimizado sem logs excessivos
const optimizedUserService: OptimizedUserService = {
  async fetchUsers(): Promise<User[]> {
    const response = await fetch('https://qflmguzmticupqtnlirf.supabase.co/functions/v1/list-users', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmbG1ndXptdGljdXBxdG5saXJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MDkzOTUsImV4cCI6MjA2MzI4NTM5NX0.0aHGL_E9V9adyonhJ3fVudjxDnHXv8E3tIEXjby9qZM'}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.users || [];
  },

  filterUsers(users: User[], filters: UserFilters): User[] {
    return users.filter(user => {
      const matchesSearch = !filters.search || 
        user.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email?.toLowerCase().includes(filters.search.toLowerCase());
      
      const matchesStatus = filters.status === 'all' || 
        user.status?.toLowerCase().includes(filters.status.toLowerCase());
      
      const matchesGroup = filters.group === 'all' ||
        (filters.group === 'pending' && !user.permission_group_id) ||
        (filters.group === 'assigned' && user.permission_group_id);
      
      return matchesSearch && matchesStatus && matchesGroup;
    });
  },

  calculateStats(users: User[]): UserStats {
    const stats = users.reduce((acc, user) => {
      const status = user.status?.toLowerCase() || 'ativo';
      
      acc.total++;
      if (status.includes('ativo') || status.includes('active')) {
        acc.active++;
      } else if (status.includes('inativo') || status.includes('inactive')) {
        acc.inactive++;
      } else {
        acc.pending++;
      }
      
      return acc;
    }, {
      total: 0,
      active: 0,
      inactive: 0,
      pending: 0
    });

    return stats;
  },

  async createUser(userData: CreateUserData): Promise<boolean> {
    const response = await fetch('https://qflmguzmticupqtnlirf.supabase.co/functions/v1/list-users', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmbG1ndXptdGljdXBxdG5saXJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MDkzOTUsImV4cCI6MjA2MzI4NTM5NX0.0aHGL_E9V9adyonhJ3fVudjxDnHXv8E3tIEXjby9qZM'}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'create',
        ...userData
      })
    });

    const result = await response.json();
    return result.success;
  },

  async deleteUser(userId: string, userEmail: string): Promise<boolean> {
    const response = await fetch('https://qflmguzmticupqtnlirf.supabase.co/functions/v1/list-users', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmbG1ndXptdGljdXBxdG5saXJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MDkzOTUsImV4cCI6MjA2MzI4NTM5NX0.0aHGL_E9V9adyonhJ3fVudjxDnHXv8E3tIEXjby9qZM'}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'delete',
        userId,
        email: userEmail
      })
    });

    const result = await response.json();
    return result.success;
  },

  async resetPassword(email: string): Promise<boolean> {
    // Implementation for password reset
    return true;
  },

  async setPermissionGroup(userId: string, userEmail: string, groupId: string | null): Promise<boolean> {
    // Implementation for setting permission group
    return true;
  }
};

export const useOptimizedPerformanceUsers = () => {
  const queryClient = useQueryClient();
  
  const [filters, setFiltersState] = useState<UserFilters>({
    search: '',
    status: 'all',
    group: 'all'
  });

  const { permissionGroups } = usePermissionGroups();

  // Query otimizada com staleTime adequado
  const {
    data: users = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['optimized-users'],
    queryFn: optimizedUserService.fetchUsers,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 2,
    retryDelay: 1000,
  });

  // Debounce otimizado para busca
  const debouncedSearch = useDebouncedCallback((searchTerm: string) => {
    setFiltersState(prev => ({ ...prev, search: searchTerm }));
  }, 300);

  const forceRefresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ['optimized-users'] });
    await queryClient.refetchQueries({ queryKey: ['optimized-users'] });
  }, [queryClient]);

  // Mutations otimizadas
  const createUserMutation = useMutation({
    mutationFn: optimizedUserService.createUser,
    onSuccess: forceRefresh,
  });

  const deleteUserMutation = useMutation({
    mutationFn: ({ userId, userEmail }: { userId: string; userEmail: string }) =>
      optimizedUserService.deleteUser(userId, userEmail),
    onSuccess: forceRefresh,
  });

  const resetPasswordMutation = useMutation({
    mutationFn: optimizedUserService.resetPassword,
  });

  const setPermissionGroupMutation = useMutation({
    mutationFn: ({ userId, userEmail, groupId }: { 
      userId: string; 
      userEmail: string; 
      groupId: string | null; 
    }) => optimizedUserService.setPermissionGroup(userId, userEmail, groupId),
    onSuccess: forceRefresh,
  });

  // Filtros e estatísticas otimizadas com memoização
  const filteredUsers = useMemo(() => {
    if (!filters.search && filters.status === 'all' && filters.group === 'all') {
      return users;
    }
    return optimizedUserService.filterUsers(users, filters);
  }, [users, filters]);

  const stats = useMemo((): UserStats => {
    return optimizedUserService.calculateStats(users);
  }, [users]);

  const setFilters = useCallback((newFilters: Partial<UserFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  }, []);

  const searchUsers = useCallback((query: string) => {
    debouncedSearch(query);
  }, [debouncedSearch]);

  const refreshUsers = useCallback(async () => {
    await forceRefresh();
  }, [forceRefresh]);

  return {
    users,
    filteredUsers,
    stats,
    filters,
    isLoading,
    isRefreshing: false,
    error: error?.message || null,
    permissionGroups: permissionGroups || [],
    
    setFilters,
    refreshUsers,
    searchUsers,
    forceRefresh,
    
    createUser: createUserMutation.mutateAsync,
    deleteUser: (userId: string, userEmail: string) => 
      deleteUserMutation.mutateAsync({ userId, userEmail }),
    resetPassword: resetPasswordMutation.mutateAsync,
    setPermissionGroup: (userId: string, userEmail: string, groupId: string | null) =>
      setPermissionGroupMutation.mutateAsync({ userId, userEmail, groupId }),
    
    isCreating: createUserMutation.isPending,
    isDeleting: deleteUserMutation.isPending,
    isResettingPassword: resetPasswordMutation.isPending,
    isSettingPermissions: setPermissionGroupMutation.isPending,
  };
};
