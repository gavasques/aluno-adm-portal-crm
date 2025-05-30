
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CRMPipelineColumn, CRMLead } from '@/types/crm.types';
import KanbanLeadCard from './KanbanLeadCard';

interface KanbanColumnProps {
  column: CRMPipelineColumn;
  leads: CRMLead[];
}

const KanbanColumn = ({ column, leads }: KanbanColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <div className="flex flex-col w-80 bg-gray-50 rounded-lg">
      <div 
        className="p-4 border-b"
        style={{ backgroundColor: column.color }}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-white">{column.name}</h3>
          <span className="bg-white text-gray-800 px-2 py-1 rounded-full text-sm font-medium">
            {leads.length}
          </span>
        </div>
      </div>
      
      <div 
        ref={setNodeRef}
        className={`flex-1 p-3 min-h-[500px] ${isOver ? 'bg-blue-50' : ''}`}
      >
        <SortableContext 
          items={leads.map(lead => lead.id)} 
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {leads.map(lead => (
              <KanbanLeadCard key={lead.id} lead={lead} />
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  );
};

export default KanbanColumn;
