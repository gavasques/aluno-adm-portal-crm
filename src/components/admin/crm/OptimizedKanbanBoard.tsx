import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DndContext, DragEndEvent, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { CRMFilters, CRMLead } from '@/types/crm.types';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';
import { useCRMLeadsWithContacts } from '@/hooks/crm/useCRMLeadsWithContacts';
import { useCRMLeads } from '@/hooks/crm/useCRMLeads';
import OptimizedKanbanLeadCard from './OptimizedKanbanLeadCard';
import { KanbanSkeleton } from './LoadingSkeleton';
import CRMLeadFormDialog from './CRMLeadFormDialog';

interface OptimizedKanbanBoardProps {
  filters: CRMFilters;
  pipelineId: string;
}

const OptimizedKanbanBoard = ({ filters, pipelineId }: OptimizedKanbanBoardProps) => {
  const navigate = useNavigate();
  const { columns, loading: columnsLoading } = useCRMPipelines();
  const { leadsWithContacts, loading: leadsLoading, fetchLeadsWithContacts } = useCRMLeadsWithContacts(filters);
  const { moveLeadToColumn } = useCRMLeads(filters);
  const [activeLead, setActiveLead] = React.useState<CRMLead | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState<string>('');

  console.log('🎯 OptimizedKanbanBoard render - pipelineId:', pipelineId, 'filters:', filters);
  console.log('📊 Loading states - columns:', columnsLoading, 'leads:', leadsLoading);
  console.log('📋 Data - columns:', columns.length, 'leads:', leadsWithContacts.length);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  // GUARD: Não renderizar sem pipelineId
  if (!pipelineId) {
    console.log('⚠️ No pipelineId provided to OptimizedKanbanBoard');
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Selecione um pipeline para visualizar os leads.</p>
      </div>
    );
  }

  const loading = columnsLoading || leadsLoading;
  console.log('⏳ Combined loading state:', loading);

  // Filtrar colunas do pipeline atual
  const pipelineColumns = React.useMemo(() => {
    const filtered = columns.filter(col => col.pipeline_id === pipelineId);
    console.log('🏗️ Pipeline columns filtered:', filtered.length, 'for pipeline:', pipelineId);
    return filtered;
  }, [columns, pipelineId]);

  // Agrupar leads por coluna
  const leadsByColumn = React.useMemo(() => {
    console.log('🔗 Grouping leads by column...');
    const grouped: Record<string, typeof leadsWithContacts> = {};
    
    pipelineColumns.forEach(column => {
      grouped[column.id] = leadsWithContacts.filter(lead => lead.column_id === column.id);
      console.log(`📋 Column "${column.name}":`, grouped[column.id].length, 'leads');
    });
    
    return grouped;
  }, [leadsWithContacts, pipelineColumns]);

  const handleDragStart = (event: any) => {
    const leadId = event.active.id;
    const lead = leadsWithContacts.find(l => l.id === leadId);
    console.log('🖱️ Drag started for lead:', leadId, lead?.name);
    setActiveLead(lead || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveLead(null);

    if (!over) {
      console.log('🖱️ Drag ended without valid drop target');
      return;
    }

    const leadId = active.id as string;
    const newColumnId = over.id as string;

    console.log('🖱️ Drag ended - moving lead:', leadId, 'to column:', newColumnId);

    // Verificar se o lead foi movido para uma coluna diferente
    const lead = leadsWithContacts.find(l => l.id === leadId);
    if (lead && lead.column_id !== newColumnId) {
      try {
        console.log('📤 Moving lead to new column...');
        await moveLeadToColumn(leadId, newColumnId);
        // Recarregar dados após mover
        await fetchLeadsWithContacts();
        console.log('✅ Lead moved successfully');
      } catch (error) {
        console.error('❌ Error moving lead:', error);
      }
    } else {
      console.log('ℹ️ Lead not moved - same column or lead not found');
    }
  };

  const handleOpenDetail = (lead: CRMLead) => {
    console.log('👁️ Opening lead detail:', lead.id, lead.name);
    navigate(`/admin/crm/lead/${lead.id}`);
  };

  const handleAddLead = (columnId: string) => {
    console.log('➕ Adding new lead to column:', columnId);
    setSelectedColumnId(columnId);
    setShowCreateModal(true);
  };

  const handleCreateSuccess = () => {
    console.log('✅ Lead created successfully');
    setShowCreateModal(false);
    setSelectedColumnId('');
    fetchLeadsWithContacts();
  };

  if (loading) {
    console.log('⏳ Showing loading skeleton');
    return <KanbanSkeleton />;
  }

  if (pipelineColumns.length === 0) {
    console.log('📭 No columns found for pipeline');
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Nenhuma coluna encontrada para este pipeline.</p>
        <p className="text-sm text-gray-400 mt-2">Configure as colunas nas configurações do pipeline.</p>
      </div>
    );
  }

  console.log('🎨 Rendering Kanban board with', pipelineColumns.length, 'columns');

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
              {pipelineColumns
                .sort((a, b) => a.sort_order - b.sort_order)
                .map(column => {
                  const columnLeads = leadsByColumn[column.id] || [];
                  console.log(`🏗️ Rendering column "${column.name}" with ${columnLeads.length} leads`);
                  
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
                        {columnLeads.map(lead => {
                          console.log(`🃏 Rendering lead card: ${lead.name} (${lead.id})`);
                          return (
                            <OptimizedKanbanLeadCard
                              key={lead.id}
                              lead={lead}
                              onOpenDetail={handleOpenDetail}
                            />
                          );
                        })}
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
};

export default OptimizedKanbanBoard;
