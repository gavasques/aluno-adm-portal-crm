
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3 } from 'lucide-react';
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
  conversionFunnel?: any[];
}

export const AnalyticsTabsContainer: React.FC<AnalyticsTabsContainerProps> = ({
  analyticsMetrics,
  conversionFunnel
}) => {
  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overview">Visão Geral</TabsTrigger>
        <TabsTrigger value="performance">Performance</TabsTrigger>
        <TabsTrigger value="funnel">Funil</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TimeSeriesChart data={analyticsMetrics?.timeSeriesData || []} />
          <PipelineDistributionChart data={analyticsMetrics?.pipelineDistribution || []} />
        </div>
      </TabsContent>

      <TabsContent value="performance" className="space-y-6">
        <ResponsiblePerformance data={analyticsMetrics?.responsiblePerformance || []} />
      </TabsContent>

      <TabsContent value="funnel" className="space-y-6">
        <ConversionFunnelReport data={conversionFunnel || []} />
      </TabsContent>
    </Tabs>
  );
};
