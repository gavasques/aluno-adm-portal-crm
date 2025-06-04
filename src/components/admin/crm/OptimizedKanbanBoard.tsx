
import React, { useCallback, useMemo } from 'react';
import { DndContext, DragOverlay, closestCenter } from '@dnd-kit/core';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';
import { useUnifiedCRMData } from '@/hooks/crm/useUnifiedCRMData';
import { useKanbanNavigation } from '@/hooks/crm/useKanbanNavigation';
import { useSimplifiedDragAndDrop } from '@/hooks/crm/useSimplifiedDragAndDrop';
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

const OptimizedKanbanBoard: React.FC<OptimizedKanbanBoardProps> = React.memo(({
  filters,
  pipelineId,
  onCreateLead
}) => {
  const kanbanBoardId = `kanban_board_${Date.now()}`;
  
  console.group(`🎯 [KANBAN_BOARD_${kanbanBoardId}] RENDERIZAÇÃO`);
  console.log('📋 Props recebidas:', {
    filters,
    pipelineId,
    timestamp: new Date().toISOString()
  });

  const {
    columns,
    loading: columnsLoading
  } = useCRMPipelines();

  const activeColumns = useMemo(() => {
    const filteredColumns = columns.filter(col => 
      col.is_active && col.pipeline_id === pipelineId
    );
    
    console.log('📋 [KANBAN_BOARD] Colunas processadas:', {
      pipelineId,
      totalColumns: columns.length,
      filteredColumns: filteredColumns.length,
      columnDetails: filteredColumns.map(col => ({
        id: col.id,
        name: col.name,
        sort_order: col.sort_order
      }))
    });
    
    return filteredColumns;
  }, [columns, pipelineId]);

  const {
    leadsWithContacts,
    leadsByColumn,
    loading: leadsLoading
  } = useUnifiedCRMData(filters);

  console.log('📊 [KANBAN_BOARD] Dados dos leads:', {
    totalLeads: leadsWithContacts.length,
    leadsByColumnCount: Object.entries(leadsByColumn).map(([columnId, leads]) => ({
      columnId,
      leadsCount: leads.length,
      leadNames: leads.map(l => l.name)
    }))
  });

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
  } = useSimplifiedDragAndDrop({
    onMoveLeadToColumn: moveLeadToColumn
  });

  const loading = columnsLoading || leadsLoading;

  const handleLeadClick = useCallback((lead: any) => {
    console.log('🔗 [KANBAN_BOARD] Click no lead:', {
      leadId: lead.id,
      leadName: lead.name,
      columnId: lead.column_id,
      canInteract: !isMoving && !isDragging && canDrag
    });
    
    if (isMoving || isDragging || !canDrag) {
      console.log('🚫 [KANBAN_BOARD] Click bloqueado durante operação');
      return;
    }
    
    handleOpenDetail(lead, false, false);
  }, [handleOpenDetail, isMoving, isDragging, canDrag]);

  if (loading) {
    console.log('⏳ [KANBAN_BOARD] Estado de carregamento');
    console.groupEnd();
    return <KanbanLoadingOverlay isVisible={true} />;
  }

  if (activeColumns.length === 0) {
    console.log('📋 [KANBAN_BOARD] Nenhuma coluna ativa encontrada');
    console.groupEnd();
    return (
      <KanbanEmptyState 
        pipelineId={pipelineId}
        hasColumns={false}
      />
    );
  }

  console.log('🎮 [KANBAN_BOARD] Estado final do Kanban:', {
    columns: activeColumns.length,
    totalLeads: leadsWithContacts.length,
    draggedLead: draggedLead?.id,
    isMoving,
    isDragging,
    canDrag,
    sensorsConfigured: !!sensors
  });
  console.groupEnd();

  return (
    <div className="h-full w-full flex flex-col p-8">
      <DndContext 
        sensors={sensors}
        onDragStart={handleDragStart} 
        onDragEnd={handleDragEnd}
        collisionDetection={closestCenter}
      >
        <KanbanGrid
          pipelineColumns={activeColumns}
          leadsByColumn={leadsByColumn}
          activeColumnId={draggedLead?.column_id || null}
          isDragging={isDragging}
          isMoving={isMoving}
          onOpenDetail={handleLeadClick}
          onCreateLead={onCreateLead}
          useVirtualization={leadsWithContacts.length > 50}
        />

        <DragOverlay>
          {draggedLead && (
            <div className="rotate-3 scale-105 opacity-90 z-50">
              <DynamicLeadCard 
                lead={draggedLead} 
                isDragging 
                onClick={() => {}}
              />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <KanbanLoadingOverlay isVisible={isMoving} />
      
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

OptimizedKanbanBoard.displayName = 'OptimizedKanbanBoard';

export default OptimizedKanbanBoard;
