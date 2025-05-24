import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, Activity, Users, Database, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AuditLog {
  id: string;
  user_id?: string;
  event_type: string;
  event_category: string;
  action: string;
  description?: string;
  entity_type?: string;
  entity_id?: string;
  risk_level: string;
  success: boolean;
  created_at: string;
  ip_address?: string | null;
  user_agent?: string;
  metadata?: any;
}

interface SecurityAlert {
  id: string;
  alert_type: string;
  severity: string;
  title: string;
  description: string;
  resolved: boolean;
  created_at: string;
  user_id?: string;
}

export const AuditDashboard: React.FC = () => {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    event_category: '',
    risk_level: '',
    user_id: '',
    date_from: '',
    date_to: ''
  });

  // Carregar logs de auditoria
  const loadAuditLogs = async () => {
    try {
      let query = supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      // Aplicar filtros
      if (filters.event_category) {
        query = query.eq('event_category', filters.event_category);
      }
      if (filters.risk_level) {
        query = query.eq('risk_level', filters.risk_level);
      }
      if (filters.user_id) {
        query = query.eq('user_id', filters.user_id);
      }
      if (filters.date_from) {
        query = query.gte('created_at', filters.date_from);
      }
      if (filters.date_to) {
        query = query.lte('created_at', filters.date_to);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      // Converter dados para o tipo correto
      const typedData: AuditLog[] = (data || []).map(log => ({
        ...log,
        ip_address: log.ip_address ? String(log.ip_address) : undefined
      }));
      
      setAuditLogs(typedData);
    } catch (error) {
      console.error('Erro ao carregar logs:', error);
    }
  };

  // Carregar alertas de segurança
  const loadSecurityAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('security_alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      setSecurityAlerts(data || []);
    } catch (error) {
      console.error('Erro ao carregar alertas:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([loadAuditLogs(), loadSecurityAlerts()]);
      setLoading(false);
    };
    
    loadData();
  }, [filters]);

  // Estatísticas dos logs
  const stats = {
    totalLogs: auditLogs.length,
    highRiskEvents: auditLogs.filter(log => log.risk_level === 'high' || log.risk_level === 'critical').length,
    failedEvents: auditLogs.filter(log => !log.success).length,
    uniqueUsers: new Set(auditLogs.map(log => log.user_id).filter(Boolean)).size,
    unresolvedAlerts: securityAlerts.filter(alert => !alert.resolved).length
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      default: return 'bg-green-500 text-white';
    }
  };

  const getSeverityBadgeColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      default: return 'bg-blue-500 text-white';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard de Auditoria</h1>
        <Button onClick={() => window.location.reload()}>
          <Activity className="h-4 w-4 mr-2" />
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
                <p className="text-2xl font-bold">{stats.totalLogs}</p>
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
                <p className="text-2xl font-bold">{stats.highRiskEvents}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">Eventos Falharam</p>
                <p className="text-2xl font-bold">{stats.failedEvents}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Usuários Únicos</p>
                <p className="text-2xl font-bold">{stats.uniqueUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Alertas Pendentes</p>
                <p className="text-2xl font-bold">{stats.unresolvedAlerts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas não resolvidos */}
      {stats.unresolvedAlerts > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Existem {stats.unresolvedAlerts} alertas de segurança não resolvidos que requerem atenção.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="logs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="logs">Logs de Auditoria</TabsTrigger>
          <TabsTrigger value="alerts">Alertas de Segurança</TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="space-y-4">
          {/* Filtros */}
          <Card>
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Select
                  value={filters.event_category}
                  onValueChange={(value) => setFilters({...filters, event_category: value})}
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
                  value={filters.risk_level}
                  onValueChange={(value) => setFilters({...filters, risk_level: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Nível de Risco" />
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
                  value={filters.date_from}
                  onChange={(e) => setFilters({...filters, date_from: e.target.value})}
                />

                <Input
                  placeholder="Data fim"
                  type="date"
                  value={filters.date_to}
                  onChange={(e) => setFilters({...filters, date_to: e.target.value})}
                />

                <Button onClick={() => setFilters({event_category: '', risk_level: '', user_id: '', date_from: '', date_to: ''})}>
                  Limpar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Logs */}
          <Card>
            <CardHeader>
              <CardTitle>Logs de Auditoria ({auditLogs.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {auditLogs.map((log) => (
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
                          Entidade: {log.entity_type} ({log.entity_id})
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alertas de Segurança ({securityAlerts.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {securityAlerts.map((alert) => (
                  <div key={alert.id} className="border rounded p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge className={getSeverityBadgeColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                        <Badge variant={alert.resolved ? "default" : "destructive"}>
                          {alert.resolved ? "Resolvido" : "Pendente"}
                        </Badge>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(alert.created_at).toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{alert.title}</p>
                      <p className="text-sm text-gray-600">{alert.description}</p>
                    </div>
                    {!alert.resolved && (
                      <Button size="sm" variant="outline">
                        Marcar como Resolvido
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
