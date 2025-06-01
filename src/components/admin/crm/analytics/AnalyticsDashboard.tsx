
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Target, 
  Clock,
  BarChart3,
  PieChart,
  Download,
  Filter
} from 'lucide-react';
import { useCRMAnalytics } from '@/hooks/crm/useCRMAnalytics';
import { LeadSourceAnalysis } from './LeadSourceAnalysis';
import { ResponsiblePerformance } from './ResponsiblePerformance';
import { ConversionFunnelReport } from './ConversionFunnelReport';
import { TimeSeriesChart } from './TimeSeriesChart';
import { PipelineDistributionChart } from './PipelineDistributionChart';

interface AnalyticsDashboardProps {
  dateRange: { from: Date; to: Date };
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ dateRange }) => {
  const { analyticsMetrics, leadSourceAnalysis, conversionFunnel, isLoading } = useCRMAnalytics(dateRange);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const overviewCards = [
    {
      title: 'Total de Leads',
      value: analyticsMetrics?.totalLeads || 0,
      subtitle: `${analyticsMetrics?.leadsThisWeek || 0} esta semana`,
      icon: Users,
      color: 'blue',
      trend: '+12%'
    },
    {
      title: 'Taxa de Conversão',
      value: `${analyticsMetrics?.conversionRate || 0}%`,
      subtitle: 'Média do período',
      icon: Target,
      color: 'green',
      trend: '+3.2%'
    },
    {
      title: 'Tempo Médio',
      value: `${analyticsMetrics?.averageTimeInPipeline || 0} dias`,
      subtitle: 'No pipeline',
      icon: Clock,
      color: 'orange',
      trend: '-2 dias'
    },
    {
      title: 'Performance',
      value: '85%',
      subtitle: 'Meta atingida',
      icon: TrendingUp,
      color: 'purple',
      trend: '+5%'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Avançado</h2>
          <p className="text-gray-600">Análises detalhadas e insights de performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewCards.map((card, index) => {
          const Icon = card.icon;
          const isPositive = card.trend.startsWith('+');
          const TrendIcon = isPositive ? TrendingUp : TrendingDown;
          
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-full bg-${card.color}-100`}>
                  <Icon className={`h-4 w-4 text-${card.color}-600`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {card.value}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    {card.subtitle}
                  </p>
                  <div className={`flex items-center text-xs ${
                    isPositive ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <TrendIcon className="h-3 w-3 mr-1" />
                    {card.trend}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="sources">Fontes</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="funnel">Funil</TabsTrigger>
          <TabsTrigger value="trends">Tendências</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TimeSeriesChart data={analyticsMetrics?.timeSeriesData || []} />
            <PipelineDistributionChart data={analyticsMetrics?.pipelineDistribution || []} />
          </div>
        </TabsContent>

        <TabsContent value="sources" className="space-y-6">
          <LeadSourceAnalysis data={leadSourceAnalysis || []} />
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <ResponsiblePerformance data={analyticsMetrics?.responsiblePerformance || []} />
        </TabsContent>

        <TabsContent value="funnel" className="space-y-6">
          <ConversionFunnelReport data={conversionFunnel || []} />
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Análise de Tendências</CardTitle>
              <CardDescription>
                Identificação de padrões e previsões baseadas em dados históricos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Análise Preditiva
                </h3>
                <p className="text-gray-500 mb-4">
                  Machine learning e previsões avançadas em desenvolvimento
                </p>
                <Badge variant="outline">Em breve</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
