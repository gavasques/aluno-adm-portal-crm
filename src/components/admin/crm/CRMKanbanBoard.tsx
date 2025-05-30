
import React, { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { CRMFilters } from '@/types/crm.types';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';
import { useCRMLeads } from '@/hooks/crm/useCRMLeads';
import KanbanColumn from './KanbanColumn';
import KanbanLeadCard from './KanbanLeadCard';
import LeadDetailModal from './LeadDetailModal';
import CRMLeadFormDialog from './CRMLeadFormDialog';

interface CRMKanbanBoardProps {
  filters: CRMFilters;
  pipelineId: string;
}

const CRMKanbanBoard = ({ filters, pipelineId }: CRMKanbanBoardProps) => {
  const { columns, loading: columnsLoading } = useCRMPipelines();
  const { leads, loading: leadsLoading, moveLeadToColumn, fetchLeads } = useCRMLeads(filters);
  const [activeLead, setActiveLead] = React.useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState<string>('');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  // Filtrar colunas do pipeline atual
  const pipelineColumns = columns.filter(col => col.pipeline_id === pipelineId);

  // Agrupar leads por coluna
  const leadsByColumn = React.useMemo(() => {
    const grouped = {};
    pipelineColumns.forEach(column => {
      grouped[column.id] = leads.filter(lead => lead.column_id === column.id);
    });
    return grouped;
  }, [leads, pipelineColumns]);

  const handleDragStart = (event) => {
    const leadId = event.active.id;
    const lead = leads.find(l => l.id === leadId);
    setActiveLead(lead);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveLead(null);

    if (!over) return;

    const leadId = active.id as string;
    const newColumnId = over.id as string;

    // Verificar se o lead foi movido para uma coluna diferente
    const lead = leads.find(l => l.id === leadId);
    if (lead && lead.column_id !== newColumnId) {
      await moveLeadToColumn(leadId, newColumnId);
    }
  };

  const handleOpenDetail = (lead) => {
    setSelectedLead(lead);
    setShowDetailModal(true);
  };

  const handleAddLead = (columnId: string) => {
    setSelectedColumnId(columnId);
    setShowCreateModal(true);
  };

  const handleLeadUpdate = () => {
    fetchLeads();
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    setSelectedColumnId('');
    fetchLeads();
  };

  if (columnsLoading || leadsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
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
          <div className="flex gap-3 min-w-max h-full px-2">
            <SortableContext 
              items={pipelineColumns.map(col => col.id)} 
              strategy={horizontalListSortingStrategy}
            >
              {pipelineColumns
                .sort((a, b) => a.sort_order - b.sort_order)
                .map(column => (
                  <KanbanColumn
                    key={column.id}
                    column={column}
                    leads={leadsByColumn[column.id] || []}
                    onOpenDetail={handleOpenDetail}
                    onAddLead={handleAddLead}
                  />
                ))}
            </SortableContext>
          </div>
        </div>

        <DragOverlay>
          {activeLead ? <KanbanLeadCard lead={activeLead} /> : null}
        </DragOverlay>
      </DndContext>

      <LeadDetailModal
        lead={selectedLead}
        open={showDetailModal}
        onOpenChange={setShowDetailModal}
        onLeadUpdate={handleLeadUpdate}
      />

      <CRMLeadFormDialog
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        pipelineId={pipelineId}
        initialColumnId={selectedColumnId}
        onSuccess={handleCreateSuccess}
      />
    </>
  );
};

export default CRMKanbanBoard;
