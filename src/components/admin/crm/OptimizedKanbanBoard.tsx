
import React, { useCallback } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
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
  console.log('🎯 [KANBAN] Renderizando com pipeline:', pipelineId);

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
    // Prevenir clicks durante drag ou movimento
    if (isMoving || draggedLead) {
      console.log('🚫 [KANBAN] Click bloqueado durante operação:', {
        isMoving,
        hasDraggedLead: !!draggedLead,
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
  }, [handleOpenDetail, isMoving, draggedLead]);

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
    isMoving
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
          isDragging={!!draggedLead}
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
