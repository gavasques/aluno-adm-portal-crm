
import React, { useState } from 'react';
import { DndContext, DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import { useCRMLeadUpdate } from '@/hooks/crm/useCRMLeadUpdate';
import { CRMLead, CRMFilters as CRMFiltersType, ViewMode } from '@/types/crm.types';
import CRMKanbanBoard from './CRMKanbanBoard';
import CRMListView from './CRMListView';
import CRMStatsCards from './CRMStatsCards';
import CRMFiltersComponent from './CRMFilters';
import CRMPipelineManager from './CRMPipelineManager';
import { CRMLoadingSkeleton } from './LoadingSkeleton';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';

interface CRMViewProps {
  onNewLead?: () => void;
  onEditLead?: (lead: CRMLead) => void;
}

const CRMView = ({ onNewLead, onEditLead }: CRMViewProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [filters, setFilters] = useState<CRMFiltersType>({});
  const [pipelineId, setPipelineId] = useState<string>('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { pipelines, loading: pipelinesLoading, fetchPipelines } = useCRMPipelines();
  const { moveToColumn } = useCRMLeadUpdate();

  // Set default pipeline if none selected
  React.useEffect(() => {
    if (!pipelineId && pipelines.length > 0) {
      setPipelineId(pipelines[0].id);
      setFilters(prev => ({ ...prev, pipeline_id: pipelines[0].id }));
    }
  }, [pipelineId, pipelines]);

  const handleFiltersChange = (newFilters: CRMFiltersType) => {
    setFilters(newFilters);
  };

  const handlePipelineChange = (newPipelineId: string) => {
    setPipelineId(newPipelineId);
    setFilters(prev => ({ ...prev, pipeline_id: newPipelineId }));
  };

  const handlePipelineManagerRefresh = async () => {
    await fetchPipelines();
    setRefreshTrigger(prev => prev + 1);
  };

  if (pipelinesLoading) {
    return <CRMLoadingSkeleton />;
  }

  return (
    <div className="space-y-4">
      {/* Stats Cards */}
      <CRMStatsCards 
        filters={filters}
      />

      {/* Filters and View Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex-1">
          <CRMFiltersComponent
            filters={filters}
            onFiltersChange={handleFiltersChange}
            pipelineId={pipelineId}
            onPipelineChange={handlePipelineChange}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'kanban' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('kanban')}
          >
            <LayoutGrid className="h-4 w-4 mr-2" />
            Kanban
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4 mr-2" />
            Lista
          </Button>
          <CRMPipelineManager 
            onRefresh={handlePipelineManagerRefresh}
            onPipelineChange={handlePipelineManagerRefresh}
          />
          <Button onClick={onNewLead}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Lead
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <motion.div
        key={`${viewMode}-${refreshTrigger}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="min-h-[calc(100vh-300px)]"
      >
        {viewMode === 'kanban' ? (
          <CRMKanbanBoard
            filters={filters}
            pipelineId={pipelineId}
          />
        ) : (
          <CRMListView
            filters={filters}
            onEditLead={onEditLead}
          />
        )}
      </motion.div>
    </div>
  );
};

export default CRMView;
