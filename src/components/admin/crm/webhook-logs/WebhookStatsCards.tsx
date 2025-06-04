
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CheckCircle, 
  XCircle, 
  Globe, 
  TrendingUp,
  Clock,
  Activity
} from 'lucide-react';
import { useCRMWebhookStats } from '@/hooks/crm/useCRMWebhookLogs';

interface WebhookStatsCardsProps {
  pipelineId?: string;
}

export const WebhookStatsCards = ({ pipelineId }: WebhookStatsCardsProps) => {
  const { data: stats, isLoading } = useCRMWebhookStats(pipelineId);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total de Webhooks */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Webhooks</CardTitle>
          <Globe className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">
            Todas as requisições recebidas
          </p>
        </CardContent>
      </Card>

      {/* Sucessos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sucessos</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.successful}</div>
          <p className="text-xs text-muted-foreground">
            Leads criados com sucesso
          </p>
        </CardContent>
      </Card>

      {/* Falhas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Falhas</CardTitle>
          <XCircle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
          <p className="text-xs text-muted-foreground">
            Requisições com erro
          </p>
        </CardContent>
      </Card>

      {/* Taxa de Sucesso */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
          <TrendingUp className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">
            {stats.successRate.toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground">
            Últimas requisições
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
