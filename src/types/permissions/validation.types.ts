
import { z } from 'zod';

// Validation schemas
export const PermissionGroupSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome muito longo'),
  description: z.string().optional(),
  is_admin: z.boolean(),
  allow_admin_access: z.boolean(),
  menu_keys: z.array(z.string()),
});

export const ModuleActionPermissionSchema = z.object({
  action_id: z.string().uuid(),
  action_key: z.string(),
  action_name: z.string(),
  granted: z.boolean(),
});

export const ModulePermissionDataSchema = z.object({
  module_id: z.string().uuid(),
  module_key: z.string(),
  module_name: z.string(),
  actions: z.array(ModuleActionPermissionSchema),
});

// Validation error types
export interface ValidationError {
  field: string;
  message: string;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Type guards
export const isPermissionGroup = (obj: any): obj is PermissionGroup => {
  return obj && typeof obj === 'object' && 
         typeof obj.id === 'string' &&
         typeof obj.name === 'string' &&
         typeof obj.is_admin === 'boolean' &&
         typeof obj.allow_admin_access === 'boolean';
};

export const isSystemMenu = (obj: any): obj is SystemMenu => {
  return obj && typeof obj === 'object' &&
         typeof obj.id === 'string' &&
         typeof obj.menu_key === 'string' &&
         typeof obj.display_name === 'string';
};
