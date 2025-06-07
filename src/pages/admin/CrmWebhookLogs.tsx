
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const CrmWebhookLogs = () => {
  const logs = [
    {
      id: 1,
      timestamp: "2024-01-20 14:30:25",
      endpoint: "/api/crm/lead-created",
      status: "success",
      responseTime: "145ms",
      payload: "Lead ID: 12345"
    },
    {
      id: 2,
      timestamp: "2024-01-20 14:25:12",
      endpoint: "/api/crm/deal-updated",
      status: "error",
      responseTime: "2.1s",
      payload: "Deal ID: 67890"
    },
    {
      id: 3,
      timestamp: "2024-01-20 14:20:08",
      endpoint: "/api/crm/contact-updated",
      status: "success",
      responseTime: "89ms",
      payload: "Contact ID: 54321"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Logs Webhook CRM</h1>
          <p className="text-muted-foreground">
            Monitore os webhooks e integrações do sistema CRM
          </p>
        </div>
        <Button>
          <RefreshCw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Total Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              Webhooks processados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
              Sucessos
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
              <XCircle className="h-5 w-5 mr-2 text-red-600" />
              Erros
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
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Tempo Médio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156ms</div>
            <p className="text-xs text-muted-foreground">
              Resposta média
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Logs Recentes</CardTitle>
          <CardDescription>
            Últimas atividades dos webhooks CRM
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {logs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {log.status === 'success' ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="font-mono text-sm">{log.timestamp}</span>
                  </div>
                  <div>
                    <p className="font-medium">{log.endpoint}</p>
                    <p className="text-sm text-muted-foreground">{log.payload}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={log.status === 'success' ? 'default' : 'destructive'}>
                    {log.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{log.responseTime}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CrmWebhookLogs;
