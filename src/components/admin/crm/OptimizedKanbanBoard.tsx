
import React, { useCallback } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';
import { useUnifiedCRMData } from '@/hooks/crm/useUnifiedCRMData';
import { useKanbanNavigation } from '@/hooks/crm/useKanbanNavigation';
import { useOptimizedDragAndDrop } from '@/hooks/crm/useOptimizedDragAndDrop';
import { useUnifiedLeadMovement } from '@/hooks/crm/useUnifiedLeadMovement';
import { useIntelligentCache } from '@/hooks/crm/useIntelligentCache';
import { KanbanGrid } from './kanban/KanbanGrid';
import { DynamicLeadCard } from './kanban/DynamicLeadCard';
import { KanbanLoadingOverlay } from './kanban/KanbanLoadingOverlay';
import { KanbanEmptyState } from './kanban/KanbanEmptyState';
import { CRMFilters } from '@/types/crm.types';
import { usePerformanceTracking } from '@/utils/performanceMonitor';

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
  const { startTiming } = usePerformanceTracking('OptimizedKanbanBoard');
  const endTiming = startTiming();

  console.log('🎯 [OPTIMIZED_KANBAN] Renderizando com pipeline:', pipelineId);

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
  const { optimizeCache, getCacheMetrics } = useIntelligentCache();

  const {
    draggedLead,
    isMoving,
    sensors,
    handleDragStart,
    handleDragEnd,
    isDragging,
    canDrag,
    pendingOperations
  } = useOptimizedDragAndDrop({
    onMoveLeadToColumn: moveLeadToColumn
  });

  const activeColumns = columns.filter(col => col.is_active);
  const loading = columnsLoading || leadsLoading;

  // Otimizar cache quando os dados mudarem
  React.useEffect(() => {
    if (leadsWithContacts.length > 0) {
      optimizeCache(leadsWithContacts);
    }
  }, [leadsWithContacts, optimizeCache]);

  // Log de métricas de performance
  React.useEffect(() => {
    if (!loading) {
      const metrics = getCacheMetrics();
      console.log('📊 [PERFORMANCE_METRICS]', {
        totalLeads: leadsWithContacts.length,
        columnsCount: activeColumns.length,
        pendingOperations,
        cache: metrics
      });
    }
  }, [loading, leadsWithContacts.length, activeColumns.length, pendingOperations, getCacheMetrics]);

  const handleLeadClick = useCallback((lead: any) => {
    // Prevenir clicks durante operações
    if (isMoving || isDragging || pendingOperations > 0) {
      console.log('🚫 [OPTIMIZED_KANBAN] Click bloqueado durante operação:', {
        isMoving,
        isDragging,
        pendingOperations,
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
  }, [handleOpenDetail, isMoving, isDragging, pendingOperations]);

  // Finalizar medição de performance
  React.useEffect(() => {
    if (!loading) {
      endTiming();
    }
  }, [loading, endTiming]);

  // Estados de loading otimizados
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

  console.log('📊 [OPTIMIZED_KANBAN] Renderizando com dados otimizados:', {
    columns: activeColumns.length,
    totalLeads: leadsWithContacts.length,
    leadsByColumn: Object.entries(leadsByColumn).map(([columnId, leads]) => ({
      columnId,
      leadsCount: leads.length
    })),
    draggedLead: draggedLead?.id,
    isMoving,
    isDragging,
    canDrag,
    pendingOperations
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
          useVirtualization={leadsWithContacts.length > 50} // Usar virtualização para muitos leads
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

      {/* Overlay de loading para movimentos */}
      <KanbanLoadingOverlay isVisible={isMoving || pendingOperations > 0} />
      
      {/* Indicador de operações pendentes */}
      {pendingOperations > 0 && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
          {pendingOperations} operação(ões) em andamento...
        </div>
      )}
    </div>
  );
});

OptimizedKanbanBoard.displayName = 'OptimizedKanbanBoard';

export default OptimizedKanbanBoard;
