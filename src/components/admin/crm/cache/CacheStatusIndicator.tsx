
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Database, 
  RefreshCw, 
  BarChart3,
  Trash2
} from 'lucide-react';
import { useIntelligentCRMCache } from '@/hooks/crm/useIntelligentCRMCache';
import { motion } from 'framer-motion';

interface CacheStatusIndicatorProps {
  showDetails?: boolean;
  className?: string;
}

export const CacheStatusIndicator: React.FC<CacheStatusIndicatorProps> = ({
  showDetails = false,
  className = ''
}) => {
  const {
    getCacheStats,
    cleanupCache,
    clearCache,
    processOfflineQueue
  } = useIntelligentCRMCache();

  const [stats, setStats] = useState(getCacheStats());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Atualizar estatísticas periodicamente
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(getCacheStats());
    }, 5000);

    return () => clearInterval(interval);
  }, [getCacheStats]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await processOfflineQueue();
      cleanupCache();
      setStats(getCacheStats());
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleClearCache = () => {
    clearCache();
    setStats(getCacheStats());
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  if (!showDetails) {
    // Versão compacta para header - removido indicadores de conexão
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Badge variant="outline" className="flex items-center gap-1">
          <Database className="h-3 w-3" />
          {stats.totalEntries}
        </Badge>

        {stats.hitRate > 0 && (
          <Badge variant="outline" className="flex items-center gap-1">
            <BarChart3 className="h-3 w-3" />
            {stats.hitRate.toFixed(0)}%
          </Badge>
        )}
      </div>
    );
  }

  // Versão detalhada
  return (
    <Card className={className}>
      <CardContent className="pt-4">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
              <Database className="h-4 w-4" />
              Status do Cache
            </h3>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearCache}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-500">Entradas</div>
              <div className="font-semibold">{stats.totalEntries}</div>
            </div>
            
            <div>
              <div className="text-gray-500">Taxa de Hit</div>
              <div className="font-semibold">{stats.hitRate.toFixed(1)}%</div>
            </div>
            
            <div>
              <div className="text-gray-500">Memória</div>
              <div className="font-semibold">{formatBytes(stats.memoryUsage)}</div>
            </div>
            
            <div>
              <div className="text-gray-500">Última Limpeza</div>
              <div className="font-semibold">
                {new Date(stats.lastCleanup).toLocaleTimeString()}
              </div>
            </div>
          </div>

          {/* Indicador de Performance */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-500">Performance</span>
              <span className="text-xs text-gray-500">{stats.hitRate.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <motion.div
                className="bg-blue-600 h-1.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(stats.hitRate, 100)}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
