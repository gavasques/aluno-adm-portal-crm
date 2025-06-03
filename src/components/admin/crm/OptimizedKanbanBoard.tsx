
import React, { useCallback } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';
import { useUnifiedCRMData } from '@/hooks/crm/useUnifiedCRMData';
import { useKanbanNavigation } from '@/hooks/crm/useKanbanNavigation';
import { useUnifiedDragAndDrop } from '@/hooks/crm/useUnifiedDragAndDrop';
import { useUnifiedLeadMovement } from '@/hooks/crm/useUnifiedLeadMovement';
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
  console.log('🎯 [KANBAN] Renderizando com pipeline:', pipelineId);

  const {
    columns,
    loading: columnsLoading
  } = useCRMPipelines();

  const {
    leadsWithContacts,
    leadsByColumn,
    loading: leadsLoading
  } = useUnifiedCRMData(filters);

  const { handleOpenDetail } = useKanbanNavigation();
  
  const { moveLeadToColumn } = useUnifiedLeadMovement(filters);

  const {
    draggedLead,
    isMoving,
    sensors,
    handleDragStart,
    handleDragEnd,
    isDragging,
    canDrag
  } = useUnifiedDragAndDrop({
    onMoveLeadToColumn: moveLeadToColumn
  });

  const activeColumns = columns.filter(col => col.is_active);
  const loading = columnsLoading || leadsLoading;

  const handleLeadClick = useCallback((lead: any) => {
    // Prevenir clicks durante drag ou movimento
    if (isMoving || isDragging) {
      console.log('🚫 [KANBAN] Click bloqueado durante operação:', {
        isMoving,
        isDragging,
        leadId: lead.id
      });
      return;
    }
    
    console.log('🔗 [KANBAN] Abrindo lead:', {
      id: lead.id,
      name: lead.name,
      column: lead.column_id
    });
    handleOpenDetail(lead, false, false);
  }, [handleOpenDetail, isMoving, isDragging]);

  // Estados de loading
  if (loading) {
    console.log('⏳ [KANBAN] Carregando dados...');
    return <KanbanLoadingOverlay isVisible={true} />;
  }

  if (activeColumns.length === 0) {
    console.log('📋 [KANBAN] Nenhuma coluna ativa encontrada');
    return (
      <KanbanEmptyState 
        pipelineId={pipelineId}
        hasColumns={false}
      />
    );
  }

  console.log('📊 [KANBAN] Renderizando com dados:', {
    columns: activeColumns.length,
    totalLeads: leadsWithContacts.length,
    leadsByColumn: Object.entries(leadsByColumn).map(([columnId, leads]) => ({
      columnId,
      leadsCount: leads.length
    })),
    draggedLead: draggedLead?.id,
    isMoving,
    isDragging,
    canDrag
  });

  return (
    <div className="h-full w-full flex flex-col p-8">
      <DndContext 
        sensors={sensors}
        onDragStart={handleDragStart} 
        onDragEnd={handleDragEnd}
      >
        <KanbanGrid
          pipelineColumns={activeColumns}
          leadsByColumn={leadsByColumn}
          activeColumnId={draggedLead?.column_id || null}
          isDragging={isDragging}
          isMoving={isMoving}
          onOpenDetail={handleLeadClick}
          onCreateLead={onCreateLead}
        />

        <DragOverlay>
          {draggedLead && (
            <div className="rotate-3 scale-105 opacity-90 z-50">
              <DynamicLeadCard 
                lead={draggedLead} 
                isDragging 
                onClick={() => {}} // Desabilitar click durante drag
              />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* Overlay de loading para movimento */}
      <KanbanLoadingOverlay isVisible={isMoving} />
    </div>
  );
};

export default OptimizedKanbanBoard;
