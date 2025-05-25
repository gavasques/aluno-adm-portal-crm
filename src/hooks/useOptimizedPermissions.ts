
import { useState, useEffect, useCallback, useMemo } from "react";
import { usePermissionCache } from "./usePermissionCache";
import { useAuth } from "@/hooks/auth";
import { debounce } from 'lodash';

interface OptimizedPermissions {
  hasAdminAccess: boolean;
  allowedMenus: string[];
  canAccessMenu: (menuKey: string) => Promise<boolean>;
}

export const useOptimizedPermissions = () => {
  const { user, loading: authLoading } = useAuth();
  const [permissions, setPermissions] = useState<OptimizedPermissions>({
    hasAdminAccess: false,
    allowedMenus: [],
    canAccessMenu: async () => false,
  });
  const [loading, setLoading] = useState(true);
  const [lastFetchTime, setLastFetchTime] = useState<number>(0);

  const {
    getCachedAdminStatus,
    getCachedAllowedMenus,
    getCachedMenuAccess,
    invalidateCache,
    getCacheStats,
  } = usePermissionCache();

  // Debounced invalidation para evitar invalidações muito frequentes
  const debouncedInvalidateCache = useMemo(
    () => debounce((pattern?: string) => {
      invalidateCache(pattern);
    }, 1000),
    [invalidateCache]
  );

  const fetchPermissions = useCallback(async () => {
    if (!user) {
      console.log("=== OPTIMIZED PERMISSIONS: No user ===");
      setPermissions({
        hasAdminAccess: false,
        allowedMenus: [],
        canAccessMenu: async () => false,
      });
      setLoading(false);
      return;
    }

    // Evitar refetch muito frequente
    const now = Date.now();
    if (now - lastFetchTime < 2000) { // 2 segundos
      console.log("⏱️ Fetch muito recente, usando cache");
      setLoading(false);
      return;
    }

    try {
      console.log("=== FETCHING OPTIMIZED PERMISSIONS ===");
      console.log("Cache stats:", getCacheStats());

      const startTime = performance.now();

      // Buscar dados em paralelo usando cache
      const [hasAdminAccess, allowedMenus] = await Promise.all([
        getCachedAdminStatus(),
        getCachedAllowedMenus(),
      ]);

      const endTime = performance.now();
      console.log(`⚡ Permissions fetched in ${(endTime - startTime).toFixed(2)}ms`);

      const optimizedCanAccessMenu = async (menuKey: string): Promise<boolean> => {
        // Se é admin, tem acesso a todos os menus
        if (hasAdminAccess) return true;
        
        // Usar cache para verificação de menu específico
        return getCachedMenuAccess(menuKey);
      };

      const newPermissions = {
        hasAdminAccess,
        allowedMenus,
        canAccessMenu: optimizedCanAccessMenu,
      };

      console.log("Final optimized permissions:", {
        hasAdminAccess,
        allowedMenusCount: allowedMenus.length,
      });

      setPermissions(newPermissions);
      setLastFetchTime(now);
      
    } catch (error) {
      console.error("Erro ao buscar permissões otimizadas:", error);
      setPermissions({
        hasAdminAccess: false,
        allowedMenus: [],
        canAccessMenu: async () => false,
      });
    } finally {
      setLoading(false);
    }
  }, [user?.id, getCachedAdminStatus, getCachedAllowedMenus, getCachedMenuAccess, getCacheStats, lastFetchTime]);

  // Effect para buscar permissões
  useEffect(() => {
    if (!authLoading) {
      fetchPermissions();
    }
  }, [authLoading, fetchPermissions]);

  // Invalidar cache quando usuário muda
  useEffect(() => {
    if (user?.id) {
      debouncedInvalidateCache();
    }
  }, [user?.id, debouncedInvalidateCache]);

  const refreshPermissions = useCallback(async () => {
    console.log("🔄 Refresh manual das permissões - invalidando cache");
    invalidateCache();
    await fetchPermissions();
  }, [invalidateCache, fetchPermissions]);

  return {
    permissions,
    loading,
    refreshPermissions,
    cacheStats: getCacheStats(),
  };
};
