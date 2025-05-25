
// Main permissions types export
export * from './core.types';
export * from './forms.types';
export * from './api.types';
export * from './validation.types';
export * from './constants.types';

// Export service interfaces from interfaces file
export type {
  IPermissionGroupService,
  ISystemMenuService,
  ISystemModuleService,
  IPermissionValidationService,
} from '../services/permissions/interfaces';

// Re-export commonly used types with aliases for convenience
export type {
  PermissionGroup as IPermissionGroup,
  SystemMenu as ISystemMenu,
  SystemModule as ISystemModule,
  ModuleAction as IModuleAction,
  UserPermissions as IUserPermissions,
} from './core.types';

export type {
  PermissionGroupFormData as IPermissionGroupFormData,
} from './forms.types';
