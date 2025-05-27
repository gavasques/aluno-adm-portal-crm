
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserFilters, UserStats, UserContextValue, CreateUserData, UpdateUserData } from '@/types/user.types';
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

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats>({ total: 0, active: 0, inactive: 0, pending: 0 });
  const [filters, setFiltersState] = useState<UserFilters>({
    search: '',
    status: 'all',
    group: 'all'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounced search function
  const debouncedSearch = useDebouncedCallback((searchTerm: string) => {
    setFiltersState(prev => ({ ...prev, search: searchTerm }));
  }, 300);

  // Apply filters whenever users or filters change
  useEffect(() => {
    const filtered = userService.filterUsers(users, filters);
    setFilteredUsers(filtered);
    setStats(userService.calculateStats(users));
  }, [users, filters]);

  const fetchUsers = useCallback(async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        setIsRefreshing(true);
        userService.clearCache();
      } else {
        setIsLoading(true);
      }
      
      setError(null);
      const userData = await userService.fetchUsers();
      setUsers(userData);
    } catch (err: any) {
      console.error('Erro ao buscar usuários:', err);
      setError(err.message || 'Erro ao carregar usuários');
      setUsers([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const refreshUsers = useCallback(async () => {
    await fetchUsers(true);
  }, [fetchUsers]);

  const setFilters = useCallback((newFilters: Partial<UserFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  }, []);

  const searchUsers = useCallback((query: string) => {
    debouncedSearch(query);
  }, [debouncedSearch]);

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
    resetPassword,
    setPermissionGroup,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
