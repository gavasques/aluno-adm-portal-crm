
import React, { useCallback } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';
import { useOptimizedCRMData } from '@/hooks/crm/useOptimizedCRMData';
import { useKanbanNavigation } from '@/hooks/crm/useKanbanNavigation';
import { useSimplifiedDragAndDrop } from '@/hooks/crm/useSimplifiedDragAndDrop';
import { useSimplifiedLeadMovement } from '@/hooks/crm/useSimplifiedLeadMovement';
import { KanbanGrid } from './kanban/KanbanGrid';
import { DynamicLeadCard } from './kanban/DynamicLeadCard';
import { KanbanLoadingOverlay } from './kanban/KanbanLoadingOverlay';
import { KanbanEmptyState } from './kanban/KanbanEmptyState';
import { CRMFilters } from '@/types/crm.types';

interface OptimizedKanbanBoardProps {
  filters: CRMFilters;
  pipelineId: string;
  onCreateLead: (columnId?: string) => void;
}

const OptimizedKanbanBoard: React.FC<OptimizedKanbanBoardProps> = ({
  filters,
  pipelineId,
  onCreateLead
}) => {
  const {
    columns,
    loading: columnsLoading
  } = useCRMPipelines();

  const {
    leadsWithContacts,
    leadsByColumn,
    loading: leadsLoading
  } = useOptimizedCRMData(filters);

  const { handleOpenDetail } = useKanbanNavigation();
  
  const { moveLeadToColumn } = useSimplifiedLeadMovement(filters);

  const {
    draggedLead,
    isMoving,
    sensors,
    handleDragStart,
    handleDragEnd
  } = useSimplifiedDragAndDrop({
    onMoveLeadToColumn: moveLeadToColumn
  });

  const activeColumns = columns.filter(col => col.is_active);
  const loading = columnsLoading || leadsLoading;

  const handleLeadClick = useCallback((lead: any) => {
    if (isMoving || draggedLead) return; // Bloquear cliques durante drag
    
    console.log('🔗 OptimizedKanbanBoard: Abrindo lead:', lead.id);
    handleOpenDetail(lead, false, false);
  }, [handleOpenDetail, isMoving, draggedLead]);

  if (loading) {
    return <KanbanLoadingOverlay isVisible={true} />;
  }

  if (activeColumns.length === 0) {
    return (
      <KanbanEmptyState 
        pipelineId={pipelineId}
        hasColumns={false}
      />
    );
  }

  console.log('📊 Renderizando Kanban com', activeColumns.length, 'colunas');

  return (
    <div className="h-full w-full flex flex-col p-8">
      <DndContext 
        sensors={sensors}
        onDragStart={handleDragStart} 
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={activeColumns.map(col => col.id)} 
          strategy={horizontalListSortingStrategy}
        >
          <KanbanGrid
            pipelineColumns={activeColumns}
            leadsByColumn={leadsByColumn}
            activeColumnId={draggedLead?.column_id || null}
            isDragging={!!draggedLead}
            isMoving={isMoving}
            onOpenDetail={handleLeadClick}
            onCreateLead={onCreateLead}
          />
        </SortableContext>

        <DragOverlay>
          {draggedLead && (
            <DynamicLeadCard lead={draggedLead} isDragging />
          )}
        </DragOverlay>
      </DndContext>

      <KanbanLoadingOverlay isVisible={isMoving} />
    </div>
  );
};

export default OptimizedKanbanBoard;
