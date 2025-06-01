
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
  console.log('🎯 OptimizedKanban Debug - Columns:', columns);
  console.log('🎯 OptimizedKanban Debug - Leads by Column:', leadsByColumn);

  // Filtrar colunas do pipeline atual com memoização
  const pipelineColumns = useMemo(() => {
    const filtered = columns
      .filter(col => col.pipeline_id === pipelineId)
      .sort((a, b) => a.sort_order - b.sort_order);
    
    console.log('🔍 Filtered columns for pipeline:', pipelineId, filtered);
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

  if (!pipelineId || pipelineColumns.length === 0) {
    return <KanbanEmptyState {...emptyStateProps} />;
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
