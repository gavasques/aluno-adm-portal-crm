
import { describe, it, expect, beforeEach } from 'vitest';
import { PermissionServiceFactory } from '../PermissionServiceFactory';
import { PermissionGroupService } from '../PermissionGroupService';
import { SystemMenuService } from '../SystemMenuService';
import { SystemModuleService } from '../SystemModuleService';
import { PermissionValidationService } from '../PermissionValidationService';

describe('PermissionServiceFactory', () => {
  beforeEach(() => {
    // Reset singletons before each test
    PermissionServiceFactory.resetServices();
  });

  describe('singleton pattern', () => {
    it('should return the same PermissionGroupService instance', () => {
      const service1 = PermissionServiceFactory.getPermissionGroupService();
      const service2 = PermissionServiceFactory.getPermissionGroupService();

      expect(service1).toBe(service2);
      expect(service1).toBeInstanceOf(PermissionGroupService);
    });

    it('should return the same SystemMenuService instance', () => {
      const service1 = PermissionServiceFactory.getSystemMenuService();
      const service2 = PermissionServiceFactory.getSystemMenuService();

      expect(service1).toBe(service2);
      expect(service1).toBeInstanceOf(SystemMenuService);
    });

    it('should return the same SystemModuleService instance', () => {
      const service1 = PermissionServiceFactory.getSystemModuleService();
      const service2 = PermissionServiceFactory.getSystemModuleService();

      expect(service1).toBe(service2);
      expect(service1).toBeInstanceOf(SystemModuleService);
    });

    it('should return the same PermissionValidationService instance', () => {
      const service1 = PermissionServiceFactory.getPermissionValidationService();
      const service2 = PermissionServiceFactory.getPermissionValidationService();

      expect(service1).toBe(service2);
      expect(service1).toBeInstanceOf(PermissionValidationService);
    });
  });

  describe('getAllServices', () => {
    it('should return all services', () => {
      const services = PermissionServiceFactory.getAllServices();

      expect(services).toHaveProperty('permissionGroup');
      expect(services).toHaveProperty('systemMenu');
      expect(services).toHaveProperty('systemModule');
      expect(services).toHaveProperty('validation');

      expect(services.permissionGroup).toBeInstanceOf(PermissionGroupService);
      expect(services.systemMenu).toBeInstanceOf(SystemMenuService);
      expect(services.systemModule).toBeInstanceOf(SystemModuleService);
      expect(services.validation).toBeInstanceOf(PermissionValidationService);
    });
  });

  describe('resetServices', () => {
    it('should reset all singleton instances', () => {
      // Get initial instances
      const service1 = PermissionServiceFactory.getPermissionGroupService();
      const menu1 = PermissionServiceFactory.getSystemMenuService();

      // Reset services
      PermissionServiceFactory.resetServices();

      // Get new instances
      const service2 = PermissionServiceFactory.getPermissionGroupService();
      const menu2 = PermissionServiceFactory.getSystemMenuService();

      // Should be different instances
      expect(service1).not.toBe(service2);
      expect(menu1).not.toBe(menu2);
    });
  });
});
