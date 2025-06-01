
import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, TouchSensor, useSensor, useSensors, DragOverEvent } from '@dnd-kit/core';
import { CRMFilters, CRMLead } from '@/types/crm.types';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';
import { useOptimizedCRMData } from '@/hooks/crm/useOptimizedCRMData';
import KanbanColumn from './KanbanColumn';
import OptimizedKanbanLeadCard from './OptimizedKanbanLeadCard';
import { KanbanSkeleton } from './LoadingSkeleton';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface OptimizedKanbanBoardProps {
  filters: CRMFilters;
  pipelineId: string;
  onCreateLead?: (columnId?: string) => void;
}

const OptimizedKanbanBoard = React.memo(({ filters, pipelineId, onCreateLead }: OptimizedKanbanBoardProps) => {
  const navigate = useNavigate();
  const { columns, loading: columnsLoading } = useCRMPipelines();
  const { leadsByColumn, loading: leadsLoading, moveLeadToColumn } = useOptimizedCRMData(filters);
  const [activeLead, setActiveLead] = useState<CRMLead | null>(null);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isMoving, setIsMoving] = useState(false);

  console.log('🎯 OptimizedKanban Debug - Pipeline ID:', pipelineId);
  console.log('🎯 OptimizedKanban Debug - Columns:', columns);
  console.log('🎯 OptimizedKanban Debug - Leads by Column:', leadsByColumn);

  // Configurar sensores mais responsivos para drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
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
    const filtered = columns
      .filter(col => col.pipeline_id === pipelineId)
      .sort((a, b) => a.sort_order - b.sort_order);
    
    console.log('🔍 Filtered columns for pipeline:', pipelineId, filtered);
    return filtered;
  }, [columns, pipelineId]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    if (isMoving) return; // Prevenir múltiplos drags simultâneos
    
    const leadId = event.active.id as string;
    
    const lead = Object.values(leadsByColumn)
      .flat()
      .find(l => l.id === leadId);
    
    setActiveLead(lead || null);
    setIsDragging(true);
    
    const currentColumnId = Object.keys(leadsByColumn).find(columnId => 
      leadsByColumn[columnId].some(l => l.id === leadId)
    );
    setActiveColumnId(currentColumnId || null);
    
    console.log('🔄 Drag started for lead:', leadId, 'in column:', currentColumnId);
  }, [leadsByColumn, isMoving]);

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
    setIsDragging(false);

    if (!over || isMoving) {
      console.log('❌ Drag cancelled - no drop target or already moving');
      return;
    }

    const leadId = active.id as string;
    const newColumnId = over.id as string;

    const currentLead = Object.values(leadsByColumn)
      .flat()
      .find(l => l.id === leadId);
    
    if (!currentLead) {
      console.error('❌ Lead not found:', leadId);
      toast.error('Erro: Lead não encontrado');
      return;
    }

    if (currentLead.column_id === newColumnId) {
      console.log('🔄 Same column, no action needed');
      return;
    }

    console.log(`🔄 Moving lead ${leadId} from ${currentLead.column_id} to ${newColumnId}`);
    
    setIsMoving(true);

    try {
      await moveLeadToColumn(leadId, newColumnId);
      console.log('✅ Lead moved successfully');
      toast.success('Lead movido com sucesso');
      
    } catch (error) {
      console.error('❌ Error moving lead:', error);
      toast.error('Erro ao mover lead. Operação revertida.');
      
    } finally {
      setIsMoving(false);
    }
  }, [leadsByColumn, moveLeadToColumn, isMoving]);

  const handleOpenDetail = useCallback((lead: CRMLead) => {
    if (isDragging || isMoving) return; // Evitar navegação durante drag/move
    console.log('🔗 Navigating to modern lead detail page:', lead.id);
    navigate(`/admin/lead/${lead.id}`);
  }, [navigate, isDragging, isMoving]);

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
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="w-full h-full overflow-x-auto overflow-y-hidden pb-4">
        <div className={cn(
          "flex gap-4 min-w-max h-full px-3 transition-all duration-300",
          (isDragging || isMoving) && "pointer-events-none select-none"
        )}>
          {pipelineColumns.map(column => {
            const columnLeads = leadsByColumn[column.id] || [];
            const isDragOver = activeColumnId === column.id;
            
            console.log(`📋 Column ${column.name} has ${columnLeads.length} leads:`, columnLeads);
            
            return (
              <KanbanColumn
                key={column.id}
                column={column}
                leads={columnLeads}
                onOpenDetail={handleOpenDetail}
                onCreateLead={onCreateLead}
                isDragOver={isDragOver}
              />
            );
          })}
        </div>
        
        {/* Loading overlay durante movimento */}
        {isMoving && (
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-4 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-medium">Movendo lead...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <DragOverlay>
        {activeLead ? (
          <div className="transform rotate-6 scale-110 transition-transform duration-200 opacity-90">
            <OptimizedKanbanLeadCard 
              lead={activeLead} 
              onOpenDetail={() => {}} // Desabilitar durante drag
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
});

OptimizedKanbanBoard.displayName = 'OptimizedKanbanBoard';

export default OptimizedKanbanBoard;
