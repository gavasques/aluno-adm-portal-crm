
import React from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CRMLead } from '@/types/crm.types';
import { DynamicLeadCard } from '../DynamicLeadCard';
import { cn } from '@/lib/utils';

interface ColumnBodyProps {
  leads: CRMLead[];
  isOver: boolean;
  onOpenDetail: (lead: CRMLead) => void;
}

export const ColumnBody: React.FC<ColumnBodyProps> = ({
  leads,
  isOver,
  onOpenDetail
}) => {
  const handleLeadClick = (lead: CRMLead) => {
    console.log('🔗 ColumnBody: Click no lead:', lead.id);
    onOpenDetail(lead);
  };

  return (
    <SortableContext 
      items={leads.map(lead => lead.id)} 
      strategy={verticalListSortingStrategy}
    >
      <div className={cn(
        "space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto transition-all duration-300",
        isOver && "space-y-4"
      )}>
        {leads.map((lead, index) => (
          <div
            key={lead.id}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <DynamicLeadCard
              lead={lead}
              onClick={() => handleLeadClick(lead)}
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
  );
};
