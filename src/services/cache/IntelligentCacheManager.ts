
import { QueryClient } from '@tanstack/react-query';
import { LeadWithContacts, CRMFilters, CRMPipelineColumn } from '@/types/crm.types';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  version: string;
}

interface CacheStats {
  totalEntries: number;
  hitRate: number;
  missRate: number;
  memoryUsage: number;
  lastCleanup: number;
}

interface PersistentState {
  kanbanState: {
    selectedPipelineId: string | null;
    filters: CRMFilters;
    viewMode: 'kanban' | 'list';
    columnWidths: Record<string, number>;
  };
  userPreferences: {
    autoRefresh: boolean;
    showCompletedTasks: boolean;
    defaultView: 'kanban' | 'list';
  };
  offlineQueue: OfflineOperation[];
}

interface OfflineOperation {
  id: string;
  type: 'move_lead' | 'update_lead' | 'create_lead' | 'delete_lead';
  data: any;
  timestamp: number;
  retryCount: number;
}

export class IntelligentCacheManager {
  private cache = new Map<string, CacheEntry<any>>();
  private queryClient: QueryClient;
  private stats = {
    hits: 0,
    misses: 0,
    lastCleanup: Date.now()
  };
  
  private readonly STORAGE_KEY = 'crm_persistent_state';
  private readonly MAX_CACHE_SIZE = 500;
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutos
  private readonly CLEANUP_INTERVAL = 10 * 60 * 1000; // 10 minutos

  constructor(queryClient: QueryClient) {
    this.queryClient = queryClient;
    this.initializeCache();
    this.startPeriodicCleanup();
    this.setupNetworkListeners();
  }

