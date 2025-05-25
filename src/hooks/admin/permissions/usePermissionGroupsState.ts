
import { useState, useEffect, useCallback } from "react";
import { PermissionServiceFactory } from "@/services/permissions";
import { toast } from "@/hooks/use-toast";
import type { PermissionGroup } from "@/types/permissions";

export { PermissionGroup } from "@/types/permissions";

export const usePermissionGroupsState = () => {
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const permissionGroupService = PermissionServiceFactory.getPermissionGroupService();

  const fetchPermissionGroups = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const groups = await permissionGroupService.getAll();
      setPermissionGroups(groups);
    } catch (err: any) {
      console.error("Erro ao carregar grupos de permissão:", err);
      setError(err.message || "Erro ao carregar grupos de permissão");
      
      if (err.message?.includes("permission denied") || err.message?.includes("RLS")) {
        toast({
          title: "Erro de permissão",
          description: "Não foi possível carregar os grupos de permissão. Verifique suas permissões.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [permissionGroupService]);

  const refreshPermissionGroups = useCallback(() => {
    fetchPermissionGroups();
  }, [fetchPermissionGroups]);

  useEffect(() => {
    fetchPermissionGroups();
  }, [fetchPermissionGroups]);

  return {
    permissionGroups,
    isLoading,
    error,
    refreshPermissionGroups,
  };
};
