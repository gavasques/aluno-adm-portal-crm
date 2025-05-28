
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, Activity, Users, Database, Eye, RefreshCw, TrendingUp, BarChart3, Brain } from 'lucide-react';
import { useAuditLogs, AuditFilters } from '@/hooks/admin/useAuditLogs';
import { useAuditMetrics } from '@/hooks/admin/useAuditMetrics';
import { useSecurityAlerts } from '@/hooks/admin/useSecurityAlerts';
import { useSupabaseAuditInterceptor } from '@/hooks/admin/useSupabaseAuditInterceptor';
import { SecurityNotifications } from './SecurityNotifications';
import { EnhancedAuditFilters } from './EnhancedAuditFilters';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';

export const RealTimeAuditDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<AuditFilters>({});
  const { logs, loading: logsLoading, refetch: refetchLogs } = useAuditLogs(filters);
  const { metrics, loading: metricsLoading, refetch: refetchMetrics } = useAuditMetrics();
  const { unreadCount: alertsCount } = useSecurityAlerts();

  // Ativar interceptação automática de operações CRUD
  useSupabaseAuditInterceptor();

  const handleRefresh = () => {
    refetchLogs();
    refetchMetrics();
  };

  const handleFiltersReset = () => {
    setFilters({});
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      default: return 'bg-green-500 text-white';
    }
  };

  if (metricsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48 mt-2" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard de Auditoria</h1>
          <p className="text-gray-600">Monitoramento em tempo real de eventos do sistema</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/admin/auditoria/behavior')}>
            <Brain className="h-4 w-4 mr-2" />
            IA Comportamental
          </Button>
          <Button variant="outline" onClick={() => navigate('/admin/auditoria/analytics')}>
            <TrendingUp className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          <Button variant="outline" onClick={() => navigate('/admin/auditoria/reports')}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Relatórios
          </Button>
          <SecurityNotifications />
          <Button onClick={handleRefresh} disabled={logsLoading || metricsLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${(logsLoading || metricsLoading) ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Indicador de Interceptação Ativa */}
      <Alert className="border-blue-200 bg-blue-50">
        <Shield className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-blue-700">
          ✅ Sistema de interceptação automática de operações CRUD ativo. Todas as mudanças críticas estão sendo monitoradas em tempo real.
        </AlertDescription>
      </Alert>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total de Logs</p>
                <p className="text-2xl font-bold">{metrics?.totalLogs || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Eventos Hoje</p>
                <p className="text-2xl font-bold">{metrics?.todayLogs || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">Alto Risco</p>
                <p className="text-2xl font-bold">{metrics?.highRiskEvents || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">Falhas</p>
                <p className="text-2xl font-bold">{metrics?.failedEvents || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={alertsCount > 0 ? 'border-red-200 bg-red-50' : ''}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className={`h-5 w-5 ${alertsCount > 0 ? 'text-red-500' : 'text-gray-500'}`} />
              <div>
                <p className="text-sm text-gray-600">Alertas Ativos</p>
                <p className={`text-2xl font-bold ${alertsCount > 0 ? 'text-red-600' : ''}`}>
                  {alertsCount}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas de Segurança */}
      {alertsCount > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-700">
            Existem {alertsCount} alertas de segurança ativos que requerem atenção.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="logs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="logs">Logs de Auditoria</TabsTrigger>
          <TabsTrigger value="metrics">Métricas</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="space-y-4">
          {/* Filtros Avançados */}
          <EnhancedAuditFilters
            filters={filters}
            onFiltersChange={setFilters}
            onReset={handleFiltersReset}
          />

          {/* Lista de Logs */}
          <Card>
            <CardHeader>
              <CardTitle>
                Logs de Auditoria 
                {!logsLoading && (
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    ({logs.length} registros)
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {logsLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : logs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Nenhum log encontrado com os filtros aplicados.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {logs.map((log) => (
                    <div key={log.id} className="border rounded p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge className={getRiskBadgeColor(log.risk_level)}>
                            {log.risk_level}
                          </Badge>
                          <Badge variant="outline">{log.event_category}</Badge>
                          <Badge variant={log.success ? "default" : "destructive"}>
                            {log.success ? "Sucesso" : "Falha"}
                          </Badge>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(log.created_at).toLocaleString('pt-BR')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{log.action}</p>
                        <p className="text-sm text-gray-600">{log.description}</p>
                        {log.entity_type && (
                          <p className="text-xs text-gray-500">
                            Entidade: {log.entity_type} {log.entity_id && `(${log.entity_id})`}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Nível de Risco</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {metrics && Object.entries(metrics.riskDistribution).map(([level, count]) => (
                    <div key={level} className="flex items-center justify-between">
                      <Badge className={getRiskBadgeColor(level)}>
                        {level}
                      </Badge>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {metrics && Object.entries(metrics.categoryDistribution).map(([category, count]) => (
                    <div key={category} className="flex items-center justify-between">
                      <Badge variant="outline">{category}</Badge>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sistema de Segurança</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    O sistema de auditoria está monitorando automaticamente todas as atividades 
                    e detectando padrões suspeitos em tempo real.
                  </AlertDescription>
                </Alert>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Eye className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="text-sm text-gray-600">Monitoramento Ativo</p>
                          <p className="text-lg font-bold text-green-600">✓ Ativo</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                        <div>
                          <p className="text-sm text-gray-600">Detecção de Ameaças</p>
                          <p className="text-lg font-bold text-green-600">✓ Ativo</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="text-sm text-gray-600">Alertas em Tempo Real</p>
                          <p className="text-lg font-bold text-green-600">✓ Ativo</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
