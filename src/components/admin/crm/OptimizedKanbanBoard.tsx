
import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, TouchSensor, useSensor, useSensors, DragOverEvent } from '@dnd-kit/core';
import { CRMFilters, CRMLead } from '@/types/crm.types';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';
import { useCRMDataOptimized } from '@/hooks/crm/useCRMDataOptimized';
import KanbanColumn from './KanbanColumn';
import OptimizedKanbanLeadCard from './OptimizedKanbanLeadCard';
import { KanbanSkeleton } from './LoadingSkeleton';
import CRMLeadFormDialog from './CRMLeadFormDialog';
import { cn } from '@/lib/utils';
import { useToastManager } from '@/hooks/useToastManager';

interface OptimizedKanbanBoardProps {
  filters: CRMFilters;
  pipelineId: string;
}

const OptimizedKanbanBoard = React.memo(({ filters, pipelineId }: OptimizedKanbanBoardProps) => {
  const navigate = useNavigate();
  const toast = useToastManager();
  const { columns, loading: columnsLoading } = useCRMPipelines();
  const { leadsByColumn, loading: leadsLoading, moveLeadToColumn, refetch } = useCRMDataOptimized(filters);
  const [activeLead, setActiveLead] = useState<CRMLead | null>(null);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState<string>('');

  // Configurar sensores mais responsivos para drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    })
  );

  // Filtrar colunas do pipeline atual com memoização
  const pipelineColumns = useMemo(() => {
    return columns
      .filter(col => col.pipeline_id === pipelineId)
      .sort((a, b) => a.sort_order - b.sort_order);
  }, [columns, pipelineId]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const leadId = event.active.id as string;
    
    const lead = Object.values(leadsByColumn)
      .flat()
      .find(l => l.id === leadId);
    
    setActiveLead(lead || null);
    
    const currentColumnId = Object.keys(leadsByColumn).find(columnId => 
      leadsByColumn[columnId].some(l => l.id === leadId)
    );
    setActiveColumnId(currentColumnId || null);
  }, [leadsByColumn]);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { over } = event;
    if (over) {
      setActiveColumnId(over.id as string);
    }
  }, []);

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveLead(null);
    setActiveColumnId(null);

    if (!over) return;

    const leadId = active.id as string;
    const newColumnId = over.id as string;

    const currentLead = Object.values(leadsByColumn)
      .flat()
      .find(l => l.id === leadId);
    
    if (currentLead && currentLead.column_id !== newColumnId) {
      try {
        console.log(`🔄 Moving lead ${leadId} to column ${newColumnId}`);
        await moveLeadToColumn(leadId, newColumnId);
      } catch (error) {
        console.error('❌ Error moving lead:', error);
      }
    }
  }, [leadsByColumn, moveLeadToColumn]);

  const handleOpenDetail = useCallback((lead: CRMLead) => {
    navigate(`/admin/crm/lead/${lead.id}`);
  }, [navigate]);

  const handleCreateSuccess = useCallback(() => {
    setShowCreateModal(false);
    setSelectedColumnId('');
    refetch();
    toast.success('Lead criado com sucesso');
  }, [refetch, toast]);

  const loading = columnsLoading || leadsLoading;

  if (!pipelineId) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Selecione um pipeline para visualizar os leads.</p>
      </div>
    );
  }

  if (loading) {
    return <KanbanSkeleton />;
  }

  if (pipelineColumns.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Nenhuma coluna encontrada para este pipeline.</p>
        <p className="text-sm text-gray-400 mt-2">Configure as colunas nas configurações do pipeline.</p>
      </div>
    );
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="w-full h-full overflow-x-auto overflow-y-hidden pb-4">
          <div className={cn(
            "flex gap-4 min-w-max h-full px-3 transition-all duration-300",
            activeLead && "pointer-events-none"
          )}>
            {pipelineColumns.map(column => {
              const columnLeads = leadsByColumn[column.id] || [];
              const isDragOver = activeColumnId === column.id;
              
              return (
                <KanbanColumn
                  key={column.id}
                  column={column}
                  leads={columnLeads}
                  onOpenDetail={handleOpenDetail}
                  isDragOver={isDragOver}
                />
              );
            })}
          </div>
        </div>

        <DragOverlay>
          {activeLead ? (
            <div className="transform rotate-6 scale-110 transition-transform duration-200">
              <OptimizedKanbanLeadCard 
                lead={activeLead} 
                onOpenDetail={handleOpenDetail} 
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <CRMLeadFormDialog
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        pipelineId={pipelineId}
        initialColumnId={selectedColumnId}
        mode="create"
        onSuccess={handleCreateSuccess}
      />
    </>
  );
});

OptimizedKanbanBoard.displayName = 'OptimizedKanbanBoard';

export default OptimizedKanbanBoard;
