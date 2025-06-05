
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WebhookLogsList } from '@/components/admin/crm/webhook-logs/WebhookLogsList';
import { WebhookStatsCards } from '@/components/admin/crm/webhook-logs/WebhookStatsCards';
import { WebhookTestButton } from '@/components/admin/crm/webhook-logs/WebhookTestButton';
import { WebhookUrlsCard } from '@/components/admin/crm/webhook-logs/WebhookUrlsCard';
import { WebhookFieldMappingsCard } from '@/components/admin/crm/webhook-logs/WebhookFieldMappingsCard';
import { WebhookTokensManager } from '@/components/admin/crm/webhook-logs/WebhookTokensManager';
import { Activity, BarChart3, Settings, Key, Globe } from 'lucide-react';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';

const CRMWebhookLogs = () => {
  const { pipelines } = useCRMPipelines();
  const [selectedPipelineId, setSelectedPipelineId] = useState<string>('');

  // Usar o primeiro pipeline como padrão se disponível
  React.useEffect(() => {
    if (pipelines.length > 0 && !selectedPipelineId) {
      setSelectedPipelineId(pipelines[0].id);
    }
  }, [pipelines, selectedPipelineId]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Logs do Webhook CRM</h1>
          <p className="text-muted-foreground">
            Monitore todas as requisições de webhook e gerencie tokens de segurança
          </p>
        </div>
        
        <WebhookTestButton />
      </div>

      {/* Pipeline Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuração do Pipeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-md">
            <label htmlFor="pipeline-select" className="block text-sm font-medium mb-2">
              Selecione o Pipeline
            </label>
            <Select value={selectedPipelineId} onValueChange={setSelectedPipelineId}>
              <SelectTrigger>
                <SelectValue placeholder="Escolha um pipeline..." />
              </SelectTrigger>
              <SelectContent>
                {pipelines.map((pipeline) => (
                  <SelectItem key={pipeline.id} value={pipeline.id}>
                    {pipeline.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {pipelines.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">
                Nenhum pipeline encontrado. Crie um pipeline primeiro.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedPipelineId && (
        <>
          {/* Estatísticas */}
          <WebhookStatsCards />

          {/* Conteúdo Principal */}
          <Tabs defaultValue="configuration" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="configuration" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Configuração
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                Tokens de Segurança
              </TabsTrigger>
              <TabsTrigger value="logs" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Logs Recentes
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="configuration" className="space-y-4">
              {/* URLs e Configurações dos Webhooks */}
              <div className="grid grid-cols-1 gap-6">
                <WebhookUrlsCard />
              </div>

              {/* Mapeamento de Campos */}
              <div className="grid grid-cols-1 gap-6">
                <WebhookFieldMappingsCard pipelineId={selectedPipelineId} />
              </div>
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <WebhookTokensManager pipelineId={selectedPipelineId} />
            </TabsContent>

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
        </>
      )}
    </div>
  );
};

export default CRMWebhookLogs;
