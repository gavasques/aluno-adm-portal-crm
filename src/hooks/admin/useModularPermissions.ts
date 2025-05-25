
import { useState } from "react";
import { PermissionServiceFactory } from "@/services/permissions";
import type { SystemModule, ModulePermissionData } from "@/types/permissions";

export type { ModulePermissionData } from "@/types/permissions";

export const useModularPermissions = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const permissionGroupService = PermissionServiceFactory.getPermissionGroupService();

  const getGroupModulePermissions = async (groupId: string, modules: SystemModule[]): Promise<ModulePermissionData[]> => {
    try {
      return await permissionGroupService.getGroupModulePermissions(groupId, modules);
    } catch (error: any) {
      console.error("Erro ao buscar permissões modulares:", error);
      throw error;
    }
  };

  const saveGroupModulePermissions = async (groupId: string, permissions: ModulePermissionData[]) => {
    try {
      setIsSubmitting(true);
      const result = await permissionGroupService.saveGroupModulePermissions(groupId, permissions);
      
      if (!result.success) {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error("Erro ao salvar permissões modulares:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    getGroupModulePermissions,
    saveGroupModulePermissions,
  };
};
