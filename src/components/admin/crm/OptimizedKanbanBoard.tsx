
import React, { useMemo } from 'react';
import { DndContext } from '@dnd-kit/core';
import { CRMFilters } from '@/types/crm.types';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';
import { useOptimizedCRMData } from '@/hooks/crm/useOptimizedCRMData';
import { useDragAndDrop } from '@/hooks/crm/useDragAndDrop';
import { useKanbanNavigation } from '@/hooks/crm/useKanbanNavigation';
import { KanbanSkeleton } from './LoadingSkeleton';
import { KanbanDragOverlay } from './kanban/KanbanDragOverlay';
import { KanbanLoadingOverlay } from './kanban/KanbanLoadingOverlay';
import { KanbanEmptyState } from './kanban/KanbanEmptyState';
import { KanbanGrid } from './kanban/KanbanGrid';

interface OptimizedKanbanBoardProps {
  filters: CRMFilters;
  pipelineId: string;
  onCreateLead?: (columnId?: string) => void;
}

const OptimizedKanbanBoard = React.memo(({ filters, pipelineId, onCreateLead }: OptimizedKanbanBoardProps) => {
  const { columns, loading: columnsLoading } = useCRMPipelines();
  const { leadsByColumn, loading: leadsLoading, moveLeadToColumn } = useOptimizedCRMData(filters);
  const { handleOpenDetail } = useKanbanNavigation();

  console.log('🎯 OptimizedKanban Debug - Pipeline ID:', pipelineId);
  console.log('🎯 OptimizedKanban Debug - Todas as colunas:', columns);
  console.log('🎯 OptimizedKanban Debug - Leads by Column:', leadsByColumn);

  // Filtrar colunas do pipeline atual com memoização
  const pipelineColumns = useMemo(() => {
    if (!pipelineId) {
      console.log('🚫 Nenhum pipeline selecionado');
      return [];
    }
    
    const filtered = columns
      .filter(col => col.pipeline_id === pipelineId)
      .sort((a, b) => a.sort_order - b.sort_order);
    
    console.log(`🔍 Colunas filtradas para pipeline ${pipelineId}:`, filtered);
    return filtered;
  }, [columns, pipelineId]);

  const {
    activeLead,
    activeColumnId,
    isDragging,
    isMoving,
    sensors,
    handleDragStart,
    handleDragOver,
    handleDragEnd
  } = useDragAndDrop({ leadsByColumn, moveLeadToColumn });

  const loading = columnsLoading || leadsLoading;

  // Estados vazios
  const emptyStateProps = {
    pipelineId,
    hasColumns: pipelineColumns.length > 0
  };

  if (loading) {
    return <KanbanSkeleton />;
  }

  if (!pipelineId) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Selecione um Pipeline
          </h3>
          <p className="text-gray-500">
            Escolha um pipeline para visualizar os leads
          </p>
        </div>
      </div>
    );
  }

  if (pipelineColumns.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Pipeline sem colunas
          </h3>
          <p className="text-gray-500">
            Este pipeline não possui colunas configuradas. Configure as colunas nas configurações do CRM.
          </p>
        </div>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <KanbanGrid
        pipelineColumns={pipelineColumns}
        leadsByColumn={leadsByColumn}
        activeColumnId={activeColumnId}
        isDragging={isDragging}
        isMoving={isMoving}
        onOpenDetail={(lead) => handleOpenDetail(lead, isDragging, isMoving)}
        onCreateLead={onCreateLead}
      />
      
      <KanbanLoadingOverlay isVisible={isMoving} />
      <KanbanDragOverlay activeLead={activeLead} />
    </DndContext>
  );
});

OptimizedKanbanBoard.displayName = 'OptimizedKanbanBoard';

export default OptimizedKanbanBoard;
