
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';
import PipelinesList from './PipelinesList';
import ColumnsManager from './ColumnsManager';
import { CRMPipeline } from '@/types/crm.types';

interface PipelineManagerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PipelineManagerDialog = ({ open, onOpenChange }: PipelineManagerDialogProps) => {
  const [selectedPipeline, setSelectedPipeline] = useState<CRMPipeline | null>(null);
  const [activeTab, setActiveTab] = useState('pipelines');
  const { pipelines, loading, fetchPipelines } = useCRMPipelines();

  const handlePipelineSelect = (pipeline: CRMPipeline) => {
    setSelectedPipeline(pipeline);
    setActiveTab('columns');
  };

  const handleRefresh = () => {
    fetchPipelines();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>Gerenciar Pipelines</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pipelines">Pipelines</TabsTrigger>
            <TabsTrigger value="columns" disabled={!selectedPipeline}>
              Colunas {selectedPipeline && `- ${selectedPipeline.name}`}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pipelines" className="h-full">
            <PipelinesList
              pipelines={pipelines}
              loading={loading}
              onPipelineSelect={handlePipelineSelect}
              onRefresh={handleRefresh}
            />
          </TabsContent>
          
          <TabsContent value="columns" className="h-full">
            {selectedPipeline && (
              <ColumnsManager
                pipeline={selectedPipeline}
                onBack={() => setActiveTab('pipelines')}
                onRefresh={handleRefresh}
              />
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default PipelineManagerDialog;
