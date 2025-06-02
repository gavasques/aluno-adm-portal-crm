
import React, { useState, useEffect, useCallback } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';
import { useOptimizedCRMData } from '@/hooks/crm/useOptimizedCRMData';
import { useKanbanNavigation } from '@/hooks/crm/useKanbanNavigation';
import { KanbanGrid } from './kanban/KanbanGrid';
import { DynamicLeadCard } from './kanban/DynamicLeadCard';
import { KanbanLoadingOverlay } from './kanban/KanbanLoadingOverlay';
import { KanbanEmptyState } from './kanban/KanbanEmptyState';
import { CRMFilters, LeadWithContacts } from '@/types/crm.types';
import { toast } from 'sonner';

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
  const [draggedLead, setDraggedLead] = useState<LeadWithContacts | null>(null);
  const [isProcessingDrop, setIsProcessingDrop] = useState(false);

  const {
    columns,
    loading: columnsLoading
  } = useCRMPipelines();

  const {
    leadsWithContacts,
    leadsByColumn,
    loading: leadsLoading,
    moveLeadToColumn
  } = useOptimizedCRMData(filters);

  const { handleOpenDetail } = useKanbanNavigation();

  const activeColumns = columns.filter(col => col.is_active);
  const loading = columnsLoading || leadsLoading;

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const leadId = active.id as string;
    const lead = leadsWithContacts.find(l => l.id === leadId);
    setDraggedLead(lead || null);
  }, [leadsWithContacts]);

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;
    
    setDraggedLead(null);
    
    if (!over || active.id === over.id) return;
    
    const leadId = active.id as string;
    const newColumnId = over.id as string;
    
    const lead = leadsWithContacts.find(l => l.id === leadId);
    if (!lead) return;
    
    if (lead.column_id === newColumnId) return;
    
    setIsProcessingDrop(true);
    
    try {
      await moveLeadToColumn(leadId, newColumnId);
      
      const targetColumn = activeColumns.find(col => col.id === newColumnId);
      toast.success(`Lead movido para "${targetColumn?.name}"`);
    } catch (error) {
      console.error('Erro ao mover lead:', error);
      toast.error('Erro ao mover lead');
    } finally {
      setIsProcessingDrop(false);
    }
  }, [leadsWithContacts, activeColumns, moveLeadToColumn]);

  const handleLeadClick = useCallback((lead: LeadWithContacts) => {
    console.log('🔗 OptimizedKanbanBoard: Abrindo lead:', lead.id);
    handleOpenDetail(lead, !!draggedLead, isProcessingDrop);
  }, [handleOpenDetail, draggedLead, isProcessingDrop]);

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

  return (
    <div className="h-full flex flex-col">
      <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <SortableContext items={activeColumns.map(col => col.id)} strategy={horizontalListSortingStrategy}>
          <KanbanGrid
            pipelineColumns={activeColumns}
            leadsByColumn={leadsByColumn}
            activeColumnId={draggedLead?.column_id || null}
            isDragging={!!draggedLead}
            isMoving={isProcessingDrop}
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

      {isProcessingDrop && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 shadow-lg flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm font-medium">Movendo lead...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizedKanbanBoard;