  // === CACHE LOCAL ===
  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
      version: this.generateVersion()
    };

    this.cache.set(key, entry);
    this.enforceMaxSize();
    
    console.log(`🟢 [CACHE] Set: ${key} (TTL: ${ttl}ms)`);
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    
    if (!entry) {
      this.stats.misses++;
      console.log(`🔴 [CACHE] Miss: ${key}`);
      return null;
    }

    // Verificar TTL
    if (this.isExpired(entry)) {
      this.cache.delete(key);
      this.stats.misses++;
      console.log(`⏰ [CACHE] Expired: ${key}`);
      return null;
    }

    this.stats.hits++;
    console.log(`🟢 [CACHE] Hit: ${key}`);
    return entry.data;
  }

  // === CACHE ESPECÍFICO PARA LEADS ===
  cacheLeadsByColumn(pipelineId: string, leadsByColumn: Record<string, LeadWithContacts[]>): void {
    const key = `leads_by_column_${pipelineId}`;
    this.set(key, leadsByColumn, 2 * 60 * 1000); // 2 minutos para dados dinâmicos
  }

  getCachedLeadsByColumn(pipelineId: string): Record<string, LeadWithContacts[]> | null {
    const key = `leads_by_column_${pipelineId}`;
    return this.get(key);
  }

  cacheColumns(pipelineId: string, columns: CRMPipelineColumn[]): void {
    const key = `columns_${pipelineId}`;
    this.set(key, columns, 10 * 60 * 1000); // 10 minutos para dados estáticos
  }

  getCachedColumns(pipelineId: string): CRMPipelineColumn[] | null {
    const key = `columns_${pipelineId}`;
    return this.get(key);
  }

  // === PERSISTÊNCIA DE ESTADO ===
  savePersistentState(state: Partial<PersistentState>): void {
    try {
      const currentState = this.loadPersistentState();
      const newState = { ...currentState, ...state };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newState));
      console.log('💾 [CACHE] Estado persistido:', Object.keys(state));
    } catch (error) {
      console.error('❌ [CACHE] Erro ao persistir estado:', error);
    }
  }

  loadPersistentState(): PersistentState {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('❌ [CACHE] Erro ao carregar estado persistido:', error);
    }

    // Estado padrão
    return {
      kanbanState: {
        selectedPipelineId: null,
        filters: {},
        viewMode: 'kanban',
        columnWidths: {}
      },
      userPreferences: {
        autoRefresh: true,
        showCompletedTasks: false,
        defaultView: 'kanban'
      },
      offlineQueue: []
    };
  }

  // === QUEUE OFFLINE ===
  addToOfflineQueue(operation: Omit<OfflineOperation, 'id' | 'timestamp' | 'retryCount'>): void {
    const operationWithMeta: OfflineOperation = {
      ...operation,
      id: this.generateId(),
      timestamp: Date.now(),
      retryCount: 0
    };

    const state = this.loadPersistentState();
    state.offlineQueue.push(operationWithMeta);
    this.savePersistentState(state);

    console.log('📥 [CACHE] Operação adicionada à queue offline:', operation.type);
  }

  async processOfflineQueue(): Promise<void> {
    const state = this.loadPersistentState();
    const { offlineQueue } = state;

    if (offlineQueue.length === 0) return;

    console.log(`🔄 [CACHE] Processando ${offlineQueue.length} operações offline`);

    const processedIds: string[] = [];

    for (const operation of offlineQueue) {
      try {
        await this.executeOfflineOperation(operation);
        processedIds.push(operation.id);
        console.log(`✅ [CACHE] Operação processada: ${operation.type}`);
      } catch (error) {
        console.error(`❌ [CACHE] Erro ao processar operação ${operation.type}:`, error);
        
        // Incrementar contador de retry
        operation.retryCount++;
        
        // Remover após 3 tentativas
        if (operation.retryCount >= 3) {
          processedIds.push(operation.id);
          console.log(`🗑️ [CACHE] Operação removida após 3 tentativas: ${operation.type}`);
        }
      }
    }

    // Remover operações processadas
    state.offlineQueue = state.offlineQueue.filter(op => !processedIds.includes(op.id));
    this.savePersistentState(state);
  }

  // === INVALIDAÇÃO INTELIGENTE ===
  invalidateByPattern(pattern: string): void {
    const keysToDelete: string[] = [];
    
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => {
      this.cache.delete(key);
      console.log(`🗑️ [CACHE] Invalidated: ${key}`);
    });

    // Invalidar também no React Query
    this.queryClient.invalidateQueries({ 
      queryKey: [pattern],
      exact: false 
    });
  }

  invalidateLeadData(leadId: string): void {
    this.invalidateByPattern(`lead_${leadId}`);
    this.invalidateByPattern('leads_by_column');
  }

  invalidatePipelineData(pipelineId: string): void {
    this.invalidateByPattern(`pipeline_${pipelineId}`);
    this.invalidateByPattern(`columns_${pipelineId}`);
    this.invalidateByPattern(`leads_by_column_${pipelineId}`);
  }

  // === OTIMIZAÇÕES ===
  prefetchCriticalData(pipelineId: string): void {
    console.log(`🔮 [CACHE] Prefetching dados críticos para pipeline: ${pipelineId}`);
    
    // Prefetch será implementado pelos hooks específicos
    this.queryClient.prefetchQuery({
      queryKey: ['crm_pipelines'],
      staleTime: 10 * 60 * 1000
    });

    this.queryClient.prefetchQuery({
      queryKey: ['crm_columns', pipelineId],
      staleTime: 10 * 60 * 1000
    });
  }

  // === MÉTRICAS E LIMPEZA ===
  getStats(): CacheStats {
    const totalRequests = this.stats.hits + this.stats.misses;
    
    return {
      totalEntries: this.cache.size,
      hitRate: totalRequests > 0 ? (this.stats.hits / totalRequests) * 100 : 0,
      missRate: totalRequests > 0 ? (this.stats.misses / totalRequests) * 100 : 0,
      memoryUsage: this.calculateMemoryUsage(),
      lastCleanup: this.stats.lastCleanup
    };
  }

  cleanup(): void {
    const now = Date.now();
    let removedCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry)) {
        this.cache.delete(key);
        removedCount++;
      }
    }

    this.stats.lastCleanup = now;
    console.log(`🧹 [CACHE] Limpeza: ${removedCount} entradas removidas`);
  }

  clear(): void {
    this.cache.clear();
    this.stats.hits = 0;
    this.stats.misses = 0;
    console.log('🗑️ [CACHE] Cache limpo completamente');
  }

  // === MÉTODOS PRIVADOS ===
  private initializeCache(): void {
    console.log('🚀 [CACHE] Inicializando cache inteligente');
    
    // Verificar se há dados offline para processar
    const state = this.loadPersistentState();
    if (state.offlineQueue.length > 0) {
      console.log(`📬 [CACHE] ${state.offlineQueue.length} operações offline pendentes`);
    }
  }

  private startPeriodicCleanup(): void {
    setInterval(() => {
      this.cleanup();
    }, this.CLEANUP_INTERVAL);
  }

  private setupNetworkListeners(): void {
    window.addEventListener('online', () => {
      console.log('🌐 [CACHE] Conexão restaurada - processando queue offline');
      this.processOfflineQueue();
    });

    window.addEventListener('offline', () => {
      console.log('📴 [CACHE] Modo offline ativado');
    });
  }

  private async executeOfflineOperation(operation: OfflineOperation): Promise<void> {
    // Implementar execução baseada no tipo
    switch (operation.type) {
      case 'move_lead':
        // Implementar movimentação de lead
        break;
      case 'update_lead':
        // Implementar atualização de lead
        break;
      case 'create_lead':
        // Implementar criação de lead
        break;
      case 'delete_lead':
        // Implementar remoção de lead
        break;
    }
  }

  private isExpired(entry: CacheEntry<any>): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  private enforceMaxSize(): void {
    if (this.cache.size <= this.MAX_CACHE_SIZE) return;

    // Remover entradas mais antigas
    const entries = Array.from(this.cache.entries())
      .sort(([,a], [,b]) => a.timestamp - b.timestamp);

    const toRemove = entries.slice(0, this.cache.size - this.MAX_CACHE_SIZE);
    toRemove.forEach(([key]) => this.cache.delete(key));
  }

  private calculateMemoryUsage(): number {
    try {
      return JSON.stringify(Array.from(this.cache.entries())).length;
    } catch {
      return 0;
    }
  }

  private generateVersion(): string {
    return Date.now().toString(36);
  }

  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Instância singleton
let cacheManagerInstance: IntelligentCacheManager | null = null;

export const getIntelligentCacheManager = (queryClient: QueryClient): IntelligentCacheManager => {
  if (!cacheManagerInstance) {
    cacheManagerInstance = new IntelligentCacheManager(queryClient);
  }
  return cacheManagerInstance;
};

export const resetIntelligentCacheManager = (): void => {
  cacheManagerInstance = null;
};
