
import { useCallback, useRef, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { User } from '@/types/user.types';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  hits: number;
}

interface UserCacheMetrics {
  totalEntries: number;
  hitRate: number;
  memoryUsage: number;
  lastCleanup: number;
}

const CACHE_TTL = 5 * 60 * 1000; // 5 minutos
const MAX_CACHE_SIZE = 1000;
const CLEANUP_INTERVAL = 10 * 60 * 1000; // 10 minutos

export const useOptimizedUserCache = () => {
  const queryClient = useQueryClient();
  const cacheRef = useRef<Map<string, CacheEntry<any>>>(new Map());
  const metricsRef = useRef({
    hits: 0,
    misses: 0,
    lastCleanup: Date.now()
  });

  // Cleanup automático de cache
  const cleanupCache = useCallback(() => {
    const now = Date.now();
    const cache = cacheRef.current;
    let removedCount = 0;

    // Remover entradas expiradas
    for (const [key, entry] of cache.entries()) {
      if (now - entry.timestamp > CACHE_TTL) {
        cache.delete(key);
        removedCount++;
      }
    }

    // Se ainda está muito grande, remover as menos usadas
    if (cache.size > MAX_CACHE_SIZE) {
      const entries = Array.from(cache.entries())
        .sort((a, b) => a[1].hits - b[1].hits)
        .slice(0, cache.size - MAX_CACHE_SIZE);
      
      entries.forEach(([key]) => {
        cache.delete(key);
        removedCount++;
      });
    }

    metricsRef.current.lastCleanup = now;
    console.log(`🧹 Cache cleanup: removidas ${removedCount} entradas`);
  }, []);

  // Set com TTL e métricas
  const setCacheEntry = useCallback(<T>(key: string, data: T): void => {
    const now = Date.now();
    
    // Cleanup periódico
    if (now - metricsRef.current.lastCleanup > CLEANUP_INTERVAL) {
      cleanupCache();
    }

    cacheRef.current.set(key, {
      data,
      timestamp: now,
      hits: 0
    });
  }, [cleanupCache]);

  // Get com métricas
  const getCacheEntry = useCallback(<T>(key: string): T | null => {
    const entry = cacheRef.current.get(key) as CacheEntry<T> | undefined;
    
    if (!entry) {
      metricsRef.current.misses++;
      return null;
    }

    // Verificar TTL
    if (Date.now() - entry.timestamp > CACHE_TTL) {
      cacheRef.current.delete(key);
      metricsRef.current.misses++;
      return null;
    }

    // Incrementar hits
    entry.hits++;
    metricsRef.current.hits++;
    
    return entry.data;
  }, []);

  // Cache específico para usuários
  const cacheFilteredUsers = useCallback((filters: any, users: User[]) => {
    const key = `filtered_${JSON.stringify(filters)}`;
    setCacheEntry(key, users);
  }, [setCacheEntry]);

  const getCachedFilteredUsers = useCallback((filters: any): User[] | null => {
    const key = `filtered_${JSON.stringify(filters)}`;
    return getCacheEntry<User[]>(key);
  }, [getCacheEntry]);

  // Cache para estatísticas
  const cacheUserStats = useCallback((stats: any) => {
    setCacheEntry('user_stats', stats);
  }, [setCacheEntry]);

  const getCachedUserStats = useCallback(() => {
    return getCacheEntry('user_stats');
  }, [getCacheEntry]);

  // Invalidação inteligente
  const smartInvalidate = useCallback((pattern?: string) => {
    if (pattern) {
      // Invalidar apenas chaves que correspondem ao padrão
      for (const key of cacheRef.current.keys()) {
        if (key.includes(pattern)) {
          cacheRef.current.delete(key);
        }
      }
      console.log(`🗑️ Cache invalidado para padrão: ${pattern}`);
    } else {
      // Limpar tudo
      cacheRef.current.clear();
      console.log('🗑️ Cache completamente limpo');
    }
    
    // Invalidar React Query também
    queryClient.invalidateQueries({ queryKey: ['users'] });
  }, [queryClient]);

  // Métricas de performance
  const getMetrics = useCallback((): UserCacheMetrics => {
    const cache = cacheRef.current;
    const metrics = metricsRef.current;
    const totalRequests = metrics.hits + metrics.misses;
    
    return {
      totalEntries: cache.size,
      hitRate: totalRequests > 0 ? (metrics.hits / totalRequests) * 100 : 0,
      memoryUsage: cache.size * 0.001, // Estimativa em KB
      lastCleanup: metrics.lastCleanup
    };
  }, []);

  // Preload inteligente
  const preloadCommonFilters = useCallback((users: User[]) => {
    // Precarregar filtros comuns
    const commonFilters = [
      { search: '', status: 'all', group: 'all' },
      { search: '', status: 'ativo', group: 'all' },
      { search: '', status: 'all', group: 'pending' },
    ];

    commonFilters.forEach(filters => {
      if (!getCachedFilteredUsers(filters)) {
        // Simular filtragem para preload
        const filtered = users.filter(user => {
          const matchesStatus = filters.status === 'all' || 
            user.status?.toLowerCase().includes(filters.status.toLowerCase());
          const matchesGroup = filters.group === 'all' || 
            (filters.group === 'pending' && user.permission_group_id === 'some-condition');
          return matchesStatus && matchesGroup;
        });
        cacheFilteredUsers(filters, filtered);
      }
    });
  }, [getCachedFilteredUsers, cacheFilteredUsers]);

  return {
    // Cache operations
    setCacheEntry,
    getCacheEntry,
    
    // User-specific cache
    cacheFilteredUsers,
    getCachedFilteredUsers,
    cacheUserStats,
    getCachedUserStats,
    
    // Management
    smartInvalidate,
    cleanupCache,
    getMetrics,
    preloadCommonFilters,
  };
};
