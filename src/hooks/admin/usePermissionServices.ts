
import { PermissionServiceFactory } from "@/services/permissions";

export const usePermissionServices = () => {
  return {
    permissionGroupService: PermissionServiceFactory.getPermissionGroupService(),
    systemMenuService: PermissionServiceFactory.getSystemMenuService(),
    systemModuleService: PermissionServiceFactory.getSystemModuleService(),
    validationService: PermissionServiceFactory.getPermissionValidationService(),
  };
};
