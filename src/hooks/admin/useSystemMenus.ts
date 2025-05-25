
import { useState, useEffect } from "react";
import { PermissionServiceFactory } from "@/services/permissions";
import type { SystemMenu } from "@/types/permissions";

export const useSystemMenus = () => {
  const [systemMenus, setSystemMenus] = useState<SystemMenu[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const systemMenuService = PermissionServiceFactory.getSystemMenuService();

  useEffect(() => {
    const fetchSystemMenus = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const menus = await systemMenuService.getAll();
        setSystemMenus(menus);
      } catch (err: any) {
        console.error("Erro ao carregar menus do sistema:", err);
        setError(err.message || "Erro ao carregar menus do sistema");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSystemMenus();
  }, [systemMenuService]);

  return {
    systemMenus,
    isLoading,
    error,
  };
};
