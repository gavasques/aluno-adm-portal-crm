
import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, TouchSensor, useSensor, useSensors, DragOverEvent } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import { CRMFilters, CRMLead } from '@/types/crm.types';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';
import { useCRMData } from '@/hooks/crm/useCRMData';
import { DesignCard } from '@/design-system';
import KanbanColumn from './KanbanColumn';
import OptimizedKanbanLeadCard from './OptimizedKanbanLeadCard';
import { KanbanSkeleton } from './LoadingSkeleton';
import CRMLeadFormDialog from './CRMLeadFormDialog';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface OptimizedKanbanBoardProps {
  filters: CRMFilters;
  pipelineId: string;
}

const OptimizedKanbanBoard = React.memo(({ filters, pipelineId }: OptimizedKanbanBoardProps) => {
  const navigate = useNavigate();
  const { columns, loading: columnsLoading } = useCRMPipelines();
  const { leadsByColumn, loading: leadsLoading, moveLeadToColumn, refetch } = useCRMData(filters);
  const [activeLead, setActiveLead] = useState<CRMLead | null>(null);
  const [activeColumnId, setActiveColumnId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState<string>('');

  console.log('🎯 Kanban Debug - Pipeline ID:', pipelineId);
  console.log('🎯 Kanban Debug - Columns:', columns);
  console.log('🎯 Kanban Debug - Leads by Column:', leadsByColumn);
  console.log('🎯 Kanban Debug - Loading states:', { columnsLoading, leadsLoading });

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
    const filtered = columns
      .filter(col => col.pipeline_id === pipelineId)
      .sort((a, b) => a.sort_order - b.sort_order);
    
    console.log('🔍 Filtered columns for pipeline:', pipelineId, filtered);
    return filtered;
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
  }, [refetch]);

  const loading = columnsLoading || leadsLoading;

  if (!pipelineId) {
    return (
      <DesignCard 
        variant="glass" 
        size="lg" 
        className="h-full border-white/20 bg-white/30 dark:bg-black/10 backdrop-blur-md flex items-center justify-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-slate-600 dark:text-slate-300 font-medium">
            Selecione um pipeline para visualizar os leads.
          </p>
        </motion.div>
      </DesignCard>
    );
  }

  if (loading) {
    return <KanbanSkeleton />;
  }

  if (pipelineColumns.length === 0) {
    return (
      <DesignCard 
        variant="glass" 
        size="lg" 
        className="h-full border-white/20 bg-white/30 dark:bg-black/10 backdrop-blur-md flex items-center justify-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-slate-600 dark:text-slate-300 font-medium">
            Nenhuma coluna encontrada para este pipeline.
          </p>
          <p className="text-sm text-slate-400 mt-2">
            Configure as colunas nas configurações do pipeline.
          </p>
        </motion.div>
      </DesignCard>
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
        <DesignCard 
          variant="glass" 
          size="md" 
          className="w-full h-full border-white/20 bg-white/20 dark:bg-black/5 backdrop-blur-md overflow-hidden"
        >
          <div className="w-full h-full overflow-x-auto overflow-y-hidden">
            <motion.div 
              className={cn(
                "flex gap-6 min-w-max h-full transition-all duration-300 p-4",
                activeLead && "pointer-events-none"
              )}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {pipelineColumns.map((column, index) => {
                const columnLeads = leadsByColumn[column.id] || [];
                const isDragOver = activeColumnId === column.id;
                
                console.log(`📋 Column ${column.name} has ${columnLeads.length} leads:`, columnLeads);
                
                return (
                  <motion.div
                    key={column.id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      delay: index * 0.1, 
                      duration: 0.4,
                      ease: "easeOut"
                    }}
                  >
                    <KanbanColumn
                      column={column}
                      leads={columnLeads}
                      onOpenDetail={handleOpenDetail}
                      isDragOver={isDragOver}
                    />
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </DesignCard>

        <DragOverlay>
          {activeLead ? (
            <motion.div 
              className="transform rotate-6 scale-110"
              initial={{ scale: 1, rotate: 0 }}
              animate={{ scale: 1.1, rotate: 6 }}
              transition={{ duration: 0.2 }}
            >
              <OptimizedKanbanLeadCard 
                lead={activeLead} 
                onOpenDetail={handleOpenDetail} 
              />
            </motion.div>
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
