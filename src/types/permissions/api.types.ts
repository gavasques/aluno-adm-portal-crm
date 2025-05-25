
// API response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  limit: number;
  totalPages: number;
}

// API operation types
export interface PermissionOperationResult {
  success: boolean;
  error?: string;
  data?: any;
}

export interface MenuCountMap {
  [groupId: string]: number;
}

// User permission types
export interface UserPermissions {
  hasAdminAccess: boolean;
  allowedMenus: string[];
  modulePermissions: Record<string, string[]>;
}

// Hook return types
export interface PermissionGroupsState {
  permissionGroups: PermissionGroup[];
  isLoading: boolean;
  error: string | null;
  refreshPermissionGroups: () => void;
}

export interface SystemMenusState {
  systemMenus: SystemMenu[];
  isLoading: boolean;
  error: string | null;
}

export interface SystemModulesState {
  modules: SystemModule[];
  isLoading: boolean;
  error: string | null;
  getModulesByCategory: () => Record<string, SystemModule[]>;
}
