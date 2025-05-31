
import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DndContext, DragEndEvent, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { CRMFilters, CRMLead } from '@/types/crm.types';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';
import { useCRMData } from '@/hooks/crm/useCRMData';
import OptimizedKanbanLeadCard from './OptimizedKanbanLeadCard';
import { KanbanSkeleton } from './LoadingSkeleton';
import CRMLeadFormDialog from './CRMLeadFormDialog';

interface OptimizedKanbanBoardProps {
  filters: CRMFilters;
  pipelineId: string;
}

const OptimizedKanbanBoard = React.memo(({ filters, pipelineId }: OptimizedKanbanBoardProps) => {
  const navigate = useNavigate();
  const { columns, loading: columnsLoading } = useCRMPipelines();
  const { leadsByColumn, loading: leadsLoading, moveLeadToColumn, refetch } = useCRMData(filters);
  const [activeLead, setActiveLead] = useState<CRMLead | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState<string>('');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  // Filtrar colunas do pipeline atual com memoização
  const pipelineColumns = useMemo(() => {
    return columns
      .filter(col => col.pipeline_id === pipelineId)
      .sort((a, b) => a.sort_order - b.sort_order);
  }, [columns, pipelineId]);

  const handleDragStart = useCallback((event: any) => {
    const leadId = event.active.id;
    // Encontrar o lead nos dados agrupados
    const lead = Object.values(leadsByColumn)
      .flat()
      .find(l => l.id === leadId);
    setActiveLead(lead || null);
  }, [leadsByColumn]);

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveLead(null);

    if (!over) return;

    const leadId = active.id as string;
    const newColumnId = over.id as string;

    // Verificar se o lead foi movido para uma coluna diferente
    const currentLead = Object.values(leadsByColumn)
      .flat()
      .find(l => l.id === leadId);
    
    if (currentLead && currentLead.column_id !== newColumnId) {
      try {
        await moveLeadToColumn(leadId, newColumnId);
      } catch (error) {
        console.error('Error moving lead:', error);
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
  }, [refetch]);

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
        onDragEnd={handleDragEnd}
      >
        <div className="w-full h-full overflow-x-auto overflow-y-hidden pb-4">
          <div className="flex gap-4 min-w-max h-full px-3">
            <SortableContext 
              items={pipelineColumns.map(col => col.id)} 
              strategy={horizontalListSortingStrategy}
            >
              {pipelineColumns.map(column => {
                const columnLeads = leadsByColumn[column.id] || [];
                
                return (
                  <div key={column.id} className="w-80 bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: column.color }}
                        />
                        <h3 className="font-medium text-gray-900">{column.name}</h3>
                        <span className="text-sm text-gray-500">({columnLeads.length})</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
                      {columnLeads.map(lead => (
                        <OptimizedKanbanLeadCard
                          key={lead.id}
                          lead={lead}
                          onOpenDetail={handleOpenDetail}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </SortableContext>
          </div>
        </div>

        <DragOverlay>
          {activeLead ? (
            <OptimizedKanbanLeadCard 
              lead={activeLead} 
              onOpenDetail={handleOpenDetail} 
            />
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
