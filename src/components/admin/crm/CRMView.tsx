
import React, { useState } from 'react';
import { DndContext, DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { motion } from 'framer-motion';
import { useCRMLeads } from '@/hooks/crm/useCRMLeads';
import { useCRMPipelines } from '@/hooks/crm/useCRMPipelines';
import { useCRMLeadUpdate } from '@/hooks/crm/useCRMLeadUpdate';
import { CRMLead, CRMFilters, ViewMode } from '@/types/crm.types';
import CRMKanbanBoard from './CRMKanbanBoard';
import CRMListView from './CRMListView';
import CRMStatsCards from './CRMStatsCards';
import CRMFilters from './CRMFilters';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface CRMViewProps {
  onNewLead?: () => void;
  onEditLead?: (lead: CRMLead) => void;
}

const CRMView = ({ onNewLead, onEditLead }: CRMViewProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [filters, setFilters] = useState<CRMFilters>({});
  const [draggedLead, setDraggedLead] = useState<CRMLead | null>(null);

  const { leads, loading: leadsLoading } = useCRMLeads(filters);
  const { columns, loading: columnsLoading } = useCRMPipelines();
  const { moveToColumn } = useCRMLeadUpdate();

  const loading = leadsLoading || columnsLoading;

  const handleDragStart = (event: DragStartEvent) => {
    const lead = leads.find(l => l.id === event.active.id);
    setDraggedLead(lead || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    // Lógica para hover visual durante drag
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setDraggedLead(null);

    if (!over || !draggedLead) return;

    const newColumnId = over.id as string;
    const oldColumnId = draggedLead.column_id;

    if (newColumnId !== oldColumnId) {
      try {
        await moveToColumn(draggedLead.id, newColumnId);
        
        const newColumn = columns.find(c => c.id === newColumnId);
        const oldColumn = columns.find(c => c.id === oldColumnId);
        
        toast.success(
          `Lead "${draggedLead.name}" movido para "${newColumn?.name || 'Nova coluna'}"`
        );
      } catch (error) {
        toast.error('Erro ao mover lead');
      }
    }
  };

  const handleFiltersChange = (newFilters: CRMFilters) => {
    setFilters(newFilters);
  };

  const getLeadsByColumn = (columnId: string) => {
    return leads.filter(lead => lead.column_id === columnId);
  };

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.column?.name?.toLowerCase().includes('novo')).length,
    qualified: leads.filter(l => l.ready_to_invest_3k).length,
    converted: leads.filter(l => l.column?.name?.toLowerCase().includes('convertido')).length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <CRMStatsCards stats={stats} />

      {/* Filters and View Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex-1">
          <CRMFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'kanban' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('kanban')}
          >
            <LayoutGrid className="h-4 w-4 mr-2" />
            Kanban
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4 mr-2" />
            Lista
          </Button>
          <Button onClick={onNewLead}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Lead
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <motion.div
        key={viewMode}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {viewMode === 'kanban' ? (
          <DndContext
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <CRMKanbanBoard
              leads={leads}
              columns={columns}
              onOpenDetail={onEditLead}
              onAddLead={(columnId) => {
                setFilters(prev => ({ ...prev, column_id: columnId }));
                onNewLead?.();
              }}
              getLeadsByColumn={getLeadsByColumn}
            />
          </DndContext>
        ) : (
          <CRMListView
            filters={filters}
            onEditLead={onEditLead}
          />
        )}
      </motion.div>
    </div>
  );
};

export default CRMView;
