
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CRMPipelineColumn, CRMLead } from '@/types/crm.types';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
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
    <div className="flex flex-col w-80 bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: column.color }}
            />
            <h3 className="font-semibold text-gray-900">{column.name}</h3>
          </div>
          <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
            {leads.length}
          </Badge>
        </div>
      </div>
      
      <div 
        ref={setNodeRef}
        className={`flex-1 p-3 min-h-[500px] transition-colors ${
          isOver ? 'bg-blue-50/50' : ''
        }`}
      >
        <SortableContext 
          items={leads.map(lead => lead.id)} 
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {leads.map(lead => (
              <KanbanLeadCard key={lead.id} lead={lead} />
            ))}
            
            {leads.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                <Plus className="h-8 w-8 mb-2" />
                <p className="text-sm">Nenhum lead nesta coluna</p>
              </div>
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
};

export default KanbanColumn;
