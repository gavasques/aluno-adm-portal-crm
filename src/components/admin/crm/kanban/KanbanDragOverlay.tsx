
import React from 'react';
import { DragOverlay } from '@dnd-kit/core';
import { CRMLead } from '@/types/crm.types';
import OptimizedKanbanLeadCard from '../OptimizedKanbanLeadCard';

interface KanbanDragOverlayProps {
  activeLead: CRMLead | null;
}

export const KanbanDragOverlay: React.FC<KanbanDragOverlayProps> = ({ activeLead }) => {
  return (
    <DragOverlay>
      {activeLead ? (
        <div className="transform rotate-6 scale-110 transition-transform duration-200 opacity-90">
          <OptimizedKanbanLeadCard 
            lead={activeLead} 
            onClick={() => {}} // Desabilitar durante drag
          />
        </div>
      ) : null}
    </DragOverlay>
  );
};
