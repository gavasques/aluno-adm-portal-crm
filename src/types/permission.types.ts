
export interface StudentMenuItem {
  id: string;
  name: string;
  path: string;
  description: string;
}

export interface PermissionGroup {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  allowedMenus: string[]; // Array of menu IDs that this group can access
}

export interface PermissionGroupFormData {
  name: string;
  description: string;
  allowedMenus: string[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
  permissionGroupId?: number; // ID do grupo de permissão do usuário
  tasks: any[];
}
