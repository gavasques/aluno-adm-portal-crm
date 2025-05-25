
import { useState, useEffect, useCallback, useRef } from 'react';
import { PermissionServiceFactory } from '@/services/permissions';

interface PermissionCache {
  userPermissions: Map<string, any>;
  menuAccess: Map<string, boolean>;
  adminStatus: Map<string, boolean>;
  lastUpdated: Map<string, number>;
}

const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutos

export const usePermissionCache = () => {
  const cacheRef = useRef<PermissionCache>({
    userPermissions: new Map(),
    menuAccess: new Map(),
    adminStatus: new Map(),
    lastUpdated: new Map(),
  });

  const validationService = PermissionServiceFactory.getPermissionValidationService();
  const menuService = PermissionServiceFactory.getSystemMenuService();

  const isCacheValid = useCallback((key: string): boolean => {
    const lastUpdated = cacheRef.current.lastUpdated.get(key);
    if (!lastUpdated) return false;
    return Date.now() - lastUpdated < CACHE_EXPIRY;
  }, []);

  const getCachedMenuAccess = useCallback(async (menuKey: string): Promise<boolean> => {
    const cacheKey = `menu_${menuKey}`;
    
    if (isCacheValid(cacheKey)) {
      const cached = cacheRef.current.menuAccess.get(cacheKey);
      if (cached !== undefined) {
        console.log(`🔍 Cache HIT para menu: ${menuKey}`);
        return cached;
      }
    }

    console.log(`🔄 Cache MISS para menu: ${menuKey} - fazendo consulta`);
    const hasAccess = await validationService.canAccessMenu(menuKey);
    
    cacheRef.current.menuAccess.set(cacheKey, hasAccess);
    cacheRef.current.lastUpdated.set(cacheKey, Date.now());
    
    return hasAccess;
  }, [validationService, isCacheValid]);

  const getCachedAdminStatus = useCallback(async (): Promise<boolean> => {
    const cacheKey = 'admin_status';
    
    if (isCacheValid(cacheKey)) {
      const cached = cacheRef.current.adminStatus.get(cacheKey);
      if (cached !== undefined) {
        console.log('🔍 Cache HIT para status admin');
        return cached;
      }
    }

    console.log('🔄 Cache MISS para status admin - fazendo consulta');
    const isAdmin = await validationService.hasAdminAccess();
    
    cacheRef.current.adminStatus.set(cacheKey, isAdmin);
    cacheRef.current.lastUpdated.set(cacheKey, Date.now());
    
    return isAdmin;
  }, [validationService, isCacheValid]);

  const getCachedAllowedMenus = useCallback(async (): Promise<string[]> => {
    const cacheKey = 'allowed_menus';
    
    if (isCacheValid(cacheKey)) {
      const cached = cacheRef.current.userPermissions.get(cacheKey);
      if (cached) {
        console.log('🔍 Cache HIT para menus permitidos');
        return cached;
      }
    }

    console.log('🔄 Cache MISS para menus permitidos - fazendo consulta');
    const allowedMenus = await menuService.getAllowedMenusForUser();
    
    cacheRef.current.userPermissions.set(cacheKey, allowedMenus);
    cacheRef.current.lastUpdated.set(cacheKey, Date.now());
    
    return allowedMenus;
  }, [menuService, isCacheValid]);

  const invalidateCache = useCallback((pattern?: string) => {
    if (pattern) {
      // Invalidar caches que correspondem ao padrão
      for (const key of cacheRef.current.lastUpdated.keys()) {
        if (key.includes(pattern)) {
          cacheRef.current.lastUpdated.delete(key);
          cacheRef.current.menuAccess.delete(key);
          cacheRef.current.adminStatus.delete(key);
          cacheRef.current.userPermissions.delete(key);
        }
      }
      console.log(`🗑️ Cache invalidado para padrão: ${pattern}`);
    } else {
      // Limpar todo o cache
      cacheRef.current.userPermissions.clear();
      cacheRef.current.menuAccess.clear();
      cacheRef.current.adminStatus.clear();
      cacheRef.current.lastUpdated.clear();
      console.log('🗑️ Todo o cache foi limpo');
    }
  }, []);

  const getCacheStats = useCallback(() => {
    return {
      menuAccessSize: cacheRef.current.menuAccess.size,
      adminStatusSize: cacheRef.current.adminStatus.size,
      userPermissionsSize: cacheRef.current.userPermissions.size,
      totalEntries: cacheRef.current.lastUpdated.size,
    };
  }, []);

  return {
    getCachedMenuAccess,
    getCachedAdminStatus,
    getCachedAllowedMenus,
    invalidateCache,
    getCacheStats,
  };
};
