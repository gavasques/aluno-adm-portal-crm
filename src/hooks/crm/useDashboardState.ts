
import { useState, useMemo } from 'react';
import { CRMFilters } from '@/types/crm.types';

export const useDashboardState = () => {
  const [activeView, setActiveView] = useState<'kanban' | 'list'>('kanban');
  const [selectedPipelineId, setSelectedPipelineId] = useState<string>('');
  const [filters, setFilters] = useState<CRMFilters>({});
  const [showTagsManager, setShowTagsManager] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedColumnForCreate, setSelectedColumnForCreate] = useState<string>('');

  // Update filters when pipeline changes
  const effectiveFilters = useMemo(() => ({
    ...filters,
    pipeline_id: selectedPipelineId
  }), [filters, selectedPipelineId]);

  return {
    activeView,
    setActiveView,
    selectedPipelineId,
    setSelectedPipelineId,
    filters,
    setFilters,
    effectiveFilters,
    showTagsManager,
    setShowTagsManager,
    showCreateModal,
    setShowCreateModal,
    selectedColumnForCreate,
    setSelectedColumnForCreate
  };
};
