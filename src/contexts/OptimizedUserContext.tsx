
import React, { createContext, useContext } from 'react';
import { User, UserFilters, UserStats, CreateUserData } from '@/types/user.types';
import { useOptimizedPerformanceUsers } from '@/hooks/users/useOptimizedPerformanceUsers';

interface OptimizedUserContextValue {
  users: User[];
  filteredUsers: User[];
  stats: UserStats;
  filters: UserFilters;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  permissionGroups: Array<{ id: string; name: string; }>;
  
  setFilters: (filters: Partial<UserFilters>) => void;
  refreshUsers: () => Promise<void>;
  searchUsers: (query: string) => void;
  forceRefresh: () => Promise<void>;
  
  createUser: (userData: CreateUserData) => Promise<boolean>;
  deleteUser: (userId: string, userEmail: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  setPermissionGroup: (userId: string, userEmail: string, groupId: string | null) => Promise<boolean>;
  
  isCreating: boolean;
  isDeleting: boolean;
  isResettingPassword: boolean;
  isSettingPermissions: boolean;
}

const OptimizedUserContext = createContext<OptimizedUserContextValue | undefined>(undefined);

export const useOptimizedUserContext = () => {
  const context = useContext(OptimizedUserContext);
  if (!context) {
    throw new Error('useOptimizedUserContext deve ser usado dentro de um OptimizedUserProvider');
  }
  return context;
};

interface OptimizedUserProviderProps {
  children: React.ReactNode;
}

export const OptimizedUserProvider: React.FC<OptimizedUserProviderProps> = ({ children }) => {
  const optimizedUsers = useOptimizedPerformanceUsers();

  const value: OptimizedUserContextValue = {
    ...optimizedUsers,
  };

  return (
    <OptimizedUserContext.Provider value={value}>
      {children}
    </OptimizedUserContext.Provider>
  );
};
