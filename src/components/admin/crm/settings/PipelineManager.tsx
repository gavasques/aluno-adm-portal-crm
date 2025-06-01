
import React, { useState } from 'react';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';
import PipelinesList from '../pipeline-manager/PipelinesList';
import ColumnsManager from '../pipeline-manager/ColumnsManager';
import { CRMPipeline } from '@/types/crm.types';

export const PipelineManager = () => {
  const [selectedPipeline, setSelectedPipeline] = useState<CRMPipeline | null>(null);
  const { pipelines, loading, fetchPipelines } = useCRMPipelines();

  const handlePipelineSelect = (pipeline: CRMPipeline) => {
    setSelectedPipeline(pipeline);
  };

  const handleBack = () => {
    setSelectedPipeline(null);
  };

  const handleRefresh = () => {
    fetchPipelines();
  };

  if (selectedPipeline) {
    return (
      <ColumnsManager
        pipeline={selectedPipeline}
        onBack={handleBack}
        onRefresh={handleRefresh}
      />
    );
  }

  return (
    <PipelinesList
      pipelines={pipelines}
      loading={loading}
      onPipelineSelect={handlePipelineSelect}
      onRefresh={handleRefresh}
    />
  );
};
