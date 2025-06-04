
import React, { useMemo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CRMPipelineColumn, LeadWithContacts } from '@/types/crm.types';
import { FastLeadCard } from './FastLeadCard';

interface FastKanbanColumnProps {
  column: CRMPipelineColumn;
  leads: LeadWithContacts[];
  onLeadClick: (lead: LeadWithContacts) => void;
  onCreateLead: () => void;
  isDragging: boolean;
  isMoving: boolean;
}

export const FastKanbanColumn: React.FC<FastKanbanColumnProps> = React.memo(({
  column,
  leads,
  onLeadClick,
  onCreateLead,
  isDragging,
  isMoving
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const leadsCount = leads.length;

  // Memoizar cards para evitar re-renders desnecessários
  const leadCards = useMemo(() => {
    return leads.map((lead) => (
      <FastLeadCard
        key={lead.id}
        lead={lead}
        onClick={() => onLeadClick(lead)}
        disabled={isMoving}
      />
    ));
  }, [leads, onLeadClick, isMoving]);

  return (
    <div className="flex flex-col w-80 h-full bg-gray-50 rounded-lg">
      {/* Header da coluna */}
      <div className="flex-none p-3 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: column.color || '#6b7280' }}
            />
            <h3 className="font-medium text-gray-900 truncate">
              {column.name}
            </h3>
          </div>
          <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
            {leadsCount}
          </span>
        </div>
        
        <Button
          size="sm"
          variant="outline"
          onClick={onCreateLead}
          disabled={isMoving}
          className="w-full h-8"
        >
          <Plus className="h-3 w-3 mr-1" />
          Novo Lead
        </Button>
      </div>

      {/* Área de drop e lista de leads */}
      <div 
        ref={setNodeRef}
        className={`flex-1 overflow-y-auto p-3 space-y-2 ${
          isOver ? 'bg-blue-50' : ''
        }`}
      >
        {leadCards}
        
        {leadsCount === 0 && (
          <div className="text-center text-gray-500 py-8">
            <p className="text-sm">Nenhum lead neste estágio</p>
          </div>
        )}
      </div>
    </div>
  );
});

FastKanbanColumn.displayName = 'FastKanbanColumn';
