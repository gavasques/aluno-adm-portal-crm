
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CRMFilters as CRMFiltersType, ViewMode } from '@/types/crm.types';
import CRMKanbanBoard from './CRMKanbanBoard';
import CRMListView from './CRMListView';
import CRMStatsCards from './CRMStatsCards';
import CRMFiltersComponent from './CRMFilters';
import CRMPipelineManager from './CRMPipelineManager';
import { CRMLoadingSkeleton } from './LoadingSkeleton';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List, Plus } from 'lucide-react';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';

interface CRMViewProps {
  onNewLead?: () => void;
  onEditLead?: (lead: any) => void;
}

const CRMView = ({ onNewLead, onEditLead }: CRMViewProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [filters, setFilters] = useState<CRMFiltersType>({});
  const [pipelineId, setPipelineId] = useState<string>('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { pipelines, loading: pipelinesLoading, fetchPipelines } = useCRMPipelines();

  // Set default pipeline if none selected
  React.useEffect(() => {
    console.log('CRMView - pipelines:', pipelines.length, 'pipelineId:', pipelineId);
    
    if (!pipelineId && pipelines.length > 0) {
      const defaultPipeline = pipelines[0];
      console.log('Setting default pipeline:', defaultPipeline.id);
      setPipelineId(defaultPipeline.id);
      setFilters(prev => ({ ...prev, pipeline_id: defaultPipeline.id }));
    }
  }, [pipelineId, pipelines]);

  const handleFiltersChange = (newFilters: CRMFiltersType) => {
    console.log('CRMView - filters changing:', newFilters);
    setFilters(newFilters);
  };

  const handlePipelineChange = (newPipelineId: string) => {
    console.log('CRMView - pipeline changing to:', newPipelineId);
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

  // Guard: Não renderizar se não há pipelines
  if (pipelines.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Nenhum pipeline encontrado.</p>
        <p className="text-sm text-gray-400 mt-2">Configure pipelines para começar a usar o CRM.</p>
        <div className="mt-4">
          <CRMPipelineManager 
            onRefresh={handlePipelineManagerRefresh}
            onPipelineChange={handlePipelineManagerRefresh}
          />
        </div>
      </div>
    );
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
        {pipelineId ? (
          viewMode === 'kanban' ? (
            <CRMKanbanBoard
              filters={filters}
              pipelineId={pipelineId}
            />
          ) : (
            <CRMListView
              filters={filters}
              onEditLead={onEditLead}
            />
          )
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Carregando pipeline...</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CRMView;
