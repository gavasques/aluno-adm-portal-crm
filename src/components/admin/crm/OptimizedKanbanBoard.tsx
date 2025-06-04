
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
  console.log('🎯 [OPTIMIZED_KANBAN] Renderizando com pipeline:', pipelineId);

  const {
    columns,
    loading: columnsLoading
  } = useCRMPipelines();

  // Filtrar colunas do pipeline selecionado
  const activeColumns = useMemo(() => {
    const filteredColumns = columns.filter(col => 
      col.is_active && col.pipeline_id === pipelineId
    );
    
    console.log('📋 [OPTIMIZED_KANBAN] Colunas filtradas:', {
      pipelineId,
      totalColumns: columns.length,
      filteredColumns: filteredColumns.length,
      columnNames: filteredColumns.map(col => col.name)
    });
    
    return filteredColumns;
  }, [columns, pipelineId]);

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
  } = useSimplifiedDragAndDrop({
    onMoveLeadToColumn: moveLeadToColumn
  });

  const loading = columnsLoading || leadsLoading;

  const handleLeadClick = useCallback((lead: any) => {
    // Prevenir clicks durante operações
    if (isMoving || isDragging || !canDrag) {
      console.log('🚫 [OPTIMIZED_KANBAN] Click bloqueado durante operação:', {
        isMoving,
        isDragging,
        canDrag,
        leadId: lead.id
      });
      return;
    }
    
    console.log('🔗 [OPTIMIZED_KANBAN] Abrindo lead:', {
      id: lead.id,
      name: lead.name,
      column: lead.column_id
    });
    handleOpenDetail(lead, false, false);
  }, [handleOpenDetail, isMoving, isDragging, canDrag]);

  // Estados de loading
  if (loading) {
    console.log('⏳ [OPTIMIZED_KANBAN] Carregando dados...');
    return <KanbanLoadingOverlay isVisible={true} />;
  }

  if (activeColumns.length === 0) {
    console.log('📋 [OPTIMIZED_KANBAN] Nenhuma coluna ativa encontrada');
    return (
      <KanbanEmptyState 
        pipelineId={pipelineId}
        hasColumns={false}
      />
    );
  }

  console.log('📊 [OPTIMIZED_KANBAN] Dados do Kanban:', {
    columns: activeColumns.length,
    totalLeads: leadsWithContacts.length,
    leadsByColumn: Object.entries(leadsByColumn).map(([columnId, leads]) => ({
      columnId,
      leadsCount: leads.length,
      leadIds: leads.map(l => l.id)
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

      {/* Overlay de loading para movimentos */}
      <KanbanLoadingOverlay isVisible={isMoving} />
      
      {/* Indicador de movimento */}
      {isMoving && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
          Movendo lead...
        </div>
      )}
    </div>
  );
});

OptimizedKanbanBoard.displayName = 'OptimizedKanbanBoard';

export default OptimizedKanbanBoard;
