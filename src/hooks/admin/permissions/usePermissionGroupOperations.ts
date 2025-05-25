
import { useCallback } from "react";
import { PermissionServiceFactory } from "@/services/permissions";

export const usePermissionGroupOperations = () => {
  const permissionGroupService = PermissionServiceFactory.getPermissionGroupService();

  const getPermissionGroupMenus = useCallback(async (groupId: string) => {
    try {
      return await permissionGroupService.getGroupMenus(groupId);
    } catch (error: any) {
      console.error("Erro ao carregar menus do grupo:", error);
      throw error;
    }
  }, [permissionGroupService]);

  const getPermissionGroupUsers = useCallback(async (groupId: string) => {
    try {
      return await permissionGroupService.getGroupUsers(groupId);
    } catch (error: any) {
      console.error("Erro ao carregar usuários do grupo:", error);
      throw error;
    }
  }, [permissionGroupService]);

  const removeUserFromGroup = useCallback(async (userId: string) => {
    const result = await permissionGroupService.removeUserFromGroup(userId);
    if (!result.success) {
      throw new Error(result.error);
    }
  }, [permissionGroupService]);

  return {
    getPermissionGroupMenus,
    getPermissionGroupUsers,
    removeUserFromGroup,
  };
};
