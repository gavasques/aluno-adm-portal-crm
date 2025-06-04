
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WebhookLogsList } from '@/components/admin/crm/webhook-logs/WebhookLogsList';
import { WebhookStatsCards } from '@/components/admin/crm/webhook-logs/WebhookStatsCards';
import { WebhookTestButton } from '@/components/admin/crm/webhook-logs/WebhookTestButton';
import { WebhookUrlsCard } from '@/components/admin/crm/webhook-logs/WebhookUrlsCard';
import { Activity, BarChart3, TestTube, Globe } from 'lucide-react';

const CRMWebhookLogs = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Logs do Webhook CRM</h1>
          <p className="text-muted-foreground">
            Monitore todas as requisições de webhook recebidas pelos pipelines
          </p>
        </div>
        
        <WebhookTestButton />
      </div>

      {/* URLs dos Webhooks */}
      <WebhookUrlsCard />

      {/* Estatísticas */}
      <WebhookStatsCards />

      {/* Conteúdo Principal */}
      <Tabs defaultValue="logs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Logs Recentes
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="space-y-4">
          <WebhookLogsList />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Analytics Avançado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                <p>Analytics avançado será implementado em breve</p>
                <p className="text-sm">Gráficos de tendência, origem de IPs, e muito mais</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CRMWebhookLogs;
