
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import PipelineManagerDialog from './pipeline-manager/PipelineManagerDialog';
import { CRMPipeline } from '@/types/crm.types';

interface CRMPipelineManagerProps {
  onRefresh?: () => void;
}

const CRMPipelineManager = ({ onRefresh }: CRMPipelineManagerProps) => {
  const [showManager, setShowManager] = useState(false);
  const [selectedPipeline, setSelectedPipeline] = useState<CRMPipeline | null>(null);

  const handleClose = () => {
    setShowManager(false);
    setSelectedPipeline(null);
    onRefresh?.();
  };

  return (
    <>
      <Button variant="outline" onClick={() => setShowManager(true)}>
        <Settings className="h-4 w-4 mr-2" />
        Gerenciar Pipelines
      </Button>

      <PipelineManagerDialog
        pipeline={selectedPipeline}
        open={showManager}
        onOpenChange={handleClose}
      />
    </>
  );
};

export default CRMPipelineManager;
