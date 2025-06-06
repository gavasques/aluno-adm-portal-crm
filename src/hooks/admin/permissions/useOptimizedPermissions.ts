
import { useState, useEffect, useCallback, useMemo } from "react";
import { PermissionServiceFactory } from "@/services/permissions";
import { useDebounce } from "use-debounce";
import type { PermissionGroup } from "@/types/permissions";

interface OptimizedPermissionsState {
  permissionGroups: PermissionGroup[];
  filteredGroups: PermissionGroup[];
  menuCounts: Record<string, number>;
  isLoading: boolean;
  isSearching: boolean;
  error: string | null;
  searchTerm: string;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class PermissionsCache {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutos

  set<T>(key: string, data: T, ttl = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  invalidate(pattern?: string): void {
    if (!pattern) {
      this.cache.clear();
      return;
    }

    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }
}

const permissionsCache = new PermissionsCache();

export const useOptimizedPermissions = () => {
  const [state, setState] = useState<OptimizedPermissionsState>({
    permissionGroups: [],
    filteredGroups: [],
    menuCounts: {},
    isLoading: true,
    isSearching: false,
    error: null,
    searchTerm: "",
  });

  const [debouncedSearchTerm] = useDebounce(state.searchTerm, 300);

  const permissionGroupService = PermissionServiceFactory.getPermissionGroupService();

  // Função memoizada para filtrar grupos
  const filteredGroups = useMemo(() => {
    if (!debouncedSearchTerm) return state.permissionGroups;

    const term = debouncedSearchTerm.toLowerCase();
    return state.permissionGroups.filter(group =>
      group.name.toLowerCase().includes(term) ||
      group.description?.toLowerCase().includes(term)
    );
  }, [state.permissionGroups, debouncedSearchTerm]);

  // Carregar grupos de permissão com cache
  const fetchPermissionGroups = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // Verificar cache primeiro
      const cachedGroups = permissionsCache.get<PermissionGroup[]>('permission-groups');
      if (cachedGroups) {
        setState(prev => ({
          ...prev,
          permissionGroups: cachedGroups,
          isLoading: false
        }));
        return;
      }

      const groups = await permissionGroupService.getAll();
      permissionsCache.set('permission-groups', groups);

      setState(prev => ({
        ...prev,
        permissionGroups: groups,
        isLoading: false
      }));
    } catch (error: any) {
      console.error("Erro ao carregar grupos:", error);
      setState(prev => ({
        ...prev,
        error: error.message || "Erro ao carregar grupos",
        isLoading: false
      }));
    }
  }, [permissionGroupService]);

  // Carregar contagem de menus de forma lazy
  const fetchMenuCounts = useCallback(async (groupIds: string[]) => {
    if (groupIds.length === 0) return;

    try {
      const counts: Record<string, number> = {};
      
      // Carregar apenas counts não cached
      const uncachedIds = groupIds.filter(id => !permissionsCache.get(`menu-count-${id}`));
      
      if (uncachedIds.length === 0) {
        // Todos os counts estão em cache
        groupIds.forEach(id => {
          const cached = permissionsCache.get<number>(`menu-count-${id}`);
          if (cached !== null) counts[id] = cached;
        });
        
        setState(prev => ({ ...prev, menuCounts: { ...prev.menuCounts, ...counts } }));
        return;
      }

      // Carregar counts em lotes para melhor performance
      const batchSize = 5;
      for (let i = 0; i < uncachedIds.length; i += batchSize) {
        const batch = uncachedIds.slice(i, i + batchSize);
        
        await Promise.all(
          batch.map(async (groupId) => {
            try {
              const menus = await permissionGroupService.getGroupMenus(groupId);
              const count = menus.length;
              counts[groupId] = count;
              permissionsCache.set(`menu-count-${groupId}`, count, 10 * 60 * 1000); // 10 min cache
            } catch (error) {
              console.error(`Erro ao buscar menus do grupo ${groupId}:`, error);
              counts[groupId] = 0;
            }
          })
        );
      }

      setState(prev => ({ ...prev, menuCounts: { ...prev.menuCounts, ...counts } }));
    } catch (error) {
      console.error("Erro ao buscar contagens de menus:", error);
    }
  }, [permissionGroupService]);

  // Atualizar busca
  const setSearchTerm = useCallback((term: string) => {
    setState(prev => ({ 
      ...prev, 
      searchTerm: term,
      isSearching: term !== debouncedSearchTerm
    }));
  }, [debouncedSearchTerm]);

  // Limpar busca
  const clearSearch = useCallback(() => {
    setState(prev => ({ ...prev, searchTerm: "", isSearching: false }));
  }, []);

  // Refresh com invalidação de cache
  const refreshPermissionGroups = useCallback(() => {
    permissionsCache.invalidate('permission-groups');
    permissionsCache.invalidate('menu-count');
    fetchPermissionGroups();
  }, [fetchPermissionGroups]);

  // Invalidar cache específico
  const invalidateCache = useCallback((pattern?: string) => {
    permissionsCache.invalidate(pattern);
  }, []);

  // Efeito para carregar dados iniciais
  useEffect(() => {
    fetchPermissionGroups();
  }, [fetchPermissionGroups]);

  // Efeito para atualizar filtros
  useEffect(() => {
    setState(prev => ({ 
      ...prev, 
      filteredGroups,
      isSearching: state.searchTerm !== debouncedSearchTerm
    }));
  }, [filteredGroups, state.searchTerm, debouncedSearchTerm]);

  // Efeito para carregar menu counts de forma lazy
  useEffect(() => {
    if (state.permissionGroups.length > 0) {
      const groupIds = state.permissionGroups.map(g => g.id);
      fetchMenuCounts(groupIds);
    }
  }, [state.permissionGroups, fetchMenuCounts]);

  return {
    ...state,
    filteredGroups,
    setSearchTerm,
    clearSearch,
    refreshPermissionGroups,
    invalidateCache,
  };
};
