
import { useEffect } from 'react';
import { useCRMPipelines } from './useCRMPipelines';

export const usePipelineSelection = (
  selectedPipelineId: string,
  setSelectedPipelineId: (id: string) => void
) => {
  const { pipelines, loading: pipelinesLoading, refetch } = useCRMPipelines();

  // Auto-select first pipeline if none selected
  useEffect(() => {
    if (pipelines.length > 0 && !selectedPipelineId) {
      setSelectedPipelineId(pipelines[0].id);
    }
  }, [pipelines, selectedPipelineId, setSelectedPipelineId]);

  return {
    pipelines,
    pipelinesLoading,
    refetch
  };
};
