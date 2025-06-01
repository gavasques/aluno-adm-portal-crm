
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  PieChart,
  RefreshCw
} from 'lucide-react';
import { PipelineMetrics, ResponsibleMetrics, LeadsByPeriod } from '@/hooks/crm/useCRMReports';
import PipelineReports from './PipelineReports';
import ResponsibleReports from './ResponsibleReports';
import TrendReports from './TrendReports';

interface CRMReportsTabsContainerProps {
  pipelineMetrics?: PipelineMetrics[];
  responsibleMetrics?: ResponsibleMetrics[];
  periodData?: LeadsByPeriod[];
  loading: boolean;
}

const CRMReportsTabsContainer: React.FC<CRMReportsTabsContainerProps> = ({
  pipelineMetrics,
  responsibleMetrics,
  periodData,
  loading
}) => {
  return (
    <Tabs defaultValue="pipeline" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="pipeline" className="flex items-center gap-2">
          <PieChart className="h-4 w-4" />
          Pipeline
        </TabsTrigger>
        <TabsTrigger value="performance" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Performance
        </TabsTrigger>
        <TabsTrigger value="trends" className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Tendências
        </TabsTrigger>
        <TabsTrigger value="analytics" className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Analytics
        </TabsTrigger>
      </TabsList>

      <TabsContent value="pipeline">
        <PipelineReports 
          pipelineMetrics={pipelineMetrics} 
          loading={loading} 
        />
      </TabsContent>

      <TabsContent value="performance">
        <ResponsibleReports 
          responsibleMetrics={responsibleMetrics} 
          loading={loading} 
        />
      </TabsContent>

      <TabsContent value="trends">
        <TrendReports 
          periodData={periodData} 
          loading={loading} 
        />
      </TabsContent>

      <TabsContent value="analytics">
        <Card>
          <CardHeader>
            <CardTitle>Analytics Avançado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Analytics Avançado
              </h3>
              <p className="text-gray-500 mb-4">
                Análises detalhadas de comportamento e previsões de vendas
              </p>
              <Button variant="outline" disabled>
                <RefreshCw className="h-4 w-4 mr-2" />
                Em desenvolvimento
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default CRMReportsTabsContainer;
