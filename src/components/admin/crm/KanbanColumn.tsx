
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CRMPipelineColumn, CRMLead } from '@/types/crm.types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import KanbanLeadCard from './KanbanLeadCard';

interface KanbanColumnProps {
  column: CRMPipelineColumn;
  leads: CRMLead[];
  onOpenDetail?: (lead: CRMLead) => void;
  onAddLead?: (columnId: string) => void;
}

const KanbanColumn = ({ column, leads, onOpenDetail, onAddLead }: KanbanColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <div className="flex flex-col w-80 bg-white rounded-lg border border-gray-200 shadow-sm h-fit max-h-[90vh]">
      <div className="p-4 border-b border-gray-100 bg-gray-50/50 rounded-t-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full flex-shrink-0" 
              style={{ backgroundColor: column.color }}
            />
            <h3 className="font-medium text-gray-900 text-sm truncate">{column.name}</h3>
          </div>
          <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600 px-2 py-1">
            {leads.length}
          </Badge>
        </div>
        
        <Button
          onClick={() => onAddLead?.(column.id)}
          variant="outline"
          size="sm"
          className="w-full h-9 text-sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Lead
        </Button>
      </div>
      
      <div 
        ref={setNodeRef}
        className={`flex-1 p-3 min-h-[400px] max-h-[80vh] overflow-y-auto transition-colors ${
          isOver ? 'bg-blue-50/30' : ''
        }`}
      >
        <SortableContext 
          items={leads.map(lead => lead.id)} 
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {leads.map(lead => (
              <KanbanLeadCard 
                key={lead.id} 
                lead={lead} 
                onOpenDetail={onOpenDetail}
              />
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
