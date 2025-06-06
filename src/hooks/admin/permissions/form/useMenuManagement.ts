
import { useEffect } from "react";
import { usePermissionGroupOperations } from "../usePermissionGroupOperations";

interface UseMenuManagementProps {
  isEdit: boolean;
  permissionGroup?: any;
  isAdmin: boolean;
  selectedMenus: string[];
  setSelectedMenus: (menus: string[]) => void;
  setLoadingGroupData: (loading: boolean) => void;
}

export const useMenuManagement = ({
  isEdit,
  permissionGroup,
  isAdmin,
  selectedMenus,
  setSelectedMenus,
  setLoadingGroupData,
}: UseMenuManagementProps) => {
  const { getPermissionGroupMenus } = usePermissionGroupOperations();

  useEffect(() => {
    const loadGroupMenus = async () => {
      if (isEdit && permissionGroup && !isAdmin) {
        try {
          setLoadingGroupData(true);
          const menus = await getPermissionGroupMenus(permissionGroup.id);
          setSelectedMenus(menus);
        } catch (error) {
          console.error("Erro ao carregar menus do grupo:", error);
          setSelectedMenus([]);
        } finally {
          setLoadingGroupData(false);
        }
      } else if (isAdmin) {
        // Admin não tem menus específicos
        setSelectedMenus([]);
      }
    };

    loadGroupMenus();
  }, [isEdit, permissionGroup?.id, isAdmin, getPermissionGroupMenus, setSelectedMenus, setLoadingGroupData]);

  const handleMenuToggle = (menuKey: string) => {
    const newSelectedMenus = selectedMenus.includes(menuKey)
      ? selectedMenus.filter(key => key !== menuKey)
      : [...selectedMenus, menuKey];
    
    setSelectedMenus(newSelectedMenus);
  };

  return { handleMenuToggle };
};
