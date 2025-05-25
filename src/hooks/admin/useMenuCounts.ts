
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useMenuCounts = (permissionGroupIds: string[]) => {
  const [menuCounts, setMenuCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchMenuCounts = useCallback(async () => {
    console.log("DEBUG - useMenuCounts: Iniciando busca de contagens", permissionGroupIds.length);
    
    if (permissionGroupIds.length === 0) {
      console.log("DEBUG - useMenuCounts: Nenhum grupo para buscar");
      setMenuCounts({});
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from("permission_group_menus")
        .select("permission_group_id")
        .in("permission_group_id", permissionGroupIds);

      if (error) {
        console.error("Erro ao buscar contagens de menus:", error);
        return;
      }

      // Contar menus por grupo
      const counts = data.reduce((acc, item) => {
        acc[item.permission_group_id] = (acc[item.permission_group_id] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      console.log("DEBUG - useMenuCounts: Contagens calculadas:", counts);
      setMenuCounts(counts);
    } catch (error) {
      console.error("Erro ao carregar contagens de menus:", error);
    } finally {
      setIsLoading(false);
    }
  }, [permissionGroupIds.join(','), refreshTrigger]);

  const refreshMenuCounts = useCallback(() => {
    console.log("DEBUG - useMenuCounts: Forçando refresh das contagens");
    setRefreshTrigger(prev => prev + 1);
  }, []);

  useEffect(() => {
    fetchMenuCounts();
  }, [fetchMenuCounts]);

  return { menuCounts, isLoading, refreshMenuCounts };
};
