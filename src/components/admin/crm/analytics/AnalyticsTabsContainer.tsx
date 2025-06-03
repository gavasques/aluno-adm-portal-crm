
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3 } from 'lucide-react';
import { LeadSourceAnalysis } from './LeadSourceAnalysis';
import { ResponsiblePerformance } from './ResponsiblePerformance';
import { ConversionFunnelReport } from './ConversionFunnelReport';
import { TimeSeriesChart } from './TimeSeriesChart';
import { PipelineDistributionChart } from './PipelineDistributionChart';

interface AnalyticsTabsContainerProps {
  analyticsMetrics?: {
    timeSeriesData?: any[];
    pipelineDistribution?: any[];
    responsiblePerformance?: any[];
  };
  leadSourceAnalysis?: any[];
  conversionFunnel?: any[];
}

export const AnalyticsTabsContainer: React.FC<AnalyticsTabsContainerProps> = ({
  analyticsMetrics,
  leadSourceAnalysis,
  conversionFunnel
}) => {
  return (
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
  );
};
