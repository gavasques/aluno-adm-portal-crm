
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserFilters, UserStats, StudentStats, UserContextValue, CreateUserData, UpdateUserData } from '@/types/user.types';
import { userService } from '@/services/UserService';
import { useDebouncedCallback } from 'use-debounce';

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext deve ser usado dentro de um UserProvider');
  }
  return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats>({ total: 0, active: 0, inactive: 0, pending: 0 });
  const [studentStats, setStudentStats] = useState<StudentStats>({ total: 0, active: 0, mentors: 0, newThisMonth: 0 });
  const [filters, setFiltersState] = useState<UserFilters>({
    search: '',
    status: 'all',
    group: 'all',
    role: 'all'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebouncedCallback((searchTerm: string) => {
    setFiltersState(prev => ({ ...prev, search: searchTerm }));
  }, 300);

  const fetchUsers = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setIsLoading(true);
      setIsRefreshing(true);
      setError(null);

      const fetchedUsers = await userService.fetchUsers();
      setUsers(fetchedUsers);
      
      const calculatedStats = userService.calculateStats(fetchedUsers);
      setStats(calculatedStats);
      
      const calculatedStudentStats = userService.calculateStudentStats(fetchedUsers);
      setStudentStats(calculatedStudentStats);
      
    } catch (err: any) {
      console.error('Erro ao buscar usuários:', err);
      setError(err.message || 'Erro ao carregar usuários');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    const filtered = userService.filterUsers(users, filters);
    setFilteredUsers(filtered);
  }, [users, filters]);

  const setFilters = useCallback((newFilters: Partial<UserFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  }, []);

  const searchUsers = useCallback((query: string) => {
    debouncedSearch(query);
  }, [debouncedSearch]);

  const refreshUsers = useCallback(async () => {
    await fetchUsers(false);
  }, [fetchUsers]);

  const createUser = useCallback(async (userData: CreateUserData): Promise<boolean> => {
    const success = await userService.createUser(userData);
    if (success) {
      await refreshUsers();
    }
    return success;
  }, [refreshUsers]);

  const updateUser = useCallback(async (userId: string, data: UpdateUserData): Promise<boolean> => {
    const success = await userService.updateUser(userId, data);
    if (success) {
      await refreshUsers();
    }
    return success;
  }, [refreshUsers]);

  const deleteUser = useCallback(async (userId: string): Promise<boolean> => {
    const user = users.find(u => u.id === userId);
    if (!user) return false;
    
    const success = await userService.deleteUser(userId, user.email);
    if (success) {
      await refreshUsers();
    }
    return success;
  }, [users, refreshUsers]);

  const toggleUserStatus = useCallback(async (userId: string): Promise<boolean> => {
    const user = users.find(u => u.id === userId);
    if (!user) return false;
    
    const success = await userService.toggleUserStatus(userId, user.email, user.status);
    if (success) {
      await refreshUsers();
    }
    return success;
  }, [users, refreshUsers]);

  const toggleMentorStatus = useCallback(async (userId: string, currentMentorStatus: boolean): Promise<boolean> => {
    const user = users.find(u => u.id === userId);
    if (!user) return false;
    
    const success = await userService.toggleMentorStatus(userId, user.email, currentMentorStatus);
    if (success) {
      await refreshUsers();
    }
    return success;
  }, [users, refreshUsers]);

  const resetPassword = useCallback(async (email: string): Promise<boolean> => {
    return await userService.resetPassword(email);
  }, []);

  const setPermissionGroup = useCallback(async (userId: string, groupId: string | null): Promise<boolean> => {
    const user = users.find(u => u.id === userId);
    if (!user) return false;
    
    const success = await userService.setPermissionGroup(userId, user.email, groupId);
    if (success) {
      await refreshUsers();
    }
    return success;
  }, [users, refreshUsers]);

  const value: UserContextValue = {
    users,
    filteredUsers,
    stats,
    studentStats,
    filters,
    isLoading,
    isRefreshing,
    error,
    setFilters,
    refreshUsers,
    searchUsers,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    toggleMentorStatus,
    resetPassword,
    setPermissionGroup,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
