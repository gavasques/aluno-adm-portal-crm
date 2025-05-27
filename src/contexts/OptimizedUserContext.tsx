
import React, { createContext, useContext } from 'react';
import { User, UserFilters, UserStats, CreateUserData } from '@/types/user.types';
import { useOptimizedUsers } from '@/hooks/users/useOptimizedUsers';

interface OptimizedUserContextValue {
  users: User[];
  filteredUsers: User[];
  stats: UserStats;
  filters: UserFilters;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  
  // Actions
  setFilters: (filters: Partial<UserFilters>) => void;
  refreshUsers: () => Promise<void>;
  searchUsers: (query: string) => void;
  
  // CRUD Operations
  createUser: (userData: CreateUserData) => Promise<boolean>;
  deleteUser: (userId: string, userEmail: string) => Promise<boolean>;
  toggleUserStatus: (userId: string, userEmail: string, currentStatus: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  setPermissionGroup: (userId: string, userEmail: string, groupId: string | null) => Promise<boolean>;
  
  // Mutation states
  isCreating: boolean;
  isDeleting: boolean;
  isTogglingStatus: boolean;
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
  const optimizedUsers = useOptimizedUsers();

  const value: OptimizedUserContextValue = {
    ...optimizedUsers,
    isRefreshing: false, // useOptimizedUsers doesn't have this state
  };

  return (
    <OptimizedUserContext.Provider value={value}>
      {children}
    </OptimizedUserContext.Provider>
  );
};
