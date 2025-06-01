
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CRMLead, CRMPipelineColumn } from '@/types/crm.types';
import OptimizedKanbanLeadCard from './OptimizedKanbanLeadCard';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
  column: CRMPipelineColumn;
  leads: CRMLead[];
  onOpenDetail: (lead: CRMLead) => void;
  isDragOver?: boolean;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ 
  column, 
  leads, 
  onOpenDetail,
  isDragOver = false 
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <div 
      ref={setNodeRef}
      className={cn(
        "w-80 bg-gray-50 rounded-lg flex flex-col transition-all duration-300 ease-in-out h-full",
        isOver && "bg-blue-50 ring-2 ring-blue-300 ring-opacity-50 shadow-lg",
        isDragOver && "scale-[1.02]"
      )}
    >
      {/* Header da coluna */}
      <div className="flex items-center justify-between p-3 pb-2 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full transition-all duration-200" 
            style={{ 
              backgroundColor: column.color,
              boxShadow: isOver ? `0 0 10px ${column.color}40` : 'none'
            }}
          />
          <h3 className="font-medium text-gray-900">{column.name}</h3>
          <span className={cn(
            "text-sm transition-colors duration-200",
            isOver ? "text-blue-600 font-medium" : "text-gray-500"
          )}>
            ({leads.length})
          </span>
        </div>
      </div>
      
      {/* Área de conteúdo dos leads */}
      <div className="flex-1 min-h-0 px-3 pb-3">
        <SortableContext 
          items={leads.map(lead => lead.id)} 
          strategy={verticalListSortingStrategy}
        >
          <div className={cn(
            "space-y-3 h-full overflow-y-auto transition-all duration-300",
            isOver && "space-y-4"
          )}>
            {leads.map((lead, index) => (
              <div
                key={lead.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <OptimizedKanbanLeadCard
                  lead={lead}
                  onOpenDetail={onOpenDetail}
                />
              </div>
            ))}
            
            {/* Drop zone indicator when dragging over empty column */}
            {isOver && leads.length === 0 && (
              <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center animate-pulse">
                <p className="text-blue-600 font-medium">Solte o lead aqui</p>
              </div>
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
};

export default KanbanColumn;
