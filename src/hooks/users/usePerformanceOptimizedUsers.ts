
import { useState, useEffect, useCallback, useMemo } from 'react';
import { User, UserFilters, UserStats, CreateUserData } from '@/types/user.types';
import { optimizedUserService } from '@/services/OptimizedUserService';
import { useQueryClient } from '@tanstack/react-query';

export const usePerformanceOptimizedUsers = () => {
  const queryClient = useQueryClient();
  const [users, setUsers] = useState<User[]>([]);
  const [filters, setFiltersState] = useState<UserFilters>({
    search: '',
    status: 'all',
    group: 'all'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Mutation states
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [isSettingPermissions, setIsSettingPermissions] = useState(false);

  // Set query client in service
  useEffect(() => {
    optimizedUserService.setQueryClient(queryClient);
  }, [queryClient]);

  // Fetch users
  const fetchUsers = useCallback(async () => {
    try {
      setError(null);
      const fetchedUsers = await optimizedUserService.fetchUsers();
      setUsers(fetchedUsers);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Erro ao carregar usuários');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Calculate stats
  const stats = useMemo(() => {
    return optimizedUserService.calculateStats(users);
  }, [users]);

  // Calculate student stats
  const studentStats = useMemo(() => {
    const students = users.filter(user => user.role === 'Student');
    const total = students.length;
    const active = students.filter(s => s.status?.toLowerCase() === 'ativo').length;
    const mentors = students.filter(s => s.is_mentor).length;
    const newThisMonth = students.filter(s => {
      if (!s.created_at) return false;
      const created = new Date(s.created_at);
      const now = new Date();
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
    }).length;

    return { total, active, mentors, newThisMonth };
  }, [users]);

  // Filter users
  const filteredUsers = useMemo(() => {
    return optimizedUserService.filterUsers(users, filters);
  }, [users, filters]);

  // Actions with correct types
  const setFilters = useCallback((newFilters: Partial<UserFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  }, []);

  const refreshUsers = useCallback(async () => {
    setIsRefreshing(true);
    await fetchUsers();
  }, [fetchUsers]);

  const forceRefresh = useCallback(async () => {
    setIsLoading(true);
    await fetchUsers();
  }, [fetchUsers]);

  const searchUsers = useCallback((query: string) => {
    setFilters({ search: query });
  }, [setFilters]);

  // CRUD Operations
  const createUser = useCallback(async (userData: CreateUserData): Promise<boolean> => {
    setIsCreating(true);
    try {
      const success = await optimizedUserService.createUser(userData);
      if (success) {
        await refreshUsers();
      }
      return success;
    } finally {
      setIsCreating(false);
    }
  }, [refreshUsers]);

  const deleteUser = useCallback(async (userId: string, userEmail: string): Promise<boolean> => {
    setIsDeleting(true);
    try {
      const success = await optimizedUserService.deleteUser(userId, userEmail);
      if (success) {
        await refreshUsers();
      }
      return success;
    } finally {
      setIsDeleting(false);
    }
  }, [refreshUsers]);

  // Add deleteUserFromDatabase function
  const deleteUserFromDatabase = useCallback(async (userId: string, userEmail: string): Promise<boolean> => {
    try {
      console.log('🗑️ Starting user deletion process for:', userEmail);
      
      // Use the same logic as deleteUser for now
      const success = await optimizedUserService.deleteUser(userId, userEmail);
      if (success) {
        await refreshUsers();
      }
      return success;
    } catch (error) {
      console.error('❌ User deletion failed:', error);
      return false;
    }
  }, [refreshUsers]);

  const resetPassword = useCallback(async (email: string): Promise<boolean> => {
    setIsResettingPassword(true);
    try {
      return await optimizedUserService.resetPassword(email);
    } finally {
      setIsResettingPassword(false);
    }
  }, []);

  const setPermissionGroup = useCallback(async (userId: string, userEmail: string, groupId: string | null): Promise<boolean> => {
    setIsSettingPermissions(true);
    try {
      const success = await optimizedUserService.setPermissionGroup(userId, userEmail, groupId);
      if (success) {
        await refreshUsers();
      }
      return success;
    } finally {
      setIsSettingPermissions(false);
    }
  }, [refreshUsers]);

  // Toggle user status
  const toggleUserStatus = useCallback(async (userId: string, userEmail: string, isActive: boolean): Promise<boolean> => {
    try {
      const currentStatus = isActive ? "Ativo" : "Inativo";
      const success = await optimizedUserService.toggleUserStatus(userId, userEmail, currentStatus);
      if (success) {
        await refreshUsers();
      }
      return success;
    } catch (error) {
      console.error('Error toggling user status:', error);
      return false;
    }
  }, [refreshUsers]);

  // Toggle mentor status
  const toggleMentorStatus = useCallback(async (userId: string, currentMentorStatus: boolean): Promise<boolean> => {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { error } = await supabase
        .from('profiles')
        .update({ is_mentor: !currentMentorStatus })
        .eq('id', userId);

      if (error) {
        console.error('Error toggling mentor status:', error);
        return false;
      }

      await refreshUsers();
      return true;
    } catch (error) {
      console.error('Error toggling mentor status:', error);
      return false;
    }
  }, [refreshUsers]);

  return {
    users,
    filteredUsers,
    stats,
    studentStats,
    filters,
    isLoading,
    isRefreshing,
    error,
    permissionGroups: [], // TODO: Implement if needed
    
    // Actions
    setFilters,
    refreshUsers,
    searchUsers,
    forceRefresh,
    
    // CRUD Operations
    createUser,
    deleteUser,
    deleteUserFromDatabase,
    resetPassword,
    setPermissionGroup,
    toggleUserStatus,
    toggleMentorStatus,
    
    // Mutation states
    isCreating,
    isDeleting,
    isResettingPassword,
    isSettingPermissions,

    // Performance
    performanceMetrics: {},
    smartInvalidate: () => {}
  };
};
