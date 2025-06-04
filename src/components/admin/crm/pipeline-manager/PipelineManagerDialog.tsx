
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Columns, Activity } from 'lucide-react';
import { CRMPipeline } from '@/types/crm.types';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';
import ColumnManager from '../ColumnManager';
import { PipelineLogsTab } from './PipelineLogsTab';

interface PipelineManagerDialogProps {
  pipeline: CRMPipeline | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PipelineManagerDialog = ({ pipeline, open, onOpenChange }: PipelineManagerDialogProps) => {
  const [activeTab, setActiveTab] = useState('columns');
  const { fetchColumns } = useCRMPipelines();

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleRefresh = () => {
    if (pipeline) {
      fetchColumns(pipeline.id);
    }
  };

  if (!pipeline) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-600" />
            Gerenciar Pipeline: {pipeline.name}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="flex flex-col h-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="columns" className="flex items-center gap-2">
              <Columns className="h-4 w-4" />
              Colunas
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Logs do Webhook
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configurações
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto">
            <TabsContent value="columns" className="mt-4">
              <ColumnManager 
                pipelineId={pipeline.id}
                onRefresh={handleRefresh} 
              />
            </TabsContent>

            <TabsContent value="logs" className="mt-4">
              <PipelineLogsTab pipeline={pipeline} />
            </TabsContent>

            <TabsContent value="settings" className="mt-4">
              <div className="text-center py-8 text-gray-500">
                <Settings className="h-12 w-12 mx-auto mb-4" />
                <p>Configurações avançadas do pipeline</p>
                <p className="text-sm">Em desenvolvimento</p>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default PipelineManagerDialog;
