
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardCheck, Search, Filter, Shield, Activity, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Audit = () => {
  const auditLogs = [
    {
      id: 1,
      timestamp: "2024-01-20 14:30:25",
      user: "admin@example.com",
      action: "USER_CREATED",
      resource: "User ID: 12345",
      ip: "192.168.1.100",
      status: "success"
    },
    {
      id: 2,
      timestamp: "2024-01-20 14:25:12",
      user: "manager@example.com",
      action: "PERMISSION_UPDATED",
      resource: "Permission Group: Mentors",
      ip: "192.168.1.101",
      status: "success"
    },
    {
      id: 3,
      timestamp: "2024-01-20 14:20:08",
      user: "user@example.com",
      action: "LOGIN_FAILED",
      resource: "Authentication",
      ip: "192.168.1.102",
      status: "error"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Auditoria</h1>
          <p className="text-muted-foreground">
            Monitor de atividades e logs de segurança
          </p>
        </div>
        <Button>
          <ClipboardCheck className="h-4 w-4 mr-2" />
          Exportar Logs
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Atividades Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              Ações registradas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-green-600" />
              Logins Válidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">1,189</div>
            <p className="text-xs text-muted-foreground">
              96.4% taxa de sucesso
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-red-600" />
              Tentativas Falhadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">45</div>
            <p className="text-xs text-muted-foreground">
              Requer atenção
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usuários Únicos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">567</div>
            <p className="text-xs text-muted-foreground">
              Atividade hoje
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Logs de Auditoria</CardTitle>
          <CardDescription>
            Histórico completo de atividades do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Buscar nos logs..."
                className="pl-8 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>
          
          <div className="space-y-4">
            {auditLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {log.status === 'success' ? (
                      <Shield className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="font-mono text-sm">{log.timestamp}</span>
                  </div>
                  <div>
                    <p className="font-medium">{log.action}</p>
                    <p className="text-sm text-muted-foreground">{log.user} - {log.resource}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={log.status === 'success' ? 'default' : 'destructive'}>
                    {log.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{log.ip}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Audit;
