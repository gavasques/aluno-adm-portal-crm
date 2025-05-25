
import { 
  PermissionGroup, 
  PermissionGroupFormData, 
  CreatePermissionGroupData,
  UpdatePermissionGroupData,
  DEFAULT_PERMISSION_GROUP,
  PermissionGroupSchema
} from '@/types/permissions';

export class PermissionGroupModel {
  public readonly id: string;
  public readonly name: string;
  public readonly description?: string;
  public readonly isAdmin: boolean;
  public readonly allowAdminAccess: boolean;
  public readonly createdAt: string;
  public readonly updatedAt: string;

  constructor(data: PermissionGroup) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.isAdmin = data.is_admin;
    this.allowAdminAccess = data.allow_admin_access;
    this.createdAt = data.created_at;
    this.updatedAt = data.updated_at;
  }

  // Static factory methods
  static fromApiData(data: PermissionGroup): PermissionGroupModel {
    return new PermissionGroupModel(data);
  }

  static createEmpty(): PermissionGroupModel {
    return new PermissionGroupModel({
      id: '',
      name: '',
      description: '',
      is_admin: false,
      allow_admin_access: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...DEFAULT_PERMISSION_GROUP,
    } as PermissionGroup);
  }

  // Business logic methods
  public canAccessAdminArea(): boolean {
    return this.isAdmin || this.allowAdminAccess;
  }

  public hasFullAccess(): boolean {
    return this.isAdmin;
  }

  public requiresMenuConfiguration(): boolean {
    return !this.isAdmin && this.allowAdminAccess;
  }

  public isValidForSubmission(): boolean {
    return this.name.trim().length > 0;
  }

  // Conversion methods
  public toFormData(): PermissionGroupFormData {
    return {
      name: this.name,
      description: this.description || '',
      is_admin: this.isAdmin,
      allow_admin_access: this.allowAdminAccess,
      menu_keys: [], // This would be populated separately
    };
  }

  public toCreateData(menuKeys: string[]): CreatePermissionGroupData {
    return {
      name: this.name,
      description: this.description,
      is_admin: this.isAdmin,
      allow_admin_access: this.allowAdminAccess,
      menu_keys: menuKeys,
    };
  }

  public toUpdateData(menuKeys: string[]): UpdatePermissionGroupData {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      is_admin: this.isAdmin,
      allow_admin_access: this.allowAdminAccess,
      menu_keys: menuKeys,
    };
  }

  // Validation
  public validate(): { isValid: boolean; errors: string[] } {
    try {
      PermissionGroupSchema.parse(this.toFormData());
      return { isValid: true, errors: [] };
    } catch (error: any) {
      const errors = error.errors?.map((e: any) => e.message) || ['Validation failed'];
      return { isValid: false, errors };
    }
  }

  // Comparison methods
  public equals(other: PermissionGroupModel): boolean {
    return this.id === other.id &&
           this.name === other.name &&
           this.description === other.description &&
           this.isAdmin === other.isAdmin &&
           this.allowAdminAccess === other.allowAdminAccess;
  }

  public isDifferentFrom(other: PermissionGroupModel): boolean {
    return !this.equals(other);
  }
}
