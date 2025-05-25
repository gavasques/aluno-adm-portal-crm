
import { useCallback } from "react";
import { PermissionServiceFactory } from "@/services/permissions";
import type { CreatePermissionGroupData, UpdatePermissionGroupData } from "@/types/permissions";

export const usePermissionGroupCrud = () => {
  const permissionGroupService = PermissionServiceFactory.getPermissionGroupService();

  const createPermissionGroup = useCallback(async (groupData: CreatePermissionGroupData) => {
    return await permissionGroupService.create(groupData);
  }, [permissionGroupService]);

  const updatePermissionGroup = useCallback(async (groupData: UpdatePermissionGroupData) => {
    return await permissionGroupService.update(groupData);
  }, [permissionGroupService]);

  const deletePermissionGroup = useCallback(async (groupId: string) => {
    return await permissionGroupService.delete(groupId);
  }, [permissionGroupService]);

  return {
    createPermissionGroup,
    updatePermissionGroup,
    deletePermissionGroup,
  };
};
