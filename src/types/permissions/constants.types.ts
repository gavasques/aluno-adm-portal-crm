
import { PermissionGroup } from './core.types';

// Permission system constants
export const PERMISSION_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  MENTOR: 'mentor',
} as const;

export const MODULE_CATEGORIES = {
  CORE: 'core',
  SUPPLIERS: 'suppliers',
  PARTNERSHIPS: 'partnerships',
  TOOLS: 'tools',
  ADMIN: 'admin',
} as const;

export const PERMISSION_ACTIONS = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  MANAGE: 'manage',
} as const;

export const FORM_MODES = {
  CREATE: 'create',
  EDIT: 'edit',
  VIEW: 'view',
} as const;

// Type utilities
export type PermissionRole = typeof PERMISSION_ROLES[keyof typeof PERMISSION_ROLES];
export type ModuleCategory = typeof MODULE_CATEGORIES[keyof typeof MODULE_CATEGORIES];
export type PermissionAction = typeof PERMISSION_ACTIONS[keyof typeof PERMISSION_ACTIONS];
export type FormMode = typeof FORM_MODES[keyof typeof FORM_MODES];

// Default values
export const DEFAULT_PERMISSION_GROUP: Partial<PermissionGroup> = {
  name: '',
  description: '',
  is_admin: false,
  allow_admin_access: false,
};

export const DEFAULT_FORM_STATE = {
  name: '',
  description: '',
  isAdmin: false,
  allowAdminAccess: false,
  selectedMenus: [],
  modulePermissions: [],
  isSubmitting: false,
  loadingGroupData: false,
};

// Error messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'Este campo é obrigatório',
  INVALID_EMAIL: 'Email inválido',
  MIN_LENGTH: (min: number) => `Mínimo de ${min} caracteres`,
  MAX_LENGTH: (max: number) => `Máximo de ${max} caracteres`,
  PERMISSION_DENIED: 'Permissão negada',
  NETWORK_ERROR: 'Erro de conexão',
  UNKNOWN_ERROR: 'Erro desconhecido',
} as const;
