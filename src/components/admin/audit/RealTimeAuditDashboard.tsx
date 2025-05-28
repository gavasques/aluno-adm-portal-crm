
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, Activity, Users, Database, Eye, RefreshCw } from 'lucide-react';
import { useAuditLogs, AuditFilters } from '@/hooks/admin/useAuditLogs';
import { useAuditMetrics } from '@/hooks/admin/useAuditMetrics';
import { Skeleton } from '@/components/ui/skeleton';

export const RealTimeAuditDashboard: React.FC = () => {
  const [filters, setFilters] = useState<AuditFilters>({});
  const { logs, loading: logsLoading, refetch: refetchLogs } = useAuditLogs(filters);
  const { metrics, loading: metricsLoading, refetch: refetchMetrics } = useAuditMetrics();

  const handleRefresh = () => {
    refetchLogs();
    refetchMetrics();
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
        <Button onClick={handleRefresh} disabled={logsLoading || metricsLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${(logsLoading || metricsLoading) ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

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

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Usuários Únicos</p>
                <p className="text-2xl font-bold">{metrics?.uniqueUsers || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas */}
      {metrics && metrics.unresolvedAlerts > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Existem {metrics.unresolvedAlerts} alertas de segurança não resolvidos que requerem atenção.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="logs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="logs">Logs de Auditoria</TabsTrigger>
          <TabsTrigger value="metrics">Métricas</TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="space-y-4">
          {/* Filtros */}
          <Card>
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <Select
                  value={filters.event_category || ''}
                  onValueChange={(value) => setFilters({...filters, event_category: value || undefined})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas</SelectItem>
                    <SelectItem value="authentication">Autenticação</SelectItem>
                    <SelectItem value="data_management">Gestão de Dados</SelectItem>
                    <SelectItem value="user_activity">Atividade do Usuário</SelectItem>
                    <SelectItem value="security">Segurança</SelectItem>
                    <SelectItem value="system">Sistema</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.risk_level || ''}
                  onValueChange={(value) => setFilters({...filters, risk_level: value || undefined})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Risco" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="low">Baixo</SelectItem>
                    <SelectItem value="medium">Médio</SelectItem>
                    <SelectItem value="high">Alto</SelectItem>
                    <SelectItem value="critical">Crítico</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  placeholder="Data início"
                  type="date"
                  value={filters.date_from || ''}
                  onChange={(e) => setFilters({...filters, date_from: e.target.value || undefined})}
                />

                <Input
                  placeholder="Data fim"
                  type="date"
                  value={filters.date_to || ''}
                  onChange={(e) => setFilters({...filters, date_to: e.target.value || undefined})}
                />

                <Input
                  placeholder="Buscar..."
                  value={filters.search || ''}
                  onChange={(e) => setFilters({...filters, search: e.target.value || undefined})}
                />

                <Button 
                  variant="outline"
                  onClick={() => setFilters({})}
                >
                  Limpar
                </Button>
              </div>
            </CardContent>
          </Card>

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
      </Tabs>
    </div>
  );
};
