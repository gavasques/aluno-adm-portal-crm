
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Shield, 
  AlertTriangle,
  Activity,
  BarChart3,
  Download,
  Calendar
} from 'lucide-react';
import { useAuditAnalytics } from '@/hooks/admin/useAuditAnalytics';
import { Skeleton } from '@/components/ui/skeleton';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

export const AdvancedAnalyticsDashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });

  const { analytics, loading, refetch } = useAuditAnalytics(dateRange);

  const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const handleExportReport = () => {
    if (!analytics) return;
    
    const reportData = {
      generated_at: new Date().toISOString(),
      date_range: dateRange,
      summary: analytics.riskAnalysis,
      system_health: analytics.systemHealth,
      trends: analytics.trendsData,
      top_users: analytics.userActivity,
      top_issues: analytics.topIssues
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-report-${dateRange.from}-${dateRange.to}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48 mt-2" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
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
          <h1 className="text-2xl font-bold">Analytics Avançado de Auditoria</h1>
          <p className="text-gray-600">Análise detalhada e insights de segurança</p>
        </div>
        <div className="flex gap-2">
          <div className="flex gap-2">
            <Input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
              className="w-40"
            />
            <Input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
              className="w-40"
            />
          </div>
          <Button onClick={handleExportReport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button onClick={refetch}>
            <Activity className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Eventos</p>
                <p className="text-2xl font-bold">{analytics?.riskAnalysis.total_events || 0}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taxa de Erro</p>
                <p className="text-2xl font-bold">{analytics?.systemHealth.error_rate.toFixed(1)}%</p>
              </div>
              <AlertTriangle className={`h-8 w-8 ${analytics?.systemHealth.error_rate > 5 ? 'text-red-500' : 'text-green-500'}`} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Score de Segurança</p>
                <p className="text-2xl font-bold">{analytics?.systemHealth.security_score}</p>
              </div>
              <Shield className={`h-8 w-8 ${analytics?.systemHealth.security_score > 80 ? 'text-green-500' : 'text-yellow-500'}`} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Alertas Críticos</p>
                <p className="text-2xl font-bold">{analytics?.riskAnalysis.critical_alerts || 0}</p>
              </div>
              <AlertTriangle className={`h-8 w-8 ${analytics?.riskAnalysis.critical_alerts > 0 ? 'text-red-500' : 'text-green-500'}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">Tendências</TabsTrigger>
          <TabsTrigger value="users">Atividade de Usuários</TabsTrigger>
          <TabsTrigger value="risks">Análise de Riscos</TabsTrigger>
          <TabsTrigger value="issues">Principais Problemas</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tendências de Eventos ao Longo do Tempo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics?.trendsData || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="events" stroke="#3b82f6" name="Total de Eventos" />
                    <Line type="monotone" dataKey="high_risk" stroke="#ef4444" name="Alto Risco" />
                    <Line type="monotone" dataKey="failures" stroke="#f59e0b" name="Falhas" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Usuários Mais Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics?.userActivity.map((user, index) => (
                  <div key={user.user_id} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{user.email}</p>
                        <p className="text-sm text-gray-500">
                          Última atividade: {new Date(user.last_activity).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{user.events_count} eventos</p>
                      <Badge variant={user.risk_score > 10 ? "destructive" : user.risk_score > 5 ? "secondary" : "default"}>
                        Risco: {user.risk_score}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risks" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Risco</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={Object.entries(analytics?.riskAnalysis.risk_distribution || {}).map(([key, value]) => ({
                          name: key,
                          value
                        }))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {Object.entries(analytics?.riskAnalysis.risk_distribution || {}).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Saúde do Sistema</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Tempo de Resposta Médio</span>
                    <span className="font-bold">{analytics?.systemHealth.avg_response_time}ms</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Uptime</span>
                    <span className="font-bold text-green-600">{analytics?.systemHealth.uptime_percentage}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Score de Segurança</span>
                    <Badge variant={analytics?.systemHealth.security_score > 80 ? "default" : "destructive"}>
                      {analytics?.systemHealth.security_score}/100
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="issues" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Principais Problemas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics?.topIssues || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="event_type" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
