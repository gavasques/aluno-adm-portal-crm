
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Users, Target, AlertTriangle, Crown } from 'lucide-react';
import { useCRMStatusReports } from '@/hooks/crm/useCRMStatusReports';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const StatusReports: React.FC = () => {
  const [selectedPipeline, setSelectedPipeline] = useState<string>('');
  const [dateRange, setDateRange] = useState<string>('30'); // últimos 30 dias

  const { pipelines } = useCRMPipelines();
  
  const dateFrom = dateRange === 'all' ? undefined : 
    new Date(Date.now() - parseInt(dateRange) * 24 * 60 * 60 * 1000).toISOString();

  const { data: reports, isLoading } = useCRMStatusReports({
    pipeline_id: selectedPipeline || undefined,
    date_from: dateFrom
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!reports) return null;

  const { status_report, responsible_performance, loss_reasons } = reports;

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="flex gap-4">
        <Select value={selectedPipeline} onValueChange={setSelectedPipeline}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Todos os pipelines" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos os pipelines</SelectItem>
            {pipelines.map((pipeline) => (
              <SelectItem key={pipeline.id} value={pipeline.id}>
                {pipeline.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Últimos 7 dias</SelectItem>
            <SelectItem value="30">Últimos 30 dias</SelectItem>
            <SelectItem value="90">Últimos 90 dias</SelectItem>
            <SelectItem value="365">Último ano</SelectItem>
            <SelectItem value="all">Todo o período</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Cards de Status Geral */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Leads</p>
                <p className="text-2xl font-bold">{status_report.total_leads}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Taxa de Conversão</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold">{status_report.conversion_rate.toFixed(1)}%</p>
                  {status_report.conversion_rate > 20 && (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Leads Ganhos</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-green-600">{status_report.ganho}</p>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {((status_report.ganho / status_report.total_leads) * 100).toFixed(1)}%
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Leads Perdidos</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-red-600">{status_report.perdido}</p>
                  <Badge variant="secondary" className="bg-red-100 text-red-800">
                    {status_report.loss_rate.toFixed(1)}%
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Performance por Responsável */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-600" />
              Performance por Responsável
            </CardTitle>
            <CardDescription>
              Ranking de responsáveis por taxa de conversão
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {responsible_performance
                .sort((a, b) => b.conversion_rate - a.conversion_rate)
                .slice(0, 10)
                .map((resp, index) => (
                  <div key={resp.responsible_id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {index < 3 && (
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                            ${index === 0 ? 'bg-yellow-100 text-yellow-800' : 
                              index === 1 ? 'bg-gray-100 text-gray-800' : 
                              'bg-orange-100 text-orange-800'}`}>
                            {index + 1}
                          </div>
                        )}
                        <span className="font-medium">{resp.responsible_name}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {resp.conversion_rate.toFixed(1)}% • {resp.ganho}/{resp.total_leads}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={resp.conversion_rate} className="flex-1" />
                      <span className="text-xs text-gray-500 w-12">
                        {resp.conversion_rate.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                ))}
              
              {responsible_performance.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  Nenhum responsável encontrado para o período selecionado
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Motivos de Perda */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Principais Motivos de Perda
            </CardTitle>
            <CardDescription>
              Análise dos motivos mais comuns de perda de leads
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loss_reasons
                .sort((a, b) => b.count - a.count)
                .slice(0, 8)
                .map((reason) => (
                  <div key={reason.loss_reason_id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{reason.loss_reason_name}</span>
                      <div className="text-sm text-gray-600">
                        {reason.count} • {reason.percentage.toFixed(1)}%
                      </div>
                    </div>
                    <Progress value={reason.percentage} className="h-2" />
                  </div>
                ))}
              
              {loss_reasons.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  Nenhum motivo de perda registrado para o período selecionado
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Distribuição de Status */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição de Status</CardTitle>
          <CardDescription>
            Visão geral da distribuição atual dos leads por status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-blue-600">{status_report.aberto}</div>
              <div className="text-sm text-gray-600">Em Aberto</div>
              <Progress 
                value={(status_report.aberto / status_report.total_leads) * 100} 
                className="h-2" 
              />
            </div>
            
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-green-600">{status_report.ganho}</div>
              <div className="text-sm text-gray-600">Ganhos</div>
              <Progress 
                value={(status_report.ganho / status_report.total_leads) * 100} 
                className="h-2" 
              />
            </div>
            
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold text-red-600">{status_report.perdido}</div>
              <div className="text-sm text-gray-600">Perdidos</div>
              <Progress 
                value={(status_report.perdido / status_report.total_leads) * 100} 
                className="h-2" 
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
