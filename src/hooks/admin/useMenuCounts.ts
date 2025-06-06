
import { useState, useEffect } from "react";
import { PermissionServiceFactory } from "@/services/permissions";

export const useMenuCounts = (groupIds: string[]) => {
  const [menuCounts, setMenuCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMenuCounts = async () => {
      if (groupIds.length === 0) return;

      try {
        setIsLoading(true);
        const permissionGroupService = PermissionServiceFactory.getPermissionGroupService();
        
        const counts: Record<string, number> = {};
        
        await Promise.all(
          groupIds.map(async (groupId) => {
            try {
              const menus = await permissionGroupService.getGroupMenus(groupId);
              counts[groupId] = menus.length;
            } catch (error) {
              console.error(`Erro ao buscar menus do grupo ${groupId}:`, error);
              counts[groupId] = 0;
            }
          })
        );
        
        setMenuCounts(counts);
      } catch (error) {
        console.error("Erro ao buscar contagens de menus:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuCounts();
  }, [groupIds]);

  return { menuCounts, isLoading };
};
