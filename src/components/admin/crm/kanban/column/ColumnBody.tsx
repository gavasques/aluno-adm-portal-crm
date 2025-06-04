
import React from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CRMLead } from '@/types/crm.types';
import { DynamicLeadCard } from '../DynamicLeadCard';
import { cn } from '@/lib/utils';

interface ColumnBodyProps {
  leads: CRMLead[];
  isOver: boolean;
  onOpenDetail: (lead: CRMLead) => void;
  columnId: string;
}

export const ColumnBody: React.FC<ColumnBodyProps> = ({
  leads,
  isOver,
  onOpenDetail,
  columnId
}) => {
  // Configurar a zona de drop para a coluna
  const { setNodeRef } = useDroppable({
    id: columnId,
  });

  const handleLeadClick = (lead: CRMLead) => {
    console.log('🔗 [COLUMN_BODY] Click no lead:', {
      id: lead.id,
      name: lead.name,
      column: columnId
    });
    onOpenDetail(lead);
  };

  console.log(`📋 [COLUMN_BODY] ${columnId} renderizando:`, {
    leadsCount: leads.length,
    isOver,
    leads: leads.map(lead => ({
      id: lead.id,
      name: lead.name,
      column_id: lead.column_id
    }))
  });

  return (
    <div 
      ref={setNodeRef}
      className={cn(
        "h-full overflow-y-auto transition-all duration-200 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100",
        isOver && "bg-blue-50 ring-2 ring-blue-300 ring-inset rounded-lg"
      )}
    >
      <SortableContext 
        items={leads.map(lead => lead.id)} 
        strategy={verticalListSortingStrategy}
      >
        <div className={cn(
          "space-y-3 p-2 min-h-20",
          isOver && "space-y-4"
        )}>
          {leads.map((lead) => (
            <div
              key={lead.id}
              className="animate-fade-in"
            >
              <DynamicLeadCard
                lead={lead}
                onClick={() => handleLeadClick(lead)}
              />
            </div>
          ))}
          
          {/* Drop zone indicator quando arrastrando sobre coluna vazia */}
          {isOver && leads.length === 0 && (
            <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center animate-pulse bg-blue-50">
              <p className="text-blue-600 font-medium">Solte o lead aqui</p>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
};
