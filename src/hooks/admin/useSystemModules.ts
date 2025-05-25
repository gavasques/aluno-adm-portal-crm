
import { useState, useEffect, useCallback } from "react";
import { PermissionServiceFactory } from "@/services/permissions";
import type { SystemModule } from "@/types/permissions";

export const useSystemModules = () => {
  const [modules, setModules] = useState<SystemModule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const systemModuleService = PermissionServiceFactory.getSystemModuleService();

  const fetchModules = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const modulesList = await systemModuleService.getAll();
      setModules(modulesList);
    } catch (err: any) {
      console.error("Erro ao carregar módulos do sistema:", err);
      setError(err.message || "Erro ao carregar módulos do sistema");
    } finally {
      setIsLoading(false);
    }
  }, [systemModuleService]);

  const forceRefresh = useCallback(() => {
    fetchModules();
  }, [fetchModules]);

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  const getModulesByCategory = () => {
    return modules.reduce((acc, module) => {
      const category = module.category || 'other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(module);
      return acc;
    }, {} as Record<string, SystemModule[]>);
  };

  return {
    modules,
    isLoading,
    error,
    getModulesByCategory,
    forceRefresh,
  };
};
