
import { UserRole, UserStatus } from './user.enums';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole | string;
  status: UserStatus | string;
  lastLogin: string;
  permission_group_id?: string | null;
  storage_used_mb?: number;
  storage_limit_mb?: number;
  is_mentor?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface UserFilters {
  search: string;
  status: 'all' | 'ativo' | 'inativo';
  group: 'all' | 'pending' | 'assigned' | 'banned';
  role?: string;
}

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  pending: number;
  banned?: number;
}

export interface UserOperation {
  type: 'create' | 'update' | 'delete' | 'activate' | 'deactivate' | 'ban';
  userId: string;
  userEmail: string;
  timestamp: Date;
  success: boolean;
  error?: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  role: UserRole | string;
  password: string;
  is_mentor: boolean;
}

export interface UpdateUserData {
  name?: string;
  role?: UserRole | string;
  status?: UserStatus | string;
  is_mentor?: boolean;
  permission_group_id?: string | null;
}

export interface UserContextValue {
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
  updateUser: (userId: string, data: UpdateUserData) => Promise<boolean>;
  deleteUser: (userId: string) => Promise<boolean>;
  toggleUserStatus: (userId: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  setPermissionGroup: (userId: string, groupId: string | null) => Promise<boolean>;
  banUser?: (userId: string, userEmail: string) => Promise<boolean>;
}
