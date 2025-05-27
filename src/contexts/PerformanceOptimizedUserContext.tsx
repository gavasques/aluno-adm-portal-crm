
import React, { createContext, useContext } from 'react';
import { User, UserFilters, UserStats, CreateUserData } from '@/types/user.types';
import { usePerformanceOptimizedUsers } from '@/hooks/users/usePerformanceOptimizedUsers';

interface PerformanceOptimizedUserContextValue {
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

  // Performance
  performanceMetrics: any;
  smartInvalidate: (pattern?: string) => void;
}

const PerformanceOptimizedUserContext = createContext<PerformanceOptimizedUserContextValue | undefined>(undefined);

export const usePerformanceOptimizedUserContext = () => {
  const context = useContext(PerformanceOptimizedUserContext);
  if (!context) {
    throw new Error('usePerformanceOptimizedUserContext deve ser usado dentro de um PerformanceOptimizedUserProvider');
  }
  return context;
};

interface PerformanceOptimizedUserProviderProps {
  children: React.ReactNode;
}

export const PerformanceOptimizedUserProvider: React.FC<PerformanceOptimizedUserProviderProps> = ({ children }) => {
  const optimizedUsers = usePerformanceOptimizedUsers();

  const value: PerformanceOptimizedUserContextValue = {
    ...optimizedUsers,
  };

  return (
    <PerformanceOptimizedUserContext.Provider value={value}>
      {children}
    </PerformanceOptimizedUserContext.Provider>
  );
};
