
import { usePermissionGroupsState } from "./permissions/usePermissionGroupsState";
import { usePermissionGroupCrud } from "./permissions/usePermissionGroupCrud";
import { usePermissionGroupOperations } from "./permissions/usePermissionGroupOperations";

export type { PermissionGroup } from "./permissions/usePermissionGroupsState";

export const usePermissionGroups = () => {
  const stateHooks = usePermissionGroupsState();
  const crudHooks = usePermissionGroupCrud();
  const operationsHooks = usePermissionGroupOperations();

  return {
    ...stateHooks,
    ...crudHooks,
    ...operationsHooks,
  };
};
