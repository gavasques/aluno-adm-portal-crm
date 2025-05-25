
// Core permission system types
export interface PermissionGroup {
  id: string;
  name: string;
  description?: string;
  is_admin: boolean;
  allow_admin_access: boolean;
  created_at: string;
  updated_at: string;
}

export interface SystemMenu {
  id: string;
  menu_key: string;
  display_name: string;
  description?: string;
  icon?: string;
  created_at: string;
}

export interface SystemModule {
  id: string;
  module_key: string;
  module_name: string;
  description?: string;
  category?: string;
  icon?: string;
  is_premium: boolean;
  is_active: boolean;
  sort_order: number;
  stripe_price_id?: string;
  created_at: string;
  updated_at: string;
  actions: ModuleAction[];
}

export interface ModuleAction {
  id: string;
  action_key: string;
  action_name: string;
  description?: string;
  module_id: string;
  is_active: boolean;
  created_at: string;
}

export interface PermissionGroupMenu {
  id: string;
  permission_group_id: string;
  menu_key: string;
  created_at: string;
}

export interface PermissionGroupModule {
  id: string;
  permission_group_id: string;
  module_id: string;
  action_id: string;
  granted: boolean;
  created_at: string;
}
