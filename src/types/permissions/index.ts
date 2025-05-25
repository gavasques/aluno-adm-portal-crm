
// Main permissions types export
export * from './core.types';
export * from './forms.types';
export * from './api.types';
export * from './validation.types';
export * from './constants.types';

// Re-export commonly used types with aliases for convenience
export type {
  PermissionGroup as IPermissionGroup,
  SystemMenu as ISystemMenu,
  SystemModule as ISystemModule,
  ModuleAction as IModuleAction,
  PermissionGroupFormData as IPermissionGroupFormData,
  UserPermissions as IUserPermissions,
} from './core.types';
