
import type {
  PermissionGroup,
  SystemMenu,
  SystemModule,
  CreatePermissionGroupData,
  UpdatePermissionGroupData,
  ApiResponse,
  PermissionOperationResult,
  ModulePermissionData,
} from '@/types/permissions';

// Permission Group Service Interface
export interface IPermissionGroupService {
  // CRUD Operations
  getAll(): Promise<PermissionGroup[]>;
  getById(id: string): Promise<PermissionGroup | null>;
  create(data: CreatePermissionGroupData): Promise<PermissionOperationResult>;
  update(data: UpdatePermissionGroupData): Promise<PermissionOperationResult>;
  delete(id: string): Promise<PermissionOperationResult>;
  
  // Menu Management
  getGroupMenus(groupId: string): Promise<string[]>;
  updateGroupMenus(groupId: string, menuKeys: string[]): Promise<PermissionOperationResult>;
  
  // User Management
  getGroupUsers(groupId: string): Promise<any[]>;
  removeUserFromGroup(userId: string): Promise<PermissionOperationResult>;
  
  // Module Permissions
  getGroupModulePermissions(groupId: string, modules: SystemModule[]): Promise<ModulePermissionData[]>;
  saveGroupModulePermissions(groupId: string, permissions: ModulePermissionData[]): Promise<PermissionOperationResult>;
}

// System Menu Service Interface
export interface ISystemMenuService {
  getAll(): Promise<SystemMenu[]>;
  getById(id: string): Promise<SystemMenu | null>;
  getByKeys(keys: string[]): Promise<SystemMenu[]>;
  getAllowedMenusForUser(userId?: string): Promise<string[]>;
  validateMenuAccess(menuKey: string, userId?: string): Promise<boolean>;
}

// System Module Service Interface
export interface ISystemModuleService {
  getAll(): Promise<SystemModule[]>;
  getById(id: string): Promise<SystemModule | null>;
  getByCategory(): Promise<Record<string, SystemModule[]>>;
  getUserAllowedModules(userId?: string): Promise<SystemModule[]>;
  validateModuleAccess(moduleKey: string, actionKey: string, userId?: string): Promise<boolean>;
}

// Permission Validation Service Interface
export interface IPermissionValidationService {
  isAdmin(userId?: string): Promise<boolean>;
  hasAdminAccess(userId?: string): Promise<boolean>;
  canAccessMenu(menuKey: string, userId?: string): Promise<boolean>;
  canPerformAction(moduleKey: string, actionKey: string, userId?: string): Promise<boolean>;
  validatePermissionGroupData(data: any): Promise<{ isValid: boolean; errors: string[] }>;
}
