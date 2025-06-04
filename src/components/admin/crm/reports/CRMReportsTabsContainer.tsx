
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  PieChart,
  Users
} from 'lucide-react';
import { PipelineMetrics, ResponsibleMetrics, LeadsByPeriod } from '@/hooks/crm/useCRMReports';
import PipelineReports from './PipelineReports';
import ResponsibleReports from './ResponsibleReports';

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
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="pipeline" className="flex items-center gap-2">
          <PieChart className="h-4 w-4" />
          Pipeline
        </TabsTrigger>
        <TabsTrigger value="performance" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          Performance
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
    </Tabs>
  );
};

export default CRMReportsTabsContainer;
