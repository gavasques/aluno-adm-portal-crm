
import React, { useCallback, useMemo } from 'react';
import { DndContext, DragOverlay, closestCenter } from '@dnd-kit/core';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';
import { useFastCRMData } from '@/hooks/crm/useFastCRMData';
import { useKanbanNavigation } from '@/hooks/crm/useKanbanNavigation';
import { useUltraSimplifiedDragAndDrop } from '@/hooks/crm/useUltraSimplifiedDragAndDrop';
import { useUltraSimplifiedLeadMovement } from '@/hooks/crm/useUltraSimplifiedLeadMovement';
import { DynamicLeadCard } from './kanban/DynamicLeadCard';
import { CRMFilters } from '@/types/crm.types';
import { FastKanbanColumn } from './kanban/FastKanbanColumn';

interface FastKanbanBoardProps {
  filters: CRMFilters;
  pipelineId: string;
  onCreateLead: (columnId?: string) => void;
}

const FastKanbanBoard: React.FC<FastKanbanBoardProps> = React.memo(({
  filters,
  pipelineId,
  onCreateLead
}) => {
  const {
    columns,
    loading: columnsLoading,
  } = useCRMPipelines();

  const activeColumns = useMemo(() => {
    return columns.filter(col => 
      col.is_active && col.pipeline_id === pipelineId
    ).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  }, [columns, pipelineId]);

  const {
    leadsWithContacts,
    leadsByColumn,
    loading: leadsLoading
  } = useFastCRMData(filters);

  const { handleOpenDetail } = useKanbanNavigation();
  const { moveLeadToColumn } = useUltraSimplifiedLeadMovement(filters);

  const {
    draggedLead,
    isMoving,
    sensors,
    handleDragStart,
    handleDragEnd,
    isDragging,
    canDrag
  } = useUltraSimplifiedDragAndDrop({
    onMoveLeadToColumn: moveLeadToColumn
  });

  const loading = columnsLoading || leadsLoading;

  const handleLeadClick = useCallback((lead: any) => {
    if (isMoving || isDragging || !canDrag) {
      return;
    }
    handleOpenDetail(lead, false, false);
  }, [handleOpenDetail, isMoving, isDragging, canDrag]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Carregando leads...</p>
        </div>
      </div>
    );
  }

  if (activeColumns.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Nenhuma coluna ativa encontrada</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-hidden">
      <DndContext 
        sensors={sensors}
        onDragStart={handleDragStart} 
        onDragEnd={handleDragEnd}
        collisionDetection={closestCenter}
      >
        <div className="h-full overflow-x-auto">
          <div 
            className="flex gap-4 p-4 h-full"
            style={{ minWidth: `${activeColumns.length * 320}px` }}
          >
            {activeColumns.map((column) => (
              <FastKanbanColumn
                key={column.id}
                column={column}
                leads={leadsByColumn[column.id] || []}
                onLeadClick={handleLeadClick}
                onCreateLead={() => onCreateLead(column.id)}
                isDragging={isDragging}
                isMoving={isMoving}
              />
            ))}
          </div>
        </div>

        <DragOverlay>
          {draggedLead && (
            <div className="opacity-90">
              <DynamicLeadCard 
                lead={draggedLead} 
                isDragging 
                onClick={() => {}}
              />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* Indicador de movimento sem animação */}
      {isMoving && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Movendo lead...
          </div>
        </div>
      )}
    </div>
  );
});

FastKanbanBoard.displayName = 'FastKanbanBoard';

export default FastKanbanBoard;
