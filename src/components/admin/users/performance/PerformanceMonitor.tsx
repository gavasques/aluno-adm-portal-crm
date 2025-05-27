
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  Zap, 
  Database, 
  Clock, 
  BarChart3,
  RefreshCw
} from "lucide-react";

interface PerformanceMetrics {
  totalEntries: number;
  hitRate: number;
  memoryUsage: number;
  lastCleanup: number;
  totalUsers: number;
  filteredUsers: number;
  isOptimized: boolean;
}

interface PerformanceMonitorProps {
  metrics: PerformanceMetrics;
  onClearCache?: () => void;
  className?: string;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  metrics,
  onClearCache,
  className = ""
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  useEffect(() => {
    setLastUpdate(Date.now());
  }, [metrics]);

  const getHitRateColor = (rate: number) => {
    if (rate >= 80) return "bg-green-500";
    if (rate >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getPerformanceStatus = () => {
    if (metrics.hitRate >= 80 && metrics.memoryUsage < 100) {
      return { status: "Excelente", color: "bg-green-500", icon: Zap };
    }
    if (metrics.hitRate >= 60 && metrics.memoryUsage < 200) {
      return { status: "Bom", color: "bg-yellow-500", icon: Activity };
    }
    return { status: "Pode Melhorar", color: "bg-red-500", icon: BarChart3 };
  };

  const performance = getPerformanceStatus();
  const StatusIcon = performance.icon;

  if (!isVisible) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsVisible(true)}
        className={`fixed bottom-4 right-4 z-50 ${className}`}
      >
        <Activity className="w-4 h-4 mr-2" />
        Performance
      </Button>
    );
  }

  return (
    <Card className={`fixed bottom-4 right-4 w-80 z-50 shadow-lg ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <StatusIcon className="w-4 h-4" />
            Monitor de Performance
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="h-6 w-6 p-0"
          >
            ×
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Status Geral */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Status:</span>
          <Badge className={`${performance.color} text-white`}>
            {performance.status}
          </Badge>
        </div>

        {/* Hit Rate */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Hit Rate:</span>
            <span className="text-sm font-medium">{metrics.hitRate.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${getHitRateColor(metrics.hitRate)}`}
              style={{ width: `${Math.min(metrics.hitRate, 100)}%` }}
            />
          </div>
        </div>

        {/* Métricas do Cache */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-1">
            <Database className="w-3 h-3 text-blue-500" />
            <span className="text-muted-foreground">Entradas:</span>
            <span className="font-medium">{metrics.totalEntries}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Activity className="w-3 h-3 text-green-500" />
            <span className="text-muted-foreground">Memória:</span>
            <span className="font-medium">{metrics.memoryUsage.toFixed(1)}KB</span>
          </div>
        </div>

        {/* Métricas dos Usuários */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="text-muted-foreground">
            Total: <span className="font-medium text-foreground">{metrics.totalUsers}</span>
          </div>
          <div className="text-muted-foreground">
            Filtrados: <span className="font-medium text-foreground">{metrics.filteredUsers}</span>
          </div>
        </div>

        {/* Última Atualização */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Atualizado há {Math.floor((Date.now() - lastUpdate) / 1000)}s
          </div>
          
          {metrics.isOptimized && (
            <Badge variant="outline" className="text-xs">
              Otimizado
            </Badge>
          )}
        </div>

        {/* Ações */}
        {onClearCache && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearCache}
            className="w-full text-xs"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Limpar Cache
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
