
import { PermissionGroup, SystemMenu, SystemModule } from './core.types';

// Form-related types
export interface PermissionGroupFormData {
  name: string;
  description?: string;
  is_admin: boolean;
  allow_admin_access: boolean;
  menu_keys: string[];
}

export interface CreatePermissionGroupData extends PermissionGroupFormData {}

export interface UpdatePermissionGroupData extends PermissionGroupFormData {
  id: string;
}

export interface ModuleActionPermission {
  action_id: string;
  action_key: string;
  action_name: string;
  granted: boolean;
}

export interface ModulePermissionData {
  module_id: string;
  module_key: string;
  module_name: string;
  actions: ModuleActionPermission[];
}

// Form props types
export interface PermissionFormProps {
  isEdit: boolean;
  permissionGroup?: PermissionGroup;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export interface PermissionFormState {
  name: string;
  description: string;
  isAdmin: boolean;
  allowAdminAccess: boolean;
  selectedMenus: string[];
  modulePermissions: ModulePermissionData[];
  isSubmitting: boolean;
  loadingGroupData: boolean;
}
