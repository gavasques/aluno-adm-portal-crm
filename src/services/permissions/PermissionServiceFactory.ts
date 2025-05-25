
import { PermissionGroupService } from './PermissionGroupService';
import { SystemMenuService } from './SystemMenuService';
import { SystemModuleService } from './SystemModuleService';
import { PermissionValidationService } from './PermissionValidationService';
import type {
  IPermissionGroupService,
  ISystemMenuService,
  ISystemModuleService,
  IPermissionValidationService,
} from './interfaces';

export class PermissionServiceFactory {
  private static permissionGroupService: IPermissionGroupService | null = null;
  private static systemMenuService: ISystemMenuService | null = null;
  private static systemModuleService: ISystemModuleService | null = null;
  private static permissionValidationService: IPermissionValidationService | null = null;

  static getPermissionGroupService(): IPermissionGroupService {
    if (!this.permissionGroupService) {
      this.permissionGroupService = new PermissionGroupService();
    }
    return this.permissionGroupService;
  }

  static getSystemMenuService(): ISystemMenuService {
    if (!this.systemMenuService) {
      this.systemMenuService = new SystemMenuService();
    }
    return this.systemMenuService;
  }

  static getSystemModuleService(): ISystemModuleService {
    if (!this.systemModuleService) {
      this.systemModuleService = new SystemModuleService();
    }
    return this.systemModuleService;
  }

  static getPermissionValidationService(): IPermissionValidationService {
    if (!this.permissionValidationService) {
      this.permissionValidationService = new PermissionValidationService();
    }
    return this.permissionValidationService;
  }

  // Utility method to get all services
  static getAllServices() {
    return {
      permissionGroup: this.getPermissionGroupService(),
      systemMenu: this.getSystemMenuService(),
      systemModule: this.getSystemModuleService(),
      validation: this.getPermissionValidationService(),
    };
  }

  // Method to reset singleton instances (useful for testing)
  static resetServices(): void {
    this.permissionGroupService = null;
    this.systemMenuService = null;
    this.systemModuleService = null;
    this.permissionValidationService = null;
  }
}
